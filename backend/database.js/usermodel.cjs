const mongoose = require("mongoose");

const providerDataSchema = new mongoose.Schema({
  providerId: { type: String },
  uid: { type: String },
  displayName: { type: String },
  email: { type: String },
  phoneNumber: { type: String, default: null },
  photoURL: { type: String }
}, { _id: false });

const stsTokenManagerSchema = new mongoose.Schema({
  refreshToken: { type: String },
  accessToken: { type: String },
  expirationTime: { type: Number }
}, { _id: false });

const userSchema = new mongoose.Schema({
  uid: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  emailVerified: { type: Boolean, default: false },
  displayName: { type: String, required: true },
  isAnonymous: { type: Boolean, default: false },
  photoURL: { type: String },
  providerData: [providerDataSchema],
  stsTokenManager: stsTokenManagerSchema,
  createdAt: { type: String },
  lastLoginAt: { type: String },
  apiKey: { type: String },
  appName: { type: String },
  totalLikes: { type: Number, default: 0 },
  totalPosts: { type: Number, default: 0 },
  dailyRating: { type: Number, default: 0 },
  dailyRatingsCount: { type: Number, default: 0 },
  lastRatedDate: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
