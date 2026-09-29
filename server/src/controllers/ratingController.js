import { Rating } from '../models/Rating.js';

// GET /api/ratings
// TODO: implement per README.md section 2.
export async function getAllRatings(req, res, next) {
  try {
    // TODO
    const ratings = await Rating.find().sort({ createdAt: -1 }).lean();
    res.json({ ratings });
  } catch (err) { next(err); }
}

// GET /api/ratings/:id
// TODO: implement per README.md section 2.
export async function getRating(req, res, next) {
  try {
    // TODO
    const rating = await Rating.findById(req.params.id).lean();
    if (!rating) return res.status(404).json({ message: 'Rating not found' });
    res.json({ rating });
  } catch (err) { next(err); }
}

// POST /api/ratings
// TODO: implement per README.md section 2.
export async function createRating(req, res, next) {
  try {
    // TODO
    const { bookcode, rating, notes, ratedBy } = req.body;
    const newRating = await Rating.create({ bookcode, rating, notes, ratedBy });
    res.status(201).json({ rating: newRating });
  } catch (err) { next(err); }
}

// GET /api/ratings/summary?bookCode=BK101
// TODO: implement per README.md section 3.
export async function getRatingSummary(req, res, next) {
  try {
    // TODO
    const { bookCode } = req.query;
    if (error) return res.status(400).json({ message: 'bookCode is required' });
    const summary = await Rating.aggregate([
      { $match: { bookcode: bookCode } },
      {
        $group: {
          _id: '$bookcode',
          averageRating: { $avg: '$rating' },
          totalRatings: { $sum: 1 }
        }
      }
    ]);
    if (summary.length === 0) return res.json({ summary: { averageRating: 0, totalRatings: 0 } });
    res.json({ summary: summary[0] });
  } catch (err) { next(err); }
}
