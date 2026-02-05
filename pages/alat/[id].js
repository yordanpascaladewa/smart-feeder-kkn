import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

export default function AlatDetail() {
  const router = useRouter();
  const { id } = router.query; 

  const [beratGudang, setBeratGudang] = useState(0);
  const [statusAlat, setStatusAlat] = useState("Offline");
  const [durasi, setDurasi] = useState(""); // Input Durasi
  const [loading, setLoading] = useState(false);
  
  const KAPASITAS_MAX = 10.0; // Kg

  // 1. POLLING DATA
  useEffect(() => {
    if(!id) return;
    const interval = setInterval(() => {
      fetch(`/api/hardware?id=${id}`)
        .then((res) => res.json())
        .then((data) => {
          if(data) {
            setBeratGudang(parseFloat(data.sisa_pakan || 0));
            setStatusAlat(data.status_alat || "Offline");
          }
        })
        .catch(err => console.log("Koneksi Error"));
    }, 2000);
    return () => clearInterval(interval);
  }, [id]);

  // 2. KIRIM PERINTAH
  const handleBeriPakan = async () => {
    if (!durasi || durasi <= 0) return alert("Masukkan durasi buka (detik)!");
    setLoading(true);

    try {
      const res = await fetch('/api/hardware', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: id,
          perintah: "MAJU", 
          target: parseFloat(durasi) // Kirim durasi sebagai 'target'
        })
      });

      if(res.ok) {
        alert(`✅ Perintah dikirim! Membuka selama ${durasi} detik.`);
        setDurasi(""); 
      }
    } catch (error) {
      alert("Gagal konek server.");
    }
    setLoading(false);
  };

  const persenIsi = Math.min((beratGudang / KAPASITAS_MAX) * 100, 100);
  const isHabis = beratGudang < 0.5; // Warning kalau < 0.5 Kg
  const statusColor = statusAlat === "STANDBY" ? "#10B981" : (statusAlat === "Offline" ? "#9CA3AF" : "#F59E0B");

  return (
    <div style={s.page}>
      <Head><title>Monitoring Peternakan</title></Head>
      
      {/* NAVBAR */}
      <nav style={s.nav}>
        <div style={s.navContent}>
          <h1 style={s.logo}>🦆 SmartFeed Pro</h1>
          <span style={s.badgeID}>UNIT: {id}</span>
        </div>
      </nav>

      <main style={s.main}>
        
        {/* STATUS CARD */}
        <div style={s.statusBanner}>
          <div style={{...s.statusDot, backgroundColor: statusColor}}></div>
          <p>Status Sistem: <b>{statusAlat}</b></p>
        </div>

        <div style={s.grid}>
          
          {/* KARTU 1: MONITORING GUDANG */}
          <div style={s.card}>
            <div style={s.cardHeader}>
              <h3>📦 Stok Gudang</h3>
              <span style={{fontSize:'12px', color:'#6B7280'}}>Realtime</span>
            </div>
            
            <div style={s.gaugeContainer}>
              <div style={s.circleOuter}>
                <div style={s.circleInner}>
                  <h1 style={{fontSize:'3rem', margin:0, color:'#1F2937'}}>{beratGudang.toFixed(1)}</h1>
                  <span style={{color:'#6B7280'}}>Kilogram</span>
                </div>
                {/* Lingkaran Progress CSS Sederhana */}
                <svg style={s.svg} viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="45" fill="none" stroke="#E5E7EB" strokeWidth="8" />
                  <circle cx="50" cy="50" r="45" fill="none" stroke={isHabis ? "#EF4444" : "#3B82F6"} strokeWidth="8" 
                          strokeDasharray="283" strokeDashoffset={283 - (283 * persenIsi / 100)} 
                          style={{transition: 'all 1s ease', transform: 'rotate(-90deg)', transformOrigin: '50% 50%'}} />
                </svg>
              </div>
            </div>

            {isHabis && (
              <div style={s.alertBox}>
                ⚠️ <b>PERINGATAN:</b> Stok Hampir Habis! <br/> Alat tidak akan mau terbuka.
              </div>
            )}
          </div>

          {/* KARTU 2: KONTROL PAKAN */}
          <div style={s.card}>
            <div style={s.cardHeader}>
              <h3>⚡ Kontrol Manual</h3>
              <span style={{fontSize:'12px', color:'#6B7280'}}>Buka Timer</span>
            </div>

            <div style={s.controlBody}>
              <p style={{color:'#4B5563', marginBottom:'10px'}}>Berapa lama katup dibuka?</p>
              
              <div style={s.inputGroup}>
                <input 
                  type="number" 
                  placeholder="3" 
                  value={durasi}
                  onChange={(e) => setDurasi(e.target.value)}
                  style={s.input}
                />
                <span style={s.suffix}>Detik</span>
              </div>

              <div style={s.presetContainer}>
                {[2, 5, 8].map((sec) => (
                  <button key={sec} onClick={() => setDurasi(sec)} style={s.presetBtn}>{sec}s</button>
                ))}
              </div>

              <button 
                onClick={handleBeriPakan}
                disabled={loading || isHabis}
                style={{
                  ...s.actionBtn,
                  backgroundColor: isHabis ? '#D1D5DB' : '#3B82F6',
                  cursor: isHabis ? 'not-allowed' : 'pointer'
                }}
              >
                {loading ? 'Mengirim...' : (isHabis ? 'STOK HABIS (TERKUNCI)' : 'BERI PAKAN SEKARANG')}
              </button>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

// STYLE MODERN (CSS-in-JS)
const s = {
  page: { minHeight: '100vh', backgroundColor: '#F3F4F6', fontFamily: "'Inter', sans-serif" },
  nav: { backgroundColor: '#FFFFFF', borderBottom: '1px solid #E5E7EB', padding: '15px 0' },
  navContent: { maxWidth: '1000px', margin: '0 auto', padding: '0 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  logo: { fontSize: '1.25rem', fontWeight: 'bold', color: '#111827', margin: 0 },
  badgeID: { backgroundColor: '#EFF6FF', color: '#2563EB', padding: '5px 10px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: '600' },
  main: { maxWidth: '1000px', margin: '30px auto', padding: '0 20px' },
  statusBanner: { display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: 'white', padding: '15px 20px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', marginBottom: '20px' },
  statusDot: { width: '10px', height: '10px', borderRadius: '50%' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' },
  card: { backgroundColor: 'white', borderRadius: '16px', padding: '25px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
  gaugeContainer: { display: 'flex', justifyContent: 'center', margin: '20px 0' },
  circleOuter: { width: '200px', height: '200px', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  circleInner: { textAlign: 'center', position: 'absolute', zIndex: 10 },
  svg: { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' },
  alertBox: { backgroundColor: '#FEF2F2', color: '#991B1B', padding: '10px', borderRadius: '8px', fontSize: '0.9rem', marginTop: '15px', border: '1px solid #FECACA' },
  controlBody: { display: 'flex', flexDirection: 'column' },
  inputGroup: { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' },
  input: { flex: 1, padding: '12px', fontSize: '1.1rem', borderRadius: '8px', border: '1px solid #D1D5DB', textAlign: 'center' },
  suffix: { fontWeight: '600', color: '#6B7280' },
  presetContainer: { display: 'flex', gap: '10px', marginBottom: '20px' },
  presetBtn: { flex: 1, padding: '8px', backgroundColor: '#F3F4F6', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', color: '#4B5563' },
  actionBtn: { width: '100%', padding: '15px', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 'bold', fontSize: '1rem', transition: 'background 0.2s' }
};