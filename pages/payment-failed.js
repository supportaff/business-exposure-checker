import Head from 'next/head';

export default function PaymentFailed() {
  return (
    <>
      <Head><title>Payment Failed</title></Head>
      <main className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center px-4">
        <div className="text-center max-w-md">
          <p className="text-6xl mb-6">❌</p>
          <h1 className="text-3xl font-bold mb-3">Payment Failed</h1>
          <p className="text-gray-400 mb-8">Something went wrong with your payment. Please try again.</p>
          <a href="/" className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition">
            Try Again
          </a>
        </div>
      </main>
    </>
  );
}
