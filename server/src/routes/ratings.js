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
router.get('/summary', getRatingSummary);
router.get('/:id', getRating);
export default router;
