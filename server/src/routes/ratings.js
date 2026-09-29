import { Router } from 'express';
import {
  getAllRatings,
  getRating,
  createRating,
  getRatingSummary
} from '../controllers/ratingController.js';

const router = Router();

// Summary MUST be before /:id so it is not swallowed by the id route
router.get('/summary', getRatingSummary);

router.post('/', createRating);
router.get('/', getAllRatings);
router.get('/:id', getRating);

export default router;
