
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');

// Return Discord widget URL 
router.get('/widget', authMiddleware, (req, res) => {
 
  res.json({ widgetUrl: `https://discord.com/widget?id=${1220092342866939934}&theme=dark` });
});

module.exports = router;
