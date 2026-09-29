import { Router } from 'express';
import {
  getAllRatings,
  getRating,
  createRating,
  getRatingSummary
} from '../controllers/ratingController.js';

const router = Router();

// TODO: wire up the three routes in README.md section 2 and the summary route in section 3.
/* | method | path | function | success response |
|---|---|---|---|
| POST | `/api/ratings` | `createRating` | `201` `{ rating: <document> }` |
| GET | `/api/ratings` | `getAllRatings` | `200` `{ ratings: [...] }` |
| GET | `/api/ratings/:id` | `getRating` | `200` `{ rating: <document> }` |*/

router.post('/', createRating);
router.get('/', getAllRatings);
router.get("/:id", getRating);
router.get('/summary', getRatingSummary);

export default router;
