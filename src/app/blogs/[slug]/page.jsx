"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import hljs from "highlight.js";
import "highlight.js/styles/github-dark.css";

export default function BlogDetailPage() {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [processedContent, setProcessedContent] = useState(null);
  const [replyingTo, setReplyingTo] = useState(null); // comment id being replied to
  const [replyContent, setReplyContent] = useState("");
  const [replyName, setReplyName] = useState("");
  const [replyEmail, setReplyEmail] = useState("");
  const [commentError, setCommentError] = useState("");

  useEffect(() => {
    if (slug) {
      fetch(`/api/blogs/${slug}`)
        .then((res) => res.json())
        .then((data) => {
          if (!data.error) setBlog(data);
          setLoading(false);
        })
        .catch(() => setLoading(false));

      fetch(`/api/blogs/${slug}/comments`)
        .then((res) => res.json())
        .then((data) => {
          if (!data.error) setComments(data);
        });
    }
  }, [slug]);

  useEffect(() => {
    if (!processedContent) return;
    document.querySelectorAll("pre code").forEach((block) => {
      hljs.highlightElement(block);
    });
  }, [processedContent]);

  useEffect(() => {
    if (!blog?.content) return;

    const parser = new DOMParser();
    const doc = parser.parseFromString(blog.content, "text/html");

    doc.querySelectorAll("img").forEach((img) => {
      if (img.parentElement?.classList.contains("img-container")) return;
      // Built-in posts already lay out their images in <figure> elements
      if (img.closest("figure")) return;

      const wrapper = document.createElement("div");
      wrapper.className = "img-container-blog";
      img.replaceWith(wrapper);
      wrapper.appendChild(img);
    });

    setProcessedContent(doc.body.innerHTML);
    hljs.highlightAll();
  }, [blog?.content]);

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/blogs/${slug}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, content: newComment }),
      });
      const data = await response.json().catch(() => ({}));
      if (response.ok) {
        setComments([...comments, data]);
        setNewComment("");
        setName("");
        setEmail("");
        setCommentError("");
      } else {
        setCommentError(data.error || "Couldn't post your comment. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting comment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReply = (commentId) => {
    setReplyingTo(commentId);
    setReplyContent("");
    setReplyName("");
    setReplyEmail("");
  };

  const handleSubmitReply = async (e, parentId) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/blogs/${slug}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: replyName,
          email: replyEmail,
          content: replyContent,
          parentId,
        }),
      });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        setCommentError(data.error || "Couldn't post your reply. Please try again.");
      } else {
        const updated = await response.json();
        setComments((prev) =>
          prev.map((c) => (c._id === updated._id ? updated : c))
        );
        setReplyingTo(null);
        setReplyContent("");
        setReplyName("");
        setReplyEmail("");
        setCommentError("");
      }
    } catch (error) {
      console.error("Error submitting reply:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-12 h-12 border-4 rounded-full animate-spin [border-color:transparent_var(--accent)_var(--accent)_var(--accent)]" />
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="text-center py-20 [color:var(--text-muted)]">
        Blog not found.
        <br />
        <Link href="/blogs" className="[color:var(--accent)] underline">
          ← Back to Blogs
        </Link>
      </div>
    );
  }

  if (!processedContent) return null;

  const words = processedContent.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;
  const readingTime = Math.max(1, Math.round(words / 220));

  return (
    <div className="mx-auto min-h-screen max-w-6xl px-4 pb-16 [color:var(--text-light)]">
      <header className="mx-auto max-w-[760px] pt-8">
        <Link href="/blogs" className="mono text-[12px] uppercase tracking-[0.18em] text-mid hover:text-hi">
          ← All posts
        </Link>
        {blog.tags?.length > 0 && (
          <ul className="mt-8 flex flex-wrap gap-2">
            {blog.tags.map((t) => (
              <li key={t} className="chip on">
                {t}
              </li>
            ))}
          </ul>
        )}
        <h1 className="h2 mt-5 !text-[clamp(34px,4.4vw,56px)] text-hi">{blog.title}</h1>
        {blog.summary && <p className="lead mt-5">{blog.summary}</p>}
        <div className="mt-8 flex items-center gap-3 border-b border-line pb-8">
          <span
            className="grid h-11 w-11 shrink-0 place-items-center rounded-full font-display text-[13px] font-bold text-[var(--on-accent)]"
            style={{ background: "var(--grad)" }}
            aria-hidden="true"
          >
            AA
          </span>
          <div className="text-[14px]">
            <p className="font-semibold text-hi">Aftab Alam</p>
            <p className="text-lo">
              {blog.date} · {readingTime} min read
            </p>
          </div>
        </div>
      </header>

      {blog.cover && (
        <figure className="mx-auto mt-10 max-w-[1000px]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={blog.cover}
            alt={blog.coverAlt || ""}
            className="w-full rounded-2xl border border-line object-cover"
          />
          {blog.coverAlt && (
            <figcaption className="mt-3 text-center text-[14px] text-lo">{blog.coverAlt}</figcaption>
          )}
        </figure>
      )}

      <article
        className="article mx-auto mt-12 max-w-[720px]"
        dangerouslySetInnerHTML={{ __html: processedContent }}
      />

      <div className="mx-auto mb-12 mt-16 flex max-w-[720px] items-center justify-between gap-4 border-t border-line pt-8">
        <Link href="/blogs" className="btn btn-glass">
          ← More posts
        </Link>
        <Link href="/#contact" className="btn btn-primary">
          Work with me →
        </Link>
      </div>

      {/* Comments Section */}
      <div className="mx-auto mb-8 max-w-[720px] rounded-xl border border-[var(--line)] bg-[var(--surface)] p-8 shadow-md [color:var(--text-light)]">
        <h2 className="text-2xl font-bold mb-6">
          Comments ({comments.length})
        </h2>
        {comments.length > 0 ? (
          <div className="space-y-6">
            {comments.map((comment) => (
              <div
                key={comment._id}
                className="border-b border-[var(--line)] pb-6 last:border-0"
              >
                <div className="flex items-center mb-2">
                  <h3 className="font-semibold text-base [color:var(--text-muted)] text-sm">
                    {comment.name}
                  </h3>
                  <span className="[color:var(--text-muted)] text-sm ml-3 text-xs">
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="[color:var(--text-muted)] leading-relaxed text-sm">
                  {comment.content}
                </p>
                <button
                  className="[color:var(--accent)] text-xs mt-2 hover:underline"
                  onClick={() => handleReply(comment._id)}
                >
                  Reply
                </button>
                {/* Replies */}
                {comment.replies && comment.replies.length > 0 && (
                  <div className="ml-6 mt-4 space-y-4">
                    {comment.replies.map((reply, idx) => (
                      <div
                        key={reply._id || idx}
                        className="bg-[var(--surface-hover)] rounded-lg p-3"
                      >
                        <div className="flex items-center mb-1">
                          <span className="font-semibold text-sm [color:var(--text-light)]">
                            {reply.name}
                          </span>
                          <span className="text-xs ml-2 [color:var(--text-muted)]">
                            {new Date(reply.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="[color:var(--text-light)] text-sm">{reply.content}</p>
                      </div>
                    ))}
                  </div>
                )}
                {/* Reply Form */}
                {replyingTo === comment._id && (
                  <form
                    className="mt-4 ml-6 bg-[var(--surface-hover)] rounded-lg p-4 space-y-2"
                    onSubmit={(e) => handleSubmitReply(e, comment._id)}
                  >
                    <div className="flex gap-2">
                      <input
                        type="text"
                        required
                        placeholder="Your name"
                        className="px-2 py-1 rounded bg-[var(--bg-dark)] border border-[var(--line)] text-sm [color:var(--text-light)]"
                        value={replyName}
                        onChange={(e) => setReplyName(e.target.value)}
                      />
                      <input
                        type="email"
                        required
                        placeholder="your@email.com"
                        className="px-2 py-1 rounded bg-[var(--bg-dark)] border border-[var(--line)] text-sm [color:var(--text-light)]"
                        value={replyEmail}
                        onChange={(e) => setReplyEmail(e.target.value)}
                      />
                    </div>
                    <textarea
                      required
                      rows="2"
                      placeholder="Your reply..."
                      className="w-full px-2 py-1 rounded bg-[var(--bg-dark)] border border-[var(--line)] text-sm [color:var(--text-light)]"
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                    />
                    <div className="flex gap-2">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-3 py-1 rounded font-bold text-sm disabled:opacity-60 text-white [background:var(--accent)] hover:[background:var(--btn-hover)]"
                      >
                        {isSubmitting ? "Replying..." : "Post Reply"}
                      </button>
                      <button
                        type="button"
                        className="[color:var(--text-muted)] text-sm"
                        onClick={() => setReplyingTo(null)}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="italic [color:var(--text-muted)]">
            No comments yet. Be the first to comment!
          </p>
        )}
      </div>

      {/* Comment Form */}
      <div className="mx-auto max-w-[720px] rounded-xl border border-[var(--line)] bg-[var(--surface)] p-8 shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-[var(--accent)]">
          Join the Discussion
        </h2>
        {commentError && (
          <p role="alert" className="mb-4 rounded-lg border border-[#ff6b81]/40 bg-[#ff6b81]/10 px-4 py-3 text-sm [color:var(--text-light)]">
            {commentError}
          </p>
        )}
        <form onSubmit={handleSubmitComment} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium mb-1 [color:var(--text-muted)]"
              >
                Name*
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 bg-[var(--bg-dark)] border border-[var(--line)] rounded-lg focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent placeholder:text-[var(--text-muted)] [color:var(--text-light)]"
                required
                placeholder="Your name"
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium mb-1 [color:var(--text-muted)]"
              >
                Email* (private)
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 bg-[var(--bg-dark)] border border-[var(--line)] rounded-lg focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent placeholder:text-[var(--text-muted)] [color:var(--text-light)]"
                required
                placeholder="your@email.com"
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="comment"
              className="block text-sm font-medium mb-1 [color:var(--text-muted)]"
            >
              Your Thoughts*
            </label>
            <textarea
              id="comment"
              rows="4"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="w-full px-4 py-2 bg-[var(--bg-dark)] border border-[var(--line)] rounded-lg focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent placeholder:text-[var(--text-muted)] [color:var(--text-light)]"
              required
              placeholder="Share your insights..."
            ></textarea>
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-3 bg-[var(--accent)] text-white font-bold rounded-lg hover:bg-[var(--btn-hover)] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--accent)] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <svg
                  className="animate-spin h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Launching...
              </>
            ) : (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
                Post Comment
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
