import dbConnect from '../../lib/db';
import Alat from '../../models/alat'; 

export default async function handler(req, res) {
  await dbConnect();

  const { method } = req;
  // Ambil ID dari body (POST/PUT) atau dari query URL (GET)
  const id = req.body.id || req.query.id;

  if (!id) return res.status(400).json({ error: "ID Alat tidak ditemukan!" });

  try {
    // --- 1. ESP32 LAPOR STATUS (POST) ---
    if (method === 'POST') {
      const { berat, status } = req.body;

      // Cari berdasarkan nama "Sekat 1", kalau gak ada, buat baru (upsert)
      const updated = await Alat.findOneAndUpdate(
        { nama: id }, 
        { 
          nama: id,
          sisa_pakan: berat,
          status_alat: status,
          last_update: new Date()
        },
        { new: true, upsert: true } 
      );

      // Balas ke ESP32: Ada perintah gak?
      return res.status(200).json({ 
        perintah: updated.perintah_pakan || "STOP", 
        target: updated.target_pakan || 0
      });
    } 
    
    // --- 2. WEBSITE NGASIH PERINTAH (PUT) ---
    // (Ini yang HILANG di kodingan kamu tadi!)
    else if (method === 'PUT') {
      const { perintah, target } = req.body;

      await Alat.findOneAndUpdate(
        { nama: id },
        { 
          perintah_pakan: perintah, 
          target_pakan: target
        },
        { upsert: true }
      );

      return res.status(200).json({ message: "Siap, perintah disimpan!" });
    }

    // --- 3. WEBSITE MINTA DATA (GET) ---
    // (Ini juga HILANG)
    else if (method === 'GET') {
       const data = await Alat.findOne({ nama: id });
       
       if (!data) {
         return res.status(200).json({ 
           sisa_pakan: 0, 
           status_alat: "Menunggu Alat..." 
         });
       }
       return res.status(200).json(data);
    }

  } catch (error) {
    console.error("Database Error:", error);
    return res.status(500).json({ error: "Gagal memproses data", details: error.message });
  }
}