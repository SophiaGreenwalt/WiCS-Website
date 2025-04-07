import { Router } from 'express';
import authMiddleware from '../middleware/auth.js';

const router = Router();

router.get('/', authMiddleware, (req, res) => {
  const outlookCalendarURL = "https://outlook.live.com/owa/calendar/00000000-0000-0000-0000-000000000000/a3fb1321-91d6-45a2-9658-7b98b2e54b2a/cid-843FBB1C7EFF3239/index.html";
  res.json({ outlookCalendarURL });
});

export default router;
