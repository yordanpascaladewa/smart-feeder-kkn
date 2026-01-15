// pages/api/update.js
import dbConnect from '../../lib/db';
import Alat from '../../models/alat';

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'GET') {
    const { id, storage, ember } = req.query; // Baca parameter dari URL

    if (!id) {
        // Kalau cuma minta data (buat frontend)
        return res.status(400).json({ success: false, message: 'ID missing' });
    }

    // Kalau ada data berat (dari ESP32), kita update
    let updateData = { last_seen: new Date() };
    
    if (storage) updateData.berat_storage = parseFloat(storage);
    if (ember) updateData.berat_ember = parseFloat(ember);

    try {
      // Update atau Create kalau belum ada
      const alat = await Alat.findOneAndUpdate(
        { id_alat: id },
        updateData,
        { new: true, upsert: true } // upsert: true = kalau gak ada, bikin baru
      );
      
      res.status(200).json({ success: true, data: alat });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}