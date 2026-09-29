import { Router } from 'express';
import {
  getAllRatings,
  getRating,
  createRating,
  getRatingSummary
} from '../controllers/ratingController.js';

const express = require('express');
const router = express.Router();
const ratingController = require('../controllers/ratingController');

// Summary route (MUST be placed before /:id)
router.get('/summary', ratingController.getRatingSummary);

// Base CRUD routes
router.post('/', ratingController.createRating);
router.get('/', ratingController.getAllRatings);
router.get('/:id', ratingController.getRating);

module.exports = router;

// TODO: wire up the three routes in README.md section 2 and the summary route in section 3.

export default router;
