import { Rating } from "../models/Rating.js";

// GET /api/ratings
// TODO: implement per README.md section 2.
export async function getAllRatings(req, res, next) {
  try {
    const ratings = await Rating.find();
    res.status(200).json({ ratings });
  } catch (err) {
    next(err);
  }
}

// GET /api/ratings/:id
// TODO: implement per README.md section 2.
export async function getRating(req, res, next) {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid rating id" });
    }

    const rating = await Rating.findById(id);
    if (!rating) {
      return res.status(404).json({ message: "Rating not found" });
    }

    res.status(200).json({ rating });
  } catch (err) {
    next(err);
  }
}

// POST /api/ratings
// TODO: implement per README.md section 2.
export async function createRating(req, res, next) {
  try {
    const { bookCode, rating, note, ratedBy } = req.body;
    const created = await Rating.create({ bookCode, rating, note, ratedBy });
    res.status(201).json({ rating: created });
  } catch (err) {
    if (err.name === "ValidationError") {
      return res.status(400).json({ message: err.message });
    }
    if (err.code === 11000) {
      return res
        .status(409)
        .json({ message: "This user has already rated this book" });
    }
    next(err);
  }
}

// GET /api/ratings/summary?bookCode=BK101
// TODO: implement per README.md section 3.
export async function getRatingSummary(req, res, next) {
  try {
    const { bookCode } = req.query;

    if (!bookCode) {
      return res.status(400).json({ message: "bookCode is required" });
    }

    const [result] = await Rating.aggregate([
      { $match: { bookCode } },
      {
        $group: {
          _id: "$bookCode",
          averageRating: { $avg: "$rating" },
          ratingCount: { $sum: 1 },
        },
      },
    ]);

    res.status(200).json({
      bookCode,
      averageRating: result ? result.averageRating : 0,
      ratingCount: result ? result.ratingCount : 0,
    });
  } catch (err) {
    next(err);
  }
}
