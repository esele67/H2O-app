import express from "express";
import Product from "../models/Product.js";

const router = express.Router();


router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Error fetching products" });
  }
});


router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: "Error fetching product" });
  }
});


router.post("/", async (req, res) => {
  try {
    const { name, price, size, img } = req.body;
    const product = await Product.create({ name, price, size, img });
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ message: "Error creating product" });
  }
});


router.delete("/:id", async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json({ message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting product" });
  }
});


router.put("/:id", async (req, res) => {
  try {
    const { name, price, size, img } = req.body;
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { name, price, size, img },
      { new: true }
    );
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(400).json({ message: "Error updating product" });
  }
});

export default router;
