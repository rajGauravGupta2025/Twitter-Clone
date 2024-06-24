// Import the 'dotenv' package to load environment variables from a .env file
const dotenv = require('dotenv');

// Load environment variables from .env file into 'process.env'
dotenv.config();

// Export an object containing configuration variables
module.exports = {
  // MongoDB connection URL retrieved from environment variables
  MONGODB_URL: process.env.MONGODBURL,
  // JWT secret key for token generation and verification
  JWT_STR: 'abcdefghijklmonpqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVW',
};
