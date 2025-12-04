"use client";
import React, { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import Navigationbar from "./Navigationbar";
import { useRouter } from "next/navigation";

import { useSelector, useDispatch } from "react-redux"; // ✅ correct
import { setlocation } from "@/slices/locationSlice";

const HamIcon = ({ opennav }) => {
  return (
    <motion.svg
      xmlns="http://www.w3.org/2000/svg"
      width={30}
      fill="#130535ca"
      viewBox="0 0 512 512"
      className="cursor-pointer"
      // animate={{ scale: [0.8, 1.1, 0.8] }} // Enlarges and shrinks
      // transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }} // Smooth looping
      onClick={opennav} // Pass function to update state
    >
      <path d="M0 96C0 78.3 14.3 64 32 64l384 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 128C14.3 128 0 113.7 0 96zM64 256c0-17.7 14.3-32 32-32l384 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L96 288c-17.7 0-32-14.3-32-32zM448 416c0 17.7-14.3 32-32 32L32 448c-17.7 0-32-14.3-32-32s14.3-32 32-32l384 0c17.7 0 32 14.3 32 32z" />
    </motion.svg>
  );
};

const LocationIcon = () => {
  return (
    <svg
      width={20}
      fill="#ff5d00"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 384 512"
    >
      <path d="M215.7 499.2C267 435 384 279.4 384 192C384 86 298 0 192 0S0 86 0 192c0 87.4 117 243 168.3 307.2c12.3 15.3 35.1 15.3 47.4 0zM192 128a64 64 0 1 1 0 128 64 64 0 1 1 0-128z" />
    </svg>
  );
};

const CloseIcon = ({ closenav }) => {
  return (
    <motion.svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 384 512"
      width={30}
      fill="#130535ca"
      onClick={closenav}
      className="cursor-pointer"
      // animate={{ scale: [0.8, 1.1, 0.8] }} // Enlarges and shrinks
      // transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }} // Smooth looping
    >
      <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
    </motion.svg>
  );
};

const MobileNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter(); // Initialize router

  const locationstate = useSelector((state: any) => state.location.location); // ✅ useSelector

  const dispatch = useDispatch();

  return (
    <>
      {/* Navbar with higher z-index */}
      <nav className="fixed top-0 left-0 w-full h-[8vh] landscape:h-[20vh] py-2 landscape:py-2 sm:py-0 px-4 lg:hidden flex items-center justify-between bg-white shadow-sm z-50">
        <div className="flex gap-2 ">
          <Image
            src="/logo.jpg"
            width={60}
            height={60}
            alt="logo"
            className="cursor-pointer w-12 h-12 md:w-16 md:h-16 object-contain"
            onClick={() => router.push("/")}
          />
          {locationstate && (
            <span
              onClick={() => {
                dispatch(setlocation(""));
              }}
              className="flex gap-2 items-center cursor-pointer"
            >
              <LocationIcon /> {locationstate}
            </span>
          )}
        </div>

        {isOpen ? (
          <CloseIcon closenav={() => setIsOpen(false)} />
        ) : (
          <HamIcon opennav={() => setIsOpen(true)} />
        )}
      </nav>

      {/* Navigationbar with lower z-index */}
      <Navigationbar isOpen={isOpen} setIsOpen={setIsOpen}/>
    </>
  );
};

export default MobileNav;
