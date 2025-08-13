import mongoose, { Schema } from "mongoose";

const productSchema = new Schema({
    title: {type: String, required: true, unique: true},
    orignalPrice: {type: Number, required: true},
    discountedPrice: {type: Number, required: true},
    description: {type: String, default: ""},
    images: {type: [String], required: true},
    qty: {type: Number, default: 0},
    rating: {type: Number, default: 0, min: 0, max: 5},
    status: {type: String, default: 'stock', enum: ['stock', 'out of stock']},
    category: {type: String, required: true},
    createdAt: { type: String, default: () => {
      const date = new Date();
      return date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      }); // Output: "04 August 2025"
    }}
})

export const productModel = mongoose.model("product", productSchema)