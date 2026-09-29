import express from "express";
import {
  getAllRatings,
  getRating,
  createRating,
  getRatingSummary,
} from "../controllers/ratingController.js";

const router = express.Router();

// 1. Static/Specific endpoints FIRST
router.get("/", getAllRatings);
router.post("/", createRating);
router.get("/summary", getRatingSummary); // <--- MUST BE ABOVE /:id

// 2. Dynamic parameter endpoints LAST
router.get("/:id", getRating);

export default router;
