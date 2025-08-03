// lib/mongoose.js
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

export async function connectDB() {
  if (mongoose.connection.readyState === 1) return;

 const connection = await mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: "portfolio",
  });
  console.log("connectionnnnnnnnnnnnnnnnnnnnnnnnn",connection)
}
