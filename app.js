const express = require("express");
const { AuthRoute } = require("./routes/Auth");
const { UserRoute } = require("./routes/User");
const { AdminRoute } = require("./routes/Admin");
const RootRouter = express.Router();
//Routes separated based on their uses
RootRouter.use("/auth", AuthRoute);
RootRouter.use("/user", UserRoute);
RootRouter.use("/admin", AdminRoute);

module.exports = { RootRouter };
