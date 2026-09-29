import Joi from 'joi';
import { Rating } from '../models/Rating.js';

const createSchema = Joi.object({
  bookCode: Joi.string().required(),
  rating: Joi.number().min(1).max(5).required(),
  note: Joi.string(),
  ratedBy: Joi.string().hex().length(24)
});

// GET /api/ratings
// TODO: implement per README.md section 2.
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
    if (!rating) return res.status(404).json({ message: 'Rating not found' });
    res.json({ rating });
  } catch (err) { next(err); }
}

// POST /api/ratings
// TODO: implement per README.md section 2.
export async function createRating(req, res, next) {
  try {
    const { value, error } = createSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.message });

    const rating = await Rating.create(value);
    res.status(201).json({ rating });
  } catch (err) { next(err); }
}

// GET /api/ratings/summary?bookCode=BK101
// TODO: implement per README.md section 3.
export async function getRatingSummary(req, res, next) {
  try {
    const { bookCode } = req.query;
    if (!bookCode) return res.status(400).json({ message: 'bookCode is required' });

    const [summary] = await Rating.aggregate([
      { $match: { bookCode } },
      { $group: { _id: '$bookCode', averageRating: { $avg: '$rating' }, ratingCount: { $sum: 1 } } }
    ]);

    if (!summary) return res.json({ bookCode, averageRating: 0, ratingCount: 0 });

    res.json({ bookCode, averageRating: summary.averageRating, ratingCount: summary.ratingCount });
  } catch (err) { next(err); }
}
