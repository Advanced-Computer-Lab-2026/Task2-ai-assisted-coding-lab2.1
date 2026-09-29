import mongoose from 'mongoose';

const ratingSchema = new mongoose.Schema(
  {
    bookCode: { type: String, required: true, trim: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    note: { type: String },
    ratedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

// One rating per (book, user). Partial so anonymous ratings (no ratedBy)
// don't all collide on the same null value.
ratingSchema.index(
  { bookCode: 1, ratedBy: 1 },
  { unique: true, partialFilterExpression: { ratedBy: { $type: 'objectId' } } }
);

export const Rating = mongoose.model('Rating', ratingSchema);