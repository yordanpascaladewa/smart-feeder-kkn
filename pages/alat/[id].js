import { useRouter } from 'next/router';
import useSWR from 'swr';
import Head from 'next/head';

// Fetcher untuk SWR
const fetcher = (url) => fetch(url).then((res) => res.json());

export default function DetailAlat() {
  const router = useRouter();
  const { id } = router.query;

  // Realtime update tiap 2 detik
  const { data: result, error } = useSWR(id ? `/api/cekalat?id=${id}` : null, fetcher, {
    refreshInterval: 2000, 
  });

  // Tampilan Loading
  if (!result && !error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-400 font-mono animate-pulse">
        CONNECTING TO SATELLITE...
      </div>
    );
  }
  
  const data = result?.data; 
  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 text-red-500 font-bold">
        ALAT TIDAK DITEMUKAN
      </div>
    );
  }

  // --- LOGIKA STATUS ---
  const batasAman = 7.0; 
  const kapasitasMax = 50.0; // Anggap gudang penuh di 50kg (Buat visual bar)
  
  const isBahaya = data.berat_storage < batasAman;
  const persentase = Math.min((data.berat_storage / kapasitasMax) * 100, 100); 

  return (
    <div className={`min-h-screen transition-all duration-700 ease-in-out flex flex-col items-center justify-center p-4 md:p-8
      ${isBahaya ? 'bg-gradient-to-br from-red-50 via-red-100 to-rose-200' : 'bg-gradient-to-br from-emerald-50 via-teal-100 to-cyan-200'}`}>
      
      <Head>
        <title>Smart Storage Monitor</title>
      </Head>

      {/* CONTAINER UTAMA */}
      <main className="w-full max-w-4xl bg-white/60 backdrop-blur-xl rounded-[2.5rem] shadow-2xl border border-white/50 p-6 md:p-12 overflow-hidden relative">
        
        {/* Hiasan Background Blobs */}
        <div className={`absolute -top-20 -right-20 w-64 h-64 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob
          ${isBahaya ? 'bg-red-300' : 'bg-green-300'}`}></div>
        <div className={`absolute -bottom-20 -left-20 w-64 h-64 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000
          ${isBahaya ? 'bg-orange-300' : 'bg-cyan-300'}`}></div>

        {/* HEADER */}
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center mb-10 border-b border-gray-200/50 pb-6">
          <div className="text-center md:text-left">
            <h1 className="text-3xl md:text-5xl font-black text-gray-800 tracking-tight">
              MONITOR GUDANG
            </h1>
            <p className="text-sm font-mono text-gray-500 mt-1">ID: {data.id_alat}</p>
          </div>
          
          {/* Badge Live Status */}
          <div className="mt-4 md:mt-0 flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
            <span className="text-xs font-bold text-gray-600 tracking-wider">SYSTEM ONLINE</span>
          </div>
        </div>

        {/* KONTEN UTAMA */}
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          
          {/* KOLOM KIRI: ANGKA BESAR */}
          <div className="text-center md:text-left space-y-2">
            <p className="text-gray-400 font-bold text-sm tracking-[0.2em] uppercase">
              Berat Aktual
            </p>
            <div className="flex items-baseline justify-center md:justify-start gap-2">
              <span className={`text-8xl md:text-9xl font-black tracking-tighter transition-colors duration-300
                ${isBahaya ? 'text-red-600 drop-shadow-sm' : 'text-gray-800 drop-shadow-sm'}`}>
                {data.berat_storage}
              </span>
              <span className="text-2xl md:text-4xl text-gray-400 font-bold">Kg</span>
            </div>
            
            {/* STATUS BADGE */}
            <div className={`inline-flex items-center gap-3 px-5 py-3 rounded-xl font-bold text-sm md:text-lg transition-all duration-300 mt-4
              ${isBahaya ? 'bg-red-500 text-white shadow-lg shadow-red-500/30' : 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30'}`}>
              {isBahaya ? (
                <>
                  <span>⚠️ STOK KRITIS! ISI SEGERA</span>
                </>
              ) : (
                <>
                  <span>✅ STOK AMAN TERKENDALI</span>
                </>
              )}
            </div>
          </div>

          {/* KOLOM KANAN: VISUAL BAR (TANK) */}
          <div className="w-full bg-gray-200/50 rounded-3xl p-2 h-64 md:h-80 relative flex flex-col justify-end overflow-hidden border border-white">
            {/* Bar Fill */}
            <div 
              className={`w-full rounded-2xl transition-all duration-1000 ease-out relative flex items-center justify-center
                ${isBahaya ? 'bg-gradient-to-t from-red-500 to-rose-400' : 'bg-gradient-to-t from-emerald-500 to-teal-400'}`}
              style={{ height: `${persentase}%`, minHeight: '10%' }}
            >
              <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
              <span className="relative text-white font-bold text-xl drop-shadow-md">
                {Math.round(persentase)}%
              </span>
            </div>
          </div>
          
        </div>

        {/* FOOTER */}
        <div className="mt-12 text-center border-t border-gray-200/50 pt-6">
          <p className="text-xs text-gray-400 font-mono">
            Last Sync: {new Date().toLocaleTimeString()}
          </p>
        </div>

      </main>
    </div>
  );
}