import mongoose from 'mongoose';

import express from 'express';
import {
  createRating,
  getAllRatings,
  getRating,
  getRatingSummary,
} from '../controllers/ratingController.js';

const router = express.Router();

router.post('/', createRating);
router.get('/', getAllRatings);
router.get('/summary', getRatingSummary); // Must be before /:id
router.get('/:id', getRating);

export default router;

const ratingSchema = new mongoose.Schema(
  {
    bookCode: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    note: {
      type: String,
    },
    ratedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

// Compound unique index on bookCode and ratedBy
ratingSchema.index({ bookCode: 1, ratedBy: 1 }, { unique: true });

export const Rating = mongoose.model('Rating', ratingSchema);