const express = require("express");
const {
  AuthRoute,
  AuthorizeUser,
  JwtVerify,
  isAdmin,
} = require("./routes/Auth");
const { UserRoute } = require("./routes/User");
const { AdminRoute } = require("./routes/Admin");
const path = require("path");
const RootRouter = express.Router();

//Routes separated based on their uses
RootRouter.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "pages", "home", "index.html"));
});
RootRouter.use("/auth", AuthRoute);
RootRouter.use("/user", UserRoute);
RootRouter.use("/admin", JwtVerify, AuthorizeUser, isAdmin, AdminRoute);
RootRouter.get("/tem", async (req, res) => {});
module.exports = { RootRouter };
