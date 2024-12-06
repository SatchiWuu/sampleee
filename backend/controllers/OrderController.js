import Order from "../models/Order.js";
// const Order = require('../models/Order')
// import Order from "../models/newOrders";
import User from '../models/User.js'

export const newOrder = async (req, res) => {
  try {
    const order = await Order.create(req.body);
    await User.updateMany({}, { $set: { cart: [] } });
    console.log(order);
    res.status(200).json(order);
  } catch (e) {
    console.log(e);
  }
};
