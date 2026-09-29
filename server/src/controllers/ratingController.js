
const mongoose = require('mongoose');
const Rating = require('../models/Rating');

// POST /api/ratings
const createRating = async (req, res, next) => {
  try {
    const { bookCode, rating, note, ratedBy } = req.body;

    if (!bookCode || typeof bookCode !== 'string' || !bookCode.trim()) {
      return res.status(400).json({
        message: 'bookCode is required'
      });
    }

    if (
      rating === undefined ||
      rating === null ||
      rating === '' ||
      !Number.isFinite(Number(rating)) ||
      Number(rating) < 1 ||
      Number(rating) > 5
    ) {
      return res.status(400).json({
        message: 'rating must be between 1 and 5'
      });
    }

    if (
      ratedBy !== undefined &&
      !mongoose.isValidObjectId(ratedBy)
    ) {
      return res.status(400).json({
        message: 'Invalid ratedBy'
      });
    }

    const newRating = await Rating.create({
      bookCode: bookCode.trim(),
      rating: Number(rating),
      note,
      ratedBy
    });

    return res.status(201).json({
      rating: newRating
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({
        message: 'User has already rated this book'
      });
    }

    if (err.name === 'ValidationError' ||
        err.name === 'CastError') {
      return res.status(400).json({
        message: err.message
      });
    }

    next(err);
  }
};

// GET /api/ratings
const getAllRatings = async (req, res, next) => {
  try {
    const ratings = await Rating.find();

    return res.status(200).json({
      ratings
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/ratings/:id
const getRating = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        message: 'Invalid rating id'
      });
    }

    const rating = await Rating.findById(id);

    if (!rating) {
      return res.status(404).json({
        message: 'Rating not found'
      });
    }

    return res.status(200).json({
      rating
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/ratings/summary?bookCode=BK101
const getRatingSummary = async (req, res, next) => {
  try {
    const { bookCode } = req.query;

    if (
      typeof bookCode !== 'string' ||
      !bookCode.trim()
    ) {
      return res.status(400).json({
        message: 'bookCode is required'
      });
    }

    const result = await Rating.aggregate([
      {
        $match: {
          bookCode: bookCode.trim()
        }
      },
      {
        $group: {
          _id: '$bookCode',
          averageRating: { $avg: '$rating' },
          ratingCount: { $sum: 1 }
        }
      }
    ]);

    const summary = result[0];

    return res.status(200).json({
      bookCode: bookCode.trim(),
      averageRating: summary
        ? Number(summary.averageRating.toFixed(2))
        : 0,
      ratingCount: summary ? summary.ratingCount : 0
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createRating,
  getAllRatings,
  getRating,
  getRatingSummary
};