"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import axiosInstance from "@/lib/axios";
import Cookies from "js-cookie";

const Navigationbar = ({ isOpen, setIsOpen }) => {
  const [expanded, setExpanded] = useState(null);

  const router = useRouter(); // Initialize router

  const toggleExpand = (section) => {
    setExpanded(expanded === section ? null : section);
  };

  const [variables, setVariables] = useState({
    bhklist: [],
    propertytypelist: [],
    constructionstatuslist: [],
    postedbylist: [],
    amenitieslist: [],
  });

  const [user, setUser] = useState(null); // State for user
  const [usertype, setUserType] = useState(null);

  const handleNavigation = (path) => {
    router.push(path); // Navigate to the provided path
  };

  const handleload = async () => {
    try {
      const response = await axiosInstance.get('/api/getvariables');
      if (response.status === 200) {
        setVariables(response.data.payload);
      }
    } catch (error) {
      console.error("Failed to load variables:", error);
    }
  };

  useEffect(() => {
    handleload();
  }, []);

  const ownerCookie = Cookies.get("owner");
  const userCookie = Cookies.get("user");
  const brokerCookie = Cookies.get("broker");

  const getUserCookie = () => {
    if (ownerCookie) {
      try {
        const payload = JSON.parse(atob(ownerCookie.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")));
        setUser(ownerCookie);
        setUserType(2); // Owner
      } catch {
        setUser(ownerCookie);
        setUserType(2);
      }
    } else if (userCookie) {
      try {
        const payload = JSON.parse(atob(userCookie.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")));
        setUser(userCookie);
        setUserType(1); // User
      } catch {
        setUser(userCookie);
        setUserType(1);
      }
    } else if (brokerCookie) {
      try {
        const payload = JSON.parse(atob(brokerCookie.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")));
        setUser(brokerCookie);
        setUserType(3); // Broker
      } catch {
        setUser(brokerCookie);
        setUserType(3);
      }
    }
  };

  // Extract user from cookies
  useEffect(() => {
    getUserCookie();
  }, [ownerCookie, userCookie, brokerCookie]);

  return (
    <motion.nav
      initial={{ x: "100%" }}
      animate={{ x: isOpen ? "0%" : "100%" }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
      className="w-[100vw] md:w-[60vw] pt-24 fixed md:pt-32 top-0 right-0 h-[100vh] bg-[#FF5D00] shadow-2xl p-6 flex flex-col text-white overflow-y-auto"
    >
      <ul className="space-y-4">
        {/* Buy Section */}
        <li>
          <button
            onClick={() => toggleExpand("buy")}
            className="w-full flex justify-between items-center text-lg border-b-[1px]"
          >
            <div className="flex gap-2">🏠 Buy</div>
            <span>{expanded === "buy" ? "▲" : "▼"}</span>
          </button>
          <AnimatePresence>
            {expanded === "buy" && (
              <motion.ul
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="ml-8 py-2 space-y-3 border-b-[1px] list-disc"
              >
                {variables.propertytypelist?.map((item, index) => (
                  <li
                    key={index}
                    className="text-sm cursor-pointer hover:text-gray-300"
                    onClick={() =>{
                      handleNavigation(
                        `/buyproperties?type=${item.name}&view=Sale`
                      )
                    setIsOpen(false)
                    }
                    }
                  >
                    {item.name}
                  </li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>
        </li>

        {/* For Dealers / Builders Section */}
        <li>
          <button
            onClick={() => toggleExpand("forwoners")}
            className="w-full flex justify-between items-center text-lg border-b-[1px]"
          >
            <div className="flex gap-2">🏠 For Owners</div>
            <span>{expanded === "forwoners" ? "▲" : "▼"}</span>
          </button>
          <AnimatePresence>
            {expanded === "forwoners" && (
              <motion.ul
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="ml-6 py-2 space-y-3 border-b-[1px]"
              >
                {usertype == 2 || usertype == "2" ? (
                  <li className="list-disc">
                    <span
                      className="text-sm cursor-pointer text-orange-200 hover:text-orange-500 hover:underline"
                      onClick={() => {
                        handleNavigation("/postproperty?who=owner")
                        setIsOpen(false)
                      }}
                    >
                      Post Property
                    </span>
                  </li>
                ) : (
                  <li
                    className="list-disc text-sm cursor-pointer text-orange-200 hover:text-orange-500 hover:underline"
                    onClick={() => alert("Please Register or Login as Owner")}
                  >
                    Post Property
                  </li>
                )}

                {user ? (
                  usertype == 2 || usertype == "2" ? (
                    <li className="list-disc">
                      <a
                        className="text-sm cursor-pointer text-orange-200 hover:text-orange-500 hover:underline"
                        href="viewpostedproperty"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View / Edit Post
                      </a>
                    </li>
                  ) : (
                    <li className="list-disc">
                      <span
                        className="text-sm cursor-pointer text-orange-200 hover:text-orange-500 hover:underline"
                        onClick={() =>
                          alert("This facility is for owners only")
                        }
                      >
                        View / Edit Post
                      </span>
                    </li>
                  )
                ) : (
                  <li className="list-disc">
                    <span
                      className="text-sm cursor-pointer text-orange-200 hover:text-orange-500 hover:underline"
                      onClick={() => alert("Please Register First")}
                    >
                      View / Edit Post
                    </span>
                  </li>
                )}
              </motion.ul>
            )}
          </AnimatePresence>
        </li>

        {/* For Owners Section */}
        <li>
          <button
            onClick={() => toggleExpand("forbrokers")}
            className="w-full flex justify-between items-center text-lg border-b-[1px]"
          >
            <div className="flex gap-2">👨‍💼 For Dealers / Builders</div>
            <span>{expanded === "forbrokers" ? "▲" : "▼"}</span>
          </button>
          <AnimatePresence>
            {expanded === "forbrokers" && (
              <motion.ul
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="ml-6 py-2 space-y-3 border-b-[1px]"
              >
                {usertype == 3 || usertype == "3" ? (
                  <>
                    <li className="list-disc">
                      <a
                        className="text-sm cursor-pointer hover:text-gray-300"
                        href="/postproperty?who=broker"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Post Property
                      </a>
                    </li>
                    <li className="list-disc">
                      <a
                        className="text-sm cursor-pointer hover:text-gray-300"
                        href="/viewpostedproperty?who=broker"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View / Edit Post
                      </a>
                    </li>
                  </>
                ) : (
                  <>
                    <li
                      className="list-disc text-sm"
                      onClick={() => alert("Please Login as Dealer / Builder")}
                    >
                      Post Property
                    </li>
                    <li
                      className="list-disc text-sm"
                      onClick={() => alert("Please Login as Dealer / Builder")}
                    >
                      View / Edit Post
                    </li>
                  </>
                )}

                <li className="list-disc">
                  <a
                    className="text-sm cursor-pointer hover:text-gray-300"
                    href="plans?who=buildbroker"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Plans & Subscriptions
                  </a>
                </li>
              </motion.ul>
            )}
          </AnimatePresence>
        </li>

        {/* Rent Section */}
        <li>
          <button
            onClick={() => toggleExpand("rent")}
            className="w-full flex justify-between items-center text-lg border-b-[1px]"
          >
            <div className="flex gap-2">🔑 Rent</div>
            <span>{expanded === "rent" ? "▲" : "▼"}</span>
          </button>
          <AnimatePresence>
            {expanded === "rent" && (
              <motion.ul
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="ml-6 py-2 space-y-3 border-b-[1px]"
              >
                {variables.propertytypelist?.map((item, index) => (
                  <li
                    key={index}
                    className="text-sm cursor-pointer hover:text-gray-300"
                    onClick={() =>
                      handleNavigation(
                        `/buyproperties?type=${item.name}&view=Rent`
                      )
                    }
                  >
                    {item.name}
                  </li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>
        </li>

        {/* Static Navigation Links */}
        <li
          className="text-lg border-b-[1px] cursor-pointer hover:text-gray-300"
          onClick={() => handleNavigation("/buyproperties?view=pg")}
        >
          🛏️ PG
        </li>
        <li
          className="text-lg border-b-[1px] cursor-pointer hover:text-gray-300"
          onClick={() => handleNavigation("/brokerslist")}
        >
          👨‍💼 Find an Agent
        </li>
        <li
          className="text-lg border-b-[1px] cursor-pointer hover:text-gray-300"
          onClick={() => handleNavigation("/about")}
        >
          ℹ️ About
        </li>
        <li
          className="text-lg border-b-[1px] cursor-pointer hover:text-gray-300"
          onClick={() => handleNavigation("/contact")}
        >
          🆘 Help
        </li>
      </ul>
      <button 
        className="text-[#ff5d00] bg-[#f5d7c5] rounded-md py-2 mt-6 cursor-pointer hover:bg-[#f3c5a8] transition-colors"
        onClick={() => {
          if (usertype == 2 || usertype == "2") {
            handleNavigation("/postproperty?who=owner");
          } else if (usertype == 3 || usertype == "3") {
            handleNavigation("/postproperty?who=broker");
          } else {
            alert("Please Register or Login as Owner or Dealer");
          }
        }}
      >
        Post Property
      </button>
    </motion.nav>
  );
};

export default Navigationbar;
