import Joi from 'joi';
import { Rating } from '../models/Rating.js';

const createSchema = Joi.object({
  bookCode: Joi.string().required(),
  rating: Joi.number().min(1).max(5).required(),
  note: Joi.string().allow('').optional(),
  ratedBy: Joi.string().hex().length(24).optional()
});

export async function createRating(req, res, next) {
  try {
    const { value, error } = createSchema.validate(req.body, { abortEarly: false, stripUnknown: true });
    if (error) return res.status(400).json({ message: error.message });

    const rating = await Rating.create(value);
    res.status(201).json({ rating });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: 'This user has already rated this book' });
    }
    next(err);
  }
}

export async function getAllRatings(req, res, next) {
  try {
    const ratings = await Rating.find().sort({ createdAt: -1 });
    res.json({ ratings });
  } catch (err) { next(err); }
}

export async function getRating(req, res, next) {
  try {
    const rating = await Rating.findById(req.params.id);
    if (!rating) return res.status(404).json({ message: 'Rating not found' });
    res.json({ rating });
  } catch (err) { next(err); }
}

export async function getRatingSummary(req, res, next) {
  try {
    const { bookCode } = req.query;
    if (!bookCode) return res.status(400).json({ message: 'bookCode is required' });

    const [result] = await Rating.aggregate([
      { $match: { bookCode } },
      { $group: { _id: '$bookCode', averageRating: { $avg: '$rating' }, ratingCount: { $sum: 1 } } }
    ]);

    if (!result) {
      return res.json({ bookCode, averageRating: 0, ratingCount: 0 });
    }

    res.json({ bookCode, averageRating: result.averageRating, ratingCount: result.ratingCount });
  } catch (err) { next(err); }
}
