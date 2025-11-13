"use client";
import { useState, useEffect } from "react";
import AdminHeader from "@/app/components/AdminHeader";
import DataTable from "react-data-table-component";
import axiosInstance from "@/lib/axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";



const customStyles = {
  headRow: {
    style: {
      backgroundColor: "#f87123",
      fontWeight: "bold",
      color: "#fff",
      borderRadius: "0.5rem 0.5rem 0 0",
    },
  },
  headCells: {
    style: {
      paddingTop: "14px",
      paddingBottom: "14px",
      fontSize: "0.9rem",
    },
  },
  rows: {
    style: {
      minHeight: "56px",
      fontSize: "0.95rem",
    },
  },
  cells: {
    style: {
      paddingTop: "12px",
      paddingBottom: "12px",
    },
  },
};

const Page = () => {
  const [isClient, setIsClient] = useState(false);
  const [brokerslist, setBrokerslist] = useState([]);
  const [displaybrokerlist, setDisplayBrokerslist] = useState([]);
  const [sidebaropen, setSidebarOpen] = useState(false);

  // Credit Modal State
  const [showCreditModal, setShowCreditModal] = useState(false);
  const [selectedBrokerId, setSelectedBrokerId] = useState<string>("");
  const [creditCount, setCreditCount] = useState<string>("");
  const [validityOption, setValidityOption] = useState<string>("3m"); // 3m, 6m, 1y

  const fetchbrokerslist = async () => {
    const response = await axiosInstance.get('/api/getbrokers');
    setDisplayBrokerslist(response.data.payload);
    setBrokerslist(response.data.payload);
  };

  const filtersearch = (data) => {
    if (data) {
      const searchTerm = data.toLowerCase();
      setDisplayBrokerslist(
        displaybrokerlist.filter((item) =>
          Object.values(item).some((value) =>
            value?.toString().toLowerCase().includes(searchTerm)
          )
        )
      );
      return;
    }
    setDisplayBrokerslist(brokerslist);
  };

  useEffect(() => {
    setIsClient(true);
    fetchbrokerslist();
  }, []);

  if (!isClient) return null; // Avoids rendering until hydration completes

  const openCreditModal = (broker_id: string) => {
    setSelectedBrokerId(broker_id);
    setCreditCount("");
    setValidityOption("3m");
    setShowCreditModal(true);
  };

  const closeCreditModal = () => {
    setShowCreditModal(false);
    setSelectedBrokerId("");
    setCreditCount("");
  };

  const handleGiveCredit = async () => {
    try {
      const creditsNum = Number(creditCount);
      if (!selectedBrokerId) {
        toast.error("No broker selected");
        return;
      }
      if (isNaN(creditsNum) || creditsNum <= 0) {
        toast.error("Enter a valid number of credits");
        return;
      }
      // Compute validity based on selection
      const validityDate = new Date();
      if (validityOption === "3m") validityDate.setMonth(validityDate.getMonth() + 3);
      else if (validityOption === "6m") validityDate.setMonth(validityDate.getMonth() + 6);
      else if (validityOption === "1y") validityDate.setFullYear(validityDate.getFullYear() + 1);

      const response = await axiosInstance.post('/api/updatebrokercredits', {
        broker_id: selectedBrokerId,
        credits: creditsNum,
        validity: validityDate.toISOString(),
      });
      if (response.status === 200) {
        toast.success("Credits updated successfully");
        setDisplayBrokerslist((prev: any) =>
          prev.map((b: any) =>
            b.broker_id === selectedBrokerId
              ? { ...b, credits: { credits: creditsNum, validity: validityDate } }
              : b
          )
        );
        setBrokerslist((prev: any) =>
          prev.map((b: any) =>
            b.broker_id === selectedBrokerId
              ? { ...b, credits: { credits: creditsNum, validity: validityDate } }
              : b
          )
        );
        closeCreditModal();
      } else {
        toast.error(response.data?.message || "Failed to update credits");
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Something Went Wrong");
    }
  };

  const columns = [
    { 
      name: "Broker ID", 
      cell: (row) => (
        <div className="flex items-center">
          <img 
            src={row.photo} 
            alt="" 
            className="w-10 h-10 object-cover rounded-full -ml-10" 
          />
          <span className="whitespace-nowrap text-sm">{row.broker_id}</span>
        </div>
      ), 
      width: "100px" 
    },
    {
      name: "Name",
      selector: (row) => row.brokername,
      sortable: true,
      width: "200px",
    },
    { 
      name: "Company", 
      selector: (row) => row.companyname, 
      width: "150px",
      cell: (row) => <div className="text-sm">{row.companyname}</div>
    },
    { 
      name: "Primary", 
      selector: (row) => row.mobile1, 
      width: "120px",
      cell: (row) => <div className="text-sm">{row.mobile1}</div>
    },
    { 
      name: "Secondary", 
      selector: (row) => row.mobile2, 
      width: "120px",
      cell: (row) => <div className="text-sm">{row.mobile2 || '-'}</div>
    },
    { 
      name: "Credits", 
      selector: (row) => row.credits?.credits || "NA",
      sortable: true,
      width: "90px",
      cell: (row) => <div className="text-sm font-medium">{row.credits?.credits || 'NA'}</div>
    },
    {
      name: "",
      cell: (row) => (
        <button
          className="text-white bg-blue-600 hover:bg-blue-700 px-2 py-1 rounded"
          onClick={() => openCreditModal(row.broker_id)}
        >
          Give Credit
        </button>
      ),
      ignoreRowClick: true,
      button: true,
      width: "120px",
    },
  ];

  return (
    <div className="lg:mt-[12vh] lg:flex bg-gray-100 min-h-[88vh]">
      <AdminHeader sidebaropen={sidebaropen} setSidebarOpen={setSidebarOpen} />

      <div
        className={`w-full mt-[10vh] lg:mt-[0vh] px-[5%] py-[4vh] ${
          sidebaropen ? "lg:ml-[23%]" : "lg:ml-[12%]"
        }`}
      >
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-800">View Brokers</h1>
          <span className="text-sm text-gray-500">Manage brokers</span>
        </div>
        <div className="bg-white rounded-2xl shadow-xl p-4">
          <input
            type="search"
            className="border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400 mb-4 rounded-xl px-4 py-2 w-full"
            placeholder="Search brokers by any field..."
            onChange={(e) => filtersearch(e.target.value)}
          />
          <div className="overflow-x-auto">
            <DataTable
              paginationPerPage={10}
              columns={columns}
              data={displaybrokerlist}
              pagination
              customStyles={customStyles}
            />
          </div>
        </div>
      </div>
      {showCreditModal && (
        <div className="fixed inset-0 z-20 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl w-[90%] max-w-md p-6 relative">
            <button
              className="absolute top-2 right-3 text-gray-500 hover:text-gray-700"
              onClick={closeCreditModal}
            >
              ✕
            </button>
            <h2 className="text-xl font-semibold mb-4">Give Credits</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Broker ID</label>
                <input
                  value={selectedBrokerId}
                  disabled
                  className="w-full border rounded px-3 py-2 bg-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Number of Credits</label>
                <input
                  type="number"
                  min={1}
                  value={creditCount}
                  onChange={(e) => setCreditCount(e.target.value)}
                  className="w-full border rounded px-3 py-2"
                  placeholder="e.g. 199"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Validity</label>
                <select
                  className="w-full border rounded px-3 py-2"
                  value={validityOption}
                  onChange={(e) => setValidityOption(e.target.value)}
                >
                  <option value="3m">3 Months</option>
                  <option value="6m">6 Months</option>
                  <option value="1y">1 Year</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  Expires on: {(() => { const d = new Date(); if (validityOption === "3m") d.setMonth(d.getMonth() + 3); else if (validityOption === "6m") d.setMonth(d.getMonth() + 6); else d.setFullYear(d.getFullYear() + 1); return d.toLocaleDateString(); })()}
                </p>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  className="px-4 py-2 rounded border"
                  onClick={closeCreditModal}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 rounded bg-[#FF5D00] text-white"
                  onClick={handleGiveCredit}
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
