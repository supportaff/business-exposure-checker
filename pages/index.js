import { useState, useEffect } from 'react';
import axios from 'axios';
import Head from 'next/head';

const TYPING_TEXTS = [
  'yourbusiness.com',
  'myshop.in',
  'clinicname.com',
  'startup.io',
];

export default function Home() {
  const [domain, setDomain] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [userInfo, setUserInfo] = useState({ name: '', email: '', phone: '' });
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [placeholder, setPlaceholder] = useState(TYPING_TEXTS[0]);
  const [scanLog, setScanLog] = useState([]);

  // Rotate placeholder
  useEffect(() => {
    let i = 0;
    const t = setInterval(() => {
      i = (i + 1) % TYPING_TEXTS.length;
      setPlaceholder(TYPING_TEXTS[i]);
    }, 2500);
    return () => clearInterval(t);
  }, []);

  const addLog = (msg) => setScanLog(prev => [...prev, msg]);

  const handleScan = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);
    setShowPaymentForm(false);
    setScanLog([]);

    addLog(`> Initiating scan for ${domain}...`);
    setTimeout(() => addLog('> Resolving DNS...'), 400);
    setTimeout(() => addLog('> Querying Shodan intelligence database...'), 900);
    setTimeout(() => addLog('> Analyzing open ports & services...'), 1500);
    setTimeout(() => addLog('> Calculating risk score...'), 2100);

    try {
      const res = await axios.post('/api/scan', { domain });
      addLog(`> Scan complete. Risk grade: ${res.data.grade}`);
      setResult(res.data);
    } catch (err) {
      addLog('> ERROR: Scan failed.');
      setError(err.response?.data?.error || 'Scan failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    setPaymentLoading(true);
    try {
      const res = await axios.post('/api/initiate-payment', {
        ...userInfo,
        domain,
        ip: result.ip,
      });
      const { formData, payuUrl } = res.data;
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = payuUrl;
      Object.entries(formData).forEach(([k, v]) => {
        const input = document.createElement('input');
        input.type = 'hidden'; input.name = k; input.value = v;
        form.appendChild(input);
      });
      document.body.appendChild(form);
      form.submit();
    } catch (err) {
      setError('Payment initiation failed. Please try again.');
    } finally {
      setPaymentLoading(false);
    }
  };

  const getScoreStyle = (grade) => {
    if (grade === 'A') return { border: '#00ff41', color: '#00ff41', glow: 'rgba(0,255,65,0.4)' };
    if (grade === 'B') return { border: '#aaff00', color: '#aaff00', glow: 'rgba(170,255,0,0.4)' };
    if (grade === 'C') return { border: '#ffb800', color: '#ffb800', glow: 'rgba(255,184,0,0.4)' };
    if (grade === 'D') return { border: '#ff6600', color: '#ff6600', glow: 'rgba(255,102,0,0.4)' };
    return { border: '#ff3232', color: '#ff3232', glow: 'rgba(255,50,50,0.4)' };
  };

  return (
    <>
      <Head>
        <title>ScanSentry — Business Exposure Checker</title>
        <meta name="description" content="Check if your business domain is exposed to hackers — powered by Shodan" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link href="https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Orbitron:wght@400;700;900&display=swap" rel="stylesheet" />
      </Head>

      <main className="min-h-screen grid-bg text-white flex flex-col items-center justify-start pt-12 pb-20 px-4">
        <div className="w-full max-w-2xl">

          {/* NAV */}
          <div className="flex items-center justify-between mb-12">
            <div className="flex items-center gap-2">
              <span className="pulse-dot"></span>
              <span className="glow-text-sm text-sm tracking-widest uppercase" style={{fontFamily:'Orbitron,monospace'}}>ScanSentry</span>
            </div>
            <span className="text-xs" style={{color:'rgba(0,255,65,0.4)'}}>Powered by Shodan™</span>
          </div>

          {/* HERO */}
          <div className="text-center mb-10">
            <div className="inline-block mb-4 px-3 py-1 rounded text-xs tracking-widest uppercase" style={{border:'1px solid rgba(0,255,65,0.3)', color:'rgba(0,255,65,0.7)', background:'rgba(0,255,65,0.05)'}}>
              Free Infrastructure Intelligence
            </div>
            <h1 className="text-4xl md:text-5xl font-black mb-4 leading-tight cursor" style={{fontFamily:'Orbitron,monospace', color:'#00ff41', textShadow:'0 0 20px rgba(0,255,65,0.5), 0 0 60px rgba(0,255,65,0.2)'}}>
              IS YOUR BUSINESS<br />EXPOSED?
            </h1>
            <p style={{color:'rgba(0,255,65,0.55)', fontFamily:'Share Tech Mono,monospace'}} className="text-sm md:text-base">
              Enter your domain below. See exactly what hackers see — for free.
            </p>
          </div>

          {/* SCAN FORM */}
          <form onSubmit={handleScan} className="mb-8">
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs" style={{color:'rgba(0,255,65,0.5)'}}>~/&gt;</span>
                <input
                  type="text"
                  placeholder={placeholder}
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  required
                  className="input-green w-full pl-10 pr-4 py-4 rounded-lg text-sm"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="btn-green px-6 py-4 rounded-lg text-sm"
              >
                <span>{loading ? 'SCANNING...' : 'SCAN NOW'}</span>
              </button>
            </div>
          </form>

          {/* SCAN LOG TERMINAL */}
          {scanLog.length > 0 && (
            <div className="glow-card p-4 mb-6 relative overflow-hidden">
              {loading && <div className="scan-line"></div>}
              <p className="text-xs mb-2 tracking-widest uppercase" style={{color:'rgba(0,255,65,0.4)'}}>// terminal output</p>
              {scanLog.map((log, i) => (
                <p key={i} className="text-xs mb-1" style={{color: log.includes('ERROR') ? '#ff6060' : log.includes('complete') ? '#00ff41' : 'rgba(0,255,65,0.6)'}}>{log}</p>
              ))}
              {loading && <p className="text-xs" style={{color:'rgba(0,255,65,0.4)'}}>{'>'} <span className="animate-pulse">■■■</span></p>}
            </div>
          )}

          {/* ERROR */}
          {error && (
            <div className="mb-6 px-4 py-3 rounded-lg text-sm" style={{background:'rgba(255,50,50,0.08)', border:'1px solid rgba(255,50,50,0.3)', color:'#ff6060'}}>
              ⚠ {error}
            </div>
          )}

          {/* RESULT CARD */}
          {result && (() => {
            const s = getScoreStyle(result.grade);
            return (
              <div className="glow-card p-6 mb-6">

                {/* Score + Info Row */}
                <div className="flex items-center justify-between mb-6">
                  <div className="space-y-1">
                    <p className="text-xs tracking-widest uppercase" style={{color:'rgba(0,255,65,0.4)'}}>// target info</p>
                    <p className="text-sm"><span style={{color:'rgba(0,255,65,0.5)'}}>domain</span> <span className="glow-text-sm">{result.domain}</span></p>
                    <p className="text-sm"><span style={{color:'rgba(0,255,65,0.5)'}}>ip</span>{'     '}<span className="glow-text-sm">{result.ip}</span></p>
                    {result.org && <p className="text-sm"><span style={{color:'rgba(0,255,65,0.5)'}}>org</span>{'    '}<span style={{color:'#ccc'}}>{result.org}</span></p>}
                  </div>
                  <div
                    className="score-ring"
                    style={{
                      borderColor: s.border,
                      boxShadow: `0 0 20px ${s.glow}, inset 0 0 20px ${s.glow.replace('0.4','0.05')}`,
                    }}
                  >
                    <span className="text-5xl font-black" style={{color: s.color, textShadow:`0 0 20px ${s.glow}`, fontFamily:'Orbitron,monospace'}}>{result.grade}</span>
                    <span className="text-xs" style={{color:'rgba(255,255,255,0.4)'}}>{result.score}/100</span>
                  </div>
                </div>

                {/* Open Ports */}
                <div className="mb-5">
                  <p className="text-xs tracking-widest uppercase mb-2" style={{color:'rgba(0,255,65,0.4)'}}>// open ports</p>
                  <div className="flex flex-wrap gap-2">
                    {result.openPorts.slice(0, 6).map(port => (
                      <span key={port} className="px-3 py-1 rounded text-xs font-mono" style={{background:'rgba(0,255,65,0.07)', border:'1px solid rgba(0,255,65,0.2)', color:'#00ff41'}}>{port}</span>
                    ))}
                    {result.openPorts.length > 6 && (
                      <span className="px-3 py-1 rounded text-xs" style={{background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.1)', color:'rgba(255,255,255,0.4)'}}>+{result.openPorts.length - 6} more</span>
                    )}
                  </div>
                </div>

                {/* Risks */}
                {result.risks.length > 0 && (
                  <div className="mb-5">
                    <p className="text-xs tracking-widest uppercase mb-2" style={{color:'rgba(0,255,65,0.4)'}}>// vulnerabilities detected</p>
                    {result.risks.slice(0, 2).map((risk, i) => (
                      <div key={i} className={`flex items-start gap-3 px-3 py-2 rounded mb-2 text-xs badge-${risk.level}`}>
                        <span className="font-bold uppercase mt-0.5">[{risk.level}]</span>
                        <span>{risk.message}</span>
                      </div>
                    ))}
                    {result.risks.length > 2 && (
                      <p className="text-xs" style={{color:'rgba(255,255,255,0.3)'}}>+ {result.risks.length - 2} more vulnerabilities locked in full report</p>
                    )}
                  </div>
                )}

                {/* CTA */}
                <div className="pt-5" style={{borderTop:'1px solid rgba(0,255,65,0.1)'}}>
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-bold glow-text-sm">FULL PDF SECURITY REPORT</p>
                    <span className="text-lg font-black" style={{color:'#00ff41', fontFamily:'Orbitron,monospace'}}>₹199</span>
                  </div>
                  <div className="grid grid-cols-2 gap-1 mb-4">
                    {[
                      'All open ports + risk classification',
                      'Full vulnerability details',
                      'SSL/TLS certificate analysis',
                      'Tech stack fingerprint',
                      'Step-by-step remediation guide',
                      'Delivered on WhatsApp + Email',
                    ].map((f, i) => (
                      <p key={i} className="text-xs" style={{color:'rgba(0,255,65,0.6)'}}>▸ {f}</p>
                    ))}
                  </div>
                  <button
                    onClick={() => setShowPaymentForm(v => !v)}
                    className="btn-green w-full py-4 rounded-lg text-sm"
                  >
                    <span>GET FULL REPORT — ₹199</span>
                  </button>
                </div>
              </div>
            );
          })()}

          {/* PAYMENT FORM */}
          {showPaymentForm && (
            <div className="glow-card p-6 mb-6">
              <p className="text-xs tracking-widest uppercase mb-4" style={{color:'rgba(0,255,65,0.4)'}}>// enter your details</p>
              <form onSubmit={handlePayment} className="space-y-3">
                {[['text','Your Name','name'],['email','Email Address','email'],['tel','Phone Number (10 digits)','phone']].map(([type, ph, field]) => (
                  <input
                    key={field}
                    type={type}
                    placeholder={ph}
                    required
                    value={userInfo[field]}
                    onChange={e => setUserInfo({...userInfo, [field]: e.target.value})}
                    className="input-green w-full px-4 py-3 rounded-lg text-sm"
                  />
                ))}
                <button
                  type="submit"
                  disabled={paymentLoading}
                  className="btn-green w-full py-4 rounded-lg text-sm mt-2"
                >
                  <span>{paymentLoading ? 'REDIRECTING TO PAYU...' : 'PAY ₹199 & GET REPORT'}</span>
                </button>
              </form>
            </div>
          )}

          {/* TRUST BADGES */}
          {!result && (
            <div className="mt-10 grid grid-cols-3 gap-4">
              {[
                ['🛡️', 'No Data Stored', 'We never save your scan data'],
                ['⚡', 'Instant Results', 'Powered by Shodan global index'],
                ['🔒', 'Secure Payment', 'PayU encrypted checkout'],
              ].map(([icon, title, desc]) => (
                <div key={title} className="text-center p-4 rounded-lg" style={{background:'rgba(0,255,65,0.03)', border:'1px solid rgba(0,255,65,0.1)'}}>
                  <p className="text-2xl mb-2">{icon}</p>
                  <p className="text-xs font-bold glow-text-sm mb-1">{title}</p>
                  <p className="text-xs" style={{color:'rgba(255,255,255,0.3)'}}>{desc}</p>
                </div>
              ))}
            </div>
          )}

          {/* FOOTER */}
          <div className="mt-14 text-center">
            <p className="text-xs" style={{color:'rgba(0,255,65,0.2)'}}>// ScanSentry v1.0 — Ethical use only. For authorized domains only.</p>
          </div>

        </div>
      </main>
    </>
  );
}
