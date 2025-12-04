import { MedalIcon } from "lucide-react";
import axiosInstance from "@/lib/axios";
import { useState, useEffect, useCallback } from "react";
import { svgAvatarDataUrl, getBrokerImageSrc, handleBrokerImageError } from "@/utils/brokerAvatar";
const medalColors = ["#FFD700", "#C0C0C0", "#CD7F32", "#4b4a4a", "#4b4a4a"]; // Gold, Silver, Bronze, Black for 4th & 5th

const FeaturedBrokers = () => {
  const [brokerlist, setBrokerlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loaddata = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const brokerRes = await axiosInstance.get('/api/getbrokers');
      const brokers = Array.isArray(brokerRes?.data?.payload) ? brokerRes.data.payload : [];

      if (!brokers.length) {
        setBrokerlist([]);
        return;
      }

      let properties: any[] = [];
      try {
        const propRes = await axiosInstance.get('/api/getproperties');
        properties = Array.isArray(propRes?.data?.payload) ? propRes.data.payload : [];
      } catch (e) {
        // If properties fail to load, fall back to first 5 brokers
        setBrokerlist(brokers.slice(0, 5));
        return;
      }

      if (!properties.length) {
        setBrokerlist(brokers.slice(0, 5));
        return;
      }

      const propertyCountMap: Record<string, number> = {};

      properties.forEach((prop: any) => {
        const key = String(prop?.postedby || '').trim();
        if (!key) return;
        propertyCountMap[key] = (propertyCountMap[key] || 0) + 1;
      });

      const brokersWithCounts = brokers.map((broker: any) => {
        const idKey = String(broker?.broker_id || '').trim();
        const count = idKey ? propertyCountMap[idKey] || 0 : 0;
        return { ...broker, __propertyCount: count };
      });

      brokersWithCounts.sort((a: any, b: any) => b.__propertyCount - a.__propertyCount);

      const topWithProperties = brokersWithCounts
        .filter((b: any) => b.__propertyCount > 0)
        .slice(0, 5);

      const finalList = topWithProperties.length > 0
        ? topWithProperties
        : brokers.slice(0, 5);

      setBrokerlist(finalList);
    } catch (error) {
      setError("Failed to load brokers");
      setBrokerlist([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loaddata();
  }, [loaddata]);

  return (
    <div className="w-full bg-[#fef6f0] pb-6 ">
      {/* Header */}
      <div className="mt-[2vh] py-6 lg:pt-12 mx-2 text-xl px-[5%] shadow-inner flex items-center">
        <MedalIcon
          className="text-[rgb(243,112,31)]"
          size={50}
          strokeWidth={2}
        />
        <div className="ml-4">
          <h1 className="font-semibold text-xl lg:text-2xl">Featured Brokers</h1>
          <span className="text-sm lg:text-base text-gray-600">
            Brokers who are doing great in service.
          </span>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <p className="text-center mt-4 text-gray-500">Loading brokers...</p>
      ) : error ? (
        <p className="text-center mt-4 text-red-500">{error}</p>
      ) : brokerlist.length > 0 ? (
        <div className="w-full px-6 lg:px-8 lg:pb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 lg:gap-6">
          {brokerlist.map((item, index) => (
            <div
              key={index}
              className="relative p-5 bg-white rounded-2xl border border-orange-200 shadow-md shadow-[#fa9c66]/30 hover:shadow-lg hover:-translate-y-0.5 transition flex flex-col items-center justify-center gap-3 h-56 max-w-full"
            >
              {/* Medal badge */}
              <div className="absolute -top-3 -left-3 bg-white rounded-full shadow-sm">
                <MedalIcon
                  size={36}
                  strokeWidth={2}
                  color={medalColors[index] || "#A9A9A9"}
                />
              </div>

              {/* Avatar */}
              <div className="w-20 h-20 rounded-full overflow-hidden ring-2 ring-gray-200 bg-white flex items-center justify-center">
                <img
                  className="w-full h-full object-cover"
                  src={getBrokerImageSrc(item?.image, item.brokername)}
                  alt={item?.brokername ? `${item.brokername} photo` : "broker photo"}
                  referrerPolicy="no-referrer"
                  loading="lazy"
                  decoding="async"
                  onError={(e) => handleBrokerImageError(e, item.brokername)}
                />
              </div>

              {/* Text */}
              <div className="text-center px-2 w-full">
                <span className="text-base font-medium block truncate leading-tight">
                  {item.brokername}
                </span>
                <span className="text-sm text-gray-500 font-medium block truncate leading-tight">
                  {item.companyname || "Na"}
                </span>
              </div>
            </div>
          ))}
          </div>
        </div>
      ) : (
        <p className="text-center mt-4 text-gray-500">
          No featured brokers available.
        </p>
      )}
    </div>
  );
};

export default FeaturedBrokers;
