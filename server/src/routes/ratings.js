import { Router } from 'express';
import {
  getAllRatings,
  getRating,
  createRating,
  getRatingSummary
} from '../controllers/ratingController.js';

const router = Router();

router.get('/', getAllRatings);
router.post('/', createRating);
router.get('/summary', getRatingSummary); // must be before '/:id'
router.get('/:id', getRating);

export { router };
export default router;
