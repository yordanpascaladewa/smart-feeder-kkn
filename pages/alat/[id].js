import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

export default function AlatDetail() {
  const router = useRouter();
  const { id } = router.query; 

  const [beratGudang, setBeratGudang] = useState(0);
  const [statusAlat, setStatusAlat] = useState("Offline");
  const [targetPakan, setTargetPakan] = useState(""); // Input Kg
  const [loading, setLoading] = useState(false);
  
  const KAPASITAS_MAX = 10.0; // Kapasitas Visual (10 Kg)

  useEffect(() => {
    if(!id) return;
    const interval = setInterval(() => {
      fetch(`/api/hardware?id=${id}`)
        .then((res) => res.json())
        .then((data) => {
          if(data) {
            // Fix tampilan kalau minus (biar gak jelek)
            let b = parseFloat(data.sisa_pakan || 0);
            if (b < 0) b = 0; 
            setBeratGudang(b);
            setStatusAlat(data.status_alat || "Offline");
          }
        })
        .catch(err => console.log("Koneksi Error"));
    }, 2000);
    return () => clearInterval(interval);
  }, [id]);

  const handleKirim = async () => {
    if (!targetPakan || targetPakan <= 0) return alert("Masukkan jumlah pakan (Kg)!");
    setLoading(true);
    
    try {
      const res = await fetch('/api/hardware', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: id,
          perintah: "MAJU", 
          target: parseFloat(targetPakan) // Kirim Target Kg
        })
      });

      if(res.ok) {
        alert(`✅ Perintah Terkirim! Mengeluarkan ${targetPakan} Kg.`);
        setTargetPakan(""); 
      }
    } catch (error) {
      alert("Gagal konek server.");
    }
    setLoading(false);
  };

  const isHabis = beratGudang < 0.5; 
  const persen = Math.min((beratGudang / KAPASITAS_MAX) * 100, 100);

  return (
    <div style={styles.container}>
      <Head><title>Smart Control Panel</title></Head>

      {/* KARTU ATAS: MONITORING */}
      <div style={styles.cardMain}>
        <div style={styles.leftSide}>
          <h3 style={styles.cardTitle}>GUDANG PAKAN</h3>
          <p style={styles.subTitle}>ID: {id}</p>
          <h1 style={{...styles.bigNumber, color: isHabis ? '#FF3B30' : '#333'}}>
            {beratGudang.toFixed(2)} <span style={styles.unit}>Kg</span>
          </h1>
          <div style={{...styles.badge, backgroundColor: isHabis ? '#FF3B30' : '#4CD964'}}>
            {isHabis ? '⚠️ KRITIS' : '✅ AMAN'}
          </div>
          <p style={{marginTop:15, fontSize:12, color:'#888'}}>Status: <b>{statusAlat}</b></p>
        </div>
        
        {/* Visualisasi Tangki */}
        <div style={styles.rightSide}>
          <div style={styles.tankContainer}>
            <div style={{...styles.tankFill, height: `${persen}%`, backgroundColor: isHabis ? '#FF3B30' : '#FF5E57'}}></div>
          </div>
        </div>
      </div>

      <div style={styles.row}>
        {/* KARTU KIRI: ISI MANUAL */}
        <div style={styles.cardSmall}>
          <div style={styles.headerSmall}>⚡ Isi Manual (Kg)</div>
          <div style={{marginBottom:'15px'}}>
            <input 
              type="number" 
              placeholder="Contoh: 0.5" 
              style={styles.input} 
              value={targetPakan}
              onChange={(e) => setTargetPakan(e.target.value)}
              disabled={isHabis}
            />
          </div>
          <div style={styles.presetContainer}>
             {[0.1, 0.3, 0.5].map(val => (
               <button key={val} onClick={()=>setTargetPakan(val)} style={styles.presetBtn}>{val}Kg</button>
             ))}
          </div>
          <button 
            onClick={handleKirim} 
            disabled={loading || isHabis}
            style={{
              ...styles.button, 
              background: isHabis ? '#95a5a6' : 'linear-gradient(90deg, #FF9966 0%, #FF5E62 100%)'
            }}
          >
            {loading ? 'MENGIRIM...' : (isHabis ? 'STOK HABIS' : 'BERI PAKAN SEKARANG')}
          </button>
        </div>
        
        {/* KARTU KANAN: JADWAL */}
        <div style={styles.cardSmall}>
          <div style={styles.headerSmall}>🕒 Jadwal Otomatis</div>
          <div style={styles.scheduleItem}>
            <span style={styles.tagBlue}>PAGI</span> 07:00 <span style={styles.target}>0.5 Kg</span>
          </div>
          <div style={styles.scheduleItem}>
            <span style={styles.tagPurple}>SORE</span> 16:00 <span style={styles.target}>0.5 Kg</span>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { minHeight: '100vh', backgroundColor: '#FFE8E8', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px', fontFamily: 'sans-serif' },
  cardMain: { backgroundColor: 'white', width: '100%', maxWidth: '600px', borderRadius: '24px', padding: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', marginBottom: '20px' },
  leftSide: { flex: 1 },
  cardTitle: { margin: 0, fontSize: '18px', fontWeight: '800', color: '#2c3e50' },
  subTitle: { margin: 0, fontSize: '12px', color: '#95a5a6', marginBottom: '10px' },
  bigNumber: { fontSize: '50px', fontWeight: '800', margin: '10px 0', lineHeight: 1 },
  unit: { fontSize: '20px', color: '#7f8c8d' },
  badge: { display: 'inline-block', padding: '5px 15px', borderRadius: '50px', color: 'white', fontSize: '12px', fontWeight: 'bold' },
  rightSide: { width: '80px', height: '120px', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' },
  tankContainer: { width: '60px', height: '100%', backgroundColor: '#F0F2F5', borderRadius: '15px', overflow: 'hidden', position: 'relative', border: '4px solid white', boxShadow: 'inset 0 2px 5px rgba(0,0,0,0.05)' },
  tankFill: { width: '100%', position: 'absolute', bottom: 0, transition: 'height 0.5s ease' },
  row: { display: 'flex', gap: '20px', width: '100%', maxWidth: '600px', flexWrap: 'wrap' },
  cardSmall: { flex: 1, minWidth: '250px', backgroundColor: 'white', borderRadius: '24px', padding: '25px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' },
  headerSmall: { fontSize: '16px', fontWeight: 'bold', color: '#2c3e50', marginBottom: '20px' },
  input: { width: '100%', padding: '15px', borderRadius: '12px', border: '2px solid #F0F2F5', fontSize: '20px', textAlign: 'center', fontWeight: 'bold' },
  presetContainer: { display:'flex', gap:'10px', marginBottom:'20px' },
  presetBtn: { flex:1, padding:'8px', borderRadius:'8px', border:'none', backgroundColor:'#F0F2F5', cursor:'pointer', fontWeight:'bold', color:'#555'},
  button: { width: '100%', padding: '15px', border: 'none', borderRadius: '12px', color: 'white', fontWeight: 'bold', cursor: 'pointer' },
  scheduleItem: { display: 'flex', justifyContent: 'space-between', padding: '10px', backgroundColor: '#FAFAFA', borderRadius: '10px', marginBottom: '8px', fontSize:'14px', fontWeight:'bold', color:'#555' },
  tagBlue: { backgroundColor: '#E3F2FD', color: '#2196F3', padding: '2px 6px', borderRadius: '4px', fontSize: '10px' },
  tagPurple: { backgroundColor: '#F3E5F5', color: '#9C27B0', padding: '2px 6px', borderRadius: '4px', fontSize: '10px' },
  target: { color: '#888', fontSize:'12px' }
};