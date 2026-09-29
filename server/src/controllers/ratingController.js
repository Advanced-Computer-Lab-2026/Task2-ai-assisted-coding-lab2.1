import { Rating } from '../models/Rating.js';

// GET /api/ratings
// TODO: implement per README.md section 2.


export const getAllRatings = async (req, res, next) => {
  try {
    const ratings = await Rating.find();

    return res.status(200).json({ ratings });
  } catch (err) {
    next(err);
  }
};

// GET /api/ratings/:id
// TODO: implement per README.md section 2.
export async function getRating(req, res, next) {
  try {
    // TODO
  } catch (err) { next(err); }
}

export const createRating = async (req, res, next) => {
  try {
    const rating = await Rating.create(req.body);

    return res.status(201).json({ rating });
  } catch (err) {
    next(err);
  }
};



// GET /api/ratings/summary?bookCode=BK101
// TODO: implement per README.md section 3.
export async function getRatingSummary(req, res, next) {
  try {

    if (!bookCode) {
  return res.status(400).json({
    message: "bookCode is required",
  });
}
    // TODO
  } catch (err) { next(err); }
}
