import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

export default function AlatDetail() {
  const router = useRouter();
  const { id } = router.query; 

  // === STATE (LOGIC BARU) ===
  const [beratGudang, setBeratGudang] = useState(0);
  const [statusAlat, setStatusAlat] = useState("Offline");
  // Input sekarang adalah DURASI (Detik), bukan Kg target
  const [durasi, setDurasi] = useState(""); 
  const [loading, setLoading] = useState(false);
  
  const KAPASITAS_MAX = 10.0; // Misal max 10 Kg buat visualisasi tangki

  // 1. POLLING DATA (Nembak API tiap 2 detik)
  useEffect(() => {
    if(!id) return;
    const interval = setInterval(() => {
      fetch(`/api/hardware?id=${id}`)
        .then((res) => res.json())
        .then((data) => {
          if(data) {
            // Pastikan angka tidak NaN
            const berat = parseFloat(data.sisa_pakan || 0);
            setBeratGudang(isNaN(berat) ? 0 : berat);
            setStatusAlat(data.status_alat || "Offline");
          }
        })
        .catch(err => console.log("Gagal konek DB"));
    }, 2000);
    return () => clearInterval(interval);
  }, [id]);

  // 2. FUNGSI KIRIM PERINTAH (LOGIC BARU: TIMER)
  const handleBeriPakan = async () => {
    // Validasi input durasi
    if (!durasi || durasi <= 0) return alert("Masukkan durasi buka (detik)!");
    setLoading(true);

    try {
      const res = await fetch('/api/hardware', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: id,
          perintah: "MAJU", // Kata kunci trigger
          target: parseFloat(durasi) // Yang dikirim sekarang adalah DETIK
        })
      });

      if(res.ok) {
        alert(`✅ Perintah dikirim! Membuka selama ${durasi} detik.`);
        setDurasi(""); // Reset input
      } else {
        alert("❌ Gagal kirim perintah.");
      }
    } catch (error) {
      alert("Error koneksi server.");
    }
    setLoading(false);
  };

  // === VARIABEL VISUAL ===
  // Batas safety baru: 0.5 Kg
  const isHabis = beratGudang < 0.5; 
  // Hitung persentase tangki (biar gak minus di visual)
  const persentase = Math.min(Math.max((beratGudang / KAPASITAS_MAX) * 100, 0), 100);

  return (
    <div style={styles.container}>
      <Head><title>Smart Control Panel</title></Head>

      {/* --- KARTU UTAMA (GUDANG) --- */}
      <div style={styles.cardMain}>
        <div style={styles.leftSide}>
          <h3 style={styles.cardTitle}>GUDANG PAKAN</h3>
          <p style={styles.subTitle}>ID Unit: {id}</p>
          {/* Tampilkan berat dengan 1 angka belakang koma */}
          <h1 style={{...styles.bigNumber, color: isHabis ? '#FF3B30' : '#333'}}>
            {beratGudang.toFixed(1)} <span style={styles.unit}>Kg</span>
          </h1>
          {/* Badge Status Stok */}
          <div style={{...styles.badge, backgroundColor: isHabis ? '#FF3B30' : '#4CD964'}}>
            {isHabis ? '⚠️ STOK KRITIS / HABIS' : '✅ STOK AMAN'}
          </div>
          <p style={{marginTop: 15, fontSize: 12, color: '#888'}}>
            Status Alat: <b style={{color: statusAlat === 'Offline' ? 'red' : 'blue'}}>{statusAlat}</b>
          </p>
        </div>
        {/* Visualisasi Tangki Kanan */}
        <div style={styles.rightSide}>
          <div style={styles.tankContainer}>
            <div style={{...styles.tankFill, height: `${persentase}%`, backgroundColor: isHabis ? '#FF3B30' : '#FF5E57'}}></div>
            <span style={styles.tankText}>{persentase.toFixed(0)}%</span>
          </div>
        </div>
      </div>

      <div style={styles.row}>
        {/* --- KARTU KIRI: KONTROL TIMER (LOGIC BARU DI DESIGN LAMA) --- */}
        <div style={styles.cardSmall}>
          <div style={styles.headerSmall}>⚡ Buka Timer (Detik)</div>
          <div style={styles.inputContainer}>
            <input 
              type="number" 
              placeholder="Contoh: 3" 
              style={styles.input} 
              value={durasi} 
              onChange={(e) => setDurasi(e.target.value)} 
              disabled={isHabis} // Disable input kalau habis
            />
          </div>
          {/* Tombol dengan Safety Check */}
          <button 
            onClick={handleBeriPakan} 
            disabled={loading || isHabis} 
            style={{
              ...styles.button, 
              opacity: (loading || isHabis) ? 0.6 : 1,
              cursor: (loading || isHabis) ? 'not-allowed' : 'pointer',
              // Ubah warna jadi abu-abu kalau stok habis
              background: isHabis ? '#95a5a6' : 'linear-gradient(90deg, #FF9966 0%, #FF5E62 100%)'
            }}
          >
            {loading ? 'MENGIRIM...' : (isHabis ? 'STOK HABIS (TERKUNCI)' : 'BUKA KATUP SEKARANG')}
          </button>
           {isHabis && <p style={{color: '#FF3B30', fontSize: '11px', marginTop: '5px', textAlign:'center'}}>*Isi gudang dulu agar bisa dibuka.</p>}
        </div>
        
        {/* --- KARTU KANAN: JADWAL (STATIS) --- */}
        <div style={styles.cardSmall}>
          <div style={styles.headerSmall}>🕒 Jadwal Pakan</div>
          <div style={styles.scheduleItem}>
            <span style={styles.tagBlue}>PAGI</span> <span style={styles.time}>07:00</span> <span style={styles.target}>Buka 5 Detik</span>
          </div>
          <div style={styles.scheduleItem}>
            <span style={styles.tagPurple}>SORE</span> <span style={styles.time}>16:00</span> <span style={styles.target}>Buka 8 Detik</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// === CSS-IN-JS STYLE (Desain Pink Minimalis Lama) ===
const styles = {
  container: { minHeight: '100vh', backgroundColor: '#FFE8E8', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px', fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" },
  cardMain: { backgroundColor: 'white', width: '100%', maxWidth: '600px', borderRadius: '24px', padding: '35px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 15px 35px rgba(255, 107, 107, 0.15)', marginBottom: '25px' },
  leftSide: { flex: 1 },
  cardTitle: { margin: 0, fontSize: '20px', fontWeight: '800', color: '#2c3e50', letterSpacing: '-0.5px' },
  subTitle: { margin: 0, fontSize: '13px', color: '#95a5a6', marginBottom: '15px', fontWeight: '500' },
  bigNumber: { fontSize: '68px', fontWeight: '800', margin: '15px 0', lineHeight: 1, letterSpacing: '-2px' },
  unit: { fontSize: '28px', color: '#7f8c8d', fontWeight: '600' },
  badge: { display: 'inline-block', padding: '8px 18px', borderRadius: '50px', color: 'white', fontSize: '13px', fontWeight: 'bold', boxShadow: '0 5px 15px rgba(0,0,0,0.08)' },
  rightSide: { width: '90px', height: '160px', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' },
  tankContainer: { width: '70px', height: '100%', backgroundColor: '#F7F8FA', borderRadius: '18px', overflow: 'hidden', position: 'relative', border: '5px solid white', boxShadow: 'inset 0 5px 15px rgba(0,0,0,0.05), 0 10px 20px rgba(0,0,0,0.05)' },
  tankFill: { width: '100%', position: 'absolute', bottom: 0, transition: 'height 0.8s cubic-bezier(0.4, 0.0, 0.2, 1)', borderRadius: '0 0 15px 15px' },
  tankText: { position: 'absolute', bottom: '15px', width: '100%', textAlign: 'center', fontSize: '14px', fontWeight: 'bold', color: '#333', zIndex: 2, textShadow: '0 1px 2px rgba(255,255,255,0.5)' },
  row: { display: 'flex', gap: '25px', width: '100%', maxWidth: '600px', flexWrap: 'wrap' },
  cardSmall: { flex: 1, minWidth: '260px', backgroundColor: 'white', borderRadius: '24px', padding: '30px', boxShadow: '0 15px 35px rgba(0,0,0,0.08)' },
  headerSmall: { fontSize: '17px', fontWeight: 'bold', color: '#2c3e50', marginBottom: '25px', display: 'flex', alignItems: 'center' },
  inputContainer: { marginBottom: '20px' },
  input: { width: '100%', padding: '18px', borderRadius: '16px', border: '2px solid #F0F2F5', backgroundColor: '#F7F9FC', fontSize: '26px', textAlign: 'center', fontWeight: 'bold', color: '#2c3e50', outline: 'none', transition: 'all 0.3s' },
  button: { width: '100%', padding: '18px', border: 'none', borderRadius: '16px', color: 'white', fontWeight: '800', fontSize: '15px', cursor: 'pointer', boxShadow: '0 10px 20px rgba(255, 94, 98, 0.3)', transition: 'transform 0.2s, box-shadow 0.2s', letterSpacing: '1px' },
  scheduleItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#F9FAFB', padding: '15px', borderRadius: '16px', marginBottom: '12px', border: '1px solid #F0F2F5' },
  tagBlue: { backgroundColor: '#E3F2FD', color: '#2196F3', padding: '6px 10px', borderRadius: '8px', fontSize: '11px', fontWeight: '800' },
  tagPurple: { backgroundColor: '#F3E5F5', color: '#9C27B0', padding: '6px 10px', borderRadius: '8px', fontSize: '11px', fontWeight: '800' },
  time: { fontWeight: '800', fontSize: '17px', color: '#2c3e50' },
  target: { fontSize: '13px', color: '#7f8c8d', fontWeight: '600' }
};