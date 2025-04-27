import mongoose, { Schema } from "mongoose";

const menuItemSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    category: { 
      type: String, 
      enum: ["pizza", "starter", "salad", "dessert", "drink", "soup"],
      required: true,
    },
    ingredients: [{ type: String }],
  },
);

export default mongoose.model("MenuItem", menuItemSchema);
