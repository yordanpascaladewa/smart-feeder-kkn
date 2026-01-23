import Head from 'next/head';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-100 to-cyan-200 p-4 flex items-center justify-center relative overflow-hidden">
      <Head>
        <title>Dashboard Peternakan</title>
      </Head>

      {/* Background Blobs (Hiasan) */}
      <div className="absolute top-0 -left-10 w-64 h-64 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob"></div>
      <div className="absolute top-0 -right-10 w-64 h-64 bg-yellow-300 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-20 left-10 w-64 h-64 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-4000"></div>

      {/* CONTAINER KACA UTAMA */}
      <main className="relative z-10 w-full max-w-3xl bg-white/50 backdrop-blur-xl rounded-[2rem] shadow-2xl border border-white/40 overflow-hidden">
         <div className="p-6 md:p-10">
            
            {/* HEADER */}
            <header className="mb-8 flex flex-col md:flex-row justify-between items-center text-center md:text-left gap-4">
                <div>
                    <h1 className="text-3xl md:text-4xl font-black text-gray-800 tracking-tight">
                        Peternak <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">BUMDes</span>
                    </h1>
                    <p className="text-sm text-gray-600 font-mono mt-1">Sistem Monitoring Pakan</p>
                </div>
                
                {/* Status Server Kecil */}
                <div className="bg-white/60 px-4 py-2 rounded-full shadow-sm flex items-center gap-2 border border-white/50">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Server Online</span>
                </div>
            </header>

            {/* DAFTAR KANDANG */}
            <div className="space-y-4">
                <h2 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-2 px-1">Daftar Area</h2>
                
                {/* === KARTU KANDANG 1 === */}
                <Link href="/alat/Sekat%201">
                    <div className="group bg-white/60 hover:bg-white/80 transition-all duration-300 p-5 rounded-2xl shadow-sm border border-white/50 cursor-pointer flex items-center justify-between">
                        
                        <div className="flex items-center gap-4">
                            {/* Icon Rumah Kecil */}
                            <div className="bg-gradient-to-br from-emerald-400 to-teal-500 p-3 rounded-xl shadow-md text-white">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-800 group-hover:text-emerald-700">Kandang Sekat 1</h3>
                                <p className="text-xs text-gray-500 font-mono">ID: Sekat 1</p>
                            </div>
                        </div>

                        {/* Badge Status (Ukurannya sudah dikecilkan) */}
                        <span className="px-2 py-1 bg-emerald-100 text-emerald-800 text-[10px] md:text-xs font-black rounded-lg uppercase tracking-wider border border-emerald-200">
                            Terpasang
                        </span>
                    </div>
                </Link>

                 {/* === KARTU KANDANG 2 (Contoh Offline) === */}
                 <div className="opacity-60 bg-gray-50/50 p-5 rounded-2xl border border-gray-200 flex items-center justify-between grayscale">
                        <div className="flex items-center gap-4">
                            <div className="bg-gray-200 p-3 rounded-xl text-gray-400">
                               <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-600">Kandang Sekat 2</h3>
                                <p className="text-xs text-gray-400 font-mono">ID: -</p>
                            </div>
                        </div>
                        <span className="px-2 py-1 bg-gray-200 text-gray-500 text-[10px] font-bold rounded-lg uppercase tracking-wider">
                            Non-Aktif
                        </span>
                </div>

            </div>
         </div>
      </main>
    </div>
  );
}