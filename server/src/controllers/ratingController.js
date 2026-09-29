import Joi from 'joi';
import mongoose from 'mongoose';
import { Rating } from '../models/Rating.js';

const createSchema = Joi.object({
  bookCode: Joi.string().required(),
  rating:   Joi.number().integer().min(1).max(5).required(),
  note:     Joi.string().allow('', null),
  ratedBy:  Joi.string().hex().length(24).allow(null, ''),
});

// GET /api/ratings
export async function getAllRatings(req, res, next) {
  try {
    const ratings = await Rating.find().sort({ createdAt: -1 }).lean();
    res.status(200).json({ ratings });
  } catch (err) { next(err); }
}

// GET /api/ratings/:id
export async function getRating(req, res, next) {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid rating ID' });
    }
    const rating = await Rating.findById(req.params.id);
    if (!rating) return res.status(404).json({ message: 'Rating not found' });
    res.status(200).json({ rating });
  } catch (err) { next(err); }
}

// POST /api/ratings
export async function createRating(req, res, next) {
  try {
    const { value, error } = createSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.message });

    const rating = await Rating.create(value);
    res.status(201).json({ rating });
  } catch (err) { next(err); }
}

// GET /api/ratings/summary?bookCode=BK101
export async function getRatingSummary(req, res, next) {
  try {
    const { bookCode } = req.query;
    if (!bookCode) return res.status(400).json({ message: 'bookCode is required' });

    const [result] = await Rating.aggregate([
      { $match: { bookCode } },
      {
        $group: {
          _id: '$bookCode',
          averageRating: { $avg: '$rating' },
          ratingCount:   { $sum: 1 },
        },
      },
    ]);

    if (!result) {
      return res.status(200).json({ bookCode, averageRating: 0, ratingCount: 0 });
    }

    res.status(200).json({
      bookCode:      result._id,
      averageRating: result.averageRating,
      ratingCount:   result.ratingCount,
    });
  } catch (err) { next(err); }
}
