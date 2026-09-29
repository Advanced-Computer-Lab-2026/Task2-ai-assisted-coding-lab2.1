import Joi from 'joi';
import mongoose from 'mongoose';
import { Rating } from '../models/Rating.js';

const createSchema = Joi.object({
  bookCode: Joi.string().trim().required(),
  rating: Joi.number().integer().min(1).max(5).required(),
  note: Joi.string().allow(''),
  ratedBy: Joi.string().hex().length(24)
});

function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

// GET /api/ratings
export async function getAllRatings(req, res, next) {
  try {
    const ratings = await Rating.find()
      .sort({ createdAt: -1 })
      .populate('ratedBy', 'name email');

    res.json({ ratings });
  } catch (err) {
    next(err);
  }
}

// GET /api/ratings/:id
export async function getRating(req, res, next) {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid rating id' });
    }

    const rating = await Rating.findById(req.params.id)
      .populate('ratedBy', 'name email');

    if (!rating) {
      return res.status(404).json({ message: 'Rating not found' });
    }

    res.json({ rating });
  } catch (err) {
    next(err);
  }
}

// POST /api/ratings
export async function createRating(req, res, next) {
  try {
    const { value, error } = createSchema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      return res.status(400).json({
        message: error.details.map(detail => detail.message).join(', ')
      });
    }

    const existing = await Rating.findOne({
      bookCode: value.bookCode,
      ratedBy: value.ratedBy ?? null
    });

    if (existing) {
      return res.status(409).json({
        message: 'You have already rated this book'
      });
    }

    const rating = await Rating.create(value);

    const populatedRating = await Rating.findById(rating._id)
      .populate('ratedBy', 'name email');

    res.status(201).json({
      rating: populatedRating
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({
        message: 'You have already rated this book'
      });
    }

    next(err);
  }
}

// GET /api/ratings/summary?bookCode=BK101
export async function getRatingSummary(req, res, next) {
  try {
    const { bookCode } = req.query;

    if (!bookCode || !bookCode.trim()) {
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
          averageRating: {
            $avg: '$rating'
          },
          ratingCount: {
            $sum: 1
          }
        }
      }
    ]);

    if (result.length === 0) {
      return res.json({
        bookCode: bookCode.trim(),
        averageRating: 0,
        ratingCount: 0
      });
    }

    res.json({
      bookCode: bookCode.trim(),
      averageRating: result[0].averageRating,
      ratingCount: result[0].ratingCount
    });
  } catch (err) {
    next(err);
  }
}