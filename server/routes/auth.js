import { Router } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Verification from '../models/Verification.js';

dotenv.config();
const router = Router();

async function sendVerificationEmail(email, code) {
  try {
    const { default: sgMail } = await import('@sendgrid/mail'); // ← THIS LINE IS THE FIX
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    const msg = {
      to: email,
      from: 'wicswcu@gmail.com',
      subject: 'Your Email Verification Code',
      text: `Your verification code is ${code}.`,
      html: `<p>Your verification code is <strong>${code}</strong>.</p>`
    };

    await sgMail.send(msg);
  } catch (error) {
    console.error('SendGrid error:', error);
    throw new Error('Failed to send verification email.');
  }
}

// POST /register
router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email.endsWith('@wcupa.edu')) {
      return res.status(400).json({ message: "Please use your WCU email address." });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const code = crypto.randomInt(100000, 999999).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await Verification.findOneAndUpdate(
      { email },
      { code, expiresAt, password: hashedPassword },
      { upsert: true, new: true }
    );

    await sendVerificationEmail(email, code);

    res.status(200).json({ message: "Verification code sent to your email." });
  } catch (error) {
    console.error('Registration error:', error); // ✅ Log full error for debugging
    res.status(500).json({ error: error.message });
  }
});

// POST /verify-email
router.post('/verify-email', async (req, res) => {
  try {
    const { email, verificationCode } = req.body;
    const record = await Verification.findOne({ email });

    if (!record) {
      return res.status(404).json({ message: "No verification request found." });
    }

    const now = new Date();

    if (record.code !== verificationCode || record.expiresAt < now) {
      return res.status(400).json({ message: "Invalid or expired verification code." });
    }

    const newUser = new User({
      email,
      password: record.password,
      isVerified: true
    });

    await newUser.save();
    await Verification.deleteOne({ email });

    res.status(201).json({ message: "Email verified and account created!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /login
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
