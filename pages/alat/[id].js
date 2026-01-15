import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Head from 'next/head';

export default function DetailAlat() {
  const router = useRouter();
  const { id } = router.query; 

  const [dataAlat, setDataAlat] = useState(null);
  
  // State buat Popup (Modal)
  const [showModal, setShowModal] = useState(false);
  const [loadingFeed, setLoadingFeed] = useState(false);
  
  // State Form Manual
  const [inputKg, setInputKg] = useState(1); // Default 1 Kg
  const [selectedSekat, setSelectedSekat] = useState(id || 'sekat_1');

  // Config Status Sekat (Biar gampang ngatur mana yg dikunci)
  const listSekat = [
    { id: 'sekat_1', label: 'Sekat 1 (125 Bebek)', active: true },
    { id: 'sekat_2', label: 'Sekat 2', active: false }, // Belum terpasang
    { id: 'sekat_3', label: 'Sekat 3', active: false }, // Belum terpasang
    { id: 'sekat_4', label: 'Sekat 4', active: false }, // Belum terpasang
  ];

  // Update selectedSekat kalau ID URL berubah
  useEffect(() => {
    if(id) setSelectedSekat(id);
  }, [id]);

  // Data Jadwal Dummy
  const jadwal = [
    { id: 1, waktu: '07:00', label: 'Pagi', jumlah: 5, done: true }, 
    { id: 2, waktu: '16:00', label: 'Sore', jumlah: 5, done: false }, 
  ];

  // Ambil Data Realtime
  useEffect(() => {
    if(!id) return;
    const ambilData = async () => {
      try {
        const res = await fetch(`/api/update?id=${id}`); 
        const json = await res.json();
        if (json.success) setDataAlat(json.data);
      } catch (err) { console.error(err); }
    };
    ambilData();
    const interval = setInterval(ambilData, 2000); 
    return () => clearInterval(interval);
  }, [id]);

  // FUNGSI EKSEKUSI PAKAN
  const handleKirimPerintah = async () => {
    setLoadingFeed(true);
    try {
        const res = await fetch('/api/trigger', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                id: selectedSekat, // Kirim ID yang dipilih di dropdown
                kg: inputKg        // Kirim jumlah Kg
            }) 
        });
        
        if (res.ok) {
            setShowModal(false); // Tutup popup
            alert(`SUKSES! Pakan ${inputKg} Kg sedang dikirim ke ${selectedSekat}.`);
        } else {
            alert("Gagal mengirim perintah.");
        }
    } catch (error) {
        console.error('Error:', error);
        alert("Terjadi kesalahan koneksi.");
    }
    setLoadingFeed(false);
  };

  // Hitungan Visual Bar
  const kapasitasMax = 20; 
  const sisaPakan = dataAlat ? dataAlat.berat_pakan : 18.5; 
  const persentase = (sisaPakan / kapasitasMax) * 100;
  
  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-10 relative">
      <Head>
        <title>Detail Kandang - Smart Feeder</title>
      </Head>

      {/* --- POPUP MODAL --- */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Background Gelap Transparan */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowModal(false)}></div>
            
            {/* Kotak Modal */}
            <div className="bg-white rounded-3xl w-full max-w-sm p-6 relative z-10 shadow-2xl animate-bounce-in">
                <h3 className="text-xl font-bold text-gray-800 mb-1">Beri Pakan Manual</h3>
                <p className="text-gray-400 text-sm mb-6">Atur takaran dan tujuan pemberian pakan.</p>
                
                {/* 1. Pilih Jumlah KG */}
                <div className="mb-5">
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Jumlah Pakan (Kg)</label>
                    <div className="flex items-center gap-4">
                        <button onClick={() => setInputKg(prev => Math.max(0.1, prev - 0.5))} className="w-10 h-10 rounded-xl bg-gray-100 text-gray-600 font-bold hover:bg-gray-200">-</button>
                        <div className="flex-1 bg-gray-50 rounded-xl h-10 flex items-center justify-center border border-gray-200">
                            <input 
                                type="number" 
                                value={inputKg} 
                                onChange={(e) => setInputKg(parseFloat(e.target.value))}
                                className="bg-transparent text-center font-bold text-gray-800 w-full outline-none"
                            />
                        </div>
                        <button onClick={() => setInputKg(prev => prev + 0.5)} className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 font-bold hover:bg-emerald-200">+</button>
                    </div>
                </div>

                {/* 2. Pilih Sekat (Logic Locked) */}
                <div className="mb-8">
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Pilih Kandang Tujuan</label>
                    <div className="space-y-2">
                        {listSekat.map((sekat) => (
                            <div 
                                key={sekat.id}
                                onClick={() => sekat.active && setSelectedSekat(sekat.id)}
                                className={`p-3 rounded-xl border flex justify-between items-center transition-all
                                    ${!sekat.active 
                                        ? 'bg-gray-50 border-gray-100 opacity-50 cursor-not-allowed' // Style buat yg locked
                                        : selectedSekat === sekat.id 
                                            ? 'bg-emerald-50 border-emerald-500 ring-1 ring-emerald-500 cursor-pointer' 
                                            : 'bg-white border-gray-200 hover:border-emerald-300 cursor-pointer'
                                    }
                                `}
                            >
                                <span className={`text-sm font-medium ${!sekat.active ? 'text-gray-400' : 'text-gray-700'}`}>
                                    {sekat.label}
                                </span>
                                
                                {/* Icon Status */}
                                {sekat.active ? (
                                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center
                                        ${selectedSekat === sekat.id ? 'border-emerald-500' : 'border-gray-300'}
                                    `}>
                                        {selectedSekat === sekat.id && <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>}
                                    </div>
                                ) : (
                                    // Icon Gembok (Locked)
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-gray-400">
                                        <path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" />
                                    </svg>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Tombol Aksi */}
                <div className="flex gap-3">
                    <button 
                        onClick={() => setShowModal(false)}
                        className="flex-1 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition"
                    >
                        Batal
                    </button>
                    <button 
                        onClick={handleKirimPerintah}
                        disabled={loadingFeed}
                        className="flex-[2] py-3 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-200 transition flex justify-center items-center gap-2"
                    >
                        {loadingFeed ? 'Mengirim...' : 'Kirim Perintah'}
                    </button>
                </div>
            </div>
        </div>
      )}

      {/* HEADER */}
      <div className="bg-emerald-600 px-6 pt-8 pb-16 rounded-b-[2.5rem] shadow-lg relative">
         <div className="flex items-center gap-4 relative z-10">
            <Link href="/">
                <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm cursor-pointer hover:bg-white/30 transition">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-white">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                    </svg>
                </div>
            </Link>
            <h1 className="text-white text-xl font-bold">Detail Kandang</h1>
         </div>
      </div>

      <div className="px-6 -mt-10 relative z-20 max-w-md mx-auto">
        
        {/* KARTU MONITORING */}
        <div className="bg-white p-6 rounded-3xl shadow-xl shadow-emerald-900/5 border border-gray-100 mb-6">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h2 className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1">ID KANDANG: {id}</h2>
                    <p className="text-2xl font-bold text-gray-800">
                        {dataAlat ? dataAlat.nama : 'Kandang Sekat 1'}
                    </p>
                    <div className="mt-1 flex items-center gap-2">
                        <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-md font-bold">125 Bebek</span>
                    </div>
                </div>
                <div className={`w-3 h-3 rounded-full ${dataAlat ? 'bg-green-500 animate-pulse' : 'bg-green-500'}`}></div>
            </div>

            <div className="mb-2 text-center">
                <div className="relative w-40 h-40 mx-auto flex items-center justify-center mb-4">
                    <svg className="w-full h-full transform -rotate-90">
                        <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-gray-100" />
                        <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="12" fill="transparent" 
                            strokeDasharray={440} 
                            strokeDashoffset={440 - (440 * persentase) / 100} 
                            className={`${persentase < 30 ? 'text-red-500' : 'text-emerald-500'} transition-all duration-1000 ease-out`} 
                            strokeLinecap="round"
                        />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-3xl font-bold text-gray-800">{sisaPakan}</span>
                        <span className="text-xs text-gray-400">Kg Tersedia</span>
                    </div>
                </div>
                <p className="text-sm text-gray-500">Kapasitas Tong: <b>{kapasitasMax} Kg</b></p>
            </div>
        </div>

        {/* LIST JADWAL */}
        <h3 className="text-gray-800 font-bold mb-3 ml-1 text-lg">Jadwal Pakan Otomatis</h3>
        <div className="space-y-3">
            {jadwal.map((item) => (
                <div key={item.id} className="bg-white p-4 rounded-2xl border border-gray-100 flex justify-between items-center shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-sm ${item.label === 'Pagi' ? 'bg-orange-100 text-orange-600' : 'bg-indigo-100 text-indigo-600'}`}>
                            {item.waktu}
                        </div>
                        <div>
                            <p className="font-bold text-gray-800">Jatah {item.label}</p>
                            <p className="text-xs text-gray-400">{item.jumlah} Kg Konsentrat</p>
                        </div>
                    </div>
                    {item.done ? (
                        <div className="bg-green-100 text-green-700 p-1.5 rounded-full">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                                <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                            </svg>
                        </div>
                    ) : (
                        <span className="text-xs font-bold text-gray-400 bg-gray-100 px-2 py-1 rounded-md">Menunggu</span>
                    )}
                </div>
            ))}
        </div>
        
        {/* BUTTON BUKA POPUP */}
        <button 
            onClick={() => setShowModal(true)}
            className="w-full mt-8 bg-white border-2 border-red-100 text-red-500 font-bold py-4 rounded-2xl hover:bg-red-50 hover:border-red-200 transition active:scale-95 flex justify-center gap-2"
        >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5.636 5.636a9 9 0 1012.728 0M12 3v9" />
            </svg>
            BERI PAKAN MANUAL SEKARANG
        </button>

      </div>
    </div>
  );
}