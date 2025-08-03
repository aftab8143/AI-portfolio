import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import Blog from "@/models/Blog";

export async function POST(request) {
  try {
    const body = await request.json();
    const { title, content } = body;

    if (!title || !content) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    await connectDB();

    const slug = title.toLowerCase().replace(/\s+/g, "-");
    const summary = content.replace(/<[^>]*>?/gm, "").slice(0, 100) + "...";

    const blog = await Blog.create({
      title,
      content,
      summary,
      slug,
      date: new Date().toLocaleDateString(),
    });

    return NextResponse.json({ success: true, blog }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
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
