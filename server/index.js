// server/index.js - GUARANTEED CORRECT VERSION WITH DEBUGGING
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import ideaRoutes from './routes/ideaRoutes.js';
import userRoutes from './routes/userRoutes.js';
import aiRoutes from './routes/aiRoutes.js';

const app = express();
const PORT = process.env.PORT || 5001;

// --- Middlewares ---
app.use(cors());
app.use(express.json());

// --- 1. DEBUGGING MIDDLEWARE ---
// This will run for EVERY request and log it to your terminal.
app.use((req, res, next) => {
  console.log('--- INCOMING REQUEST ---');
  console.log('Time:', new Date().toLocaleTimeString());
  console.log('Method:', req.method);
  console.log('URL:', req.originalUrl);
  console.log('------------------------');
  next();
});

// --- 2. DEBUGGING TEST ROUTE ---
// A simple route to confirm the server is responsive.
app.get('/test', (req, res) => {
  res.send('Server is running and test route is working!');
});

// --- API Routes ---
app.use('/api/ideas', ideaRoutes);
app.use('/api/users', userRoutes);
app.use('/api/ai', aiRoutes);

// --- Main Function to Start Server ---
const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected successfully");

    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
    });

  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
    process.exit(1);
  }
};

startServer();