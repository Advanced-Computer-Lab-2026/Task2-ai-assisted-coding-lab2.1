
const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema(
  {
    bookCode: {
      type: String,
      required: true,
      trim: true
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    note: {
      type: String,
      trim: true
    },
    ratedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  {
    timestamps: true
  }
);

// A user can rate a particular book only once.
ratingSchema.index(
  { bookCode: 1, ratedBy: 1 },
  { unique: true, sparse: true }
);

module.exports = mongoose.model('Rating', ratingSchema);