import express from 'express';
import { generateQuiz, submitQuiz, getLatestQuiz } from '../controllers/quizController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/generate', protect, generateQuiz);
router.post('/submit', protect, submitQuiz);
router.get('/latest', protect, getLatestQuiz);

export default router;