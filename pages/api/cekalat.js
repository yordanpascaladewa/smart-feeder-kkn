import dbConnect from '../../lib/db';
import Alat from '../../models/alat';

export default async function handler(req, res) {
  await dbConnect();

  const { id } = req.query;
  if (!id) return res.status(400).json({ message: 'Butuh ID' });

  try {
    const alat = await Alat.findOne({ id_alat: id });
    if (!alat) return res.status(404).json({ message: 'Not Found' });

    // Kirim data lengkap ke Frontend
    res.status(200).json({ success: true, data: alat });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}