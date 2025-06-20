const cron = require('node-cron');
const mongoose = require('mongoose');
const UserModel = require('./usermodel.cjs');

// Run at midnight every day
cron.schedule('0 0 * * *', async () => {
  console.log('Resetting daily ratings...');
  try {
    await UserModel.updateMany(
      {},
      { $set: { dailyRating: 0, dailyRatingsCount: 0 } }
    );
    console.log('Daily ratings reset complete');
  } catch (error) {
    console.error('Error resetting ratings:', error);
  }
});

// Connect to MongoDB
mongoose.connect(process.env.ATLAS_URL)
  .then(() => console.log('Reset scheduler connected to MongoDB'))
  .catch(err => console.error('Connection error:', err));