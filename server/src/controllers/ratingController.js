import { Rating } from '../models/Rating.js';

// GET /api/ratings
export async function getAllRatings(req, res, next) {
  try {
    const ratings = await Rating.find();

    res.status(200).json({ ratings });
  } catch (err) {
    next(err);
  }
}

// GET /api/ratings/:id
export async function getRating(req, res, next) {
  try {
    const rating = await Rating.findById(req.params.id);

    if (!rating) {
      return res.status(404).json({ message: 'Rating not found' });
    }

    res.status(200).json({ rating });
  } catch (err) {
    next(err);
  }
}

// POST /api/ratings
export async function createRating(req, res, next) {
  try {
    const rating = await Rating.create(req.body);

    res.status(201).json({ rating });
  } catch (err) {
    next(err);
  }
}

// GET /api/ratings/summary?bookCode=BK101
export async function getRatingSummary(req, res, next) {
  try {
    const { bookCode } = req.query;

    if (!bookCode) {
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
      return res.status(200).json({
        bookCode,
        averageRating: 0,
        ratingCount: 0
      });
    }

    res.status(200).json({
      bookCode,
      averageRating: result[0].averageRating,
      ratingCount: result[0].ratingCount
    });
  } catch (err) {
    next(err);
  }
}