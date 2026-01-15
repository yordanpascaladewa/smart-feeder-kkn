// pages/api/trigger.js
import dbConnect from '../../lib/db';
import Alat from '../../models/alat';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    await dbConnect();

    const { id } = req.body;

    try {
      // Kita update status 'motor' jadi 1 (ON)
      // Pastikan di database nanti ada field 'motor' atau sesuaikan namanya
      const alat = await Alat.findOneAndUpdate(
        { id_alat: id }, // Cari alat berdasarkan ID (misal: sekat_1)
        { motor: 1 },    // Ubah status motor jadi 1
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