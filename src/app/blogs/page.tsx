"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import axiosInstance from "@/lib/axios";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";

const formatDate = (d?: string) => {
  if (!d) return "-";
  try {
    return new Date(d).toLocaleDateString();
  } catch {
    return "-";
  }
};

const BlogsPage = () => {
  const [loading, setLoading] = useState(true);
  const [blogs, setBlogs] = useState<any[]>([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await axiosInstance.get("/api/getblogs");
        const list = Array.isArray(res?.data?.payload) ? res.data.payload : [];
        setBlogs(list);
      } catch {
        setBlogs([]);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 pt-[18vh] pb-12">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-3xl font-bold mb-6 text-gray-800">Blogs</h1>

          {loading ? (
            <div className="text-gray-500">Loading blogs...</div>
          ) : blogs.length === 0 ? (
            <div className="text-gray-500">No blog posts available.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogs.map((b) => {
                const date = b.publish_date || b.createdAt;
                return (
                  <Link
                    key={b._id}
                    href={`/blogs/${b.slug}`}
                    className="block bg-white rounded-xl shadow hover:shadow-md transition overflow-hidden"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    {b.banner_image ? (
                      <img
                        src={b.banner_image}
                        alt={b.title}
                        className="w-full h-44 object-cover"
                      />
                    ) : (
                      <div className="w-full h-44 bg-gray-200" />
                    )}
                    <div className="p-4 space-y-2">
                      <h2 className="text-lg font-semibold text-gray-900 line-clamp-2">
                        {b.title}
                      </h2>
                      <p className="text-sm text-gray-600 line-clamp-3">
                        {b.short_description || ""}
                      </p>
                      <div className="text-xs text-gray-500 flex items-center gap-2 pt-1">
                        <span>{formatDate(date)}</span>
                        {typeof b.reading_time === "number" && b.reading_time > 0 && (
                          <>
                            <span>•</span>
                            <span>{b.reading_time} min read</span>
                          </>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default BlogsPage;
