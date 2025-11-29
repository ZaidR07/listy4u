"use client";
import { useState, useEffect } from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import Image from "next/image";

const CarouselComponent = () => {
  const [imageHeight, setImageHeight] = useState("26vh"); // Default for mobile

  useEffect(() => {
    const updateHeight = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setImageHeight("26vh"); // Mobile
      } else if (width < 1024) {
        setImageHeight("40vh"); // Tablet
      } else {
        setImageHeight("70vh"); // Large screens
      }
    };

    updateHeight(); // Set initial height
    window.addEventListener("resize", updateHeight); // Update on resize

    return () => window.removeEventListener("resize", updateHeight);
  }, []);

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
      {["/1740719627292.png", "/1740719627309.png", "/1740719627319.jpeg","/banner4.png"].map((src, index) => (
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
