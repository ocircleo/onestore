const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const cors = require("cors");
const path = require("path");
const { pathMiddleware, ReturnMessage } = require("./utilities");
const { RootRouter } = require("./app");
const { default: mongoose } = require("mongoose");

//Middleware
app.use(express.json());
app.use(cors());
require("dotenv").config();
app.use(express.static(path.join(__dirname, "public")));

//mongoose connection

let uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@ocircleo.zgezjlp.mongodb.net/raiyan_traders?retryWrites=true&w=majority&appName=ocircleo`;

// Route Handler
app.use("/", mongooseConnection, pathMiddleware, RootRouter);
//Not Found Page
app.use("*", pathMiddleware, (req, res) => {
  return { error: true, message: "API Path not found", data: {} };
});

//listen to port
app.listen(port, () => {
  console.log("App is running at port : http://localhost:" + port);
});

async function mongooseConnection(req, res, next) {
  console.log("mongoose connected : ", Boolean(mongoose.connection.readyState));
  // mongoose
  //   .connect("mongodb://localhost:27017/tooltip")
  //   .then(() => console.log("connected to local db"));
  await mongoose
    .connect(uri)
    .then(() => {
      console.log("Connected to MongoDB Atlas");
      next();
    })
    .catch((err) => {
      console.error("Error connecting to MongoDB Atlas", err);
      return res
        .status(5001)
        .send(ReturnMessage(true, "Failed to connect to mongodb", null));
    });
}
