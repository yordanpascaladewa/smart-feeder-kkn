import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

export default function AlatDetail() {
  const router = useRouter();
  const { id } = router.query; 

  // STATE DATA
  const [beratGudang, setBeratGudang] = useState(0);
  const [statusAlat, setStatusAlat] = useState("Offline");
  const [targetPakan, setTargetPakan] = useState("");
  const [loading, setLoading] = useState(false);
  
  const MAX_CAPACITY = 10.0; 

  // 1. POLLING DATA (Nembak API tiap 2 detik)
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
        .catch(err => console.log("Gagal konek DB"));
    }, 2000);
    return () => clearInterval(interval);
  }, [id]);

  // 2. FUNGSI KIRIM PERINTAH
  const handleKirimPerintah = async () => {
    if (!targetPakan || targetPakan <= 0) return alert("Masukkan jumlah pakan!");
    setLoading(true);

    try {
      const res = await fetch('/api/hardware', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: id,
          perintah: "MAJU", // Kata kunci rahasia buat ESP32
          target: parseFloat(targetPakan)
        })
      });

      if(res.ok) {
        alert("✅ Perintah Terkirim! Alat akan segera bergerak.");
        setTargetPakan(""); 
      } else {
        alert("❌ Gagal kirim perintah.");
      }
    } catch (error) {
      alert("Error koneksi server.");
    }
    setLoading(false);
  };

  const isKritis = beratGudang < 7.0; 
  const persentase = Math.min((beratGudang / MAX_CAPACITY) * 100, 100);

  return (
    <div style={styles.container}>
      <Head><title>Smart Control Panel</title></Head>

      <div style={styles.cardMain}>
        <div style={styles.leftSide}>
          <h3 style={styles.cardTitle}>GUDANG PAKAN</h3>
          <p style={styles.subTitle}>ID: {id}</p>
          <h1 style={{...styles.bigNumber, color: isKritis ? '#FF3B30' : '#333'}}>
            {beratGudang.toFixed(1)} <span style={styles.unit}>Kg</span>
          </h1>
          <div style={{...styles.badge, backgroundColor: isKritis ? '#FF3B30' : '#4CD964'}}>
            {isKritis ? '⚠️ KRITIS (< 7 Kg)' : '✅ AMAN'}
          </div>
          <p style={{marginTop: 10, fontSize: 12, color: '#888'}}>Status Alat: <b>{statusAlat}</b></p>
        </div>
        <div style={styles.rightSide}>
          <div style={styles.tankContainer}>
            <div style={{...styles.tankFill, height: `${persentase}%`}}></div>
            <span style={styles.tankText}>{persentase.toFixed(0)}%</span>
          </div>
        </div>
      </div>

      <div style={styles.row}>
        <div style={styles.cardSmall}>
          <div style={styles.headerSmall}>⚡ Isi Manual (Kg)</div>
          <div style={styles.inputContainer}>
            <input type="number" placeholder="0.0" style={styles.input} value={targetPakan} onChange={(e) => setTargetPakan(e.target.value)} />
          </div>
          <button onClick={handleKirimPerintah} disabled={loading} style={{...styles.button, opacity: loading ? 0.7 : 1}}>
            {loading ? 'MENGIRIM...' : 'KIRIM PERINTAH'}
          </button>
        </div>
        
        <div style={styles.cardSmall}>
          <div style={styles.headerSmall}>🕒 Jadwal Pakan</div>
          <div style={styles.scheduleItem}>
            <span style={styles.tagBlue}>PAGI</span> <span style={styles.time}>07:00</span> <span style={styles.target}>0.5 Kg</span>
          </div>
          <div style={styles.scheduleItem}>
            <span style={styles.tagPurple}>SORE</span> <span style={styles.time}>16:00</span> <span style={styles.target}>0.5 Kg</span>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { minHeight: '100vh', backgroundColor: '#FFE8E8', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px', fontFamily: "Arial, sans-serif" },
  cardMain: { backgroundColor: 'white', width: '100%', maxWidth: '600px', borderRadius: '20px', padding: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', marginBottom: '20px' },
  leftSide: { flex: 1 },
  cardTitle: { margin: 0, fontSize: '18px', fontWeight: '800', color: '#2c3e50' },
  subTitle: { margin: 0, fontSize: '12px', color: '#95a5a6', marginBottom: '10px' },
  bigNumber: { fontSize: '60px', fontWeight: 'bold', margin: '10px 0', lineHeight: 1 },
  unit: { fontSize: '24px', color: '#7f8c8d' },
  badge: { display: 'inline-block', padding: '5px 15px', borderRadius: '50px', color: 'white', fontSize: '12px', fontWeight: 'bold' },
  rightSide: { width: '80px', height: '140px', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' },
  tankContainer: { width: '60px', height: '100%', backgroundColor: '#F0F2F5', borderRadius: '15px', overflow: 'hidden', position: 'relative', border: '4px solid white', boxShadow: 'inset 0 2px 5px rgba(0,0,0,0.1)' },
  tankFill: { width: '100%', backgroundColor: '#FF5E57', position: 'absolute', bottom: 0, transition: 'height 0.5s ease' },
  tankText: { position: 'absolute', bottom: '10px', width: '100%', textAlign: 'center', fontSize: '12px', fontWeight: 'bold', color: '#333', zIndex: 2 },
  row: { display: 'flex', gap: '20px', width: '100%', maxWidth: '600px', flexWrap: 'wrap' },
  cardSmall: { flex: 1, minWidth: '250px', backgroundColor: 'white', borderRadius: '20px', padding: '25px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' },
  headerSmall: { fontSize: '16px', fontWeight: 'bold', color: '#333', marginBottom: '20px' },
  inputContainer: { marginBottom: '15px' },
  input: { width: '100%', padding: '15px', borderRadius: '12px', border: 'none', backgroundColor: '#F7F9FC', fontSize: '24px', textAlign: 'center', fontWeight: 'bold', color: '#333', outline: 'none' },
  button: { width: '100%', padding: '15px', background: 'linear-gradient(90deg, #FF9966 0%, #FF5E62 100%)', border: 'none', borderRadius: '12px', color: 'white', fontWeight: 'bold', cursor: 'pointer' },
  scheduleItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#FAFAFA', padding: '12px', borderRadius: '12px', marginBottom: '10px' },
  tagBlue: { backgroundColor: '#E3F2FD', color: '#2196F3', padding: '4px 8px', borderRadius: '6px', fontSize: '10px', fontWeight: 'bold' },
  tagPurple: { backgroundColor: '#F3E5F5', color: '#9C27B0', padding: '4px 8px', borderRadius: '6px', fontSize: '10px', fontWeight: 'bold' },
  time: { fontWeight: 'bold', fontSize: '16px', color: '#333' },
  target: { fontSize: '12px', color: '#888' }
};