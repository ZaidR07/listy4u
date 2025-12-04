"use client";

import { useEffect, useState } from "react";
import { setlocation } from "@/slices/locationSlice";
import { useSelector, useDispatch } from "react-redux"; // ✅ Corrected import
import axiosInstance from "@/lib/axios";

const LocationBox = () => {
  const [filter, setFilter] = useState("");
  const [locations, setLocations] = useState<string[]>([]);const dispatch = useDispatch(); // ✅ useDispatch
    const locationstate = useSelector((state: any) => state.location.location); // ✅ useSelector


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

 

  return (
    <div
      className={`flex flex-col gap-4 w-[70%] lg:w-[20%] bg-white fixed z-[50] lg:top-[25vh] top-[45vh] left-[15%] lg:left-[40%] p-4 rounded-lg shadow-lg ${locationstate != "" ? "hidden" : "block"
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
                onClick={() => dispatch(setlocation(loc))}
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
