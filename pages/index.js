import { useState } from 'react';
import axios from 'axios';
import Head from 'next/head';

export default function Home() {
  const [domain, setDomain] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [userInfo, setUserInfo] = useState({ name: '', email: '', phone: '' });
  const [showPaymentForm, setShowPaymentForm] = useState(false);

  const handleScan = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);
    setShowPaymentForm(false);
    try {
      const res = await axios.post('/api/scan', { domain });
      setResult(res.data);
    } catch (err) {
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
        input.type = 'hidden';
        input.name = k;
        input.value = v;
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

  const getRiskColor = (grade) => {
    const colors = { A: 'text-green-500', B: 'text-yellow-400', C: 'text-orange-400', D: 'text-red-400', F: 'text-red-600' };
    return colors[grade] || 'text-gray-400';
  };

  const getLevelBadge = (level) => {
    const badges = {
      critical: 'bg-red-100 text-red-700 border border-red-300',
      medium: 'bg-yellow-100 text-yellow-700 border border-yellow-300',
      low: 'bg-blue-100 text-blue-700 border border-blue-300',
    };
    return badges[level] || '';
  };

  return (
    <>
      <Head>
        <title>Business Exposure Checker</title>
        <meta name="description" content="Check if your business domain is exposed to the internet" />
      </Head>

      <main className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-start py-16 px-4">
        <div className="w-full max-w-2xl">
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold mb-3">🔍 Is Your Business Exposed?</h1>
            <p className="text-gray-400 text-lg">Enter your domain to see what hackers can see about your infrastructure — for free.</p>
          </div>

          {/* Scan Form */}
          <form onSubmit={handleScan} className="flex gap-3 mb-8">
            <input
              type="text"
              placeholder="Enter your domain (e.g. yourbusiness.com)"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              required
              className="flex-1 px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition disabled:opacity-50"
            >
              {loading ? 'Scanning...' : 'Scan Now'}
            </button>
          </form>

          {error && (
            <div className="bg-red-900 border border-red-600 text-red-200 px-4 py-3 rounded-lg mb-6">{error}</div>
          )}

          {/* Free Result */}
          {result && (
            <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-gray-400 text-sm">Domain: <span className="text-white font-medium">{result.domain}</span></p>
                  <p className="text-gray-400 text-sm">IP Address: <span className="text-white font-medium">{result.ip}</span></p>
                  {result.org && <p className="text-gray-400 text-sm">Organization: <span className="text-white font-medium">{result.org}</span></p>}
                </div>
                <div className="text-center">
                  <p className="text-gray-400 text-sm mb-1">Risk Grade</p>
                  <p className={`text-6xl font-black ${getRiskColor(result.grade)}`}>{result.grade}</p>
                  <p className="text-gray-400 text-sm">Score: {result.score}/100</p>
                </div>
              </div>

              {/* Open Ports Preview */}
              <div className="mb-4">
                <p className="text-gray-300 font-medium mb-2">Open Ports Detected:</p>
                <div className="flex flex-wrap gap-2">
                  {result.openPorts.slice(0, 5).map(port => (
                    <span key={port} className="px-3 py-1 bg-gray-800 border border-gray-600 rounded-full text-sm font-mono">{port}</span>
                  ))}
                  {result.openPorts.length > 5 && (
                    <span className="px-3 py-1 bg-gray-700 rounded-full text-sm text-gray-400">+{result.openPorts.length - 5} more in full report</span>
                  )}
                </div>
              </div>

              {/* Top 2 risks visible for free */}
              {result.risks.length > 0 && (
                <div className="mb-4">
                  <p className="text-gray-300 font-medium mb-2">Top Issues Found:</p>
                  {result.risks.slice(0, 2).map((risk, i) => (
                    <div key={i} className={`flex items-center gap-2 px-3 py-2 rounded-lg mb-2 text-sm ${getLevelBadge(risk.level)}`}>
                      <span className="font-semibold capitalize">[{risk.level}]</span>
                      <span>{risk.message}</span>
                    </div>
                  ))}
                  {result.risks.length > 2 && (
                    <p className="text-gray-500 text-sm mt-1">+ {result.risks.length - 2} more issues hidden — get the full report</p>
                  )}
                </div>
              )}

              {/* CTA */}
              <div className="border-t border-gray-700 pt-4 mt-4">
                <p className="text-gray-300 mb-3 font-medium">📄 Get the Full PDF Report — ₹199 only</p>
                <ul className="text-gray-400 text-sm mb-4 space-y-1">
                  <li>✅ All open ports with risk classification</li>
                  <li>✅ Full vulnerability details with remediation steps</li>
                  <li>✅ SSL/TLS analysis</li>
                  <li>✅ Tech stack fingerprint</li>
                  <li>✅ Delivered instantly on WhatsApp / Email</li>
                </ul>
                <button
                  onClick={() => setShowPaymentForm(true)}
                  className="w-full py-3 bg-green-600 hover:bg-green-700 rounded-lg font-semibold transition"
                >
                  Get Full Report for ₹199
                </button>
              </div>
            </div>
          )}

          {/* Payment Form */}
          {showPaymentForm && (
            <div className="bg-gray-900 border border-gray-700 rounded-xl p-6">
              <h2 className="text-xl font-bold mb-4">Enter Your Details</h2>
              <form onSubmit={handlePayment} className="space-y-4">
                <input
                  type="text"
                  placeholder="Your Name"
                  required
                  value={userInfo.name}
                  onChange={e => setUserInfo({ ...userInfo, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                />
                <input
                  type="email"
                  placeholder="Your Email"
                  required
                  value={userInfo.email}
                  onChange={e => setUserInfo({ ...userInfo, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                />
                <input
                  type="tel"
                  placeholder="Your Phone (10 digits)"
                  required
                  value={userInfo.phone}
                  onChange={e => setUserInfo({ ...userInfo, phone: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                />
                <button
                  type="submit"
                  disabled={paymentLoading}
                  className="w-full py-3 bg-green-600 hover:bg-green-700 rounded-lg font-semibold transition disabled:opacity-50"
                >
                  {paymentLoading ? 'Redirecting to PayU...' : 'Pay ₹199 & Get Report'}
                </button>
              </form>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
