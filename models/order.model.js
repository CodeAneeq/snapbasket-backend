import mongoose, { Schema } from "mongoose";

const orderSchema = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
  products: [
    {
      id: { type: mongoose.Schema.Types.ObjectId, ref: "product", required: true },
      price: {type: Number, required: true},
      quantity: { type: Number, required: true },
      title: {type: String, required: true},
      category: {type: String, required: true},
      images: {type: [String], required: true}
    }
  ],
  paymentMethod: { type: String, enum: ["card", "Cash On Delivery"], default: "Cash On Delivery" },
  status: {
    type: String,
    default: "Pending",
    enum: ["Pending", "Processing", "Shipping", "Delivered", "Paid", "Failed"]
  },
   stripeSessionId: {
      type: String, // Stripe ka session ID store karne ke liye
    },
    paymentIntentId: {
      type: String
    },
  addressId: {
    type: mongoose.Schema.Types.ObjectId, ref: 'address', required: true
  },
  totalAmount: {type: Number, required: true},
createdAt: { type: Date, default: Date.now }
});

export const orderModel = mongoose.model("order", orderSchema);