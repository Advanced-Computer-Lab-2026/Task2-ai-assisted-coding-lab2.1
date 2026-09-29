
const express = require('express');
const router = express.Router();

const {
  createRating,
  getAllRatings,
  getRating,
  getRatingSummary
} = require('../controllers/ratingController');

// Keep summary before /:id.
router.get('/summary', getRatingSummary);

router.post('/', createRating);
router.get('/', getAllRatings);
router.get('/:id', getRating);

module.exports = router;
