import { Router } from 'express';
import {
  getAllRatings,
  getRating,
  createRating,
  getRatingSummary
} from '../controllers/ratingController.js';

const router = Router();

// /summary must be registered before /:id, or /:id would capture it.
router.get('/summary', getRatingSummary);
router.get('/', getAllRatings);
router.get('/:id', getRating);
router.post('/', createRating);

export default router;
