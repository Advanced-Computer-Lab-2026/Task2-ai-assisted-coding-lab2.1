import { Router } from 'express';
import {
  getAllRatings,
  getRating,
  createRating,
  getRatingSummary
} from '../controllers/ratingController.js';

const router = Router();

router.route('/').post(createRating).get(getAllRatings);

// Must be defined before /:id so Express doesn't match 'summary' as an id parameter
router.get('/summary', getRatingSummary);

router.route('/:id').get(getRating);

export default router;