import User from "../models/User.js";
import Product from "../models/Product.js";
import mongoose from "mongoose";
import cloudinary from "cloudinary";
import { request } from "express";

export const getUser = async (request, response) => {
  try {
    const user = await User.find({})
      .populate({
        path: "cart.productId",
        model: "Product",
      })
      .sort({ createdAt: -1 });
    response
      .status(200)
      .json({ success: true, message: "Users Retrieved.", data: user });
  } catch (error) {
    console.log("Error in fetching Users: ", error.message);
    response.status(500).json({ success: false, message: "Server Error." });
  }
};

export const getOneUser = async (request, response) => {
  try {
    const { id } = request.params;
    const user = await User.findById(id).populate({
      path: "cart.productId",
      model: "Product",
    });
    response
      .status(200)
      .json({ success: true, message: "User Retrieved.", data: user });
  } catch (error) {
    console.log("Error in fetching User: ", error.message);
    response.status(500).json({ success: false, message: "Server Error." });
  }
};

export const createUser = async (request, response) => {
  const user = request.body;

  // let images = []
  // if (typeof request.body.avatar === 'string') {
  //     images.push(request.body.avatar)
  // } else {
  //     images = request.body.avatar
  // }

  // let imagesLinks = [];
  // for (let i = 0; i < images.length; i++) {
  //     try {
  //         const result = await cloudinary.v2.uploader.upload(images[i], {
  //             folder: 'products',
  //             width: 500,
  //             height: 500,
  //             crop: "scale",
  //         });

  //         imagesLinks.push({
  //             public_id: result.public_id,
  //             url: result.secure_url
  //         })

  //     } catch (error) {
  //         console.log("Cant Upload", error)
  //     }
  // }

  // request.body.avatar = imagesLinks

  if (!user.email || !user.password) {
    return response
      .status(400)
      .json({ success: false, message: "Please provide all fields." });
  }

  const newUser = new User(user);

  try {
    await newUser.save();
    response
      .status(201)
      .json({
        success: true,
        data: newUser,
        message: "User created Successfully!",
      });
  } catch (error) {
    console.error("Error in Create User:", error.message);
    response
      .status(500)
      .json({
        success: false,
        message: "Server Error: Error in Creating User.",
      });
  }
};

export const updateUser = async (request, response) => {
  const { id } = request.params;

  let images = [];
  // console.log('before', request.body.avatar)
  if (Array.isArray(request.body.avatar)) {
    if (typeof request.body.avatar[0] === "string") {
      images = request.body.avatar;
      let imagesLinks = [];
      for (let i = 0; i < images.length; i++) {
        try {
          const result = await cloudinary.v2.uploader.upload(images[i], {
            folder: "users",
            width: 500,
            height: 500,
            crop: "scale",
          });

          imagesLinks.push({
            public_id: result.public_id,
            url: result.secure_url,
          });
        } catch (error) {
          console.log("Cant Upload", error);
        }
      }
      request.body.avatar = imagesLinks;
    } else if (typeof request.body.avatar[0] === "object") {
    }
  } else if (typeof request.body.avatar === "string") {
    console.log("detected");
    images.push(request.body.avatar);
  }

  // console.log('after', request.body.avatar)
  const user = request.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return response
      .status(404)
      .json({ success: false, message: "Invalid User ID" });
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(id, user, { new: true });
    response.status(200).json({ success: true, data: updatedUser });
  } catch (error) {
    response
      .status(500)
      .json({
        success: false,
        message: "Server Error: Error in Updating User.",
      });
  }
};

export const deleteUser = async (request, response) => {
  const { id } = request.params;
  try {
    const result = await User.findByIdAndDelete(id);

    if (!result) {
      return response.status(404).send({ message: "User not Found." });
    }

    response.status(200).json({ success: true, message: "User Deleted." });
  } catch (error) {
    response
      .status(500)
      .json({
        success: false,
        message: "Server Error: Error in Deleting User.",
      });
  }
};

export const addToCart = async (req, res) => {
  const { userId } = req.params;
  console.log(userId);
  req.body.color = "Default";
  req.body.size = "Default";
  const { productId, quantity, color, size } = req.body;

  // Validate input fields
  if (!productId || !quantity || !color || !size) {
    return res
      .status(400)
      .json({ message: "Product ID, quantity, color, and size are required." });
  }

  try {
    // Step 1: Find the user
    const user = await User.findOne({ email: userId });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Step 2: Find the product by ID
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }

    // Step 3: Check if the product has the requested stock variation
    const stockItem = product.stock.find(
      (item) => item.color === color && item.size === size
    );

    // Step 5: Add the product to the user's cart
    const existingCartItem = user.cart.find(
      (item) =>
        item.productId.toString() === productId &&
        item.color === color &&
        item.size === size
    );

    const newStockItem = {
      color,
      size,
      quantity, // Add the quantity to the new stock item
    };

    product.stock.push(newStockItem);

    if (existingCartItem) {
      // If item already exists in cart, update quantity
      // existingCartItem.quantity += quantity;
    } else {
      // If item doesn't exist in cart, add it
      user.cart.push({
        productId,
        stockId: newStockItem._id, // Store the stockId in the cart
        quantity,
        color,
        size,
      });
    }

    // Step 6: Save the user's cart
    await user.save();

    // Respond with success
    res
      .status(200)
      .json({
        message: "Product added to cart successfully.",
        cart: user.cart,
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to add product to cart", error });
  }
};

export const addToCheckout = async (req, res) => {
  const { userId } = req.params;
  const { items, status, datePlaced, shippingDetails, promoCode, total_cost } =
    req.body;
  const cartItemIds = items.map((item) => item.cartItemId);

  console.log(req.body);

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    for (let item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res
          .status(404)
          .json({ message: `Product with ID ${item.productId} not found.` });
      }

      const stockItem = product.stock.find(
        (stock) =>
          stock._id.toString() === item.stockId &&
          stock.color === item.color &&
          stock.size === item.size
      );

      await product.save();
    }

    await Promise.all(
      items.map(async (item) => {
        const product = await Product.findById(item.productId);
        await product.save();
      })
    );

    const newOrder = {
      order: {
        items: items.map((item) => ({
          productId: item.productId,
          stockId: item.stockId,
          color: item.color,
          size: item.size,
          quantity: item.quantity,
        })),
        status: status || "Pending",
        datePlaced: datePlaced || new Date(),
        dateShipped: null,
        dateDelivered: null,
        total_cost: total_cost,
        shippingDetails: null,
      },
    };

    user.checkout.push(newOrder);
    user.cart = user.cart.filter(
      (cartItem) => !cartItemIds.includes(cartItem._id.toString())
    );

    await user.save();

    res
      .status(200)
      .json({
        message: "Checkout added successfully.",
        checkout: user.checkout,
      });
  } catch (error) {
    res.status(500).json({ message: "Failed to add to checkout", error });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { userId, orderId, mode } = req.body;

    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Find the order in the checkout array
    // console.log(user.checkout)
    user.checkout.map((order) => {
      if (order._id == orderId) {
        order.order.status = mode;

        // // Save the updated user document
        user.save();
      }
    });

    // console.log(selectOrder)
    // const orderToUpdate = user.checkout.find(
    //     // (checkoutItem) => checkoutItem.order._id.toString() === orderId
    // );

    // if (!orderToUpdate) {
    //     return res.status(404).json({ message: "Order not found." });
    // }

    // // Update the status
    // orderToUpdate.order.status = mode;

    // // Save the updated user document
    // await user.save();

    res.status(200).json({ message: "Order status updated successfully." });
  } catch (error) {
    res.status(500).json({ message: "Failed to update order status.", error });
  }
};
