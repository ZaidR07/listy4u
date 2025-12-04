"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import AdminHeader from "@/app/components/AdminHeader";
import axiosInstance from "@/lib/axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface Section {
  subheading: string;
  paragraphs: string[];
}

const BLOG_CATEGORIES = [
  { id: "market-trends", name: "Market Trends" },
  { id: "home-buying", name: "Home Buying" },
  { id: "home-selling", name: "Home Selling" },
  { id: "renting", name: "Renting" },
  { id: "home-services", name: "Home Services" },
];

const AddOrEditBlogPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const blogId = searchParams.get("id");
  const isEditMode = Boolean(blogId);

  const [sidebaropen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: "",
    slug: "",
    short_description: "",
    full_content: "",
    video_url: "",
    author_id: "",
    author_name: "",
    category_id: "",
    category_name: "",
    publish_date: "",
    seo_meta_title: "",
    seo_meta_description: "",
    seo_meta_keywords: "",
    seo_canonical_url: "",
    seo_og_title: "",
    seo_og_description: "",
    seo_og_image: "",
  });

  const [sections, setSections] = useState<Section[]>([
    { subheading: "", paragraphs: [""] },
  ]);

  const [bannerImageFile, setBannerImageFile] = useState<File | null>(null);
  const [existingBannerImage, setExistingBannerImage] = useState<string>("");

  useEffect(() => {
    const loadBlog = async () => {
      if (!blogId) return;
      try {
        setLoading(true);
        const res = await axiosInstance.get("/api/getsingleblog", {
          params: { id: blogId },
        });
        const blog = res?.data?.payload;
        if (!blog) return;

        setForm({
          title: blog.title || "",
          slug: blog.slug || "",
          short_description: blog.short_description || "",
          full_content: blog.full_content || "",
          video_url: blog.video_url || "",
          author_id: blog.author_id || "",
          author_name: blog.author_name || "",
          category_id: blog.category_id || "",
          category_name: blog.category_name || "",
          publish_date: blog.publish_date
            ? new Date(blog.publish_date).toISOString().slice(0, 16)
            : "",
          seo_meta_title: blog.seo?.meta_title || "",
          seo_meta_description: blog.seo?.meta_description || "",
          seo_meta_keywords: blog.seo?.meta_keywords || "",
          seo_canonical_url: blog.seo?.canonical_url || "",
          seo_og_title: blog.seo?.og_title || "",
          seo_og_description: blog.seo?.og_description || "",
          seo_og_image: blog.seo?.og_image || "",
        });

        if (Array.isArray(blog.sections) && blog.sections.length > 0) {
          setSections(
            blog.sections.map((sec: any) => ({
              subheading: sec.subheading || "",
              paragraphs: Array.isArray(sec.paragraphs)
                ? sec.paragraphs
                : [sec.paragraphs || ""],
            }))
          );
        }

        setExistingBannerImage(blog.banner_image || "");
      } catch (e: any) {
        toast.error(e?.response?.data?.message || "Failed to load blog");
      } finally {
        setLoading(false);
      }
    };

    loadBlog();
  }, [blogId]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (e: any) => {
    const selectedId = e.target.value;
    const option = BLOG_CATEGORIES.find((c) => c.id === selectedId);
    setForm((prev) => ({
      ...prev,
      category_id: option ? option.id : "",
      category_name: option ? option.name : "",
    }));
  };

  const handleSectionChange = (
    index: number,
    field: keyof Section,
    value: string
  ) => {
    setSections((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleParagraphChange = (
    sectionIndex: number,
    paragraphIndex: number,
    value: string
  ) => {
    setSections((prev) => {
      const updated = [...prev];
      const section = { ...updated[sectionIndex] };
      const paragraphs = [...section.paragraphs];
      paragraphs[paragraphIndex] = value;
      section.paragraphs = paragraphs;
      updated[sectionIndex] = section;
      return updated;
    });
  };

  const addSection = () => {
    setSections((prev) => [...prev, { subheading: "", paragraphs: [""] }]);
  };

  const removeSection = (index: number) => {
    setSections((prev) => prev.filter((_, i) => i !== index));
  };

  const addParagraph = (sectionIndex: number) => {
    setSections((prev) => {
      const updated = [...prev];
      updated[sectionIndex] = {
        ...updated[sectionIndex],
        paragraphs: [...updated[sectionIndex].paragraphs, ""],
      };
      return updated;
    });
  };

  const removeParagraph = (sectionIndex: number, paragraphIndex: number) => {
    setSections((prev) => {
      const updated = [...prev];
      const section = { ...updated[sectionIndex] };
      section.paragraphs = section.paragraphs.filter(
        (_: string, idx: number) => idx !== paragraphIndex
      );
      if (section.paragraphs.length === 0) {
        section.paragraphs = [""];
      }
      updated[sectionIndex] = section;
      return updated;
    });
  };

  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setBannerImageFile(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const fd = new FormData();

      Object.entries(form).forEach(([key, value]) => {
        if (value) {
          fd.append(key, value as string);
        }
      });

      fd.append("sections", JSON.stringify(sections));

      if (bannerImageFile) {
        fd.append("banner_image", bannerImageFile);
      }

      let url = "/api/addblog";
      if (isEditMode && blogId) {
        url = "/api/updateblog";
        fd.append("id", blogId);
      }

      const res = await axiosInstance.post(url, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success(res?.data?.message || "Blog saved successfully");

      if (!isEditMode) {
        setForm({
          title: "",
          slug: "",
          short_description: "",
          full_content: "",
          video_url: "",
          author_id: "",
          author_name: "",
          category_id: "",
          category_name: "",
          publish_date: "",
          seo_meta_title: "",
          seo_meta_description: "",
          seo_meta_keywords: "",
          seo_canonical_url: "",
          seo_og_title: "",
          seo_og_description: "",
          seo_og_image: "",
        });
        setSections([{ subheading: "", paragraphs: [""] }]);
        setBannerImageFile(null);
        setExistingBannerImage("");
      } else {
        router.push("/viewblogs");
      }
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Failed to save blog");
    } finally {
      setLoading(false);
    }
  };

  const pageTitle = isEditMode ? "Edit Blog" : "Add Blog";

  

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader sidebaropen={sidebaropen} setSidebarOpen={setSidebarOpen} />
      <div
        className={`${
          sidebaropen ? "lg:ml-[23%]" : "lg:ml-[12%]"
        } transition-all duration-500 pt-[12vh] px-4 lg:px-8 pb-8`}
      >
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
            {pageTitle}
          </h1>
          <form
            className="p-6 lg:p-8 bg-white rounded-2xl shadow-lg space-y-6"
            onSubmit={handleSubmit}
          >
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  name="title"
                  value={form.title}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                  placeholder="Enter blog title"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Short Description
              </label>
              <textarea
                name="short_description"
                value={form.short_description}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none resize-none"
                placeholder="Brief summary of the blog post"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Content Sections (Subheadings & Paragraphs)
                </label>
                <button
                  type="button"
                  onClick={addSection}
                  className="px-3 py-1 text-sm bg-orange-500 text-white rounded-md hover:bg-orange-600"
                >
                  + Add Section
                </button>
              </div>
              <div className="space-y-4">
                {sections.map((section, sIdx) => (
                  <div
                    key={sIdx}
                    className="border border-gray-200 rounded-lg p-3 bg-gray-50"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <input
                        value={section.subheading}
                        onChange={(e) =>
                          handleSectionChange(sIdx, "subheading", e.target.value)
                        }
                        className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                        placeholder={`Subheading ${sIdx + 1}`}
                      />
                      {sections.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeSection(sIdx)}
                          className="text-xs text-red-600 hover:text-red-700"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                    <div className="space-y-2">
                      {section.paragraphs.map((p, pIdx) => (
                        <div key={pIdx} className="flex items-start gap-2">
                          <textarea
                            value={p}
                            onChange={(e) =>
                              handleParagraphChange(
                                sIdx,
                                pIdx,
                                e.target.value
                              )
                            }
                            rows={3}
                            className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                            placeholder={`Paragraph ${pIdx + 1}`}
                          />
                          {section.paragraphs.length > 1 && (
                            <button
                              type="button"
                              onClick={() =>
                                removeParagraph(sIdx, pIdx)
                              }
                              className="mt-1 text-xs text-red-600 hover:text-red-700"
                            >
                              Remove
                            </button>
                          )}
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => addParagraph(sIdx)}
                        className="mt-1 text-xs text-orange-600 hover:text-orange-700"
                      >
                        + Add Paragraph
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Author Name
                </label>
                <input
                  name="author_name"
                  value={form.author_name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                  placeholder="Author name"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Category
                </label>
                <select
                  value={form.category_id}
                  onChange={handleCategoryChange}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                >
                  <option value="">Select category</option>
                  {BLOG_CATEGORIES.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Video URL
              </label>
              <input
                name="video_url"
                value={form.video_url}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                placeholder="Optional video URL (YouTube, etc.)"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Banner Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleBannerChange}
                className="w-full"
              />
              {existingBannerImage && !bannerImageFile && (
                <p className="mt-1 text-xs text-gray-500">
                  Current: {existingBannerImage}
                </p>
              )}
            </div>

            <div className="border-t pt-4 space-y-3">
              <h2 className="text-lg font-semibold text-gray-800">SEO Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Meta Title
                  </label>
                  <input
                    name="seo_meta_title"
                    value={form.seo_meta_title}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Meta Description
                  </label>
                  <input
                    name="seo_meta_description"
                    value={form.seo_meta_description}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Meta Keywords
                  </label>
                  <input
                    name="seo_meta_keywords"
                    value={form.seo_meta_keywords}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Canonical URL
                  </label>
                  <input
                    name="seo_canonical_url"
                    value={form.seo_canonical_url}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    OG Title
                  </label>
                  <input
                    name="seo_og_title"
                    value={form.seo_og_title}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    OG Description
                  </label>
                  <input
                    name="seo_og_description"
                    value={form.seo_og_description}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    OG Image URL
                  </label>
                  <input
                    name="seo_og_image"
                    value={form.seo_og_image}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transition-all duration-300 disabled:opacity-60"
            >
              {loading ? "Saving..." : isEditMode ? "Update Blog" : "Add Blog"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddOrEditBlogPage;
