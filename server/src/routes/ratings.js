import { Router } from 'express';
import {
  getAllRatings,
  getRating,
  createRating,
  getRatingSummary
} from '../controllers/ratingController.js';

const router = Router();

// TODO: wire up the three routes in README.md section 2 and the summary route in section 3.

// POST /api/ratings - Create a new rating
router.post('/', createRating);

// GET /api/ratings - Get all ratings
router.get('/', getAllRatings);

// GET /api/ratings/summary - Get rating summary for a book (must come before /:id)
router.get('/summary', getRatingSummary);

// GET /api/ratings/:id - Get a single rating by ID
router.get('/:id', getRating);

export default router;
