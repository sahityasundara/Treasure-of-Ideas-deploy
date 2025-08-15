// server/routes/userRoutes.js
import express from 'express';
import { registerUser, loginUser } from '../controllers/userController.js';
import { getUserIdeas } from '../controllers/ideaController.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/:userId/ideas', getUserIdeas); 

export default router;