import express from "express";
import reviewsController from "../controllers/reviews.controller.js";

const router = express.Router();

router.get("/", reviewsController.getReviews);
router.get("/myReviews", reviewsController.getReviewsByUserId);
router.post("/create", reviewsController.createReview);

export default router;