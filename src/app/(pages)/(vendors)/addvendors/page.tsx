"use client";
import { useState, useEffect } from "react";
import AdminHeader from "@/app/components/AdminHeader";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axiosInstance from "@/lib/axios";

const Page = () => {
  const [formdata, setFormdata] = useState({
    vendorname: "",
    category: "",
    companyname: "",
    emailid: "",
    mobile1: "",
    mobile2: "",
    address: "",
    photo: null,
    servicelocations: [],
  });

  // Location dropdown states
  const [locationList, setLocationList] = useState([]);
  const [locationSearch, setLocationSearch] = useState("");
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [selectedLocations, setSelectedLocations] = useState([]);
  const categories = [
    {
      id: 1,
      label: "Home Interior",
      emoji: "🛋️",
    },
    {
      id: 2,
      label: "Modular Kitchen",
    },
    {
      id: 3,
      label: "Plumbing",
      emoji: "🚿",
    },
    {
      id: 4,
      label: "Electric",
      emoji: "💡",
    },
    {
      id: 5,
      label: "Broadband",
      emoji: "🛜",
    },
    {
      id: 6,
      label: "Pest Control",
      emoji: "🪳",
    },
    {
      id: 7,
      label: "Hardwares",
      emoji: "🏪🛠️",
    },
    {
      id: 8,
      label: "Furniture",
      emoji: "🛏️",
    },
    {
      id: 9,
      label: "Painter",
    },
    {
      id: 10,
      label: "Carpenter",
    },
    {
      id: 11,
      label: "HouseKeeping / Maid",
    },
    {
      id: 12,
      label: "Deep Cleaners",
    },
    {
      id: 13,
      label: "AC Services",
    },
    {
      id: 14,
      label: "Legal Works",
    },
  ];

  const [sidebaropen, setSidebarOpen] = useState(false);

  // Fetch location list
  useEffect(() => {
    const fetchLocationList = async () => {
      try {
        const response = await axiosInstance.get(
          "/api/getspecificvariable?category=locationlist"
        );
        if (response.data.payload) {
          setLocationList(response.data.payload);
        }
      } catch (error) {
        console.error("Error fetching location list:", error);
      }
    };
    fetchLocationList();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        showLocationDropdown &&
        !event.target.closest(".location-dropdown-container")
      ) {
        setShowLocationDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showLocationDropdown]);

  // Handle location selection
  const handleLocationSelect = (location) => {
    if (!selectedLocations.includes(location)) {
      const newSelectedLocations = [...selectedLocations, location];
      setSelectedLocations(newSelectedLocations);
      setFormdata((prev) => ({
        ...prev,
        servicelocations: newSelectedLocations,
      }));
    }
    setLocationSearch("");
    setShowLocationDropdown(false);
  };

  // Handle location removal
  const handleLocationRemove = (locationToRemove) => {
    const newSelectedLocations = selectedLocations.filter(
      (loc) => loc !== locationToRemove
    );
    setSelectedLocations(newSelectedLocations);
    setFormdata((prev) => ({
      ...prev,
      servicelocations: newSelectedLocations,
    }));
  };

  // Filter locations based on search
  const filteredLocations = locationList.filter(
    (location) =>
      location.toLowerCase().includes(locationSearch.toLowerCase()) &&
      !selectedLocations.includes(location)
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormdata((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setFormdata((prevData) => ({
      ...prevData,
      photo: e.target.files[0],
    }));
  };

  const handleCategorychange = (e) => {
    const { name, value } = e.target;

    if (value !== "0") {
      setFormdata((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    Object.keys(formdata).forEach((key) => {
      if (key === "servicelocations") {
        // Convert array to JSON string for form data
        if (formdata[key] && formdata[key].length > 0) {
          formDataToSend.append(key, JSON.stringify(formdata[key]));
        }
      } else if (formdata[key]) {
        formDataToSend.append(key, formdata[key]);
      }
    });

    try {
      const response = await axiosInstance.post(
        "/api/addvendor",
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.data?.message) {
        toast.success(`${response.data.message}`);
        setFormdata({
          vendorname: "",
          category: "",
          companyname: "",
          emailid: "",
          mobile1: "",
          mobile2: "",
          address: "",
          photo: null,
          servicelocations: [],
        });
      } else {
        toast.error("Unexpected response format");
      }
    } catch (error) {
      toast.error("Failed to add broker. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader sidebaropen={sidebaropen} setSidebarOpen={setSidebarOpen} />

      <div
        className={`${
          sidebaropen ? "lg:ml-[23%]" : "lg:ml-[12%]"
        } transition-all duration-500 pt-[12vh] px-4 lg:px-8 pb-8`}
      >
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
            Add Vendor
          </h1>
          <form
            className="p-6 lg:p-8 bg-white rounded-2xl shadow-lg"
            onSubmit={handleSubmit}
          >
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Vendor Name <span className="text-red-500">*</span>
              </label>
              <input
                name="vendorname"
                value={formdata.vendorname}
                onChange={handleChange}
                type="text"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition"
                placeholder="Enter vendor name"
                required
              />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                name="category"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition"
                onChange={handleCategorychange}
                required
              >
                <option value="0">Select a category</option>
                {categories?.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Company Name
              </label>
              <input
                name="companyname"
                value={formdata.companyname}
                onChange={handleChange}
                type="text"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition"
                placeholder="Enter company name"
              />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Id <span className="text-red-500">*</span>
              </label>
              <input
                name="emailid"
                value={formdata.emailid}
                onChange={handleChange}
                type="email"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition"
                placeholder="vendor@example.com"
                required
              />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Mobile Number 1 <span className="text-red-500">*</span>
              </label>
              <input
                name="mobile1"
                value={formdata.mobile1}
                onChange={handleChange}
                type="tel"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition"
                placeholder="+91 9876543210"
                required
              />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Mobile Number 2
              </label>
              <input
                name="mobile2"
                value={formdata.mobile2}
                onChange={handleChange}
                type="tel"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition"
                placeholder="+91 9876543210"
              />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Short Address <span className="text-red-500">*</span>
              </label>
              <input
                name="address"
                value={formdata.address}
                onChange={handleChange}
                type="text"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition"
                placeholder="Enter address"
                required
              />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Service Locations <span className="text-red-500">*</span>
              </label>
              <div className="relative location-dropdown-container">
                {/* Selected locations display */}
                <div
                  className="min-h-[42px] border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition cursor-text"
                  onClick={() => setShowLocationDropdown(true)}
                >
                  {selectedLocations.length === 0 ? (
                    <span className="text-gray-400">
                      Click to add service locations...
                    </span>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {selectedLocations.map((location, index) => (
                        <span
                          key={index}
                          className="bg-orange-100 text-orange-700 px-2 py-1 rounded-full text-sm flex items-center gap-1"
                        >
                          {location}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleLocationRemove(location);
                            }}
                            className="text-orange-500 hover:text-orange-700 font-bold"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Dropdown */}
                {showLocationDropdown && (
                  <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                    <input
                      type="text"
                      placeholder="Search locations..."
                      value={locationSearch}
                      onChange={(e) => setLocationSearch(e.target.value)}
                      className="w-full px-3 py-2 border-b border-gray-200 outline-none"
                      autoFocus
                    />
                    {filteredLocations.length === 0 ? (
                      <div className="px-3 py-2 text-gray-500 text-sm">
                        No locations found
                      </div>
                    ) : (
                      filteredLocations.map((location, index) => (
                        <div
                          key={index}
                          onClick={() => handleLocationSelect(location)}
                          className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                        >
                          {location}
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            </div>
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Vendor Photo
              </label>
              <input
                type="file"
                name="photo"
                onChange={handleFileChange}
                accept="image/*"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transition-all duration-300"
            >
              Add Vendor
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Page;
