require('dotenv').config();

const mongoose=require("mongoose")
const cors= require("cors")
const express=require("express")
const multer = require('multer');



const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage });

const app=express()

app.use(cors({
  origin: [
    'https://your-vercel-app.vercel.app', // <-- your Vercel frontend URL
    'http://localhost:3000'               // <-- for local dev
  ],
  credentials: true
}));

app.use(express.json());


app.use('/uploads', express.static('uploads'));

const PostModel =require("./postmodel.cjs");
const UserModel=require("./usermodel.cjs");

console.log("Environment variables loaded:", {
  MONGODB_URI: process.env.MONGODB_URI ? "URI is set" : "URI is not set",
  NODE_ENV: process.env.NODE_ENV
});

const env=process.env.MONGODB_URI;
async function req(){
    try{
     await mongoose.connect(env)
     console.log("Mongoose succesfully connected")


    
    }catch(error){
      console.error("error making connection",error)
      process.exit(1);
    }
}

req();

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: "Internal server error",
    message: err.message 
  });
});

// Add after line 44
app.get("/posts", async (req, res) => {
  try {
    const posts = await PostModel.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

  app.post("/post", upload.single('image'), async (req, res) => {
    try {
        console.log("Received request body:", req.body);
        console.log("Received file:", req.file);

        // Parse JSON fields
        const user = JSON.parse(req.body.user);
        const posts = JSON.parse(req.body.posts);

        if (!user || !Array.isArray(posts) || posts.length === 0) {
            return res.status(400).json({ 
                message: "Request must include a 'user' object and non-empty 'posts' array.",
                received: { user, posts }
            });
        }

        // Handle image upload
        const imagePath = req.file 
            ? `http://localhost:5000/uploads/${req.file.filename}`
            : "https://example.com/default.jpg";

        // Create post documents
        const postDocs = posts.map(post => ({
            postId: post.postId,
            userId: user.uid,
            displayName: user.displayName,
            userphoto: user.photoURL,
            img: imagePath,
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
        console.error("Full error:", error);
        console.error("Request body:", req.body);
        res.status(500).json({ 
            error: error.message,
            details: error.stack
        });
    }
});

app.post("/rate", async (req, res) => {
  const { postId, userId, rating, displayName, email } = req.body;
  
  try {
    // Validate input
    if (!postId || !userId || !rating) {
      return res.status(400).json({ 
        error: "Missing required fields",
        received: { postId, userId, rating }
      });
    }

    // Validate rating (1-10)
    if (rating < 1 || rating > 10) {
      return res.status(400).json({ error: "Rating must be between 1-10" });
    }

// In Mongodb.js, update the rating section with more debugging
const post = await PostModel.findOne({ postId });
console.log("Found post:", post ? {
    postId: post.postId,
    currentRatings: post.ratings,
    averageRating: post.averageRating
} : "Post not found");

if (!post) {
    console.log("Post not found for postId:", postId);
    return res.status(404).json({ error: "Post not found" });
}

// Check if user already rated this post
const existingRating = post.ratings.find(r => r.userId === userId);
console.log("Checking existing rating:", {
    userId,
    existingRating: existingRating ? {
        userId: existingRating.userId,
        rating: existingRating.rating
    } : "No existing rating"
});

if (existingRating) {
    console.log("User already rated this post:", {
        userId,
        postId,
        existingRating: existingRating.rating
    });
    return res.status(400).json({ error: "You already rated this post" });
}

// Add new rating
console.log("Adding new rating:", {
    userId,
    rating,
    postId
});
post.ratings.push({ userId, rating });

// Update average rating
const totalRatings = post.ratings.reduce((sum, r) => sum + r.rating, 0);
const newAverageRating = totalRatings / post.ratings.length;
console.log("Updating average rating:", {
    totalRatings,
    numberOfRatings: post.ratings.length,
    newAverageRating
});
post.averageRating = newAverageRating;

try {
    await post.save();
    console.log("Post saved successfully:", {
        postId: post.postId,
        newAverageRating: post.averageRating,
        totalRatings: post.ratings.length
    });
} catch (saveError) {
    console.error("Error saving post:", {
        error: saveError.message,
        postId,
        userId,
        rating
    });
    throw saveError;
}
    // Update user's daily rating stats
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Find the user who is rating (not the post creator)
    let user = await UserModel.findOne({ uid: userId });
    
    // If user doesn't exist, create them
    if (!user) {
      console.log("Creating new user for rater:", userId);
      user = new UserModel({
        uid: userId,
        displayName: displayName || "Anonymous User",  // Add required field
        email: email || "anonymous@example.com",      // Add required field
        dailyRating: rating,
        dailyRatingsCount: 1,
        lastRatedDate: new Date()
      });
    } else {
      // Reset daily stats if new day
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
    console.error("Error adding rating:", error);
    res.status(500).json({ 
      error: "Internal server error",
      details: error.message
    });
  }
});
// Add this endpoint in Mongodb.js after the other endpoints
app.get("/daily-top", async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    console.log("Fetching top users for date:", today);
    
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
          displayName: 1,  // Changed from username
          photoURL: 1,     // Changed from userphoto
          averageDailyRating: 1,
          ratingsCount: "$dailyRatingsCount"
        }
      }
    ]);

    console.log("Found top users:", topUsers);
    res.json(topUsers);
  } catch (error) {
    console.error("Error fetching top users:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
app.delete('/posts/:postId', async (req, res) => {
  try {
    const { postId } = req.params;
    console.log('Delete request for postId:', postId);
    const found = await PostModel.findOne({ postId });
    console.log('Found in DB:', found);
    const deleted = await PostModel.findOneAndDelete({ postId });
    if (!deleted) {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
const PORT = process.env.PORT || 5000;

// Updapp.deate the server start code
req().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}).catch(error => {
  console.error("Failed to start server:", error);
  process.exit(1);
});