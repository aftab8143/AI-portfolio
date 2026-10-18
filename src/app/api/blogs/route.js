import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import Blog from "@/models/Blog";

// Blog authoring is disabled — there is no auth system wired up yet.
export async function POST() {
  return NextResponse.json({ error: "Not available" }, { status: 403 });
}

export async function GET() {
  try {
    await connectDB();
    const blogs = await Blog.find().sort({ date: -1 });
    return NextResponse.json(blogs, { status: 200 });
  } catch (error) {
    console.error("GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch blogs" },
      { status: 500 }
    );
  }
}
