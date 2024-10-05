const express = require("express");
const AdminRoute = express.Router();

AdminRoute.post("/add_product", (req, res) => {
  res.send("Welcome to the root of the application");
});
AdminRoute.put("/update_product", (req, res) => {
  res.send("Welcome to the root of the application");
});
AdminRoute.delete("/delete_product", (req, res) => {
  res.send("Welcome to the root of the application");
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