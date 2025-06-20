const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  postId: { type: String, required: true, unique: true },
  userId: { type: String, required: true },
  displayName: { type: String },
  userphoto: { type: String },
  img: { type: Object, required: true },
  caption: { type: String, required: true },
  description: { type: String, required: true },
  tags: { type: String },
  likes: { type: Number, default: 0 },
  ratings: [{
    userId: { type: String },
    rating: { type: Number, default: 0 }
  }],
  averageRating: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Post", postSchema);