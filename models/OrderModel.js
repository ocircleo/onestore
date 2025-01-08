const { default: mongoose } = require("mongoose");
const orderSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  paymentMethod: {
    type: String,
    default: "COD",
    enum: ["COD", "OP"],
    required: true,
  },
  products: { type: Array, required: true },
  totalPrice: { type: Number, required: true },
  orderDate: { type: Date, default: Date.now },
  shipmentDate: { type: Date, default: Date.now },
  orderStatus: {
    type: String,
    default: "Pending",
    enum: ["Pending", "Processing", "Shipped", "Delivered", "Canceled"],
  },
  orderMessage: { type: String, default: "" },
  orderRequestMessage: { type: String, default: "" },
  clear: { type: Boolean, default: false },
  canceled: { type: Boolean, default: false },
  lastUpdate: { type: Date, default: Date.now },
  canceledMessage: { type: String, default: "" },
  canceledBy: { type: String, default: "" },
  userPhone: { type: String, required: true },
  paid: { type: Number, default: 0, required: true },
});

const OrderModel = mongoose.model("orders", orderSchema);
module.exports = OrderModel;
