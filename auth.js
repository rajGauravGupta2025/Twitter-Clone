const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const UserModel = mongoose.model("UserModel");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { JWT_STR } = require("../config");

// Route for user signup
router.post("/signup", async (req, res) => {
  const {
    Name,
    Username,
    Email,
    Password,
  } = req.body;

  // Check if all required fields are provided
  if (!Name || !Username || !Email || !Password) {
    return res.status(400).json({
      message: "All fields are required",
    });
  }

  // Check if the provided email already exists in the database
  const EmailExists = await UserModel.findOne({ Email: Email });
  if (EmailExists) {
    return res.status(400).json({
      message: "Email already exists",
    });
  }

  // Check if the provided username already exists in the database
  const UsernameExists = await UserModel.findOne({ Username: Username });
  if (UsernameExists) {
    return res.status(400).json({
      message: "Username already exists",
    });
  }

  // Hash the password before saving it to the database
  const salt = bcryptjs.genSaltSync(10);
  const hashedPassword = bcryptjs.hashSync(Password, salt);

  // Create a new user instance with hashed password
  const newUser = new UserModel({ ...req.body, Password: hashedPassword });
  
  // Save the new user to the database
  await newUser
    .save()
    .then((newUser) => {
      // If user is successfully created, generate a JWT token
      const token = jwt.sign({ _id: newUser._id }, JWT_STR);
      res.status(201).json({
        message: "User created successfully",
        data: newUser,
        token: token
      });
    })
    .catch((err) => console.log(err));
});

// Route for user login
router.post("/login", async (req, res) => {
  const { Username, Password } = req.body;
  
  // Check if username and password are provided
  if (!Username || !Password) {
    return res.status(400).json({
      message: "Please fill all fields",
    });
  }

  // Find the user by username in the database
  const user = await UserModel.findOne({ Username: Username });
  if (!user) {
    return res.status(400).json({
      message: "User not found",
    });
  }

  // Compare the provided password with the hashed password stored in the database
  const isMatch = bcryptjs.compareSync(Password, user.Password);
  
  // If passwords match, generate a JWT token for authentication
  if (!isMatch) {
    return res.status(400).json({
      message: "Invalid Password",
    });
  }
  else {
    const token = jwt.sign({ _id: user._id }, JWT_STR);
    res.status(200).json({
      message: "Login Successful",
      token: token,
      user: user,
    });
  }
});

module.exports = router;
