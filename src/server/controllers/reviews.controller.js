import { body, validationResult } from "express-validator"

import review from "../models/review.model.js";
import multer from "multer";

import fs from "fs";
import path from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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

const getReviewsByUserId = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 4;
        const skip = (page - 1) * limit;
        const sortOrder = req.query.sort === "asc" ? 1 : -1;
        const userId = req.user.userId;

        
        const reviews = await review.find({ pridal_user_id: userId })
            .sort({ createdAt: sortOrder })
            .skip(skip)
            .limit(limit);

        const totalReviews = await review.countDocuments({ pridal_user_id: userId });
        const totalPages = Math.ceil(totalReviews / limit);

        res.json({
            reviews,
            totalPages,
            currentPage: page
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Chyba pri načítavaní recenzií používateľa." });
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

const editReview = [
    upload.array("images", 5),
    body("comment").not().isEmpty().withMessage("Komentár nemôže byť prázdny!"),
    body("star_rating").isInt({ min: 0, max: 5 }).not().isEmpty().withMessage("Hodnotenie musí byť 1-5 hviezdičiek!"),
    async(req, res) => {
      const errors = validationResult(req);
      if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
  
      try {
        const reviewId = req.params.id;
        const { comment, star_rating } = req.body;
        
        // Handle the imagesToDelete array properly
        // It might come as a single string or an array of strings
        let imagesToDelete = req.body.imagesToDelete || [];
        if (!Array.isArray(imagesToDelete)) {
          imagesToDelete = [imagesToDelete];
        }
        
        console.log("Images to delete:", imagesToDelete);
  
        // Check if review exists
        const existingReview = await review.findById(reviewId);
        if (!existingReview) {
          return res.status(404).json({ error: "Recenzia sa nenašla!" });
        }
  
        // Check if user is the owner of the review
        if (existingReview.pridal_user_id.toString() !== req.user.userId) {
          return res.status(403).json({ error: "Nemáte oprávnenie upravovať túto recenziu!" });
        }
  
        // Filter out images that should be deleted
        let updatedImages = existingReview.images.filter(
          imgPath => !imagesToDelete.includes(imgPath)
        );
        
        console.log("Updated images after filtering:", updatedImages);
  
        // Delete physical files for images marked for deletion
        for (const imgPath of imagesToDelete) {
          try {
            // Make sure the path is relative to the server root
            const fullPath = path.join(process.cwd(), imgPath);
            console.log("Attempting to delete file:", fullPath);
            
            if (fs.existsSync(fullPath)) {
              fs.unlinkSync(fullPath);
              console.log("Successfully deleted file:", fullPath);
            } else {
              console.log("File not found:", fullPath);
            }
          } catch (err) {
            console.error("Error deleting file:", err);
            // Continue with the rest of the process even if one file deletion fails
          }
        }
  
        // Add new uploaded images
        if (req.files && req.files.length > 0) {
          const newImagePaths = req.files.map(file => file.path);
          updatedImages = [...updatedImages, ...newImagePaths];
        }
        
        console.log("Final updated images:", updatedImages);
  
        // Check if total images don't exceed the limit
        if (updatedImages.length > 5) {
          // Clean up newly uploaded files if exceeding limit
          if (req.files && req.files.length > 0) {
            req.files.forEach(file => {
              fs.unlinkSync(file.path);
            });
          }
          return res.status(400).json({ error: "Maximálny počet obrázkov je 5!" });
        }
  
        // Update the review
        const updatedReview = await review.findByIdAndUpdate(
          reviewId,
          {
            comment,
            star_rating,
            images: updatedImages
          },
          { new: true }
        );
  
        res.json(updatedReview);
      } catch (error) {
        console.error("Error updating review:", error);
        res.status(500).json({ error: "Niečo sa pokazilo pri upravovaní recenzie!" });
      }
    }
];

const deleteReview = async (req, res) => {
    try {
      const reviewId = req.params.id;
      
      const existingReview = await review.findById(reviewId);
      if (!existingReview) {
        return res.status(404).json({ error: "Recenzia sa nenašla!" });
      }
  
      if (existingReview.pridal_user_id.toString() !== req.user.userId) {
        return res.status(403).json({ error: "Nemáte oprávnenie vymazať túto recenziu!" });
      }
  
      if (existingReview.images && existingReview.images.length > 0) {
        existingReview.images.forEach(imagePath => {
          const fullPath = path.join(__dirname, '..', imagePath);
          if (fs.existsSync(fullPath)) {
            fs.unlinkSync(fullPath);
          }
        });
      }
  
      await review.findByIdAndDelete(reviewId);
      
      res.json({ message: "Recenzia bola úspešne vymazaná!" });
    } catch (error) {
      console.error("Error deleting review:", error);
      res.status(500).json({ error: "Niečo sa pokazilo pri mazaní recenzie!" });
    }
};

export default {
    getReviews,
    getReviewsByUserId,
    createReview,
    editReview,
    deleteReview
};