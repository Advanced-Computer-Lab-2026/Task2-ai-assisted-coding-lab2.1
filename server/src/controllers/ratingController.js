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
    const ratings = await Rating.find().sort({ createdAt: -1 });
    res.json({ ratings });
  } catch (err) { next(err); }
}
// GET /api/ratings/:id
// TODO: implement per README.md section 2.
// GET /api/ratings/:id
export async function getRating(req, res, next) {
  try {
    const rating = await Rating.findById(req.params.id);
    if (!rating) return res.status(404).json({ message: 'Rating not found' });
    res.status(200).json({ rating });
  } catch (err) { next(err); }
}

// POST /api/ratings
export async function createRating(req, res, next) {
  try {
    const { value, error } = createSchema.validate(req.body, { stripUnknown: true });
    if (error) return res.status(400).json({ message: error.message });

    const rating = await Rating.create(value);
    res.status(201).json({ rating });
  } catch (err) {
    if (err.code === 11000) return res.status(409).json({ message: 'User has already rated this book' });
    next(err); 
  }
}

// GET /api/ratings/summary?bookCode=BK101
// TODO: implement per README.md section 3.
// GET /api/ratings/summary
export async function getRatingSummary(req, res, next) {
  try {
    const { bookCode } = req.query;
    
    if (!bookCode) {
      return res.status(400).json({ message: 'bookCode is required' });
    }

    const stats = await Rating.aggregate([
      { $match: { bookCode } },
      { 
        $group: {
          _id: '$bookCode',
          averageRating: { $avg: '$rating' },
          ratingCount: { $sum: 1 }
        }
      }
    ]);

    if (stats.length === 0) {
      return res.status(200).json({
        bookCode,
        averageRating: 0,
        ratingCount: 0
      });
    }

    res.status(200).json({
      bookCode: stats[0]._id,
      averageRating: stats[0].averageRating,
      ratingCount: stats[0].ratingCount
    });
  } catch (err) { next(err); }
}
