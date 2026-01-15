import dbConnect from '../../lib/db';
import Alat from '../../models/alat';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    await dbConnect();

    // Terima ID dan JUMLAH (kg) dari frontend
    const { id, kg } = req.body;

    try {
      // Update database: 
      // 1. Set motor = 1 (Nyala)
      // 2. Set target_manual = kg (Berapa banyak mau dikeluarin)
      const alat = await Alat.findOneAndUpdate(
        { id_alat: id }, 
        { 
            motor: 1,
            target_manual: kg  // Pastikan nanti di ESP32 baca field ini
        },    
        { new: true }
      );

      if (!alat) {
        return res.status(404).json({ success: false, message: 'Alat tidak ditemukan' });
      }

      res.status(200).json({ success: true, data: alat });
    } catch (error) {
      res.status(400).json({ success: false });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}