import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

// Import route files
import authRoutes from './routes/auth.js';
import verifyRoutes from './routes/verify.js';
import microsoftCalendar from './routes/microsoftCalendar.js';
import discordRoutes from './routes/discord.js';
import contactRoutes from './routes/contact.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
const allowedOrigins = [
  'http://localhost:5500',
  'http://127.0.0.1:5500',
  'http://104.201.182.59:5500',
  'http://192.168.1.45:5500'
];

const corsOptions = {
  origin: (origin, callback) => {
    console.log("CORS origin:", origin);
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("CORS not allowed from this origin"));
    }
  },
  credentials: true
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(express.json());

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/verify', verifyRoutes);
app.use('/api/microsoftCalendar', microsoftCalendar);
app.use('/api/discord', discordRoutes);
app.use('/api/contact', contactRoutes);

// Test route
app.get('/', (req, res) => {
  res.send("Welcome to the WiCS Club API!");
});

// ✅ ⬇️ ONLY connect and start server if NOT testing
if (process.env.NODE_ENV !== 'test') {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
      console.log("Connected to database!");
      app.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));
    })
    .catch(err => console.error("MongoDB connection error:", err));
}

// ✅ So Jest can import this app without running server
export default app;
