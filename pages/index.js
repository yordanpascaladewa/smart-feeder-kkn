import Head from 'next/head';
import Link from 'next/link';

export default function Home() {
  // (Nanti di sini bisa ditambah SWR buat fetch status semua kandang sekaligus)

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-100 to-cyan-200 p-4 md:p-8 overflow-hidden relative flex justify-center items-center">
      <Head>
        <title>Dashboard Peternakan BUMDes</title>
        <meta name="description" content="Monitor Pakan Ternak" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* --- ANIMASI BACKGROUND BLOBS --- */}
      <div className="absolute top-0 -left-4 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
      <div className="absolute top-0 -right-4 w-96 h-96 bg-yellow-300 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-32 left-20 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-4000"></div>

      {/* --- CONTAINER KACA UTAMA --- */}
      <main className="relative z-10 w-full max-w-5xl bg-white/40 backdrop-blur-xl rounded-[3rem] shadow-2xl border border-white/30 overflow-hidden">
         <div className="p-8 md:p-12 h-full overflow-y-auto">
            
            {/* HEADER DASHBOARD */}
            <header className="mb-12 flex flex-col md:flex-row justify-between items-center text-center md:text-left gap-6">
                <div>
                    <h1 className="text-4xl md:text-5xl font-black text-gray-800 tracking-tight mb-2">
                        Peternak <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">BUMDes</span>
                    </h1>
                    <p className="text-lg text-gray-600 font-medium font-mono">
                        Sistem Monitoring Pakan Terintegrasi
                    </p>
                </div>
                
                {/* Status Sistem Global */}
                <div className="bg-white/50 backdrop-blur-md p-4 rounded-2xl shadow-sm border border-white/50 flex items-center gap-4">
                    <div className="relative flex h-5 w-5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-5 w-5 bg-emerald-500"></span>
                    </div>
                    <div>
                        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Status Server</h3>
                        <p className="text-xl font-black text-gray-800 leading-none">ONLINE</p>
                    </div>
                </div>
            </header>

            {/* --- RINGKASAN (Opsional, buat pemanis) --- */}
            <div className="grid grid-cols-2 gap-4 mb-12">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 p-6 rounded-3xl border border-blue-100/50 text-center">
                    <h3 className="text-blue-800 font-bold text-sm uppercase tracking-widest mb-2">Total Populasi</h3>
                    <p className="text-4xl font-black text-blue-900">125 <span className="text-xl">Ekor</span></p>
                </div>
                <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 p-6 rounded-3xl border border-emerald-100/50 text-center">
                    <h3 className="text-emerald-800 font-bold text-sm uppercase tracking-widest mb-2">Kandang Aktif</h3>
                    <p className="text-4xl font-black text-emerald-900">1 <span className="text-xl">Unit</span></p>
                </div>
            </div>

            {/* --- DAFTAR KANDANG --- */}
            <h2 className="text-2xl font-black text-gray-800 mb-6 px-2 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
                </svg>
                Monitoring Area
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-8">
                
                {/* === KARTU KANDANG 1 (AKTIF) === */}
                <Link href="/alat/Sekat%201">
                    <div className="group relative overflow-hidden bg-white/70 backdrop-blur-lg p-8 rounded-[2rem] shadow-lg border border-white/60 cursor-pointer transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:bg-white/90 hover:border-emerald-300">
                        {/* Efek Hover Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-100/0 via-emerald-100/30 to-teal-100/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                        <div className="relative flex justify-between items-start mb-6">
                            <div className="flex items-center gap-5">
                                {/* Icon Rumah */}
                                <div className="bg-gradient-to-br from-emerald-400 to-teal-500 p-4 rounded-2xl shadow-lg shadow-emerald-200">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" viewBox="0 0 20 20" fill="currentColor">
                                      <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black text-gray-800 group-hover:text-emerald-700 transition-colors">Kandang Sekat 1</h3>
                                    <p className="text-sm text-gray-500 font-mono font-bold mt-1">ID: Sekat 1</p>
                                </div>
                            </div>
                            {/* Badge Status */}
                            <span className="px-4 py-2 bg-emerald-100 text-emerald-800 text-xs font-black rounded-full uppercase tracking-wider shadow-sm group-hover:bg-emerald-200 transition-colors">
                                Terpasang
                            </span>
                        </div>
                        
                        {/* Tombol Aksi Semu */}
                        <div className="flex items-center justify-center gap-2 text-emerald-600 font-bold bg-emerald-50/50 p-3 rounded-xl group-hover:bg-emerald-100 transition-colors">
                            <span>Buka Monitoring</span>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:translate-x-1 transition-transform" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </div>
                    </div>
                </Link>

                 {/* === KARTU KANDANG LAIN (CONTOH OFFLINE) === */}
                 {/* Saya buat agak transparan dan abu-abu biar kelihatan belum aktif */}
                 <div className="opacity-50 pointer-events-none bg-white/40 backdrop-blur-md p-8 rounded-[2rem] shadow border border-white/20 grayscale">
                        <div className="flex justify-between items-start mb-6">
                            <div className="flex items-center gap-5">
                                <div className="bg-gray-200 p-4 rounded-2xl">
                                   <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold text-gray-700">Kandang Sekat 2</h3>
                                    <p className="text-sm text-gray-500 font-mono font-bold mt-1">ID: -</p>
                                </div>
                            </div>
                            <span className="px-4 py-2 bg-gray-200/50 text-gray-500 text-xs font-black rounded-full uppercase tracking-wider">
                                Belum Aktif
                            </span>
                        </div>
                        <div className="text-center text-gray-400 font-medium p-3 bg-gray-100/50 rounded-xl">
                            Alat belum terpasang
                        </div>
                    </div>
                
                {/* Bisa tambah Kandang 3, 4 dst di sini... */}

            </div>
         </div>
      </main>
    </div>
  );
} 