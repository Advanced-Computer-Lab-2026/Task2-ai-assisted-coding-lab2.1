import express from 'express';
import {
  createRating,
  getAllRatings,
  getRating,
  getRatingSummary
} from '../controllers/ratingController.js';

const router = express.Router();

// Summary route must come before /:id
router.get('/summary', getRatingSummary);

router.route('/')
  .post(createRating)
  .get(getAllRatings);

router.route('/:id')
  .get(getRating);

export default router;