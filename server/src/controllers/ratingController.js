import { Rating } from '../models/Rating.js';

// GET /api/ratings
// TODO: implement per README.md section 2.
// export async function getAllRatings(req, res, next) {
//   try {
//     // TODO
//   } catch (err) { next(err); }
// }

// // GET /api/ratings/:id
// // TODO: implement per README.md section 2.
// export async function getRating(req, res, next) {
//   try {
//     // TODO
//   } catch (err) { next(err); }
// }

// // POST /api/ratings
// // TODO: implement per README.md section 2.
// export async function createRating(req, res, next) {
//   try {
//     // TODO
//   } catch (err) { next(err); }
// }

// // GET /api/ratings/summary?bookCode=BK101
// // TODO: implement per README.md section 3.
// export async function getRatingSummary(req, res, next) {
//   try {
//     // TODO
//   } catch (err) { next(err); }
// }



const Rating = require('../models/Rating');

// POST /api/ratings
exports.createRating = async (req, res, next) => {
  try {
    const { bookCode, rating, note, ratedBy } = req.body;

    const newRating = await Rating.create({
      bookCode,
      rating,
      note,
      ratedBy,
    });

    return res.status(201).json({ rating: newRating });
  } catch (err) {
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
    const rating = await Rating.findById(req.params.id);

    if (!rating) {
      return res.status(404).json({ message: 'Rating not found' });
    }

    return res.status(200).json({ rating });
  } catch (err) {
    next(err);
  }
};

// GET /api/ratings/summary?bookCode=BK101
exports.getRatingSummary = async (req, res, next) => {
  try {
    const { bookCode } = req.query;

    if (!bookCode) {
      return res.status(400).json({ message: 'bookCode is required' });
    }

    const stats = await Rating.aggregate([
      { $match: { bookCode } },
      {
        $group: {
          _id: '$bookCode',
          averageRating: { $avg: '$rating' },
          ratingCount: { $sum: 1 },
        },
      },
    ]);

    if (!stats || stats.length === 0) {
      return res.status(200).json({
        bookCode,
        averageRating: 0,
        ratingCount: 0,
      });
    }

    return res.status(200).json({
      bookCode,
      averageRating: stats[0].averageRating,
      ratingCount: stats[0].ratingCount,
    });
  } catch (err) {
    next(err);
  }
};