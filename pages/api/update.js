import dbConnect from '../../lib/db';
import Alat from '../../models/alat';

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'GET') {
    const { id, storage } = req.query;

    if (!id) return res.status(400).json({ message: 'ID missing' });

    try {
      // Cari alat berdasarkan id_alat (contoh: "Sekat 1")
      let alat = await Alat.findOne({ id_alat: id });
      
      if (!alat) {
        // (Opsional) Auto-create kalau belum ada
        // alat = new Alat({ id_alat: id, berat_storage: 0 });
        return res.status(404).json({ message: 'Alat tidak ditemukan' });
      }

      // Update berat storage jika ada data masuk
      if (storage) {
        alat.berat_storage = parseFloat(storage);
      }
      
      await alat.save();

      // Balas ke ESP32
      res.status(200).json({ success: true, saved_storage: alat.berat_storage });

    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}