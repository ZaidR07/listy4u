"use client";
import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

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

const Searchsection = ({ buildings }) => {
  const router = useRouter();
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [searchText, setSearchText] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [propertyType, setPropertyType] = useState("buy");
  const [isFocused, setIsFocused] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
  const inputRef = useRef(null);

  // Handle placeholder animation
  useEffect(() => {
    let interval;
    if (!isFocused) {
      interval = setInterval(() => {
        setPlaceholderIndex((prevIndex) => (prevIndex + 1) % placeholders.length);
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [isFocused]);

  // Filter suggestions based on searchText
  useEffect(() => {
    if (searchText.trim() && isFocused) {
      const filtered = buildings.filter((building) => {
        const searchLower = searchText.toLowerCase();
        // Handle if building is an object with buildingname property
        if (typeof building === 'object' && building.buildingname) {
          return building.buildingname.toLowerCase().includes(searchLower);
        }
        // Handle if building is a string
        if (typeof building === 'string') {
          return building.toLowerCase().includes(searchLower);
        }
        return false;
      });
      setSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
      setSelectedSuggestionIndex(-1); // Reset selection when suggestions change
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchText, isFocused, buildings]);

  // Start voice recognition
  const startListening = () => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Your browser does not support voice input!");
      return;
    }
    // @ts-ignore
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

  // Handle selecting a suggestion
  const handleSuggestionClick = (suggestion) => {
    const searchText = typeof suggestion === 'object' && suggestion.buildingname 
      ? suggestion.buildingname 
      : suggestion;
    setSearchText(searchText);
    setShowSuggestions(false);
    setIsFocused(false);
    inputRef.current.focus();
  };

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (!showSuggestions) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedSuggestionIndex((prev) =>
        prev < suggestions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedSuggestionIndex((prev) => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === "Enter" && selectedSuggestionIndex >= 0) {
      e.preventDefault();
      handleSuggestionClick(suggestions[selectedSuggestionIndex]);
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
      setSelectedSuggestionIndex(-1);
    }
  };

  // Handle Search Navigation
  const handleSearch = () => {
    if (!searchText.trim()) {
      alert("Please enter a search term!");
      return;
    }
    const view = propertyType === 'buy' ? 'Sale' : propertyType === 'rent' ? 'Rent' : 'Pg';
    router.push(`/buyproperties?search=${encodeURIComponent(searchText)}&view=${view}`);
  };

  return (
    <div className=" w-[85%] lg:w-[60%] lg:ml-[20%] bg-white shadow-xl px-6 py-2 md:py-4 rounded-xl -mt-[3vh] lg:-mt-[18vh] z-[49] absolute ml-[6.5%] flex items-center gap-2">
      {/* Dropdown for Property Type */}
      <select
        className="p-1 md:p-2 border lg:border-2 rounded-md text-gray-600 bg-white text-xs md:text-lg lg:text-base"
        value={propertyType}
        onChange={(e) => setPropertyType(e.target.value)}
      >
        <option value="buy">Buy</option>
        <option value="rent">Rent</option>
        <option value="pg">PG</option>
      </select>

      {/* Animated Input Field */}
      <div className="relative flex-1">
        <motion.input
          ref={inputRef}
          className="bg-transparent outline-none text-sm md:text-base lg:text-lg w-full md:pl-6 text-gray-600"
          type="text"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder={isFocused ? "" : placeholders[placeholderIndex]}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)} // Removed setTimeout
          onKeyDown={handleKeyDown}
          tabIndex={0} // Ensure input is focusable
        />

        {/* Suggestions Dropdown */}
        {showSuggestions && (
          <motion.div
            className="absolute top-full -left-[10vw] lg:left-0 w-[50vw] lg:w-full bg-white shadow-lg rounded-md mt-1 max-h-60 overflow-y-auto z-10"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            {suggestions.map((suggestion, index) => {
              const displayText = typeof suggestion === 'object' && suggestion.buildingname 
                ? suggestion.buildingname 
                : suggestion;
              const key = typeof suggestion === 'object' ? suggestion._id || index : suggestion;
              
              return (
                <div
                  key={key}
                  className={`px-4 py-2 text-sm lg:text-base text-gray-600 cursor-pointer hover:bg-gray-100 ${
                    index === selectedSuggestionIndex ? "bg-gray-100" : ""
                  }`}
                  onMouseDown={() => handleSuggestionClick(suggestion)} // Use onMouseDown to handle click before blur
                >
                  {displayText}
                </div>
              );
            })}
          </motion.div>
        )}
      </div>

      {/* Voice Input Button */}
      <button
        onClick={startListening}
        className="p-2 lg:p-4 bg-orange-100 rounded-full lg:mr-3"
      >
        <MicroPhone />
      </button>

      {/* Search Button */}
      <button
        onClick={handleSearch}
        className="px-2 lg:px-6 lg:py-2 py-1 bg-[#FF5D00] rounded-md text-xs md:text-lg md:py-2 md:px-4 lg:text-base text-white"
      >
        Search
      </button>
    </div>
  );
};

export default Searchsection;