import { Router } from 'express';
import authMiddleware from '../middleware/auth.js';

const router = Router();

router.get('/widget', authMiddleware, (req, res) => {
  res.json({ widgetUrl: `https://discord.com/widget?id=${1220092342866939934}&theme=dark` });
});

export default router;