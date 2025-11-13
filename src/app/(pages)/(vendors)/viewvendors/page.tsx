"use client";
import { useState, useEffect } from "react";
import AdminHeader from "@/app/components/AdminHeader";
import DataTable from "react-data-table-component";
import axiosInstance from "@/lib/axios";
import { useRouter } from "next/navigation";

const Page = () => {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [vendorslist, setVendorslist] = useState([]);
  const [displayvendorslist, setDisplayVendorslist] = useState([]);
  const [sidebaropen, setSidebarOpen] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState<any>(null);

  const openViewModal = (vendor: any) => {
    setSelectedVendor(vendor);
    setShowViewModal(true);
  };

  const closeViewModal = () => {
    setShowViewModal(false);
    setSelectedVendor(null);
  };

  const columns = [
    { name: "", cell: (row) => <img src={row.photo} alt="" className="w-12 h-12 rounded-full object-cover" />, width: "80px" },
    { name: "Vendor ID", selector: (row) => row.vendor_id, sortable: true, width: "110px" },
    {
      name: "Name",
      selector: (row) => row.vendorname,
      sortable: true,
      width: "150px",
    },
    { name: "Company Name", selector: (row) => row.companyname, sortable: true, width: "150px" },
    { name: "Primary Mobile", selector: (row) => row.mobile1, width: "130px" },
    { 
      name: "Action", 
      cell: (row) => (
        <button
          onClick={() => openViewModal(row)}
          className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          View
        </button>
      ),
      width: "100px",
      center: true,
    },
  ];

  const customStyles = {
    headRow: {
      style: { backgroundColor: "#f87123", fontWeight: "bold", color: "white" },
    },
    rows: {
      style: { minHeight: "56px" },
    },
    table: {
      style: {
        minWidth: "100%",
      },
    },
  };

  const fetchbrokerslist = async () => {
    const response = await axiosInstance.get('/api/getvendors');
    setDisplayVendorslist(response.data.payload);
    setVendorslist(response.data.payload);
  };

  const filtersearch = (data) => {
    if (data) {
      const searchTerm = data.toLowerCase();
      setDisplayVendorslist(
        displayvendorslist.filter((item) =>
          Object.values(item).some((value) =>
            value?.toString().toLowerCase().includes(searchTerm)
          )
        )
      );
      return;
    }
    setDisplayVendorslist(vendorslist);
  };

  useEffect(() => {
    setIsClient(true);
    fetchbrokerslist();
  }, []);

  if (!isClient) return null; // Avoids rendering until hydration completes

  return (
    <div className="lg:mt-[12vh] lg:flex bg-gray-100 min-h-[88vh]">
      <AdminHeader sidebaropen={sidebaropen} setSidebarOpen={setSidebarOpen} />

      <div
        className={`w-full mt-[10vh] lg:mt-[0vh] px-4 lg:px-6 py-[4vh] transition-all duration-300 ${
          sidebaropen ? "lg:ml-[23%]" : "lg:ml-[12%]"
        }`}
      >
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-800">View Vendors</h1>
          <span className="text-sm text-gray-500">Manage vendors</span>
        </div>
        <div className="bg-white rounded-2xl shadow-xl p-4">
          <input
            type="search"
            className="border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400 mb-4 rounded-xl px-4 py-2 w-full"
            placeholder="Search vendors by any field..."
            onChange={(e) => filtersearch(e.target.value)}
          />
          <DataTable
            paginationPerPage={10}
            columns={columns}
            data={displayvendorslist}
            pagination
            customStyles={customStyles}
            responsive
            highlightOnHover
            pointerOnHover
          />
        </div>
      </div>

      {/* View Vendor Modal */}
      {showViewModal && selectedVendor && (
        <div className="fixed inset-0 bg-black/50 z-[99999] flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-orange-500 p-4 flex items-center sticky top-0">
              <h2 className="text-white text-xl font-bold">Vendor Details</h2>
              <button
                onClick={closeViewModal}
                className="ml-auto text-white hover:bg-orange-600 rounded-full p-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" width={24} fill="#FFF">
                  <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
                </svg>
              </button>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-4 mb-6">
                <img 
                  src={selectedVendor.image || '/default-vendor.png'} 
                  alt={selectedVendor.vendorname}
                  className="w-24 h-24 rounded-full object-cover ring-4 ring-orange-200"
                />
                <div>
                  <h3 className="text-2xl font-bold">{selectedVendor.vendorname}</h3>
                  <p className="text-gray-600">{selectedVendor.companyname}</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border">
                  <span className="text-xs text-gray-500">Vendor ID</span>
                  <p className="text-lg font-medium">{selectedVendor.vendor_id}</p>
                </div>
                <div className="p-4 rounded-xl border">
                  <span className="text-xs text-gray-500">Category</span>
                  <p className="text-lg font-medium">{selectedVendor.category}</p>
                </div>
                <div className="p-4 rounded-xl border">
                  <span className="text-xs text-gray-500">Email</span>
                  <p className="text-lg font-medium break-all">{selectedVendor.emailid}</p>
                </div>
                <div className="p-4 rounded-xl border">
                  <span className="text-xs text-gray-500">Mobile 1</span>
                  <p className="text-lg font-medium">{selectedVendor.mobile1}</p>
                </div>
                {selectedVendor.mobile2 && (
                  <div className="p-4 rounded-xl border">
                    <span className="text-xs text-gray-500">Mobile 2</span>
                    <p className="text-lg font-medium">{selectedVendor.mobile2}</p>
                  </div>
                )}
                <div className="p-4 rounded-xl border md:col-span-2">
                  <span className="text-xs text-gray-500">Address</span>
                  <p className="text-lg font-medium">{selectedVendor.address}</p>
                </div>
              </div>
              <div className="mt-6 flex gap-3">
                <a 
                  href={`tel:${selectedVendor.mobile1}`}
                  className="flex-1 bg-orange-500 text-white text-center rounded-lg py-2 font-medium hover:bg-orange-600"
                >
                  Call
                </a>
                <a 
                  href={`https://wa.me/${selectedVendor.mobile1}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-green-500 text-white text-center rounded-lg py-2 font-medium hover:bg-green-600"
                >
                  WhatsApp
                </a>
                <a 
                  href={`mailto:${selectedVendor.emailid}`}
                  className="flex-1 border border-orange-500 text-orange-500 text-center rounded-lg py-2 font-medium hover:bg-orange-50"
                >
                  Email
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Page;
