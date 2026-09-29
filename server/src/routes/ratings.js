import { Router } from 'express';
import {
  getAllRatings,
  getRating,
  createRating,
  getRatingSummary
} from '../controllers/ratingController.js';

const router = Router();

// /summary must be defined before /:id so Express doesn't treat 'summary' as an ID parameter
router.get('/summary', getRatingSummary);

router.get('/', getAllRatings);
router.get('/:id', getRating);
router.post('/', createRating);

export default router;