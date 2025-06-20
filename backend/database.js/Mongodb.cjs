require('dotenv').config();
const fs = require('fs');
const mongoose = require('mongoose');
const cors = require('cors');
const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();

// Multer setup (temporary local storage before Cloudinary upload)
const upload = multer({ dest: 'temp/' });

app.use(cors({
  origin: [
    'https://fashionindeploy.vercel.app',
    'http://localhost:3000'
  ],
  credentials: true
}));

app.use(express.json());

const PostModel = require("./postmodel.cjs");
const UserModel = require("./usermodel.cjs");

const env = process.env.MONGODB_URI;
async function req() {
  try {
    await mongoose.connect(env);
  } catch (error) {
    process.exit(1);
  }
}

req();

app.use((err, req, res, next) => {
  res.status(500).json({
    error: "Internal server error",
    message: err.message
  });
});

app.get("/posts", async (req, res) => {
  try {
    const posts = await PostModel.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/post", upload.single('image'), async (req, res) => {
  try {
    const user = JSON.parse(req.body.user);
    const posts = JSON.parse(req.body.posts);

    if (!user || !Array.isArray(posts) || posts.length === 0) {
      return res.status(400).json({
        message: "Request must include a 'user' object and non-empty 'posts' array.",
        received: { user, posts }
      });
    }

    let imageUrl = "https://example.com/default.jpg";
    if (req.file) {
      // Upload to Cloudinary
      const result = await cloudinary.uploader.upload(req.file.path);
      imageUrl = result.secure_url;
      // Delete temporary file
      fs.unlinkSync(req.file.path);
    }

    const postDocs = posts.map(post => ({
      postId: post.postId,
      userId: user.uid,
      displayName: user.displayName,
      userphoto: user.photoURL,
      img: imageUrl,
      caption: post.caption,
      description: post.description,
      tags: post.tags,
      likes: 0,
      ratings: []
    }));

    const insertedPosts = await PostModel.insertMany(postDocs);
    res.status(201).json({
      message: "Data saved successfully",
      data: insertedPosts
    });

  } catch (error) {
    res.status(500).json({
      error: error.message,
      details: error.stack
    });
  }
});

// All other endpoints remain exactly the same
app.post("/rate", async (req, res) => {
  const { postId, userId, rating, displayName, email } = req.body;

  try {
    if (!postId || !userId || !rating) {
      return res.status(400).json({
        error: "Missing required fields",
        received: { postId, userId, rating }
      });
    }

    if (rating < 1 || rating > 10) {
      return res.status(400).json({ error: "Rating must be between 1-10" });
    }

    const post = await PostModel.findOne({ postId });
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    const existingRating = post.ratings.find(r => r.userId === userId);
    if (existingRating) {
      return res.status(400).json({ error: "You already rated this post" });
    }

    post.ratings.push({ userId, rating });
    const totalRatings = post.ratings.reduce((sum, r) => sum + r.rating, 0);
    post.averageRating = totalRatings / post.ratings.length;
    await post.save();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let user = await UserModel.findOne({ uid: userId });
    if (!user) {
      user = new UserModel({
        uid: userId,
        displayName: displayName || "Anonymous User",
        email: email || "anonymous@example.com",
        dailyRating: rating,
        dailyRatingsCount: 1,
        lastRatedDate: new Date()
      });
    } else {
      if (!user.lastRatedDate || user.lastRatedDate < today) {
        user.dailyRating = 0;
        user.dailyRatingsCount = 0;
      }

      user.dailyRating += rating;
      user.dailyRatingsCount += 1;
      user.lastRatedDate = new Date();
    }

    await user.save();

    res.status(200).json({
      message: "Rating added successfully",
      post: {
        postId: post.postId,
        averageRating: post.averageRating,
        ratingsCount: post.ratings.length
      }
    });

  } catch (error) {
    res.status(500).json({
      error: "Internal server error",
      details: error.message
    });
  }
});

app.get("/daily-top", async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const topUsers = await UserModel.aggregate([
      {
        $match: {
          lastRatedDate: { $gte: today },
          dailyRatingsCount: { $gt: 0 }
        }
      },
      {
        $addFields: {
          averageDailyRating: {
            $divide: ["$dailyRating", "$dailyRatingsCount"]
          }
        }
      },
      { $sort: { averageDailyRating: -1 } },
      { $limit: 10 },
      {
        $project: {
          _id: 0,
          displayName: 1,
          photoURL: 1,
          averageDailyRating: 1,
          ratingsCount: "$dailyRatingsCount"
        }
      }
    ]);

    res.json(topUsers);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

app.delete('/posts/:postId', async (req, res) => {
  try {
    const { postId } = req.params;
    const deleted = await PostModel.findOneAndDelete({ postId });
    if (!deleted) {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

const PORT = process.env.PORT || 5000;

req().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}).catch(error => process.exit(1));
