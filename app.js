const express = require("express");
const fs = require("fs");
const {
  AuthRoute,
  AuthorizeUser,
  JwtVerify,
  isAdmin,
} = require("./routes/Auth");
const { UserRoute } = require("./routes/User");
const { AdminRoute } = require("./routes/Admin");
const path = require("path");
const LaptopModel = require("./models/LaptopModel");
const { findByIdAndUpdate } = require("./models/UserModel");
const { OrderRoute } = require("./routes/Order");
const RootRouter = express.Router();

//Routes separated based on their uses
RootRouter.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "pages", "home", "index.html"));
});
RootRouter.use("/auth", AuthRoute);
RootRouter.use("/user", UserRoute);
RootRouter.use("/order", OrderRoute);
RootRouter.use("/admin", JwtVerify, AuthorizeUser, isAdmin, AdminRoute);
RootRouter.get("/error",(req,res)=>{
   res.sendFile(
      path.join(__dirname, "public", "pages", "notFound", "index.html")
    );
})
// RootRouter.get("/tem", async (req, res) => {
//   let data = await LaptopModel.find();
//   data = JSON.stringify(data);
//   let filePath = path.join(__dirname, "laptops.json");
//   try {
//     fs.writeFileSync(filePath, data, { encoding: "utf-8" });
//   } catch (error) {
//     console.log(error);
//   } finally {
//     res.send({ ok: true });
//   }
// });
// RootRouter.get("/tems", async (req, res) => {
//   const data = await LaptopModel.find();
//   /**
//    * brand -- lowercase
//    * processor -> brand -- lower case
//    * memory -> ram -- number
//    * storage-> capacity -- number
//    * graphics-> memory -- number
//    */
//   for await (item of data) {
//     let result = await LaptopModel.findByIdAndUpdate(item._id, item, {
//       new: true,
//     });
//     console.log(result);
//   }
//   res.send("hello");
// });
module.exports = { RootRouter };
