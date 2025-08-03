import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import Comment from "@/models/Comment";

// GET: Fetch all comments (with replies) for a blog post
export async function GET(req, { params }) {
  const { slug } = params;
  if (!slug) {
    return NextResponse.json({ error: "Missing slug" }, { status: 400 });
  }
  try {
    await connectDB();
    const comments = await Comment.find({ blogSlug: slug }).sort({
      createdAt: 1,
    });
    return NextResponse.json(comments, { status: 200 });
  } catch (err) {
    console.error("GET comments error:", err);
    return NextResponse.json(
      { error: "Failed to fetch comments" },
      { status: 500 }
    );
  }
}

// POST: Add a comment or reply
export async function POST(req, { params }) {
  const { slug } = params;
  if (!slug) {
    return NextResponse.json({ error: "Missing slug" }, { status: 400 });
  }
  try {
    await connectDB();
    const body = await req.json();
    const { name, email, content, parentId } = body;
    if (!name || !content) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }
    let saved;
    if (parentId) {
      // Add reply to existing comment
      const comment = await Comment.findById(parentId);
      if (!comment) {
        return NextResponse.json(
          { error: "Parent comment not found" },
          { status: 404 }
        );
      }
      const reply = { name, email, content };
      comment.replies.push(reply);
      await comment.save();
      saved = comment;
    } else {
      // Add new top-level comment
      saved = await Comment.create({ blogSlug: slug, name, email, content });
    }
    return NextResponse.json(saved, { status: 201 });
  } catch (err) {
    console.error("POST comment error:", err);
    return NextResponse.json(
      { error: "Failed to add comment" },
      { status: 500 }
    );
  }
}
