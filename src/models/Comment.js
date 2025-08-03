import mongoose from "mongoose";

const replySchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const commentSchema = new mongoose.Schema({
  blogSlug: { type: String, required: true, index: true },
  name: { type: String, required: true },
  email: { type: String },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  replies: [replySchema],
});

export default mongoose.models.Comment ||
  mongoose.model("Comment", commentSchema);
