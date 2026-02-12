import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  size: String,
  img: String
});

export default mongoose.model("Product", productSchema);
