const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const UserModel = mongoose.model('UserModel'); // Importing the User model
const TweetModel = mongoose.model('TweetModel'); // Importing the Tweet model
const authMiddleware = require('../middleware/authorisation'); // Importing authentication middleware
const uploadImage = require('../imageUpload'); // Importing image upload function
const multer = require('multer'); // Importing multer for handling file uploads
const upload = multer({
  storage: multer.diskStorage({}), // Setting up multer to use disk storage
  limits: { fileSize: 5000000000 }, // Limiting file size to 5GB
});

// Route to get user details by ID
router.get('/user/:id', authMiddleware, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).send('Invalid user ID');
    }
    const user = await UserModel.findById(req.params.id)
      .select('-Password') // Excluding password field
      .populate('Followers', 'Following'); // Populating followers and following fields

    return res.status(200).json(user);
  } catch (error) {
    return res.status(404).send(error);
  }
});

// Route to follow a user
router.put('/user/:id/follow', authMiddleware, async (req, res) => {
  // Finding logged-in user and user to follow
  const loggedInUser = await UserModel.findById(req.user.id);
  const userToFollow = await UserModel.findById(req.params.id);

  // Checking conditions for following
  if (req.params.id == req.user.id) {
    return res.status(400).send('You cannot follow yourself');
  }
  if (!userToFollow) {
    return res.status(404).send('User not found');
  }
  if (loggedInUser.Following.includes(userToFollow._id)) {
    return res.status(400).send('You are already following this user');
  }

  // Updating following list for logged-in user and followers list for user to follow
  await loggedInUser.updateOne({
    $addToSet: { Following: userToFollow.id },
  });

  await userToFollow.updateOne({
    $addToSet: { Followers: loggedInUser.id },
  });

  return res
    .status(200)
    .send(
      `Followed user Successfully with id: ${userToFollow.id} and name: ${userToFollow.Name}`
    );
});

// Route to unfollow a user
router.put('/user/:id/unfollow', authMiddleware, async (req, res) => {
  // Finding logged-in user and user to unfollow
  const loggedInUser = await UserModel.findById(req.user.id);
  const userToUnfollow = await UserModel.findById(req.params.id);

  // Checking conditions for unfollowing
  if (req.params.id == req.user.id) {
    return res.status(400).send('You cannot unfollow yourself');
  }

  if (!userToUnfollow) {
    return res.status(404).send('User not found');
  }

  if (!loggedInUser.Following.includes(userToUnfollow._id)) {
    return res.status(400).send('You are already not following this user');
  }

  // Removing user from following list for logged-in user and followers list for user to unfollow
  await loggedInUser.updateOne({
    $pull: { Following: userToUnfollow.id },
  });

  await userToUnfollow.updateOne({
    $pull: { Followers: loggedInUser.id },
  });

  return res
    .status(200)
    .send(
      `Unfollowed user Successfully with id: ${userToUnfollow.id} and name: ${userToUnfollow.Name}`
    );
});

// Route to update user details
router.put('/user/:id', authMiddleware, async (req, res) => {
  if (req.params.id !== req.user.id) {
    return res.status(400).send("You cannot edit other's details");
  }

  // Extracting updated user details from request body
  const { Name, Location, DateOfBirth } = req.body;
  // Finding and updating user details
  const updatedUser = await UserModel.findByIdAndUpdate(
    req.params.id,
    {
      $set: { Name, Location, DateOfBirth },
    },
    { new: true }
  ).select('-Password');

  await updatedUser.save();
  return res
    .status(200)
    .json({ message: 'User Edited Successfully', result: updatedUser });
});

// Route to get tweets by a user
router.post('/user/:id/tweets', authMiddleware, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).send('User not found');
    }
    // Finding user by ID
    const user = await UserModel.findById(req.params.id);
    // Finding tweets by user
    const tweets = await TweetModel.find({ TweetedBy: user._id });
    return res.status(200).json(tweets);
  } catch (error) {
    console.log(error.message);
    return res.status(404).send(error);
  }
});

// Route to upload user profile picture
router.post(
  '/user/:id/uploadProfilePic',
  authMiddleware,
  upload.single('Profile_Picture'), // Using multer to handle single file upload
  async (req, res) => {
    try {
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(404).send('User not found');
      }
      console.log(req.file); // Logging uploaded file details
      const upload = await uploadImage(req.file.path); // Uploading image
      const user = await UserModel.findById(req.params.id);
      user.Profile_Picture = upload; // Setting profile picture for user
      await user.save(); // Saving user
      return res
        .status(200)
        .json({ user: user, message: 'Uploaded Succesfully' });
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
);

module.exports = router; // Exporting router
