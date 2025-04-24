import multer from "multer";
import { v4 as uuidv4 } from 'uuid';
import fs from "fs";
import path from "path";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        let folderPath = "../../../public/assets/images";

        if (req.baseUrl.includes("/reviews")) {
        folderPath = "../../../public/assets/reviewImages";
        } else if (req.baseUrl.includes("/gallery")) {
        folderPath = "./public/assets/galleryImages";
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
