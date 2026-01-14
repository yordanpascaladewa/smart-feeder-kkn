import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Head from 'next/head';

export default function DetailAlat() {
  const router = useRouter();
  const { id } = router.query; 

  // STATE: Buat nyimpen data asli dari database
  const [dataAlat, setDataAlat] = useState(null);
  
  // DATA JADWAL (Tetap Hardcode sesuai request)
  const jadwal = [
    { id: 1, waktu: '09:00', label: 'Pagi', jumlah: 7 }, 
    { id: 2, waktu: '15:00', label: 'Sore', jumlah: 8 }, 
  ];

  // EFFEK: "Polling" (Nanya ke database tiap 2 detik)
  useEffect(() => {
    const ambilData = async () => {
      try {
        const res = await fetch('/api/update'); // Nembak API yang lu buat tadi
        const json = await res.json();
        if (json.success) {
          setDataAlat(json.data);
        }
      } catch (err) {
        console.error("Gagal ambil data", err);
      }
    };

    ambilData(); // Ambil langsung pas dibuka
    const interval = setInterval(ambilData, 2000); // Ulangi tiap 2 detik (Realtime)
    
    return () => clearInterval(interval); // Stop kalo pindah halaman
  }, []);

  // PERHITUNGAN VISUAL
  const kapasitasMax = 20; 
  // Kalau data belum masuk, anggap 0. Kalau udah ada, pake data dari DB.
  const sisaPakan = dataAlat ? dataAlat.berat_pakan : 0;  
  const persentase = (sisaPakan / kapasitasMax) * 100;

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-10">
      <Head>
        <title>Detail Kandang - Smart Feeder</title>
      </Head>

      {/* HEADER */}
      <div className="bg-white px-4 py-4 shadow-sm flex items-center gap-4 sticky top-0 z-10">
        <Link href="/">
          <div className="p-2 rounded-full hover:bg-gray-100 cursor-pointer text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
          </div>
        </Link>
        <h1 className="text-lg font-bold text-gray-800">Detail Kandang</h1>
      </div>

      <div className="px-5 mt-6 max-w-md mx-auto">
        
        {/* KARTU MONITORING PAKAN */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-6">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h2 className="text-gray-500 text-sm mb-1">Lokasi</h2>
                    <p className="text-xl font-bold text-gray-800 uppercase">
                        {/* Pake nama dari DB kalau ada, kalau belum loading... */}
                        {dataAlat ? dataAlat.nama : 'Memuat data...'}
                    </p>
                </div>
                <div className="text-right">
                    <h2 className="text-gray-500 text-sm mb-1">Status Sensor</h2>
                    <span className={`text-xs px-2 py-1 rounded-full font-bold ${dataAlat ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {dataAlat ? 'Online' : 'Connecting...'}
                    </span>
                </div>
            </div>

            {/* Visualisasi Bar Sisa Pakan */}
            <div className="mb-2">
                <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Sisa Pakan</span>
                    <span className="font-bold text-gray-800">
                        {dataAlat ? dataAlat.berat_pakan : 0} Kg 
                        <span className="text-gray-400 font-normal"> / {kapasitasMax} Kg</span>
                    </span>
                </div>
                {/* Bar Level Pakan */}
                <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden relative">
                    <div 
                        className={`h-4 rounded-full transition-all duration-1000 ${persentase < 30 ? 'bg-red-500' : 'bg-blue-500'}`} 
                        style={{ width: `${persentase}%` }}
                    ></div>
                </div>
                <p className="text-xs text-gray-400 mt-2 text-center">
                    Data diperbarui otomatis setiap 2 detik
                </p>
            </div>
        </div>

        {/* LIST JADWAL OTOMATIS */}
        <div className="flex justify-between items-end mb-4">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Jadwal Pakan</h3>
            <button className="text-xs bg-gray-200 text-gray-500 px-3 py-2 rounded-lg font-medium cursor-not-allowed">
                Terkunci (Otomatis)
            </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {jadwal.map((item, index) => (
                <div key={item.id} className={`flex justify-between items-center p-4 ${index !== jadwal.length - 1 ? 'border-b border-gray-100' : ''}`}>
                    <div className="flex items-center gap-4">
                        <div className="bg-blue-50 text-blue-600 font-bold px-3 py-2 rounded-lg text-sm text-center min-w-[60px]">
                            {item.waktu}
                            <div className="text-[10px] font-normal text-blue-400">{item.label}</div>
                        </div>
                        <div>
                            <p className="text-gray-800 font-bold text-lg">{item.jumlah} <span className="text-sm font-normal text-gray-500">Kg</span></p>
                            <p className="text-xs text-gray-400">Pakan Konsentrat</p>
                        </div>
                    </div>
                    
                    {/* Status Eksekusi */}
                    <div>
                        {item.label === 'Pagi' ? (
                             <span className="text-green-500 text-xs font-bold flex items-center gap-1">
                                Selesai
                             </span>
                        ) : (
                            <span className="text-gray-400 text-xs font-bold flex items-center gap-1">
                                Menunggu
                             </span>
                        )}
                    </div>
                </div>
            ))}
        </div>
        
        {/* Tombol Manual (Darurat) */}
        <div className="mt-8">
            <button className="w-full bg-red-50 text-red-600 border border-red-200 font-bold py-3 rounded-xl hover:bg-red-100 transition active:scale-95 flex justify-center items-center gap-2">
                BERI PAKAN MANUAL
            </button>
        </div>

      </div>
    </div>
  );
}