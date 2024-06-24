const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const TweetModel = mongoose.model('TweetModel');
const UserModel = mongoose.model('UserModel');
const authMiddleware = require('../middleware/authorisation'); // Importing authorization middleware
const multer = require('multer');
const uploadImage = require('../imageUpload');

// Multer setup for file upload
const upload = multer({
  storage: multer.diskStorage({}),
});

// Route for creating a new tweet
router.post('/', authMiddleware, upload.single('Image'), async (req, res) => {
  try {
    const { Content } = req.body;
    if (!Content) {
      return res.status(400).json({ message: 'Content is required' });
    }
    const tweet = new TweetModel({
      ...req.body,
      TweetedBy: req.user._id,
    });

    if (req.file && Content) {
      const upload = await uploadImage(req.file.path);
      tweet.Image = upload;
    }
    await tweet.save();
    return res.status(201).json(tweet);
  } catch (error) {
    return res.json(error);
  }
});

// Route for liking a tweet
router.post('/:id/like', authMiddleware, async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: 'Tweet not Found' });
  }

  const tweet = await TweetModel.findById(req.params.id);
  if (!tweet.Likes.includes(req.user._id)) {
    await tweet.updateOne(
      {
        $addToSet: { Likes: req.user._id },
      },
      { new: true }
    );
    return res.status(200).json({ message: 'Liked' });
  }
  return res.status(400).json({ message: 'Already Liked' });
});

// Route for disliking a tweet
router.post('/:id/dislike', authMiddleware, async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: 'Tweet not Found' });
  }
  const tweet = await TweetModel.findById(req.params.id);
  if (tweet.Likes.includes(req.user._id)) {
    await tweet.updateOne(
      {
        $pull: { Likes: req.user._id },
      },
      { new: true }
    );
    return res.status(200).json({ message: 'Disliked' });
  }
  return res.status(400).json({ message: 'Already not liking the tweet' });
});

// Route for getting a single tweet by ID
router.get('/:id', authMiddleware, async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: 'Tweet not Found' });
  }

  const tweet = await TweetModel.findById(req.params.id).populate(
    'TweetedBy',
    'Likes, RetweetBy, Replies'
  );
  return res.status(200).json(tweet);
});

// Route for getting all tweets
router.get('/', authMiddleware, async (req, res) => {
  const tweets = await TweetModel.find()
    .populate('TweetedBy', 'Likes, RetweetBy, Replies')
    .sort({ createdAt: -1 });

  return res.status(200).json(tweets);
});

// Route for getting tweets by a specific user
router.get('/tweets/user/:id', authMiddleware, async (req, res) => {
  const tweets = await TweetModel.find({ TweetedBy: req.params.id })
    .populate('TweetedBy', 'Likes, RetweetBy, Replies')
    .sort({ createdAt: -1 });

  return res.status(200).json(tweets);
});

// Route for deleting a tweet
router.delete('/:id', authMiddleware, async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: 'Tweet not Found' });
  }

  const tweet = await TweetModel.findById(req.params.id);
  if (req.user._id.equals(tweet.TweetedBy)) {
    const mainTweets = await TweetModel.find({ Replies: tweet._id });
    for (const mainTweet of mainTweets) {
      if (mainTweet.Replies.includes(tweet._id)) {
        mainTweet.Replies.pull(tweet._id);
        await mainTweet.save();
      }
    }
    await tweet.deleteOne();
    return res.status(200).json({ message: 'Deleted' });
  } else {
    return res.status(400).json({ message: 'Not Authorized' });
  }
});

// Route for retweeting a tweet
router.post('/:id/retweet', authMiddleware, async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: 'Tweet not Found' });
  }

  const tweet = await TweetModel.findById(req.params.id);
  if (!tweet.RetweetBy.includes(req.user._id)) {
    await tweet.updateOne(
      {
        $addToSet: { RetweetBy: req.user._id },
      },
      { new: true }
    );

    return res
      .status(200)
      .json({ message: 'Successfully Retweeted the tweet' });
  }
  return res.status(400).json({ message: 'Already Retweeted' });
});

// Route for un-retweeting a tweet
router.post('/:id/undort', authMiddleware, async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: 'Tweet not Found' });
  }

  const tweet = await TweetModel.findById(req.params.id);
  if (tweet.RetweetBy.includes(req.user._id)) {
    await tweet.updateOne(
      {
        $pull: { RetweetBy: req.user._id },
      },
      { new: true }
    );

    return res
      .status(200)
      .json({ message: 'Successfully Untweeted the tweet' });
  }

  return res
    .status(400)
    .json({ message: 'You are already not retweeting this' });
});

// Route for replying to a tweet
router.post('/:id/reply', authMiddleware, async (req, res) => {
  const parentTweet = await TweetModel.findById(req.params.id);
  const { Content } = req.body;

  if (!Content) {
    return res.status(400).json({ message: 'Content is required' });
  }

  const tweet = new TweetModel({
    ...req.body,
    TweetedBy: req.user._id,
  });
  await tweet.save();

  await parentTweet.updateOne(
    {
      $addToSet: { Replies: tweet._id },
    },
    { new: true }
  );

  return res
    .status(201)
    .json({ message: `Replied successfully`, reply: tweet });
});

module.exports = router;
