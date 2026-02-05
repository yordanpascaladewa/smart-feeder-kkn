import dbConnect from '../../lib/db';
import Alat from '../../models/alat'; // ⚠️ WAJIB HURUF KECIL (sesuai nama file alat.js)

export default async function handler(req, res) {
  await dbConnect();

  const { method } = req;
  const id = req.body.id || req.query.id;

  if (!id) return res.status(400).json({ error: "ID Alat tidak ditemukan!" });

  try {
    // --- 1. POST: ESP32 LAPOR ---
    if (method === 'POST') {
      const { berat, status } = req.body;
      
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

      return res.status(200).json({ 
        perintah: updated.perintah_pakan || "STOP", 
        target: updated.target_pakan || 0
      });
    } 
    
    // --- 2. PUT: TOMBOL WEBSITE ---
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

      return res.status(200).json({ message: "Sukses" });
    }

    // --- 3. GET: DATA DASHBOARD ---
    else if (method === 'GET') {
       const data = await Alat.findOne({ nama: id });
       if (!data) return res.status(200).json({ sisa_pakan: 0, status_alat: "Menunggu..." });
       return res.status(200).json(data);
    }

  } catch (error) {
    console.error("Server Error:", error);
    // Kirim pesan error asli biar ketahuan salahnya dimana
    return res.status(500).json({ error: error.message });
  }
}