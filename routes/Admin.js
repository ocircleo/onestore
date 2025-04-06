const express = require("express");
const LaptopModel = require("../models/LaptopModel");
const { ReturnMessage, GenerateDataUrl, textWash } = require("../utilities");
const UserModel = require("../models/UserModel");
const MessageModel = require("../models/MessageModel");
const { v4: uuidv4 } = require("uuid");
const AnyModel = require("../models/AnyModel");
const ImgModel = require("../models/ImageModel");
const AdminRoute = express.Router();

AdminRoute.post("/add_product", async (req, res) => {
  let laptop = req.body;
  laptop.dataUrl = GenerateDataUrl(
    textWash(laptop.laptop.brand),
    textWash(laptop.laptop.model)
  );

  try {
    let product = new LaptopModel(laptop);
    let result = await product.save();
    res.send(ReturnMessage(false, "Successfuly Laptop Added  ", result));
  } catch (error) {
    res.send(ReturnMessage(true, error.message));
  }
});
AdminRoute.post("/add_product_any", async (req, res) => {
  let product = req.body;
  product.dataUrl = GenerateDataUrl(textWash(product.title), uuidv4());

  try {
    let newProduct = new AnyModel(product);
    let result = await newProduct.save();
    res.send(ReturnMessage(false, "Successfully Product Added", result));
  } catch (error) {
    res.send(ReturnMessage(true, error.message));
  }
});
AdminRoute.put("/update_product", async (req, res) => {
  let laptop = req.body;

  try {
    let result = await LaptopModel.findByIdAndUpdate(laptop._id, laptop, {
      new: true,
      runValidators: true,
    });
    if (result)
      return res.send(
        ReturnMessage(false, "Successfully Laptop updated  ", result)
      );
    res.send(ReturnMessage(true, "Sorry No Laptop Found ", null));
  } catch (error) {
    res.send(ReturnMessage(true, error.message, null));
  }
});
AdminRoute.put("/update_any_product", async (req, res) => {
  let item = req.body;

  try {
    let result = await AnyModel.findByIdAndUpdate(item._id, item, {
      new: true,
      runValidators: true,
    });
    if (result)
      return res.send(
        ReturnMessage(false, "Successful item updated  ", result)
      );
    res.send(ReturnMessage(true, "Sorry No item Found ", null));
  } catch (error) {
    res.send(ReturnMessage(true, error.message, null));
  }
});
AdminRoute.delete("/delete_product", async (req, res) => {
  let { id } = req.body;

  try {
    let result = await LaptopModel.findByIdAndDelete(id);
    if (result)
      return res.send(
        ReturnMessage(false, "Laptop deleted successfully ", result)
      );
    res.send(
      ReturnMessage(true, "Sorry No Laptop Found or failed to delete", null)
    );
  } catch (error) {
    res.send(ReturnMessage(true, error.message));
  }
});
AdminRoute.delete("/delete_any_product", async (req, res) => {
  let { id } = req.body;

  try {
    let result = await AnyModel.findByIdAndDelete(id);
    if (result)
      return res.send(
        ReturnMessage(false, "item deleted successfully ", result)
      );
    res.send(
      ReturnMessage(true, "Sorry No item Found or failed to delete", null)
    );
  } catch (error) {
    res.send(ReturnMessage(true, error.message));
  }
});
AdminRoute.get("/orders", (req, res) => {
  res.send("Welcome to the root of the application");
});
AdminRoute.get("/user/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const result = await UserModel.findById(id).select({
      name: 1,
      email: 1,
      phone: 1,
      role: 1,
      city: 1,
      address: 1,
      disabled: 1,
    });
    if (result) return res.send(ReturnMessage(false, "User found", result));
    res.send(ReturnMessage(true, "User not found found", null));
  } catch (error) {
    res.send(ReturnMessage(true, error.message, null));
  }
});
AdminRoute.put("/make_admin", async (req, res) => {
  try {
    const id = req.body.id;
    const user = await UserModel.findById(id);
    if (user.disabled)
      return res.send(
        ReturnMessage(
          true,
          "Cant make disabled users admin, Please enable the user first",
          null
        )
      );
    const result = await UserModel.findByIdAndUpdate(
      id,
      { role: "admin" },
      { new: true }
    );

    if (result)
      return res.send(
        ReturnMessage(false, "User added to Admin access", result)
      );
    res.send(
      ReturnMessage(
        true,
        "Sorry some error happened while performing action",
        null
      )
    );
  } catch (error) {
    res.send(ReturnMessage(true, error.message, null));
  }
});
AdminRoute.put("/remove_admin", async (req, res) => {
  try {
    const id = req.body.id;

    const totalAdmins = await UserModel.find({
      role: "admin",
    }).countDocuments();
    if (totalAdmins < 2)
      return res.send(
        ReturnMessage(
          true,
          "You are the last admin, So you cant be removed",
          null
        )
      );
    const result = await UserModel.findByIdAndUpdate(
      id,
      { role: "user" },
      { new: true }
    );

    if (result)
      return res.send(
        ReturnMessage(false, "Removed from Admin access", result)
      );
    res.send(
      ReturnMessage(
        true,
        "Sorry some error happened while performing action",
        null
      )
    );
  } catch (error) {
    res.send(ReturnMessage(true, error.message, null));
  }
});
AdminRoute.put("/disable_user", async (req, res) => {
  try {
    const id = req.body.id;

    const user = await UserModel.findById(id);
    if (user.role == "admin")
      return res.send(
        ReturnMessage(
          true,
          "You cant disable admin, Remove from admin access first",
          null
        )
      );
    if (req.user._id == id)
      return res.send(ReturnMessage(true, "You cant disable Yourself", null));

    const result = await UserModel.findByIdAndUpdate(
      id,
      { disabled: true },
      { new: true }
    );
    if (result)
      return res.send(ReturnMessage(false, "Disabled the user", result));
    res.send(
      ReturnMessage(
        true,
        "Sorry some error happened while performing action",
        null
      )
    );
  } catch (error) {
    res.send(ReturnMessage(true, error.message, null));
  }
});
AdminRoute.put("/enable_user", async (req, res) => {
  try {
    const id = req.body.id;

    const result = await UserModel.findByIdAndUpdate(
      id,
      { disabled: false },
      { new: true }
    );
    if (result)
      return res.send(ReturnMessage(false, "Enabled the user ", result));
    res.send(
      ReturnMessage(
        true,
        "Sorry some error happened while performing action",
        null
      )
    );
  } catch (error) {
    res.send(ReturnMessage(true, error.message, null));
  }
});
AdminRoute.put("/upload-image", async (req, res) => {
  try {
    const { id, url, index, type } = req.body;
    let UpdateIndex = 0;

    let result;
    if (type == "laptop") result = await LaptopModel.findById(id);
    else result = await AnyModel.findById(id);

    if (result.images[Number(index)]) UpdateIndex = index;
    else UpdateIndex = result.images.length;
    const imageArr = result.images;
    imageArr[UpdateIndex] = url;
    if (type == "laptop")
      result = await LaptopModel.findByIdAndUpdate(
        id,
        { images: imageArr },
        { new: true }
      );
    else
      result = await AnyModel.findByIdAndUpdate(
        id,
        { images: imageArr },
        { new: true }
      );

    if (result)
      return res.send(
        ReturnMessage(false, "Image Uploaded successfully ", result)
      );
    res.send(
      ReturnMessage(
        true,
        "Sorry some error happened while performing action",
        null
      )
    );
  } catch (error) {
    res.send(ReturnMessage(true, error.message, null));
  }
});
AdminRoute.put("/delete-image", async (req, res) => {
  try {
    const { id, url } = req.body;

    let result = await LaptopModel.findById(id);
    const imageArr = result.images;

    let newArray = [];
    for (let i = 0; i < imageArr.length; i++) {
      if (imageArr[i] == url) continue;
      newArray.push(imageArr[i]);
    }
    result = await LaptopModel.findByIdAndUpdate(
      id,
      { images: newArray },
      { new: true }
    );

    if (result)
      return res.send(
        ReturnMessage(false, "Image Uploaded successfully ", result)
      );
    res.send(
      ReturnMessage(
        true,
        "Sorry some error happened while performing action",
        null
      )
    );
  } catch (error) {
    res.send(ReturnMessage(true, error.message, null));
  }
});

AdminRoute.put("/upload_landing_img", async (req, res) => {
  try {
    const { imageUrl, targetLink } = req.body;

    const newLandingImage = new ImgModel({ imageUrl, targetLink });

    const result = await newLandingImage.save();
    res.send(
      ReturnMessage(false, "Landing image added successfully", result)
    );
  } catch (error) {
    res.send(ReturnMessage(true, error.message, null));
  }
});
AdminRoute.delete("/delete_landing_img", async (req, res) => {
  try {
    const { id } = req.body;
    const result = await ImgModel.findByIdAndDelete(id);
    if (result)
      return res.send(
        ReturnMessage(false, "Landing image deleted successfully", result)
      );
    res.send(
      ReturnMessage(true, "No landing image found or failed to delete", null)
    );
  } catch (error) {
    res.send(ReturnMessage(true, error.message, null));
  }
});

AdminRoute.get("/messages", async (req, res) => {
  try {
    const { state, page } = req.query;
    let skip = page * 12;
    let result = await MessageModel.find({ state }).skip(skip);
    let length = await MessageModel.find({ state }).countDocuments();
    if (result)
      return res.send(
        ReturnMessage(false, "Found Data", { data: result, length })
      );
    res.send(
      ReturnMessage(
        true,
        "Sorry some error happened while performing action",
        []
      )
    );
  } catch (error) {
    res.send(ReturnMessage(true, error.message, []));
  }
});
AdminRoute.put("/messageReplied/:id", async (req, res) => {
  try {
    const id = req.params.id;
    let result = await MessageModel.findByIdAndUpdate(id, { state: "replied" });
    if (result)
      return res.send(ReturnMessage(false, "Successfully Replied", result));
    res.send(ReturnMessage(true, "Sorry some error happened ", {}));
  } catch (error) {
    res.send(ReturnMessage(true, error.message, {}));
  }
});
AdminRoute.delete("/deleteMessage/:id", async (req, res) => {
  try {
    const id = req.params.id;
    let result = await MessageModel.findByIdAndDelete(id);
    if (result)
      return res.send(ReturnMessage(false, "Successfully Deleted", result));
    res.send(ReturnMessage(true, "Sorry some error happened ", {}));
  } catch (error) {
    res.send(ReturnMessage(true, error.message, {}));
  }
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
