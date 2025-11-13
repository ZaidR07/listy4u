"use client";

import { useState, useEffect, useRef } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

const HeartIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={15}
      className="mr-2 cursor-pointer"
      viewBox="0 0 512 512"
    >
      <path d="M225.8 468.2l-2.5-2.3L48.1 303.2C17.4 274.7 0 234.7 0 192.8l0-3.3c0-70.4 50-130.8 119.2-144C158.6 37.9 198.9 47 231 69.6c9 6.4 17.4 13.8 25 22.3c4.2-4.8 8.7-9.2 13.5-13.3c3.7-3.2 7.5-6.2 11.5-9c0 0 0 0 0 0C313.1 47 353.4 37.9 392.8 45.4C462 58.6 512 119.1 512 189.5l0 3.3c0 41.9-17.4 81.9-48.1 110.4L288.7 465.9l-2.5 2.3c-8.2 7.6-19 11.9-30.2 11.9s-22-4.2-30.2-11.9zM239.1 145c-.4-.3-.7-.7-1-1.1l-17.8-20-.1-.1s0 0 0 0c-23.1-25.9-58-37.7-92-31.2C81.6 101.5 48 142.1 48 189.5l0 3.3c0 28.5 11.9 55.8 32.8 75.2L256 430.7 431.2 268c20.9-19.4 32.8-46.7 32.8-75.2l0-3.3c0-47.3-33.6-88-80.1-96.9c-34-6.5-69 5.4-92 31.2c0 0 0 0-.1 .1s0 0-.1 .1l-17.8 20c-.3 .4-.7 .7-1 1.1c-4.5 4.5-10.6 7-16.9 7s-12.4-2.5-16.9-7z" />
    </svg>
  );
};

const ProfileIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={15}
      className="mr-2 cursor-pointer"
      viewBox="0 0 24 24"
    >
      <path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm0 2c-4.418 0-8 2.239-8 5v1h16v-1c0-2.761-3.582-5-8-5Z" />
    </svg>
  );
};

const AngleDown = ({ setDropOpen, dropopen }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={15}
      className="lg:ml-2 cursor-pointer text-white lg:text-black transition-transform duration-200"
      viewBox="0 0 448 512"
      onClick={(e) => {
        e.stopPropagation();
        setDropOpen((prev) => !prev);
      }}
      fill="currentColor"
      style={{ transform: dropopen ? 'rotate(180deg)' : 'rotate(0deg)' }}
    >
      <path d="M201.4 374.6c12.5 12.5 32.8 12.5 45.3 0l160-160c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 306.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160z" />
    </svg>
  );
};

const Separateemail = (user) => {
  try {
    // Try to decode JWT token
    const base64 = user.split(".")[1];
    if (base64) {
      const json = atob(base64.replace(/-/g, "+").replace(/_/g, "/"));
      const payload = JSON.parse(json);
      return payload?.email || payload?.user?.email || payload?.sub || user;
    }
  } catch {}
  
  // Legacy format
  const emailMatch = user.match(/^(.+?)(\.[0-9]+)?$/);
  return emailMatch ? emailMatch[1] : user;
};

const getUserName = (user) => {
  try {
    // Try to decode JWT token for name
    const base64 = user.split(".")[1];
    if (base64) {
      const json = atob(base64.replace(/-/g, "+").replace(/_/g, "/"));
      const payload = JSON.parse(json);
      return payload?.name || payload?.brokername || payload?.username || null;
    }
  } catch {}
  return null;
};

const ExtendedProfile = ({ dropopen, router, user, setDropOpen }) => {
  const email = Separateemail(user);
  const isBroker = !!Cookies.get("broker");
  const isOwner = !!Cookies.get("owner");
  const isUser = !!Cookies.get("user") && !isOwner && !isBroker;
  
  const handleLogout = () => {
    Cookies.remove("user");
    Cookies.remove("owner");
    Cookies.remove("broker");
    setDropOpen(false);
    window.location.reload(); // This will force a full page reload
    // Alternatively, you could use router.refresh() for Next.js 13+ but it might not clear all states
  };

  const handleMenuClick = (action) => {
    setDropOpen(false);
    action();
  };

  return (
    <>
      {dropopen && (
        <div className="absolute top-[14vh] left-0 right-0 bg-[#fff] shadow-lg rounded-lg px-6 py-4 z-[999] mx-2">
          {!isBroker && (
            <ul className="space-y-2">
              {isUser && (
                <li
                  className="flex cursor-pointer text-lg text-center hover:text-gray-500"
                  onClick={() => handleMenuClick(() => router.push(`/wishlist?email=${email}`))}
                >
                  <HeartIcon />
                  Wishlist
                </li>
              )}
              <li
                className="flex cursor-pointer text-lg text-center hover:text-gray-500"
                onClick={() => handleMenuClick(() => router.push('/profile'))}
              >
                <ProfileIcon />
                Profile
              </li>
            </ul>
          )}
          <button
            className={`bg-red-500 text-white px-4 py-1 rounded-md w-full ${!isBroker ? 'mt-4' : ''}`}
            onClick={handleLogout}
          >
            <span className="text-nowrap">Log Out</span>
          </button>
        </div>
      )}
    </>
  );
};

const Profile = ({ user }) => {
  const [dropopen, setDropOpen] = useState(false);
  const router = useRouter();
  const email = Separateemail(user);
  const name = getUserName(user);
  const initial = name ? name.charAt(0).toUpperCase() : email.charAt(0).toUpperCase();
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropOpen(false);
      }
    };

    if (dropopen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropopen]);

  return (
    <div className="relative w-full h-full lg:h-auto" ref={dropdownRef}>
      {/* Profile Bar - Desktop (Sidebar) Version */}
      <div 
        onClick={() => setDropOpen(!dropopen)}
        className="hidden lg:flex items-center gap-3 p-3 bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg cursor-pointer hover:shadow-md transition-all mb-4"
      >
        {/* Avatar with Initial */}
        <div className="bg-[#ff5d00] flex justify-center items-center text-white font-bold rounded-full w-12 h-12 flex-shrink-0">
          {initial}
        </div>
        
        {/* Name and Email */}
        <div className="flex-1 overflow-hidden">
          {name && (
            <p className="font-semibold text-gray-800 truncate text-base">
              {name}
            </p>
          )}
          <p className="text-sm text-gray-600 truncate">
            {email}
          </p>
        </div>
        
        {/* Dropdown Arrow */}
        <AngleDown setDropOpen={setDropOpen} dropopen={dropopen} />
      </div>

      {/* Profile Bar - Mobile (Compact) Version */}
      <div 
        onClick={() => setDropOpen(!dropopen)}
        className="flex justify-end lg:hidden items-center gap-2 p-2 cursor-pointer mb-4"
      >
        {/* Avatar with Initial */}
        <div className="bg-amber-100 text-[#ff5d00] flex justify-center items-center font-bold rounded-full w-10 h-10 flex-shrink-0">
          {initial}
        </div>
        
        {/* Dropdown Arrow */}
        <AngleDown setDropOpen={setDropOpen} dropopen={dropopen} />
      </div>
      
      <ExtendedProfile dropopen={dropopen} router={router} user={user} setDropOpen={setDropOpen} />
    </div>
  );
};

export default Profile;
