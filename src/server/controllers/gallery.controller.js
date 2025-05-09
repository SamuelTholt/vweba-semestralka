import { fileFilter, storage } from "../utils/FileUpload.js"
import { body, validationResult } from "express-validator";
import galleryModel from "../models/gallery.model.js"

import multer from "multer";
import fs from "fs";
import path from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let upload = multer({ storage, fileFilter, limits: { fileSize:"10MB" } });

const getPhotos = async(req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 8;
        const skip = (page - 1) * limit;
        const photos = await galleryModel.find()
            .sort({ numberOrder: 1 })
            .skip(skip)
            .limit(limit);
            
        const totalPhotos = await galleryModel.countDocuments();
        
        res.json({
            photos,
            totalPages: Math.ceil(totalPhotos / limit),
            currentPage: page,
            totalPhotos
        });
    } catch (error) {
        console.error("Chyba pri načítaní fotiek:", error);
        res.status(500).json({ error: "Niečo sa pokazilo pri načítavaní fotiek!" });
    }
}

const createPhoto = [
    upload.single("image"),
    body("title").optional(),
    async(req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { title } = req.body;
    
        let imageLocation = "";
        if (req.file) {
            imageLocation = req.file.path.substr(req.file.path.indexOf("/") + 1);
        }

        try {
            const lastItem = await galleryModel.findOne({})
            .sort({ numberOrder: -1 })
            .limit(1);

            const nextNumberOrder = lastItem ? lastItem.numberOrder + 1 : 1;

            const newPhoto = new galleryModel({
                imageLocation,
                numberOrder: nextNumberOrder,
                title
            });

            await newPhoto.save();
            res.status(201).json(newPhoto);
        } catch (error) {
            res.status(500).json({ error: "Niečo sa pokazilo a nepridal sa obrázok!" });
        }
    }
];

const editPhoto = [
    upload.single("image"),
    body("title").optional(),
    body("numberOrder").optional().isInt({ min: 1 }).withMessage("Poradové číslo musí byť kladné celé číslo!"),
    async(req, res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        
        const { id } = req.params;
        
        try {
            const photo = await galleryModel.findById(id);
            
            if (!photo) {
                console.log("Fotka sa nenašla");
                return res.status(404).json({ error: "Fotka sa nenašla" });
            }
            
            let updatedData = req.body;
            if (req.file) {
                if (photo.imageLocation) {
                    fs.unlinkSync(photo.imageLocation);
                }
                updatedData.imageLocation = req.file.path.substr(req.file.path.indexOf("/") + 1);
            }
            
            if (updatedData.numberOrder && photo.numberOrder !== parseInt(updatedData.numberOrder)) {
                const oldOrder = photo.numberOrder;
                const newOrder = parseInt(updatedData.numberOrder);
                
                if (oldOrder < newOrder) {
                    await galleryModel.updateMany(
                        { 
                            numberOrder: { $gt: oldOrder, $lte: newOrder },
                            _id: { $ne: id }
                        },
                        { $inc: { numberOrder: -1 } }
                    );
                } else if (oldOrder > newOrder) {
                    await galleryModel.updateMany(
                        { 
                            numberOrder: { $gte: newOrder, $lt: oldOrder },
                            _id: { $ne: id }
                        },
                        { $inc: { numberOrder: 1 } }
                    );
                }
            }
            
            const updatedPhoto = await galleryModel.findByIdAndUpdate(
                id,
                updatedData,
                { new: true }
            );
            
            console.log("Úspešne upravená fotka:", updatedPhoto);
            res.json(updatedPhoto);
        } catch (error) {
            console.error("Chyba pri úprave fotky:", error);
            res.status(500).json({ error: "Niečo sa pokazilo" });
        }
    }
];

const deletePhoto = async (req, res) => {
    try {
        const { id } = req.params;

        const photo = await galleryModel.findById({ _id:id });
        if (!photo) {
            return res.status(404).json({ error: "Fotka nenájdená!" });
        }


        const fullPath = path.join(process.cwd(), photo.imageLocation);
        console.log("Pokus o vymazanie súboru:", fullPath);
                
        if (fs.existsSync(fullPath)) {
            fs.unlinkSync(fullPath);
            console.log("Súbor bol úspešne vymazaný:", fullPath);
        } else {
            console.log("Súbor nebol nájdený:", fullPath);
        }
        
        await galleryModel.findByIdAndDelete(id);
    
        res.json({ message: "Fotka odstránená!" });
    } catch (error) {
      console.error("Chyba pri mazaní fotlky:", error);
      res.status(500).json({ error: "Niečo sa pokazilo" });
    }
};

export default {
    createPhoto,
    editPhoto,
    deletePhoto,
    getPhotos
};