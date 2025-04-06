const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ProductSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  category: {
    type: String,
    required: true,
    default:"general",
    trim: true,
  },
  stock: {
    type: Number,
    required: true,
    min: 0,
  },
  dataUrl: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  images: {
    type: [String],
    required: true,
    validate: [arrayLimit, "{PATH} exceeds the limit of 10"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

function arrayLimit(val) {
  return val.length <= 10;
}

let AnyModel = mongoose.model("AllProducts", ProductSchema);
module.exports = AnyModel;
