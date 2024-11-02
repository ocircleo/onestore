const express = require("express");
const LaptopModel = require("../models/LaptopModel");
const { ReturnMessage, GenerateDataUrl, textWash } = require("../utilities");
const AdminRoute = express.Router();

AdminRoute.post("/add_product", async (req, res) => {
  let laptop = req.body;
  laptop.dataUrl = GenerateDataUrl(
    textWash(laptop.laptop.brand),
    textWash(laptop.laptop.model)
  );

  try {
    let product = new LaptopModel(laptop);
    let result = await product.save();
    res.send(ReturnMessage(false, "Successfuly Laptop Added  ", result));
  } catch (error) {
    res.send(ReturnMessage(true, error.message));
  }
});

AdminRoute.put("/update_product", async (req, res) => {
  let laptop = req.body;

  try {
    let result = await LaptopModel.findByIdAndUpdate(laptop._id, laptop, {
      new: true,
      runValidators: true,
    });
    if (result)
      res.send(ReturnMessage(false, "Successfuly Laptop updated  ", result));
    res.send(ReturnMessage(true, "Sorry No Laptop Found ", null));
  } catch (error) {
    res.send(ReturnMessage(true, error.message));
  }
});
AdminRoute.delete("/delete_product", async (req, res) => {
  let { id } = req.body;

  try {
    let result = await LaptopModel.findByIdAndDelete(id);
    if (result)
      return res.send(
        ReturnMessage(false, "Laptop deleted successfully ", result)
      );
    res.send(
      ReturnMessage(true, "Sorry No Laptop Found or failed to delete", null)
    );
  } catch (error) {
    res.send(ReturnMessage(true, error.message));
  }
});
AdminRoute.get("/orders", (req, res) => {
  res.send("Welcome to the root of the application");
});
AdminRoute.get("/order/:id", (req, res) => {
  res.send("Welcome to the root of the application");
});
AdminRoute.put("/update_order", (req, res) => {
  res.send("Welcome to the root of the application");
});
AdminRoute.get("/users", (req, res) => {
  /**
   * also have filter like phone, email, name, location etc
   */
  res.send("Welcome to the root of the application");
});
AdminRoute.get("/user/:id", (req, res) => {
  res.send("Welcome to the root of the application");
});
AdminRoute.put("/block_user", (req, res) => {
  res.send("Welcome to the root of the application");
});
AdminRoute.put("/make_admin", (req, res) => {
  res.send("Welcome to the root of the application");
});
AdminRoute.put("/update_user", (req, res) => {
  res.send("Welcome to the root of the application");
});

module.exports = { AdminRoute };
