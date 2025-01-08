const express = require("express");
const { ReturnMessage } = require("../utilities");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const UserModel = require("../models/UserModel");
const AuthRoute = express.Router();
//tested
AuthRoute.put("/auto_login", JwtVerify, AuthorizeUser, async (req, res) => {
  try {
    let user, finalResPonse, token;
    let { key, password } = req.user;
    user = req.user;
    //create new token for login (refresh token)
    token = SignJwtFunction({ key, pass: password });
    finalResPonse = ReturnMessage(false, "Login Successful", user);
    finalResPonse.token = token;
    res.send(finalResPonse);
  } catch (error) {
    res.send(ReturnMessage(true, "Some Error happened, try again later", null));
  }
});
//tested
AuthRoute.put("/login", async (req, res) => {
  let passwordCheck, result, token, finalResPonse;
  let { key, password } = req.body;
  let query = {};
  if (key.includes("@")) query = { email: key };
  else query = { phone: key };

  try {
    //checks if there is an user by the email
    result = await UserModel.findOne(query);
    if (!result)
      return res.send(
        ReturnMessage(true, "No user found by this email / phone", null)
      );
    passwordCheck = await BcryptComparer(result.password, password);

    //checks if the passwords matches
    if (!passwordCheck)
      return res.send(ReturnMessage(true, "False Password", null));
    //if password matches sends the result
    token = SignJwtFunction({ key, pass: result.password });
    finalResPonse = ReturnMessage(false, "Authenticated user", result);
    finalResPonse.token = token;
    return res.send(finalResPonse);
  } catch (error) {
    res.send(ReturnMessage(true, error.message, null));
  }
});

//tested
AuthRoute.post("/register", async (req, res, next) => {
  let hashedPassword, token, result, newUser, finalResPonse;
  let { name, email, password, phone } = req.body;

  try {
    //checks if there is an user by the email
    result = await UserModel.findOne({ email: email });
    if (result)
      return res.send(
        ReturnMessage(true, "User already exists by this email", null)
      );
    //checks if there is an user by the phone number
    result = await UserModel.findOne({ phone: phone });
    if (result)
      return res.send(
        ReturnMessage(true, "User already exists by this phone number", null)
      );

    //hashes the password and save user to db
    hashedPassword = await BcryptHasher(password);
    newUser = new UserModel(
      newUserGenerator(name, email, hashedPassword, phone)
    );

    result = await newUser.save();
    token = SignJwtFunction({ key: phone, pass: hashedPassword }); //generates a jwt token
    finalResPonse = ReturnMessage(false, "User created successfully", result);
    finalResPonse.token = token;
    res.send(finalResPonse);
  } catch (error) {
    res.send(ReturnMessage(true, "Some Error happened, try again later", null));
  }
});
AuthRoute.put(
  "/update_password",
  JwtVerify,
  AuthorizeUser,
  async (req, res) => {
    let passwordCheck, result, token, finalResPonse;
    let { oldPassword, newPassword } = req.body;
    try {
      //checks if there is an user by the email
      passwordCheck = await BcryptComparer(req.user.password, oldPassword);
      //checks if the passwords matches
      if (!passwordCheck)
        return res.send(
          ReturnMessage(true, "Your Old password is false", null)
        );

      //hashes the new password and updates in db
      let newHashedPassword = await BcryptHasher(newPassword);
      result = await UserModel.findByIdAndUpdate(
        { _id: req.user._id },
        {
          password: newHashedPassword,
        },
        { new: true }
      );

      //if Update successful sends the new user with token
      token = SignJwtFunction({ key: req.user.phone, pass: newHashedPassword });
      finalResPonse = ReturnMessage(
        false,
        "Successfully password updated",
        result
      );
      finalResPonse.token = token;
      return res.send(finalResPonse);
    } catch (error) {
      res.send(ReturnMessage(true, error.message, null));
    }
  }
);
//check if email and password matches and continues while injecting user info in request
async function AuthorizeUser(req, res, next) {
  try {
    let { key, pass } = req.decoded;
    key = key.toString();

    let query = {};
    if (key.includes("@")) query = { email: key };
    else query = { phone: key };

    let result = await UserModel.findOne(query);
    if (!result)
      return res.status(404).send(ReturnMessage(true, "User not Found", null));
    if (result.password != pass)
      return res
        .status(404)
        .send(ReturnMessage(true, "Password not matched", null));
    req.user = result;
    next();
  } catch (error) {
    return res.status(404).send(ReturnMessage(true, error.message, null));
  }
}
async function AuthenticateUser(req, res, next) {
  try {
    let { key } = req.decoded;
    key = key.toString();

    let query = {};
    if (key.includes("@")) query = { email: key };
    else query = { phone: key };

    let result = await UserModel.findOne(query);
    if (!result)
      return res.status(404).send(ReturnMessage(true, "User not Found", null));
    req.user = result;
    next();
  } catch (error) {
    return res.status(404).send(ReturnMessage(true, error.message, null));
  }
}
async function isAdmin(req, res, next) {
  let user = req.user;
  if (user.role == "admin") return next();
  return res
    .status(401)
    .send(ReturnMessage(true, "401 Unauthorized Access", null));
}
async function isBlocked(phone = null, email = null) {
  return true;
}
function JwtVerify(req, res, next) {
  let token = req.headers.authorization;
  if (!token) {
    return res
      .status(404)
      .send({ error: true, message: "No Token", result: null });
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, decoded) => {
    if (error) {
      return res
        .status(404)
        .send({ error: true, message: "False Token", result: null });
    }
    req.decoded = decoded;
    next();
  });
}
module.exports = { AuthRoute, AuthorizeUser, isAdmin, JwtVerify, isBlocked };
function newUserGenerator(name, email, password, phone) {
  return {
    name: name,
    email: email,
    password: password,
    role: "user",
    profileImage: "https://tooltip-backend.vercel.app/assets/profile.jpg",
    phone: phone,
    country: "Bangladesh",
    city: null,
    address: null,
    wishlist: [],
    comments: [],
    verified: false,
    paymentHistory: [],
    orderHistory: [],
    otp: null,
  };
}
function BcryptHasher(text) {
  return bcrypt.hash(text, 10);
}
function BcryptComparer(hashedText, normalText) {
  return bcrypt.compare(normalText, hashedText);
}
function SignJwtFunction(data) {
  return jwt.sign(data, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "3d",
  });
}
