import Joi from 'joi';
import { Rating } from '../models/Rating.js';

const createSchema = Joi.object({
  bookCode: Joi.string().trim().min(1).required(),
  rating: Joi.number().integer().min(1).max(5).required(),
  note: Joi.string().optional(),
  ratedBy: Joi.string().hex().length(24).optional()
});

// GET /api/ratings
export async function getAllRatings(req, res, next) {
  try {
    const ratings = await Rating.find().sort({ createdAt: -1 }).lean();
    res.json({ ratings });
  } catch (err) { next(err); }
}

// GET /api/ratings/:id
export async function getRating(req, res, next) {
  try {
    const rating = await Rating.findById(req.params.id);
    if (!rating) return res.status(404).json({ message: 'Rating not found' });
    res.json({ rating });
  } catch (err) { next(err); }
}

// POST /api/ratings
export async function createRating(req, res, next) {
  try {
    const { value, error } = createSchema.validate(req.body, { abortEarly: false, stripUnknown: true });
    if (error) return res.status(400).json({ message: error.message });

    const rating = await Rating.create({
      bookCode: value.bookCode,
      rating: value.rating,
      note: value.note,
      ratedBy: value.ratedBy
    });
    res.status(201).json({ rating });
  } catch (err) {
    // The compound unique index rejects a second rating from the same user on
    // the same book (E11000 duplicate key).
    if (err?.code === 11000) return res.status(409).json({ message: 'You already rated this book' });
    next(err);
  }
}

// GET /api/ratings/summary?bookCode=BK101
export async function getRatingSummary(req, res, next) {
  try {
    const { bookCode } = req.query;
    if (!bookCode) return res.status(400).json({ message: 'bookCode is required' });

    const [summary] = await Rating.aggregate([
      { $match: { bookCode } },
      {
        $group: {
          _id: '$bookCode',
          averageRating: { $avg: '$rating' },
          ratingCount: { $sum: 1 }
        }
      }
    ]);

    res.json({
      bookCode,
      averageRating: summary ? summary.averageRating : 0,
      ratingCount: summary ? summary.ratingCount : 0
    });
  } catch (err) { next(err); }
}
