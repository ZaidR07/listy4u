import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";

import { useRouter } from "next/navigation";

import axiosInstance from "@/lib/axios";
import Cookies from "js-cookie";

import { ChevronDown } from "lucide-react";
import { motion } from "framer-motion";
import Sidebar from "./Sidebar";
import DealerLogin from "./DealerLogin";
import Register from "./Register";
import { useSelector, useDispatch } from "react-redux"; // ✅ correct
import { setlocation } from "@/slices/locationSlice";

const TrendIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={15}
      fill="#6b7280"
      viewBox="0 0 576 512"
    >
      <path d="M384 160c-17.7 0-32-14.3-32-32s14.3-32 32-32l160 0c17.7 0 32 14.3 32 32l0 160c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-82.7L342.6 374.6c-12.5 12.5-32.8 12.5-45.3 0L192 269.3 54.6 406.6c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l160-160c12.5-12.5 32.8-12.5 45.3 0L320 306.7 466.7 160 384 160z" />
    </svg>
  );
};

const AngleDown = ({width}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      width={width}
      fill="#2b2a2a"
    >
      <path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" />
    </svg>
  );
};

const HamIcon = ({ setOpenSidebar, opensidebar }) => {
  return (
    <motion.svg
      xmlns="http://www.w3.org/2000/svg"
      width={28}
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

const DesktopNav = () => {
  const router = useRouter();
  const [buydropopen, setBuydropopen] = useState(false);
  const [rentdropopen, setRentdropopen] = useState(false); // State for Rent dropdown
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [propertytypelist, setPropertytypelist] = useState([]);
  const [currentcategory, setCurrentCategory] = useState(1);
  const [currentRentCategory, setCurrentRentCategory] = useState(1); // State for Rent category
  const [locationlist, setLocationlist] = useState([]);

  const [opensidebar, setOpenSidebar] = useState();
  const [forownersopen, setForOwnersOpen] = useState(false);
  const [fordealeropen, setFordealerOpen] = useState(false);
  const [dealerLoginOpen, setDealerLoginOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);

  const locationstate = useSelector((state: any) => state.location.location); // ✅ useSelector

  const dispatch = useDispatch();

  const loaddata = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axiosInstance.get('/api/getspecificvariable', {
        params: { category: "propertytypelist" },
      });

      const response2 = await axiosInstance.get('/api/getspecificvariable', {
        params: { category: "locationlist" },
      });

      if (response.data.payload.length > 0) {
        setPropertytypelist(response.data.payload);
      } else {
        setPropertytypelist([]);
      }

      if (response2.data.payload.length > 0) {
        setLocationlist(response2.data.payload);
      } else {
        setLocationlist([]);
      }
    } catch (error) {
      setError("Failed to load property types");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loaddata();
  }, [loaddata]);

  const [user, setUser] = useState(null); // State for user
  const [usertype, setUserType] = useState(null);
  const [location, setLocation] = useState(null);
  const [broker, setBroker] = useState(null); // State for broker

  const ownerCookie = Cookies.get("owner"); // Using js-cookie
  const userCookie = Cookies.get("user"); // User cookie
  const brokerCookie = Cookies.get("broker"); // Check broker cookie

  const decodeUserRole = (): { role?: string } => {
    try {
      const token = Cookies.get("owner") || Cookies.get("user");
      if (!token) return {};
      const payload = JSON.parse(atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")));
      return { role: payload?.role };
    } catch {
      return {};
    }
  };

  const handlePostPropertyClick = () => {
    
    if (brokerCookie) {
      router.push("/postproperty?who=broker");
      return;
    }
    if (ownerCookie) {
      router.push("/postproperty?who=owner");
      return;
    }
    alert("Please login as Owner or Dealer");
  };

  const getUserCookie = () => {
    if (ownerCookie) {
      try {
        setUser(ownerCookie);
        const decoded = decodeUserRole();
        if (decoded.role === "owner") setUserType(2);
        else setUserType(1);
      } catch {
        setUser(ownerCookie); // Fallback if not JSON
      }
    }
    if (brokerCookie) {
      setBroker(brokerCookie);
    }
  };

  // Extract user from cookies
  useEffect(() => {
    getUserCookie();
  }, [ownerCookie, brokerCookie, locationstate]);

  return (
    <nav className="relative hidden w-full h-full lg:flex shadow-md items-center px-[1%]">
      <ul className="flex w-[44.5%] max-w-[44.5%] lg:gap-6 xl:gap-10 text-base justify-end">
        {locationstate && (
          <span
            onClick={() => {
              dispatch(setlocation(""));
            }}
            className="flex items-center gap-2 lg:text-sm xl:text-base cursor-pointer"
          >
            <LocationIcon /> {locationstate}
          </span>
        )}

        {/* Buy Dropdown */}
        <li
          className="flex gap-2 cursor-pointer "
          onMouseEnter={() => {
            setBuydropopen(true);
            setRentdropopen(false);
          }}
        >
          <span className="lg:text-sm xl:text-base flex items-center">Buy</span>
          <AngleDown width={13}/>
        </li>
        {buydropopen && !loading && (
          <div
            className={`flex absolute left-[8%] top-[18vh] bg-[#fff] ${
              currentcategory != 4 ? "w-[60%]" : "w-[40%]"
            }  shadow-lg rounded-lg`}
            onMouseLeave={() => setBuydropopen(false)}
          >
            {/* Category List */}
            <ul
              className={`${
                currentcategory != 4 ? "w-1/3" : "w-1/2"
              }  text-lg border-r pl-12 py-12 rounded-t-lg rounded-b-lg bg-[#fae5d8]`}
            >
              <li className="text-xl -mt-6 mb-2  -ml-4">Buying Options</li>
              <li
                className={`cursor-pointer  ${
                  currentcategory === 1 ? "text-[#FF5D00]" : ""
                }`}
                onClick={() => setCurrentCategory(1)}
              >
                Residential
              </li>
              <li
                className={`cursor-pointer py-2  ${
                  currentcategory === 2 ? "text-[#FF5D00]" : ""
                }`}
                onClick={() => setCurrentCategory(2)}
              >
                Commercial
              </li>
              <li
                className={`cursor-pointer py-2  ${
                  currentcategory === 3 ? "text-[#FF5D00]" : ""
                }`}
                onClick={() => setCurrentCategory(3)}
              >
                Plots / Land
              </li>
              <li
                className={`cursor-pointer py-2  ${
                  currentcategory === 4 ? "text-[#FF5D00]" : ""
                }`}
                onClick={() => setCurrentCategory(4)}
              >
                Trending Areas
              </li>
            </ul>

            {/* Property Type List */}
            {currentcategory != 4 ? (
              <ul
                className={`text-base text-gray-500 ${
                  currentcategory != 4 ? "w-1/3" : "w-1/2"
                }   border-r pl-12 py-12`}
              >
                {propertytypelist?.length > 0 ? (
                  propertytypelist
                    .filter((item) => item.category === currentcategory)
                    .map((item, index) => (
                      <li key={index} className="cursor-pointer py-2">
                        <a
                          href={`/buyproperties?type=${item.name}&view=Sale`}
                          target="_self"
                          rel="noopener noreferrer"
                          className="block w-full"
                        >
                          {item.name}
                        </a>
                      </li>
                    ))
                ) : (
                  <li>No property types found</li>
                )}
              </ul>
            ) : (
              <ul
                className={`text-base text-gray-500 ${
                  currentcategory != 4 ? "w-1/3" : "w-1/2"
                }   border-r pl-12 py-12`}
              >
                {locationlist?.length > 0 ? (
                  locationlist.map((item, index) => (
                    <div className="flex gap-2">
                      <li key={index} className="cursor-pointer py-2">
                        <a
                          href={`/buyproperties?type=${item}&view=Sale`}
                          target="_self"
                          rel="noopener noreferrer"
                          className="block w-full"
                        >
                          {item}
                        </a>
                      </li>

                      <TrendIcon />
                    </div>
                  ))
                ) : (
                  <li>No Locations found</li>
                )}
              </ul>
            )}

            {/* Property Image */}
            {currentcategory != 4 && (
              <div className="w-1/3 flex items-center justify-center px-4">
                <img
                  src={
                    currentcategory === 1
                      ? "/Residential.jpg"
                      : currentcategory === 2
                      ? "/Commercial.jpg"
                      : currentcategory === 3
                      ? "/Land.jpg"
                      : "/Trending.jpg"
                  }
                  alt="property image"
                  className="w-full h-auto rounded-lg"
                />
              </div>
            )}
          </div>
        )}

        {/* Rent Dropdown */}
        <li
          className="flex gap-2 cursor-pointer"
          onMouseEnter={() => {
            setRentdropopen(true);
            setBuydropopen(false);
          }}
        >
          <span className="lg:text-sm xl:text-base flex items-center">Rent</span>
          <AngleDown width={13} />
        </li>
        {rentdropopen && !loading && (
          <div
            className={`flex absolute left-[8%] top-[18vh] bg-[#fff] ${
              currentRentCategory != 4 ? "w-[60%]" : "w-[40%]"
            }  shadow-lg rounded-lg`}
            onMouseLeave={() => setRentdropopen(false)}
          >
            {/* Category List */}
            <ul
              className={`${
                currentRentCategory != 4 ? "w-1/3" : "w-1/2"
              }  text-lg border-r pl-12 py-12 rounded-t-lg rounded-b-lg bg-[#fae5d8]`}
            >
              <li className="text-xl -mt-6 mb-2  -ml-4">Renting Options</li>
              <li
                className={`cursor-pointer  ${
                  currentRentCategory === 1 ? "text-[#FF5D00]" : ""
                }`}
                onClick={() => setCurrentRentCategory(1)}
              >
                Residential
              </li>
              <li
                className={`cursor-pointer py-2  ${
                  currentRentCategory === 2 ? "text-[#FF5D00]" : ""
                }`}
                onClick={() => setCurrentRentCategory(2)}
              >
                Commercial
              </li>
              <li
                className={`cursor-pointer py-2  ${
                  currentRentCategory === 3 ? "text-[#FF5D00]" : ""
                }`}
                onClick={() => setCurrentRentCategory(3)}
              >
                Plots / Land
              </li>
              <li
                className={`cursor-pointer py-2  ${
                  currentRentCategory === 4 ? "text-[#FF5D00]" : ""
                }`}
                onClick={() => setCurrentRentCategory(4)}
              >
                Trending Areas
              </li>
            </ul>

            {/* Property Type List */}
            {currentRentCategory != 4 ? (
              <ul
                className={`text-base text-gray-500 ${
                  currentRentCategory != 4 ? "w-1/3" : "w-1/2"
                } border-r pl-12 py-12`}
              >
                {propertytypelist?.length > 0 ? (
                  propertytypelist
                    .filter((item) => item.category === currentRentCategory)
                    .map((item, index) => (
                      <li key={index} className="cursor-pointer py-2">
                        <a
                          href={`/buyproperties?type=${item.name}&view=Rent`}
                          target="_self"
                          rel="noopener noreferrer"
                          className="block w-full"
                        >
                          {item.name}
                        </a>
                      </li>
                    ))
                ) : (
                  <li>No property types found</li>
                )}
              </ul>
            ) : (
              <ul
                className={`text-base text-gray-500 ${
                  currentRentCategory != 4 ? "w-1/3" : "w-1/2"
                } border-r pl-12 py-12`}
              >
                {locationlist?.length > 0 ? (
                  locationlist.map((item, index) => (
                    <div key={index} className="flex gap-2">
                      <li className="cursor-pointer py-2">
                        <a
                          href={`/buyproperties?type=${item}&view=Rent`}
                          target="_self"
                          rel="noopener noreferrer"
                          className="block w-full"
                        >
                          {item}
                        </a>
                      </li>

                      <TrendIcon />
                    </div>
                  ))
                ) : (
                  <li>No Locations found</li>
                )}
              </ul>
            )}

            {/* Property Image */}
            {currentRentCategory != 4 && (
              <div className="w-1/3 flex items-center justify-center px-4">
                <img
                  src={
                    currentRentCategory === 1
                      ? "/Residential.jpg"
                      : currentRentCategory === 2
                      ? "/Commercial.jpg"
                      : currentRentCategory === 3
                      ? "/Land.jpg"
                      : "/Trending.jpg"
                  }
                  alt="property image"
                  className="w-full h-auto rounded-lg"
                />
              </div>
            )}
          </div>
        )}

        <li className="flex items-center gap-2 cursor-pointer">
          <a
            href={`/buyproperties?view=Pg`}
            target="_self"
            rel="noopener noreferrer"
            className="block w-full lg:text-sm xl:text-base"
          >
            PG
          </a>{" "}
        </li>
        <li
          className="cursor-pointer lg:text-sm xl:text-base flex items-center"
          onClick={() => router.push("/brokerslist")}
        >
          Find an Agent
        </li>
      </ul>
      <div className="flex lg:w-[6%] w-[8%] mx-[2%]  justify-center ">
        <Image
          src="/logo.jpg"
          width={80}
          height={80}
          alt="logo"
          className=""
          onClick={() => router.push("/")}
        />
      </div>

      <div className="flex lg:gap-2 xl:gap-6 items-center w-[44.5%] max-w-[44.5%]">
        <ul className="flex gap-6  text-base 2xl:text-lg">
          <li
            className="cursor-pointer  lg:text-sm xl:text-base 2xl:text-base flex items-center gap-2"
            onMouseEnter={() => setForOwnersOpen(true)}
            onClick={() => router.push("/")}
          >
            <span>For&nbsp;Owners</span>
            <AngleDown width={13}/>
          </li>
          {forownersopen && (
            <div
              onMouseLeave={() => setForOwnersOpen(false)}
              className="absolute top-[10vh] gap-2 px-4 py-5 bg-[#fff] shadow-inner rounded-lg flex flex-col"
            >
              {usertype == 2 || usertype == "2" ? (
                <a
                  className="hover:text-orange-500 hover:underline lg:text-sm xl:text-sm cursor-pointer"
                  href="postproperty?who=owner"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Post Property
                </a>
              ) : (
                <span
                  className="lg:text-sm 2xl:text-base cursor-pointer"
                  onClick={() => { 
                    if (brokerCookie) {
                      alert("You are currently logged in as Dealer. Please logout and login as Owner.");
                      return;
                    }
                    setForOwnersOpen(false); 
                    setRegisterOpen(true); 
                  }}
                >
                  Post Property
                </span>
              )}

              <hr />
              {user ? (
                usertype == 2 || usertype == "2" ? (
                  <a
                    className="hover:text-orange-500 hover:underline lg:text-sm 2xl:text-base cursor-pointer"
                    href="viewpostedproperty"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View / Edit Post
                  </a>
                ) : (
                  <>
                    <span
                      className="lg:text-sm 2xl:text-base cursor-pointer"
                      onClick={() => { 
                        if (brokerCookie) {
                          alert("You are currently logged in as Dealer. Please logout and login as Owner.");
                          return;
                        }
                        setForOwnersOpen(false); 
                        setRegisterOpen(true); 
                      }}
                    >
                      View / Edit Post
                    </span>
                  </>
                )
              ) : (
                <span
                  className="lg:text-sm 2xl:text-base cursor-pointer"
                  onClick={() => { 
                    if (brokerCookie) {
                      alert("You are currently logged in as Dealer. Please logout and login as Owner.");
                      return;
                    }
                    setForOwnersOpen(false); 
                    setRegisterOpen(true); 
                  }}
                >
                  View / Edit Post
                </span>
              )}
            </div>
          )}
          <li
            className="cursor-pointer flex gap-2 lg:text-sm xl:text-base 2xl:text-base"
            onMouseEnter={() => setFordealerOpen(true)}
          >
            <span>For&nbsp;Dealers</span>
            <AngleDown width={13} />
            {fordealeropen && (
              <div
                onMouseLeave={() => setFordealerOpen(false)}
                className="absolute top-[10vh] ml-8 gap-2 px-4 py-5 bg-[#fff] shadow-inner rounded-lg flex flex-col"
              >
                {broker ? (
                  <>
                    <a
                      className="hover:text-orange-500 hover:underline lg:text-xs  2xl:text-base"
                      href="/postproperty?who=broker"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Post Property
                    </a>
                    <a
                      className="hover:text-orange-500 hover:underline lg:text-xs  2xl:text-base"
                      href="/viewpostedproperty?who=broker"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View / Edit Post
                    </a>
                  </>
                ) : (
                  <>
                    <span
                      className="hover:text-orange-500 hover:underline lg:text-sm  2xl:text-base cursor-pointer"
                      onClick={() => {
                        if (ownerCookie || userCookie) {
                          alert("You are currently logged in as Owner/User. Please logout and login as Dealer.");
                          return;
                        }
                        setFordealerOpen(false);
                        setRegisterOpen(true);
                      }}
                    >
                      Post Property
                    </span>
                    <span
                      className="hover:text-orange-500 hover:underline lg:text-sm  2xl:text-base cursor-pointer"
                      onClick={() => {
                        if (ownerCookie || userCookie) {
                          alert("You are currently logged in as Owner/User. Please logout and login as Dealer.");
                          return;
                        }
                        setFordealerOpen(false);
                        setRegisterOpen(true);
                      }}
                    >
                      View / Edit Post
                    </span>
                  </>
                )}
                <hr />
                <a
                  className="hover:text-orange-500 hover:underline lg:text-sm  2xl:text-base"
                  href="plans?who=buildbroker"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Plans & Subscriptions
                </a>
              </div>
            )}
          </li>
        </ul>
        <button
          onClick={handlePostPropertyClick}
          className="lg:px-2 xl:px-3.5 py-2 rounded-md bg-[#fdf3da] text-[#ff5d00] lg:text-xs xl:text-sm  2xl:text-base"
        >
          Post&nbsp;Property
        </button>

        <HamIcon opensidebar={opensidebar} setOpenSidebar={setOpenSidebar} />
      </div>
      <Sidebar opensidebar={opensidebar} setOpenSidebar={setOpenSidebar} />
      <Register registeropen={registerOpen} setRegisterOpen={setRegisterOpen} />
      <DealerLogin isOpen={dealerLoginOpen} onClose={() => setDealerLoginOpen(false)} />
    </nav>
  );
};

export default DesktopNav;
