import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Head from 'next/head';

export default function DetailAlat() {
  const router = useRouter();
  const { id } = router.query; 

  const [dataAlat, setDataAlat] = useState(null);
  const [loadingFeed, setLoadingFeed] = useState(false); // Buat status loading tombol
  
  // Data Jadwal (Simulasi - Nanti bisa ambil dari DB juga)
  const jadwal = [
    { id: 1, waktu: '07:00', label: 'Pagi', jumlah: 5, done: true }, 
    { id: 2, waktu: '16:00', label: 'Sore', jumlah: 5, done: false }, 
  ];

  // Ambil Data Realtime
  useEffect(() => {
    if(!id) return;

    const ambilData = async () => {
      try {
        // Asumsi endpoint ini balikin data alat
        // Kalau belum ada endpoint spesifik, dia bakal error, tapi UI tetep jalan
        const res = await fetch(`/api/update?id=${id}`); 
        const json = await res.json();
        if (json.success) setDataAlat(json.data);
      } catch (err) { console.error(err); }
    };
    
    ambilData();
    const interval = setInterval(ambilData, 2000); 
    return () => clearInterval(interval);
  }, [id]);

  // FUNGSI TOMBOL MANUAL
  const handlePakanManual = async () => {
    setLoadingFeed(true); // Mulai loading
    try {
        const res = await fetch('/api/trigger', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: id }) // Kirim ID alat (sekat_1)
        });
        
        const data = await res.json();
        
        if (res.ok) {
            alert("SUKSES! Perintah pakan dikirim ke kandang.");
        } else {
            alert("Gagal mengirim perintah.");
        }
    } catch (error) {
        console.error('Error:', error);
        alert("Terjadi kesalahan koneksi.");
    }
    setLoadingFeed(false); // Selesai loading
  };

  // Hitungan Visual Bar
  const kapasitasMax = 20; 
  const sisaPakan = dataAlat ? dataAlat.berat_pakan : 18.5; // Default dummy kalo db kosong
  const persentase = (sisaPakan / kapasitasMax) * 100;
  
  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-10">
      <Head>
        <title>Detail Kandang - Smart Feeder</title>
      </Head>

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
        
        {/* BUTTON MANUAL FEED DENGAN LOGIKA */}
        <button 
            onClick={handlePakanManual}
            disabled={loadingFeed}
            className={`w-full mt-8 border-2 font-bold py-4 rounded-2xl flex justify-center gap-2 transition-all active:scale-95
                ${loadingFeed 
                    ? 'bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed' 
                    : 'bg-white border-red-100 text-red-500 hover:bg-red-50 hover:border-red-200'
                }`}
        >
            {loadingFeed ? (
                <>
                    <svg className="animate-spin h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    SEDANG MEMPROSES...
                </>
            ) : (
                <>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5.636 5.636a9 9 0 1012.728 0M12 3v9" />
                    </svg>
                    BERI PAKAN MANUAL SEKARANG
                </>
            )}
        </button>

      </div>
    </div>
  );
}