import Head from 'next/head';
import Link from 'next/link';

export default function Home() {
  // CONFIGURASI DATA KANDANG
  const daftarAlat = [
    {
      id: 'sekat_1',
      nama: 'Kandang Sekat 1',
      populasi: 125, // Sesuai request
      sisa: 18.5,    // Nanti ini idealnya ambil dari database, skrg hardcode visual dulu
      kapasitas: 20,
      status: 'normal',
      aktif: true,   // Penanda kandang aktif
    },
    {
      id: 'sekat_2',
      nama: 'Kandang Sekat 2',
      populasi: 0,
      status: 'offline',
      aktif: false,  // Kandang belum dipasang
    },
    {
      id: 'sekat_3',
      nama: 'Kandang Sekat 3',
      populasi: 0,
      status: 'offline',
      aktif: false,
    },
    {
      id: 'sekat_4',
      nama: 'Kandang Sekat 4',
      populasi: 0,
      status: 'offline',
      aktif: false,
    },
  ];

  const getBarColor = (sisa, kapasitas) => {
    const persen = (sisa / kapasitas) * 100;
    if (persen > 50) return 'bg-emerald-500';
    if (persen > 20) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-20">
      <Head>
        <title>Dashboard - Smart Feeder</title>
      </Head>

      {/* HEADER GRADASI */}
      <div className="bg-gradient-to-br from-emerald-600 to-teal-700 px-6 pt-12 pb-24 rounded-b-[3rem] shadow-xl relative overflow-hidden">
        {/* Hiasan Background (Lingkaran transparan) */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full -ml-10 -mb-10 blur-xl"></div>

        <div className="relative z-10 flex justify-between items-start mb-6">
          <div>
            <p className="text-emerald-100 text-sm font-medium mb-1">Assalamualaikum,</p>
            <h1 className="text-white text-3xl font-bold tracking-tight">Pak Nuryadi</h1>
          </div>
          <div className="bg-white/20 p-2.5 rounded-2xl backdrop-blur-md border border-white/10 shadow-lg">
             {/* Icon User */}
             <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-white">
              <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
        
        {/* RINGKASAN GLOBAL */}
        <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
                <p className="text-emerald-100 text-xs mb-1">Total Populasi</p>
                <p className="text-white font-bold text-2xl">125 <span className="text-sm font-normal opacity-80">Ekor</span></p>
            </div>
             <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
                <p className="text-emerald-100 text-xs mb-1">Status Sistem</p>
                <div className="flex items-center gap-2">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-green-400"></span>
                    </span>
                    <p className="text-white font-bold text-lg">Online</p>
                </div>
            </div>
        </div>
      </div>

      {/* LIST KANDANG */}
      <div className="px-6 -mt-12 relative z-20 space-y-5">
        <h2 className="text-gray-800 font-bold text-lg ml-1">Monitoring Kandang</h2>
        
        {daftarAlat.map((alat) => {
          // Kalo kandang AKTIF (Sekat 1)
          if (alat.aktif) {
            const persentase = (alat.sisa / alat.kapasitas) * 100;
            return (
              <Link href={`/alat/${alat.id}`} key={alat.id}>
                <div className="bg-white p-5 rounded-3xl shadow-lg shadow-gray-200/50 border border-gray-100 active:scale-[0.98] transition-transform duration-200 cursor-pointer group">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                        <div className="bg-emerald-100 p-3 rounded-2xl text-emerald-600">
                             {/* Icon Kandang */}
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                                <path d="M19.006 3.705a.75.75 0 00-.512-1.41L6 6.838V3a.75.75 0 00-.75-.75h-1.5A.75.75 0 003 3v4.93l-1.006.365a.75.75 0 00.512 1.41l16.5-6z" />
                                <path fillRule="evenodd" d="M3.019 11.114L18 5.667v3.421l4.006 1.457a.75.75 0 11-.512 1.41l-.494-.18v8.475h.75a.75.75 0 010 1.5H2.25a.75.75 0 010-1.5H3v-9.129l.019-.007zM18 20.25v-9.566l1.5.546v9.02H18zM6.6 20.25h1.5a.75.75 0 000-1.5h-1.5a.75.75 0 000 1.5zM6.6 16.5h1.5a.75.75 0 000-1.5h-1.5a.75.75 0 000 1.5zM10.5 20.25h1.5a.75.75 0 000-1.5h-1.5a.75.75 0 000 1.5zM10.5 16.5h1.5a.75.75 0 000-1.5h-1.5a.75.75 0 000 1.5zM14.4 20.25h1.5a.75.75 0 000-1.5h-1.5a.75.75 0 000 1.5zM14.4 16.5h1.5a.75.75 0 000-1.5h-1.5a.75.75 0 000 1.5z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-800 text-lg">{alat.nama}</h3>
                            <p className="text-gray-400 text-xs font-medium">{alat.populasi} Ekor Bebek</p>
                        </div>
                    </div>
                    <div className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2.5 py-1 rounded-full border border-emerald-100">
                        AMAN
                    </div>
                  </div>

                  {/* Indikator Pakan */}
                  <div className="bg-gray-50 rounded-2xl p-4">
                    <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-500 text-xs font-semibold">Kapasitas Pakan</span>
                        <span className="font-bold text-gray-800 text-xs">{alat.sisa} / {alat.kapasitas} Kg</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                        <div 
                            className={`h-3 rounded-full transition-all duration-1000 ${getBarColor(alat.sisa, alat.kapasitas)}`} 
                            style={{ width: `${persentase}%` }}
                        ></div>
                    </div>
                  </div>
                </div>
              </Link>
            );
          } 
          
          // Kalo kandang TIDAK AKTIF (Sekat 2,3,4)
          else {
            return (
              <div key={alat.id} className="bg-white p-5 rounded-3xl border border-gray-100 opacity-60 grayscale">
                 <div className="flex items-center gap-3">
                    <div className="bg-gray-100 p-3 rounded-2xl text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                        </svg>
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-800 text-lg">{alat.nama}</h3>
                        <p className="text-gray-400 text-xs font-medium italic">Belum terpasang</p>
                    </div>
                 </div>
              </div>
            );
          }
        })}
      </div>
    </div>
  );
}