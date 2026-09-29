import { Router } from 'express';
import {
  getAllRatings,
  getRating,
  createRating,
  getRatingSummary
} from '../controllers/ratingController.js';

const router = Router();

// /summary must come before /:id so "summary" is not treated as an id.
router.get('/summary', getRatingSummary);
router.get('/', getAllRatings);
router.get('/:id', getRating);
router.post('/', createRating);

export default router;
