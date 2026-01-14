import mongoose from 'mongoose';

const AlatSchema = new mongoose.Schema({
  id_alat: { type: String, required: true, unique: true }, // Cth: "alat_1"
  nama: String,        // Cth: "Pakan Kiri"
  berat_pakan: Number, // Cth: 10 (kg)
});

export default mongoose.models.Alat || mongoose.model('Alat', AlatSchema);