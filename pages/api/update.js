import dbConnect from '../../lib/db';
import Alat from '../../models/alat';

export default async function handler(req, res) {
  // 1. konek ke database
  await dbConnect();

  // id alat (sekat 1)
  const id_target = 'sekat_1';

  // === KALO ADA YANG MINTA DATA (GET) ===
  // (website/esp32 ngecek status)
  if (req.method === 'GET') {
    try {
      // cari data sekat_1 di database
      let alat = await Alat.findOne({ id_alat: id_target });

      // kalo belum ada (pertama kali jalan), dibikinin otomatis
      if (!alat) {
        alat = await Alat.create({
          id_alat: id_target,
          nama: 'Sekat 1 (125 Bebek)',
          berat_pakan: 20, // default penuh
        });
      }

      res.status(200).json({ success: true, data: alat });
    } catch (error) {
      res.status(400).json({ success: false });
    }
  }

  // === KALO ESP32 NGIRIM DATA BARU (POST) ===
  else if (req.method === 'POST') {
    try {
      /* ESP32 bakal kirim data JSON kayak gini:
         { "berat": 18.5 }
      */
      const { berat } = req.body;

      // Update datanya di database
      const alat = await Alat.findOneAndUpdate(
        { id_alat: id_target },
        { berat_pakan: berat }, // data berat diperbarui
        { new: true, upsert: true } // opsi biar kalo ga ada, dia bikin baru
      );

      res.status(200).json({ success: true, data: alat });
    } catch (error) {
      res.status(400).json({ success: false });
    }
  } 
  
  else {
    res.status(405).json({ message: 'Method tidak diizinkan' });
  }
}