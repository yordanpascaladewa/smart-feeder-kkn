import mongoose from 'mongoose';

const JadwalSchema = new mongoose.Schema({
  id_alat: String, // Nunjukkin jadwal ini punya alat mana
  waktu: String,   // Cth: "09:00"
  jumlah: Number,  // Cth: 50 (gram)
});

export default mongoose.models.Jadwal || mongoose.model('Jadwal', JadwalSchema);