import { useState } from 'react';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import Head from 'next/head';

// Fetcher
const fetcher = (url) => fetch(url).then((res) => res.json());

export default function DetailAlat() {
  const router = useRouter();
  const { id } = router.query;
  
  // State untuk input manual
  const [manualBerat, setManualBerat] = useState('');
  const [loadingManual, setLoadingManual] = useState(false);

  // Realtime Data
  const { data: result, error } = useSWR(id ? `/api/cekalat?id=${id}` : null, fetcher, {
    refreshInterval: 2000, 
  });

  // --- LOGIKA TOMBOL MANUAL ---
  const handleManualFeed = async () => {
    if (!manualBerat || manualBerat <= 0) return alert("Masukkan berat pakan!");
    setLoadingManual(true);

    try {
      // Panggil API (Meskipun alat ga ada motor, sistem tetap catat perintah ini)
      const res = await fetch('/api/trigger', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_alat: id, berat: manualBerat }),
      });
      
      if (res.ok) {
        alert(`✅ Perintah Terkirim: ${manualBerat} Kg`);
        setManualBerat('');
      } else {
        alert("Gagal mengirim perintah.");
      }
    } catch (err) {
      console.error(err);
      alert("Error koneksi.");
    }
    setLoadingManual(false);
  };

  // Tampilan Loading & Error
  if (!result && !error) return <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-400 animate-pulse">CONNECTING...</div>;
  const data = result?.data; 
  if (!data) return <div className="min-h-screen flex items-center justify-center bg-gray-100 text-red-500 font-bold">ALAT TIDAK DITEMUKAN</div>;

  // --- VARIABEL VISUAL ---
  const batasAman = 7.0; 
  const kapasitasMax = 50.0;
  const isBahaya = data.berat_storage < batasAman;
  const persentase = Math.min((data.berat_storage / kapasitasMax) * 100, 100); 

  return (
    <div className={`min-h-screen transition-all duration-700 ease-in-out p-4 md:p-8
      ${isBahaya ? 'bg-gradient-to-br from-red-50 via-red-100 to-rose-200' : 'bg-gradient-to-br from-emerald-50 via-teal-100 to-cyan-200'}`}>
      
      <Head>
        <title>Smart Control Panel</title>
      </Head>

      <main className="w-full max-w-5xl mx-auto space-y-8">
        
        {/* === BAGIAN 1: MONITORING STORAGE (Yang Tadi) === */}
        <div className="relative w-full bg-white/60 backdrop-blur-xl rounded-[2.5rem] shadow-2xl border border-white/50 p-6 md:p-10 overflow-hidden">
            {/* Background Blob Hiasan */}
            <div className={`absolute -top-20 -right-20 w-64 h-64 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob ${isBahaya ? 'bg-red-300' : 'bg-green-300'}`}></div>

            <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
                {/* Kiri: Teks & Status */}
                <div className="text-center md:text-left flex-1">
                    <h1 className="text-2xl md:text-4xl font-black text-gray-800 tracking-tight">GUDANG PAKAN</h1>
                    <p className="text-sm font-mono text-gray-500 mb-6">ID: {data.id_alat}</p>
                    
                    <div className="flex items-baseline justify-center md:justify-start gap-2 mb-4">
                        <span className={`text-7xl md:text-8xl font-black tracking-tighter ${isBahaya ? 'text-red-600' : 'text-gray-800'}`}>
                            {data.berat_storage}
                        </span>
                        <span className="text-2xl text-gray-400 font-bold">Kg</span>
                    </div>

                    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm shadow-sm transition-all
                        ${isBahaya ? 'bg-red-500 text-white' : 'bg-emerald-500 text-white'}`}>
                        {isBahaya ? '⚠️ STOK KRITIS' : '✅ STOK AMAN'}
                    </div>
                </div>

                {/* Kanan: Visual Tank */}
                <div className="w-full md:w-48 h-48 bg-gray-200/50 rounded-3xl p-2 relative flex flex-col justify-end overflow-hidden border border-white">
                    <div className={`w-full rounded-2xl transition-all duration-1000 relative flex items-center justify-center
                        ${isBahaya ? 'bg-gradient-to-t from-red-500 to-rose-400' : 'bg-gradient-to-t from-emerald-500 to-teal-400'}`}
                        style={{ height: `${persentase}%`, minHeight: '10%' }}>
                        <span className="text-white font-bold text-lg drop-shadow-md">{Math.round(persentase)}%</span>
                    </div>
                </div>
            </div>
        </div>


        {/* === BAGIAN 2: KONTROL & JADWAL (FITUR BARU) === */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* KARTU A: FEEDING MANUAL */}
            <div className="bg-white/70 backdrop-blur-lg rounded-[2rem] p-8 shadow-xl border border-white/40">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-orange-100 text-orange-600 rounded-xl">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                    </div>
                    <h2 className="text-xl font-black text-gray-800">Beri Pakan Manual</h2>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Berat Pakan (Kg)</label>
                        <input 
                            type="number" 
                            placeholder="0.0" 
                            value={manualBerat}
                            onChange={(e) => setManualBerat(e.target.value)}
                            className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-2xl font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-300 transition-all"
                        />
                    </div>
                    <button 
                        onClick={handleManualFeed}
                        disabled={loadingManual}
                        className={`w-full py-4 rounded-xl font-bold text-white shadow-lg transition-all transform active:scale-95
                        ${loadingManual ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-orange-400 to-red-400 hover:from-orange-500 hover:to-red-500 shadow-orange-300'}`}>
                        {loadingManual ? 'Mengirim...' : 'KIRIM PERINTAH SEKARANG'}
                    </button>
                    <p className="text-xs text-center text-gray-400 italic">
                        *Pastikan wadah pakan kosong sebelum menekan tombol.
                    </p>
                </div>
            </div>

            {/* KARTU B: JADWAL OTOMATIS */}
            <div className="bg-white/70 backdrop-blur-lg rounded-[2rem] p-8 shadow-xl border border-white/40">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h2 className="text-xl font-black text-gray-800">Jadwal Otomatis</h2>
                </div>

                <div className="space-y-4">
                    {/* Jadwal Pagi */}
                    <div className="flex items-center justify-between p-4 bg-white/50 rounded-2xl border border-white/60">
                        <div className="flex items-center gap-4">
                            <span className="bg-blue-100 text-blue-700 font-bold px-3 py-1 rounded-lg text-sm">PAGI</span>
                            <div>
                                <p className="text-xl font-black text-gray-700">07:00 <span className="text-sm font-normal text-gray-400">WIB</span></p>
                                <p className="text-xs text-gray-400 font-bold">Target: 7.0 Kg</p>
                            </div>
                        </div>
                        <div className="h-3 w-3 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.6)] animate-pulse"></div>
                    </div>

                    {/* Jadwal Sore */}
                    <div className="flex items-center justify-between p-4 bg-white/50 rounded-2xl border border-white/60">
                        <div className="flex items-center gap-4">
                            <span className="bg-purple-100 text-purple-700 font-bold px-3 py-1 rounded-lg text-sm">SORE</span>
                            <div>
                                <p className="text-xl font-black text-gray-700">16:00 <span className="text-sm font-normal text-gray-400">WIB</span></p>
                                <p className="text-xs text-gray-400 font-bold">Target: 8.0 Kg</p>
                            </div>
                        </div>
                        <div className="h-3 w-3 rounded-full bg-gray-300"></div>
                    </div>
                    
                    <div className="pt-2 text-center">
                         <span className="text-[10px] uppercase tracking-widest text-gray-400 bg-gray-100 px-3 py-1 rounded-full">System Auto-Pilot Active</span>
                    </div>
                </div>
            </div>

        </div>

      </main>
    </div>
  );
}