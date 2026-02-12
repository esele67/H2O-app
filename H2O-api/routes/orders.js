import express from "express";
import Order from "../models/Order.js";
import generateOrderId from "../utils/generateOrderId.js";

const router = express.Router();


router.post("/", async (req, res) => {
  const { userId, items, address } = req.body;
  const orderId = generateOrderId();
  const order = await Order.create({ userId, items, orderId, address });
  res.json(order);
});


router.get("/", async (req, res) => {
  try {
    const { userId, page = 1, limit = 10 } = req.query;

    const query = { userId };
    const skip = (page - 1) * limit;

    const orders = await Order.find(query)
      .populate("items.productId")
      .sort({ createdAt: -1 })
      .skip(Number(skip))
      .limit(Number(limit));

    const total = await Order.countDocuments(query);

    res.json({
      orders,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});


router.get("/admin/all", async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const skip = (page - 1) * limit;

    const orders = await Order.find()
      .populate("userId", "name")
      .populate("items.productId")
      .sort({ createdAt: -1 })
      .skip(Number(skip))
      .limit(Number(limit));

    const total = await Order.countDocuments();

    res.json({
      orders,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch admin orders" });
  }
});


router.get("/:id", async (req, res) => {
  const order = await Order.findById(req.params.id).populate("items.productId");
  res.json(order);
});


router.put("/:id/status", async (req, res) => {
  const { status } = req.body;
  const order = await Order.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true }
  );
  res.json(order);
});

/**

 */
router.get("/admin/stats", async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const totalRevenueAgg = await Order.aggregate([
      { $unwind: "$items" },
      {
        $lookup: {
          from: "products",
          localField: "items.productId",
          foreignField: "_id",
          as: "product",
        },
      },
      { $unwind: "$product" },
      {
        $group: {
          _id: null,
          totalRevenue: {
            $sum: { $multiply: ["$items.quantity", "$product.price"] },
          },
        },
      },
    ]);

    const totalRevenue =
      totalRevenueAgg.length > 0 ? totalRevenueAgg[0].totalRevenue : 0;

    const statusCounts = await Order.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    res.json({
      totalOrders,
      totalRevenue,
      statusCounts,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch stats" });
  }
});

export default router;
