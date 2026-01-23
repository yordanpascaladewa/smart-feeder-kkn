import { useState } from 'react';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import Head from 'next/head';

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function DetailAlat() {
  const router = useRouter();
  const { id } = router.query;
  const [manualBerat, setManualBerat] = useState('');
  const [loadingManual, setLoadingManual] = useState(false);

  const { data: result, error } = useSWR(id ? `/api/cekalat?id=${id}` : null, fetcher, {
    refreshInterval: 1000,
  });

  const handleManualFeed = async () => {
    if (!manualBerat || manualBerat <= 0) return alert("Masukkan berat pakan!");
    setLoadingManual(true);
    try {
      const res = await fetch('/api/trigger', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_alat: id, berat: manualBerat }),
      });
      if (res.ok) { alert(`✅ Perintah: ${manualBerat} Gram`); setManualBerat(''); }
    } catch (err) { alert("Error koneksi."); }
    setLoadingManual(false);
  };

  if (!result && !error) return <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-400 animate-pulse text-sm">Menghubungkan...</div>;
  const data = result?.data; 
  if (!data) return <div className="min-h-screen flex items-center justify-center bg-gray-100 text-red-500 font-bold text-sm">ALAT TIDAK DITEMUKAN</div>;

  // --- LOGIKA GRAM ---
  const batasAman = 7000;   
  const kapasitasMax = 50000; 
  const isBahaya = data.berat_storage < batasAman;
  const persentase = Math.min((data.berat_storage / kapasitasMax) * 100, 100); 

  return (
    // WRAPPER UTAMA: Flex Center untuk menengahkan konten secara vertikal & horizontal
    <div className={`min-h-screen w-full transition-all duration-700 ease-in-out p-4 flex items-center justify-center
      ${isBahaya ? 'bg-gradient-to-br from-red-50 via-red-100 to-rose-200' : 'bg-gradient-to-br from-emerald-50 via-teal-100 to-cyan-200'}`}>
      
      <Head><title>Smart Control Panel</title></Head>

      <main className="w-full max-w-lg md:max-w-4xl space-y-6">
        
        {/* === MONITORING STORAGE === */}
        <div className="relative w-full bg-white/60 backdrop-blur-xl rounded-[2rem] shadow-2xl border border-white/50 p-6 md:p-10 overflow-hidden">
            <div className={`absolute -top-20 -right-20 w-40 h-40 md:w-64 md:h-64 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob ${isBahaya ? 'bg-red-300' : 'bg-green-300'}`}></div>

            <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="text-center md:text-left flex-1">
                    <h1 className="text-xl md:text-3xl font-black text-gray-800 tracking-tight">GUDANG PAKAN</h1>
                    <p className="text-xs font-mono text-gray-500 mb-4 bg-white/50 px-2 py-1 rounded inline-block">ID: {data.id_alat}</p>
                    
                    <div className="flex items-baseline justify-center md:justify-start gap-2 mb-4">
                        {/* Ukuran font disesuaikan biar ga kepotong di HP */}
                        <span className={`text-6xl md:text-8xl font-black tracking-tighter ${isBahaya ? 'text-red-600' : 'text-gray-800'}`}>
                            {data.berat_storage}
                        </span>
                        <span className="text-xl md:text-2xl text-gray-400 font-bold">Gram</span>
                    </div>

                    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg font-bold text-xs shadow-sm transition-all
                        ${isBahaya ? 'bg-red-500 text-white' : 'bg-emerald-500 text-white'}`}>
                        {isBahaya ? '⚠️ KRITIS' : '✅ AMAN'}
                    </div>
                </div>

                {/* Visual Tank */}
                <div className="w-full md:w-32 h-32 md:h-48 bg-gray-200/50 rounded-2xl p-2 relative flex flex-col justify-end overflow-hidden border border-white">
                    <div className={`w-full rounded-xl transition-all duration-1000 relative flex items-center justify-center
                        ${isBahaya ? 'bg-gradient-to-t from-red-500 to-rose-400' : 'bg-gradient-to-t from-emerald-500 to-teal-400'}`}
                        style={{ height: `${persentase}%`, minHeight: '15%' }}>
                        <span className="text-white font-bold text-sm drop-shadow-md">{Math.round(persentase)}%</span>
                    </div>
                </div>
            </div>
        </div>

        {/* === TOMBOL KONTROL === */}
        <div className="bg-white/70 backdrop-blur-lg rounded-[2rem] p-6 shadow-xl border border-white/40">
            <div className="flex items-center justify-center gap-2 mb-4">
                <span className="text-lg">⚡</span>
                <h2 className="text-lg font-black text-gray-800">Kontrol Manual</h2>
            </div>
            
            <div className="flex flex-col gap-3">
                <input 
                    type="number" 
                    placeholder="Masukkan Gram..." 
                    value={manualBerat}
                    onChange={(e) => setManualBerat(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-xl font-bold text-center text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-300 transition-all placeholder:text-sm"
                />
                <button 
                    onClick={handleManualFeed}
                    disabled={loadingManual}
                    className="w-full py-3 rounded-xl font-bold text-white bg-gradient-to-r from-orange-400 to-red-400 hover:from-orange-500 hover:to-red-500 shadow-md active:scale-95 transition-transform text-sm">
                    {loadingManual ? 'MENGIRIM...' : 'BERI PAKAN SEKARANG'}
                </button>
            </div>
        </div>

      </main>
    </div>
  );
}