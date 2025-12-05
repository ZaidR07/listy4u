"use client";
import { useState, useEffect } from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import Image from "next/image";
import axiosInstance from "@/lib/axios";

const fallbackBanners = [
  "/banner4.png",
];

const CarouselComponent = () => {
  const [imageHeight, setImageHeight] = useState("26vh"); // Default for mobile
  const [banners, setBanners] = useState<string[]>([]);

  useEffect(() => {
    const updateHeight = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setImageHeight("26vh"); // Mobile
      } else if (width < 1024) {
        setImageHeight("30vh"); // Tablet
      } else {
        setImageHeight("70vh"); // Large screens
      }
    };

    updateHeight(); // Set initial height
    window.addEventListener("resize", updateHeight); // Update on resize

    return () => window.removeEventListener("resize", updateHeight);
  }, []);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await axiosInstance.get("/api/company/settings");
        const payload = res?.data?.payload || {};
        const heroBanners = Array.isArray(payload.heroBanners)
          ? payload.heroBanners.slice().reverse()
          : [];
        setBanners(heroBanners);
      } catch {
        // Ignore errors and rely on fallback banners
      }
    };

    fetchBanners();
  }, []);

  const activeBanners = banners && banners.length > 0 ? banners : fallbackBanners;

  return (
    <Carousel
      autoPlay
      infiniteLoop
      interval={3000}
      showThumbs={false}
      showStatus={false}
      showArrows={false}
      stopOnHover
      showIndicators={false}
      className="w-full"
    >
      {activeBanners.map((src, index) => (
        <div key={index} className="relative w-full" style={{ height: imageHeight }}>
          <Image
            src={src}
            alt={`Carousel Image ${index + 1}`}
            fill
            className="object-cover rounded-md"
            priority={index === 0} // Prioritize first image
          />
        </div>
      ))}
    </Carousel>
  );
};

export default CarouselComponent;
