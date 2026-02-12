import mongoose from "mongoose";
import dotenv from "dotenv";
import Admin from "./models/Admin.js";

dotenv.config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    await Admin.deleteMany();

    const admin = new Admin({
      email: "admin@h2o.com",
      password: "password"
    });

    await admin.save();

    console.log("✅ Admin seeded:", admin.email);
    process.exit();
  } catch (err) {
    console.error("❌ Error seeding admin:", err);
    process.exit(1);
  }
};

seedAdmin();
