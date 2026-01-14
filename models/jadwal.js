import mongoose from 'mongoose';

const JadwalSchema = new mongoose.Schema({
  id_alat: String, // Nunjukkin jadwal ini punya alat mana
  waktu: String,   // 09:00
  jumlah: Number,  // 50 kg
});

export default mongoose.models.Jadwal || mongoose.model('Jadwal', JadwalSchema);