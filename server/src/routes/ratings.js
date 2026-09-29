import { Router } from 'express';
import {
  getAllRatings,
  getRating,
  createRating,
  getRatingSummary
} from '../controllers/ratingController.js';

const router = Router();

// Summary route must be defined before /:id[cite: 1]
router.route('/summary').get(getRatingSummary);

router.route('/')
  .get(getAllRatings)
  .post(createRating);

router.route('/:id').get(getRating);

export default router;