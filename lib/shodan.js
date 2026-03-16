import axios from 'axios';
import dns from 'dns';
import { promisify } from 'util';

const resolve4 = promisify(dns.resolve4);

export async function resolveIP(domain) {
  try {
    // strip protocol if present
    const cleaned = domain.replace(/^https?:\/\//, '').replace(/\/.*$/, '');
    const addresses = await resolve4(cleaned);
    return addresses[0];
  } catch (e) {
    throw new Error('Could not resolve domain to an IP address.');
  }
}

export async function getShodanHostInfo(ip) {
  const apiKey = process.env.SHODAN_API_KEY;
  if (!apiKey) throw new Error('Shodan API key not configured.');

  const url = `https://api.shodan.io/shodan/host/${ip}?key=${apiKey}`;
  const response = await axios.get(url);
  return response.data;
}

export function calculateRiskScore(hostData) {
  let score = 100;
  const risks = [];

  const dangerousPorts = {
    3389: { label: 'RDP (Remote Desktop) is open', deduction: 30 },
    23:   { label: 'Telnet is open (unencrypted)', deduction: 25 },
    21:   { label: 'FTP is open (unencrypted)', deduction: 20 },
    27017:{ label: 'MongoDB is publicly exposed', deduction: 35 },
    6379: { label: 'Redis is publicly exposed', deduction: 35 },
    9200: { label: 'Elasticsearch is publicly exposed', deduction: 35 },
    445:  { label: 'SMB/Windows Sharing is open', deduction: 25 },
    3306: { label: 'MySQL is publicly exposed', deduction: 30 },
  };

  const openPorts = hostData.ports || [];

  for (const [port, info] of Object.entries(dangerousPorts)) {
    if (openPorts.includes(parseInt(port))) {
      score -= info.deduction;
      risks.push({ level: 'critical', message: info.label, port: parseInt(port) });
    }
  }

  // SSL check
  const hasSSL = hostData.data?.some(d => d.transport === 'tcp' && d.ssl);
  if (!hasSSL) {
    score -= 10;
    risks.push({ level: 'medium', message: 'No SSL/TLS detected on any service', port: null });
  }

  // OS/version exposure
  if (hostData.os) {
    score -= 5;
    risks.push({ level: 'low', message: `Operating system fingerprinted: ${hostData.os}`, port: null });
  }

  score = Math.max(0, score);

  let grade;
  if (score >= 80) grade = 'A';
  else if (score >= 60) grade = 'B';
  else if (score >= 40) grade = 'C';
  else if (score >= 20) grade = 'D';
  else grade = 'F';

  return { score, grade, risks, openPorts };
}
