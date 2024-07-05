const express = require("express");
const dotenv = require("dotenv").config();
const connectDB = require("./config/dbConnection");
const Sale = require("./models/salesModel");
const Product = require("./models/riceModel");

connectDB();

const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

// Fetch all products
app.get("/api/products", async (req, res) => {
  const products = await Product.find();
  res.send(products);
});

// Add a new product
app.post("/api/products", async (req, res) => {
  const { name, price } = req.body;
  if (!name || !price) {
    return res.status(400).send({ error: "Name and price are required." });
  }
  try {
    const product = new Product({ name, price });
    await product.save();
    res.status(201).send(product);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// Add a new sale
app.post("/api/sales", async (req, res) => {
  const { product, quantity, date } = req.body;
  if (!product || !quantity || !date) {
    return res
      .status(400)
      .send({ error: "Product, quantity, and date are required." });
  }
  try {
    const saleDate = new Date(`${date}T00:00:00Z`); // Convert date string to UTC Date object
    const sale = new Sale({ product, quantity, date: saleDate });
    await sale.save();
    res.status(201).send(sale);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// Get sales for a specific day
app.get("/api/sales/:date", async (req, res) => {
  const date = req.params.date;
  if (!isValidDate(date)) {
    return res
      .status(400)
      .send({ error: "Invalid date format. Please use YYYY-MM-DD." });
  }

  try {
    const startOfDay = new Date(`${date}T00:00:00Z`);
    const endOfDay = new Date(`${date}T23:59:59Z`);

    const salesSummary = await Sale.aggregate([
      {
        $match: {
          date: { $gte: startOfDay, $lte: endOfDay },
        },
      },
      {
        $group: {
          _id: "$product",
          totalQuantity: { $sum: "$quantity" },
          totalPrice: { $sum: "$total" },
        },
      },
      {
        $project: {
          _id: 0,
          product: "$_id",
          totalQuantity: 1,
          totalPrice: 1,
        },
      },
    ]);

    res.send(salesSummary);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

function isValidDate(dateString) {
  const regEx = /^\d{4}-\d{2}-\d{2}$/;
  return dateString.match(regEx) !== null;
}

app.listen(port, () => {
  console.log(`Server is running on port ${port}, ${new Date()}`);
});
