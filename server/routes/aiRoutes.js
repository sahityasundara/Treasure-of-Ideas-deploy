// server/routes/aiRoutes.js
import express from 'express';
import { generateIdea } from '../controllers/aiController.js';
import { protect } from '../middleware/authMiddleware.js'; // We protect this route
const router = express.Router();

// The full path will be /api/ai/generate-idea
router.post('/generate-idea', protect, generateIdea);

export default router;