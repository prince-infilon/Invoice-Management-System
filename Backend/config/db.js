const mongoose = require("mongoose");

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || process.env.MONGO_URI;
  const dbName = process.env.MONGODB_DB || "InvoiceDB";

  const tryConnect = async (u) => {
    if (!u || typeof u !== 'string') throw new Error('Missing MongoDB URI');
    const conn = await mongoose.connect(u);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  };

  if (uri) {
    try {
      await tryConnect(uri);
      return true;
    } catch (err) {
      console.error('Primary MongoDb Connection Error:', err.message);
    }
  } else {
    console.warn('MONGODB_URI not set; attempting local fallback.');
  }

  // Local fallback for development
  const localUri = process.env.MONGODB_LOCAL_URI || `mongodb://127.0.0.1:27017/${dbName}`;
  try {
    await tryConnect(localUri);
    return true;
  } catch (err) {
    console.error('Local MongoDb Connection Error:', err.message);
  }

  console.error('All MongoDB connection attempts failed. Continuing without DB connection.');
  return false;
};

module.exports = connectDB;
