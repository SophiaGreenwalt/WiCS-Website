// declarations
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const Member = require('../models/Member');

// save membership in protected route
router.post('/join', authMiddleware, async (req, res) => {
  try {
    //get membership detail from req body
    const { name, yearJoined, email } = req.body;
    //makes new member record, connects to auth user ID
    const newMember = new Member({ userId: req.user.id, name, yearJoined, email });
    await newMember.save();
    res.status(201).json({ message: "Membership details saved." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
