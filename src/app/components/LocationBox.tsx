"use client";

import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axios";

const LocationBox = ({ locationstate, setlocation }) => {
  const [filter, setFilter] = useState("");
  const [locations, setLocations] = useState<string[]>([]);

  const LocationIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      width={16}
      fill="#FF5D00"
    >
      <path d="M256 0c17.7 0 32 14.3 32 32v34.7C368.4 80.1 431.9 143.6 445.3 224H480c17.7 0 32 14.3 32 32s-14.3 32-32 32h-34.7C431.9 368.4 368.4 431.9 288 445.3V480c0 17.7-14.3 32-32 32s-32-14.3-32-32v-34.7C143.6 431.9 80.1 368.4 66.7 288H32c-17.7 0-32-14.3-32-32s14.3-32 32-32h34.7C80.1 143.6 143.6 80.1 224 66.7V32c0-17.7 14.3-32 32-32zm-128 256a128 128 0 1 0 256 0 128 128 0 1 0-256 0zm128-80a80 80 0 1 1 0 160 80 80 0 1 1 0-160z" />
    </svg>
  );

  useEffect(() => {
    const loadLocations = async () => {
      try {
        const response = await axiosInstance.get('/api/getspecificvariable', {
          params: { category: "locationlist" },
        });
        if (response.status === 200) {
          setLocations(response.data.payload || []);
        } else {
          setLocations([]);
        }
      } catch (e) {
        setLocations([]);
      }
    };
    loadLocations();
  }, []);

  const filteredLocations = locations.filter((loc) =>
    (loc || "").toLowerCase().includes(filter.toLowerCase())
  );

  const handleSetLocation = (loc: string) => {
    console.log("Set Location clicked:", loc, typeof setlocation);
    setFilter("");
    setlocation(loc);
  };

  return (
    <div
      className={`flex flex-col gap-4 w-[70%] lg:w-[20%] bg-white fixed z-[99999999999999999999999999999999] lg:top-[25vh] top-[45vh] left-[15%] lg:left-[40%] p-4 rounded-lg shadow-lg ${locationstate != "" ? "hidden" : "block"
        }`}
    >
      <div className="flex items-center gap-4">
        <input
          type="text"
          placeholder="Filter locations..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-full p-2 border rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
      </div>
      <div className="max-h-48 overflow-y-auto border rounded-md">
        {filteredLocations.length > 0 ? (
          filteredLocations.map((loc, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between px-2 py-1 hover:bg-gray-50"
            >
              <span className="text-gray-700">{loc}</span>
              <button
                onClick={() => handleSetLocation(loc)}
                className="px-2 py-1 text-sm text-white bg-orange-500 rounded hover:bg-orange-600"
              >
                Set Location
              </button>
            </div>
          ))
        ) : (
          <div className="px-2 py-1 text-gray-500">No locations found</div>
        )}
      </div>
    </div>
  );
};

export default LocationBox;
