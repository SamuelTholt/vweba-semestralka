import { body, validationResult } from "express-validator"

import review from "../models/review.model.js";
import multer from "multer";

import { fileFilter, storage } from "../utils/FileUpload.js"

let upload = multer({ storage, fileFilter, limits: { fileSize:"10MB" } });

const getReviews = async(req, res) => {
    const allReviews = await review.find();
    res.json(allReviews);
}

const createReview = [
    upload.array("images", 5),
    body("comment").not().isEmpty().withMessage("Komentár nemôže byť prázdny!"),
    body("star_rating").isInt({ min: 0, max: 5 }).not().isEmpty().withMessage("Hodnotenie musí byť 1-5 hviezdičiek!"),
    async(req, res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            console.log("Validation errors:", errors.array());
            return res.status(400).json({ errors: errors.array() });
        }

        const { comment, star_rating } = req.body;

        const imagePaths = req.files?.map((file) =>
            file.path.replace(/^.*?public[\\/]/, "")
          ) || [];

        try {
            const newReview = new review({
                comment,
                star_rating,
                pridal_user: req.user.userName,
                pridal_user_id: req.user.userId,
                images: imagePaths
            });

            await newReview.save();
            res.status(201).json(newReview);
        } catch (error) {
            res.status(500).json({ error: "Niečo sa pokazilo a nepridala sa recenzia!" });
        }
    }
];

export default {
    getReviews,
    createReview
};