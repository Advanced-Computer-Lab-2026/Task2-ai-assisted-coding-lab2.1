import mongoose from 'mongoose';
import { Rating } from '../models/Rating.js';

export const createRating = async (req, res, next) => {
  try {
    const { bookCode, rating, note, ratedBy } = req.body;
    const created = await Rating.create({ bookCode, rating, note, ratedBy });
    res.status(201).json({ rating: created });
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: err.message });
    }
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
    res.status(200).json({ ratings });
  } catch (err) {
    next(err);
  }
};

export const getRating = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid id' });
    }
    const rating = await Rating.findById(req.params.id);
    if (!rating) {
      return res.status(404).json({ message: 'Rating not found' });
    }
    res.status(200).json({ rating });
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

    if (result.length === 0) {
      return res.status(200).json({ bookCode, averageRating: 0, ratingCount: 0 });
    }

    res.status(200).json({
      bookCode,
      averageRating: result[0].averageRating,
      ratingCount: result[0].ratingCount
    });
  } catch (err) {
    next(err);
  }
};