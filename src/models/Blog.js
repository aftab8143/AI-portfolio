// models/Blog.js
import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  summary: String,
  slug: String,
  date: String,
});

export default mongoose.models.Blog || mongoose.model("Blog", blogSchema);
