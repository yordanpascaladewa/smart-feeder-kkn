import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Head from 'next/head';

export default function DetailAlat() {
  const router = useRouter();
  const { id } = router.query; 

  const [dataAlat, setDataAlat] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loadingFeed, setLoadingFeed] = useState(false);
  const [inputKg, setInputKg] = useState(1);
  const [selectedSekat, setSelectedSekat] = useState(id || 'sekat_1');

  // Config Dummy Status Sekat
  const listSekat = [
    { id: 'sekat_1', label: 'Sekat 1', active: true },
    { id: 'sekat_2', label: 'Sekat 2', active: false },
    { id: 'sekat_3', label: 'Sekat 3', active: false },
    { id: 'sekat_4', label: 'Sekat 4', active: false },
  ];

  // Ambil Data Realtime
  useEffect(() => {
    if(!id) return;
    const ambilData = async () => {
      try {
        // Panggil API dengan ID saja buat ambil data terbaru
        const res = await fetch(`/api/update?id=${id}`); 
        const json = await res.json();
        if (json.success) setDataAlat(json.data);
      } catch (err) { console.error(err); }
    };
    ambilData();
    const interval = setInterval(ambilData, 2000); 
    return () => clearInterval(interval);
  }, [id]);

  // --- HITUNGAN VISUAL ---
  
  // 1. STORAGE (Load Cell 1)
  const maxStorage = 50; // Kapasitas Gudang 50kg
  const beratStorage = dataAlat ? dataAlat.berat_storage : 45; // Default dummy
  const persenStorage = (beratStorage / maxStorage) * 100;

  // 2. EMBER (Load Cell 2)
  const maxEmber = 10;   // Kapasitas Ember 10kg
  const beratEmber = dataAlat ? dataAlat.berat_ember : 0; // Default dummy
  const persenEmber = (beratEmber / maxEmber) * 100;

  // Fungsi Kirim Perintah (Sama kayak sebelumnya)
  const handleKirimPerintah = async () => {
    setLoadingFeed(true);
    try {
        const res = await fetch('/api/trigger', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: selectedSekat, kg: inputKg }) 
        });
        if (res.ok) { setShowModal(false); alert("Perintah Terkirim!"); }
    } catch (error) { alert("Error koneksi"); }
    setLoadingFeed(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-10">
      <Head><title>Monitoring 2 Sensor</title></Head>

      {/* --- POPUP MODAL (KODE SAMA KAYAK SEBELUMNYA, DIPENDKIN BIAR MUAT) --- */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowModal(false)}></div>
            <div className="bg-white rounded-3xl w-full max-w-sm p-6 relative z-10 animate-bounce-in">
                <h3 className="text-xl font-bold mb-4">Beri Pakan Manual</h3>
                <input type="number" value={inputKg} onChange={(e)=>setInputKg(parseFloat(e.target.value))} className="border w-full p-2 mb-4 rounded-xl text-center font-bold text-2xl"/>
                <button onClick={handleKirimPerintah} className="w-full bg-emerald-600 text-white py-3 rounded-xl font-bold">KIRIM {inputKg} KG</button>
            </div>
        </div>
      )}

      {/* HEADER */}
      <div className="bg-emerald-600 px-6 pt-8 pb-20 rounded-b-[2.5rem] shadow-lg">
         <div className="flex items-center gap-4 text-white">
            <Link href="/"><div className="bg-white/20 p-2 rounded-xl">🔙</div></Link>
            <h1 className="text-xl font-bold">Detail Kandang (2 Sensor)</h1>
         </div>
      </div>

      <div className="px-5 -mt-16 relative z-20 max-w-lg mx-auto space-y-4">
        
        {/* KARTU 1: STORAGE UTAMA */}
        <div className="bg-white p-6 rounded-3xl shadow-xl border border-gray-100 flex items-center justify-between">
            <div>
                <h2 className="text-gray-400 text-xs font-bold uppercase">Gudang Utama</h2>
                <p className="text-3xl font-bold text-gray-800">{beratStorage} <span className="text-sm text-gray-400">Kg</span></p>
                <p className="text-xs text-emerald-600 mt-1 font-medium">Sisa Stok Aman</p>
            </div>
            {/* Visual Lingkaran Storage */}
            <div className="relative w-24 h-24 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                    <circle cx="48" cy="48" r="40" stroke="#f3f4f6" strokeWidth="8" fill="transparent"/>
                    <circle cx="48" cy="48" r="40" stroke="#10b981" strokeWidth="8" fill="transparent"
                        strokeDasharray={251} strokeDashoffset={251 - (251 * persenStorage) / 100} strokeLinecap="round" />
                </svg>
                <span className="absolute text-xs font-bold text-gray-600">{Math.round(persenStorage)}%</span>
            </div>
        </div>

        {/* KARTU 2: EMBER PENAKAR (Sensor Load Cell 2) */}
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-3xl border border-orange-200 shadow-md">
            <div className="flex justify-between items-start mb-4">
                <div>
                     <h2 className="text-orange-800/60 text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3"><path d="M10 2a.75.75 0 01.75.75v1.5H18a.75.75 0 01.75.75v5.5a.75.75 0 01-.75.75h-1.5v5a2 2 0 01-2 2h-9a2 2 0 01-2-2v-5H2a.75.75 0 01-.75-.75V5a.75.75 0 01.75-.75h7.25v-1.5A.75.75 0 0110 2z" /></svg>
                        Ember Penakar
                     </h2>
                     <p className="text-4xl font-black text-orange-600 mt-1">{beratEmber} <span className="text-lg font-bold text-orange-400">Kg</span></p>
                </div>
                {/* Indikator Target */}
                <div className="text-right">
                    <p className="text-xs text-orange-800/50 font-bold uppercase">Target</p>
                    <p className="text-lg font-bold text-orange-800">{dataAlat?.target_manual || 0} Kg</p>
                </div>
            </div>

            {/* Progress Bar Linear buat Ember */}
            <div className="relative">
                <div className="flex justify-between text-[10px] font-bold text-orange-400 mb-1 uppercase">
                    <span>Kosong</span>
                    <span>Penuh ({maxEmber}kg)</span>
                </div>
                <div className="w-full bg-orange-200/50 rounded-full h-4 overflow-hidden shadow-inner">
                    <div className="h-full bg-orange-500 rounded-full transition-all duration-500 relative overflow-hidden" style={{ width: `${persenEmber}%` }}>
                        {/* Efek Garis Gerak */}
                        <div className="absolute top-0 left-0 bottom-0 right-0 bg-[linear-gradient(45deg,rgba(255,255,255,.2)_25%,transparent_25%,transparent_50%,rgba(255,255,255,.2)_50%,rgba(255,255,255,.2)_75%,transparent_75%,transparent)] bg-[length:1rem_1rem] animate-[spin_1s_linear_infinite]"></div>
                    </div>
                </div>
            </div>
            
            <p className="text-center text-xs text-orange-500 mt-3 font-medium bg-white/40 py-2 rounded-lg border border-orange-200/50">
                {beratEmber > 0 ? "Sedang menakar pakan..." : "Menunggu perintah..."}
            </p>
        </div>

        {/* BUTTON MANUAL */}
        <button onClick={() => setShowModal(true)} className="w-full bg-white border-2 border-dashed border-gray-300 text-gray-500 font-bold py-4 rounded-2xl hover:bg-gray-50 hover:border-emerald-400 hover:text-emerald-600 transition flex justify-center gap-2">
            + ISI EMBER MANUAL
        </button>

      </div>
    </div>
  );
}