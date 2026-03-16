import { resolveIP, getShodanHostInfo, calculateRiskScore } from '../../lib/shodan';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { domain } = req.body;
  if (!domain) return res.status(400).json({ error: 'Domain is required' });

  try {
    const ip = await resolveIP(domain);
    const hostData = await getShodanHostInfo(ip);
    const { score, grade, risks, openPorts } = calculateRiskScore(hostData);

    return res.status(200).json({
      domain,
      ip,
      org: hostData.org || null,
      score,
      grade,
      risks,          // all risks returned; frontend shows only top 2
      openPorts,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message || 'Scan failed' });
  }
}
