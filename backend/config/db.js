import mongoose from 'mongoose';

// Cache the connection across serverless function invocations.
// In a long-running server this is irrelevant, but on Vercel each warm
// invocation reuses the same Node.js module — caching avoids exhausting
// MongoDB Atlas's connection limit.
let cached = global._mongoose;

if (!cached) {
  cached = global._mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(process.env.MONGO_URI, {
        serverSelectionTimeoutMS: 5000,
      })
      .then((mongoose) => mongoose);
  }

  try {
    cached.conn = await cached.promise;
    console.log(`MongoDB Connected: ${cached.conn.connection.host}`);
  } catch (error) {
    cached.promise = null; // Reset so next invocation retries
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }

  return cached.conn;
};

export default connectDB;