const express = require("express");
const { textWash, ReturnMessage } = require("../utilities");
const ProductModel = require("../models/ProductModel");
const UserRoute = express.Router();

UserRoute.get("/cart", (req, res) => {
  res.send("Welcome to the root of the application");
});
UserRoute.put("/cart", (req, res) => {
  res.send("Welcome to the root of the application");
});
UserRoute.delete("/cart", (req, res) => {
  res.send("Welcome to the root of the application");
});
UserRoute.get("/search", async (req, res) => {
  let { text, page = 0 } = req.query;
  text = textWash(text);
  console.log(text);
  let skip = page * 12;
  const expression = new RegExp(text, "i");
  const result = await ProductModel.find({
    name: { $regex: expression },
  }).skip(skip);
  console.log(result);
  res.send(ReturnMessage(false, "data found", result));
});
UserRoute.get("/products", (req, res) => {
  res.send("Welcome to the root of the application");
});
UserRoute.get("/product/:id", (req, res) => {
  res.send("Welcome to the root of the application");
});
UserRoute.get("/orders", (req, res) => {
  res.send("Welcome to the root of the application");
});
UserRoute.get("/payments", (req, res) => {
  res.send("Welcome to the root of the application");
});

module.exports = { UserRoute };
