import { Router } from 'express';
import {
  createRating,
  getAllRatings,
  getRatingSummary,
  getRating,
} from '../controllers/ratingController.js';

const router = Router();

router.post('/', createRating);
router.get('/', getAllRatings);
router.get('/summary', getRatingSummary); // Must come before /:id
router.get('/:id', getRating);

export default router;