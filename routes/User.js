const express = require("express");
const { textWash, ReturnMessage, textWashRegex } = require("../utilities");
const LaptopModel = require("../models/LaptopModel");
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
UserRoute.get("/product-length", async (req, res) => {
  const length = await LaptopModel.find().countDocuments();
  res.send(ReturnMessage(false, "data found", length));
});
UserRoute.get("/search", async (req, res) => {
  try {
    let { text = "", page = 0, stock = null, sort = 0 } = req.query;
    text = textWashRegex(text);
    let skip = page * 12;
    const expression = new RegExp(text, "i");
    let result;
    let query = {};
    if (text) query["laptop.model"] = { $regex: expression };
    if (stock == "in") query["laptop.stock"] = { $gt: 0 };
    if (stock == "out") query["laptop.stock"] = 0;
    if (sort != -1 || sort != 1)
      result = await LaptopModel.find(query).limit(12).skip(Number(skip));
    else
      result = await LaptopModel.find(query)
        .limit(12)
        .sort({ "laptop.price": Number(sort) })
        .skip(Number(skip));
    const count = await LaptopModel.find(query).countDocuments();
    res.send(
      ReturnMessage(false, "data found", { length: count, data: result })
    );
  } catch (error) {
    console.log(error.message);
    res.send(ReturnMessage(false, error.message, []));
  }
});
UserRoute.get("/laptop/:url", async (req, res) => {
  try {
    const dataUrl = textWash(req.params.url);
    const result = await LaptopModel.findOne({ dataUrl: dataUrl });
    res.send(ReturnMessage(false, "found the laptop", result));
  } catch (error) {
    res.send(ReturnMessage(true, error, {}));
  }
});
UserRoute.get("/laptop_id/:id", async (req, res) => {
  try {

    const id = textWash(req.params.id);
    const result = await LaptopModel.findById(id);
    console.log(result);
    res.send(ReturnMessage(false, "found the laptop", result));
  } catch (error) {
    res.send(ReturnMessage(true, error, {}));
  }
});
UserRoute.get("/orders", (req, res) => {
  res.send("Welcome to the root of the application");
});
UserRoute.get("/payments", (req, res) => {
  res.send("Welcome to the root of the application");
});

module.exports = { UserRoute };
