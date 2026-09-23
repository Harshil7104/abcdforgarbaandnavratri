const mongoose = require('mongoose');

/**
 * Connect to MongoDB Atlas / local MongoDB instance
 */
const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;

    if (!mongoUri) {
      console.error('CRITICAL: MONGO_URI environment variable is not defined.');
      process.exit(1);
    }

    const conn = await mongoose.connect(mongoUri, {
      // Modern mongoose defaults are suitable, autoIndex is useful in dev
      autoIndex: process.env.NODE_ENV !== 'production',
    });

    console.log(`✅ MongoDB Connected successfully: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    // Exit process with failure in production or critical startup failure
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
  }
};

module.exports = connectDB;
