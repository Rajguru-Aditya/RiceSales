const express = require("express");
const dotenv = require("dotenv").config();
const connectDB = require("./config/dbConnection");
const Sale = require("./models/salesModel");
const Product = require("./models/riceModel");
const cors = require("cors");

connectDB();

const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());
app.use(cors());

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
  const { name, price, loosePrice } = req.body;
  if (!name || !price || !loosePrice) {
    return res
      .status(400)
      .send({ error: "Name, price, and loose price are required." });
  }
  try {
    const product = new Product({ name, price, loosePrice });
    await product.save();
    res.status(201).send(product);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// Add a new sale
app.post("/api/sales", async (req, res) => {
  const { product, quantity, unitType, date } = req.body;
  if (!product || !quantity || !unitType || !date) {
    return res
      .status(400)
      .send({ error: "Product, quantity, unit type, and date are required." });
  }
  try {
    const saleDate = new Date(`${date}T00:00:00Z`); // Convert date string to UTC Date object
    const sale = new Sale({ product, quantity, unitType, date: saleDate });
    await sale.save();
    res.status(201).send(sale);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// Get all sales
app.get("/api/sales", async (req, res) => {
  try {
    const sales = await Sale.find({});
    res.send(sales);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// Get all sales grouped by date
app.get("/api/sales/all-dates", async (req, res) => {
  try {
    const salesSummary = await Sale.aggregate([
      {
        $group: {
          _id: {
            date: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
            product: "$product",
          },
          totalQuantity: { $sum: "$quantity" },
          totalPrice: { $sum: "$total" },
        },
      },
      {
        $project: {
          _id: 0,
          date: "$_id.date",
          product: "$_id.product",
          totalQuantity: 1,
          totalPrice: 1,
        },
      },
      {
        $sort: {
          date: 1, // Sort by date in ascending order
          product: 1, // Sort by product in ascending order within each date
        },
      },
    ]);

    res.send(salesSummary);
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
