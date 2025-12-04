"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, useCallback, Suspense , useRef } from "react";
import axiosInstance from "@/lib/axios";
import { House, Ruler, IndianRupee, Lock } from "lucide-react";
import { priceconverter } from "@/utils/priceconverter";
import Cookies from "js-cookie";
import { toast } from "react-toastify";

import DesktopNav from "@/app/components/DesktopNav";
import MobileNav from "@/app/components/MobileNav";
import { AngleLeft, AngleRight } from "@/app/Icons";
import { ImageViewer } from "@/app/components/shared";

const WhatsAppIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={30}
      fill="#FFF"
      viewBox="0 0 448 512"
    >
      <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7 .9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z" />
    </svg>
  );
};

const PhoneIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={30}
      fill="#FFF"
      viewBox="0 0 512 512"
    >
      <path d="M280 0C408.1 0 512 103.9 512 232c0 13.3-10.7 24-24 24s-24-10.7-24-24c0-101.6-82.4-184-184-184c-13.3 0-24-10.7-24-24s10.7-24 24-24zm8 192a32 32 0 1 1 0 64 32 32 0 1 1 0-64zm-32-72c0-13.3 10.7-24 24-24c75.1 0 136 60.9 136 136c0 13.3-10.7 24-24 24s-24-10.7-24-24c0-48.6-39.4-88-88-88c-13.3 0-24-10.7-24-24zM117.5 1.4c19.4-5.3 39.7 4.6 47.4 23.2l40 96c6.8 16.3 2.1 35.2-11.6 46.3L144 207.3c33.3 70.4 90.3 127.4 160.7 160.7L345 318.7c11.2-13.7 30-18.4 46.3-11.6l96 40c18.6 7.7 28.5 28 23.2 47.4l-24 88C481.8 499.9 466 512 448 512C200.6 512 0 311.4 0 64C0 46 12.1 30.2 29.5 25.4l88-24z" />
    </svg>
  );
};

const PropertyCard = ({ property, router }) => (
  <div
    onClick={() => router.push(`singleproperty?id=${property.property_id}`)}
    className="bg-white min-w-[60%] sm:min-w-[40%] sm:max-w-[40%] xl:min-w-[25%] xl:max-w-[25%] px-3 py-3 relative rounded-xl border border-orange-200 shadow-lg hover:shadow-2xl cursor-pointer transition-all duration-300 hover:scale-105"
  >
    <div className="relative overflow-hidden rounded-lg">
      <img
        src={property.images?.length > 0 ? property.images[0] : "/rent.png"}
        alt="Property"
        className="rounded-lg w-full lg:h-[40vh] h-[110px] object-cover transition-transform duration-300 hover:scale-110"
      />
      <div className="absolute bottom-2 left-3 rounded-lg px-3 py-1 text-sm font-bold bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md">
        {priceconverter(property.price)}
      </div>
    </div>
    <div className="mt-2">
      <span className="text-xs font-semibold text-gray-700">{property.bedrooms}</span>{" "}
      <span className="text-xs text-gray-600">{property.type}</span>{" "}
      <span className="text-xs text-gray-600">{property.floor} Floor</span>
      <br />
      <span className="text-xs block font-medium text-gray-800 mt-1">
        {property.Societyname?.length > 18
          ? property.Societyname.substring(0, 18) + "..."
          : property.Societyname || "N/A"}
      </span>
      <span className="text-xs block text-orange-600">{property.location}</span>
    </div>
  </div>
);

const PropertyDetails = () => {
  const searchParams = useSearchParams();
  const property_id = searchParams.get("id");
  const [poster, setPoster] = useState({
    brokername: "",
    mobile1: "",
  });
  const router = useRouter();


  const [property, setProperty] = useState({
    images: [],
    highlights: [],
    price: "",
    deposit: "",
    areaunits: "",
    area: "",
    bedrooms: "",
    Societyname: "",
    floor: "",
    buildingfloors: "",
    location: "",
    address: "",
    facing: "",
    propertyage: "",
    constructionstatus: "",
    furnishing: "",
    balconies: "",
    bathrooms: "",
    amenities: [],
    postedbytype: 0,
    postedby_id: 0,
    postedby: "",
    type: "",
    for: "",
    property_id: null,
  });
  const [loading, setLoading] = useState(true);
  const [imageViewer, setImageViewer] = useState({ open: false, index: 0 });
  const [currentSlide, setCurrentSlide] = useState(0);
  const [propertieslist, setPropertieslist] = useState([
    {
      Societyname: "",
      floor: "",
      bedrooms: "",
      area: "",
      areaunits: "",
      buildingfloors: "",
      address: "",
      amenities: [], // array of strings
      facing: "",
      propertyage: "",
      balconies: "",
      bathrooms: "",
      price: "",
      postedby: "",
      type: "",
      constructionstatus: "",
      furnishing: "",
      highlights: [], // array of strings
      location: "",
      line: "",
      for: "",
      property_id: null, // or 0 if you prefer default numeric
      active: false,
      images: [], // array of image URLs or objects
      postedby_id: null,
      postedbytype: null,
    },
  ]);

  const user = Cookies.get("user");
  const isBroker = !!Cookies.get("broker");
  const isOwner = !!Cookies.get("owner");
  const isUser = !!Cookies.get("user") && !isOwner && !isBroker;
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [showContacts, setShowContacts] = useState(false);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const closePurchaseModal = () => setShowPurchaseModal(false);
  const goToPremium = () => { window.location.href = "/userplan"; };

  const Separateemail = (user) => {
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

  const handleViewContacts = async () => {
    try {
      if (!isUser) {
        toast.info("Please login as a user to view contact details.");
        return;
      }
      if (!property?.property_id) return;
      const email = Separateemail(user);
      const role = 'user';
      const res = await axiosInstance.post('/api/consume-user-credit', { email, role });
      if (res.data?.success) {
        setShowContacts(true);
        toast.success('1 credit used. Contacts unlocked.');
      }
    } catch (e:any) {
      const status = e?.response?.status;
      if (status === 402) {
        setShowPurchaseModal(true);
      } else if (status === 404) {
        toast.error('User not found. Please re-login.');
      } else {
        toast.error(e?.response?.data?.message || 'Failed to unlock contact');
      }
    }
  };
  


  const colours = ["#CCEFEA", "#E3FBDA", "#FFEFCB"];

  const hasLoaded = useRef(false);

  const loaddata = useCallback(async () => {
    // Prevent duplicate calls
    if (hasLoaded.current) {
      return;
    }
    
    if (!property_id) {
      setLoading(false);
      return;
    }

    try {
      const response = await axiosInstance.get('/api/getspecificproperty', {
        params: { property_id: property_id },
      });

      if (response.data.payload) {
        // API returns array, get first item
        const propertyData = Array.isArray(response.data.payload) 
          ? response.data.payload[0] 
          : response.data.payload;
        setProperty(propertyData);

        // Determine initial wishlist state for users
        try {
          const userEmail = Separateemail(user);
          if (isUser && userEmail && propertyData?.property_id) {
            const wl = await axiosInstance.get('/api/getwishlist', { params: { email: userEmail } });
            const ids = Array.isArray(wl.data?.payload) ? wl.data.payload.map((p:any) => p.property_id) : [];
            setIsWishlisted(ids.includes(Number(propertyData.property_id)));
          }
        } catch {}

        // Generate lead if user is logged in
        if (user && propertyData.postedby && propertyData.property_id) {
          try {
            const userEmail = Separateemail(user);
            if (userEmail) {
              await axiosInstance.post('/api/generatelead', {
                broker_id: propertyData.postedby,
                property_id: propertyData.property_id,
                email: userEmail,
              });
            }
          } catch (leadError) {
            console.error("Error generating lead:", leadError);
          }
        } else {
          console.log("Missing required data for lead generation");
        }

        // Only fetch poster and broker properties if postedby exists
        if (propertyData.postedby) {
          try {
            const postedbyresponse = await axiosInstance.get('/api/getposterdata', {
              params: { id: propertyData.postedby },
            });

            if (postedbyresponse.data.payload) {
              setPoster(postedbyresponse.data.payload);
            }
          } catch (posterError) {
            console.error("Error fetching poster data:", posterError);
          }

          try {
            const brokerpropertiesresponse = await axiosInstance.get(
              '/api/getbrokerproperties',
              {
                params: { id: propertyData.postedby },
              }
            );

            if (brokerpropertiesresponse.data.payload) {
              setPropertieslist(brokerpropertiesresponse.data.payload);
            }
          } catch (propertiesError) {
            console.error("Error fetching broker properties:", propertiesError);
          }
        } else {
          console.log("No postedby data available");
        }
      } else {
        //@ts-ignore
        setProperty([]);
      }
      
      // Mark as loaded
      hasLoaded.current = true;
      console.log("loaddata: Completed loading for property_id:", property_id);
    } catch (error) {
      console.error("Error loading property data", error);
    } finally {
      setLoading(false);
    }
  }, [property_id, user]);

  const handleToggleWishlist = async () => {
    try {
      if (!isUser) {
        toast.info("Wishlist is available for users only. Please login as user.");
        return;
      }
      if (!property?.property_id) return;
      const email = Separateemail(user);
      if (!email) {
        toast.error("Unable to read your email. Please re-login.");
        return;
      }
      const res = await axiosInstance.post('/api/togglewishlist', {
        property_id: property.property_id,
        email
      });
      if (res.data?.action === 'added') {
        setIsWishlisted(true);
        toast.success('Added to wishlist');
      } else if (res.data?.action === 'removed') {
        setIsWishlisted(false);
        toast.info('Removed from wishlist');
      }
    } catch (e:any) {
      toast.error(e?.response?.data?.message || 'Failed to update wishlist');
    }
  };

  useEffect(() => {
    // Reset the loaded flag when property_id changes
    hasLoaded.current = false;
    loaddata();
    
    // Cleanup function to reset the flag when component unmounts
    return () => {
      hasLoaded.current = false;
    };
  }, [loaddata, property_id]);

  // Open Image Viewer
  const openImageViewer = (index) => {
    setImageViewer({ open: true, index });
  };

  // Close Image Viewer
  const closeImageViewer = () => {
    setImageViewer({ open: false, index: 0 });
  };

  // Navigate Images
  const nextImage = () => {
    setImageViewer((prev) => ({
      ...prev,
      index: (prev.index + 1) % property.images.length,
    }));
  };

  const prevImage = () => {
    setImageViewer((prev) => ({
      ...prev,
      index: (prev.index - 1 + property.images.length) % property.images.length,
    }));
  };

  // Ensure the grid always has 4 images by filling missing slots
  const images = property.images ? [...property.images] : [];
  while (images.length < 4) {
    images.push("/missing_image.jpg");
  }

  const [windowwidth, setWindowWidth] = useState(0);

  const propRef = useRef(null);

  useEffect(() => {
    // This code only runs on the client side
    setWindowWidth(window.innerWidth);
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const scrollLeft = (ref) => {
    if (ref.current) ref.current.scrollBy({ left: -300, behavior: "smooth" });
  };

  const scrollRight = (ref) => {
    if (ref.current) ref.current.scrollBy({ left: 300, behavior: "smooth" });
  };

  const hasDeposit =
    (property.for?.toLowerCase() === "rent" || property.for?.toLowerCase() === "pg") &&
    !!property.deposit;

  const hasBedroomsStat = !!property.bedrooms;

  const statCount = 2 + (hasDeposit ? 1 : 0) + (hasBedroomsStat ? 1 : 0); // Price + Area + optional Deposit + optional Bedrooms
  const gridColsClass =
    statCount >= 4 ? "lg:grid-cols-4" : statCount === 3 ? "lg:grid-cols-3" : "lg:grid-cols-2";

  return (
    <div className="bg-gradient-to-b from-orange-50 via-white to-orange-50 min-h-screen">
      <DesktopNav />
      <MobileNav />
      
      {loading ? (
        <div className="flex mt-[20vh] justify-center items-center py-6">
          <span className="animate-spin inline-block w-12 h-12 border-4 border-t-transparent border-orange-500 rounded-full"></span>
        </div>
      ) : property && property.property_id ? (
        <div className="pb-12">
          {/* Image Gallery */}
          <div className="mx-[2%] lg:mx-[4%] mt-[10vh] landscape:mt-[22vh] md:landscape:mt-[10vh] lg:mt-[8vh] rounded-2xl overflow-hidden shadow-2xl">
            {/* Mobile Carousel - Single Image */}
            <div className="lg:hidden relative h-[40vh]">
              <div
                className="cursor-pointer relative group overflow-hidden rounded-lg h-full"
                onClick={() => openImageViewer(currentSlide)}
              >
                <img
                  className="object-cover w-full h-full"
                  src={images[currentSlide]}
                  alt={`Property Image ${currentSlide + 1}`}
                />
                {/* Navigation Arrows */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentSlide((prev) => (prev - 1 + images.length) % images.length);
                  }}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg transition-all z-10"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                    <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
                  </svg>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentSlide((prev) => (prev + 1) % images.length);
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg transition-all z-10"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                    <path d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12z" />
                  </svg>
                </button>
              </div>
              {/* Dots Indicator */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                {images.map((_, index) => (
                  <button
                    key={index}
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentSlide(index);
                    }}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === currentSlide
                        ? 'bg-white w-6'
                        : 'bg-white/50 hover:bg-white/75'
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            </div>

            {/* Desktop Grid - Multiple Images */}
            <div className="hidden lg:grid grid-cols-4 gap-3 h-[60vh]">
              {/* First Image */}
              <div
                className="cursor-pointer relative group overflow-hidden"
                onClick={() => openImageViewer(0)}
              >
                <img
                  className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"
                  src={images[0]}
                  alt="Property Image 1"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300"></div>
              </div>

            {/* Purchase Modal */}
            {showPurchaseModal && (
              <div className="fixed inset-0 z-[9999] flex items-center justify-center">
                <div className="absolute inset-0 bg-black/50" onClick={closePurchaseModal} />
                <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-[90%] p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">Out of Credits</h3>
                  <p className="text-gray-600 mb-6">You need credits to view contact details. Get Premium to unlock owner phone and WhatsApp.</p>
                  <div className="flex gap-3">
                    <button onClick={goToPremium} className="flex-1 bg-gradient-to-r from-[#FF5D00] to-[#FF8A00] text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all">Get Premium</button>
                    <button onClick={closePurchaseModal} className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-all">Later</button>
                  </div>
                </div>
              </div>
            )}

              {/* Second Image */}
              <div
                className="cursor-pointer relative group overflow-hidden"
                onClick={() => openImageViewer(1)}
              >
                <img
                  className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"
                  src={images[1]}
                  alt="Property Image 2"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300"></div>
              </div>

              {/* Third Image */}
              <div
                className="cursor-pointer relative group overflow-hidden"
                onClick={() => openImageViewer(2)}
              >
                <img
                  className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"
                  src={images[2]}
                  alt="Property Image 3"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300"></div>
              </div>

              {/* Fourth Image */}
              <div
                className="cursor-pointer relative group overflow-hidden"
                onClick={() => openImageViewer(3)}
              >
                {isUser && (
                  <button
                    onClick={(e) => { e.stopPropagation(); handleToggleWishlist(); }}
                    className={`absolute top-2 right-2 z-50 w-10 h-10 rounded-full flex items-center justify-center shadow-lg ring-1 ring-black/10 transition-all ${isWishlisted ? 'bg-red-500 text-white' : 'bg-white text-red-500 hover:bg-red-50'}`}
                    aria-label="Toggle wishlist"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
                      {isWishlisted ? (
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 6 4 4 6.5 4c1.74 0 3.41.81 4.5 2.09C12.09 4.81 13.76 4 15.5 4 18 4 20 6 20 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                      ) : (
                        <path d="M16.5 3.5c-1.74 0-3.41.81-4.5 2.09C10.91 4.31 9.24 3.5 7.5 3.5 5 3.5 3 5.5 3 8c0 3.54 3.4 6.62 8.55 11.3l.45.4.45-.4C17.6 14.62 21 11.54 21 8c0-2.5-2-4.5-4.5-4.5z" />
                      )}
                    </svg>
                  </button>
                )}
                <img
                  className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"
                  src={images[3]}
                  alt="Property Image 4"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300"></div>
              </div>
            </div>

            {/* Mobile: Heart button overlay */}
            {isUser && (
              <button
                onClick={handleToggleWishlist}
                className={`lg:hidden absolute top-4 right-4 z-50 w-10 h-10 rounded-full flex items-center justify-center shadow-lg ring-1 ring-black/10 transition-all ${isWishlisted ? 'bg-red-500 text-white' : 'bg-white text-red-500 hover:bg-red-50'}`}
                aria-label="Toggle wishlist"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
                  {isWishlisted ? (
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 6 4 4 6.5 4c1.74 0 3.41.81 4.5 2.09C12.09 4.81 13.76 4 15.5 4 18 4 20 6 20 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  ) : (
                    <path d="M16.5 3.5c-1.74 0-3.41.81-4.5 2.09C10.91 4.31 9.24 3.5 7.5 3.5 5 3.5 3 5.5 3 8c0 3.54 3.4 6.62 8.55 11.3l.45.4.45-.4C17.6 14.62 21 11.54 21 8c0-2.5-2-4.5-4.5-4.5z" />
                  )}
                </svg>
              </button>
            )}
          </div>

          <div className="mt-[5vh] px-[5%]">
            {/* Highlights Section */}
            <div className="flex gap-3 flex-wrap mb-6">
              {property.highlights?.map((item, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold shadow-md transition-all duration-300 hover:scale-105 hover:shadow-lg"
                  style={{ 
                    backgroundColor: colours[index % colours.length],
                    color: '#1f2937'
                  }}
                >
                  <span className="mr-2 text-orange-600">✓</span>
                  {item}
                </span>
              ))}
            </div>

            {/* Key Stats Card */}
            <div className="bg-gradient-to-br from-orange-500 via-orange-600 to-red-500 text-white p-4 lg:p-8 rounded-3xl shadow-2xl mb-8 border border-orange-400/30">
              <div className={`grid gap-3 lg:gap-6 grid-cols-2 sm:grid-cols-3 ${gridColsClass}`}>
                <div className="text-center bg-white/15 backdrop-blur-md rounded-2xl p-3 lg:p-6 border border-white/20 transition-all duration-300 hover:bg-white/25 hover:scale-105 hover:shadow-lg">
                  <div className="flex justify-center mb-2">
                    <div className="bg-white/20 p-2 lg:p-3 rounded-full">
                     <IndianRupee size={windowwidth < 640 ? 24 : 36} strokeWidth={1.25} />
                    </div>
                  </div>
                  <div className="text-xs lg:text-sm font-medium opacity-90 mb-1 lg:mb-2 uppercase tracking-wide">Price</div>
                  <div className="text-sm md:text-xl lg:text-3xl font-bold leading-tight">
                    {priceconverter(property.price)}
                  </div>
                </div>
                {/* Deposit - Only show for Rent and PG when value present */}
                {hasDeposit && (
                  <div className="text-center bg-white/15 backdrop-blur-md rounded-2xl p-3 lg:p-6 border border-white/20 transition-all duration-300 hover:bg-white/25 hover:scale-105 hover:shadow-lg">
                    <div className="flex justify-center mb-2">
                      <div className="bg-white/20 p-2 lg:p-3 rounded-full">
                        <IndianRupee size={windowwidth < 640 ? 24 : 36} strokeWidth={1.25} />
                      </div>
                    </div>
                    <div className="text-xs lg:text-sm font-medium opacity-90 mb-1 lg:mb-2 uppercase tracking-wide">Deposit</div>
                    <div className="text-sm md:text-xl lg:text-3xl font-bold leading-tight">
                      {priceconverter(property.deposit)}
                    </div>
                  </div>
                )}
                <div className="text-center bg-white/15 backdrop-blur-md rounded-2xl p-3 lg:p-6 border border-white/20 transition-all duration-300 hover:bg-white/25 hover:scale-105 hover:shadow-lg">
                  <div className="flex justify-center mb-2">
                    <div className="bg-white/20 p-2 lg:p-3 rounded-full">
                     <Ruler size={windowwidth < 640 ? 24 : 36} strokeWidth={1.25} />
                    </div>
                  </div>
                  <div className="text-xs lg:text-sm font-medium opacity-90 mb-1 lg:mb-2 uppercase tracking-wide">Area</div>
                  <div className="text-sm md:text-xl lg:text-3xl font-bold leading-tight">
                    {`${property.area} ${property.areaunits}`}
                  </div>
                </div>
                {hasBedroomsStat && (
                  <div className="text-center bg-white/15 backdrop-blur-md rounded-2xl p-3 lg:p-6 border border-white/20 transition-all duration-300 hover:bg-white/25 hover:scale-105 hover:shadow-lg">
                    <div className="flex justify-center mb-2">
                      <div className="bg-white/20 p-2 lg:p-3 rounded-full">
                        <House size={windowwidth < 640 ? 24 : 36} strokeWidth={1.25} />
                      </div>
                    </div>
                    <div className="text-xs lg:text-sm font-medium opacity-90 mb-1 lg:mb-2 uppercase tracking-wide">Bedrooms</div>
                    <div className="text-sm md:text-xl lg:text-3xl font-bold leading-tight">
                      {property.bedrooms}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Description Section */}
            <div className="bg-white rounded-2xl shadow-xl p-6 lg:p-8 mb-8">
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-6 pb-3 border-b-2 border-orange-500">
                Property Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start py-3 px-4 bg-orange-50 rounded-lg">
                  <span className="font-semibold text-gray-700 min-w-[140px]">Society Name:</span>
                  <span className="text-gray-600">{property.Societyname}</span>
                </div>
                <div className="flex items-start py-3 px-4 bg-gray-50 rounded-lg">
                  <span className="font-semibold text-gray-700 min-w-[140px]">Floor:</span>
                  <span className="text-gray-600">{property.floor}<sup>th</sup></span>
                </div>
                <div className="flex items-start py-3 px-4 bg-orange-50 rounded-lg">
                  <span className="font-semibold text-gray-700 min-w-[140px]">Total Floors:</span>
                  <span className="text-gray-600">{property.buildingfloors}</span>
                </div>
                <div className="flex items-start py-3 px-4 bg-gray-50 rounded-lg">
                  <span className="font-semibold text-gray-700 min-w-[140px]">Location:</span>
                  <span className="text-gray-600">{property.location}</span>
                </div>
                <div className="flex items-start py-3 px-4 bg-orange-50 rounded-lg md:col-span-2">
                  <span className="font-semibold text-gray-700 min-w-[140px]">Address:</span>
                  <span className="text-gray-600">{property.address}</span>
                </div>
                <div className="flex items-start py-3 px-4 bg-gray-50 rounded-lg">
                  <span className="font-semibold text-gray-700 min-w-[140px]">Facing:</span>
                  <span className="text-gray-600">{property.facing}</span>
                </div>
                <div className="flex items-start py-3 px-4 bg-orange-50 rounded-lg">
                  <span className="font-semibold text-gray-700 min-w-[140px]">Property Age:</span>
                  <span className="text-gray-600">{property.propertyage}</span>
                </div>
                <div className="flex items-start py-3 px-4 bg-gray-50 rounded-lg">
                  <span className="font-semibold text-gray-700 min-w-[140px]">Status:</span>
                  <span className="text-gray-600">{property.constructionstatus}</span>
                </div>
                <div className="flex items-start py-3 px-4 bg-orange-50 rounded-lg">
                  <span className="font-semibold text-gray-700 min-w-[140px]">Furnishing:</span>
                  <span className="text-gray-600">{property.furnishing}</span>
                </div>
                <div className="flex items-start py-3 px-4 bg-gray-50 rounded-lg">
                  <span className="font-semibold text-gray-700 min-w-[140px]">Bathrooms:</span>
                  <span className="text-gray-600">{property.bathrooms || "NA"}</span>
                </div>
                <div className="flex items-start py-3 px-4 bg-orange-50 rounded-lg">
                  <span className="font-semibold text-gray-700 min-w-[140px]">Balconies:</span>
                  <span className="text-gray-600">{property.balconies || "NA"}</span>
                </div>
                <div className="flex items-start py-3 px-4 bg-gray-50 rounded-lg md:col-span-2">
                  <span className="font-semibold text-gray-700 min-w-[140px]">Amenities:</span>
                  <span className="text-gray-600">
                    {property.amenities?.length > 0 ? (
                      property.amenities.map((item, index) => (
                        <span key={index} className="inline-flex items-center mr-2 mb-1">
                          <span className="text-orange-500 mr-1">•</span>
                          {item}
                          {index !== property.amenities.length - 1 && ","}
                        </span>
                      ))
                    ) : (
                      <span>NA</span>
                    )}
                  </span>
                </div>
              </div>
            </div>

            {/* Contact Controls (Credit-gated) */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              {showContacts ? (
                <>
                  <a
                    className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-4 px-6 rounded-xl shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl flex items-center justify-center gap-3 text-base md:text-lg font-semibold"
                    href={`tel:${poster?.mobile1 || ""}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <PhoneIcon />
                    {poster?.mobile1 || "NA"}
                  </a>
                  <a
                    href={`https://wa.me/${poster?.mobile1 || ""}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-4 px-6 rounded-xl shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl flex items-center justify-center gap-3 text-base md:text-lg font-semibold"
                  >
                    <WhatsAppIcon />
                    WhatsApp
                  </a>
                </>
              ) : (
                <>
                  <button
                    onClick={handleViewContacts}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-4 px-6 rounded-xl shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl font-semibold"
                  >
                    View Phone Number
                  </button>
                  <button
                    onClick={handleViewContacts}
                    className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-4 px-6 rounded-xl shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl font-semibold"
                  >
                    View WhatsApp
                  </button>
                </>
              )}
            </div>

            {/* More Properties Section */}
            <div className="mt-12 bg-white rounded-2xl shadow-xl p-6 lg:p-8">
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-6 text-center">
                More Properties from <span className="text-orange-600">{poster?.brokername}</span>
              </h2>
              <div className="relative mt-5">
                <button
                  onClick={() => scrollLeft(propRef)}
                  className="hidden lg:block absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-orange-500 hover:bg-orange-600 text-white p-3 rounded-full shadow-lg transition-all duration-300"
                >
                  <AngleLeft className="w-6 h-6" />
                </button>
                <div
                  ref={propRef}
                  className="overflow-x-auto whitespace-nowrap flex gap-4 lg:gap-6 pb-2 scrollbar-hide"
                >
                  {propertieslist.map((property, index) => (
                    <PropertyCard
                      key={index}
                      property={property}
                      router={router}
                    />
                  ))}
                </div>
                <button
                  onClick={() => scrollRight(propRef)}
                  className="hidden lg:block absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-orange-500 hover:bg-orange-600 text-white p-3 rounded-full shadow-lg transition-all duration-300"
                >
                  <AngleRight className="w-6 h-6" />
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-center text-gray-600 mt-20">No property details found.</p>
      )}

      {/* Image Viewer Modal */}
      <ImageViewer
        isOpen={imageViewer.open}
        images={images}
        currentIndex={imageViewer.index}
        onClose={closeImageViewer}
        onNext={nextImage}
        onPrev={prevImage}
      />
    </div>
  );
};

// ✅ Wrap in Suspense
const SingleProperty = () => {
  return (
    <Suspense fallback={<div className="text-center py-6">Loading...</div>}>
      <PropertyDetails />
    </Suspense>
  );
};

export default SingleProperty;
