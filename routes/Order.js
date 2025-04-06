const express = require("express");
const crypto = require("crypto");
const LaptopModel = require("../models/LaptopModel");
const OrderModel = require("../models/OrderModel");
const { ReturnMessage } = require("../utilities");
const { JwtVerify, AuthorizeUser, isAdmin } = require("./Auth");
const AnyModel = require("../models/AnyModel");
const OrderRoute = express.Router();
OrderRoute.post("/newOrder", JwtVerify, AuthorizeUser, async (req, res) => {
  try {
    let body = req.body;
    let { name, city, address, phone, paymentMethod, data } = body;
    let orderItemDataArray = [],
      totalPrice = 0;

    let date = "";
    let newDate = new Date();
    date = "";
    date += newDate.getFullYear() + "-";
    date += 1 + newDate.getMonth() + "-";
    date += newDate.getDate();
    for await (let item of data) {
      try {
        let id = item.itemId;
        let result = await LaptopModel.findById(id);
        if (!result) result = await AnyModel.findById(id);
        if (!result) continue;
        let stock = 0,
          price = 1;
        if (result.category == "laptop") {
          stock = result.laptop.stock;
          price = result.laptop.price;
        } else {
          stock = result.stock;
          price = result.price;
        }
        if (stock < 1) continue;
        totalPrice += item.quantity * price;
        let temObj = {
          itemId: id,
          quantity: item.quantity,
          price: price,
        };
        orderItemDataArray.push(temObj);
      } catch (error) {
        console.log(error);
      }
    }
    let orderSummery = {
      name,
      city,
      address,
      phone,
      paymentMethod,
      products: orderItemDataArray,
      totalPrice,
      userPhone: req.user.phone,
      orderDate: date,
      shipmentDate: date,
    };
    if (paymentMethod == "COD") {
      let newOrder = new OrderModel(orderSummery);
      let result = await newOrder.save();
      if (result)
        return res.send(ReturnMessage(false, "Order Successful", result));
      else
        return res.send(
          ReturnMessage(true, "Some Error Happened while Ordering", {})
        );
    } else {
      res.send(ReturnMessage(true, "Welcome to OP", {}));
    }
  } catch (error) {
    res.send(ReturnMessage(true, error.message, {}));
  }
});
OrderRoute.get("/myOrders/:phone", async (req, res) => {
  const phone = req.params.phone;
  try {
    let result = await OrderModel.find({ phone: phone, canceled: false });
    if (result) res.send(ReturnMessage(false, "found items", result));
    else res.send(ReturnMessage(true, "No data found", []));
  } catch (error) {
    console.log(error);
    res.send(ReturnMessage(true, error.message, []));
  }
});
OrderRoute.get("/myOrdersPaid/:phone", async (req, res) => {
  const phone = req.params.phone;
  try {
    let result = await OrderModel.find({ phone: phone, completed: true });
    if (result) res.send(ReturnMessage(false, "found items", result));
    else res.send(ReturnMessage(true, "No data found", []));
  } catch (error) {
    console.log(error);
    res.send(ReturnMessage(true, error.message, []));
  }
});
OrderRoute.get("/ordersById/:id", async (req, res) => {
  const id = req.params.id;
  try {
    let result = await OrderModel.findById(id);
    if (result) res.send(ReturnMessage(false, "found items", result));
    else res.send(ReturnMessage(true, "No data found", {}));
  } catch (error) {
    console.log(error);
    res.send(ReturnMessage(true, error.message, {}));
  }
});
OrderRoute.get("/searchOrders", async (req, res) => {
  try {
    let { phone, status, page = 0 } = req.query;
    let skip = page * 12;
    const expression = new RegExp(phone, "i");
    let result;
    let query = {};
    if (phone) query["phone"] = { $regex: expression };
    if (status) query["orderStatus"] = status;
    result = await OrderModel.find(query).skip(Number(skip)).limit(12);
    const count = await OrderModel.find(query).countDocuments();
    res.send(
      ReturnMessage(false, "data found", { length: count, data: result })
    );
  } catch (error) {
    console.log(error.message);
    res.send(ReturnMessage(false, error.message, []));
  }
});

OrderRoute.put(
  "/updateOrderAdmin",
  JwtVerify,
  AuthorizeUser,
  isAdmin,
  async (req, res) => {
    try {
      let { id, shipmentDate, orderStatus, paid, orderMessage } = req.body;
      let orderUpdate = {
        shipmentDate: shipmentDate,
        orderStatus: orderStatus,
        paid: paid,
        orderMessage: orderMessage,
      };
      let order = await OrderModel.findById(id);
      if (paid >= order.paid) orderUpdate.completed = true;

      const result = await OrderModel.findByIdAndUpdate(id, orderUpdate, {
        new: true,
      });
      if (result)
        return res.send(ReturnMessage(false, "Updated Successful", result));
      res.send(ReturnMessage(true, "Error happened", {}));
    } catch (error) {
      res.send(ReturnMessage(true, error.message, {}));
      console.log(error);
    }
  }
);
OrderRoute.get("/orders", (req, res) => {
  res.send("Welcome to the root of the application");
});
OrderRoute.post("/cancelOrder", JwtVerify, AuthorizeUser, async (req, res) => {
  try {
    const id = req.body.id;
    const phone = req.user.phone;
    const order = await OrderModel.findById(id);

    if (!order) return res.send(ReturnMessage(true, "Order not found", {}));
    if (order.canceled)
      return res.send(ReturnMessage(true, "Order already canceled", {}));
    if (order.orderStatus != "Pending" && order.orderStatus != "Processing")
      return res.send(ReturnMessage(true, "Order can't be canceled", {}));
    if (phone != order?.userPhone)
      return res.send(ReturnMessage(true, "Unauthorized Access", {}));

    const result = await OrderModel.findByIdAndUpdate(id, {
      canceled: true,
      orderStatus: "Canceled",
    });

    if (!result)
      return res.send(ReturnMessage(true, "Order cancel failed", {}));
    res.send(ReturnMessage(false, "Order canceled", {}));
  } catch (error) {
    res.send(ReturnMessage(true, error.message, {}));
  }
});
module.exports = { OrderRoute };
function tokenGenerator() {
  const appKey = process.env.PortPos_AppKey;
  const secretKey = process.env.PortPos_SecretKey;

  if (!appKey || !secretKey) {
    throw new Error(
      "Environment variables 'PortPos_AppKey' and 'PortPos_SecretKey' must be set."
    );
  }

  const timestamp = Math.floor(Date.now() / 1000);
  const hash = crypto
    .createHash("md5")
    .update(secretKey + timestamp)
    .digest("hex");

  const token = `Bearer ${Buffer.from(`${appKey}:${hash}`).toString("base64")}`;
  return token;
}
function orderObjGenerator(
  id,
  amount,
  description,
  name,
  email,
  phone,
  address,
  city
) {
  return {
    order: {
      amount: `${amount}`,
      currency: "BDT",
      redirect_url: "https://raiyantraders.com.bd/paySuccess/" + id,
      ipn_url: "https://raiyantraderscombd.vercel.app/ipn",
    },
    product: {
      name: "Laptop",
      description: `${description}`,
    },
    billing: {
      customer: {
        name: `${name}`,
        email: `${email}`,
        phone: `${phone}`,
        address: {
          street: `${address}`,
          city: `${city}`,
          state: "N/A",
          zipcode: "1212",
          country: "Bangladesh",
        },
      },
    },
  };
}
///   *******  TOKEN GENERATOR  *******  ///
// Const crypto = require('crypto');

// const appKey = process.env.PortPos_AppKey;
// const secretKey = process.env.PortPos_SecretKey;

// if (!appKey || !secretKey) {
//     throw new Error("Environment variables 'PortPos_AppKey' and 'PortPos_SecretKey' must be set.");
// }

// const timestamp = Math.floor(Date.now() / 1000);
// const hash = crypto.createHash('md5').update(secretKey + timestamp).digest('hex');

// const token = `Bearer ${Buffer.from(`${appKey}:${hash}`).toString('base64')}`;

// let orderObj = {
//   order: {
//     amount: "*****",
//     currency: "BDT",
//     redirect_url: "https://yourwebsite.com/paySuccess",
//     ipn_url: "https://yourwebsite.com/ipn",
//   },
//   product: {
//     name: "Laptop",
//     description: "*** all the names of the products",
//   },
//   billing: {
//     customer: {
//       name: "*****",
//       email: "******",
//       phone: "******",
//       address: {
//         street: "*** Address",
//         city: "*******",
//         state: "N/A",
//         zipcode: "1212",
//         country: "Bangladesh",
//       },
//     },
//   },
// };
