import mongoose from 'mongoose';

// Member schema: stores membership details
const MemberSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  yearJoined: { type: Number, required: true },
  email: { type: String, required: true }
});

export default mongoose.model('Member', MemberSchema);
