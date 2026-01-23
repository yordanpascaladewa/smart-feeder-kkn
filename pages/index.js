import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Home() {
  const router = useRouter();

  const handleLogout = () => {
    document.cookie = "token=; path=/; max-age=0";
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-100 to-cyan-200 p-4 flex flex-col items-center justify-center relative overflow-hidden">
      <Head>
        <title>Dashboard Peternakan</title>
      </Head>

      {/* Hiasan Background */}
      <div className="absolute top-0 -left-10 w-64 h-64 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob"></div>
      <div className="absolute bottom-0 -right-10 w-64 h-64 bg-yellow-300 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-2000"></div>

      {/* CONTAINER KACA UTAMA */}
      <main className="relative z-10 w-full max-w-xl md:max-w-3xl bg-white/50 backdrop-blur-xl rounded-[2rem] shadow-2xl border border-white/40 overflow-hidden mb-8">
         <div className="p-6 md:p-10 h-full max-h-[85vh] overflow-y-auto custom-scrollbar">
            
            {/* HEADER */}
            <header className="mb-8 flex justify-between items-center">
                <div>
                    <h1 className="text-2xl md:text-3xl font-black text-gray-800 tracking-tight">
                        Peternakan <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">BUMDes</span>
                    </h1>
                    <p className="text-xs text-gray-600 font-mono mt-1">Sistem Monitoring Pakan</p>
                </div>
                
                <div className="flex items-center gap-3">
                    <button 
                        onClick={handleLogout}
                        className="bg-red-100 hover:bg-red-500 hover:text-white text-red-600 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all shadow-sm active:scale-95">
                        Keluar
                    </button>
                    
                    <div className="hidden md:flex bg-white/60 px-3 py-1.5 rounded-full shadow-sm items-center gap-2 border border-white/50">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                        <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Online</span>
                    </div>
                </div>
            </header>

            {/* DAFTAR KANDANG (4 SEKAT) */}
            <div className="space-y-4">
                <h2 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-1">Monitoring Area (4 Unit)</h2>
                
                {/* === SEKAT 1 (AKTIF) === */}
                <Link href="/alat/Sekat%201" legacyBehavior>
                    <a className="block w-full group">
                        <div className="bg-white/80 hover:bg-white transition-all duration-300 p-4 rounded-2xl shadow-sm border border-emerald-100 flex items-center justify-between hover:shadow-md hover:scale-[1.01]">
                            <div className="flex items-center gap-3">
                                <div className="bg-gradient-to-br from-emerald-400 to-teal-500 p-2.5 rounded-xl shadow text-white">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="text-base font-bold text-gray-800 group-hover:text-emerald-700">Kandang Sekat 1</h3>
                                    <p className="text-[10px] text-gray-500 font-mono">ID: Sekat 1 • <span className="text-emerald-600 font-bold">125 Bebek</span></p>
                                </div>
                            </div>
                            <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-[9px] font-black rounded-md uppercase tracking-wider border border-emerald-200">
                                Terpasang
                            </span>
                        </div>
                    </a>
                </Link>

                 {/* === SEKAT 2 (OFFLINE) === */}
                 <div className="w-full opacity-60 bg-gray-50 p-4 rounded-2xl border border-gray-100 flex items-center justify-between grayscale cursor-not-allowed">
                        <div className="flex items-center gap-3">
                            <div className="bg-gray-200 p-2.5 rounded-xl text-gray-400">
                               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                            </div>
                            <div>
                                <h3 className="text-base font-bold text-gray-500">Kandang Sekat 2</h3>
                                <p className="text-[10px] text-gray-400 font-mono">ID: -</p>
                            </div>
                        </div>
                        <span className="px-2 py-1 bg-gray-200 text-gray-400 text-[9px] font-bold rounded-md uppercase tracking-wider">Alat Belum Terpasang</span>
                </div>

                {/* === SEKAT 3 (OFFLINE) === */}
                 <div className="w-full opacity-60 bg-gray-50 p-4 rounded-2xl border border-gray-100 flex items-center justify-between grayscale cursor-not-allowed">
                        <div className="flex items-center gap-3">
                            <div className="bg-gray-200 p-2.5 rounded-xl text-gray-400">
                               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                            </div>
                            <div>
                                <h3 className="text-base font-bold text-gray-500">Kandang Sekat 3</h3>
                                <p className="text-[10px] text-gray-400 font-mono">ID: -</p>
                            </div>
                        </div>
                        <span className="px-2 py-1 bg-gray-200 text-gray-400 text-[9px] font-bold rounded-md uppercase tracking-wider">Alat Belum Terpasang</span>
                </div>

                {/* === SEKAT 4 (OFFLINE) === */}
                 <div className="w-full opacity-60 bg-gray-50 p-4 rounded-2xl border border-gray-100 flex items-center justify-between grayscale cursor-not-allowed">
                        <div className="flex items-center gap-3">
                            <div className="bg-gray-200 p-2.5 rounded-xl text-gray-400">
                               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                            </div>
                            <div>
                                <h3 className="text-base font-bold text-gray-500">Kandang Sekat 4</h3>
                                <p className="text-[10px] text-gray-400 font-mono">ID: -</p>
                            </div>
                        </div>
                        <span className="px-2 py-1 bg-gray-200 text-gray-400 text-[9px] font-bold rounded-md uppercase tracking-wider">Alat Belum Terpasang</span>
                </div>

            </div>
         </div>
      </main>

      {/* --- FOOTER KREDIT ALA ALA (BARU) --- */}
      <footer className="absolute bottom-4 w-full text-center z-20 pointer-events-none">
        <p className="text-[10px] md:text-xs text-emerald-800/60 font-mono font-bold drop-shadow-sm">
          Developed with ❤️ by <span className="text-emerald-900 underline decoration-emerald-500/30">Tim 71 KKN Desa Ponowareng</span>
        </p>
        <p className="text-[9px] md:text-[10px] text-emerald-700/50 uppercase tracking-[0.2em] mt-1 font-bold">
          Universitas Diponegoro • 2026
        </p>
      </footer>

    </div>
  );
}