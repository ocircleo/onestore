const express = require("express");
const LaptopModel = require("../models/LaptopModel");
const { ReturnMessage, GenerateDataUrl, textWash } = require("../utilities");
const UserModel = require("../models/UserModel");
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

AdminRoute.put("/update_product", async (req, res) => {
  let laptop = req.body;

  try {
    let result = await LaptopModel.findByIdAndUpdate(laptop._id, laptop, {
      new: true,
      runValidators: true,
    });
    if (result)
      return res.send(
        ReturnMessage(false, "Successfuly Laptop updated  ", result)
      );
    res.send(ReturnMessage(true, "Sorry No Laptop Found ", null));
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
    const { id, url, index } = req.body;
    let UpdateIndex = 0;

    let result = await LaptopModel.findById(id);
   
    if (result.images[Number(index)]) UpdateIndex = index;
    else UpdateIndex = result.images.length;
    const imageArr = result.images;
    imageArr[UpdateIndex] = url;
    result = await LaptopModel.findByIdAndUpdate(
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
    
    let newArray = []
    for(let i = 0; i < imageArr.length;i++){
    if(imageArr[i] == url) continue;
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
AdminRoute.get("/order/:id", (req, res) => {
  res.send("Welcome to the root of the application");
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
