import mongoose from 'mongoose';

const AlatSchema = new mongoose.Schema({
  nama: { type: String, required: true, unique: true }, 
  sisa_pakan: { type: Number, default: 0 },
  status_alat: { type: String, default: "Offline" },
  perintah_pakan: { type: String, default: "STOP" },
  target_pakan: { type: Number, default: 0 },
  last_update: { type: Date, default: Date.now }
});

// Export Default biar aman di Vercel
export default mongoose.models.Alat || mongoose.model('Alat', AlatSchema);