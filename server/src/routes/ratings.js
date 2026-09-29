import { Router } from 'express';
import {
  getAllRatings,
  getRating,
  createRating,
  getRatingSummary
} from '../controllers/ratingController.js';

const router = Router();

// TODO: wire up the three routes in README.md section 2 and the summary route in section 3.

router.post('/', createRating);
router.get('/', getAllRatings);

// IMPORTANT: /summary must come BEFORE /:id,
// otherwise Express treats "summary" as an id.
router.get('/summary', getRatingSummary);

router.get('/:id', getRating);
export default router;
