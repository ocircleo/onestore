const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const cors = require("cors");
const path = require("path");
const { pathMiddleware } = require("./utilities");
const { RootRouter } = require("./app");
const { default: mongoose } = require("mongoose");

//Middleware
app.use(express.json());
app.use(cors());
require("dotenv").config();
app.use(express.static(path.join(__dirname, "public")));

//mongoose connection

let uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@ocircleo.zgezjlp.mongodb.net/raiyan_traders?retryWrites=true&w=majority&appName=ocircleo`;
// mongoose
//   .connect("mongodb://localhost:27017/tooltip")
//   .then(() => console.log("connected to local db"));
mongoose
  .connect(uri)
  .then(() => {
    console.log("Connected to MongoDB Atlas");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB Atlas", err);
  });

// Route Handler
app.use("/", pathMiddleware, RootRouter);
//Not Found Page
app.use("*", pathMiddleware, (req, res) => {
  return { error: true, message: "API Path not found", data: {} };
});

//listen to port
app.listen(port, () => {
  console.log("App is running at port : http://localhost:" + port);
});
