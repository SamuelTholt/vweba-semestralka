import { body, validationResult } from "express-validator"

import review from "../models/review.model.js";
import multer from "multer";

import { fileFilter, storage } from "../utils/FileUpload.js"

let upload = multer({ storage, fileFilter, limits: { fileSize:"10MB" } });

const getReviews = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 4;
        const skip = (page - 1) * limit;
        const sort = req.query.sort === "asc" ? 1 : -1;
        const userId = req.query.userId;

        const query = userId ? { pridal_user_id: userId } : {};

        const reviews = await review.find(query)
            .sort({ createdAt: sort })
            .skip(skip)
            .limit(limit);

        const totalReviews = await review.countDocuments(query);

        res.json({
            reviews,
            totalPages: Math.ceil(totalReviews / limit),
            currentPage: page,
        });
    } catch (error) {
        res.status(500).json({ error: "Niečo sa pokazilo pri načítavaní recenzií!" });
    }
};


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

        let imagePaths = [];

        if (req.files && req.files.length > 0) {
            imagePaths = req.files.map((file) => {
                return file.path.substr(file.path.indexOf("/") + 1);
            });
        }

        try {
            const newReview = new review({
                comment,
                star_rating,
                pridal_user: req.user.userName,
                pridal_user_id: req.user.userId,
                images: imagePaths.length > 0 ? imagePaths : []
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