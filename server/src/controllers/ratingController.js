import { Rating } from '../models/Rating.js';

export async function getAllRatings(req, res, next) {
  try {
    const ratings = await Rating.find().sort({ createdAt: -1 }).lean();
    res.json({ ratings });
  } catch (err) {
    next(err);
  }
}

export async function getRating(req, res, next) {
  try {
    const rating = await Rating.findById(req.params.id);
    if (!rating) return res.status(404).json({ message: 'Rating not found' });
    res.json({ rating });
  } catch (err) {
    next(err);
  }
}

export async function createRating(req, res, next) {
  try {
    const rating = await Rating.create(req.body);
    res.status(201).json({ rating });
  } catch (err) {
    next(err);
  }
}

export async function getRatingSummary(req, res, next) {
  try {
    const { bookCode } = req.query;
    if (!bookCode) return res.status(400).json({ message: 'bookCode is required' });

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

    const summary = result[0];
    res.json({
      bookCode,
      averageRating: summary?.averageRating ?? 0,
      ratingCount: summary?.ratingCount ?? 0
    });
  } catch (err) {
    next(err);
  }
}
