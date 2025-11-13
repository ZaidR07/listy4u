"use client";

import Header from "@/app/components/Header";
import { useState, useCallback, useEffect } from "react";
import axiosInstance from "@/lib/axios";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Cookies from 'js-cookie';

const Page = () => {
  const [vendorlist, setVendorlist] = useState([]);
  const [filteredVendors, setFilteredVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const router = useRouter();

  // Function to extract email from JWT token (same as broker leads)
  const Separateemail = (user: string | undefined) => {
    if (!user) return null;
    // Try to decode JWT token and read email from payload
    try {
      const base64 = user.split(".")[1];
      if (base64) {
        const json = atob(base64.replace(/-/g, "+").replace(/_/g, "/"));
        const payload = JSON.parse(json);
        const email = payload?.email || payload?.user?.email || payload?.sub || null;
        if (email) return email;
      }
    } catch {}

    // Legacy cookie formats
    const userData = user.split('^');
    if (userData.length > 0) {
      const emailMatch = userData[0].match(/^(.+?)(\.[0-9]+)?$/);
      if (emailMatch) return emailMatch[1];
    }
    return user;
  };

  // Check if user is logged in from cookies and localStorage
  useEffect(() => {
    const checkUserLogin = () => {
      // Try localStorage first
      let email = localStorage.getItem('userEmail');
      
      // Try to get from cookies (user or owner token)
      if (!email) {
        const userToken = Cookies.get('user');
        const ownerToken = Cookies.get('owner');
        const token = userToken || ownerToken;
        
        if (token) {
          email = Separateemail(token);
        }
      }
      
      setUserEmail(email);
      console.log('User email detected:', email || 'Not logged in');
    };
    
    checkUserLogin();
  }, []);

  const loaddata = useCallback(async () => {
    try {
      const params = new URLSearchParams(window.location.search);
      const id = params.get("id");

      setLoading(true);
      const response = await axiosInstance.get('/api/getvendors', {
        params: { categoryId: id },
      });
      const data = response.data.payload;
      setVendorlist(data);
      setFilteredVendors(data);
    } catch (error) {
      console.error("Error loading vendors", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loaddata();
  }, [loaddata]);

  // Search/filter function
  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setFilteredVendors(vendorlist);
      return;
    }

    const query = searchQuery.toLowerCase().trim();
    const filtered = vendorlist.filter((vendor: any) => {
      const vendorName = vendor.vendorname?.toLowerCase() || '';
      const address = vendor.address?.toLowerCase() || '';
      
      return vendorName.includes(query) || address.includes(query);
    });

    setFilteredVendors(filtered);
  };

  // Handle Enter key press
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleVendorClick = async (vendorId: string) => {
    console.log('Vendor clicked:', vendorId);
    console.log('User email for lead:', userEmail);
    
    // Generate lead if user is logged in
    if (userEmail) {
      try {
        console.log('Sending lead generation request...');
        const response = await axiosInstance.post('/api/generatevendorlead', {
          vendor_id: vendorId,
          user_email: userEmail,
        });
        console.log('✅ Vendor lead generated successfully:', response.data);
        toast.success('Lead sent to vendor! 🎉', {
          position: 'top-right',
          autoClose: 2000,
        });
      } catch (error: any) {
        console.error('❌ Error generating vendor lead:', error);
        console.error('Error details:', error?.response?.data);
        const errorMsg = error?.response?.data?.message || 'Failed to generate lead';
        toast.error(`Error: ${errorMsg}`, {
          position: 'top-right',
          autoClose: 4000,
        });
        // Don't navigate if there's an error
        return;
      }
    } else {
      console.log('⚠️ User not logged in');
      toast.info('Please login to contact vendors', {
        position: 'top-right',
        autoClose: 3000,
      });
    }
    
    // Navigate to vendor details page
    router.push(`/singlevendor?id=${vendorId}`);
  };

  return (
    <div className="bg-[#fef6f0] min-h-[100vh] mt-[8vh] lg:mt-[15vh]">
      <Header />
      <section className="pt-[2vh] px-[5%] h-[8vh] rounded-lg flex gap-[2%]">
        <input
          className="w-[75%] lg:w-[86%] h-full shadow-lg rounded-lg border-2 px-4 focus:outline-none focus:border-orange-500"
          type="search"
          placeholder="Search by Name or Location"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <button 
          onClick={handleSearch}
          className="w-[23%] lg:w-[12%] bg-[#ff5d00] py-2 text-white rounded-lg hover:bg-orange-600 transition-colors"
        >
          Search
        </button>
      </section>
      <section className="w-full px-[5%] mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {loading ? (
          <div className="text-center py-4">
            <span className="animate-spin inline-block w-6 h-6 border-4 border-t-transparent border-orange-500 rounded-full"></span>
          </div>
        ) : filteredVendors.length > 0 ? (
          filteredVendors.map((item, index) => (
            <div
              key={index}
              className="w-full py-4 bg-[#fff] shadow-md px-4 rounded-md "
            >
              <div className="gap-1 flex w-[100%] flex-col items-center">
                <img
                  src={item.image}
                  className="w-[100px] h-[100px] rounded-full ring-2 object-cover"
                  alt="vendor"
                />
                <span className="text-lg">{item.vendorname}</span>
                <span className="text-sm text-gray-400">
                  {item.companyname}
                </span>
                <button
                  onClick={() => handleVendorClick(item.vendor_id)}
                  className="text-white bg-[#FF5D00] px-4 py-1 rounded-md"
                >
                  View Details
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-8">
            <p className="text-gray-500 text-lg">
              {searchQuery ? `No vendors found matching "${searchQuery}"` : 'No vendors found'}
            </p>
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setFilteredVendors(vendorlist);
                }}
                className="mt-4 text-orange-500 hover:text-orange-600 underline"
              >
                Clear search
              </button>
            )}
          </div>
        )}
      </section>
      <ToastContainer />
    </div>
  );
};

export default Page;
