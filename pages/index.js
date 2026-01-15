import Head from 'next/head';
import Link from 'next/link';

export default function Home() {
  // Data simulasi (Hardcoded) - Nanti bisa diganti database kalau mau canggih
  const daftarAlat = [
    {
      id: 'sekat_1',
      nama: 'Kandang Sekat 1',
      populasi: 125,
      sisa: 18.5,
      kapasitas: 20,
      status: 'normal', // normal, warning, critical
    },
    {
      id: 'sekat_2',
      nama: 'Kandang Sekat 2',
      populasi: 100,
      sisa: 5.2,
      kapasitas: 20,
      status: 'warning',
    },
    {
      id: 'sekat_3',
      nama: 'Kandang Sekat 3',
      populasi: 110,
      sisa: 0,
      kapasitas: 20,
      status: 'critical',
    },
  ];

  // Fungsi helper buat nentuin warna status
  const getStatusColor = (status) => {
    switch(status) {
      case 'normal': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'warning': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'critical': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

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

      {/* HEADER DENGAN GRADASI */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-500 px-6 pt-10 pb-20 rounded-b-[2.5rem] shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <div>
            <p className="text-emerald-100 text-sm font-medium mb-1">Selamat Datang,</p>
            <h1 className="text-white text-2xl font-bold">Pak Nuryadi 👋</h1>
          </div>
          <div className="bg-white/20 p-2 rounded-full backdrop-blur-sm">
            {/* Icon User */}
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-white">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>
          </div>
        </div>
        
        {/* Ringkasan Singkat */}
        <div className="bg-white/10 rounded-xl p-4 flex justify-between items-center backdrop-blur-md border border-white/20">
            <div>
                <p className="text-emerald-50 text-xs">Total Ternak</p>
                <p className="text-white font-bold text-xl">335 <span className="text-sm font-normal">Ekor</span></p>
            </div>
            <div className="h-8 w-[1px] bg-white/30"></div>
            <div className="text-right">
                <p className="text-emerald-50 text-xs">Status Sistem</p>
                <div className="flex items-center gap-1 justify-end">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                    <p className="text-white font-bold text-sm">Online</p>
                </div>
            </div>
        </div>
      </div>

      {/* CONTENT LIST KANDANG */}
      <div className="px-5 -mt-10">
        <h2 className="text-gray-800 font-bold mb-4 ml-1">Daftar Kandang</h2>
        
        <div className="space-y-4">
          {daftarAlat.map((alat) => {
            const persentase = (alat.sisa / alat.kapasitas) * 100;
            
            return (
              <Link href={`/alat/${alat.id}`} key={alat.id}>
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all active:scale-[0.98] cursor-pointer relative overflow-hidden group">
                  
                  {/* Dekorasi background tipis */}
                  <div className="absolute top-0 right-0 -mt-2 -mr-2 w-20 h-20 bg-gray-50 rounded-full opacity-50 group-hover:bg-emerald-50 transition-colors"></div>

                  <div className="flex justify-between items-start mb-3 relative z-10">
                    <div>
                        <h3 className="font-bold text-gray-800 text-lg">{alat.nama}</h3>
                        <p className="text-gray-400 text-xs flex items-center gap-1">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
                                <path d="M10 9a3 3 0 100-6 3 3 0 000 6zM6 8a2 2 0 11-4 0 2 2 0 014 0zM1.49 15.326a.78.78 0 01-.358-.442 3 3 0 014.308-3.516 6.484 6.484 0 00-1.905 3.959c-.023.222-.014.442.025.654a4.97 4.97 0 01-2.07-.655zM16.44 15.98a4.97 4.97 0 002.07-.654.78.78 0 00.358-.442 3 3 0 01-4.308-3.516 6.484 6.484 0 001.905 3.959c.023.222.014.442-.025.654zM12.82 8a2 2 0 11-4 0 2 2 0 014 0zM10.22 11.474a6 6 0 00-8.415 6.06.75.75 0 00.864.848 7.974 7.974 0 0114.662 0 .75.75 0 00.864-.848 6 6 0 00-8.415-6.06l-.28.14z" />
                            </svg>
                            {alat.populasi} Bebek
                        </p>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-1 rounded-full border ${getStatusColor(alat.status)} uppercase tracking-wide`}>
                        {alat.status === 'normal' ? 'Aman' : alat.status === 'warning' ? 'Hampir Habis' : 'Habis!'}
                    </span>
                  </div>

                  {/* Progress Bar Pakan */}
                  <div className="mt-4 relative z-10">
                    <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-500 text-xs">Sisa Pakan</span>
                        <span className="font-bold text-gray-800 text-xs">{alat.sisa} Kg</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                        <div 
                            className={`h-2.5 rounded-full transition-all duration-500 ${getBarColor(alat.sisa, alat.kapasitas)}`} 
                            style={{ width: `${persentase}%` }}
                        ></div>
                    </div>
                  </div>

                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}