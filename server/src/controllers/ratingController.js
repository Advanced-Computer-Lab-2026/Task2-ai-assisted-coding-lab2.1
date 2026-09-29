import Joi from "joi";
import { Rating } from "../models/Rating.js";

const createSchema = Joi.object({
  bookCode: Joi.string().min(5).max(5).required(),
  rating: Joi.number().min(1).max(5).required(),
  note: Joi.string().min(2).max(100).optional(), // I guess
  ratedBy: Joi.string(), // IDK
});

const updateSchema = Joi.object({
  rating: Joi.number().min(1).max(5),
  note: Joi.string().min(2).max(100), // I guess
  ratedBy: Joi.string(), // IDK
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
    res.status(200).json({ ratings: ratings.map(publicRating) });
  } catch (err) {
    next(err);
  }
}

// GET /api/ratings/:id
// TODO: implement per README.md section 2.
export async function getRating(req, res, next) {
  try {
    const rating = await Rating.findById(req.params.id);
    if (!rating) return res.status(404).json({ message: "Rating not found" });
    res.status(200).json({ rating: publicRating(rating) });
  } catch (err) {
    next(err);
  }
}

// POST /api/ratings
// TODO: implement per README.md section 2.
export async function createRating(req, res, next) {
  try {
    const { value, error } = createSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.message });

    const existing = await Rating.findOne({
      bookCode: value.bookCode,
      ratedBy: value.ratedBy,
    });
    if (existing)
      return res.status(409).json({ message: "Rating already exists" });

    const Rating = await Rating.create({
      bookCode: value.bookCode,
      rating: value.rating,
      note: value.note,
      ratedBy: value.ratedBy,
    });
    res.status(201).json({ rating: publicRating(rating) });
  } catch (err) {
    next(err);
  }
}

// GET /api/ratings/summary?bookCode=BK101
// TODO: implement per README.md section 3.
export async function getRatingSummary(req, res, next) {
  try {
    try {
      const rating = await Rating.find(bookCode == req);
      if (!rating) return res.status(404).json({ message: "Rating not found" });
      res.status(200).json({ rating: publicRating(rating) });
    } catch (err) {
      next(err);
    }
  } catch (err) {
    next(err);
  }
}
