import Rating from '../models/Rating.js';

// POST /api/ratings
export const createRating = async (req, res, next) => {
  try {
    const { bookCode, rating, note, ratedBy } = req.body;
    const newRating = await Rating.create({ bookCode, rating, note, ratedBy });
    res.status(201).json({ rating: newRating });
  } catch (err) {
    next(err);
  }
};

// GET /api/ratings
export const getAllRatings = async (req, res, next) => {
  try {
    const ratings = await Rating.find();
    res.status(200).json({ ratings });
  } catch (err) {
    next(err);
  }
};

// GET /api/ratings/summary?bookCode=BK101
export const getRatingSummary = async (req, res, next) => {
  try {
    const { bookCode } = req.query;

    if (!bookCode) {
      return res.status(400).json({ message: 'bookCode is required' });
    }

    const summary = await Rating.aggregate([
      { $match: { bookCode } },
      {
        $group: {
          _id: '$bookCode',
          averageRating: { $avg: '$rating' },
          ratingCount: { $sum: 1 },
        },
      },
    ]);

    if (summary.length === 0) {
      return res.status(200).json({
        bookCode,
        averageRating: 0,
        ratingCount: 0,
      });
    }

    res.status(200).json({
      bookCode,
      averageRating: summary[0].averageRating,
      ratingCount: summary[0].ratingCount,
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/ratings/:id
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