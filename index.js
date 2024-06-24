// Import required modules
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { MONGODB_URL } = require('./config'); // Import MongoDB URL from config file
const app = express();
const path = require('path');
const Port = process.env.PORT || 8000; // Define the port to listen on

// Load environment variables from .env file
const dotenv = require('dotenv');
dotenv.config();

// Middleware setup
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(express.static(path.join(__dirname, '../client/dist'))); // Serve static files from the client's build directory

// Connect to MongoDB
mongoose.connect(process.env.MONGODBURL); // Connect to MongoDB using the URL from environment variables
mongoose.connection.on('connected', () => console.log('DB Connected')); // Log successful connection
mongoose.connection.on('error', (error) => console.log(error)); // Log connection error

// Import and register models
require('./models/user_model'); // Import user model
require('./models/tweet_model'); // Import tweet model

// Register routes
app.use('/API/auth', require('./routes/auth')); // Authentication routes
app.use('/API', require('./routes/user')); // User routes
app.use('/api/tweet', require('./routes/tweet')); // Tweet routes

// Simple route for testing deployment
app.get('/deploy', (req, res) => {
  return res.status(200).send(`<h1>Deployed successfully</h1>`); // Return success message when deployed
});

// Start the server
app.listen(Port, () => console.log(`Server is running at port:  ${Port}`)); // Listen on defined port
