import mongoose from 'mongoose';

const ratingSchema = new mongoose.Schema(
  {
    bookCode: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    note: { type: String },
    ratedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  },
  { timestamps: true }
);

// One rating per user per book. Anonymous ratings (no ratedBy) are excluded
// from the constraint so they don't collide with each other.
ratingSchema.index(
  { bookCode: 1, ratedBy: 1 },
  { unique: true, partialFilterExpression: { ratedBy: { $exists: true } } }
);

export const Rating = mongoose.model('Rating', ratingSchema);