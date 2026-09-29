// server/src/controllers/ratingController.js
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
    const rating = await Rating.findById(req.params.id);
    if (!rating) {
      return res.status(404).json({ message: 'Rating not found' });
    }
    res.status(200).json({ rating });
  } catch (err) { next(err); }
}

// POST /api/ratings
export async function createRating(req, res, next) {
  try {
    const { bookCode, rating, note, ratedBy } = req.body;
    const doc = await Rating.create({ bookCode, rating, note, ratedBy });
    res.status(201).json({ rating: doc });
  } catch (err) { next(err); }
}

// GET /api/ratings/summary?bookCode=BK101
export async function getRatingSummary(req, res, next) {
  try {
    const { bookCode } = req.query;
    if (!bookCode || typeof bookCode !== 'string') {
      return res.status(400).json({ message: 'bookCode is required' });
    }

    const [result] = await Rating.aggregate([
      { $match: { bookCode } },
      {
        $group: {
          _id: null,
          averageRating: { $avg: '$rating' },
          ratingCount: { $sum: 1 },
        },
      },
    ]);

    res.status(200).json({
      bookCode,
      averageRating: result ? result.averageRating : 0,
      ratingCount: result ? result.ratingCount : 0,
    });
  } catch (err) { next(err); }
}