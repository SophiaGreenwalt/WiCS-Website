//install express, mongoose, and cors 
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// future route files
const authRoutes = require('./routes/auth');
const eventRoutes = require('./routes/events');
const memberRoutes = require('./routes/members');
const discordRoutes = require('./routes/discord');
const contactRoutes = require('./routes/contact');
const app = express();
const PORT = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

// Host connection to MongoDB Atlas
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err));

//API 
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/members', memberRoutes);
app.use('/api/discord', discordRoutes);
app.use('/api/contact', contactRoutes);

//Testing for connection 
app.get('/', (req, res) => {
  res.send("Welcome!");
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
