import mongoose from 'mongoose';

// Cache the connection across serverless function invocations.
// On Vercel each warm invocation reuses the same Node.js module —
// caching avoids exhausting MongoDB Atlas connection limits.
let cached = global._mongoose;

if (!cached) {
  cached = global._mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });
  }

  try {
    cached.conn = await cached.promise;
    console.log(`MongoDB Connected: ${cached.conn.connection.host}`);
  } catch (error) {
    cached.promise = null; // Reset so next invocation retries
    // Throw instead of process.exit — lets the caller/middleware handle it
    throw new Error(`MongoDB connection failed: ${error.message}`);
  }

  return cached.conn;
};

export default connectDB;
