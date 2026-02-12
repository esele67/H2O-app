import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  phone: String,
  password: String,
  role: { type: String, enum: ["customer", "admin"], default: "customer" }
});

export default mongoose.model("User", userSchema);
