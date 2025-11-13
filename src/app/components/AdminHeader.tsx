"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";

const nav = [
  {
    icon: "dashboardsvg.svg",
    name: "Dashboard",
    width: 50,
    route: "dashboard",
  },
  {
    icon: "user.svg",
    name: "Brokers",
    width: 35,
    route: "viewbrokers",
    subnav: ["View Brokers", "Add Brokers", "Update/Remove Brokers"],
  },
  {
    icon: "home.svg",
    name: "Properties",
    width: 40,
    route: "viewproperties",
    subnav: ["View Properties", "Remove Properties"],
  },
  {
    icon: "user.svg",
    name: "Vendors",
    width: 40,
    route: "viewvendors",
    subnav: ["View Vendors", "Add Vendors", "Update/Remove Vendors"],
  },
  {
    icon: "user.svg",
    name: "Feedbacks",
    width: 40,
    route: "feedbacks",
  },
  {
    icon: "user.svg",
    name: "Complaints",
    width: 40,
    route: "complaints",
  },
  {
    icon: "settings.svg",
    name: "Settings",
    width: 50,
    route: "company",
    subnav: ["Company", "variables" ],
  },
];

const AdminHeader = ({ sidebaropen, setSidebarOpen }) => {
  const pathname = usePathname();
  const [brokermenuopen, setBrokerMenuOpen] = useState(false);
  const [propertymenuopen, setPropertyMenuOpen] = useState(false);
  const [subnavlist, setSubnavlist] = useState([]);

  // Collapse any open subnav when sidebar closes
  useEffect(() => {
    if (!sidebaropen) {
      setSubnavlist([]);
    }
  }, [sidebaropen]);

  

  const setsubnav = (name) => {
    if (subnavlist.length > 0 && subnavlist[0].name == name) {
      setSubnavlist([]);
      return;
    }

    const filteredlist = nav.filter((item) => {
      if (item.name == name) {
        return item.subnav;
      }
    });
    setSubnavlist(filteredlist);
  };

  return (
    <>
      {/* Top Bar */}
      <div className="bg-white/90 backdrop-blur w-full h-[10vh] lg:h-[12vh] shadow-md flex items-center z-[999999] fixed top-0 bottom-0 border-b border-gray-100">
        {/* Menu Icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 448 512"
          width={35}
          fill="#FF5D00"
          className={`${sidebaropen ? "hidden" : "block"} ml-4 cursor-pointer`}
          onClick={() => setSidebarOpen(true)}
          aria-label="Toggle Sidebar"
        >
          <path d="M0 96C0 78.3 14.3 64 32 64l384 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 128C14.3 128 0 113.7 0 96zM0 256c0-17.7 14.3-32 32-32l384 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 288c-17.7 0-32-14.3-32-32zM448 416c0 17.7-14.3 32-32 32L32 448c-17.7 0-32-14.3-32-32s14.3-32 32-32l384 0c17.7 0 32 14.3 32 32z" />
        </svg>

        {/* Close Icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 384 512"
          width={35}
          fill="#FF5D00"
          className={`${!sidebaropen ? "hidden" : "block"} ml-4 cursor-pointer`}
          onClick={() => { setSidebarOpen(false); setSubnavlist([]); }}
          aria-label="Close Sidebar"
        >
          <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
        </svg>

        <div className="ml-auto mr-3 mt-2 border-[#FF5D00] border-4 rounded-full w-10 h-10 grid place-content-center shadow-sm">
          <span className="text-2xl font-bold text-[#FF5D00]">F</span>
        </div>

      {/* Mobile overlay when sidebar is open */}
      <div
        className={`${sidebaropen ? "block" : "hidden"} fixed inset-0 bg-black/30 lg:hidden z-[90000]`}
        onClick={() => { setSidebarOpen(false); setSubnavlist([]); }}
        aria-hidden="true"
      />
      {/* Themed scrollbar for admin sidebar */}
      <style jsx global>{`
        .admin-sidebar::-webkit-scrollbar { width: 10px; }
        .admin-sidebar::-webkit-scrollbar-track { background: rgba(255,255,255,0.15); }
        .admin-sidebar::-webkit-scrollbar-thumb { background-color: rgba(255,255,255,0.6); border-radius: 8px; border: 2px solid rgba(255,255,255,0.15); }
        .admin-sidebar { scrollbar-width: thin; scrollbar-color: rgba(255,255,255,0.6) rgba(255,255,255,0.15); }
      `}</style>
      </div>

      {/* Sidebar */}
      <div
        className={`${
          sidebaropen
            ? "lg:w-[23%]"
            : "translate-x-[-100%] lg:translate-x-0 lg:w-[12%]"
        } transition-all duration-500 ease-in-out w-full fixed top-[10vh] lg:top-[12vh] bottom-0 pt-[3vh] z-[99999] shadow-xl bg-gradient-to-b from-orange-500 to-orange-600 overflow-y-auto admin-sidebar`}
      >
        <nav className="w-full min-h-screen flex flex-col items-center gap-4 mt-[3vh]">
          {nav.map((item, index) => {
            const active = pathname?.startsWith(`/${item.route}`);
            return (
            <div key={index} className="w-full flex flex-col items-center">
              <div className={`flex flex-wrap items-center lg:justify-center gap-4 mb-3 w-[70%] lg:w-[80%] min-h-[9vh] transition rounded-xl cursor-pointer px-3 py-3 backdrop-blur-sm ${active ? "bg-white/20 ring-1 ring-white/30" : "bg-white/10 hover:bg-white/15"}`}>
                <a href={`/${item.route}`} className="flex items-center gap-3" aria-current={active ? "page" : undefined} title={item.name}>
                  <Image
                    src={item.icon}
                    alt={item.name}
                    width={item.width}
                    height={30}
                    style={{ filter: "invert(1)" }}
                  />
                  <span
                    className={`text-white text-xl font-semibold ${
                      sidebaropen ? "block" : "hidden"
                    }`}
                  >
                    {item.name}
                  </span>
                </a>

                {/* Dropdown Icon */}
                {item.subnav && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`ml-auto ${sidebaropen ? "block" : "hidden"} hover:scale-110 transition`}
                    viewBox="0 0 448 512"
                    width={20}
                    fill="#fff"
                    onClick={() => setsubnav(item.name)}
                  >
                    <path d="M246.6 470.6c-12.5 12.5-32.8 12.5-45.3 0l-160-160c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L224 402.7 361.4 265.4c12.5-12.5 32.8-12.5 45.3 0s12.5 32.8 0 45.3l-160 160zm160-352l-160 160c-12.5 12.5-32.8 12.5-45.3 0l-160-160c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L224 210.7 361.4 73.4c12.5-12.5 32.8-12.5 45.3 0s12.5 32.8 0 45.3z" />
                  </svg>
                )}
                {/* Submenu for Brokers */}
                {subnavlist &&
                  subnavlist.length > 0 &&
                  subnavlist[0].name === item.name && (
                    <ul className="w-[85%] lg:w-[78%] ml-[12%] lg:ml-[35%] text-white/95 p-1 pt-0 rounded-lg">
                      {subnavlist[0].subnav.map((item, subindex) => (
                        <a
                          href={`/${item
                            .toLowerCase()
                            .replace(/\s+/g, "")
                            .replace(/[^a-z0-9-]/g, "")}`}
                          key={subindex}
                        >
                          <li className="pt-1 px-2 list-disc hover:bg-white/20 rounded-md cursor-pointer transition">
                            {item}
                          </li>
                        </a>
                      ))}
                    </ul>
                  )}
              </div>
            </div>
          );})}
        </nav>
      </div>
    </>
  );
};

export default AdminHeader;

