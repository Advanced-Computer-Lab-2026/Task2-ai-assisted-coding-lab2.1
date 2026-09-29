import { Router } from 'express';
import {
  getAllRatings,
  getRating,
  createRating,
  getRatingSummary
} from '../controllers/ratingController.js';

const router = Router();

// TODO: wire up the three routes in README.md section 2 and the summary route in section 3.
router.get('/', getAllRatings);
router.get('/:id', getRating);
router.post('/', createRating);
router.get('/summary?bookCode=BK101', getRatingSummary);

export default router;
