import mongoose from 'mongoose';

// Rating schema per README.md section 1.

const ratingSchema = new mongoose.Schema(
  {
    bookCode: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    note: { type: String },
    ratedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  },
  { timestamps: true }
);

// Compound uniqueness constraint per README.md section 1.
// The partial filter lets anonymous ratings (no ratedBy) coexist,
// because a missing ratedBy would otherwise count as null and collide.
ratingSchema.index(
  { bookCode: 1, ratedBy: 1 },
  { unique: true, partialFilterExpression: { ratedBy: { $exists: true } } }
);

export const Rating = mongoose.model('Rating', ratingSchema);
