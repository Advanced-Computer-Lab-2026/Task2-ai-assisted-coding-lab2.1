import mongoose from 'mongoose';

// TODO: define the Rating schema per README.md section 1.

const ratingSchema = new mongoose.Schema(
  {
    // TODO
    bookcode: {
      type: String,
      required: true
  },
  rating: {
      type: Number,
      required: true
  },
  notes: {
      type: String
  },
  ratedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
  },
  },
  { timestamps: true }
);
ratingSchema.index({ bookcode: 1, ratedBy: 1 }, { unique: true });

// TODO: add the compound uniqueness constraint described in README.md section 1.

export const Rating = mongoose.model('Rating', ratingSchema);
