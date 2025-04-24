import mongoose, { Schema } from "mongoose";


const reviewSchema = new Schema(
    {
        comment: { type: String, required: true },
        star_rating: { type: Number, required: true },

        pridal_user: { type: String, required: true },
        pridal_user_id: { 
            type: mongoose.SchemaTypes.ObjectId, 
            ref: "User",
            required: true,
        },

        images: [
            {
              type: String,
            },
          ],
    },
    { timestamps: true }
)

export default mongoose.model("Review", reviewSchema);