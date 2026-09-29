import { Rating } from '../models/Rating.js';
import joi from 'joi';

import Joi from 'joi';

const createSchema = Joi.object({
  bookCode: Joi.string().trim().required(),
  rating: Joi.number().integer().min(1).max(5).required(),
  note: Joi.string().allow(''),
  ratedBy: Joi.string().hex().length(24)
});

const updateSchema = Joi.object({
  bookCode: Joi.string().trim(),
  rating: Joi.number().integer().min(1).max(5),
  note: Joi.string().allow(''),
  ratedBy: Joi.string().hex().length(24)
}).min(1);

// GET /api/ratings
// TODO: implement per README.md section 2.
export async function getAllRatings(req, res, next) {
  try {
      const ratings = await Rating.find().sort({ createdAt: -1 }).lean();
      res.json({ ratings: ratings.map(publicRating) });
  } catch (err) { next(err); }
}

// GET /api/ratings/:id
// TODO: implement per README.md section 2.
export async function getRating(req, res, next) {
  try {
    const rating = await Rating.findById(req.params.id);
    if (!rating) return res.status(404).json({ message: 'Rating not found' });
    res.json({ rating: publicRating(rating) });
  } catch (err) { next(err); }
}

// POST /api/ratings
// TODO: implement per README.md section 2.
// POST /api/ratings
export async function createRating(req, res, next) {
  try {
    const { value, error } = createSchema.validate(req.body, { abortEarly: false, stripUnknown: true });
    if (error) return res.status(400).json({ message: error.details[0].message });

    const rating = await Rating.create(value);
    return res.status(201).json({ rating });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: 'You have already rated this book' });
    }
    next(err);
  }
}

// GET /api/ratings/summary?bookCode=BK101
// TODO: implement per README.md section 3.
// GET /api/ratings/summary?bookCode=BK101
export async function getRatingSummary(req, res, next) {
  try {
    const { bookCode } = req.query;
    if (!bookCode) return res.status(400).json({ message: 'bookCode is required' });

    const [result] = await Rating.aggregate([
      { $match: { bookCode } },
      { $group: { _id: '$bookCode', averageRating: { $avg: '$rating' }, ratingCount: { $sum: 1 } } }
    ]);

    return res.status(200).json({
      bookCode,
      averageRating: result ? result.averageRating : 0,
      ratingCount: result ? result.ratingCount : 0
    });
  } catch (err) { next(err); }
}