import mongoose from 'mongoose';
import Rating from '../models/Rating.js';

export const createRating = async (req, res, next) => {
  try {
    const { bookCode, rating, note, ratedBy } = req.body;

    if (!bookCode || typeof bookCode !== 'string') {
      return res.status(400).json({ message: 'bookCode is required' });
    }
    if (typeof rating !== 'number' || rating < 1 || rating > 5) {
      return res
        .status(400)
        .json({ message: 'rating is required and must be a number between 1 and 5' });
    }
    if (ratedBy !== undefined && !mongoose.isValidObjectId(ratedBy)) {
      return res.status(400).json({ message: 'ratedBy must be a valid id' });
    }

    const created = await Rating.create({ bookCode, rating, note, ratedBy });
    return res.status(201).json({ rating: created });
  } catch (err) {
    if (err.code === 11000) {
      return res
        .status(409)
        .json({ message: 'This user has already rated this book' });
    }
    next(err);
  }
};

export const getAllRatings = async (req, res, next) => {
  try {
    const ratings = await Rating.find();
    return res.status(200).json({ ratings });
  } catch (err) {
    next(err);
  }
};

export const getRating = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid rating id' });
    }

    const rating = await Rating.findById(id);
    if (!rating) {
      return res.status(404).json({ message: 'Rating not found' });
    }

    return res.status(200).json({ rating });
  } catch (err) {
    next(err);
  }
};

export const getRatingSummary = async (req, res, next) => {
  try {
    const { bookCode } = req.query;

    if (!bookCode || typeof bookCode !== 'string') {
      return res.status(400).json({ message: 'bookCode is required' });
    }

    const [summary] = await Rating.aggregate([
      { $match: { bookCode } },
      {
        $group: {
          _id: '$bookCode',
          averageRating: { $avg: '$rating' },
          ratingCount: { $sum: 1 },
        },
      },
    ]);

    return res.status(200).json({
      bookCode,
      averageRating: summary ? summary.averageRating : 0,
      ratingCount: summary ? summary.ratingCount : 0,
    });
  } catch (err) {
    next(err);
  }
};