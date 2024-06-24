const mongoose = require("mongoose"); // Importing mongoose library
const { Schema } = mongoose; // Destructuring Schema from mongoose

// Defining the schema for the user model
const userSchema = new mongoose.Schema(
  {
    // Name of the user
    Name: {
      type: String,
      required: true, // Name is required
    },
    // Username of the user
    Username: {
      type: String,
      required: true, // Username is required
      unique: true, // Username must be unique
    },
    // Email of the user
    Email: {
      type: String,
      required: true, // Email is required
      unique: true, // Email must be unique
    },
    // Password of the user
    Password: {
      type: String,
      required: true, // Password is required
    },
    // Profile picture of the user
    Profile_Picture: {
      type: String,
      default: "https://1fid.com/wp-content/uploads/2022/06/no-profile-picture-4-1024x1024.jpg", // Default profile picture URL
    },
    // Location of the user
    Location: {
      type: String, // Location is optional
    },
    // Date of birth of the user
    DateOfBirth: {
      type: Date,
      default: new Date("2000-05-30T00:00:00.000+00:00"), // Default date of birth
    },
    // Array of followers (references to other users)
    Followers: [
      {
        type: Schema.Types.ObjectId,
        default: [], // Default empty array
        required: true, // Followers are required
        ref: "UserModel", // Referencing UserModel
      },
    ],
    // Array of users being followed by this user (references to other users)
    Following: [
      {
        type: Schema.Types.ObjectId,
        default: [], // Default empty array
        required: true, // Following users is required
        ref: "UserModel", // Referencing UserModel
      },
    ],
  },
  { timestamps: true } // Adding timestamps to track creation and update times
);

module.exports = mongoose.model("UserModel", userSchema); // Exporting the user model
