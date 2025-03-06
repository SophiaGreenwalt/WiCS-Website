
const mongoose = require('mongoose');
//storing membership, what it takes in
const MemberSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  yearJoined: { type: Number, required: true },
  email: { type: String, required: true }
});
//export for member to be used
module.exports = mongoose.model('Member', MemberSchema);
