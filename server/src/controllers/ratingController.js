import { Rating } from '../models/Rating.js';

// GET /api/ratings
export async function getAllRatings(req, res, next) {
  try {
    const ratings = await Rating.find().sort({ createdAt: -1 }).lean();
    res.json({ ratings });
  } catch (err) { next(err); }
}

// GET /api/ratings/:id
export async function getRating(req, res, next) {
  try {
    const rating = await Rating.findById(req.params.id);
    if (!rating) return res.status(404).json({ message: 'Rating not found' });
    res.json({ rating });
  } catch (err) { next(err); }
}

// POST /api/ratings
export async function createRating(req, res, next) {
  try {
    const { bookCode, rating: value, note, ratedBy } = req.body;
    const rating = await Rating.create({ bookCode, rating: value, note, ratedBy });
    res.status(201).json({ rating });
  } catch (err) { next(err); }
}

// GET /api/ratings/summary?bookCode=BK101
export async function getRatingSummary(req, res, next) {
  try {
    const { bookCode } = req.query;
    if (!bookCode) return res.status(400).json({ message: 'bookCode is required' });

    const [summary] = await Rating.aggregate([
      { $match: { bookCode } },
      { $group: { _id: '$bookCode', averageRating: { $avg: '$rating' }, ratingCount: { $sum: 1 } } }
    ]);

    res.json({
      bookCode,
      averageRating: summary ? summary.averageRating : 0,
      ratingCount: summary ? summary.ratingCount : 0
    });
  } catch (err) { next(err); }
}
