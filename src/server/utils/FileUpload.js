import multer from "multer";
import { v4 as uuidv4 } from 'uuid';
import fs from "fs";
import path from "path";
import { dirname } from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        let folderPath = path.resolve(__dirname, "..", "public", "assets", "images");
    
        if (req.baseUrl.includes("/reviews")) {
            folderPath = path.resolve(__dirname, "..", "public", "assets", "reviewImages");
        } else if (req.baseUrl.includes("/gallery")) {
            folderPath = path.resolve(__dirname, "..", "public", "assets", "galleryImages");
        }
    
        fs.mkdirSync(folderPath, { recursive: true });
        cb(null, folderPath);
    },
    filename: function (req, file, cb) {
        cb(null, uuidv4() + "-" + Date.now() + path.extname(file.originalname));
    },
});

const fileFilter = (req, file, cb) => {
    const allowedFileTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/avif",
    ];
    if (allowedFileTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

export {
    fileFilter,
    storage
};
