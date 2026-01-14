import mongoose from 'mongoose';

const AlatSchema = new mongoose.Schema({
  id_alat: { type: String, required: true, unique: true }, // Alat 1
  nama: String,        // Sekat 1
  berat_pakan: Number, // 10 kg
});

export default mongoose.models.Alat || mongoose.model('Alat', AlatSchema);