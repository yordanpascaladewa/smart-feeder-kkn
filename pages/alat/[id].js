import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Head from 'next/head';

export default function DetailAlat() {
  const router = useRouter();
  const { id } = router.query; 

  const [dataAlat, setDataAlat] = useState(null);
  
  // Data Jadwal (Simulasi)
  const jadwal = [
    { id: 1, waktu: '09.00', label: 'Pagi', jumlah: 7, done: true }, 
    { id: 2, waktu: '15:00', label: 'Sore', jumlah: 8, done: false }, 
  ];

  // Ambil Data Realtime
  useEffect(() => {
    const ambilData = async () => {
      try {
        const res = await fetch('/api/update');
        const json = await res.json();
        if (json.success) setDataAlat(json.data);
      } catch (err) { console.error(err); }
    };
    ambilData();
    const interval = setInterval(ambilData, 2000); // Update tiap 2 detik
    return () => clearInterval(interval);
  }, []);

  // Hitungan Bar
  const kapasitasMax = 20; 
  const sisaPakan = dataAlat ? dataAlat.berat_pakan : 0;  
  const persentase = (sisaPakan / kapasitasMax) * 100;
  
  // Warna Bar
  const getBarColor = (persen) => {
    if (persen > 50) return 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]';
    if (persen > 20) return 'bg-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.5)]';
    return 'bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)]';
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-10">
      <Head>
        <title>Detail Kandang - Peternakan BUMDes</title>
      </Head>

      {/* HEADER HIJAU */}
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
        
        {/* KARTU UTAMA */}
        <div className="bg-white p-6 rounded-3xl shadow-xl shadow-emerald-900/5 border border-gray-100 mb-6">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h2 className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1">Nama Kandang</h2>
                    <p className="text-2xl font-bold text-gray-800">
                        {dataAlat ? dataAlat.nama : 'Memuat...'}
                    </p>
                    <div className="mt-1 flex items-center gap-2">
                        <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-md font-bold">125 Bebek</span>
                        <span className="text-xs text-gray-400">|</span>
                        <span className="text-xs text-gray-400">Sensor Aktif</span>
                    </div>
                </div>
                {/* Status Bulet */}
                <div className={`w-3 h-3 rounded-full ${dataAlat ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`}></div>
            </div>

            {/* VISUALISASI PAKAN BESAR */}
            <div className="mb-2 text-center">
                <div className="relative w-40 h-40 mx-auto flex items-center justify-center mb-4">
                    {/* Lingkaran Background */}
                    <svg className="w-full h-full transform -rotate-90">
                        <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-gray-100" />
                        <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="12" fill="transparent" 
                            strokeDasharray={440} 
                            strokeDashoffset={440 - (440 * persentase) / 100} 
                            className={`${persentase < 30 ? 'text-red-500' : 'text-emerald-500'} transition-all duration-1000 ease-out`} 
                            strokeLinecap="round"
                        />
                    </svg>
                    {/* Angka Tengah */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-3xl font-bold text-gray-800">{sisaPakan}</span>
                        <span className="text-xs text-gray-400">Kg Tersedia</span>
                    </div>
                </div>
                <p className="text-sm text-gray-500">Kapasitas Pakan: <b>{kapasitasMax} Kg</b></p>
            </div>
        </div>

        {/* JADWAL LIST */}
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
                            <p className="text-xs text-gray-400">{item.jumlah} Kg</p>
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
        
        {/* BUTTON EMERGENCY */}
        <button className="w-full mt-8 bg-white border-2 border-red-100 text-red-500 font-bold py-4 rounded-2xl hover:bg-red-50 hover:border-red-200 transition active:scale-95 flex justify-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5.636 5.636a9 9 0 1012.728 0M12 3v9" />
            </svg>
            BERI PAKAN MANUAL SEKARANG
        </button>

      </div>
    </div>
  );
}