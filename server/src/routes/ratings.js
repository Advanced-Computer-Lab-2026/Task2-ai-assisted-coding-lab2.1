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
router.get('/:id', getRating);
router.get('/summary/?bookcode=:', getRatingSummary);


// TODO: wire up the three routes in README.md section 2 and the summary route in section 3.

export default router;
