import { Rating } from '../models/Rating.js';
import Joi from 'joi';
import mongoose from 'mongoose';

// GET /api/ratings
const createSchema = Joi.object({
  bookCode: Joi.string().required(),
  rating: Joi.number().min(1).max(5).required(),
  note: Joi.string().allow(''),
  ratedBy: Joi.string()
});

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
     if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid rating id' });
    }
    const rating = await Rating.findById(req.params.id);
    if (!rating) return res.status(404).json({ message: 'Rating not found' });
    res.json({ rating });
  
  } catch (err) { next(err); }
}

// POST /api/ratings
// TODO: implement per README.md section 2.
export async function createRating(req, res, next) {
  try {
    // TODO
        const { value, error } = createSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.message });

    const rating = await Rating.create(value);
    res.status(201).json({ rating });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: 'This user already rated this book' });
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
      return res.json({ bookCode, averageRating: 0, ratingCount: 0 });
    }

    res.json({
      bookCode,
      averageRating: result[0].averageRating,
      ratingCount: result[0].ratingCount
    });
  } catch (err) { next(err); }
}
