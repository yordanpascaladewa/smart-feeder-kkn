// models/alat.js
import mongoose from 'mongoose';

const AlatSchema = new mongoose.Schema({
  id_alat: { type: String, required: true, unique: true },
  nama: String,
  
  // SENSOR 1: STORAGE (Gudang Besar)
  berat_storage: { type: Number, default: 0 }, // Ganti nama biar jelas
  kapasitas_storage: { type: Number, default: 50 },

  // SENSOR 2: EMBER (Penakar Kecil)
  berat_ember: { type: Number, default: 0 },   // <--- INI KOLOM BARU
  kapasitas_ember: { type: Number, default: 10 }, // Misal ember max 10kg

  motor: { type: Number, default: 0 },         // Status Motor (1=On, 0=Off)
  target_manual: { type: Number, default: 0 }, // Target pakan yg mau dikeluarin
  last_seen: { type: Date, default: Date.now }
});

export default mongoose.models.Alat || mongoose.model('Alat', AlatSchema);