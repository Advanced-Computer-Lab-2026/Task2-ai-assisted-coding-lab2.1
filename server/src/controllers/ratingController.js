import { Rating } from '../models/Rating.js';

// GET /api/ratings
// TODO: implement per README.md section 2.


function publicRating(r) {
  return { id: r._id.toString(), bookCode: r.bookCode, rating: r.rating, note: r.note, ratedBy: r.ratedBy };
}

export async function getAllRatings(req, res, next) {
  try {
   const ratings = await Rating.find().lean();
    res.json({ ratings: ratings.map(publicRating) });
  } catch (err) { next(err); }
}

// GET /api/ratings/:id
// TODO: implement per README.md section 2.
export async function getRating(req, res, next) {
  try {
    const rating = await Rating.findById(req.params.id).lean();
    if (!rating) {
      return res.status(404).json({ error: 'Rating not found' });
    }
    res.json(publicRating(rating));
  } catch (err) { next(err); }
}

// POST /api/ratings
// TODO: implement per README.md section 2.
export async function createRating(req, res, next) {
  try {
     const { value, error } = createSchema.validate(req.body);
        if (error) return res.status(400).json({ message: error.message });
    
        const existing = await Rating.findOne({ bookCode: value.bookCode, rating: value.rating, ratedBy: value.ratedBy });
        if (existing) return res.status(409).json({ message: 'Rating already exists' });
    
        const rating = await Rating.create({ bookCode: value.bookCode, rating: value.rating, note: value.note, ratedBy: value.ratedBy });
        res.status(201).json({ rating: publicRating(rating) });
     } catch (err) { next(err); }
}

// GET /api/ratings/summary?bookCode=BK101
// TODO: implement per README.md section 3.
export async function getRatingSummary(req, res, next) {
  try {
   const { bookCode } = req.query;

    // 1. Validate query parameter
    if (!bookCode) {
      return res.status(400).json({ message: 'bookCode is required' });
    }

    // 2. Perform aggregation
    const result = await Rating.aggregate([
      { 
        $match: { bookCode: bookCode } 
      },
      { 
        $group: {
          _id: '$bookCode',
          averageRating: { $avg: '$rating' },
          ratingCount: { $sum: 1 }
        }
      }
    ]);

    // 3. Handle matching vs. empty results
    if (result.length > 0) {
      return res.status(200).json({
        bookCode: result[0]._id,
        averageRating: Math.round(result[0].averageRating * 10) / 10, // Optional rounding to 1 decimal place
        ratingCount: result[0].ratingCount
      });
    } else {
      return res.status(200).json({
        bookCode,
        averageRating: 0,
        ratingCount: 0
      });
    }
  } catch (err) { next(err); }
}
