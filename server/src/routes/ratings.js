import { Router } from 'express';
import {
  getAllRatings,
  getRating,
  createRating,
  getRatingSummary
} from '../controllers/ratingController.js';

const router = Router();

router.post('/', createRating);
router.get('/', getAllRatings);
// Must be registered before '/:id' so "summary" isn't treated as an id.
router.get('/summary', getRatingSummary);
router.get('/:id', getRating);

export default router;