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
      if (response.ok) {
        const data = await response.json();
        setComments([...comments, data]);
        setNewComment("");
        setName("");
        setEmail("");
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
      if (response.ok) {
        const updated = await response.json();
        setComments((prev) =>
          prev.map((c) => (c._id === updated._id ? updated : c))
        );
        setReplyingTo(null);
        setReplyContent("");
        setReplyName("");
        setReplyEmail("");
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
        <div className="w-12 h-12 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!processedContent) return null;

  if (!blog) {
    return (
      <div className="text-center py-20 text-slate-300">
        Blog not found.
        <br />
        <Link href="/blogs" className="text-cyan-400 underline">
          ← Back to Blogs
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-10 max-w-6xl mx-auto text-white">
      <div className="mt-10">
        <Link href="/blogs" className="text-cyan-400 underline">
          ← Back to Blogs
        </Link>
      </div>
      <h1 className="text-4xl font-bold mb-2">{blog.title}</h1>
      <p className="text-sm text-slate-400 mb-6">{blog.date}</p>

      <div className="bg-white text-black rounded-xl p-4 pt-1 shadow-md mb-8">
        <article
          className="prose max-w-none
            prose-pre:p-1 prose-pre:bg-slate-900 prose-pre:rounded prose-pre:my-1
            prose-pre:overflow-x-auto prose-pre:whitespace-pre-wrap
            prose-code:before:content-none prose-code:after:content-none
            prose-code:text-sm prose-code:font-mono prose-code:leading-tight
            prose-a:text-blue-600 
            prose-table:border prose-table:border-collapse prose-table:w-full
            prose-th:border prose-th:px-4 prose-th:py-2 prose-th:bg-gray-100
            prose-td:border prose-td:px-4 prose-td:py-2
            [&_p]:mb-3 [&_pre_code]:whitespace-pre-wrap [&_pre_code]:break-all"
          dangerouslySetInnerHTML={{ __html: processedContent }}
        />
      </div>

      {/* Comments Section */}
      <div className="bg-slate-800 text-gray-100 rounded-xl p-8 shadow-md mb-8">
        <h2 className="text-2xl font-bold mb-6">
          Comments ({comments.length})
        </h2>
        {comments.length > 0 ? (
          <div className="space-y-6">
            {comments.map((comment) => (
              <div
                key={comment._id}
                className="border-b border-gray-300 pb-6 last:border-0"
              >
                <div className="flex items-center mb-2">
                  <h3 className="font-semibold text-base text-gray-300 text-sm">
                    {comment.name}
                  </h3>
                  <span className="text-gray-300 text-sm ml-3 text-xs">
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-gray-300 leading-relaxed text-sm">
                  {comment.content}
                </p>
                <button
                  className="text-cyan-400 text-xs mt-2 hover:underline"
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
                        className="bg-slate-700 rounded-lg p-3"
                      >
                        <div className="flex items-center mb-1">
                          <span className="font-semibold text-sm text-gray-200">
                            {reply.name}
                          </span>
                          <span className="text-gray-400 text-xs ml-2">
                            {new Date(reply.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-gray-200 text-sm">{reply.content}</p>
                      </div>
                    ))}
                  </div>
                )}
                {/* Reply Form */}
                {replyingTo === comment._id && (
                  <form
                    className="mt-4 ml-6 bg-slate-700 rounded-lg p-4 space-y-2"
                    onSubmit={(e) => handleSubmitReply(e, comment._id)}
                  >
                    <div className="flex gap-2">
                      <input
                        type="text"
                        required
                        placeholder="Your name"
                        className="px-2 py-1 rounded bg-slate-800 text-white border border-slate-600 text-sm"
                        value={replyName}
                        onChange={(e) => setReplyName(e.target.value)}
                      />
                      <input
                        type="email"
                        required
                        placeholder="your@email.com"
                        className="px-2 py-1 rounded bg-slate-800 text-white border border-slate-600 text-sm"
                        value={replyEmail}
                        onChange={(e) => setReplyEmail(e.target.value)}
                      />
                    </div>
                    <textarea
                      required
                      rows="2"
                      placeholder="Your reply..."
                      className="w-full px-2 py-1 rounded bg-slate-800 text-white border border-slate-600 text-sm"
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                    />
                    <div className="flex gap-2">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-cyan-400 text-slate-900 px-3 py-1 rounded font-bold text-sm hover:bg-cyan-300 disabled:opacity-60"
                      >
                        {isSubmitting ? "Replying..." : "Post Reply"}
                      </button>
                      <button
                        type="button"
                        className="text-gray-300 text-sm"
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
          <p className="text-gray-100 italic">
            No comments yet. Be the first to comment!
          </p>
        )}
      </div>

      {/* Comment Form */}
      <div className="bg-slate-800 rounded-xl p-8 shadow-lg border border-slate-700">
        <h2 className="text-2xl font-bold mb-6 text-[var(--accent)]">
          Join the Discussion
        </h2>
        <form onSubmit={handleSubmitComment} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-slate-300 mb-1"
              >
                Name*
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 bg-slate-900 text-slate-100 border border-slate-700 rounded-lg focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent placeholder-slate-500"
                required
                placeholder="Your name"
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-slate-300 mb-1"
              >
                Email* (private)
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 bg-slate-900 text-slate-100 border border-slate-700 rounded-lg focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent placeholder-slate-500"
                required
                placeholder="your@email.com"
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="comment"
              className="block text-sm font-medium text-slate-300 mb-1"
            >
              Your Thoughts*
            </label>
            <textarea
              id="comment"
              rows="4"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="w-full px-4 py-2 bg-slate-900 text-slate-100 border border-slate-700 rounded-lg focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent placeholder-slate-500"
              required
              placeholder="Share your insights..."
            ></textarea>
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-3 bg-[var(--accent)] text-slate-900 font-bold rounded-lg hover:bg-[var(--btn-hover)] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--accent)] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
