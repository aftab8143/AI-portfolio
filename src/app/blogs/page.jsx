// pages/blogs/page.jsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import LoginModal from "../components/Modals/LoginModal";
import { Trash, FilePenLineIcon, Send, Share2 } from "lucide-react"; // replace FiLinkedin with Lucide icons

const TiptapEditor = dynamic(() => import("../components/Editor"), {
  ssr: false,
});

export default function MyBlogsPage() {
  const [blogs, setBlogs] = useState([]);
  const [showEditor, setShowEditor] = useState(false);
  const [form, setForm] = useState({ title: "", content: "" });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";
    if (loggedIn) setIsLoggedIn(true);
    else setShowLogin(true);

    fetch("/api/blogs")
      .then((res) => res.json())
      .then((data) => {
        setBlogs(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load blogs", err);
        setLoading(false);
      });
  }, []);

  const handlePost = async () => {
    try {
      // Find by title, but use _id for update
      const existing = blogs.find((b) => b.title === form.title);
      const isEdit = !!existing;
      const method = isEdit ? "PUT" : "POST";
      const url = isEdit ? `/api/blogs/${existing._id}` : "/api/blogs";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        const updatedList = isEdit
          ? blogs.map((b) => (b._id === data.blog._id ? data.blog : b))
          : [data.blog, ...blogs];
        setBlogs(updatedList);
        setForm({ title: "", content: "" });
        setShowEditor(false);
      } else {
        alert(data.error || "Something went wrong");
      }
    } catch (err) {
      console.error(err);
      alert("Network error");
    }
  };

  return (
    <div className="min-h-screen text-white py-16 px-6">
      {showLogin && (
        <LoginModal
          onClose={() => setShowLogin(false)}
          onSuccess={() => {
            setIsLoggedIn(true);
            setShowLogin(false);
            setShowEditor(true);
          }}
        />
      )}
      <div className="max-w-4xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-emerald-500 bg-clip-text text-transparent">
          My Blogs
        </h1>
        <p className="text-base text-slate-400">
          Thoughts, tutorials, and technical deep dives from my journey.
        </p>
        {!showEditor && (
          <div className="mt-4 flex justify-center">
            <button
              onClick={() => {
                if (!isLoggedIn) {
                  setShowLogin(true);
                } else {
                  setShowEditor(!showEditor);
                }
              }}
              className="flex items-center gap-2 text-sm bg-cyan-600 hover:bg-cyan-500 px-5 py-2 rounded-full font-medium transition shadow"
            >
              <img
                src="/images/writing.png"
                alt="Write Icon"
                width={20}
                height={20}
                loading="lazy"
                className="w-5 h-5 filter brightness-0 invert"
              />
              "Write a blog"
            </button>
          </div>
        )}
      </div>
      {showEditor && (
        <motion.div
          className="bg-slate-800 p-6 rounded-xl max-w-4xl mx-auto mb-10"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <input
            placeholder="Blog Title"
            className="w-full mb-4 p-2 bg-slate-700 text-white rounded"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />

          <div className="h-[60vh] mb-6">
            <TiptapEditor
              immediatelyRender={false}
              value={form.content}
              onChange={(val) => setForm({ ...form, content: val })}
              onClose={() => setShowEditor(false)}
            ></TiptapEditor>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={() => {
                const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
                  `https://yourdomain.com/blogs/${form.title
                    .toLowerCase()
                    .replace(/\s+/g, "-")}`
                )}`;
                window.open(url, "_blank");
              }}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-100 bg-blue-600 hover:bg-blue-500 transition rounded-full shadow-md"
            >
              <Share2 size={16} /> Share
            </button>

            <button
              onClick={handlePost}
              className="flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-emerald-500 hover:bg-emerald-400 transition rounded-full shadow-md"
            >
              <Send size={16} /> Publish
            </button>
          </div>
        </motion.div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="w-8 h-8 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {blogs.map((blog) => {
            const imgMatch = blog.content.match(/<img[^>]+src="([^">]+)"/);
            const imageUrl = imgMatch?.[1];

            return (
              <div
                key={blog._id}
                className="relative bg-white/5 border border-white/10 rounded-xl p-6 hover:border-cyan-400 transition duration-300 shadow-md backdrop-blur-sm group"
              >
                <Link href={`/blogs/${blog._id}`}>
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
                          "text-sm text-slate-400 italic mb-4 mt-1";
                        e.target.parentNode.insertBefore(
                          fallback,
                          e.target.nextSibling
                        );
                      }}
                    />
                  ) : (
                    <div className="w-full h-30 object-cover text-sm text-slate-400 italic mb-4 mt-1">
                      No preview available
                    </div>
                  )}

                  <h2 className="text-lg font-semibold mb-2 group-hover:text-cyan-400 transition">
                    {blog.title}
                  </h2>
                  <p className="text-sm text-slate-400 mb-1">{blog.date}</p>
                  <p className="text-sm text-slate-300 line-clamp-2">
                    {blog.summary}
                  </p>
                </Link>

                {isLoggedIn && (
                  <div className="absolute top-2 right-2 flex gap-2">
                    <FilePenLineIcon
                      title="Edit Blog"
                      size={16}
                      onClick={() => {
                        setForm({ title: blog.title, content: blog.content });
                        setShowEditor(true);
                      }}
                      className="text-sm text-white-400 hover:text-blue-300"
                    ></FilePenLineIcon>
                    <Trash
                      title="Delete Blog"
                      size={16}
                      onClick={async () => {
                        const confirmed = confirm(
                          "Are you sure you want to delete this blog?"
                        );
                        if (confirmed) {
                          await fetch(`/api/blogs/${blog._id}`, {
                            method: "DELETE",
                          });
                          setBlogs(blogs.filter((b) => b._id !== blog._id));
                        }
                      }}
                      className="text-sm text-red-400 hover:text-red-300"
                    ></Trash>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
