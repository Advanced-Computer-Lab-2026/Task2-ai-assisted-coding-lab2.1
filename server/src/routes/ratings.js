import { Router } from 'express';
import {
  getAllRatings,
  getRating,
  createRating,
  getRatingSummary
} from '../controllers/ratingController.js';

const router = Router();

// TODO: wire up the three routes in README.md section 2 and the summary route in section 3.
router.route('/')
  .get(getAllRatings)
  .post(createRating);

// Rating summary route (placed before /:id to prevent parameter conflict)
router.route('/summary')
  .get(getRatingSummary);

// Routes for handling a specific rating by ID
router.route('/:id')
  .get(getRating);
export default router;
