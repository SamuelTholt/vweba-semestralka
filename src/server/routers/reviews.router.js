import express from "express";
import reviewsController from "../controllers/reviews.controller.js";

const router = express.Router();

router.get("/", reviewsController.getReviews);
router.get("/myReviews", reviewsController.getReviewsByUserId);
router.get("/stats", reviewsController.getReviewStats);
router.post("/create", reviewsController.createReview);
router.put("/edit/:id", reviewsController.editReview);
router.delete("/delete/:id", reviewsController.deleteReview);

export default router;