import User from "../../models/User.js";
import mongoose from "mongoose";
import session from "express-session";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import { sendToken } from "../../utils/jwtToken.js";

export const checkUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (e) {
    return res.status(500).json({
      success: false,
      message: "Server Error.",
    });
  }
};

export const loginWithGoogle = async (req, res) => {
  try {
    const { token } = req.body;
    const decodedToken = await admin.auth().verifyIdToken(token);
    const { email, name } = decodedToken;

    let user = await User.findOne({ email });

    if (!user) {
      const [firstName, lastName] = decodedToken.name.split(" ");
      const photoURL = decodedToken.picture || "default_avatar_url";

      user = await User.create({
        email: decodedToken.email,
        name: decodedToken.name,
        password: decodedToken.password,
        first_name: firstName,
        last_name: lastName,
        avatar: [{ public_id: "123", url: photoURL }],
      });

      return sendToken(user, 200, res);
    }

    sendToken(user, 200, res);
  } catch (e) {
    console.log("Error in Google login: ", e.message);
    res.status(500).json({ success: false, message: "Server Error." });
  }
};

export const login = async (req, res) => {
  try {
    const { token } = req.body; // Firebase ID token sent from the client
    console.log(token);
    // Verify the Firebase ID token
    const decodedToken = await admin.auth().verifyIdToken(token);
    const { email } = decodedToken;

    // Check if the user exists in MongoDB
    const user = await User.findOne({ email: email });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Send a session token or proceed with additional login logic
    sendToken(user, 200, res);
  } catch (e) {
    console.log("Error in fetching Users: ", e.message);
    res.status(500).json({ success: false, message: "Server Error." });
  }
};

export const logout = (request, response) => {
  const cookies = request.cookies;
  if (!cookies?.token) return response.sendStatus(204);
  response.clearCookie("token", {
    httpOnly: true,
    sameSite: "None",
    secure: true,
  });
  response.json({ message: "Cookie Cleared." });
};

export const googleAuth = async (req, res) => {
    try {
        const { email, name } = req.body;
    
        const existingUser = await User.findOne({ email });
    
        if (existingUser) {
          sendToken(existingUser, 200, res);
        } else {
          const randomPassword = Math.random().toString(36).slice(-8);
          const hashedPassword = await bcrypt.hash(randomPassword, 10);
    
          const newUser = new User({
            name,
            email,
            password: hashedPassword,
          });

          console.log(req.body)
    
          await newUser.save();
    
          sendToken(newUser, 201, res);
        }
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
      }
    
};
