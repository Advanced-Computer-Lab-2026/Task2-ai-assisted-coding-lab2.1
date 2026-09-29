import { Rating } from '../models/Rating.js';
const mongoose = require('mongoose');

// GET /api/ratings
// TODO: implement per README.md section 2.

export async function getAllRatings(req, res, next) {
  try {
    // TODO
    const ratings = await Rating.find();
    res.status(200).json({ ratings });
  } catch (err) { next(err); }
}

// GET /api/ratings/:id
// TODO: implement per README.md section 2.
export async function getRating(req, res, next) {
  try {
    // TODO
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid id' });
    }

    const rating = await Rating.findById(id);
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
    // TODO
    const { bookCode, rating, note, ratedBy } = req.body;

    if (!bookCode || rating === undefined) {
      return res.status(400).json({ message: 'bookCode and rating are required' });
    }

    const created = await Rating.create({ bookCode, rating, note, ratedBy });
    res.status(201).json({ rating: created });
  } catch (err) { next(err); }
}

// GET /api/ratings/summary?bookCode=BK101
// TODO: implement per README.md section 3.
export async function getRatingSummary(req, res, next) {
  try {
    // TODO
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
          ratingCount: { $sum: 1 },
        },
      },
    ]);

    if (result.length === 0) {
      return res.status(200).json({ bookCode, averageRating: 0, ratingCount: 0 });
    }

    res.status(200).json({
      bookCode,
      averageRating: result[0].averageRating,
      ratingCount: result[0].ratingCount,
    });
  } catch (err) { next(err); }

}
module.exports = { createRating, getAllRatings, getRating, getRatingSummary };

