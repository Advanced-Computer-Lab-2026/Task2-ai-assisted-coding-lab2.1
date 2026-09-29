import mongoose from "mongoose";

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
      required: false,
    },

    ratedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
  },
  {
    timestamps: true,
  },
);

// A user can only rate a specific book once.
ratingSchema.index({ bookCode: 1, ratedBy: 1 }, { unique: true });

export const Rating = mongoose.model("Rating", ratingSchema);
