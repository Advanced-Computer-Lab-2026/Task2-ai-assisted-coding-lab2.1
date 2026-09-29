import Joi from "joi";
import { Rating } from "../models/Rating.js";

const createSchema = Joi.object({
  bookCode: Joi.string().required(),
  rating: Joi.number().min(1).max(5).required(),
  note: Joi.string().optional(),
  ratedBy: Joi.string().optional(),
});

function publicRating(r) {
  return {
    id: r._id.toString(),
    bookCode: r.bookCode,
    rating: r.rating,
    note: r.note,
    ratedBy: r.ratedBy,
    createdAt: r.createdAt,
  };
}

// GET /api/ratings
export async function getAllRatings(req, res, next) {
  try {
    const ratings = await Rating.find().sort({ createdAt: -1 }).lean();

    res.status(200).json({
      ratings: ratings.map(publicRating),
    });
  } catch (err) {
    next(err);
  }
}

// GET /api/ratings/:id
export async function getRating(req, res, next) {
  try {
    const rating = await Rating.findById(req.params.id);

    if (!rating) {
      return res.status(404).json({
        message: "Rating not found",
      });
    }

    res.status(200).json({
      rating: publicRating(rating),
    });
  } catch (err) {
    next(err);
  }
}

// POST /api/ratings
export async function createRating(req, res, next) {
  try {
    const { value, error } = createSchema.validate(req.body);

    if (error) {
      return res.status(400).json({
        message: error.message,
      });
    }

    const existing = await Rating.findOne({
      bookCode: value.bookCode,
      ratedBy: value.ratedBy,
    });

    if (existing) {
      return res.status(409).json({
        message: "Rating already exists",
      });
    }

    const rating = await Rating.create({
      bookCode: value.bookCode,
      rating: value.rating,
      note: value.note,
      ratedBy: value.ratedBy,
    });

    res.status(201).json({
      rating: publicRating(rating),
    });
  } catch (err) {
    next(err);
  }
}

// GET /api/ratings/summary?bookCode=BK101
export async function getRatingSummary(req, res, next) {
  try {
    const { bookCode } = req.query;

    if (!bookCode) {
      return res.status(400).json({
        message: "bookCode is required",
      });
    }

    const result = await Rating.aggregate([
      {
        $match: { bookCode },
      },
      {
        $group: {
          _id: "$bookCode",
          averageRating: { $avg: "$rating" },
          ratingCount: { $sum: 1 },
        },
      },
    ]);

    if (result.length === 0) {
      return res.status(200).json({
        bookCode,
        averageRating: 0,
        ratingCount: 0,
      });
    }

    res.status(200).json({
      bookCode,
      averageRating: result[0].averageRating,
      ratingCount: result[0].ratingCount,
    });
  } catch (err) {
    next(err);
  }
}
