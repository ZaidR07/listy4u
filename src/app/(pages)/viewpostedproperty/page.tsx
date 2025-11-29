"use client";

import Header from "@/app/components/Header";
import React, { useState } from "react";
import axiosInstance from "@/lib/axios";
import { useCallback, useEffect } from "react";
import { RupeeIcon, HomeIcon, RulerIcon } from "@/app/Icons";
import Cookies from "js-cookie";
import { useRouter, useSearchParams } from "next/navigation";


const page = () => {
  const [propertieslist, setPropertieslist] = useState([
    {
      Societyname: "",
      floor: "",
      bedrooms: "",
      area: "",
      areaunits: "",
      buildingfloors: "",
      address: "",
      amenities: [], // array of strings
      facing: "",
      propertyage: "",
      balconies: "",
      bathrooms: "",
      price: "",
      postedby: "",
      type: "",
      constructionstatus: "",
      furnishing: "",
      highlights: [], // array of strings
      location: "",
      line: "",
      for: "",
      property_id: null, // or 0 if you prefer default numeric
      active: false,
      images: [], // array of image URLs or objects
      postedby_id: null,
      postedbytype: null,
    },
  ]);

  const [user, setUser] = useState<string | null>(null); // State for owner/user token

  const ownerCookie = Cookies.get("owner");
  const userCookie = Cookies.get("user");

  const router = useRouter();
  const searchParams = useSearchParams();
  const who = searchParams.get("who");

  const getUserCookie = () => {
    const cookie = ownerCookie || userCookie;
    if (cookie) {
      try {
        setUser(cookie);
      } catch {
        console.error("Error Setting Cookies");
      }
    }
  };

  // Extract user from cookies (owners/users)
  useEffect(() => {
    getUserCookie();
  }, [ownerCookie, userCookie]);

  const decodeUserEmail = () => {
    const cookie = ownerCookie || userCookie;
    if (!cookie) return null;
    
    try {
      const payload = JSON.parse(atob(cookie.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")));
      return payload?.email || payload?.sub; // Try email first, then sub as fallback
    } catch (error) {
      console.error("Error decoding token:", error);
      return null;
    }
  };

  const getData = useCallback(async () => {
    try {
      if (who === "broker") {
        // Verify broker session and fetch broker properties
        const verify = await axiosInstance.get('/api/verifybrokercookie');
        const broker = verify.data?.broker;
        if (!broker || !broker.broker_id) {
          console.error("Broker not found or not authenticated");
          return;
        }

        const propertyRes = await axiosInstance.get('/api/getbrokerproperties', {
          params: { id: broker.broker_id },
        });

        if (!Array.isArray(propertyRes.data.payload)) {
          console.error("Invalid broker properties response");
          return;
        }

        setPropertieslist(propertyRes.data.payload);
      } else {
        const userEmail = decodeUserEmail();
        if (!userEmail) {
          console.error("No user email found in token");
          return;
        }

        const propertyRes = await axiosInstance.get('/api/getownerproperties', {
          params: { user: userEmail },
        });

        if (!Array.isArray(propertyRes.data.payload)) {
          console.error("Invalid owner properties response");
          return;
        }

        setPropertieslist(propertyRes.data.payload);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, [who, ownerCookie, userCookie]);

  useEffect(() => {
    getData();
  }, [getData]);

  const [windowwidth, setWindowWidth] = useState(0);

  useEffect(() => {
    // This code only runs on the client side
    setWindowWidth(window.innerWidth);
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="">
      <Header />
      {/* Properties List */}:
      <section className=" px-[5%] w-full mt-[14vh] py-5 flex flex-col lg:grid lg:grid-cols-2 2xl:grid-cols-3   gap-4 " >
        
        {Array.isArray(propertieslist) && propertieslist.length > 0 ? (
          propertieslist.map((item, key) => (
            <div
              className="w-full lg:flex-1 border-2  border-gray-300 shadow-md rounded-xl flex items-center gap-[4%] justify-between px-[2.5%] pb-4 pt-3 bg-white"
              key={key}
            >
              <div className="w-[35%] h-full rounded-xl">
                <img
                  src={item.images[0]}
                  className="h-auto w-[100%]   object-coverr"
                  alt=""
                />
              </div>
              <div className="w-[57%] relative lg:flex lg:gap-2 lg:flex-col">
                <span className="text-lg block lg:text-2xl xl:text-3xl">
                  {item.Societyname}
                </span>

                <span className="text-gray-500 lg:text-xl">
                  {item.location}
                </span>
                <div className="mt-1 flex gap-3 lg:gap-6">
                  <div className="flex gap-1 lg:gap-2">
                    <RulerIcon
                      width={windowwidth < 800 ? 12 : 25}
                      fill="#FF5D00"
                    />
                    <span className="text-sm lg:text-xl xl:text-2xl">
                      {item.area}
                    </span>
                    <span className="text-sm lg:text-xl xl:text-2xl">
                      {item.areaunits}
                    </span>
                  </div>
                  <div className="flex gap-1">
                    <HomeIcon
                      width={windowwidth < 800 ? 12 : 25}
                      fill="#FF5D00"
                    />
                    <span className="text-sm lg:text-xl xl:text-2xl">
                      {item.bedrooms || "NA"}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2 mt-2">
                  <RupeeIcon
                    width={windowwidth < 800 ? 12 : 20}
                    fill="#FF5D00"
                  />
                  <span className="text-sm lg:text-xl xl:text-2xl">
                    {item.price}
                  </span>
                </div>

                {/* Highlights Section */}
                <div className="mt-1 flex flex-wrap gap-1">
                  <span>Highlights :</span>
                  {Array.isArray(item.highlights) &&
                  item.highlights.length > 0 ? (
                    item.highlights.map((highlight, index) => (
                      <div key={index}>
                        <span className="text-sm">
                          {highlight}
                          {index !== item.highlights.length - 1 && ", "}
                        </span>
                      </div>
                    ))
                  ) : (
                    <span>NA</span>
                  )}
                </div>
                <div className="flex gap-4 md:gap-6">
                  <button onClick={() => router.push(`/singleproperty?id=${item.property_id}`)}  className="mt-2 px-3 py-1 lg:py-2 bg-[#FF5D00] text-white rounded text-sm lg:max-w-[40%]">
                    View Post
                  </button>
                  <button onClick={() => router.push(`/editproperty?id=${item.property_id}`)} className="mt-2 px-3 py-1 lg:py-2 bg-[#FF5D00] text-white rounded text-sm lg:max-w-[40%]">
                    Edit Post
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div>No Data</div>
        )}
      </section>
    </div>
  );
};

export default page;
