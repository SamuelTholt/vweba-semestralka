import mongoose, { Schema } from "mongoose";

const gallerySchema = new Schema(
    {
        imageLocation: { type: String, required: true },
        numberOrder: { type: Number, required: true },
        title: { type: String }
    },
);

export default mongoose.model('GalleryPhoto', gallerySchema);