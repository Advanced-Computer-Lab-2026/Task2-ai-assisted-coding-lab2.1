import { Rating } from '../models/Rating.js';
import Joi from 'joi';
/*### 2. Controller + routes

Implement these three controller functions and wire them in
`server/src/routes/ratings.js`:

| method | path | function | success response |
|---|---|---|---|
| POST | `/api/ratings` | `createRating` | `201` `{ rating: <document> }` |
| GET | `/api/ratings` | `getAllRatings` | `200` `{ ratings: [...] }` |
| GET | `/api/ratings/:id` | `getRating` | `200` `{ rating: <document> }` |

- For `GET /api/ratings/:id` on a valid id that does not exist, respond
  `404` with `{ message: 'Rating not found' }`.
- Pass unexpected errors to `next(err)`, as the User controller does.*/

// GET /api/ratings
// TODO: implement per README.md section 2.

const createSchema = Joi.object({
  bookCode: Joi.string().required(),
  rating: Joi.number().min(1).max(5).required(),
  note: Joi.string().optional(),
  ratedBy: Joi.string().optional()
});

export async function getAllRatings(req, res, next) {
  try {
    const ratings = await Rating.find();
    res.json({ ratings });
  } catch (err) { next(err); }
}

// GET /api/ratings/:id
// TODO: implement per README.md section 2.
export async function getRating(req, res, next) {
  try {
    const rating = await Rating.findById(req.params.id);
    if (!rating) {
      return res.status(404).json({ message: 'Rating not found' });
    }
    res.json({ rating });
  } catch (err) { next(err); }
}

// POST /api/ratings
// TODO: implement per README.md section 2.
export async function createRating(req, res, next) {
  try {
    const { value, error } = createSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.message });
    } 
    const rating = await Rating.create(value);
    res.status(201).json({ rating });

    
  } catch (err) { next(err); }
}

// GET /api/ratings/summary?bookCode=BK101
// TODO: implement per README.md section 3.
export async function getRatingSummary(req, res, next) {
  try {
    const { bookCode } = req.query;

    if (!bookCode) {
      return res.status(400).json({ message: 'bookCode is required' });
    }

    const result = await Rating.aggregate([
      {
        $match: { bookCode }
      },
      {
        $group: {
          _id: null,
          averageRating: { $avg: '$rating' },
          ratingCount: { $sum: 1 }
        }
      }
    ]);

    if (result.length === 0) {
      return res.json({
        bookCode,
        averageRating: 0,
        ratingCount: 0
      });
    }

    res.json({
      bookCode,
      averageRating: result[0].averageRating,
      ratingCount: result[0].ratingCount
    });
  } catch (err) {
    next(err);
  }
}
