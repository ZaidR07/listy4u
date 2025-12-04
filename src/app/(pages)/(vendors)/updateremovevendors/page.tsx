"use client";
import { useState, useEffect } from "react";
import AdminHeader from "@/app/components/AdminHeader";
import DataTable from "react-data-table-component";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axiosInstance from "@/lib/axios";

const TrashIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 448 512"
    className="w-4 h-4 text-red-600 cursor-pointer"
    fill="#af1616"
  >
    <path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64s14.3 32 32 32h384c17.7 0 32-14.3 32-32s-14.3-32-32-32h-96l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32l21.2 339c1.6 25.3 22.6 45 47.9 45h245.8c25.3 0 46.3-19.7 47.9-45L416 128z" />
  </svg>
);

const PenIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 512 512"
    className="w-4 h-4 text-red-600 cursor-pointer"
    fill="#0f8b1d"
  >
    <path d="M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1L291.7 89.8l-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L387.7 253.7 410.3 231zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9L59.4 452l23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1 0 32c0 8.8 7.2 16 16 16l32 0zM362.7 18.7L348.3 33.2 325.7 55.8 314.3 67.1l33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5L453.3 18.7c-25-25-65.5-25-90.5 0zm-47.4 168l-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z" />
  </svg>
);

const Page = () => {
  const [isClient, setIsClient] = useState(false);
  const [vendorslist, setVendorslist] = useState([]);
  const [displayvendorlist, setDisplayVendorslist] = useState([]);
  const [updatecliked, setUpdateClicked] = useState(false);
  const [sidebaropen, setSidebarOpen] = useState(false);

  // Credit Modal State
  const [showCreditModal, setShowCreditModal] = useState(false);
  const [selectedVendorId, setSelectedVendorId] = useState<string>("");
  const [creditCount, setCreditCount] = useState<string>("");
  const [validityOption, setValidityOption] = useState<string>("3m");

  const [formdata, setFormdata] = useState({
    vendor_id: "",
    vendorname: "",
    companyname: "",
    emailid: "",
    mobile1: "",
    mobile2: "",
    address: "",
    category: "",
    servicelocations: [],
  });
  
  // Location dropdown states for update form
  const [locationList, setLocationList] = useState([]);
  const [locationSearch, setLocationSearch] = useState("");
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [selectedLocations, setSelectedLocations] = useState([]);

  const fetchVendorslist = async () => {
    try {
      const response = await axiosInstance.get('/api/getvendors');
      setDisplayVendorslist(response.data.payload);
      setVendorslist(response.data.payload);
    } catch (error) {
      toast.error("Failed to fetch vendors");
    }
  };

  // Fetch location list
  useEffect(() => {
    const fetchLocationList = async () => {
      try {
        const response = await axiosInstance.get('/api/getspecificvariable?category=locationlist');
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
      if (showLocationDropdown && !event.target.closest('.location-dropdown-container')) {
        setShowLocationDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showLocationDropdown]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormdata((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle location selection for update form
  const handleLocationSelect = (location) => {
    if (!selectedLocations.includes(location)) {
      const newSelectedLocations = [...selectedLocations, location];
      setSelectedLocations(newSelectedLocations);
      setFormdata(prev => ({ ...prev, servicelocations: newSelectedLocations }));
    }
    setLocationSearch("");
    setShowLocationDropdown(false);
  };

  // Handle location removal for update form
  const handleLocationRemove = (locationToRemove) => {
    const newSelectedLocations = selectedLocations.filter(loc => loc !== locationToRemove);
    setSelectedLocations(newSelectedLocations);
    setFormdata(prev => ({ ...prev, servicelocations: newSelectedLocations }));
  };

  // Filter locations based on search for update form
  const filteredLocations = locationList.filter(location => 
    location.toLowerCase().includes(locationSearch.toLowerCase()) &&
    !selectedLocations.includes(location)
  );

  // Handle update button click to populate form with existing data
  const handleUpdateClick = (vendor) => {
    setFormdata({
      vendor_id: vendor.vendor_id,
      vendorname: vendor.vendorname,
      companyname: vendor.companyname,
      emailid: vendor.emailid,
      mobile1: vendor.mobile1,
      mobile2: vendor.mobile2 || "",
      address: vendor.address || "",
      category: vendor.category || "",
      servicelocations: vendor.servicelocations || [],
    });
    setSelectedLocations(vendor.servicelocations || []);
    setUpdateClicked(true);
  };

  const openCreditModal = (vendor_id: string) => {
    setSelectedVendorId(vendor_id);
    setCreditCount("");
    setValidityOption("3m");
    setShowCreditModal(true);
  };

  const closeCreditModal = () => {
    setShowCreditModal(false);
    setSelectedVendorId("");
    setCreditCount("");
  };

  const handleGiveCredit = async () => {
    try {
      const creditsNum = Number(creditCount);
      if (!selectedVendorId) {
        toast.error("No vendor selected");
        return;
      }
      if (isNaN(creditsNum) || creditsNum <= 0) {
        toast.error("Enter a valid number of credits");
        return;
      }

      const validityDate = new Date();
      if (validityOption === "3m") validityDate.setMonth(validityDate.getMonth() + 3);
      else if (validityOption === "6m") validityDate.setMonth(validityDate.getMonth() + 6);
      else if (validityOption === "1y") validityDate.setFullYear(validityDate.getFullYear() + 1);

      await axiosInstance.post('/api/updatevendorcredits', {
        vendor_id: selectedVendorId,
        credits: creditsNum,
        validity: validityDate.toISOString(),
      });

      toast.success("Credits updated successfully");
      closeCreditModal();
      fetchVendorslist();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Something Went Wrong");
    }
  };

  const HandleDelete = async (id) => {
    try {
      await axiosInstance.post('/api/deletevendor', { id });
      toast.success("Vendor deleted successfully");
      fetchVendorslist();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Something Went Wrong");
    }
  };

  const UpdateRequest = async (e) => {
    e.preventDefault();

    try {
      // Prepare form data with service locations as JSON string
      const updateData = {
        ...formdata,
        servicelocations: Array.isArray(formdata.servicelocations)
          ? JSON.stringify(formdata.servicelocations)
          : formdata.servicelocations,
      };

      await axiosInstance.post('/api/updatevendor', updateData);
      toast.success("Vendor updated successfully");
      setFormdata({
        vendor_id: "",
        vendorname: "",
        companyname: "",
        emailid: "",
        mobile1: "",
        mobile2: "",
        address: "",
        category: "",
        servicelocations: [],
      });
      setSelectedLocations([]);
      setUpdateClicked(false);
      fetchVendorslist();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Something Went Wrong");
    }
  };

  const filtersearch = (data) => {
    const searchTerm = data.toLowerCase();
    if (!searchTerm) {
      setDisplayVendorslist(vendorslist);
      return;
    }
    setDisplayVendorslist(
      vendorslist.filter((item) =>
        Object.values(item).some((value) =>
          value?.toString().toLowerCase().includes(searchTerm)
        )
      )
    );
  };

  useEffect(() => {
    setIsClient(true);
    fetchVendorslist();
  }, []);

  const columns = [
    {
      name: "ID",
      selector: (row) => row.vendor_id,
      minWidth: "60px",
      maxWidth: "100px",
    },
    {
      name: "Name",
      selector: (row) => row.vendorname,
      sortable: true,
      minWidth: "80px",
      maxWidth: "150px",
    },
    {
      name: "Company",
      selector: (row) => row.companyname,
      minWidth: "60px",
      maxWidth: "150px",
    },
    {
      name: "",
      cell: (row) => (
        <button
          onClick={() => handleUpdateClick(row)}
        >
          <PenIcon />
        </button>
      ),
      ignoreRowClick: true,
      button: true,
      minWidth: "50px",
    },
    {
      name: "",
      cell: (row) => (
        <button onClick={() => HandleDelete(row.vendor_id)}>
          <TrashIcon />
        </button>
      ),
      ignoreRowClick: true,
      button: true,
      minWidth: "50px",
    },
    {
      name: "",
      cell: (row) => (
        <button
          className="text-white bg-blue-600 hover:bg-blue-700 px-2 py-1 rounded"
          onClick={() => openCreditModal(row.vendor_id)}
        >
          Give Credit
        </button>
      ),
      ignoreRowClick: true,
      button: true,
      minWidth: "110px",
    }
  ];

  if (!isClient) return null;

  return (
    <div className="bg-gray-100 min-h-[88vh] mt-[10vh] lg:mt-[12vh] flex">
      <AdminHeader sidebaropen={sidebaropen} setSidebarOpen={setSidebarOpen} />
      <div
        className={`w-full py-[4vh] px-[5%] ${
          sidebaropen ? "lg:ml-[23%]" : "lg:ml-[12%]"
        }`}
      >
        <div className="flex items-start sm:items-center justify-between mb-4 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Update / Remove Vendors</h1>
            <span className="text-sm text-gray-500">Manage and edit vendor records</span>
          </div>
          <div className="flex items-center gap-3 ml-auto">
            <span className="inline-flex items-center gap-2 text-xs font-medium bg-orange-50 text-orange-600 px-3 py-1.5 rounded-full border border-orange-200">
              Total Vendors
              <span className="inline-flex items-center justify-center bg-orange-500 text-white rounded-full w-6 h-6 text-[11px]">
                {displayvendorlist.length}
              </span>
            </span>
            <input
              type="search"
              className="border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400 rounded-xl px-4 py-2 w-[52vw] sm:w-[320px] text-sm"
              placeholder="Search vendors..."
              onChange={(e) => filtersearch(e.target.value)}
            />
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-xl p-4 overflow-x-auto">
          <DataTable
            paginationPerPage={10}
            columns={columns}
            data={displayvendorlist}
            highlightOnHover
            striped
            pagination
            paginationTotalRows={displayvendorlist.length}
            customStyles={{
              headRow: {
                style: {
                  backgroundColor: "#f87123",
                  fontWeight: "bold",
                  fontSize: "14px",
                  color: "#fff",
                  textAlign: "left",
                  paddingTop: "14px",
                  paddingBottom: "14px",
                  borderTopLeftRadius: "12px",
                  borderTopRightRadius: "12px",
                },
              },
              headCells: {
                style: {
                  paddingTop: "12px",
                  paddingBottom: "12px",
                  textAlign: "left",
                },
              },
              rows: {
                style: {
                  minHeight: "48px",
                  fontSize: "13px",
                  paddingTop: "6px",
                  paddingBottom: "6px",
                  transition: "background-color 0.15s ease-in-out",
                },
              },
              cells: {
                style: {
                  padding: "10px",
                  textAlign: "left",
                },
              },
              pagination: {
                style: {
                  borderTop: "1px solid #eee",
                },
              },
            }}
          />
        </div>
      </div>

      {/* Update Drawer */}
      {updatecliked && (
        <div className="fixed inset-0 bg-black/50 z-[99999] flex items-center justify-center mt-[10vh]">
          <div className="bg-white w-full max-w-3xl max-h-[80vh] overflow-y-auto shadow-2xl rounded-xl">
            <div className="bg-orange-500 p-4 flex items-center">
              <h2 className="text-white text-xl font-bold">Update Vendor</h2>
              <button
                onClick={() => setUpdateClicked(false)}
                className="ml-auto text-white hover:bg-orange-600 rounded-full p-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" width={24} fill="#FFF">
                  <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
                </svg>
              </button>
            </div>
            <form onSubmit={UpdateRequest} className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Vendor ID</label>
                <input
                  type="text"
                  name="vendor_id"
                  value={formdata.vendor_id}
                  disabled
                  className="w-full border rounded px-3 py-2 bg-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Vendor Name</label>
                <input
                  type="text"
                  name="vendorname"
                  value={formdata.vendorname}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Company Name</label>
                <input
                  type="text"
                  name="companyname"
                  value={formdata.companyname}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <input
                  type="text"
                  name="category"
                  value={formdata.category}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  name="emailid"
                  value={formdata.emailid}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Mobile 1</label>
                <input
                  type="text"
                  name="mobile1"
                  value={formdata.mobile1}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Mobile 2</label>
                <input
                  type="text"
                  name="mobile2"
                  value={formdata.mobile2}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Address</label>
                <textarea
                  name="address"
                  value={formdata.address}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                  rows={3}
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Service Locations</label>
                <div className="relative location-dropdown-container">
                  {/* Selected locations display */}
                  <div className="min-h-[38px] border border-gray-300 rounded p-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition cursor-text"
                       onClick={() => setShowLocationDropdown(true)}>
                    {selectedLocations.length === 0 ? (
                      <span className="text-gray-400 text-sm">Click to add service locations...</span>
                    ) : (
                      <div className="flex flex-wrap gap-1">
                        {selectedLocations.map((location, index) => (
                          <span key={index} className="bg-orange-100 text-orange-700 px-2 py-1 rounded-full text-xs flex items-center gap-1">
                            {location}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleLocationRemove(location);
                              }}
                              className="text-orange-500 hover:text-orange-700 font-bold text-xs"
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
                    <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded shadow-lg max-h-40 overflow-y-auto">
                      <input
                        type="text"
                        placeholder="Search locations..."
                        value={locationSearch}
                        onChange={(e) => setLocationSearch(e.target.value)}
                        className="w-full px-3 py-2 border-b border-gray-200 outline-none text-sm"
                        autoFocus
                      />
                      {filteredLocations.length === 0 ? (
                        <div className="px-3 py-2 text-gray-500 text-xs">No locations found</div>
                      ) : (
                        filteredLocations.map((location, index) => (
                          <div
                            key={index}
                            onClick={() => handleLocationSelect(location)}
                            className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-xs"
                          >
                            {location}
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
              </div>
              <div className="md:col-span-2">
                <button
                  type="submit"
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded font-medium"
                >
                  Update Vendor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Credit Modal */}
      {showCreditModal && (
        <div className="fixed inset-0 bg-black/50 z-[99999] flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-xl font-bold mb-4">Give Credits to Vendor</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Vendor ID</label>
                <input
                  type="text"
                  value={selectedVendorId}
                  disabled
                  className="w-full border rounded px-3 py-2 bg-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Number of Credits</label>
                <input
                  type="number"
                  value={creditCount}
                  onChange={(e) => setCreditCount(e.target.value)}
                  className="w-full border rounded px-3 py-2"
                  placeholder="Enter credits"
                  min="1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Validity</label>
                <select
                  value={validityOption}
                  onChange={(e) => setValidityOption(e.target.value)}
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="3m">3 Months</option>
                  <option value="6m">6 Months</option>
                  <option value="1y">1 Year</option>
                </select>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={closeCreditModal}
                  className="flex-1 border border-gray-300 hover:bg-gray-100 py-2 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={handleGiveCredit}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;
