import mongoose from 'mongoose';
import Joi from 'joi';
import { Rating } from '../models/Rating.js';
// GET /api/ratings
// TODO: implement per README.md section 2.

const createSchema = Joi.object({
  bookCode: Joi.string().required(),
  rating: Joi.number().min(1).max(5).required(),
  note: Joi.string(),
  ratedBy: Joi.string().hex().length(24)
});

const updateSchema = Joi.object({
  bookCode: Joi.string(),
  rating: Joi.number().min(1).max(5),
  note: Joi.string(),
  ratedBy: Joi.string().hex().length(24)
});

function publicRating(r) {
  return { id: r._id.toString(), bookCode: r.bookCode, rating: r.rating, note: r.note, ratedBy: r.ratedBy};
}

export async function getAllRatings(req, res, next) {
  try {
    // TODO
    const ratings = await Rating.find();
    res.json({ ratings: ratings.map(publicRating) });
  } catch (err) { next(err); }
}

// GET /api/ratings/:id
// TODO: implement per README.md section 2.
export async function getRating(req, res, next) {
  try {
    // TODO
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(404).json({ message: 'Rating not found' });
    const rating = await Rating.findById(id);
    if (!rating) 
      return res.status(404).json({ message: 'Rating not found' });
    res.json({ rating: publicRating(rating) });
  } catch (err) { next(err); }
}

// POST /api/ratings
// TODO: implement per README.md section 2.
export async function createRating(req, res, next) {
  try {
    // TODO
    const { value, error } = createSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.message });

    const rating = await Rating.create(value);
    res.status(201).json({ rating: publicRating(rating) });
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
    const results = await Rating.aggregate([
      { $match: { bookCode } },
      {
        $group: {
          _id: '$bookCode',
          averageRating: { $avg: '$rating' },
          ratingCount: { $sum: 1 }
        }
      }
    ]);
    if (results.length === 0) {
      return res.json({ bookCode, averageRating: 0, ratingCount: 0 });
    }

    const { averageRating, ratingCount } = results[0];
    res.json({ bookCode, averageRating, ratingCount });
  } catch (err) { next(err); }
}
