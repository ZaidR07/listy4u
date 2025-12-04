"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import Profile from "./Profile";
import Register from "./Register";
import Sidebar from "./Sidebar";
import axiosInstance from "@/lib/axios";

const HamIcon = ({ setOpenSidebar, opensidebar }) => {
  return (
    <motion.svg
      xmlns="http://www.w3.org/2000/svg"
      width={30}
      fill="#130535ca"
      viewBox="0 0 512 512"
      className="cursor-pointer ml-[2vw]"
      // animate={{ scale: [0.8, 1.1, 0.8] }} // Enlarges and shrinks
      // transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }} // Smooth looping
      onClick={() => setOpenSidebar(!opensidebar)} // Pass function to update state
    >
      <path d="M0 96C0 78.3 14.3 64 32 64l384 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 128C14.3 128 0 113.7 0 96zM64 256c0-17.7 14.3-32 32-32l384 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L96 288c-17.7 0-32-14.3-32-32zM448 416c0 17.7-14.3 32-32 32L32 448c-17.7 0-32-14.3-32-32s14.3-32 32-32l384 0c17.7 0 32 14.3 32 32z" />
    </motion.svg>
  );
};



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

const MicroPhone = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 384 512"
    width={14}
    fill="#FF5D00"
  >
    <path d="M96 96v160c0 53 43 96 96 96s96-43 96-96h-80c-8.8 0-16-7.2-16-16s7.2-16 16-16h80v-32h-80c-8.8 0-16-7.2-16-16s7.2-16 16-16h80v-32h-80c-8.8 0-16-7.2-16-16s7.2-16 16-16h80c0-53-43-96-96-96s-96 43-96 96zM320 240v16c0 70.7-57.3 128-128 128s-128-57.3-128-128v-40c0-13.3-10.7-24-24-24s-24 10.7-24 24v40c0 89.1 66.2 162.7 152 174.4v33.6h-48c-13.3 0-24 10.7-24 24s10.7 24 24 24h144c13.3 0 24-10.7 24-24s-10.7-24-24-24h-48v-33.6c85.8-11.7 152-85.3 152-174.4v-40c0-13.3-10.7-24-24-24s-24 10.7-24 24v24z" />
  </svg>
);

const placeholders = [
  "Search Location....",
  "Search Project....",
  "Search Society....",
  "Search Property....",
];

const Searchsection = () => {
  const router = useRouter();
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [searchText, setSearchText] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [propertyType, setPropertyType] = useState("buy");
  const [isFocused, setIsFocused] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
  const [suggestionPool, setSuggestionPool] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    let interval;
    if (!isFocused) {
      interval = setInterval(() => {
        setPlaceholderIndex(
          (prevIndex) => (prevIndex + 1) % placeholders.length
        );
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [isFocused]);

  // Load suggestions pool once (society names + locations)
  useEffect(() => {
    const loadPool = async () => {
      try {
        const res = await axiosInstance.get('/api/getproperties');
        const list = Array.isArray(res.data.payload) ? res.data.payload : [];
        const names: string[] = list
          .flatMap((p: any) => [p?.Societyname, p?.location])
          .filter((v: any) => v != null && v !== "")
          .map((s: any) => String(s).trim());
        // unique, trimmed
        const unique: string[] = Array.from(new Set(names));
        setSuggestionPool(unique);
      } catch (_) {
        setSuggestionPool([]);
      }
    };
    loadPool();
  }, []);

  // Filter suggestions based on input
  useEffect(() => {
    if (searchText.trim() && isFocused) {
      const lower = searchText.toLowerCase();
      const filtered = suggestionPool
        .filter((s) => s.toLowerCase().includes(lower))
        .slice(0, 10);
      setSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
      setSelectedSuggestionIndex(-1);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchText, isFocused, suggestionPool]);

  // Select suggestion
  const handleSuggestionClick = (s: string) => {
    setSearchText(s);
    setShowSuggestions(false);
    setIsFocused(false);
    inputRef.current?.focus();
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedSuggestionIndex((prev) => prev < suggestions.length - 1 ? prev + 1 : prev);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedSuggestionIndex((prev) => prev > 0 ? prev - 1 : -1);
    } else if (e.key === 'Enter' && selectedSuggestionIndex >= 0) {
      e.preventDefault();
      handleSuggestionClick(suggestions[selectedSuggestionIndex]);
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
      setSelectedSuggestionIndex(-1);
    }
  };

  // Start voice recognition
  const startListening = () => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Your browser does not support voice input!");
      return;
    }
    //@ts-ignore
    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setSearchText(transcript);
    };

    recognition.start();
  };

  return (
    <div className="bg-gradient-to-r from-[#FF5D00] to-[#FF7A33] px-3 lg:px-4 py-2 lg:py-0 lg:h-[10vh] ml-0 lg:ml-4 w-[62%] lg:w-[68%] rounded-full shadow-lg flex items-center gap-2 lg:gap-3">
      {/* Dropdown for Property Type */}
      <select
        className="h-9 lg:h-11 px-2 lg:px-3 border-2 border-white/20 rounded-lg outline-none bg-white text-xs text-[#FF5D00] lg:text-sm font-medium shadow-sm hover:shadow-md transition-shadow cursor-pointer"
        value={propertyType}
        onChange={(e) => setPropertyType(e.target.value)}
      >
        <option value="buy">Buy</option>
        <option value="rent">Rent</option>
        <option value="pg">PG</option>
      </select>

      {/* Animated Input Field with Suggestions */}
      <div className="relative flex-1">
        <motion.input
          ref={inputRef}
          key={isFocused ? "fixed-placeholder" : placeholderIndex}
          className="outline-none bg-white h-9 lg:h-11 px-3 lg:px-5 text-sm lg:text-base w-full text-gray-700 rounded-lg shadow-sm focus:shadow-md transition-shadow placeholder:text-gray-400"
          type="text"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder={isFocused ? "" : placeholders[placeholderIndex]}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onKeyDown={handleKeyDown}
        />
        {showSuggestions && (
          <motion.div
            className="absolute top-full left-0 w-full bg-white shadow-xl rounded-lg mt-2 max-h-60 overflow-y-auto z-10 border border-gray-100"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            {suggestions.map((s, idx) => (
              <div
                key={`${s}-${idx}`}
                className={`px-4 py-3 text-sm lg:text-base text-gray-700 cursor-pointer hover:bg-orange-50 hover:text-[#FF5D00] transition-colors ${
                  idx === selectedSuggestionIndex ? "bg-orange-50 text-[#FF5D00]" : ""
                }`}
                onMouseDown={() => handleSuggestionClick(s)}
              >
                {s}
              </div>
            ))}
          </motion.div>
        )}
      </div>

      {/* Voice Input Button */}
      <button
        onClick={startListening}
        className="h-9 w-9 lg:h-11 lg:w-11 flex items-center justify-center bg-white rounded-full shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200"
        title="Voice Search"
      >
        <MicroPhone />
      </button>

      {/* Search Button */}
      <a
        href={`/buyproperties?search=${encodeURIComponent(searchText)}&view=${
          propertyType === 'buy' ? 'Sale' : propertyType === 'rent' ? 'Rent' : 'Pg'
        }`}
        target="_blank"
        rel="noopener noreferrer"
        className="px-3 lg:px-5 h-9 lg:h-11 flex items-center bg-white hover:bg-gray-50 rounded-lg text-xs lg:text-sm text-[#FF5D00] font-semibold text-center shadow-md hover:shadow-lg transition-all duration-200"
        onClick={(e) => {
          if (!searchText.trim()) {
            e.preventDefault();
            alert("Please enter a search term!");
          }
        }}
      >
        Search
      </a>
    </div>
  );
};

const PropertiesNav = () => {
  const router = useRouter();

  const [user, setUser] = useState(null); // State for user
  const [registeropen, setRegisterOpen] = useState(false);
  const [opensidebar, setOpenSidebar] = useState(false);

  const userCookie = Cookies.get("user") || Cookies.get("owner"); // Using js-cookie
  const brokerCookie = Cookies.get("broker");

  const getUserCookie = () => {
    if (userCookie) {
      try {
        setUser(userCookie); // Store token
      } catch {
        setUser(userCookie); // Fallback if not JSON
      }
    }
    if (brokerCookie) {
      setUser(brokerCookie); // Set user state for broker to show profile
    }
  };

  // Extract user from cookies
  useEffect(() => {
    getUserCookie();
  }, [userCookie, brokerCookie]);

  return (
    <nav className="w-full justify-between shadow-lg bg-white items-center fixed top-0 z-[999] flex px-[2%] lg:px-[2.5%] py-2 lg:py-0 border-b border-gray-100">
      <Register registeropen={registeropen} setRegisterOpen={setRegisterOpen} />
      <Image
        src="/logo.jpg"
        width={80}
        height={80}
        alt="logo"
        className="cursor-pointer hover:opacity-80 transition-opacity"
        onClick={() => router.push("/")}
      />
      {/* <Searchsection /> */}
      
      <div>
        <HamIcon opensidebar={opensidebar} setOpenSidebar={setOpenSidebar} />
      </div>
      <Sidebar opensidebar={opensidebar} setOpenSidebar={setOpenSidebar} />
    </nav>
  );
};

export default PropertiesNav;
