"use client";

import { useState } from "react";
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

const AngleDown = ({ setDropOpen }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={15}
      className="ml-2 cursor-pointer text-white lg:text-[#ff5d00]" // Apply Tailwind text color
      viewBox="0 0 448 512"
      onClick={() => setDropOpen((prev) => !prev)}
      fill="currentColor" // Ensures color changes with Tailwind classes
    >
      <path d="M201.4 374.6c12.5 12.5 32.8 12.5 45.3 0l160-160c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 306.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160z" />
    </svg>
  );
};

const Separateemail = (user) => {
  const emailMatch = user.match(/^(.+?)(\.[0-9]+)?$/);

  return emailMatch ? emailMatch[1] : user;
};

const ExtendedProfile = ({ dropopen, router, user }) => {
  const email = Separateemail(user);
  const isBroker = !!Cookies.get("broker");
  const isOwner = !!Cookies.get("owner");
  const isUser = !!Cookies.get("user") && !isOwner && !isBroker;
  
  const handleLogout = () => {
    Cookies.remove("user");
    Cookies.remove("owner");
    Cookies.remove("broker");
    window.location.reload(); // This will force a full page reload
    // Alternatively, you could use router.refresh() for Next.js 13+ but it might not clear all states
  };

  return (
    <>
      {dropopen && (
        <div className="absolute top-[8vh] right-0 bg-[#fff] shadow-lg rounded-lg px-6 py-4 z-[999] min-w-[150px]">
          <ul className="space-y-2">
            {isUser && (
              <li
                className="flex cursor-pointer text-lg text-center hover:text-gray-500"
                onClick={() => router.push(`/wishlist?email=${email}`)}
              >
                <HeartIcon />
                Wishlist
              </li>
            )}
            <li
              className="flex cursor-pointer text-lg text-center hover:text-gray-500"
              onClick={() => router.push('/profile')}
            >
              <ProfileIcon />
              Profile
            </li>
          </ul>
          <button
            className="bg-red-500 text-white px-4 py-1 rounded-md w-full mt-4"
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

  return (
    <div className="relative flex items-center">
      <div
        onClick={() => setDropOpen(true)}
        className="bg-[#fff] lg:bg-[#ff5d00] flex justify-center items-center cursor-pointer text-white lg:font-semibold rounded-full w-9 h-9 lg:w-12 lg:h-12"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          className="text-[#ff5d00] lg:text-[#fff] w-5 h-5 lg:w-7 lg:h-7"
          fill="currentColor"
        >
          <path d="M12 2a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 12c-4.418 0-8 2.239-8 5v1a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-1c0-2.761-3.582-5-8-5z" />
        </svg>
      </div>
      <AngleDown setDropOpen={setDropOpen} />
      <ExtendedProfile dropopen={dropopen} router={router} user={user} />
    </div>
  );
};

export default Profile;
