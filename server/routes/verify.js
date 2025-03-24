import { Router } from 'express';
const router = Router();
import User from '../models/User.js';

// Endpoint to verify email 
router.post('/verify-email', async (req, res) => {
  try {
    const { email, code } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found." });
    
    if (user.verificationCode === code) {
      user.isVerified = true;
      user.verificationCode = undefined; // clears after verf
      await user.save();
      return res.json({ message: "Email verified successfully." });
    } else {
      return res.status(400).json({ message: "Invalid verification code." });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;