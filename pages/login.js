// pages/login.js
import Head from 'next/head';
import { useState } from 'react';
import { useRouter } from 'next/router';

export default function Login() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (data.success) {
        router.push('/'); // Pindah ke Dashboard
      } else {
        setError('Username atau Password salah bro!');
        setLoading(false);
      }
    } catch (err) {
      setError('Ada masalah jaringan.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Head>
        <title>Login - Smart Feeder</title>
      </Head>

      <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-sm border border-gray-100">
        <div className="text-center mb-8">
            <div className="bg-emerald-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 text-emerald-600">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
                    <path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z" clipRule="evenodd" />
                </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-800">Smart Feeder KKN</h1>
            <p className="text-gray-400 text-sm">Masuk untuk akses kontrol.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
            <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Username</label>
                <input 
                    type="text" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition"
                    placeholder="admin"
                    required
                />
            </div>
            
            <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Password</label>
                <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition"
                    placeholder="••••••••"
                    required
                />
            </div>

            {error && (
                <div className="bg-red-50 text-red-500 text-sm p-3 rounded-xl text-center font-medium border border-red-100">
                    {error}
                </div>
            )}

            <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-emerald-600 text-white font-bold py-3 rounded-xl hover:bg-emerald-700 transition shadow-lg shadow-emerald-200 active:scale-95"
            >
                {loading ? 'Mengecek...' : 'MASUK SEKARANG'}
            </button>
        </form>
      </div>
    </div>
  );
}