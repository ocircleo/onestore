const express = require("express");
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
UserRoute.get("/search", (req, res) => {
  res.send("Welcome to the root of the application");
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