import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function Dashboard() {
  // data disesuaikan: sekat 1 aktif, sisanya placeholder (rencana pengembangan)
  const [daftarAlat, setDaftarAlat] = useState([
    { id: 'sekat_1', nama: 'Sekat 1', berat: 18.5, status: 'online' }, // penuh 20kg, kepake dikit
    { id: 'sekat_2', nama: 'Sekat 2', berat: 0, status: 'offline' },
    { id: 'sekat_3', nama: 'Sekat 3', berat: 0, status: 'offline' },
    { id: 'sekat_4', nama: 'Sekat 4', berat: 0, status: 'offline' },
  ]);

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-10">
      <Head>
        <title>Peternakan Desa Ponowareng</title>
      </Head>

      {/* HEADER */}
      <div className="bg-white px-6 py-5 shadow-sm flex justify-between items-center sticky top-0 z-10">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 tracking-tight">PETERNAKAN DESA PONOWARENG</h1>
          <p className="text-xs text-gray-500 mt-1">Peternakan Pak Nuryadi</p>
        </div>
        <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center font-bold text-blue-600">
                YP
            </div>
        </div>
      </div>

      {/* KONTEN UTAMA */}
      <div className="px-6 mt-6 max-w-md mx-auto">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
          Status Kandang
        </h2>

        <div className="space-y-4">
          {daftarAlat.map((alat) => (
            <Link href={alat.status === 'online' ? `/alat/${alat.id}` : '#'} key={alat.id}>
              <div className={`p-5 rounded-2xl shadow-sm border transition-all flex justify-between items-center group 
                ${alat.status === 'online' 
                  ? 'bg-white border-gray-100 hover:shadow-md cursor-pointer active:scale-95' 
                  : 'bg-gray-100 border-gray-200 opacity-70 cursor-not-allowed'}`}>
                
                {/* Info Alat */}
                <div>
                    <h3 className="text-lg font-bold text-gray-800">
                        {alat.nama}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                        {/* Indikator Status */}
                        <span className={`w-2 h-2 rounded-full ${alat.status === 'online' ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></span>
                        
                        {alat.status === 'online' ? (
                          <p className="text-sm text-gray-500">
                              Sisa Pakan: <span className="font-semibold text-gray-700">{alat.berat} / 20 Kg</span>
                          </p>
                        ) : (
                          <p className="text-xs text-gray-400 italic">Belum terpasang</p>
                        )}
                    </div>
                </div>

                {/* ikon panah (cuma muncul kalau online) */}
                {alat.status === 'online' && (
                  <div className="bg-gray-50 p-2 rounded-full group-hover:bg-blue-50 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-gray-400 group-hover:text-blue-500">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                      </svg>
                  </div>
                )}

              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}