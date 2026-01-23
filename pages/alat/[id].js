import { useRouter } from 'next/router';
import useSWR from 'swr';
import Head from 'next/head';

// Fetcher biar SWR bisa jalan
const fetcher = (url) => fetch(url).then((res) => res.json());

export default function DetailAlat() {
  const router = useRouter();
  const { id } = router.query;

  // TEKNIK REALTIME: Minta data ke /api/cekalat tiap 2 detik
  const { data: result, error } = useSWR(id ? `/api/cekalat?id=${id}` : null, fetcher, {
    refreshInterval: 2000, 
  });

  // Tampilan Loading
  if (!result && !error) return <div className="p-10 text-center font-bold text-gray-500">Menghubungkan ke Alat...</div>;
  
  const data = result?.data; 
  if (!data) return <div className="p-10 text-center text-red-500 font-bold">Alat ID "{id}" Tidak Ditemukan di Database</div>;

  // --- LOGIKA WARNING ---
  const isBahaya = data.berat_storage < 7.0; // Batas aman 7 Kg

  return (
    <div className={`min-h-screen transition-colors duration-500 ${isBahaya ? 'bg-red-50' : 'bg-green-50'}`}>
      <Head>
        <title>Monitor Gudang Pakan</title>
      </Head>

      <main className="max-w-md mx-auto p-6 flex flex-col items-center justify-center min-h-screen space-y-8">
        
        {/* HEADER */}
        <div className="text-center space-y-1">
          <h1 className="text-3xl font-black text-gray-800 tracking-tighter">GUDANG PAKAN</h1>
          <p className="text-sm font-mono text-gray-500 bg-white px-2 py-1 rounded inline-block border">
            ID: {data.id_alat}
          </p>
        </div>

        {/* --- KARTU UTAMA (Indikator Berat) --- */}
        <div className={`relative w-full p-10 rounded-3xl shadow-2xl border-4 text-center transition-all duration-300 transform 
          ${isBahaya ? 'bg-white border-red-500 scale-105' : 'bg-white border-green-500'}`}>
          
          <p className="text-gray-400 font-bold tracking-widest text-xs mb-4 uppercase">
            SISA STOK SAAT INI
          </p>

          {/* Angka Raksasa */}
          <div className="flex justify-center items-baseline gap-2 mb-4">
            <span className={`text-8xl font-black tracking-tighter ${isBahaya ? 'text-red-600' : 'text-gray-800'}`}>
              {data.berat_storage}
            </span>
            <span className="text-2xl text-gray-400 font-bold">Kg</span>
          </div>

          {/* Status Bar Bawah */}
          <div className={`py-3 px-6 rounded-xl font-bold text-sm inline-flex items-center gap-2 shadow-sm
            ${isBahaya ? 'bg-red-100 text-red-700 animate-pulse' : 'bg-green-100 text-green-700'}`}>
            {isBahaya ? (
              <>⚠️ KRITIS (KURANG DARI 7 KG)</>
            ) : (
              <>✅ STOK AMAN</>
            )}
          </div>
        </div>

        {/* --- PETUNJUK (Hanya muncul kalau bahaya) --- */}
        <div className={`transition-all duration-500 overflow-hidden ${isBahaya ? 'opacity-100 max-h-40' : 'opacity-0 max-h-0'}`}>
            <div className="bg-red-600 text-white p-5 rounded-xl shadow-lg text-center animate-bounce">
                <p className="font-bold text-lg mb-1">PERHATIAN!</p>
                <p className="text-sm opacity-90">Stok menipis. Segera isi ulang pakan ke dalam gudang.</p>
            </div>
        </div>

        <div className="text-xs text-gray-400 mt-10">
          Last Sync: {new Date().toLocaleTimeString()}
        </div>

      </main>
    </div>
  );
}