import { useRouter } from 'next/router';
import Head from 'next/head';

export default function ThankYou() {
  const router = useRouter();
  const { name, email } = router.query;

  return (
    <>
      <Head><title>Payment Successful</title></Head>
      <main className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center px-4">
        <div className="text-center max-w-md">
          <p className="text-6xl mb-6">✅</p>
          <h1 className="text-3xl font-bold mb-3">Payment Successful!</h1>
          <p className="text-gray-400 text-lg mb-2">Hi {name}, your full security report is being generated.</p>
          <p className="text-gray-400">It will be delivered to <span className="text-white font-medium">{email}</span> within a few minutes.</p>
          <a href="/" className="mt-8 inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition">
            Scan Another Domain
          </a>
        </div>
      </main>
    </>
  );
}
