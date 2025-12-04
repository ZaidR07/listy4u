"use client";
import { useState, useEffect } from "react";
import AdminHeader from "@/app/components/AdminHeader";
import DataTable from "react-data-table-component";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CreditModal, BrokerUpdateDrawer } from "@/app/components/brokers";
import {
  useGetBrokers,
  useUpdateBroker,
  useDeleteBroker,
  useUpdateBrokerCredits,
} from "@/hooks/brokers";
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
  const [displaybrokerlist, setDisplayBrokerslist] = useState([]);
  const [updatecliked, setUpdateClicked] = useState(false);
  const [sidebaropen, setSidebarOpen] = useState(false);

  // Credit Modal State
  const [showCreditModal, setShowCreditModal] = useState(false);
  const [selectedBrokerId, setSelectedBrokerId] = useState<string>("");
  const [creditCount, setCreditCount] = useState<string>("");
  const [validityOption, setValidityOption] = useState<string>("3m"); // 3m, 6m, 1y

  const [formdata, setFormdata] = useState({
    broker_id: "",
    brokername: "",
    companyname: "",
    emailid: "",
    mobile1: "",
    mobile2: "",
    address: "",
    servicelocations: [],
  });

  // React Query Hooks
  const { data: brokerslist = [], isLoading, refetch } = useGetBrokers();
  const updateBrokerMutation = useUpdateBroker();
  const deleteBrokerMutation = useDeleteBroker();
  const updateCreditsMutation = useUpdateBrokerCredits();

  // Location list for service locations dropdown
  const [locationList, setLocationList] = useState<string[]>([]);
  useEffect(() => {
    const fetchLocationList = async () => {
      try {
        const response = await axiosInstance.get('/api/getspecificvariable?category=locationlist');
        if (response.data?.payload) setLocationList(response.data.payload);
      } catch (e) {
        console.error('Failed to load location list', e);
      }
    };
    fetchLocationList();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormdata((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

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

      await updateCreditsMutation.mutateAsync({
        broker_id: selectedBrokerId,
        credits: creditsNum,
        validity: validityDate.toISOString(),
      });

      toast.success("Credits updated successfully");
      closeCreditModal();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Something Went Wrong");
    }
  };

  const HandleDelete = async (id) => {
    try {
      await deleteBrokerMutation.mutateAsync(id);
      toast.success("Broker deleted successfully");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Something Went Wrong");
    }
  };

  const UpdateRequest = async (e) => {
    e.preventDefault();

    try {
      const payloadForm = {
        ...formdata,
        servicelocations: Array.isArray((formdata as any)?.servicelocations)
          ? JSON.stringify((formdata as any).servicelocations)
          : (formdata as any)?.servicelocations,
      };
      await updateBrokerMutation.mutateAsync({ formdata: payloadForm });
      toast.success("Broker updated successfully");
      setFormdata({
        broker_id: "",
        brokername: "",
        companyname: "",
        emailid: "",
        mobile1: "",
        mobile2: "",
        address: "",
        servicelocations: [],
      });
      setUpdateClicked(false);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Something Went Wrong");
    }
  };


  // Search Filter
  const filtersearch = (data) => {
    const searchTerm = data.toLowerCase();
    if (!searchTerm) {
      setDisplayBrokerslist(brokerslist);
      return;
    }
    setDisplayBrokerslist(
      brokerslist.filter((item) =>
        Object.values(item).some((value) =>
          value?.toString().toLowerCase().includes(searchTerm)
        )
      )
    );
  };

  // Update display list when brokerslist changes
  useEffect(() => {
    if (brokerslist.length > 0) {
      setDisplayBrokerslist(brokerslist);
    }
  }, [brokerslist]);

  const CloseIcon = () => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 384 512"
        width={35}
        fill="#FFF"
        className="ml-auto absolute right-3"
        onClick={() => setUpdateClicked(false)}
      >
        <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
      </svg>
    );
  };

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Table Columns Definition
  const columns = [
    {
      name: "ID",
      selector: (row) => row.broker_id,
      minWidth: "60px",
      maxWidth: "100px",
    },
    {
      name: "Name",
      selector: (row) => row.brokername,
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
          onClick={() => {
            setFormdata(row);
            setUpdateClicked(true);
          }}
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
        <button onClick={() => HandleDelete(row.broker_id)}>
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
          onClick={() => openCreditModal(row.broker_id)}
        >
          Give Credit
        </button>
      ),
      ignoreRowClick: true,
      button: true,
      minWidth: "110px",
    }
  ];

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
            <h1 className="text-2xl font-bold text-gray-800">Update / Remove Brokers</h1>
            <span className="text-sm text-gray-500">Manage and edit broker records</span>
          </div>
          <div className="flex items-center gap-3 ml-auto">
            <span className="inline-flex items-center gap-2 text-xs font-medium bg-orange-50 text-orange-600 px-3 py-1.5 rounded-full border border-orange-200">
              Total Brokers
              <span className="inline-flex items-center justify-center bg-orange-500 text-white rounded-full w-6 h-6 text-[11px]">
                {displaybrokerlist.length}
              </span>
            </span>
            <input
              type="search"
              className="border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400 rounded-xl px-4 py-2 w-[52vw] sm:w-[320px] text-sm"
              placeholder="Search brokers..."
              onChange={(e) => filtersearch(e.target.value)}
            />
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-xl p-4 overflow-x-auto">
          <DataTable
            paginationPerPage={10}
            columns={columns}
            data={displaybrokerlist}
            highlightOnHover
            striped
            pagination
            paginationTotalRows={displaybrokerlist.length}
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
      <BrokerUpdateDrawer
        isOpen={updatecliked}
        formdata={formdata}
        onClose={() => setUpdateClicked(false)}
        onChange={handleChange}
        onSubmit={UpdateRequest}
        locationList={locationList}
        onServiceLocationsChange={(list) => setFormdata((prev: any) => ({ ...prev, servicelocations: list }))}
      />

      {/* Credit Modal */}
      <CreditModal
        isOpen={showCreditModal}
        brokerId={selectedBrokerId}
        creditCount={creditCount}
        validityOption={validityOption}
        onClose={closeCreditModal}
        onCreditCountChange={setCreditCount}
        onValidityChange={setValidityOption}
        onSave={handleGiveCredit}
        isSending={false}
      />
    </div>
  );
};

export default Page;
