"use client";
import { useCallback, useEffect, useState } from "react";
import axiosInstance from "@/lib/axios";
import Cookies from "js-cookie";
import Profile from "./Profile";
import Register from "./Register";
import DealerLogin from "./DealerLogin";

const CloseIcon = ({ setOpenSidebar , width }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 384 512"
      fill="#130535ca"
   
      className="ml-auto mt-2  lg:w-5 xl:w-6"
      onClick={() => setOpenSidebar(false)}
    >
      <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
    </svg>
  );
};

const CircleIcon = ({ width }) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={width} viewBox="0 0 512 512">
      <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512z" />
    </svg>
  );
};

const HelpIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 320 512"
      fill="#130535ca"
      className="self-start lg:w-3 xl:w-4"

     
    >
      <path d="M80 160c0-35.3 28.7-64 64-64l32 0c35.3 0 64 28.7 64 64l0 3.6c0 21.8-11.1 42.1-29.4 53.8l-42.2 27.1c-25.2 16.2-40.4 44.1-40.4 74l0 1.4c0 17.7 14.3 32 32 32s32-14.3 32-32l0-1.4c0-8.2 4.2-15.8 11-20.2l42.2-27.1c36.6-23.6 58.8-64.1 58.8-107.7l0-3.6c0-70.7-57.3-128-128-128l-32 0C73.3 32 16 89.3 16 160c0 17.7 14.3 32 32 32s32-14.3 32-32zm80 320a40 40 0 1 0 0-80 40 40 0 1 0 0 80z" />
    </svg>
  );
};

const PhoneIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      fill="#130535ca"
      className="self-start lg:w-6 xl:w-8"
    >
      <path d="M256 48C141.1 48 48 141.1 48 256l0 40c0 13.3-10.7 24-24 24s-24-10.7-24-24l0-40C0 114.6 114.6 0 256 0S512 114.6 512 256l0 144.1c0 48.6-39.4 88-88.1 88L313.6 488c-8.3 14.3-23.8 24-41.6 24l-32 0c-26.5 0-48-21.5-48-48s21.5-48 48-48l32 0c17.8 0 33.3 9.7 41.6 24l110.4 .1c22.1 0 40-17.9 40-40L464 256c0-114.9-93.1-208-208-208zM144 208l16 0c17.7 0 32 14.3 32 32l0 112c0 17.7-14.3 32-32 32l-16 0c-35.3 0-64-28.7-64-64l0-48c0-35.3 28.7-64 64-64zm224 0c35.3 0 64 28.7 64 64l0 48c0 35.3-28.7 64-64 64l-16 0c-17.7 0-32-14.3-32-32l0-112c0-17.7 14.3-32 32-32l16 0z" />
    </svg>
  );
};
const AboutIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      fill="#130535ca"
      className="self-start w-5"
    >
      <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM216 336l24 0 0-64-24 0c-13.3 0-24-10.7-24-24s10.7-24 24-24l48 0c13.3 0 24 10.7 24 24l0 88 8 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-80 0c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-208a32 32 0 1 1 0 64 32 32 0 1 1 0-64z" />
    </svg>
  );
};

const ChevronRightIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 320 512"
      fill="#130535ca"
      className="lg:w-2.5 xl:w-4 2xl:w-5"
    >
      <path d="M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256 73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z" />
    </svg>
  );
};

const Sidebar = ({ opensidebar, setOpenSidebar }) => {
  const [locationlist, setLocationlist] = useState([]);
  const [propertytypelist, setPropertytypelist] = useState([]);
  const [firstorder, setFirstOrder] = useState();
  const [secondorder, setSecondOrder] = useState();
  const [registeropen, setRegisterOpen] = useState(false);
  const [dealerLoginOpen, setDealerLoginOpen] = useState(false);
  const [broker, setBroker] = useState(null);

  const loaddata = useCallback(async () => {
    try {
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
    } finally {
    }
  }, []);

  useEffect(() => {
    loaddata();
  }, [loaddata]);

  const [user, setUser] = useState(null); // State for user

  const userCookie = Cookies.get("user") || Cookies.get("owner"); // Using js-cookie
  const brokerCookie = Cookies.get("broker"); // Check broker cookie

  const decodeUserRole = (): { role?: string } => {
    try {
      // Check user cookie first, then owner cookie
      const userToken = Cookies.get("user");
      const ownerToken = Cookies.get("owner");
      const token = userToken || ownerToken;
      
      if (!token) return {};
      const payload = JSON.parse(atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")));
      return { role: payload?.role };
    } catch {
      return {};
    }
  };

  const getUserCookie = () => {
    if (userCookie) {
      try {
        setUser(userCookie); // store token
      } catch {
        setUser(userCookie); // Fallback if not JSON
      }
    }
    if (brokerCookie) {
      setBroker(brokerCookie);
      setUser(brokerCookie); // Set user state for broker to show profile
    }
  };

  // Extract user from cookies
  useEffect(() => {
    getUserCookie();
  }, [userCookie, brokerCookie]);

  const handleFirstOrderClick = (order) => {
    // If clicking the same item that's already open, close it

    if (firstorder === order) {
      setFirstOrder(null);
    } else {
      setFirstOrder(order);
    }
    // Always reset the second order when changing first order
    setSecondOrder(null);
  };

  const handleSecondOrderClick = (order) => {
    // If clicking the same item that's already open, close it
    if (secondorder === order) {
      setSecondOrder(null);
    } else {
      setSecondOrder(order);
    }
  };

  const navlist1 = [
    {
      nav: "For Owners",

      subnav: [
        { label: "Post Property", uri: "/postproperty?who=owner" },
        { label: "View / Edit Post", uri: "viewpostedproperty" },
      ],
      order: 1,
    },
    {
      nav: "For Buyers",
      subnav: [
        {
          label: "Residential",
          category: 1,
          supersubnav: [...propertytypelist],
          order: 2.1,
        },
        {
          label: "Commercial",
          category: 2,
          supersubnav: [...propertytypelist],
          order: 2.2,
        },
        {
          label: "Plots /  Land",
          category: 3,
          supersubnav: [...propertytypelist],
          order: 2.3,
        },
        {
          label: "Trending Areas",
          category: 4,
          supersubnav: [...locationlist],
          order: 2.4,
        },
      ],
      order: 2,
    },
    {
      nav: "For Tenants",
      subnav: [
        {
          label: "Residential",
          category: 1,
          supersubnav: [...propertytypelist],
          order: 2.1,
        },
        {
          label: "Commercial",
          category: 2,
          supersubnav: [...propertytypelist],
          order: 2.2,
        },
        {
          label: "Plots /  Land",
          category: 3,
          supersubnav: [...propertytypelist],
          order: 2.3,
        },
        {
          label: "Trending Areas",
          category: 4,
          supersubnav: [...locationlist],
          order: 2.4,
        },
      ],
      order: 3,
    },
    {
      nav: "For Dealers",
      subnav: [
        {
          label: "Post Properties",
          category: 1,
          requiresBrokerLogin: true,
          uri: "/postproperty?who=broker",
        },
        {
          label: "View / Edit Post",
          category: 2,
          requiresBrokerLogin: true,
          uri: "/viewpostedproperty?who=broker",
        },
        {
          label: "Subscription Plans",
          category: 3,
          uri: "/plans?who=broker",
        },
      ],
      order: 4,
    },
  ];

  return (
    <>
      <Register registeropen={registeropen} setRegisterOpen={setRegisterOpen} />

      <div
        className={`absolute w-[24%] h-screen px-[2%] bg-white right-0 top-0 z-50 transition-transform duration-300 ${
          opensidebar ? "translate-x-0" : "translate-x-[100%]"
        } overflow-y-scroll shadow-2xl rounded-l-2xl`}
      >
        <CloseIcon setOpenSidebar={setOpenSidebar} width = {20} />
        {user ? (
          <Profile user={user} />
        ) : (
          <button
            className="text-lg text-white px-4 lg:py-1 xl:py-1.5 lg:my-2 xl:my-4 bg-[#FF5D00] rounded-md w-full"
            onClick={() => { setRegisterOpen(true) ; setOpenSidebar(false)}}
          >
            Sign&nbsp;up
          </button>
        )}

      {navlist1.map((item, index) => (
        <div key={index}>
          <li
            className="list-none flex gap-3 text-lg cursor-pointer xl:p-2 lg:p-1 hover:bg-orange-100 lg:text-base xl:text-lg"
            onClick={() => handleFirstOrderClick(item.order)}
          >
            <ChevronRightIcon  />
            {item.nav}
          </li>

          {firstorder === item.order && (
            <div className="pl-6">
              {item.subnav.map((subnav, subIndex) => {
                const hasSupersubnav =
                  Array.isArray(subnav.supersubnav) &&
                  subnav.supersubnav.length > 0;

                return (
                  <div key={subIndex}>
                    <li
                      className={`flex items-center gap-2 ml-4 mb-2 cursor-pointer hover:text-[#ff5d00] `}
                      onClick={(e) => {
                        if (hasSupersubnav) {
                          e.stopPropagation();
                          handleSecondOrderClick(subnav.order);
                        }
                      }}
                    >
                      {hasSupersubnav ? (
                        <ChevronRightIcon />
                      ) : (
                        <CircleIcon width={6} />
                      )}
                      {hasSupersubnav ? (
                        subnav.label
                      ) : (item.nav === "For Owners" && decodeUserRole().role !== "owner") ? (
                        <span
                          onClick={(e) => {
                            e.stopPropagation();
                            if (broker) {
                              alert("You are currently logged in as Dealer. Please logout and login as Owner.");
                              return;
                            }
                            setOpenSidebar(false);
                            setRegisterOpen(true);
                          }}
                          className="block w-full text-sm xl:text-base cursor-pointer"
                        >
                          {subnav.label}
                        </span>
                      ) : subnav.requiresBrokerLogin && !broker ? (
                        <span
                          onClick={(e) => {
                            e.stopPropagation();
                            const ownerCookie = Cookies.get("owner");
                            if (ownerCookie || userCookie) {
                              alert("You are currently logged in as Owner/User. Please logout and login as Dealer.");
                              return;
                            }
                            setOpenSidebar(false);
                            setRegisterOpen(true);
                          }}
                          className="block w-full text-sm xl:text-base cursor-pointer"
                        >
                          {subnav.label}
                        </span>
                      ) : (
                        <a
                          href={`${subnav.uri}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block w-full text-sm xl:text-base"
                        >
                          {subnav.label}
                        </a>
                      )}
                    </li>

                    {secondorder === subnav.order && hasSupersubnav && (
                      <div className="ml-12">
                        {subnav.supersubnav.map((supersubnav, superIndex) => (
                          <a
                            href={`/buyproperties?type=${
                              supersubnav.name || supersubnav
                            }&view=Sale`}
                            target="_blank"
                            rel="noopener noreferrer"
                            key={superIndex}
                            className="mb-2 cursor-pointer text-sm hover:text-[#ff5d00] flex gap-2 "
                          >
                            <CircleIcon width={6} />
                            {typeof supersubnav === "string"
                              ? supersubnav
                              : supersubnav.name}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ))}

        {/* Separation div  */}
        <div className="w-full mx-[2%] bg-[#130535ca] h-[0.5px] my-[3vh] xl:my-[5vh]"></div>

        <div className="flex flex-col gap-2 text-lg ml-2">
          <div className="flex gap-2">
            <AboutIcon />
            <a href="about" target="_blank" rel="noopener noreferrer">
              About Us
            </a>
          </div>
          <div className="flex gap-2">
            <HelpIcon />
            <a
              href="contact"
              target="_blank"
              rel="noopener noreferrer"
              className="ml-2"
            >
              {" "}
              Help
            </a>
          </div>
        </div>

        <div className="w-full mx-[2%] bg-[#130535ca] h-[0.5px] my-[5vh]"></div>

        <div className="flex flex-col gap-2 text-lg ml-2">
          <div className="flex gap-2 ">
            <PhoneIcon />
            <div className="flex flex-col self-start">
              <a href="tel:+919987526731">+91 9987526731</a>
              <a href="tel:+919987048613">+91 9987048613</a>
            </div>
          </div>
        </div>
      </div>
      <DealerLogin isOpen={dealerLoginOpen} onClose={() => setDealerLoginOpen(false)} />
    </>
  );
};

export default Sidebar;
