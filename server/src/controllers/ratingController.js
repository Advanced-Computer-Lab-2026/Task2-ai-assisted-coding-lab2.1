import mongoose from 'mongoose';
import { Rating } from '../models/Rating.js';

// GET /api/ratings
export async function getAllRatings(req, res, next) {
  try {
    const ratings = await Rating.find();
    res.status(200).json({ ratings });
  } catch (err) { next(err); }
}

// GET /api/ratings/:id
export async function getRating(req, res, next) {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid id' });
    }
    const rating = await Rating.findById(id);
    if (!rating) {
      return res.status(404).json({ message: 'Rating not found' });
    }
    res.status(200).json({ rating });
  } catch (err) { next(err); }
}

// POST /api/ratings
export async function createRating(req, res, next) {
  try {
    const { bookCode, rating, note, ratedBy } = req.body || {};

    if (typeof bookCode !== 'string' || !bookCode.trim()) {
      return res.status(400).json({ message: 'bookCode is required' });
    }
    if (typeof rating !== 'number' || Number.isNaN(rating) || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'rating must be a number between 1 and 5' });
    }
    if (ratedBy !== undefined && !mongoose.isValidObjectId(ratedBy)) {
      return res.status(400).json({ message: 'Invalid ratedBy' });
    }

    const doc = await Rating.create({ bookCode: bookCode.trim(), rating, note, ratedBy });
    res.status(201).json({ rating: doc });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: 'This user has already rated this book' });
    }
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: err.message });
    }
    next(err);
  }
}

// GET /api/ratings/summary?bookCode=BK101
export async function getRatingSummary(req, res, next) {
  try {
    const { bookCode } = req.query;
    if (typeof bookCode !== 'string' || !bookCode.trim()) {
      return res.status(400).json({ message: 'bookCode is required' });
    }

    const [result] = await Rating.aggregate([
      { $match: { bookCode } },
      { $group: { _id: '$bookCode', averageRating: { $avg: '$rating' }, ratingCount: { $sum: 1 } } }
    ]);

    res.status(200).json({
      bookCode,
      averageRating: result ? result.averageRating : 0,
      ratingCount: result ? result.ratingCount : 0
    });
  } catch (err) { next(err); }
}