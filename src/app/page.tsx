"use client";
import React, { useEffect, useState } from "react";
import Header from "./components/Header";
import CarouselComponent from "./components/Carouselcomponent";
import axiosInstance from "@/lib/axios";
import { toast } from "react-toastify";
import Searchsection from "./components/SearchSection";
import RecentlyListed from "./components/RecentlyListed";
import NumberBar from "./components/NumberBar";
import Footer from "./components/Footer";
import Profile from "./components/Profile";
import PropertyTypes from "./components/PropertyTypes";
import { useRouter } from "next/navigation";
import Register from "./components/Register";
import FeaturedBrokers from "./components/FeaturedBrokers";
import Testimonials from "./components/Testimonials";
import Cookies from "js-cookie";
import Vendors from "./components/Vendors";
import LocationBox from "./components/LocationBox";
import MobileAppDownload from "./components/MobileAppDownload";

import { setlocation } from "@/slices/locationSlice";
import { useSelector, useDispatch } from "react-redux"; // ✅ Corrected import

// const HomeIcon = () => {
//   return (
//     <svg
//       xmlns="http://www.w3.org/2000/svg"
//       viewBox="0 0 576 512"
//       width={16}
//       fill="#FF5D00"
//     >
//       <path d="M575.8 255.5c0 18-15 32.1-32 32.1l-32 0 .7 160.2c0 2.7-.2 5.4-.5 8.1l0 16.2c0 22.1-17.9 40-40 40l-16 0c-1.1 0-2.2 0-3.3-.1c-1.4 .1-2.8 .1-4.2 .1L416 512l-24 0c-22.1 0-40-17.9-40-40l0-24 0-64c0-17.7-14.3-32-32-32l-64 0c-17.7 0-32 14.3-32 32l0 64 0 24c0 22.1-17.9 40-40 40l-24 0-31.9 0c-1.5 0-3-.1-4.5-.2c-1.2 .1-2.4 .2-3.6 .2l-16 0c-22.1 0-40-17.9-40-40l0-112c0-.9 0-1.9 .1-2.8l0-69.7-32 0c-18 0-32-14-32-32.1c0-9 3-17 10-24L266.4 8c7-7 15-8 22-8s15 2 21 7L564.8 231.5c8 7 12 15 11 24z" />
//     </svg>
//   );
// };

// const BedIcon = () => (
//   <svg
//     xmlns="http://www.w3.org/2000/svg"
//     width={16}
//     fill="#FF5D00"
//     viewBox="0 0 640 512"
//   >
//     <path d="M32 32c17.7 0 32 14.3 32 32v256h224V160c0-17.7 14.3-32 32-32h224c53 0 96 43 96 96v224c0 17.7-14.3 32-32 32s-32-14.3-32-32v-32H64v32c0 17.7-14.3 32-32 32S0 502.1 0 480V64c0-17.7 14.3-32 32-32zm144 96a80 80 0 1 1 0 160 80 80 0 1 1 0-160z" />
//   </svg>
// );

// const KeyIcon = () => (
//   <svg
//     xmlns="http://www.w3.org/2000/svg"
//     viewBox="0 0 512 512"
//     width={16}
//     fill="#FF5D00"
//   >
//     <path d="M336 352c97.2 0 176-78.8 176-176S433.2 0 336 0 160 78.8 160 176c0 18.7 2.9 36.8 8.3 53.7L7 391c-4.5 4.5-7 10.6-7 17v80c0 13.3 10.7 24 24 24h80c13.3 0 24-10.7 24-24v-40h40c13.3 0 24-10.7 24-24v-40h40c6.4 0 12.5-2.5 17-7l33.3-33.3c16.9 5.4 35 8.3 53.7 8.3zM376 96a40 40 0 1 1 0 80 40 40 0 1 1 0-80z" />
//   </svg>
// );

const Page = () => {
  const dispatch = useDispatch(); // ✅ useDispatch
  const locationstate = useSelector((state: any) => state.location.location); // ✅ useSelector
  const [registeropen, setRegisterOpen] = useState(false);
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [usertype, setUserType] = useState(null);
  const [buildings, setBuildings] = useState([]);
  const cookie =
    Cookies.get("user") || Cookies.get("owner") || Cookies.get("broker");

  const getbuildings = async (location: string) => {
    try {
      if (location) {
        const response = await axiosInstance.get("/api/getbuildings", {
          params: { location },
        });

        if (response.status !== 200) {
          toast.error("Unable to load buildings");
          return;
        }

        setBuildings(response.data.payload);
      }
    } catch (error) {
      console.error("Error fetching buildings:", error);
    }
  };

  useEffect(() => {
    if (cookie) {
      try {
        const decoded = decodeURIComponent(cookie);
        setUser(decoded);
        setUserType(decoded.slice(-1)); // example: last char
      } catch (err) {
        console.error("Cookie parse error", err);
      }
    }

    if (locationstate) {
      getbuildings(locationstate);
    }
  }, [cookie, locationstate]);

  return (
    <>
      <Header />
      {/* LocationBox will update location in redux */}

      {/* rest of your code... */}
      <nav className="lg:hidden w-full mt-[8vh] landscape:mt-[20vh] md:mt-[8vh] min-h-[6vh] bg-[#FF5D00] shadow-2xl flex items-center justify-between px-4 py-2">
        <div className="flex gap-2 md:gap-4">
          {/* Buttons */}
          <button
            onClick={() => router.push("/buyproperties?view=Sale")}
            className="flex gap-1 items-center px-2 py-1 md:px-2.5 md:py-1.5 bg-white text-[#FF5D00] rounded-md"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 576 512"
              width={16}
              className="w-4 md:w-5"
              fill="#FF5D00"
            >
              <path d="M575.8 255.5c0 18-15 32.1-32 32.1l-32 0 .7 160.2c0 2.7-.2 5.4-.5 8.1l0 16.2c0 22.1-17.9 40-40 40l-16 0c-1.1 0-2.2 0-3.3-.1c-1.4 .1-2.8 .1-4.2 .1L416 512l-24 0c-22.1 0-40-17.9-40-40l0-24 0-64c0-17.7-14.3-32-32-32l-64 0c-17.7 0-32 14.3-32 32l0 64 0 24c0 22.1-17.9 40-40 40l-24 0-31.9 0c-1.5 0-3-.1-4.5-.2c-1.2 .1-2.4 .2-3.6 .2l-16 0c-22.1 0-40-17.9-40-40l0-112c0-.9 0-1.9 .1-2.8l0-69.7-32 0c-18 0-32-14-32-32.1c0-9 3-17 10-24L266.4 8c7-7 15-8 22-8s15 2 21 7L564.8 231.5c8 7 12 15 11 24z" />
            </svg>
            <span className="text-sm md:text-lg ">Buy</span>
          </button>
          <button
            onClick={() => router.push("/buyproperties?view=Rent")}
            className="flex gap-1 items-center px-2 py-1 bg-white text-[#FF5D00] rounded-md"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
              width={16}
              fill="#FF5D00"
              className="w-4 md:w-5"
            >
              <path d="M336 352c97.2 0 176-78.8 176-176S433.2 0 336 0 160 78.8 160 176c0 18.7 2.9 36.8 8.3 53.7L7 391c-4.5 4.5-7 10.6-7 17v80c0 13.3 10.7 24 24 24h80c13.3 0 24-10.7 24-24v-40h40c13.3 0 24-10.7 24-24v-40h40c6.4 0 12.5-2.5 17-7l33.3-33.3c16.9 5.4 35 8.3 53.7 8.3zM376 96a40 40 0 1 1 0 80 40 40 0 1 1 0-80z" />
            </svg>
            <span className="text-sm md:text-lg">Rent</span>
          </button>
          <button
            onClick={() => router.push("/buyproperties?view=Pg")}
            className="flex gap-1 items-center px-2 py-1 bg-white text-[#FF5D00] rounded-md"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={16}
              fill="#FF5D00"
              viewBox="0 0 640 512"
              className="w-4 md:w-5"
            >
              <path d="M32 32c17.7 0 32 14.3 32 32v256h224V160c0-17.7 14.3-32 32-32h224c53 0 96 43 96 96v224c0 17.7-14.3 32-32 32s-32-14.3-32-32v-32H64v32c0 17.7-14.3 32-32 32S0 502.1 0 480V64c0-17.7 14.3-32 32-32zm144 96a80 80 0 1 1 0 160 80 80 0 1 1 0-160z" />
            </svg>
            <span className="text-sm md:text-lg">PG</span>
          </button>
        </div>

        {user ? (
          <Profile user={user} />
        ) : (
          <button
            onClick={() => setRegisterOpen(true)}
            className="text-white text-lg font-bold"
          >
            Sign Up
          </button>
        )}
      </nav>

      <section className="mt-1 lg:mt-[16vh] px-[1%] rounded-md">
        <CarouselComponent />
        <Searchsection buildings={buildings} />
      </section>

      <section className="mt-[4vh]">
        <RecentlyListed />
      </section>
      <section>
        <PropertyTypes />
      </section>
      <section className="mt-[4vh]">
        <Vendors />
      </section>
      <section className="mt-[4vh]">
        <NumberBar />
      </section>

      {/* <LocationBox
      /> */}

      <Register registeropen={registeropen} setRegisterOpen={setRegisterOpen} />
      <FeaturedBrokers />
      <Testimonials />
      <MobileAppDownload />
      <Footer />
    </>
  );
};

export default Page;
