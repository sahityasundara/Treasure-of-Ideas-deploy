import express from 'express';
import { generateIdea } from '../controllers/aiController.js';
import { protect } from '../middleware/authMiddleware.js';
const router = express.Router();

router.post('/generate-idea', protect, generateIdea);

export default router;