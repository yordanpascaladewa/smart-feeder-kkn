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

    // --- SETTING USERNAME & PASSWORD ---
    const USER_BENAR = "desaponowareng";
    const PASS_BENAR = "desaponowarengmaju"; 
    // -----------------------------------

    if (username === USER_BENAR && password === PASS_BENAR) {
      document.cookie = "token=bolehmakan; path=/; max-age=86400"; // Tiket 1 Hari
      router.push('/'); 
    } else {
      setError('Username atau Password salah!');
      setLoading(false);
      setPassword(''); // <--- INI PERUBAHANNYA (Kosongkan Password otomatis)
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-600 to-teal-800 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <Head><title>Login Peternak</title></Head>

      {/* Hiasan Background */}
      <div className="absolute top-0 -left-10 w-96 h-96 bg-emerald-400 rounded-full mix-blend-overlay filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute bottom-0 -right-10 w-96 h-96 bg-teal-400 rounded-full mix-blend-overlay filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

      {/* CONTAINER LOGIN */}
      <div className="relative z-10 bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-[2rem] shadow-2xl w-full max-w-md">
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-white tracking-tight">Selamat Datang!</h1>
          <p className="text-emerald-100 text-sm mt-1 font-medium">Sistem Monitoring Pakan Terintegrasi</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          
          {/* Input Username */}
          <div>
            <label className="text-emerald-50/80 text-[10px] font-bold uppercase tracking-wider ml-1">Username</label>
            <input 
              type="text" 
              className="w-full mt-1 px-4 py-3 rounded-xl bg-white/90 border-0 text-emerald-900 font-bold focus:ring-4 focus:ring-emerald-400/50 transition-all placeholder:text-emerald-800/30"
              placeholder=""
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          {/* Input Password */}
          <div>
            <label className="text-emerald-50/80 text-[10px] font-bold uppercase tracking-wider ml-1">Password</label>
            <input 
              type="password" 
              className="w-full mt-1 px-4 py-3 rounded-xl bg-white/90 border-0 text-emerald-900 font-bold focus:ring-4 focus:ring-emerald-400/50 transition-all placeholder:text-emerald-800/30"
              placeholder=""
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-500/90 backdrop-blur-sm text-white text-sm font-bold px-4 py-3 rounded-xl text-center shadow-lg animate-pulse border border-red-400">
              ⚠️ {error}
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 text-emerald-900 font-black rounded-xl shadow-lg shadow-emerald-900/20 transition-all transform active:scale-95 uppercase tracking-widest text-sm">
            {loading ? 'Memeriksa...' : 'Masuk Dashboard'}
          </button>
        </form>
      </div>

      {/* FOOTER KREDIT */}
      <footer className="absolute bottom-6 w-full text-center z-20 pointer-events-none">
        <p className="text-[10px] md:text-xs text-emerald-100/70 font-mono font-bold drop-shadow-md">
          Developed with ❤️ by <span className="text-white underline decoration-emerald-300/50">Tim 71 KKN Desa Ponowareng</span>
        </p>
        <p className="text-[9px] md:text-[10px] text-emerald-200/50 uppercase tracking-[0.2em] mt-1 font-bold">
          Universitas Diponegoro • 2026
        </p>
      </footer>

    </div>
  );
}