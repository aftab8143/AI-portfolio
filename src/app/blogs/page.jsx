// pages/blogs/page.jsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function MyBlogsPage() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/blogs")
      .then((res) => res.json())
      .then((data) => {
        // The API returns { error } on failure; only keep a real list
        setBlogs(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load blogs", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen py-16 px-6 [color:var(--text-light)]">
      <div className="max-w-4xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">My Blogs</h1>
        <p className="text-base" style={{ color: "var(--text-muted)" }}>
          Thoughts, tutorials, and technical deep dives from my journey.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div
            className="w-8 h-8 border-4 border-t-transparent rounded-full animate-spin"
            style={{ borderColor: "var(--accent) transparent transparent transparent" }}
          ></div>
        </div>
      ) : (
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {blogs.map((blog) => {
            const imgMatch = blog.content.match(/<img[^>]+src="([^">]+)"/);
            const imageUrl = imgMatch?.[1];

            return (
              <Link
                key={blog._id}
                href={`/blogs/${blog._id}`}
                className="project-card p-6 group"
              >
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={blog.title}
                    className="w-full h-30 object-cover rounded-md mb-4 mt-1"
                    onError={(e) => {
                      e.target.style.display = "none";
                      const fallback = document.createElement("div");
                      fallback.textContent = "No preview available";
                      fallback.className =
                        "text-sm italic mb-4 mt-1 [color:var(--text-muted)]";
                      e.target.parentNode.insertBefore(
                        fallback,
                        e.target.nextSibling
                      );
                    }}
                  />
                ) : (
                  <div
                    className="w-full h-30 object-cover text-sm italic mb-4 mt-1"
                    style={{ color: "var(--text-muted)" }}
                  >
                    No preview available
                  </div>
                )}

                <h2 className="text-lg font-semibold mb-2 transition group-hover:[color:var(--accent)]">
                  {blog.title}
                </h2>
                <p className="text-sm mb-1" style={{ color: "var(--text-muted)" }}>
                  {blog.date}
                </p>
                <p className="text-sm line-clamp-2" style={{ color: "var(--text-muted)" }}>
                  {blog.summary}
                </p>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
