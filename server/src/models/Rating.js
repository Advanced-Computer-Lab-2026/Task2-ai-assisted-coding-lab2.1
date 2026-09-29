import mongoose from 'mongoose';

const ratingSchema = new mongoose.Schema(
  {
    bookCode: {
      type: String,
      required: true,
      trim: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    note: {
      type: String,
      trim: true,
      default: '',
    },
    ratedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to ensure a user can only rate a book once
ratingSchema.index({ bookCode: 1, ratedBy: 1 }, { unique: true });

export const Rating = mongoose.model('Rating', ratingSchema);
export default Rating;