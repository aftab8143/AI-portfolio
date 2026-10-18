// lib/mongoose.js
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

export async function connectDB() {
  if (mongoose.connection.readyState === 1) return;

  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI is not set — add it to .env.local and restart the dev server");
  }

  await mongoose.connect(MONGODB_URI, { dbName: "portfolio" });
}
