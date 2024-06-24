const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const UserModel = mongoose.model("UserModel");
const { JWT_STR } = require("../config");

// Middleware function to handle authentication
const authMiddleware = async (req, res, next) => {
  try {
    // Extract token from request headers
    const token = req.headers.authorization;
    // If token is not provided, return error
    if (!token) {
      return res.status(401).send("Authentication failed: No token provided");
    }
    // Verify token using JWT_SECRET
    const decodedToken = jwt.verify(token, JWT_STR);
    // Extract user ID from decoded token
    const userId = decodedToken._id;
    // Find user based on user ID
    const user = await UserModel.findById(userId);
    // If user is not found, return error
    if (!user) {
      return res.status(401).send("Authentication failed: Invalid token");
    }
    // Set user object in request for further use
    req.user = user;
    // Call next middleware or route handler
    next();
  } catch (error) {
    // Log any errors
    console.log(error);
    // Return internal server error if any exception occurs
    return res.status(500).send("Internal server error");
  }
};

module.exports = authMiddleware;
