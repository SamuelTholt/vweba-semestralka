import express from "express";
import { adminMiddleware } from "../middleware/admin.middleware.js";
import galleryController from "../controllers/gallery.controller.js";

const router = express.Router();

router.post("/create" , adminMiddleware, galleryController.createPhoto);
router.get("/", galleryController.getPhotos);
router.put("/edit/:id", adminMiddleware, galleryController.editPhoto);
router.delete("/delete/:id", adminMiddleware, galleryController.deletePhoto);

export default router;