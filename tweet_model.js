// Importing mongoose library
const mongoose = require("mongoose");

// Destructuring Schema from mongoose
const { Schema } = mongoose;

// Creating a new mongoose schema for tweets
const tweetSchema = new mongoose.Schema(
  {
    // Content of the tweet, required field
    Content: {
      type: String,
      required: true,
    },
    // ID of the user who tweeted, referencing UserModel
    TweetedBy: {
      type: Schema.Types.ObjectId,
      ref: "UserModel",
    },
    // Array of user IDs who liked the tweet, referencing UserModel
    Likes: [
      {
        type: Schema.Types.ObjectId,
        ref: "UserModel",
        default: [], // Default value of an empty array
      },
    ],
    // Array of user IDs who retweeted the tweet, referencing UserModel
    RetweetBy: [
      {
        type: Schema.Types.ObjectId,
        ref: "UserModel",
        default: [], // Default value of an empty array
      },
    ],
    // URL of the image attached to the tweet
    Image: {
      type: String,
    },
    // Array of tweet IDs which are replies to this tweet, referencing TweetModel
    Replies: [
      {
        type: Schema.Types.ObjectId,
        ref: "TweetModel",
        default: [], // Default value of an empty array
      },
    ],
  },
  { timestamps: true } // Adding timestamps to keep track of creation and update time
);

// Exporting the mongoose model for the tweet schema
module.exports = mongoose.model("TweetModel", tweetSchema);
