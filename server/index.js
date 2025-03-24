import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

// Import route files
import authRoutes from './routes/auth.js';
import verifyRoutes from './routes/verify.js';
import googleCalendarRoutes from './routes/googlecalendar.js';
import memberRoutes from './routes/members.js';
import discordRoutes from './routes/discord.js';
import contactRoutes from './routes/contact.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to database!"))
  .catch(err => console.error("MongoDB connection error:", err));

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/verify', verifyRoutes);
app.use('/api/google-calendar', googleCalendarRoutes);
app.use('/api/members', memberRoutes);
app.use('/api/discord', discordRoutes);
app.use('/api/contact', contactRoutes);

// Test route
app.get('/', (req, res) => {
  res.send("Welcome to the WiCS Club API!");
});

// Start the server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));