const mongoose = require("mongoose");
const { Schema } = mongoose;

const salesSchema = new Schema({
  product: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  unitType: {
    type: String,
    enum: ["bag", "kg"], // 'bag' for whole bags, 'kg' for loose rice
    required: true,
  },
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
  total: {
    type: Number,
    required: true,
  },
});

// Pre-save middleware to calculate total price
salesSchema.pre("validate", async function (next) {
  try {
    const product = await mongoose
      .model("Product")
      .findOne({ name: this.product });
    if (!product) {
      return next(new Error("Product not found"));
    }

    if (this.unitType === "bag") {
      this.total = this.quantity * product.price; // Price per bag
    } else if (this.unitType === "kg") {
      this.total = this.quantity * product.loosePrice; // Price per kg
    }

    next();
  } catch (error) {
    next(error);
  }
});

const Sale = mongoose.model("Sale", salesSchema);

module.exports = Sale;
