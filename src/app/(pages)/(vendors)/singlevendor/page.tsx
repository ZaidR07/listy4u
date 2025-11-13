"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Header from "@/app/components/Header";
import axiosInstance from "@/lib/axios";

interface VendorProduct {
  _id: string;
  product_name: string;
  mrp: number;
  selling_price: number;
  description?: string;
  images?: string[];
}

const Page = () => {
  const params = useSearchParams();
  const id = params.get("id") || "";

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [vendor, setVendor] = useState<any>(null);
  const [products, setProducts] = useState<VendorProduct[]>([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [currentProductIndex, setCurrentProductIndex] = useState(0);
  const productsPerPage = 4;

  const calculateDiscount = (mrp: number, sellingPrice: number) => {
    if (mrp <= 0) return 0;
    return Math.round(((mrp - sellingPrice) / mrp) * 100);
  };

  const maxIndex = Math.max(0, products.length - productsPerPage);

  const nextProduct = () => {
    setCurrentProductIndex((prev) => Math.min(prev + 1, maxIndex));
  };

  const prevProduct = () => {
    setCurrentProductIndex((prev) => Math.max(prev - 1, 0));
  };

  useEffect(() => {
    const fetchVendor = async () => {
      if (!id) {
        setError("Missing vendor id");
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const res = await axiosInstance.get('/api/getsinglevendor', { params: { id } });
        setVendor(res.data.payload);
        setError("");
        
        // Fetch vendor products
        fetchVendorProducts(id);
      } catch (e: any) {
        setError(e?.response?.data?.message || "Failed to load vendor");
      } finally {
        setLoading(false);
      }
    };
    fetchVendor();
  }, [id]);

  const fetchVendorProducts = async (vendorId: string) => {
    try {
      setProductsLoading(true);
      const res = await axiosInstance.get('/api/getvendorproducts', { params: { vendor_id: vendorId } });
      setProducts(res.data.payload || []);
    } catch (e: any) {
      console.error("Failed to load products:", e);
      setProducts([]);
    } finally {
      setProductsLoading(false);
    }
  };

  return (
    <div className="bg-[#fef6f0] min-h-[100vh] mt-[8vh] lg:mt-[15vh]">
      <Header />
      <div className="px-[5%] py-8">
        {loading ? (
          <div className="w-full py-12 grid place-content-center">
            <span className="animate-spin inline-block w-8 h-8 border-4 border-t-transparent border-orange-500 rounded-full" />
          </div>
        ) : error ? (
          <div className="w-full py-10 text-center text-red-600 text-lg">{error}</div>
        ) : vendor ? (
          <div className="max-w-6xl mx-auto">
            {/* Back Button - Above Header */}
            <div className="mb-4">
              <a 
                href="/vendorslist" 
                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                Back to list
              </a>
            </div>

            {/* Header Section */}
            <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
              <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
                {/* Vendor Image */}
                <img 
                  src={vendor.image || "/default-vendor.png"} 
                  alt={vendor.vendorname} 
                  className="w-32 h-32 rounded-full object-cover ring-4 ring-orange-200 flex-shrink-0" 
                />
                
                {/* Vendor Info */}
                <div className="flex-1">
                  <h1 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-2">{vendor.vendorname}</h1>
                  <div className="space-y-1 text-gray-600">
                    <p className="text-lg">{vendor.address}</p>
                    <p className="text-lg">{vendor.emailid}</p>
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex gap-3 flex-shrink-0">
                  <a 
                    href={`tel:${vendor.mobile1}`} 
                    className="bg-[#FF5D00] hover:bg-[#e55400] text-white rounded-lg px-6 py-3 text-base font-medium transition-colors"
                  >
                    Call
                  </a>
                  <a 
                    href={`https://wa.me/${vendor.mobile1}`} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="bg-green-500 hover:bg-green-600 text-white rounded-lg px-6 py-3 text-base font-medium transition-colors"
                  >
                    WhatsApp
                  </a>
                </div>
              </div>
            </div>

            {/* Products/Services Section */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Products / Services</h2>
              {productsLoading ? (
                <div className="text-center py-8">
                  <span className="animate-spin inline-block w-6 h-6 border-4 border-t-transparent border-orange-500 rounded-full" />
                </div>
              ) : products.length > 0 ? (
                <div className="relative">
                  {/* Carousel Container */}
                  <div className="overflow-hidden">
                    <div 
                      className="flex transition-transform duration-500 ease-in-out"
                      style={{ transform: `translateX(-${currentProductIndex * 25}%)` }}
                    >
                      {products.map((product) => {
                        const discount = calculateDiscount(product.mrp, product.selling_price);
                        return (
                          <div key={product._id} className="w-1/4 flex-shrink-0 px-2">
                            <div className="border rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
                              {/* Product Image */}
                              <div className="aspect-square bg-gray-100 relative">
                                {product.images && product.images.length > 0 ? (
                                  <img 
                                    src={product.images[0]} 
                                    alt={product.product_name}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                  </div>
                                )}
                                {/* Discount Badge */}
                                {discount > 0 && (
                                  <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-md text-sm font-bold">
                                    {discount}% OFF
                                  </div>
                                )}
                              </div>
                              
                              {/* Product Info */}
                              <div className="p-4">
                                <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2 min-h-[3rem]">{product.product_name}</h3>
                                <div className="flex items-center gap-2 mb-2">
                                  <span className="text-sm text-gray-500 line-through">₹{product.mrp}</span>
                                  <span className="text-xl font-bold text-orange-600">₹{product.selling_price}</span>
                                </div>
                             
                                <button className="mt-3 w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg text-sm font-medium transition-colors">
                                  View
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Navigation Buttons */}
                  {products.length > productsPerPage && (
                    <>
                      {/* Previous Button */}
                      <button
                        onClick={prevProduct}
                        disabled={currentProductIndex === 0}
                        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white hover:bg-gray-100 rounded-full p-3 shadow-lg transition-all z-10 disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label="Previous product"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>

                      {/* Next Button */}
                      <button
                        onClick={nextProduct}
                        disabled={currentProductIndex >= maxIndex}
                        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white hover:bg-gray-100 rounded-full p-3 shadow-lg transition-all z-10 disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label="Next product"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>

                      {/* Dots Indicator */}
                      <div className="flex justify-center gap-2 mt-4">
                        {Array.from({ length: maxIndex + 1 }).map((_, index) => (
                          <button
                            key={index}
                            onClick={() => setCurrentProductIndex(index)}
                            className={`w-2 h-2 rounded-full transition-all ${
                              index === currentProductIndex 
                                ? 'bg-orange-500 w-6' 
                                : 'bg-gray-300 hover:bg-gray-400'
                            }`}
                            aria-label={`Go to page ${index + 1}`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <div className="text-center p-6 border-2 border-dashed border-gray-300 rounded-xl">
                  <p className="text-gray-500">No products listed yet</p>
                </div>
              )}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Page;
