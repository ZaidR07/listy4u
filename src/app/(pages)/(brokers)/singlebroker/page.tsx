"use client";
import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
import Header from "@/app/components/Header";
import axiosInstance from "@/lib/axios";
import { priceconverter } from "@/utils/priceconverter";
import { AngleLeft, AngleRight } from "@/app/Icons";
import { getBrokerImageSrc, handleBrokerImageError } from "@/utils/brokerAvatar";
import Register from "@/app/components/Register";
import Cookies from "js-cookie";

const Page = () => {
  const params = useSearchParams();
  const id = params.get("id") || "";

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [broker, setBroker] = useState<any>(null);
  const [properties, setProperties] = useState<any[]>([]);
  const [registeropen, setRegisterOpen] = useState(false);

  const listRef = useRef<HTMLDivElement | null>(null);

  const scrollLeft = () => {
    if (listRef.current) listRef.current.scrollBy({ left: -300, behavior: "smooth" });
  };
  const scrollRight = () => {
    if (listRef.current) listRef.current.scrollBy({ left: 300, behavior: "smooth" });
  };

  useEffect(() => {
    const token = Cookies.get('user') || Cookies.get('owner') || Cookies.get('broker');
    if (!token) {
      setRegisterOpen(true);
      setLoading(false);
      return;
    }
    const fetchBroker = async () => {
      if (!id) {
        setError("Missing broker id");
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const res = await axiosInstance.get('/api/getsinglebroker', { params: { id } });
        setBroker(res.data.payload);
        setError("");
      } catch (e: any) {
        setError(e?.response?.data?.message || "Failed to load broker");
      } finally {
        setLoading(false);
      }
    };
    fetchBroker();
  }, [id]);

  useEffect(() => {
    if (!registeropen) {
      const token = Cookies.get('user') || Cookies.get('owner') || Cookies.get('broker');
      if (token && !broker && id) {
        (async () => {
          try {
            setLoading(true);
            const res = await axiosInstance.get('/api/getsinglebroker', { params: { id } });
            setBroker(res.data.payload);
            setError("");
          } catch (e: any) {
            setError(e?.response?.data?.message || "Failed to load broker");
          } finally {
            setLoading(false);
          }
        })();
      }
    }
  }, [registeropen]);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        if (!broker?.broker_id) return;
        const res = await axiosInstance.get('/api/getbrokerproperties', { params: { id: broker.broker_id } });
        let list = Array.isArray(res.data.payload) ? res.data.payload : [];
        // sort latest first using createdAt or property_id fallback
        list.sort((a, b) => {
          const atA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const atB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          if (atA && atB && atA !== atB) return atB - atA;
          return (b.property_id || 0) - (a.property_id || 0);
        });
        setProperties(list);
      } catch (e) {
        // non-blocking: leave properties empty on error
      }
    };
    fetchProperties();
  }, [broker?.broker_id]);

  return (
    <div className="bg-[#fef6f0] min-h-[100vh] mt-[8vh] lg:mt-[15vh]">
      <Header />
      <div className="px-[5%] py-6">
        {loading ? (
          <div className="w-full py-12 grid place-content-center">
            <span className="animate-spin inline-block w-8 h-8 border-4 border-t-transparent border-orange-500 rounded-full" />
          </div>
        ) : error ? (
          <div className="w-full py-10 text-center text-red-600 text-lg">{error}</div>
        ) : broker ? (
          <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="col-span-1 bg-white rounded-2xl shadow-xl p-6 flex flex-col items-center text-center">
              <img 
                src={getBrokerImageSrc(broker?.image, broker?.brokername)} 
                alt={broker?.brokername || "broker photo"} 
                className="w-32 h-32 rounded-full object-cover ring-4 ring-orange-200" 
                onError={(e) => handleBrokerImageError(e, broker?.brokername)}
              />
              <h1 className="text-2xl font-bold mt-4">{broker.brokername}</h1>
              <p className="text-gray-500">{broker.companyname}</p>
              <div className="mt-4 w-full grid grid-cols-2 gap-3">
                <a href={`tel:${broker.mobile1}`} className="bg-[#FF5D00] text-white rounded-lg py-2 text-sm">Call</a>
                <a href={`https://wa.me/${broker.mobile1}`} target="_blank" rel="noopener noreferrer" className="bg-green-500 text-white rounded-lg py-2 text-sm">WhatsApp</a>
              </div>
            </div>

            <div className="col-span-1 lg:col-span-2 bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-xl font-semibold mb-4">Broker Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border">
                  <span className="text-xs text-gray-500">Email</span>
                  <p className="text-lg break-all">{broker.emailid}</p>
                </div>
                <div className="p-4 rounded-xl border">
                  <span className="text-xs text-gray-500">Mobile 1</span>
                  <p className="text-lg">{broker.mobile1}</p>
                </div>
                <div className="p-4 rounded-xl border">
                  <span className="text-xs text-gray-500">Mobile 2</span>
                  <p className="text-lg">{broker.mobile2 || "-"}</p>
                </div>
                <div className="p-4 rounded-xl border md:col-span-2">
                  <span className="text-xs text-gray-500">Address</span>
                  <p className="text-lg">{broker.address}</p>
                </div>
                <div className="p-4 rounded-xl border md:col-span-2">
                  <span className="text-xs text-gray-500">Service Locations</span>
                  <p className="text-lg">
                    {(() => {
                      const sl = broker?.servicelocations;
                      if (Array.isArray(sl)) return sl.join(", ");
                      if (typeof sl === 'string') {
                        try {
                          const parsed = JSON.parse(sl);
                          return Array.isArray(parsed) ? parsed.join(", ") : sl;
                        } catch {
                          return sl;
                        }
                      }
                      return "-";
                    })()}
                  </p>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <a href={`mailto:${broker.emailid}`} className="px-4 py-2 rounded-lg border text-[#FF5D00] border-[#FF5D00]">Email</a>
                <a href={`/brokerslist`} className="px-4 py-2 rounded-lg bg-blue-600 text-white">Back to list</a>
              </div>
            </div>
          </div>
        ) : null}

        {/* Properties posted by this broker */}
        {properties.length > 0 && (
          <div className="max-w-5xl mx-auto mt-8">
            <h3 className="text-xl font-semibold mb-3">Listed Properties</h3>
            <div className="relative bg-white rounded-2xl shadow px-2 lg:px-3 py-3">
              <button
                onClick={scrollLeft}
                aria-label="Scroll left"
                className="hidden lg:grid place-content-center w-11 h-11 absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-white/90 hover:bg-white shadow-lg rounded-full border border-gray-200 backdrop-blur transition-transform hover:scale-105"
              >
                <AngleLeft className="w-5 h-5 text-gray-700" />
              </button>
              {/* edge fade masks */}
              <div className="pointer-events-none hidden lg:block absolute left-0 top-0 h-full w-12 z-10 bg-gradient-to-r from-white to-transparent rounded-l-2xl" />
              <div className="pointer-events-none hidden lg:block absolute right-0 top-0 h-full w-12 z-10 bg-gradient-to-l from-white to-transparent rounded-r-2xl" />
              <div ref={listRef} className="overflow-x-auto whitespace-nowrap flex gap-3 lg:gap-6 pb-2 scrollbar-hide">
                {properties.map((property) => (
                  <div
                    key={property.property_id}
                    onClick={() => window.location.href = `singleproperty?id=${property.property_id}`}
                    className="bg-transparent min-w-[40%] max-w-[40%] xl:min-w-[25%] xl:max-w-[25%] px-2 py-2 relative rounded-lg border-t-[1px] border-[#fa9c66] shadow-md shadow-[#fa9c66] cursor-pointer"
                  >
                    <div className="relative">
                      <img
                        src={property.images?.length > 0 ? property.images[0] : "/rent.png"}
                        alt="Property"
                        className="rounded-lg w-full lg:h-[40vh] h-[110px] object-cover"
                      />
                      <div className="absolute bottom-2 left-3 rounded-lg p-1 text-sm bg-orange-100 text-[#FF5D00]">
                        {priceconverter(property.price)}
                      </div>
                    </div>
                    <span className="text-xs">{property.bedrooms}</span>{" "}
                    <span className="text-xs">{property.type}</span>{" "}
                    <span className="text-xs text-wrap">{property.floor} Floor</span>
                    <br />
                    <span className="text-xs block">
                      {property.Societyname?.length > 18
                        ? property.Societyname.substring(0, 18) + "..."
                        : property.Societyname || "N/A"}
                    </span>
                    <span className="text-xs block">{property.location}</span>
                  </div>
                ))}
              </div>
              <button
                onClick={scrollRight}
                aria-label="Scroll right"
                className="hidden lg:grid place-content-center w-11 h-11 absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-white/90 hover:bg-white shadow-lg rounded-full border border-gray-200 backdrop-blur transition-transform hover:scale-105"
              >
                <AngleRight className="w-5 h-5 text-gray-700" />
              </button>
            </div>
          </div>
        )}
      </div>
      <Register registeropen={registeropen} setRegisterOpen={setRegisterOpen} />
    </div>
  );
};

export default Page;
