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
  
  // STATE SIMULASI
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulatedBerat, setSimulatedBerat] = useState(0);

  // State Form Manual
  const [inputKg, setInputKg] = useState(1);
  const [selectedSekat, setSelectedSekat] = useState(id || 'sekat_1');

  // Config Dummy Status Sekat
  const listSekat = [
    { id: 'Sekat 1', label: 'Sekat 1', active: true },
    { id: 'Sekat 2', label: 'Sekat 2', active: false }, 
    { id: 'Sekat 3', label: 'Sekat 3', active: false }, 
    { id: 'Sekat 4', label: 'Sekat 4', active: false }, 
  ];

  // JADWAL PAKAN (Updated Sesuai Request)
  const jadwal = [
    { id: 1, waktu: '09:00 WIB', label: 'Pagi', jumlah: 7, done: true },
    { id: 2, waktu: '15:00 WIB', label: 'Sore', jumlah: 8, done: false },
  ];

  // Update selectedSekat kalau ID URL berubah
  useEffect(() => {
    if(id) setSelectedSekat(id);
  }, [id]);

  // Ambil Data Realtime
  useEffect(() => {
    if(!id) return;
    const ambilData = async () => {
      try {
        const res = await fetch(`/api/update?id=${id}`); 
        const json = await res.json();
        // Kalau lagi simulasi, jangan timpa data visual dengan data DB dulu
        if (json.success && !isSimulating) {
            setDataAlat(json.data);
        }
      } catch (err) { console.error(err); }
    };
    ambilData();
    const interval = setInterval(ambilData, 2000); 
    return () => clearInterval(interval);
  }, [id, isSimulating]); // Dependency ditambah isSimulating

  // --- FUNGSI SIMULASI VISUAL ---
  const runSimulation = (target) => {
    setIsSimulating(true);
    let current = 0;
    const step = 0.2; // Nambah setiap 0.2 kg
    const speed = 100; // Kecepatan update (ms)

    const timer = setInterval(() => {
        current += step;
        
        // Cek kalau udah nyampe target
        if (current >= target) {
            current = target;
            clearInterval(timer);
            setIsSimulating(false);
            
            // Simpan hasil akhir ke Database "Pura-pura" biar permanen
            // (Nembak API update biar kalau direfresh angkanya tetep segitu)
            fetch(`/api/update?id=${selectedSekat}&ember=${target}`);
        }
        
        setSimulatedBerat(parseFloat(current.toFixed(1)));
    }, speed);
  };

  // FUNGSI EKSEKUSI PAKAN
  const handleKirimPerintah = async () => {
    setLoadingFeed(true);
    try {
        // 1. Kirim perintah ke Backend (Trigger)
        const res = await fetch('/api/trigger', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: selectedSekat, kg: inputKg }) 
        });
        
        if (res.ok) {
            setShowModal(false); 
            // 2. Jalankan Animasi Simulasi
            runSimulation(inputKg);
        } else {
            alert("Gagal mengirim perintah.");
        }
    } catch (error) {
        alert("Terjadi kesalahan koneksi.");
    }
    setLoadingFeed(false);
  };

  // HITUNGAN VISUAL
  // 1. Storage
  const maxStorage = 20; 
  const beratStorage = dataAlat ? dataAlat.berat_storage : 20; 
  const persenStorage = (beratStorage / maxStorage) * 100;

  // 2. Ember (Pake logika: Kalo simulasi jalan, pake data simulasi. Kalo enggak, pake data DB)
  const maxEmber = 10;   
  const beratEmberDisplay = isSimulating ? simulatedBerat : (dataAlat ? dataAlat.berat_ember : 0);
  const persenEmber = (beratEmberDisplay / maxEmber) * 100;
  
  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-10">
      <Head>
        <title>Detail Kandang</title>
      </Head>

      {/* --- POPUP MODAL --- */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowModal(false)}></div>
            <div className="bg-white rounded-3xl w-full max-w-sm p-6 relative z-10 animate-bounce-in shadow-2xl">
                <h3 className="text-xl font-bold text-gray-800 mb-1">Beri Pakan Manual</h3>
                <p className="text-gray-400 text-sm mb-6">Pengisian ember pakan</p>
                
                <div className="mb-5">
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Target Pakan (Kg)</label>
                    <div className="flex items-center gap-4">
                        <button onClick={() => setInputKg(prev => Math.max(0.1, prev - 0.1))} className="w-10 h-10 rounded-xl bg-gray-100 font-bold hover:bg-gray-200">-</button>
                        <div className="flex-1 bg-gray-50 rounded-xl h-10 flex items-center justify-center border border-gray-200">
                            <input type="number" value={inputKg} onChange={(e) => setInputKg(parseFloat(e.target.value))} className="bg-transparent text-center font-bold text-gray-800 w-full outline-none"/>
                        </div>
                        <button onClick={() => setInputKg(prev => prev + 0.1)} className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 font-bold hover:bg-emerald-200">+</button>
                    </div>
                </div>

                <button onClick={handleKirimPerintah} disabled={loadingFeed} className="w-full py-3 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-200 transition">
                    {loadingFeed ? 'Memproses...' : `MULAI ISI ${inputKg} KG`}
                </button>
            </div>
        </div>
      )}

      {/* HEADER */}
      <div className="bg-emerald-600 px-6 pt-8 pb-20 rounded-b-[2.5rem] shadow-lg relative z-0">
         <div className="flex items-center gap-4">
            <Link href="/">
                <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm cursor-pointer hover:bg-white/30 transition text-white">
                    🔙
                </div>
            </Link>
            <h1 className="text-white text-xl font-bold">Kontrol Pakan</h1>
         </div>
      </div>

      <div className="px-5 -mt-16 relative z-10 max-w-md mx-auto space-y-5">
        
        {/* KARTU 1: STORAGE UTAMA */}
        <div className="bg-white p-5 rounded-3xl shadow-lg border border-gray-100 flex items-center justify-between">
            <div>
                <h2 className="text-gray-400 text-[10px] font-bold uppercase tracking-wider">Storage Pakan</h2>
                <p className="text-3xl font-bold text-gray-800">{beratStorage} <span className="text-sm text-gray-400 font-normal">Kg</span></p>
                <div className="flex items-center gap-1 mt-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <p className="text-xs text-emerald-600 font-medium">Stok Aman</p>
                </div>
            </div>
            {/* Donut Chart Simple */}
            <div className="relative w-20 h-20 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                    <circle cx="40" cy="40" r="32" stroke="#f3f4f6" strokeWidth="6" fill="transparent"/>
                    <circle cx="40" cy="40" r="32" stroke="#10b981" strokeWidth="6" fill="transparent"
                        strokeDasharray={201} strokeDashoffset={201 - (201 * persenStorage) / 100} strokeLinecap="round" />
                </svg>
                <span className="absolute text-[10px] font-bold text-gray-600">{Math.round(persenStorage)}%</span>
            </div>
        </div>

        {/* KARTU 2: EMBER PENAKAR (ANIMASI DISINI) */}
        <div className={`p-6 rounded-3xl border shadow-lg transition-all duration-500 overflow-hidden relative
            ${isSimulating ? 'bg-orange-50 border-orange-300 ring-2 ring-orange-200' : 'bg-white border-orange-100'}
        `}>
            {/* Background Animation Pas Ngisi */}
            {isSimulating && (
                <div className="absolute inset-0 bg-orange-100/50 flex items-center justify-center z-0">
                    <div className="w-40 h-40 bg-orange-400/10 rounded-full animate-ping"></div>
                </div>
            )}

            <div className="relative z-10">
                <div className="flex justify-between items-start mb-2">
                    <div>
                        <h2 className="text-orange-600/70 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3"><path d="M10 2a.75.75 0 01.75.75v1.5H18a.75.75 0 01.75.75v5.5a.75.75 0 01-.75.75h-1.5v5a2 2 0 01-2 2h-9a2 2 0 01-2-2v-5H2a.75.75 0 01-.75-.75V5a.75.75 0 01.75-.75h7.25v-1.5A.75.75 0 0110 2z" /></svg>
                            Ember Pakan
                        </h2>
                        {/* ANGKA UTAMA */}
                        <p className={`text-4xl font-black mt-1 transition-all ${isSimulating ? 'text-orange-600 scale-110 origin-left' : 'text-gray-800'}`}>
                            {beratEmberDisplay} <span className="text-lg font-bold text-gray-400">Kg</span>
                        </p>
                    </div>
                    <div className="text-right">
                         <span className={`text-[10px] font-bold px-2 py-1 rounded-full border uppercase
                            ${isSimulating 
                                ? 'bg-orange-500 text-white border-orange-600 animate-pulse' 
                                : 'bg-gray-100 text-gray-500 border-gray-200'}
                         `}>
                            {isSimulating ? 'Sedang Mengisi...' : 'Standby'}
                        </span>
                    </div>
                </div>

                {/* Bar Progress */}
                <div className="mt-4">
                    <div className="flex justify-between text-[10px] font-bold text-gray-400 mb-1">
                        <span>0 Kg</span>
                        <span>{maxEmber} Kg (Max)</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden box-border border border-gray-100">
                        <div 
                            className="h-full bg-orange-500 rounded-full transition-all duration-300 ease-out relative" 
                            style={{ width: `${persenEmber}%` }}
                        >
                            {isSimulating && <div className="absolute inset-0 bg-white/30 animate-pulse"></div>}
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* LIST JADWAL (UPDATED) */}
        <div>
            <h3 className="text-gray-800 font-bold mb-3 ml-1 text-sm">Jadwal Pakan Otomatis</h3>
            <div className="space-y-3">
                {jadwal.map((item) => (
                    <div key={item.id} className="bg-white p-4 rounded-2xl border border-gray-100 flex justify-between items-center shadow-sm">
                        <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-sm ${item.label === 'Pagi' ? 'bg-blue-50 text-blue-600' : 'bg-indigo-50 text-indigo-600'}`}>
                                {item.waktu}
                            </div>
                            <div>
                                <p className="font-bold text-gray-800">Jatah {item.label}</p>
                                <p className="text-xs text-gray-400 font-medium">{item.jumlah} Kg Pakan</p>
                            </div>
                        </div>
                        {item.done ? (
                            <div className="bg-green-100 text-green-700 p-1.5 rounded-full">✓</div>
                        ) : (
                            <span className="text-[10px] font-bold text-gray-400 bg-gray-50 px-2 py-1 rounded-md border border-gray-100">Menunggu</span>
                        )}
                    </div>
                ))}
            </div>
        </div>
        
        {/* TOMBOL ACTION */}
        <button onClick={() => setShowModal(true)} className="w-full bg-white border-2 border-dashed border-emerald-300 text-emerald-600 font-bold py-4 rounded-2xl hover:bg-emerald-50 transition active:scale-95 flex justify-center gap-2 shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
            BERI PAKAN MANUAL
        </button>

      </div>
    </div>
  );
}