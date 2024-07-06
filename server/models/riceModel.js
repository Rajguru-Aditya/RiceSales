const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  price: {
    type: Number,
    required: true,
  },

  loosePrice: {
    type: Number,
    required: true, // Price per kg for loose rice
  },
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
