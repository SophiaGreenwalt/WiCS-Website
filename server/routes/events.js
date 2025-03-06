//statementd
const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const authMiddleware = require('../middleware/auth');

// Get all events 
router.get('/', authMiddleware, async (req, res) => {
  try {
    const events = await Event.find({});
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Post create event (admin)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const newEvent = new Event(req.body);
    await newEvent.save();
    res.status(201).json(newEvent);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Put update event (protected)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const updatedEvent = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedEvent);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// delete event 
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id);
    res.json({ message: "Event deleted." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
