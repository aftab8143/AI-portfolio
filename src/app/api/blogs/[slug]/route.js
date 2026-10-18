// app/api/blogs/[slug]/route.js
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import mongoose from "mongoose";
import Blog from "@/models/Blog";
import { getPost } from "@/content/posts";

export async function GET(req, { params }) {
  const { slug: id } = await params;

  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  const post = getPost(id);
  if (post) return NextResponse.json(post, { status: 200 });

  // Anything else must be a database post id
  if (!process.env.MONGODB_URI || !mongoose.isValidObjectId(id)) {
    return NextResponse.json({ error: "Blog not found" }, { status: 404 });
  }

  try {
    await connectDB();
    const blog = await Blog.findById(id);

    if (!blog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    return NextResponse.json(blog, { status: 200 });
  } catch (error) {
    console.error("Error fetching blog:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// Blog authoring is disabled — there is no auth system wired up yet.
export async function PUT() {
  return NextResponse.json({ error: "Not available" }, { status: 403 });
}

export async function DELETE() {
  return NextResponse.json({ error: "Not available" }, { status: 403 });
}
