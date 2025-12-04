"use client";

import { useEffect, useState } from "react";
import AdminHeader from "@/app/components/AdminHeader";
import axiosInstance from "@/lib/axios";
import { toast } from "react-toastify";

const CompanyPage = () => {
  const [sidebaropen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [heroPreview, setHeroPreview] = useState<string[]>([]);
  const [heroFiles, setHeroFiles] = useState<File[]>([]);
  const [contact, setContact] = useState({
    contactNumber1: "",
    contactNumber2: "",
    address: "",
    whatsapp: "",
    instagram: "",
    facebook: "",
  });

  const loadSettings = async () => {
    try {
      const res = await axiosInstance.get("/api/company/settings");
      const payload = res?.data?.payload || {};
      setContact({
        contactNumber1: payload.contactNumber1 || "",
        contactNumber2: payload.contactNumber2 || "",
        address: payload.address || "",
        whatsapp: payload.whatsapp || "",
        instagram: payload.instagram || "",
        facebook: payload.facebook || "",
      });
      setHeroPreview(Array.isArray(payload.heroBanners) ? payload.heroBanners : []);
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Failed to load company settings");
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const handleContactChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setContact((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveContact = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await axiosInstance.post("/api/company/contact", contact);
      toast.success(res?.data?.message || "Contact updated");
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Failed to update contact");
    } finally {
      setLoading(false);
    }
  };

  const handleHeroFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setHeroFiles(files as File[]);
    const previews = files.map((file) => URL.createObjectURL(file));
    setHeroPreview(previews);
  };

  const handleUploadBanners = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!heroFiles.length) {
      toast.info("Select at least one banner image");
      return;
    }
    try {
      setLoading(true);
      const formData = new FormData();
      heroFiles.forEach((file) => formData.append("banners", file));
      const res = await axiosInstance.post("/api/company/hero-banners", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const payload = res?.data?.payload || [];
      setHeroPreview(payload);
      toast.success(res?.data?.message || "Hero banners updated");
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Failed to upload banners");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-200 w-full min-h-screen lg:mt-[12vh] lg:flex">
      <AdminHeader sidebaropen={sidebaropen} setSidebarOpen={setSidebarOpen} />
      <div
        className={`px-[5%] py-[5vh] mt-[10vh] lg:mt-0 w-full ${
          sidebaropen ? "lg:ml-[23%]" : "lg:ml-[12%]"
        }`}
      >
        <div className="bg-white shadow-xl rounded-lg px-[5%] py-[2vh] space-y-10">
          <h1 className="text-center text-2xl text-[#f3701f] mb-4">Company Settings</h1>

          {/* Hero Banner Upload */}
          <section>
            <h2 className="text-xl font-semibold mb-2 text-gray-800">Hero Banners</h2>
            <p className="text-sm text-gray-600 mb-3">
              Upload 1–4 hero banner images. These will appear on the home page hero carousel.
            </p>
            <form onSubmit={handleUploadBanners} className="space-y-3">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleHeroFilesChange}
                className="block w-full text-sm text-gray-700"
              />
              <button
                type="submit"
                disabled={loading}
                className="bg-[#f3701f] text-white px-6 py-2 rounded-md hover:bg-[#d95b17] transition disabled:opacity-60"
              >
                {loading ? "Saving..." : "Save Banners"}
              </button>
            </form>
            {heroPreview.length > 0 && (
              <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
                {heroPreview.map((src, idx) => (
                  <div key={idx} className="relative w-full h-24 md:h-32 rounded-md overflow-hidden bg-gray-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={src} alt={`Banner ${idx + 1}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Contact Details */}
          <section>
            <h2 className="text-xl font-semibold mb-2 text-gray-800">Contact Details</h2>
            <form onSubmit={handleSaveContact} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Contact Number 1</label>
                  <input
                    name="contactNumber1"
                    value={contact.contactNumber1}
                    onChange={handleContactChange}
                    className="mt-1 w-full border-b-2 border-gray-300 px-1 py-1 outline-none bg-transparent"
                    placeholder="Primary contact number"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Contact Number 2</label>
                  <input
                    name="contactNumber2"
                    value={contact.contactNumber2}
                    onChange={handleContactChange}
                    className="mt-1 w-full border-b-2 border-gray-300 px-1 py-1 outline-none bg-transparent"
                    placeholder="Secondary contact number"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Address</label>
                <textarea
                  name="address"
                  value={contact.address}
                  onChange={handleContactChange}
                  rows={3}
                  className="mt-1 w-full border-b-2 border-gray-300 px-1 py-1 outline-none bg-transparent resize-none"
                  placeholder="Office address"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">WhatsApp Link</label>
                  <input
                    name="whatsapp"
                    value={contact.whatsapp}
                    onChange={handleContactChange}
                    className="mt-1 w-full border-b-2 border-gray-300 px-1 py-1 outline-none bg-transparent"
                    placeholder="https://wa.me/91..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Instagram Link</label>
                  <input
                    name="instagram"
                    value={contact.instagram}
                    onChange={handleContactChange}
                    className="mt-1 w-full border-b-2 border-gray-300 px-1 py-1 outline-none bg-transparent"
                    placeholder="https://instagram.com/..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Facebook Link</label>
                  <input
                    name="facebook"
                    value={contact.facebook}
                    onChange={handleContactChange}
                    className="mt-1 w-full border-b-2 border-gray-300 px-1 py-1 outline-none bg-transparent"
                    placeholder="https://facebook.com/..."
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-2 bg-[#f3701f] text-white px-6 py-2 rounded-md hover:bg-[#d95b17] transition disabled:opacity-60"
              >
                {loading ? "Saving..." : "Save Contact"}
              </button>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
};

export default CompanyPage;
