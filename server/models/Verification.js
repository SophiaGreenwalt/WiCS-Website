// models/Verification.js
import mongoose from 'mongoose';

const VerificationSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  code: { type: String, required: true },
  expiresAt: { type: Date, required: true },
  password: { type: String, required: true },
  expiresAt: { type: Date, required: true, index: { expires: 0 } }
});

export default mongoose.model('Verification', VerificationSchema);
