import { Rating } from '../models/Rating.js';

// GET /api/ratings
// TODO: implement per README.md section 2.
export async function getAllRatings(req, res, next) {
  try {
    // TODO
    const ratings = (await Rating.find()).sort({ createdAt: -1 }).lean();
    res.json({ ratings: ratings});
  } catch (err) { next(err); }
}

// GET /api/ratings/:id
// TODO: implement per README.md section 2.
export async function getRating(req, res, next) {
  try {
    // TODO
    const rating = await Rating.findById(req.params.id);
    if(!rating) return res.status(404).json({ message: 'Rating not found' });
    res.json({ rating: rating });
  } catch (err) { next(err); }
}

// POST /api/ratings
// TODO: implement per README.md section 2.
export async function createRating(req, res, next) {
  try {
    // TODO
    const rating = await Rating.create(req.body);
    res.status(201).json({ rating: rating });
  } catch (err) { next(err); }
}

// GET /api/ratings/summary?bookCode=BK101
// TODO: implement per README.md section 3.
export async function getRatingSummary(req, res, next) {
  try {
    // TODO
  } catch (err) { next(err); }
}
