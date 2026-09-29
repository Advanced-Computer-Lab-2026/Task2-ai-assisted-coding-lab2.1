import { Rating } from '../models/Rating.js';

// 1. Create a rating
export const createRating = async (req, res, next) => {
  try {
    const newRating = await Rating.create(req.body);
    res.status(201).json({ rating: newRating });
  } catch (err) {
    next(err);
  }
};

// 2. Get all ratings
export const getAllRatings = async (req, res, next) => {
  try {
    const ratings = await Rating.find({});
    res.status(200).json({ ratings });
  } catch (err) {
    next(err);
  }
};

// 3. Get a single rating by ID
export const getRating = async (req, res, next) => {
  try {
    const rating = await Rating.findById(req.params.id);
    if (!rating) {
      return res.status(404).json({ message: 'Rating not found' });
    }
    res.status(200).json({ rating });
  } catch (err) {
    next(err);
  }
};

// 4. Get summary via aggregation
export const getRatingSummary = async (req, res, next) => {
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
      bookCode,
      averageRating: stats[0].averageRating,
      ratingCount: stats[0].ratingCount
    });
  } catch (err) {
    next(err);
  }
};