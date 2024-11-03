const { default: mongoose } = require("mongoose");

const schema = new mongoose.Schema({
  name: {
    type: "string",
    required: true,
  },
  email: {
    type: "string",
    required: true,
  },
  password: {
    type: "string",
    required: true,
    min: 6,
    max: 12,
  },
  role: {
    type: "string",
    required: true,
    default: "user",
  },
  profileImage: {
    type: "string",
    default: "https://tooltip-backend.vercel.app/assets/profile.jpg",
  },
  phone: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    default: "Bangladesh",
  },
  city: {
    type: String,
    default: null,
  },
  address: {
    type: String,
    default: null,
  },
  cart: Array,
  comments: Array,
  verified: Boolean,
  paymentHistory: Array,
  orderHistory: Array,
  otp: Number,
  disabled: { type: Boolean, default: false },
});

const UserModel = mongoose.model("users", schema);
module.exports = UserModel;
