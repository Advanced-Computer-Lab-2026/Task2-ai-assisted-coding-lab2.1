import { Router } from 'express';
import {
  getAllRatings,
  getRating,
  createRating,
  getRatingSummary
} from '../controllers/ratingController.js';

const router = Router();

router.get('/', getAllRatings);
router.get('/:id', getRating);
router.post('/', createRating);
router.get('/summary', getRatingSummary);
export default router;
