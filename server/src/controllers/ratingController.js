import { Rating } from '../models/Rating.js';

// GET /api/ratings
// TODO: implement per README.md section 2.
export async function getAllRatings(req, res, next) {
  try {
    // TODO
    const ratings = await Rating.find();
    res.json(ratings);  
  } catch (err) { next(err); }
}

// GET /api/ratings/:id
// TODO: implement per README.md section 2.
export async function getRating(req, res, next) {
  try {
    // TODO
    const rating = await Rating.findById(req.params.id);  
    res.json(rating); 
  } catch (err) { next(err); }
}

// POST /api/ratings
// TODO: implement per README.md section 2.
export async function createRating(req, res, next) {
  try {
    // TODO
    const rating = new Rating(req.body);
    await rating.save();
    res.status(201).json(rating);
  } catch (err) { next(err); }
}

// GET /api/ratings/summary?bookCode=BK101
// TODO: implement per README.md section 3.
export async function getRatingSummary(req, res, next) {
  try {
    // TODO
    const bookCode = req.query.bookCode;
    const summary = await Rating.aggregate([
      { $match: { bookCode } },
      { $group: { _id: '$bookCode', averageRating: { $avg: '$rating' }, totalRatings: { $sum: 1 } } }
    ]);
    res.json(summary);
  } catch (err) { next(err); }
}
