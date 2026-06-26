const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const app = express();

// 🔥 MIDDLEWARE (IMPORTANT ORDER)
app.use(cors()); // <-- CORS ADD PANNITOM
app.use(express.json());

// MongoDB connect
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log("DB ERROR:", err));

// model
const Order = require("./models/Order");

// routes
app.get("/", (req, res) => {
  res.send("Deecuts Backend Running");
});

// POST ORDER API
app.post("/api/orders", async (req, res) => {
  console.log("🔥 API HIT");
  console.log("BODY:", req.body);

  try {
    const order = await Order.create(req.body);
    res.status(201).json(order);
  } catch (error) {
    console.log("ERROR:", error);
    res.status(500).json({ message: error.message });
  }
});
// GET ALL ORDERS
app.get("/api/orders", async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE ORDER
app.delete("/api/orders/:id", async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false });
  }
});

// server start
app.listen(5000, () => {
  console.log("Server running on port 5000");
});