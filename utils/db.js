import mongoose from 'mongoose';

const { MONGODB_URI } = process.env;

if (!MONGODB_URI) {
  console.warn('MONGODB_URI is not set. Set it before deploying.');
}

let cached = global._mongooseCached;

if (!cached) {
  cached = global._mongooseCached = { conn: null, promise: null };
}

export async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const uri = MONGODB_URI;

    if (!uri) {
      throw new Error('MONGODB_URI environment variable is required');
    }

    cached.promise = mongoose
      .connect(uri, {
        maxPoolSize: 1
      })
      .then((mongooseInstance) => mongooseInstance);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

