"use client";
import AdminHeader from "@/app/components/AdminHeader";
import { useEffect, useState } from "react";
import {  toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axiosInstance from "@/lib/axios";

const Page = () => {
  const [formdata, setFormdata] = useState({
    brokername: "",
    companyname: "",
    emailid: "",
    mobile1: "",
    mobile2: "",
    address: "",
    photo: null,
    servicelocations: [],
  });

  const [sidebaropen, setSidebarOpen] = useState(false);
  // Location dropdown states
  const [locationList, setLocationList] = useState<string[]>([]);
  const [locationSearch, setLocationSearch] = useState("");
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);

  // Fetch location list
  useEffect(() => {
    const fetchLocationList = async () => {
      try {
        const response = await axiosInstance.get('/api/getspecificvariable?category=locationlist');
        if (response.data?.payload) {
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
    const handleClickOutside = (event: any) => {
      if (showLocationDropdown && !event.target.closest('.location-dropdown-container')) {
        setShowLocationDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showLocationDropdown]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "mobile1" || name === "mobile2") {
      const digits = value.replace(/\D/g, "").slice(0, 10);
      setFormdata((prevData) => ({ ...prevData, [name]: digits }));
      return;
    }
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formdata.mobile1.length !== 10) {
      toast.error("Enter 10-digit Mobile Number 1");
      return;
    }
    if (formdata.mobile2 && formdata.mobile2.length !== 10) {
      toast.error("Mobile Number 2 must be 10 digits");
      return;
    }

    const formDataToSend = new FormData();
    Object.keys(formdata).forEach((key) => {
      if (key === 'servicelocations') {
        if (Array.isArray(formdata[key]) && formdata[key].length > 0) {
          formDataToSend.append(key, JSON.stringify(formdata[key]));
        }
      } else if (formdata[key]) {
        formDataToSend.append(key, formdata[key]);
      }
    });

    try {
      const response = await axiosInstance.post('/api/addbroker', formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        validateStatus: () => true, // allows us to handle all statuses manually
      });

      if (response.status !== 200) {
        toast.error(response.data.message || "Something went wrong.");
        return; 
      }

      toast.success(response.data.message || "Broker added successfully!");
      
      // Reset form after successful submission
      setFormdata({
        brokername: "",
        companyname: "",
        emailid: "",
        mobile1: "",
        mobile2: "",
        address: "",
        photo: null,
        servicelocations: [],
      });
      setSelectedLocations([]);
      
      // Reset file input
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      if (fileInput) fileInput.value = "";
      
    } catch (error) {
      toast.error("Failed to add broker. Please try again.");
    }
  };

  return (
    <div className="flex bg-gray-100 min-h-[88vh] lg:mt-[12vh]">
      <AdminHeader sidebaropen={sidebaropen} setSidebarOpen={setSidebarOpen} />
     
      <div
        className={`w-full px-[5%] py-[4vh] mt-[10vh] lg:mt-0 ${
          sidebaropen ? "lg:ml-[23%]" : "lg:ml-[12%]"
        }`}
      >
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-800">Add Broker</h1>
          <span className="text-sm text-gray-500">Create new broker</span>
        </div>
        <form
          className="p-6 lg:p-8 bg-white rounded-2xl shadow-xl"
          onSubmit={handleSubmit}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium mb-1">Broker Name <span className="text-red-700">*</span></label>
              <input
                name="brokername"
                value={formdata.brokername}
                onChange={handleChange}
                type="text"
                className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Company Name</label>
              <input
                name="companyname"
                value={formdata.companyname}
                onChange={handleChange}
                type="text"
                className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email Id <span className="text-red-700">*</span></label>
              <input
                name="emailid"
                value={formdata.emailid}
                onChange={handleChange}
                type="email"
                className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Mobile Number 1 <span className="text-red-700">*</span></label>
              <input
                name="mobile1"
                value={formdata.mobile1}
                onChange={handleChange}
                type="tel"
                className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                inputMode="numeric"
                maxLength={10}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Mobile Number 2</label>
              <input
                name="mobile2"
                value={formdata.mobile2}
                onChange={handleChange}
                type="tel"
                className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                inputMode="numeric"
                maxLength={10}
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Short Address <span className="text-red-700">*</span></label>
              <input
                name="address"
                value={formdata.address}
                onChange={handleChange}
                type="text"
                className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Service Locations <span className="text-red-700">*</span></label>
              <div className="relative location-dropdown-container">
                {/* Selected locations display */}
                <div
                  className="min-h-[42px] border border-gray-300 rounded-xl p-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition cursor-text"
                  onClick={() => setShowLocationDropdown(true)}
                >
                  {selectedLocations.length === 0 ? (
                    <span className="text-gray-400">Click to add service locations...</span>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {selectedLocations.map((loc, idx) => (
                        <span key={idx} className="bg-orange-100 text-orange-700 px-2 py-1 rounded-full text-sm flex items-center gap-1">
                          {loc}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              const updated = selectedLocations.filter((l) => l !== loc);
                              setSelectedLocations(updated);
                              setFormdata((prev) => ({ ...prev, servicelocations: updated }));
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
                    {locationList.filter(l => l.toLowerCase().includes(locationSearch.toLowerCase()) && !selectedLocations.includes(l)).length === 0 ? (
                      <div className="px-3 py-2 text-gray-500 text-sm">No locations found</div>
                    ) : (
                      locationList
                        .filter(l => l.toLowerCase().includes(locationSearch.toLowerCase()) && !selectedLocations.includes(l))
                        .map((l, index) => (
                          <div
                            key={index}
                            onClick={() => {
                              const updated = [...selectedLocations, l];
                              setSelectedLocations(updated);
                              setFormdata((prev) => ({ ...prev, servicelocations: updated }));
                              setLocationSearch("");
                              setShowLocationDropdown(false);
                            }}
                            className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                          >
                            {l}
                          </div>
                        ))
                    )}
                  </div>
                )}
              </div>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Broker Photo</label>
              <input
                type="file"
                name="photo"
                onChange={handleFileChange}
                accept="image/*"
                className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none"
              />
            </div>
          </div>
          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              className="bg-[#FF5D00] hover:bg-orange-600 transition text-white px-6 py-2 rounded-xl shadow-md"
            >
              Add Broker
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Page;
