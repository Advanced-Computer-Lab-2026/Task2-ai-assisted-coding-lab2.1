const mongoose = require('mongoose');
const Rating = require('../models/Rating');

// POST /api/ratings
exports.createRating = async (req, res, next) => {
  try {
    const { bookCode, rating, note, ratedBy } = req.body;

    if (!bookCode || rating === undefined) {
      return res.status(400).json({ message: 'bookCode and rating are required' });
    }

    const doc = await Rating.create({ bookCode, rating, note, ratedBy });
    return res.status(201).json({ rating: doc });
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: err.message });
    }
    if (err.code === 11000) {
      return res.status(409).json({ message: 'This user already rated this book' });
    }
    next(err);
  }
};

// GET /api/ratings
exports.getAllRatings = async (req, res, next) => {
  try {
    const ratings = await Rating.find();
    return res.status(200).json({ ratings });
  } catch (err) {
    next(err);
  }
};

// GET /api/ratings/:id
exports.getRating = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid rating id' });
    }
    const doc = await Rating.findById(req.params.id);
    if (!doc) {
      return res.status(404).json({ message: 'Rating not found' });
    }
    return res.status(200).json({ rating: doc });
  } catch (err) {
    next(err);
  }
};

// GET /api/ratings/summary?bookCode=BK101
exports.getRatingSummary = async (req, res, next) => {
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
          ratingCount: { $sum: 1 },
        },
      },
    ]);

    if (result.length === 0) {
      return res.status(200).json({ bookCode, averageRating: 0, ratingCount: 0 });
    }

    return res.status(200).json({
      bookCode,
      averageRating: result[0].averageRating,
      ratingCount: result[0].ratingCount,
    });
  } catch (err) {
    next(err);
  }
};