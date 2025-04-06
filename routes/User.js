const express = require("express");
const {
  textWash,
  ReturnMessage,
  textWashRegex,
  queryOrganizer,
} = require("../utilities");
const LaptopModel = require("../models/LaptopModel");
const { JwtVerify, AuthorizeUser } = require("./Auth");
const UserModel = require("../models/UserModel");
const MessageModel = require("../models/MessageModel");
const AnyModel = require("../models/AnyModel");
const ImgModel = require("../models/ImageModel");
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
UserRoute.get("/product-length", async (req, res) => {
  const length = await LaptopModel.find().countDocuments();
  res.send(ReturnMessage(false, "data found", length));
});
UserRoute.get("/laptops", async (req, res) => {
  try {
    let { text = "", page = 0 } = req.query;
    text = textWashRegex(text).trim();
    page = page;
    let skip = page * 12;
    let expression;
    if (text.length > 0) expression = new RegExp(text, "i");
    let result;
    let query = {};
    if (text.length > 0) query["laptop.model"] = { $regex: expression };
    result = await LaptopModel.find(query).skip(Number(skip)).limit(12);
    const count = await LaptopModel.find(query).countDocuments();
    res.send(
      ReturnMessage(false, "Found Data", { length: count, data: result })
    );
  } catch (error) {
    console.log(error.message);
    res.send(ReturnMessage(true, error.message, { length: 0, data: [] }));
  }
});
UserRoute.get("/search", async (req, res) => {
  try {
    // text -- regex, price -- number search, stock -- boolean search, sort -- sort, other -- text search;
    let query = req.query;
    let filteredQuery = queryOrganizer(query);
    let dbQuery = {};
    let options = {};
    for (let item in filteredQuery) {
      switch (item) {
        case "inStock":
          dbQuery["laptop.stock"] = { $gt: 0 };
          break;
        case "min":
          dbQuery["laptop.price"] = { $gt: Number(filteredQuery[item]) };
          break;
        case "max":
          dbQuery["laptop.price"] = { $lt: Number(filteredQuery[item]) };
          break;
        case "processor":
          dbQuery["processor.brand"] = { $in: filteredQuery[item] };
          break;
        case "ram":
          dbQuery["memory.ram"] = { $in: filteredQuery[item] };
          break;
        case "storage":
          dbQuery["storage.capacity"] = { $in: filteredQuery[item] };
          break;
        case "graphics":
          dbQuery["graphics.size"] = { $in: filteredQuery[item] };
          break;
        case "brand":
          dbQuery["laptop.brand"] = { $in: filteredQuery[item] };
          break;
        case "text":
          dbQuery.dataUrl = { $regex: filteredQuery[item], $options: "i" };
          break;
        case "sort":
          options.sort = { ["laptop.price"]: filteredQuery[item] };
          break;
      }
    }
    let page = query.page ?? 0;
    let skip = page * 15;
    let result;

    result = await LaptopModel.find(dbQuery, null, options)
      .skip(Number(skip))
      .limit(15);
    const count = await LaptopModel.find(dbQuery, options).countDocuments();

    res.send(
      ReturnMessage(false, "Found Data", { length: count, data: result })
    );
  } catch (error) {
    console.log(error.message);
    res.send(ReturnMessage(true, error.message, { length: 0, data: [] }));
  }
});
UserRoute.get("/search_any", async (req, res) => {
  try {
    let { text = "", page = 0, stock = null, sort = 0 } = req.query;
    text = textWashRegex(text);
    let skip = page * 15;
    const expression = new RegExp(text, "i");
    let finalResult, result1, result2;
    let generalQuery = {};
    let laptopQuery = {};
    // let generalOptions = { limit: 15, skip: Number(skip) };
    // let laptopOptions = { limit: 15, skip: Number(skip) };
    if (text) {
      generalQuery["dataUrl"] = { $regex: expression };
      laptopQuery["dataUrl"] = { $regex: expression };
    }
    if (stock == "in") {
      generalQuery["stock"] = { $gt: 0 };
      laptopQuery["laptop.stock"] = { $gt: 0 };
    }
    if (stock == "out") {
      generalQuery["stock"] = { $lt: 1 };
      laptopQuery["laptop.stock"] = { $lt: 1 };
    }
    const count1 = await AnyModel.find(generalQuery).countDocuments();
    const count2 = await LaptopModel.find(laptopQuery).countDocuments();
    // let limit1 = count1 > 6 ? 6 : count1;
    // let limit2 = 15 - limit1;
    // generalOptions.limit = limit1;
    // laptopOptions.limit = limit2;
    // if (Boolean(Number(sort))) {
    // generalOptions.sort = { price: Number(sort) };
    // laptopOptions.sort = { ["laptop.price"]: Number(sort) };
    // }

    result1 = await AnyModel.find(generalQuery);
    result2 = await LaptopModel.find(laptopQuery);
    finalResult = [...result1, ...result2];

    finalResult = finalResult.sort((a, b) => {
      if (a["dataUrl"] < b["dataUrl"]) return -1;
      if (a["dataUrl"] > b["dataUrl"]) return 1;
      return 0;
    });
    if (Number(sort) == 1) {
      finalResult = finalResult.sort((a, b) => {
        let aPrice = a["laptop"] ? a["laptop"]["price"] : a["price"];
        let bPrice = b["laptop"] ? b["laptop"]["price"] : b["price"];
        if (aPrice < bPrice) return -1;
        if (aPrice > bPrice) return 1;
        return 0;
      });
    }else if (Number(sort) == -1) {
      finalResult = finalResult.sort((a, b) => {
        let aPrice = a["laptop"] ? a["laptop"]["price"] : a["price"];
        let bPrice = b["laptop"] ? b["laptop"]["price"] : b["price"];
        if (aPrice < bPrice) return 1;
        if (aPrice > bPrice) return -1;
        return 0;
      });
    }
    console.log(finalResult.length);
    finalResult = finalResult.slice(Number(skip), Number(skip) + 15);

    res.send(
      ReturnMessage(false, "data found", {
        length: count1 + count2,
        data: finalResult,
      })
    );
  } catch (error) {
    console.log(error.message);
    res.send(ReturnMessage(true, error.message, { length: 0, data: [] }));
    /**
     * function sortArrayByTextAndPrice(array, text, price) {
  // First sort by text
  array.sort((a, b) => {
    if (a[text] < b[text]) return -1;
    if (a[text] > b[text]) return 1;
    return 0;
  });

  // Then sort by price
  array.sort((a, b) => a[price] - b[price]);

  return array;
}
     */
  }
});
UserRoute.get("/search_users_admin", async (req, res) => {
  try {
    let { text = "", page = 0, city = "all" } = req.query;
    text = textWashRegex(text).trim();
    city = textWashRegex(city).trim();
    let queryType = isNaN(text); //checks if text is a number or email -- true for email
    let skip = page * 12;
    if (text.length == 0) text = 0;
    const expression = new RegExp(text, "i");
    const cityExpression = new RegExp(city, "i");
    let result;
    let query = {};
    if (queryType) query.email = { $regex: expression };
    else query.phone = { $regex: expression };
    if (city != "all") query.city = { $regex: cityExpression };
    result = await UserModel.find(query)
      .select({ name: 1, email: 1, phone: 1, role: 1, city: 1, address: 1 })
      .skip(Number(skip))
      .limit(12);
    const count = await UserModel.find(query).countDocuments();
    res.send(
      ReturnMessage(false, "Found Data", { length: count, data: result })
    );
  } catch (error) {
    console.log(error.message);
    res.send(ReturnMessage(true, error.message, { length: 0, data: [] }));
  }
});
UserRoute.get("/search_items_admin", async (req, res) => {
  try {
    let { text = "", page = 0, stock = null, sort = 0 } = req.query;
    text = textWashRegex(text);
    let skip = page * 12;
    const expression = new RegExp(text, "i");
    let result;
    let query = {};
    if (text) query["laptop.model"] = { $regex: expression };
    if (stock == "in") query["laptop.stock"] = { $gt: 0 };
    if (stock == "out") query["laptop.stock"] = 0;
    if (Number(sort) == 0)
      result = await LaptopModel.find(query).limit(12).skip(Number(skip));
    else
      result = await LaptopModel.find(query)
        .sort({ "laptop.price": Number(sort) })
        .skip(Number(skip))
        .limit(12);

    const count = await LaptopModel.find(query).countDocuments();
    res.send(
      ReturnMessage(false, "data found", { length: count, data: result })
    );
  } catch (error) {
    console.log(error.message);
    res.send(ReturnMessage(false, error.message, []));
  }
});
UserRoute.get("/search_any_items_admin", async (req, res) => {
  try {
    let { text = "", page = 0, stock = null, sort = 0 } = req.query;
    text = textWashRegex(text);
    let skip = page * 12;
    const expression = new RegExp(text, "i");
    let result;
    let query = {};
    if (text) query["title"] = { $regex: expression };
    if (stock == "in") query["stock"] = { $gt: 0 };
    if (stock == "out") query["stock"] = 0;
    if (Number(sort) == 0)
      result = await AnyModel.find(query).limit(12).skip(Number(skip));
    else
      result = await AnyModel.find(query)
        .sort({ price: Number(sort) })
        .skip(Number(skip))
        .limit(12);

    const count = await AnyModel.find(query).countDocuments();
    res.send(
      ReturnMessage(false, "data found", { length: count, data: result })
    );
  } catch (error) {
    console.log(error.message);
    res.send(ReturnMessage(false, error.message, []));
  }
});
UserRoute.get("/laptop/:url", async (req, res) => {
  try {
    const dataUrl = textWash(req.params.url);
    const result = await LaptopModel.findOne({ dataUrl: dataUrl });
    res.send(ReturnMessage(false, "found the laptop", result));
  } catch (error) {
    res.send(ReturnMessage(true, error, {}));
  }
});
UserRoute.get("/item/:url", async (req, res) => {
  try {
    const dataUrl = textWash(req.params.url);
    const laptopResult = await LaptopModel.findOne({ dataUrl: dataUrl });
    if (laptopResult)
      return res.send(ReturnMessage(false, "found the laptop", laptopResult));
    const itemResult = await AnyModel.findOne({ dataUrl: dataUrl });
    if (itemResult)
      return res.send(ReturnMessage(false, "found the Item", itemResult));
    res.send(ReturnMessage(true, "Item was not found", result));
  } catch (error) {
    res.send(ReturnMessage(true, error, {}));
  }
});
UserRoute.get("/laptop_id/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const result = await LaptopModel.findOne({ _id: id });
    res.send(ReturnMessage(false, "found the laptop", result));
  } catch (error) {
    res.send(
      ReturnMessage(true, "Some error happened while loading your data", {})
    );
  }
});
UserRoute.get("/item_id/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const laptopResult = await LaptopModel.findOne({ _id: id });
    if (laptopResult)
      return res.send(ReturnMessage(false, "found the laptop", laptopResult));
    const itemResult = await AnyModel.findOne({ _id: id });
    if (itemResult)
      return res.send(ReturnMessage(false, "found the laptop", itemResult));
    res.send(
      ReturnMessage(true, "Some error happened while loading your data", {})
    );
  } catch (error) {
    res.send(
      ReturnMessage(true, "Some error happened while loading your data", {})
    );
  }
});

UserRoute.post("/sendMessage", async (req, res) => {
  try {
    let { name, email, message } = req.body;
    let newMessage = new MessageModel({
      name: textWash(name),
      email: textWash(email),
      message: textWash(message),
    });
    let result = await newMessage.save();
    if (result) return res.send(ReturnMessage(false, "Successful", result));
    res.send(ReturnMessage(true, error.message, {}));
  } catch (error) {
    res.send(ReturnMessage(true, error.message, {}));
  }
});
UserRoute.get("/payments", (req, res) => {
  res.send("Welcome to the root of the application");
});
UserRoute.put("/update_profile", JwtVerify, AuthorizeUser, async (req, res) => {
  const { name, city, address, email, phone } = req.body;
  try {
    let loggedUser = req.user;
    if (email != loggedUser.email)
      return res
        .status(401)
        .send(ReturnMessage(true, "401 Unauthorized Access"));
    if (phone != loggedUser.phone)
      return res
        .status(401)
        .send(ReturnMessage(true, "401 Unauthorized Access"));
    let data = { name, city, address };
    let result = await UserModel.findByIdAndUpdate(
      { _id: loggedUser._id },
      data,
      {
        new: true,
      }
    );
    if (result)
      return res.send(ReturnMessage(false, "Profile Updated successfully"));
    res.send(ReturnMessage(true, "Failed to update profile"));
  } catch (error) {
    return res.send(ReturnMessage(true, error.message));
  }
});
UserRoute.get("/get_landing_img", async (req, res) => {
  try {
    const result = await ImgModel.find();
    if (result.length > 0)
      return res.send(
        ReturnMessage(false, "Landing images retrieved successfully", result)
      );
    res.send(ReturnMessage(false, "found none", null));
  } catch (error) {
    res.send(ReturnMessage(true, error.message, null));
  }
});
module.exports = { UserRoute };
