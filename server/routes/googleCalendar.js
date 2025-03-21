
import { Router } from 'express';
const router = Router();
import authMiddleware from '../middleware/auth';

//gets google cal api
router.get('/', authMiddleware, (req, res) => {
  //calendar url
  const googleCalendarEmbedURL = "https://calendar.google.com/calendar/embed?src=your_calendar_id&ctz=America%2FNew_York";
  res.json({ googleCalendarEmbedURL });
});

export default router;