import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import mongoose from "mongoose";
import Comment from "@/models/Comment";
import Blog from "@/models/Blog";
import { getPost } from "@/content/posts";
import { notify, isEmail, clean } from "@/lib/notify";
import { rateLimit, clientIp, tooManyRequests, MINUTE, DAY } from "@/lib/rateLimit";
import { guardWrite, underCapacity } from "@/lib/guard";

// Ceilings nobody legitimately reaches on a portfolio blog
const MAX_COMMENTS = 10000;
const MAX_REPLIES_PER_COMMENT = 100;

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "";

// Commenter emails are private: never send them to the browser
const hideEmails = (doc) => {
  const c = doc.toObject ? doc.toObject() : doc;
  delete c.email;
  delete c.ipHash;
  c.replies = (c.replies || []).map(({ email, ipHash, ...r }) => r);
  return c;
};

// GET: Fetch all comments (with replies) for a blog post
export async function GET(req, { params }) {
  const { slug } = await params;
  // Comments need MongoDB; without it there are simply none yet
  if (!process.env.MONGODB_URI) return NextResponse.json([], { status: 200 });
  if (!slug) {
    return NextResponse.json({ error: "Missing slug" }, { status: 400 });
  }
  try {
    await connectDB();
    const comments = await Comment.find({ blogSlug: slug }).sort({
      createdAt: 1,
    });
    return NextResponse.json(comments.map(hideEmails), { status: 200 });
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
  const { slug } = await params;
  if (!process.env.MONGODB_URI) {
    return NextResponse.json({ error: "Comments are not available yet" }, { status: 503 });
  }
  if (!slug) {
    return NextResponse.json({ error: "Missing slug" }, { status: 400 });
  }

  // Per visitor: 5 comments per 10 minutes, 20 per day
  const ip = clientIp(req);
  const perIp = rateLimit(`comment:${ip}`, [
    { limit: 5, windowMs: 10 * MINUTE },
    { limit: 20, windowMs: DAY },
  ]);
  if (!perIp.ok) return tooManyRequests(perIp.retryAfter);

  try {
    let body;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    // Honeypot: real users never see or fill this field
    if (clean(body.website, 200)) return NextResponse.json({ ok: true }, { status: 201 });

    const name = clean(body.name, 80);
    const email = clean(body.email, 254);
    const content = clean(body.content, 2000);
    const parentId = clean(body.parentId, 40);
    if (!name || !content || (email && !isEmail(email))) {
      return NextResponse.json({ error: "Please add your name, a valid email and a comment." }, { status: 400 });
    }

    await connectDB();

    // Only real posts can be commented on (built-in posts or database posts)
    const postExists =
      getPost(slug) || (mongoose.isValidObjectId(slug) && (await Blog.exists({ _id: slug })));
    if (!postExists) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Shared (database) limits: per visitor, repeats, and a daily site-wide cap
    const guard = await guardWrite(parentId ? "reply" : "comment", ip, slug + content);
    if (!guard.ok) {
      return NextResponse.json(
        { error: guard.error },
        { status: guard.status, headers: guard.retryAfter ? { "Retry-After": String(guard.retryAfter) } : {} }
      );
    }

    let saved;
    if (parentId) {
      // Add reply to existing comment
      if (!mongoose.isValidObjectId(parentId)) {
        return NextResponse.json({ error: "Parent comment not found" }, { status: 404 });
      }
      const comment = await Comment.findOne({ _id: parentId, blogSlug: slug });
      if (!comment) {
        return NextResponse.json(
          { error: "Parent comment not found" },
          { status: 404 }
        );
      }
      if (comment.replies.length >= MAX_REPLIES_PER_COMMENT) {
        return NextResponse.json({ error: "This thread is full." }, { status: 409 });
      }
      comment.replies.push({ name, email, content, ipHash: guard.ipHash });
      await comment.save();
      saved = comment;
    } else {
      // Add new top-level comment
      if (!(await underCapacity(Comment, MAX_COMMENTS))) {
        return NextResponse.json({ error: "Comments are closed for now." }, { status: 503 });
      }
      saved = await Comment.create({ blogSlug: slug, name, email, content, ipHash: guard.ipHash });
    }

    // Email me about it; a failed email must never lose the comment.
    // Notifications are capped per day so a flood can't burn the email quota.
    if (rateLimit("comment-notify:all", [{ limit: 50, windowMs: DAY }]).ok) {
      const postTitle = getPost(slug)?.title || slug;
      // Awaited: serverless functions may stop once the response is sent
      await notify({
        subject: `${parentId ? "New reply" : "New comment"} on "${postTitle}"`,
        title: parentId ? "New reply on your blog" : "New comment on your blog",
        rows: [
          ["Post", postTitle],
          ["From", name],
          ["Email", email],
          ["Link", SITE ? `${SITE}/blogs/${slug}` : `/blogs/${slug}`],
        ],
        body: content,
        replyTo: email || undefined,
      }).catch((err) => console.error("Comment notification failed:", err));
    }

    return NextResponse.json(hideEmails(saved), { status: 201 });
  } catch (err) {
    console.error("POST comment error:", err);
    return NextResponse.json(
      { error: "Failed to add comment" },
      { status: 500 }
    );
  }
}
