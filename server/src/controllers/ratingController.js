import { Rating } from '../models/Rating.js';
import Joi from 'joi';

const createSchema = Joi.object({
  bookCode: Joi.string().trim().required(),
  rating: Joi.number().min(1).max(5).required(),
  note: Joi.string().allow('', null).optional(),
  ratedBy: Joi.string().hex().length(24).optional()
});

const updateSchema = Joi.object({
  bookCode: Joi.string().trim(),
  rating: Joi.number().min(1).max(5),
  note: Joi.string().allow('', null),
  ratedBy: Joi.string().hex().length(24)
});

// GET /api/ratings
// TODO: implement per README.md section 2.
export async function getAllRatings(req, res, next) {
  try {
    // TODO
    const ratings = await Rating.find().sort({ createdAt: -1 });
    res.json({ ratings });
  } catch (err) { next(err); }
}

// GET /api/ratings/:id
// TODO: implement per README.md section 2.
export async function getRating(req, res, next) {
  try {
    // TODO
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
    // TODO
    const { value, error } = createSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.message });
    }

    // Check if this user already rated this book
    if (value.ratedBy) {
      const existing = await Rating.findOne({
        bookCode: value.bookCode,
        ratedBy: value.ratedBy
      });
      if (existing) {
        return res.status(409).json({ message: 'Rating already exists for this book and user' });
      }
    }

    const rating = await Rating.create(value);
    res.status(201).json({ rating });
  } catch (err) {
    // Catch MongoDB duplicate key error (code 11000) from the compound unique index
    if (err.code === 11000) {
      return res.status(409).json({ message: 'Rating already exists for this book and user' });
    }
    next(err);
  }
}

// GET /api/ratings/summary?bookCode=BK101
// TODO: implement per README.md section 3.
export async function getRatingSummary(req, res, next) {
  try {
    // TODO
    const { bookCode } = req.query;

    // Validate that bookCode query param exists
    if (!bookCode) {
      return res.status(400).json({ message: 'bookCode is required' });
    }

    // Run aggregation: match bookCode, group to calculate avg and count
    const result = await Rating.aggregate([
      { $match: { bookCode } },
      {
        $group: {
          _id: '$bookCode',
          averageRating: { $avg: '$rating' },
          ratingCount: { $sum: 1 }
        }
      }
    ]);

    // If no ratings match, return default zeros
    if (result.length === 0) {
      return res.json({
        bookCode,
        averageRating: 0,
        ratingCount: 0
      });
    }

    // Return the aggregated results
    res.json({
      bookCode,
      averageRating: result[0].averageRating,
      ratingCount: result[0].ratingCount
    });
  } catch (err) {
    next(err);
  }
}
