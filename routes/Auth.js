const express = require("express");
const AuthRoute = express.Router();

AuthRoute.put("/login", (req, res) => {
  res.send("Welcome to the root of the application");
});
AuthRoute.post("/register", (req, res) => {
  res.send("Welcome to the root of the application");
});
AuthRoute.put("/update_info", (req, res) => {
  res.send("Welcome to the root of the application");
});


//check if email and password matches and continues while injecting user info in request
async function AuthorizedUser(req, res, next) {
    let { email, key } = req.decoded;
    let result = await UserModel.findOne({ email: email });
    if (!result)
      return res.status(404).send(ReturnMessage("User not Found", 404));
    if (result.password != key)
      return res.status(404).send(ReturnMessage("Password not matched", 404));
    req.user = result;
    next();
  }
module.exports = { AuthRoute,AuthorizedUser };
