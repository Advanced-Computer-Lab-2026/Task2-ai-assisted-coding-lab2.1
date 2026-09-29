import mongoose from 'mongoose';

// TODO: define the Rating schema per README.md section 1.


const ratingSchema = new mongoose.Schema(
  {
    bookCode: { type: String, required: true },
    rating: { type: Number, required: true ,min:1,max:5},
note: { type: Date, required: false },
    ratedBy: { type: mongoose.Schema.Types.ObjectId,
  ref: "User",
  required: false, }
    // TODO
  },
  { timestamps: true }
);

ratingSchema.index(
  { bookCode: 1, ratedBy: 1 },
  { unique: true }
);
// TODO: add the compound uniqueness constraint described in README.md section 1.

export const Rating = mongoose.model('Rating', ratingSchema);
