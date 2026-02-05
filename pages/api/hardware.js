import dbConnect from '../../lib/db';
import Alat from '../../models/alat'; 

export default async function handler(req, res) {
  await dbConnect();

  const { method } = req;
  const id = req.body.id || req.query.id;

  if (!id) return res.status(400).json({ error: "ID Alat tidak ditemukan!" });

  try {
    // --- 1. POST: ESP32 LAPOR (Laporan Rutin) ---
    if (method === 'POST') {
      const { berat, status } = req.body;
      
      // Update data terbaru dari ESP32
      let alat = await Alat.findOneAndUpdate(
        { nama: id },
        { 
          nama: id,
          sisa_pakan: berat,
          status_alat: status,
          last_update: new Date()
        },
        { new: true, upsert: true }
      );

      // CEK: APAKAH ADA PERINTAH DARI WEBSITE?
      const perintahSekarang = alat.perintah_pakan || "STOP";
      const targetSekarang = alat.target_pakan || 0;

      // 🔥 FITUR ANTI-GHOSTING (PENTING!)
      // Kalau perintahnya "MAJU", kita kirim ke ESP32...
      // TAPI detik itu juga kita HAPUS perintahnya jadi "STOP" di database.
      // Jadi pas ESP32 lapor lagi 2 detik kemudian, perintahnya udah hilang.
      if (perintahSekarang === "MAJU") {
        await Alat.updateOne({ nama: id }, { perintah_pakan: "STOP" });
        console.log(`Perintah MAJU dikirim ke ${id}, database di-reset ke STOP.`);
      }

      // Kirim jawaban ke ESP32
      return res.status(200).json({ 
        perintah: perintahSekarang, 
        target: targetSekarang
      });
    } 
    
    // --- 2. PUT: TOMBOL WEBSITE (User Ngasih Perintah) ---
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

    // --- 3. GET: DATA DASHBOARD ---
    else if (method === 'GET') {
       const data = await Alat.findOne({ nama: id });
       if (!data) return res.status(200).json({ sisa_pakan: 0, status_alat: "Menunggu..." });
       return res.status(200).json(data);
    }

  } catch (error) {
    console.error("Server Error:", error);
    return res.status(500).json({ error: error.message });
  }
}