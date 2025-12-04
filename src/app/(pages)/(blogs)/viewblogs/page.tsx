"use client";

import { useEffect, useState } from "react";
import AdminHeader from "@/app/components/AdminHeader";
import axiosInstance from "@/lib/axios";
import DataTable from "react-data-table-component";
import { useRouter } from "next/navigation";

const ViewBlogsPage = () => {
  const router = useRouter();
  const [sidebaropen, setSidebarOpen] = useState(false);
  const [blogs, setBlogs] = useState<any[]>([]);
  const [displayBlogs, setDisplayBlogs] = useState<any[]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const loadBlogs = async () => {
      try {
        const res = await axiosInstance.get("/api/getblogs");
        const payload = Array.isArray(res?.data?.payload)
          ? res.data.payload
          : [];
        setBlogs(payload);
        setDisplayBlogs(payload);
      } catch (e) {
        setBlogs([]);
        setDisplayBlogs([]);
      }
    };
    loadBlogs();
  }, []);

  const filterSearch = (value: string) => {
    const term = value.toLowerCase();
    if (!term) {
      setDisplayBlogs(blogs);
      return;
    }
    setDisplayBlogs(
      blogs.filter((item) =>
        Object.values(item).some((v) =>
          String(v || "")
            .toLowerCase()
            .includes(term)
        )
      )
    );
  };

  const columns: any[] = [
    {
      name: "Title",
      selector: (row: any) => row.title,
      sortable: true,
      wrap: true,
      width: "260px",
    },
    {
      name: "Category",
      selector: (row: any) => row.category_name || "-",
      width: "160px",
    },
    {
      name: "Publish Date",
      selector: (row: any) => {
        const date = row.publish_date || row.createdAt;
        return date ? new Date(date).toLocaleDateString() : "-";
      },
      sortable: true,
      width: "150px",
    },
    {
      name: "Actions",
      cell: (row: any) => (
        <button
          onClick={() => router.push(`/addblog?id=${row._id}`)}
          className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded text-sm"
        >
          Edit
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
      style: { minWidth: "100%" },
    },
  };

  if (!isClient) return null;

  return (
    <div className="lg:mt-[12vh] lg:flex bg-gray-100 min-h-[88vh]">
      <AdminHeader sidebaropen={sidebaropen} setSidebarOpen={setSidebarOpen} />
      <div
        className={`w-full mt-[10vh] lg:mt-[0vh] px-4 lg:px-6 py-[4vh] transition-all duration-300 ${
          sidebaropen ? "lg:ml-[23%]" : "lg:ml-[12%]"
        }`}
      >
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-800">View Blogs</h1>
          <button
            onClick={() => router.push("/addblog")}
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium"
          >
            + Add Blog
          </button>
        </div>
        <div className="bg-white rounded-2xl shadow-xl p-4">
          <input
            type="search"
            className="border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400 mb-4 rounded-xl px-4 py-2 w-full"
            placeholder="Search blogs by any field..."
            onChange={(e) => filterSearch(e.target.value)}
          />
          <DataTable
            paginationPerPage={10}
            columns={columns}
            data={displayBlogs}
            pagination
            customStyles={customStyles}
            responsive
            highlightOnHover
            pointerOnHover
          />
        </div>
      </div>
    </div>
  );
};

export default ViewBlogsPage;
