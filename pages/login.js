import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

export default function Login() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // --- SETTING USERNAME & PASSWORD DI SINI ---
    const USER_BENAR = "peternakanbumdes";
    const PASS_BENAR = "PonowarengMaju"; // Ganti sesuka hati
    // -------------------------------------------

    if (username === USER_BENAR && password === PASS_BENAR) {
      // Simpan "Tiket Masuk" di Cookies browser
      document.cookie = "token=bolehmakan; path=/; max-age=86400"; // Berlaku 1 hari
      router.push('/'); // Lempar ke Dashboard
    } else {
      setError('Username atau Password salah!');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center p-4">
      <Head><title>Login</title></Head>

      {/* Container Kaca */}
      <div className="bg-white/20 backdrop-blur-lg border border-white/30 p-8 rounded-[2rem] shadow-2xl w-full max-w-md">
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-white tracking-tight">Selamat Datang</h1>
          <p className="text-emerald-100 text-sm mt-1">Silakan masuk</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          
          {/* Input Username */}
          <div>
            <label className="text-emerald-50 text-xs font-bold uppercase tracking-wider ml-1">Username</label>
            <input 
              type="text" 
              className="w-full mt-1 px-4 py-3 rounded-xl bg-white/90 border-0 text-emerald-900 font-bold focus:ring-4 focus:ring-emerald-300 transition-all placeholder:text-emerald-300/50"
              placeholder="masukkan username anda"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          {/* Input Password */}
          <div>
            <label className="text-emerald-50 text-xs font-bold uppercase tracking-wider ml-1">Password</label>
            <input 
              type="password" 
              className="w-full mt-1 px-4 py-3 rounded-xl bg-white/90 border-0 text-emerald-900 font-bold focus:ring-4 focus:ring-emerald-300 transition-all placeholder:text-emerald-300/50"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-500/80 text-white text-sm font-bold px-4 py-2 rounded-lg text-center animate-pulse">
              ⚠️ {error}
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-4 bg-emerald-800 hover:bg-emerald-900 text-white font-black rounded-xl shadow-lg transition-all active:scale-95">
            {loading ? 'MEMERIKSA...' : 'MASUK SEKARANG'}
          </button>
        </form>

        <p className="text-center text-emerald-200/60 text-xs mt-6">
          Sistem Monitoring Pakan BUMDes &copy; 2026
        </p>

      </div>
    </div>
  );
}