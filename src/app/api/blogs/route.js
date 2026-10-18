import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import Blog from "@/models/Blog";
import { posts } from "@/content/posts";

// Blog authoring is disabled — there is no auth system wired up yet.
export async function POST() {
  return NextResponse.json({ error: "Not available" }, { status: 403 });
}

export async function GET() {
  // Built-in posts always load; database posts are added when MongoDB is configured
  let dbBlogs = [];
  if (process.env.MONGODB_URI) {
    try {
      await connectDB();
      dbBlogs = await Blog.find().sort({ date: -1 }).lean();
    } catch (error) {
      console.error("GET error:", error);
    }
  }
  return NextResponse.json([...posts, ...dbBlogs], { status: 200 });
}
