import { Router } from 'express';
import {
  getAllRatings,
  getRating,
  createRating,
  getRatingSummary
} from '../controllers/ratingController.js';

const router = Router();

// TODO: 
// wire up the three routes in README.md section 2 and the summary route in section 3.

export async function createRating(req, res, next) {
  try {
    const { bookCode, rating, note, ratedBy } = req.body;
    const created = await Rating.create({ bookCode, rating, note, ratedBy });
    res.status(201).json({ rating: created });
  } catch (err) {
    next(err);
  }
}

export async function getAllRatings(req, res, next) {
  try {
    const ratings = await Rating.find();
    res.status(200).json({ ratings });
  } catch (err) {
    next(err);
  }
}

export async function getRating(req, res, next) {
  try {
    const rating = await Rating.findById(req.params.id);
    if (!rating) {
      return res.status(404).json({ message: 'Rating not found' });
    }
    res.status(200).json({ rating });
  } catch (err) {
    next(err);
  }
}
export default router;
