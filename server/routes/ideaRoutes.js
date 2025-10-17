// server/routes/ideaRoutes.js

import express from 'express';
import {
  getIdeas,
  createIdea,
  deleteIdea,
  toggleBookmark,
  getBookmarkedIdeas,
  getMyIdeas,
  getUserIdeas
} from '../controllers/ideaController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

/*
|--------------------------------------------------------------------------
| IDEA ROUTES - FINAL VERSION
|--------------------------------------------------------------------------
| Order is important! 
| Text-based routes like '/myideas' and '/mybookmarks' must be defined 
| BEFORE the dynamic route '/:id' to prevent conflicts.
|--------------------------------------------------------------------------
*/

// === USER-SPECIFIC ROUTES ===

// Get all ideas created by the logged-in user
router.route('/myideas').get(protect, getMyIdeas);

// Get all ideas bookmarked by the logged-in user
router.route('/mybookmarks').get(protect, getBookmarkedIdeas);
router.route('/user/:userId').get(getUserIdeas);

// === GENERAL ROUTES ===

// Get all ideas (with pagination, filtering, search)
// Create a new idea (protected)
router.route('/')
  .get(getIdeas)
  .post(protect, createIdea);

// === IDEA-SPECIFIC ROUTES ===

// Delete an idea (only the creator can delete)
router.route('/:id')
  .delete(protect, deleteIdea);

// Toggle bookmark for an idea (add/remove)
router.route('/:id/bookmark')
  .put(protect, toggleBookmark);

export default router;
