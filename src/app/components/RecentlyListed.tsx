import axiosInstance from "@/lib/axios";
import { useEffect, useState, useRef } from "react";
import { priceconverter } from "@/utils/priceconverter";
import { useRouter } from "next/navigation";

import { AngleLeft, AngleRight } from "../Icons";

const RecentlyListed = () => {
  const [propertieslist, setPropertiesList] = useState([]);
  const router = useRouter();

  // Separate refs for each section
  const saleRef = useRef(null);
  const rentRef = useRef(null);
  const pgRef = useRef(null);

  useEffect(() => {
    const handleload = async () => {
      const response = await axiosInstance.get('/api/getproperties');
      setPropertiesList(response.data.payload);
    };
    handleload();
  }, []);

  const scrollLeft = (ref) => {
    if (ref.current) ref.current.scrollBy({ left: -300, behavior: "smooth" });
  };

  const scrollRight = (ref) => {
    if (ref.current) ref.current.scrollBy({ left: 300, behavior: "smooth" });
  };

  return (
    <div className="mt-[10vh] mx-2 py-6 lg:pt-8 text-xl lg:text-3xl px-[3%] gap-2 bg-[#fef6f0] shadow-inner rounded-2xl landscape:mt-[20vh] lg:landscape:mt-[10vh] md:mt-[8vh]">
      <h1 className="text-[#FF5D00] text-center text-2xl sm:text-3xl ">Recently Listed</h1>

      {/* 🔹 For Sale Section */}
      {propertieslist.some((property) => property.for === "Sale") && (
        <>
          <h2 className="text-lg lg:text-2xl mt-6 ml-2">For Sale</h2>
          <div className="relative mt-2">
            <button
              onClick={() => scrollLeft(saleRef)}
              className="hidden lg:block absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-gray-200 p-2 rounded-full shadow-md"
            >
              <AngleLeft className="w-6 h-6 text-gray-600" />
            </button>
            <div
              ref={saleRef}
              className="overflow-x-auto whitespace-nowrap flex gap-3 lg:gap-8 pb-2 scrollbar-hide"
            >
              {propertieslist
                .filter((property) => property.for === "Sale")
                .map((property, index) => (
                  <PropertyCard key={index} property={property} router={router} />
                ))}
            </div>
            <button
              onClick={() => scrollRight(saleRef)}
              className="hidden lg:block absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-gray-200 p-2 rounded-full shadow-md"
            >
              <AngleRight className="w-6 h-6 text-gray-600" />
            </button>
          </div>
        </>
      )}

      {/* 🔹 For Rent Section */}
      {propertieslist.some((property) => property.for === "Rent") && (
        <>
          <h2 className="text-lg lg:text-2xl mt-6 ml-2">For Rent</h2>
          <div className="relative mt-2">
            <button
              onClick={() => scrollLeft(rentRef)}
              className="hidden lg:block absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-gray-200 p-2 rounded-full shadow-md"
            >
              <AngleLeft className="w-6 h-6 text-gray-600" />
            </button>
            <div
              ref={rentRef}
              className="overflow-x-auto whitespace-nowrap flex gap-3 lg:gap-8 pb-2 scrollbar-hide"
            >
              {propertieslist
                .filter((property) => property.for === "Rent")
                .map((property, index) => (
                  <PropertyCard key={index} property={property} router={router} />
                ))}
            </div>
            <button
              onClick={() => scrollRight(rentRef)}
              className="hidden lg:block absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-gray-200 p-2 rounded-full shadow-md"
            >
              <AngleRight className="w-6 h-6 text-gray-600" />
            </button>
          </div>
        </>
      )}

      {propertieslist.some((property) => property.for === "PG") && (
        <>
          {/* 🔹 For PG Section */}
          <h2 className="text-lg lg:text-2xl mt-6 ml-2">For PG</h2>
          <div className="relative mt-2">
            <button
              onClick={() => scrollLeft(pgRef)}
              className="hidden lg:block absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-gray-200 p-2 rounded-full shadow-md"
            >
              <AngleLeft className="w-6 h-6 text-gray-600" />
            </button>
            <div
              ref={pgRef}
              className="overflow-x-auto whitespace-nowrap flex gap-3 lg:gap-8 pb-2 scrollbar-hide"
            >
              {propertieslist
                .filter((property) => property.for === "PG")
                .map((property, index) => (
                  <PropertyCard
                    key={index}
                    property={property}
                    router={router}
                  />
                ))}
            </div>
            <button
              onClick={() => scrollRight(pgRef)}
              className="hidden lg:block absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-gray-200 p-2 rounded-full shadow-md"
            >
              <AngleRight className="w-6 h-6 text-gray-600" />
            </button>
          </div>
        </>
      )}
    </div>
  );
};

// 🔹 Extracted Property Card Component
const PropertyCard = ({ property, router }) => (
  <div
    onClick={() => router.push(`singleproperty?id=${property.property_id}`)}
    className="bg-transparent min-w-[60%] max-w-[60%] md:min-w-[40%] md:max-w-[40%] xl:min-w-[25%] xl:max-w-[25%] px-2 py-2 relative rounded-lg border-t-[1px] border-[#fa9c66] shadow-md shadow-[#fa9c66] cursor-pointer"
  >
    <div className="relative">
      <img
        src={property.images?.length > 0 ? property.images[0] : "/rent.png"}
        alt="Property"
        className="rounded-lg w-full aspect-square lg:h-[40vh]  object-cover"
      />
      <div className="absolute bottom-2 left-3 rounded-lg p-1 text-sm bg-orange-100 text-[#FF5D00]">
        {priceconverter(property.price)}
      </div>
    </div>
    <span className="text-xs">{property.bedrooms}</span>{" "}
    <span className="text-xs">{property.type}</span>{" "}
    <span className="text-xs text-wrap">{property.floor} Floor</span>
    <br />
    <span className="text-xs block">
      {property.Societyname?.length > 18
        ? property.Societyname.substring(0, 18) + "..."
        : property.Societyname || "N/A"}
    </span>
    <span className="text-xs block">{property.location}</span>
  </div>
);

export default RecentlyListed;
