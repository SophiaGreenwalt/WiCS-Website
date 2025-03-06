//What you type in
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true }, //unique email
  password: { type: String, required: true } //hashed password for security purpose!
});
//exporting user 
module.exports = mongoose.model('User', UserSchema);