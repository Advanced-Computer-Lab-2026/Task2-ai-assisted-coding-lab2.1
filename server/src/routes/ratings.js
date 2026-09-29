import { Router } from 'express';
import {
  getAllRatings,
  getRating,
  createRating,
  getRatingSummary
} from '../controllers/ratingController.js';

const router = Router();

// Standard routes
router.post('/', createRating);
router.get('/', getAllRatings);

// Specific named routes MUST come before parameterized routes (/:id)
// Otherwise, Express will try to interpret 'summary' as an ID parameter
router.get('/summary', getRatingSummary);

// Parameterized route
router.get('/:id', getRating);

export default router;