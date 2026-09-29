import Joi from 'joi';
import mongoose from 'mongoose';
import { Rating } from '../models/Rating.js';

const createSchema = Joi.object({
  bookCode: Joi.string().required(),
  rating: Joi.number().min(1).max(5).required(),
  note: Joi.string().allow('').optional(),
  ratedBy: Joi.alternatives().try(
    Joi.string().pattern(/^[0-9a-fA-F]{24}$/),
    Joi.custom((value) => {
      if (value instanceof mongoose.Types.ObjectId) return value;
      throw new Error('Invalid ObjectId');
    }, 'ObjectId')
  ).optional()
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

    const payload = { ...value };
    if (payload.ratedBy && typeof payload.ratedBy === 'string') {
      payload.ratedBy = new mongoose.Types.ObjectId(payload.ratedBy);
    }

    const rating = await Rating.create(payload);
    res.status(201).json({ rating });
  } catch (err) {
    if (err?.code === 11000) {
      return res.status(409).json({ message: 'Rating already exists for this book and user' });
    }
    next(err);
  }
}

// GET /api/ratings/summary?bookCode=BK101
export async function getRatingSummary(req, res, next) {
  try {
    const bookCode = req.query.bookCode;
    if (!bookCode || !String(bookCode).trim()) {
      return res.status(400).json({ message: 'bookCode is required' });
    }

    const key = String(bookCode);
    const result = await Rating.aggregate([
      { $match: { bookCode: key } },
      { $group: { _id: '$bookCode', averageRating: { $avg: '$rating' }, ratingCount: { $sum: 1 } } }
    ]);

    if (!result.length) {
      return res.json({ bookCode: key, averageRating: 0, ratingCount: 0 });
    }

    const summary = result[0];
    return res.json({
      bookCode: key,
      averageRating: Number(summary.averageRating),
      ratingCount: summary.ratingCount
    });
  } catch (err) { next(err); }
}
