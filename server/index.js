// server/index.js - GUARANTEED CORRECT VERSION

// 1. Import and configure dotenv AT THE VERY TOP.
import dotenv from 'dotenv';
dotenv.config();


// 2. Import all other modules AFTER dotenv is configured.
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import ideaRoutes from './routes/ideaRoutes.js';
import userRoutes from './routes/userRoutes.js';

const app = express();

// 3. Now it is safe to read from process.env
const PORT = process.env.PORT || 5001;

// --- Middlewares ---
app.use(cors());
app.use(express.json());

// --- API Routes ---
app.use('/api/ideas', ideaRoutes);
app.use('/api/users', userRoutes);


// --- Main Function to Start Server ---
const startServer = async () => {
  try {
    // This will now correctly read the MONGO_URI
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

// Call the function to start everything
startServer();