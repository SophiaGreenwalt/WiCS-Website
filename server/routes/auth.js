import { Router } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import sgMail from '@sendgrid/mail';
import User from '../models/User.js';

const router = Router();
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// verification email using SendGrid
async function sendVerificationEmail(email, code) {
  const msg = {
    to: email,
    from: 'your_verified_sender@example.com', // Replace with verified sender
    subject: 'Your Email Verification Code',
    text: `Your verification code is ${code}.`,
    html: `<p>Your verification code is <strong>${code}</strong>.</p>`
  };
  await sgMail.send(msg);
}

// Registration endpoint
router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email.endsWith('@wcupa.edu')) {
      return res.status(400).json({ message: "Please use your WCU email address." });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const verificationCode = crypto.randomInt(100000, 999999).toString();

    const newUser = new User({
      email,
      password: hashedPassword,
      verificationCode,
      isVerified: false
    });
    await newUser.save();
    await sendVerificationEmail(email, verificationCode);

    res.status(201).json({ message: "User registered. Check your email for the verification code." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Login endpoint
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials." });
    if (!user.isVerified) return res.status(400).json({ message: "Email not verified." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials." });

    const payload = { id: user._id, email: user.email };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;