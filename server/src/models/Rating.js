const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema(
  {
    bookCode: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    note: { type: String },
    ratedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

ratingSchema.index(
  { bookCode: 1, ratedBy: 1 },
  {
    unique: true,
    partialFilterExpression: { ratedBy: { $exists: true } },
  }
);

module.exports = mongoose.model('Rating', ratingSchema);