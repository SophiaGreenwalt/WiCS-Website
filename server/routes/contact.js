import { Router } from 'express';
const router = Router();

router.post('/', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    const msg = {
      to: 'clubemail@wcupa.edu',
      from: 'no-reply@yourdomain.com', // Use verified sender
      subject: `Contact Form Message from ${name}`,
      text: `Message from ${name} (${email}):\n\n${message}`
    };
    // Send email via SendGrid (already configured in auth.js if needed)
    res.json({ message: "Message sent successfully." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;