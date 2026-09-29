import Joi from 'joi';
import { Rating } from '../models/Rating.js';

const createSchema = Joi.object({
  bookCode: Joi.string().trim().required(),
  rating: Joi.number().min(1).max(5).required(),
  note: Joi.string().allow('').optional(),
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

    const rating = await Rating.create(value);
    res.status(201).json({ rating });
  } catch (err) { next(err); }
}

// GET /api/ratings/summary?bookCode=BK101
export async function getRatingSummary(req, res, next) {
  try {
    const bookCode = Array.isArray(req.query.bookCode) ? req.query.bookCode[0] : req.query.bookCode;
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

    if (!summary) {
      return res.status(200).json({ bookCode, averageRating: 0, ratingCount: 0 });
    }

    res.status(200).json({
      bookCode: summary._id,
      averageRating: Number(summary.averageRating),
      ratingCount: summary.ratingCount
    });
  } catch (err) { next(err); }
}
