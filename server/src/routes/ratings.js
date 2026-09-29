const express = require('express');
const router = express.Router();
const {
  createRating,
  getAllRatings,
  getRating,
  getRatingSummary,
} = require('../controllers/ratingController');

router.post('/', createRating);
router.get('/', getAllRatings);
router.get('/summary', getRatingSummary); // must stay above '/:id'
router.get('/:id', getRating);

module.exports = router;