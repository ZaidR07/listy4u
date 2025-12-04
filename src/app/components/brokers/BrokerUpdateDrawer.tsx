"use client";
import { useEffect, useState } from "react";

interface BrokerFormData {
  broker_id: string;
  brokername: string;
  companyname: string;
  emailid: string;
  mobile1: string;
  mobile2: string;
  address: string;
  servicelocations?: any;
}

interface BrokerUpdateDrawerProps {
  isOpen: boolean;
  formdata: BrokerFormData;
  onClose: () => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  locationList?: string[];
  onServiceLocationsChange?: (list: string[]) => void;
}

const CloseIcon = ({ onClick }: { onClick: () => void }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 384 512"
      width={35}
      fill="#FF5D00"
      className="cursor-pointer"
      onClick={onClick}
    >
      <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
    </svg>
  );
};

export const BrokerUpdateDrawer = ({
  isOpen,
  formdata,
  onClose,
  onChange,
  onSubmit,
  locationList = [],
  onServiceLocationsChange,
}: BrokerUpdateDrawerProps) => {
  if (!isOpen) return null;

  const [locationSearch, setLocationSearch] = useState("");
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);

  useEffect(() => {
    const sl = (formdata as any)?.servicelocations;
    if (!sl) {
      setSelectedLocations([]);
      return;
    }
    if (Array.isArray(sl)) {
      setSelectedLocations(sl as string[]);
    } else if (typeof sl === "string") {
      try {
        const parsed = JSON.parse(sl as string);
        setSelectedLocations(Array.isArray(parsed) ? parsed : String(sl).split(",").map((s) => s.trim()).filter(Boolean));
      } catch {
        setSelectedLocations(String(sl).split(",").map((s) => s.trim()).filter(Boolean));
      }
    } else {
      setSelectedLocations([]);
    }
  }, [formdata]);

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (showLocationDropdown && !event.target.closest('.location-dropdown-container')) {
        setShowLocationDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showLocationDropdown]);

  const filteredLocations = (locationList || []).filter(
    (l) => l.toLowerCase().includes(locationSearch.toLowerCase()) && !selectedLocations.includes(l)
  );

  return (
    <div className="fixed inset-0 z-[1000000]">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative h-full w-full flex items-start justify-center pt-[12vh] px-4 sm:px-6">
        <div className="w-full max-w-4xl bg-white shadow-2xl rounded-2xl border overflow-hidden">
          <div className="flex items-center justify-between px-5 lg:px-6 py-4 border-b">
            <h2 className="text-lg lg:text-xl font-semibold text-gray-800">Update Broker</h2>
            <CloseIcon onClick={onClose} />
          </div>
          <form onSubmit={onSubmit} className="p-5 lg:p-6 max-h-[70vh] overflow-y-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Broker ID</label>
                <input
                  name="broker_id"
                  value={formdata.broker_id}
                  disabled
                  className="w-full rounded-lg border border-gray-300 bg-gray-100 text-gray-600 px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Broker Name</label>
                <input
                  name="brokername"
                  value={formdata.brokername}
                  onChange={onChange}
                  className="w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-400 focus:border-orange-400 px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Company Name</label>
                <input
                  name="companyname"
                  value={formdata.companyname}
                  onChange={onChange}
                  className="w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-400 focus:border-orange-400 px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Email ID</label>
                <input
                  name="emailid"
                  value={formdata.emailid}
                  onChange={onChange}
                  className="w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-400 focus:border-orange-400 px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Primary Mobile</label>
                <input
                  name="mobile1"
                  value={formdata.mobile1}
                  onChange={onChange}
                  className="w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-400 focus:border-orange-400 px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Secondary Mobile</label>
                <input
                  name="mobile2"
                  value={formdata.mobile2}
                  onChange={onChange}
                  className="w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-400 focus:border-orange-400 px-3 py-2 text-sm"
                />
              </div>
              <div className="lg:col-span-2">
                <label className="block text-sm text-gray-600 mb-1">Service Locations</label>
                <div className="relative location-dropdown-container">
                  <div
                    className="min-h-[38px] border border-gray-300 rounded p-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition cursor-text"
                    onClick={() => setShowLocationDropdown(true)}
                  >
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
                                const updated = selectedLocations.filter((l) => l !== location);
                                setSelectedLocations(updated);
                                onServiceLocationsChange?.(updated);
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
                        filteredLocations.map((l, idx) => (
                          <div
                            key={idx}
                            onClick={() => {
                              const updated = [...selectedLocations, l];
                              setSelectedLocations(updated);
                              onServiceLocationsChange?.(updated);
                              setLocationSearch("");
                              setShowLocationDropdown(false);
                            }}
                            className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-xs"
                          >
                            {l}
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
              </div>
              <div className="lg:col-span-2">
                <label className="block text-sm text-gray-600 mb-1">Address</label>
                <input
                  name="address"
                  value={formdata.address}
                  onChange={onChange}
                  className="w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-400 focus:border-orange-400 px-3 py-2 text-sm"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700">Cancel</button>
              <button type="submit" className="px-5 py-2 rounded-lg bg-[#FF5D00] text-white hover:bg-[#e45500]">Update</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
