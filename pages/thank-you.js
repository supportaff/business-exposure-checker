import { useRouter } from 'next/router';
import Head from 'next/head';

export default function ThankYou() {
  const router = useRouter();
  const { name, email } = router.query;

  return (
    <>
      <Head><title>Payment Successful — ScanSentry</title></Head>
      <main className="min-h-screen grid-bg text-white flex flex-col items-center justify-center px-4">
        <div className="text-center max-w-md glow-card p-10">
          <div className="text-6xl mb-6" style={{filter:'drop-shadow(0 0 20px rgba(0,255,65,0.8))'}}>✅</div>
          <h1 className="text-2xl font-black mb-3" style={{fontFamily:'Orbitron,monospace', color:'#00ff41', textShadow:'0 0 20px rgba(0,255,65,0.5)'}}>PAYMENT SUCCESS</h1>
          <p className="text-sm mb-2" style={{color:'rgba(0,255,65,0.6)'}}>Hi {name}, your full security report is being generated.</p>
          <p className="text-xs mb-8" style={{color:'rgba(255,255,255,0.4)'}}>Delivering to <span style={{color:'#00ff41'}}>{email}</span> within a few minutes.</p>
          <a href="/" className="btn-green px-8 py-3 rounded-lg text-sm inline-block">
            <span>SCAN ANOTHER DOMAIN</span>
          </a>
        </div>
      </main>
    </>
  );
}
