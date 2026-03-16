import Head from 'next/head';

export default function PaymentFailed() {
  return (
    <>
      <Head><title>Payment Failed — ScanSentry</title></Head>
      <main className="min-h-screen grid-bg text-white flex flex-col items-center justify-center px-4">
        <div className="text-center max-w-md glow-card p-10">
          <div className="text-6xl mb-6">❌</div>
          <h1 className="text-2xl font-black mb-3" style={{fontFamily:'Orbitron,monospace', color:'#ff3232', textShadow:'0 0 20px rgba(255,50,50,0.5)'}}>PAYMENT FAILED</h1>
          <p className="text-sm mb-8" style={{color:'rgba(255,255,255,0.4)'}}>Something went wrong with your payment. Please try again.</p>
          <a href="/" className="btn-green px-8 py-3 rounded-lg text-sm inline-block">
            <span>TRY AGAIN</span>
          </a>
        </div>
      </main>
    </>
  );
}
