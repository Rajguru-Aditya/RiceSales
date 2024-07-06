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
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
  total: {
    type: Number,
    required: true,
  },
  paymentType: {
    type: String,
    enum: ["cash", "online"],
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
    this.total =
      this.quantity * (this.quantity < 25 ? product.loosePrice : product.price);
    next();
  } catch (error) {
    next(error);
  }
});

const Sale = mongoose.model("Sale", salesSchema);

module.exports = Sale;
