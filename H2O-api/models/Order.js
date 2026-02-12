import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  items: [
    { productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" }, quantity: Number }
  ],
  orderId: String,
  address: String,
  status: { type: String, enum: ["PENDING", "ACCEPTED", "DISPATCHED", "DELIVERED"], default: "PENDING" },
  paymentMethod: { type: String, default: "COD" },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Order", orderSchema);
