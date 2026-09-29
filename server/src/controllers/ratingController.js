import Joi from 'joi';
import mongoose from 'mongoose';
import { Rating } from '../models/Rating.js';

const createSchema = Joi.object({
  bookCode: Joi.string().required(),
  rating: Joi.number().min(1).max(5).required(),
  note: Joi.string().allow('').optional(),
  ratedBy: Joi.string().hex().length(24).optional()
});

// GET /api/ratings
// TODO: implement per README.md section 2.
export async function getAllRatings(req, res, next) {
  try {
    const ratings = await Rating.find().sort({ createdAt: -1 }).lean();
    res.status(200).json({ ratings });
  } catch (err) { next(err); }
}

// GET /api/ratings/:id
// TODO: implement per README.md section 2.
export async function getRating(req, res, next) {
  try {
    const rating = await Rating.findById(req.params.id);
    if (!rating) return res.status(404).json({ message: 'Rating not found' });
    res.status(200).json({ rating });
  } catch (err) { next(err); }
}

// POST /api/ratings
// TODO: implement per README.md section 2.
export async function createRating(req, res, next) {
  try {
    const { value, error } = createSchema.validate(req.body, { abortEarly: false, stripUnknown: true });
    if (error) return res.status(400).json({ message: error.message });

    const payload = { ...value };
    if (payload.ratedBy) {
      payload.ratedBy = new mongoose.Types.ObjectId(payload.ratedBy);
    }

    const rating = await Rating.create(payload);
    res.status(201).json({ rating });
  } catch (err) { next(err); }
}

// GET /api/ratings/summary?bookCode=BK101
// TODO: implement per README.md section 3.
export async function getRatingSummary(req, res, next) {
  try {
    const bookCode = req.query.bookCode;
    const normalizedBookCode = typeof bookCode === 'string' ? bookCode.trim() : '';

    if (!normalizedBookCode) {
      return res.status(400).json({ message: 'bookCode is required' });
    }

    const [summary] = await Rating.aggregate([
      { $match: { bookCode: normalizedBookCode } },
      {
        $group: {
          _id: null,
          averageRating: { $avg: '$rating' },
          ratingCount: { $sum: 1 }
        }
      }
    ]);

    if (!summary) {
      return res.status(200).json({ bookCode: normalizedBookCode, averageRating: 0, ratingCount: 0 });
    }

    res.status(200).json({
      bookCode: normalizedBookCode,
      averageRating: Number(summary.averageRating),
      ratingCount: Number(summary.ratingCount)
    });
  } catch (err) { next(err); }
}
