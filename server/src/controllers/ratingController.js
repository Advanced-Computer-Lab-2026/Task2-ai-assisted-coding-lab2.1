import { Rating } from '../models/Rating.js';

// GET /api/ratings
// TODO: implement per README.md section 2.
export async function getAllRatings(req, res, next) {
  try {
    const ratings = await Rating.find().populate('ratedBy');
    res.status(200).json({ ratings });
  } catch (err) { next(err); }
}

// GET /api/ratings/:id
// TODO: implement per README.md section 2.
export async function getRating(req, res, next) {
  try {
    const { id } = req.params;
    const rating = await Rating.findById(id).populate('ratedBy');

    if (!rating) {
      return res.status(404).json({ message: 'Rating not found' });
    }

    res.status(200).json({ rating });
  } catch (err) { next(err); }
}

// POST /api/ratings
// TODO: implement per README.md section 2.
export async function createRating(req, res, next) {
  try {
    const { bookCode, rating, note, ratedBy } = req.body;

    // Validation
    if (!bookCode || rating === undefined) {
      return res.status(400).json({ message: 'bookCode and rating are required' });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'rating must be between 1 and 5' });
    }

    const newRating = new Rating({
      bookCode,
      rating,
      note: note || undefined,
      ratedBy: ratedBy || undefined,
    });

    const savedRating = await newRating.save();
    res.status(201).json({ rating: savedRating });
  } catch (err) { next(err); }
}

// GET /api/ratings/summary?bookCode=BK101
// TODO: implement per README.md section 3.
export async function getRatingSummary(req, res, next) {
  try {
    const { bookCode } = req.query;

    if (!bookCode) {
      return res.status(400).json({ message: 'bookCode is required' });
    }

    const summary = await Rating.aggregate([
      { $match: { bookCode } },
      {
        $group: {
          _id: null,
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

    const { averageRating, ratingCount } = summary[0];
    res.status(200).json({
      bookCode,
      averageRating,
      ratingCount,
    });
  } catch (err) { next(err); }
}
//hhhhh