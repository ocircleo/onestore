const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const cors = require("cors");
const path = require("path");
const { pathMiddleware } = require("./utilities");
const { RootRouter } = require("./app");

//Middleware
app.use(express.json());
app.use(cors());
require("dotenv").config();
app.use(express.static(path.join(__dirname, "public")));

// Route Handler
app.use("/", pathMiddleware, RootRouter);
//Not Found Page
app.use("*", pathMiddleware, (req, res) => {
  res.sendFile(
    path.join(__dirname, "public", "pages", "notFound", "index.html")
  );
});

//listen to port
app.listen(port, () => {
  console.log("App is running at port : http://localhost:" + port);
});
