// app/api/blogs/[slug]/route.js
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import Blog from "@/models/Blog";

export async function GET(req, { params }) {
  const { slug: id } = params;

  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
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

// UPDATE a blog by slug
export async function PUT(req, { params }) {
  try {
    const { slug: id } = params;
    const body = await req.json();
    const { title, content } = body;

    if (!title || !content) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    await connectDB();

    const summary = content.replace(/<[^>]*>?/gm, "").slice(0, 100) + "...";
    const updatedSlug = title.toLowerCase().replace(/\s+/g, "-");

    const blog = await Blog.findByIdAndUpdate(
      id,
      {
        title,
        content,
        summary,
        slug: updatedSlug,
        date: new Date().toLocaleDateString(),
      },
      { new: true }
    );

    if (!blog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, blog }, { status: 200 });
  } catch (err) {
    console.error("PUT error:", err);
    return NextResponse.json(
      { error: "Failed to update blog" },
      { status: 500 }
    );
  }
}

// DELETE a blog by slug
export async function DELETE(req, { params }) {
  try {
    const { slug: id } = params;
    await connectDB();

    const deleted = await Blog.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error("DELETE error:", err);
    return NextResponse.json(
      { error: "Failed to delete blog" },
      { status: 500 }
    );
  }
}
