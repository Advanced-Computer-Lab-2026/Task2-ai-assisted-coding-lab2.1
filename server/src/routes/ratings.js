import express from 'express';
import {
  createRating,
  getAllRatings,
  getRating,
  getRatingSummary
} from '../controllers/ratingController.js';

const router = express.Router();

router.post('/', createRating);
router.get('/', getAllRatings);
router.get('/summary', getRatingSummary); // must come BEFORE '/:id'
router.get('/:id', getRating);

export default router;