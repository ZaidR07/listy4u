"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axiosInstance from "@/lib/axios";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";

const formatDateTime = (d?: string) => {
  if (!d) return "-";
  try {
    const date = new Date(d);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  } catch {
    return "-";
  }
};

const capitalizeFirstLetter = (text?: string) => {
  if (!text) return "";
  const trimmed = text.trimStart();
  if (!trimmed) return "";
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
};

const getVideoEmbedUrl = (url?: string) => {
  if (!url) return "";
  try {
    const u = new URL(url);
    const host = u.hostname.toLowerCase();

    if (host.includes("youtube.com")) {
      const v = u.searchParams.get("v");
      if (v) return `https://www.youtube.com/embed/${v}`;
      if (u.pathname.startsWith("/embed/")) return url;
    }

    if (host === "youtu.be") {
      const id = u.pathname.replace("/", "");
      if (id) return `https://www.youtube.com/embed/${id}`;
    }

    return url;
  } catch {
    return url;
  }
};

interface Section {
  subheading?: string;
  paragraphs?: string[];
}

const BlogDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const slug = Array.isArray(params?.slug) ? params?.slug[0] : (params?.slug as string);

  const [loading, setLoading] = useState(true);
  const [blog, setBlog] = useState<any>(null);

  useEffect(() => {
    if (!slug) return;
    const fetchBlog = async () => {
      try {
        const res = await axiosInstance.get("/api/getsingleblog", { params: { slug } });
        setBlog(res?.data?.payload || null);
      } catch {
        setBlog(null);
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [slug]);
  const published = blog?.publish_date || blog?.createdAt;
  const sections: Section[] = Array.isArray(blog?.sections) ? blog.sections : [];

  let content;
  if (loading) {
    content = (
      <div className="min-h-screen bg-gray-50 pt-[12vh]">
        <div className="max-w-4xl mx-auto px-4 py-8 text-gray-500">Loading...</div>
      </div>
    );
  } else if (!blog) {
    content = (
      <div className="min-h-screen bg-gray-50 pt-[12vh]">
        <div className="max-w-7xl mx-auto px-4 py-8 text-gray-500">
          Blog not found.
          <button className="ml-3 underline" onClick={() => router.push("/blogs")}>
            Back to blogs
          </button>
        </div>
      </div>
    );
  } else {
    const videoEmbedUrl = getVideoEmbedUrl(blog.video_url);
    content = (
      <div className="min-h-screen bg-gray-50 pt-[12vh] pb-12">
        <article className="max-w-6xl mx-auto px-8 bg-white rounded-2xl shadow-sm py-6 md:py-8">
          <button
            type="button"
            onClick={() => router.push("/blogs")}
            className="mb-4 inline-flex items-center text-sm text-orange-600 hover:text-orange-700"
          >
            <span className="mr-1">&larr;</span>
            <span>Back to Blogs</span>
          </button>
          <header className="mb-6 border-b border-gray-100 pb-4">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
              {capitalizeFirstLetter(blog.title)}
            </h1>
            <div className="text-sm text-gray-500 mt-1 flex items-center gap-2">
              <span>{formatDateTime(published)}</span>
              {typeof blog.reading_time === "number" && blog.reading_time > 0 && (
                <>
                  <span>•</span>
                  <span>{blog.reading_time} min read</span>
                </>
              )}
              {blog.category_name && (
                <>
                  <span>•</span>
                  <span>{blog.category_name}</span>
                </>
              )}
            </div>
          </header>

          {/* Banner image */}
          {blog.banner_image && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={blog.banner_image}
              alt={blog.title}
              className="w-full max-h-[380px] object-cover rounded-xl shadow mb-6"
            />
          )}

          {blog.short_description && (
            <p className="text-gray-700 text-lg pb-4 mb-6 border-b">
              {capitalizeFirstLetter(blog.short_description)}
            </p>
          )}

          {/* Sections */}
          <div className="prose max-w-none border-b">
            {sections.map((sec, idx) => (
              <section key={idx} className="mb-6">
                {sec.subheading && (
                  <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                    {capitalizeFirstLetter(sec.subheading)}
                  </h2>
                )}
                {(sec.paragraphs || []).map((p, pIdx) => (
                  <p key={pIdx} className="text-gray-800 leading-7">
                    {capitalizeFirstLetter(p)}
                  </p>
                ))}
              </section>
            ))}
          </div>

          {/* Video */}
          {blog.video_url && videoEmbedUrl && (
            <div className="mt-10">
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Video</h3>
              <div className="aspect-video w-full rounded-xl overflow-hidden shadow-md">
                <iframe
                  src={videoEmbedUrl}
                  title={blog.title || "Blog video"}
                  className="w-full h-full"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          )}
        </article>
      </div>
    );
  }

  return (
    <>
      <Header />
      {content}
      <Footer />
    </>
  );
};

export default BlogDetailPage;
