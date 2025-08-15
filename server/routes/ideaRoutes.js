// server/routes/ideaRoutes.js

import express from 'express';
// Add getBookmarkedIdeas to the import list
import { getIdeas, createIdea, deleteIdea, toggleBookmark, getBookmarkedIdeas } from '../controllers/ideaController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// --- ADD THIS NEW ROUTE ---
// This must be defined BEFORE the '/:id' route to avoid conflicts
router.route('/mybookmarks').get(protect, getBookmarkedIdeas);

// Existing routes...
router.route('/').get(getIdeas).post(protect, createIdea);
router.route('/:id').delete(protect, deleteIdea);
router.route('/:id/bookmark').put(protect, toggleBookmark);

export default router;