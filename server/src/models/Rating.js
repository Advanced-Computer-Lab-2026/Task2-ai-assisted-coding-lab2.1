import mongoose from 'mongoose';

// TODO: define the Rating schema per README.md section 1.

const ratingSchema = new mongoose.Schema(
  {
    // TODO
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    bookCode: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 }          
  },
  { timestamps: true }
);

// TODO: add the compound uniqueness constraint described in README.md section 1.
ratingSchema.index({ userId: 1, bookCode: 1 }, { unique: true });

export const Rating = mongoose.model('Rating', ratingSchema);
