//@ts-nocheck
"use client";

import { useEffect, useState, useRef } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Cookies from "js-cookie";
import { useRouter, useSearchParams } from "next/navigation";
import Select from "react-select";
import AddPropertiesPhotos from "@/app/components/AddPropertiesPhotos";
import { useSelector, useDispatch } from "react-redux";
import { setlocation } from "@/slices/locationSlice";
import LocationBox from "@/app/components/LocationBox";
import {
  LocationField,
  HighlightsField,
  AmenitiesField,
  SelectField,
  AreaField,
  BedroomsField,
  PropertyTypeField,
} from "@/app/components/properties";
import {
  useGetVariables,
  useGetBuildings,
  useGetSpecificProperty,
  useUpdateProperty,
} from "@/hooks/properties";

const EditPropertyPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams(); // Use useSearchParams for query parameters
  const propertyId = searchParams.get("id"); // Extract id from query parameters
  const [isLoading, setIsLoading] = useState(true); // Start with loading true
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);

  const locationstate = useSelector((state: any) => state.location.location);
  const dispatch = useDispatch();

  const [user, setUser] = useState(null);
  const userCookie = Cookies.get("user");

  // React Query Hooks
  const { data: variables = {} } = useGetVariables();
  const { data: buildings = [] } = useGetBuildings(locationstate);
  const { data: propertyData, isLoading: isLoadingProperty } = useGetSpecificProperty(propertyId || "");
  const updatePropertyMutation = useUpdateProperty();

  // Initialize form data with all fields
  const [formdata, setFormdata] = useState({
    Societyname: "",
    floor: "",
    bedrooms: "",
    area: "",
    areaunits: "",
    buildingfloors: "",
    address: "",
    amenities: [],
    facing: "",
    propertyage: "",
    balconies: "",
    bathrooms: "",
    price: "",
    postedby: "",
    type: "",
    constructionstatus: "",
    furnishing: "",
    highlights: [],
    location: "",
    line: "",
    images: [],
    for: "Sale",
  });

  // State to track new images (files)
  const [newImages, setNewImages] = useState([]);
  // State to track removed images (URLs)
  const [removedImages, setRemovedImages] = useState([]);

  const [highlightInput, setHighlightInput] = useState("");
  const [currentpropertytype, setCurrentPropertytype] = useState(1);
  const [originalImages, setOriginalImages] = useState([]);

  // Load property data from React Query
  useEffect(() => {
    if (!propertyId) {
      toast.error("No property ID provided");
      router.push("/");
      return;
    }

    if (propertyData) {
      const amenities = propertyData.amenities
        ? Array.isArray(propertyData.amenities)
          ? propertyData.amenities
          : propertyData.amenities.split(",")
        : [];
      const highlights = propertyData.highlights
        ? Array.isArray(propertyData.highlights)
          ? propertyData.highlights
          : propertyData.highlights.split(",")
        : [];
      setOriginalImages(propertyData.images || []);

      const updatedFormData = {
        Societyname: propertyData.Societyname || "",
        floor: propertyData.floor || "",
        bedrooms: propertyData.bedrooms || "",
        area: propertyData.area || "",
        areaunits: propertyData.areaunits || "",
        buildingfloors: propertyData.buildingfloors || "",
        address: propertyData.address || "",
        amenities: amenities,
        facing: propertyData.facing || "",
        propertyage: propertyData.propertyage || "",
        balconies: propertyData.balconies || "",
        bathrooms: propertyData.bathrooms || "",
        price: propertyData.price || "",
        postedby: propertyData.postedby || user || "",
        type: propertyData.type || "",
        constructionstatus: propertyData.constructionstatus || "",
        furnishing: propertyData.furnishing || "",
        highlights: highlights,
        location: propertyData.location || "",
        line: propertyData.line || "",
        images: propertyData.images || [],
        for: propertyData.for || "Sale",
      };
      setFormdata(updatedFormData);

      if (propertyData.location) {
        dispatch(setlocation(propertyData.location));
      }
      
      // Set loading to false once data is loaded
      setIsLoading(false);
    }
  }, [propertyData, user, dispatch, router, propertyId]);

  // Get user from cookie
  useEffect(() => {
    if (userCookie) {
      try {
        const email = userCookie.split("^")[0];
        setUser(email);
        setFormdata((prev) => ({ ...prev, postedby: email }));
      } catch {
        toast.error("Something went wrong with user authentication");
      }
    }
  }, [userCookie]);

  // Update suggestions when buildings data changes
  useEffect(() => {
    if (buildings && buildings.length > 0) {
      setSuggestions(buildings);
    }
  }, [buildings]);

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormdata((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle highlights
  const addHighlight = () => {
    if (highlightInput.trim() !== "") {
      setFormdata((prevData) => ({
        ...prevData,
        highlights: [...prevData.highlights, highlightInput],
      }));
      setHighlightInput("");
    }
  };

  const removeHighlight = (index) => {
    setFormdata((prevData) => ({
      ...prevData,
      highlights: prevData.highlights.filter((_, i) => i !== index),
    }));
  };

  // Handle images
  const handleImagesChange = (updatedImages) => {
    setFormdata((prevData) => ({
      ...prevData,
      images: updatedImages,
    }));
  };
  
  // Remove an image from the existing images
  const removeImage = (index) => {
    setFormdata((prevData) => ({
      ...prevData,
      images: prevData.images.filter((_, i) => i !== index),
    }));
  };
  
  // Remove a new image from the new images
  const removeNewImage = (index) => {
    setNewImages((prev) => prev.filter((_, i) => i !== index));
    
    // Also remove the preview URL
    // @ts-ignore
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
  };
  
  // Add a state for preview URLs
  const [previewUrls, setPreviewUrls] = useState([]);


  // Handle suggestion selection
  const handleSuggestionClick = (suggestion) => {
    setFormdata((prevData) => ({
      ...prevData,
      Societyname: suggestion,
    }));
    setShowSuggestions(false);
    setIsFocused(false);
    inputRef.current.focus();
  };

  // Form submission for update
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData();
      
      // Append all form fields except images
      for (const key in formdata) {
        if (key !== "images" && key !== "newImages") {
          if (Array.isArray(formdata[key])) {
            formData.append(key, JSON.stringify(formdata[key]));
          } else {
            formData.append(key, formdata[key]);
          }
        }
      }
      
      // Append existing images (URLs) as a JSON string
      formData.append("images", JSON.stringify(formdata.images));
      
      // Append new image files
      newImages.forEach((file) => {
        formData.append("new_images", file);
      });
      
      // Append removed images (URLs) as a JSON string
      formData.append("removed_images", JSON.stringify(removedImages));
      
      formData.append("property_id", propertyId);

      await updatePropertyMutation.mutateAsync(formData);
      toast.success("Property updated successfully!");
      router.push(`/singleproperty?id=${propertyId}`);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to update property. Please try again.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const LocationIcon = () => {
    return (
      <svg
        width={20}
        fill="#ff5d00"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 384 512"
      >
        <path d="M215.7 499.2C267 435 384 279.4 384 192C384 86 298 0 192 0S0 86 0 192c0 87.4 117 243 168.3 307.2c12.3 15.3 35.1 15.3 47.4 0zM192 128a64 64 0 1 1 0 128 64 64 0 1 1 0-128z" />
      </svg>
    );
  };

  // Render loading state or form
  if (isLoadingProperty || isLoading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="flex relative">
      <div className={`w-full min-h-[90vh] bg-gray-200 px-[6%] py-[5vh]`}>
        <h1 className="text-2xl text-center mb-5 text-[#FF5D00]">
          Edit Property
        </h1>

        {locationstate && (
          <span
            onClick={() => dispatch(setlocation(""))}
            className="flex gap-2 mb-2 items-center cursor-pointer"
          >
            <LocationIcon /> {locationstate}
          </span>
        )}

        <form className="p-6 bg-white rounded-2xl" onSubmit={handleSubmit}>
          {/* Hidden field for "for" value */}
          <input type="hidden" name="for" value={formdata.for} />

          {/* Property Type */}
          <div className="mb-4">
            <label>
              Property Type <span className="text-red-700">*</span>
            </label>
            <select
              name="type"
              value={formdata.type}
              onChange={(e) => {
                handleChange(e);
                const selectedOption = variables?.propertytypelist.find(
                  (item) => item.name === e.target.value
                );
                if (selectedOption) {
                  setCurrentPropertytype(selectedOption.category);
                }
              }}
              className="border-b-2 border-black w-full mt-3"
              required
            >
              <option value="">Select Type</option>
              {variables?.propertytypelist?.map((item, index) => (
                <option key={index} value={item.name}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>

          {/* Society/Building Name */}
          <div className="mb-4 relative">
            <label>
              Society / Building / Plot Name <span className="text-red-700">*</span>
            </label>
            <input
              ref={inputRef}
              name="Societyname"
              value={formdata.Societyname}
              onChange={handleChange}
              onFocus={() => {
                setIsFocused(true);
                setShowSuggestions(true);
              }}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              type="text"
              className="border-b-2 border-black w-full mt-3 text-gray-600"
              placeholder="Enter society name..."
              required
            />
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-0 w-full bg-white shadow-lg rounded-md mt-1 max-h-60 overflow-y-auto z-10">
                {suggestions
                  .filter((suggestion) =>
                    suggestion.toLowerCase().includes(formdata.Societyname.toLowerCase())
                  )
                  .map((suggestion, index) => (
                    <div
                      key={suggestion}
                      className={`px-4 py-2 text-sm text-gray-600 cursor-pointer hover:bg-gray-100 ${
                        index === selectedSuggestionIndex ? "bg-gray-100" : ""
                      }`}
                      onMouseDown={() => handleSuggestionClick(suggestion)}
                    >
                      {suggestion}
                    </div>
                  ))}
              </div>
            )}
          </div>

          {/* Property Details */}
          {currentpropertytype !== 3 && (
            <>
              <div className="mb-4 flex">
                <div className="w-[45%] mr-[10%]">
                  <label>
                    Floor <span className="text-red-700">*</span>
                  </label>
                  <input
                    name="floor"
                    value={formdata.floor}
                    onChange={handleChange}
                    type="number"
                    className="border-b-2 border-black w-full"
                    required
                  />
                </div>
                <div className="w-[45%]">
                  <label>
                    Building Floors <span className="text-red-700">*</span>
                  </label>
                  <input
                    name="buildingfloors"
                    value={formdata.buildingfloors}
                    onChange={handleChange}
                    type="number"
                    className="border-b-2 border-black w-full"
                    required
                  />
                </div>
              </div>

              <div className="mb-4">
                <label>
                  Bedrooms <span className="text-red-700">*</span>
                </label>
                <div className="flex flex-wrap gap-3 mt-2">
                  {variables.bhklist?.map((option, index) => (
                    <label key={index} className="flex gap-2 items-center">
                      <input
                        type="radio"
                        name="bedrooms"
                        value={option}
                        checked={formdata.bedrooms === option || formdata.bedrooms?.replace(/\s+/g, '') === option?.replace(/\s+/g, '')}
                        onChange={handleChange}
                        required
                      />
                      <span>{option}</span>
                    </label>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Area */}
          <div className="mb-4">
            <label>
              Area <span className="text-red-700">*</span>
            </label>
            <div className="flex gap-3 items-center">
              <input
                name="area"
                value={formdata.area}
                onChange={handleChange}
                type="number"
                className="border-b-2 border-black w-full mt-1"
                placeholder="Enter area"
                required
              />
              <select
                name="areaunits"
                value={formdata.areaunits}
                onChange={handleChange}
                className="border-b-2 border-black px-2 py-1"
                required
              >
                <option value="">Select</option>
                <option value="sqft">Sq. Ft</option>
                <option value="sqmt">Sq. Mt</option>
                <option value="acre">Acre</option>
                <option value="guntha">Guntha</option>
                <option value="hectare">Hectare</option>
              </select>
            </div>
          </div>

          {/* Bathrooms */}
          <div className="mb-4">
            <label>
              Bathrooms <span className="text-red-700">*</span>
            </label>
            <select
              name="bathrooms"
              value={formdata.bathrooms}
              onChange={handleChange}
              className="border-b-2 border-black px-2 py-1 w-full"
              required
            >
              <option value="">Select</option>
              {[1, 2, 3, 4, 5].map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>
          </div>

          {/* Balconies */}
          <div className="mb-4">
            <label>
              Balconies <span className="text-red-700">*</span>
            </label>
            <select
              name="balconies"
              value={formdata.balconies}
              onChange={handleChange}
              className="border-b-2 border-black px-2 py-1 w-full"
              required
            >
              <option value="">Select</option>
              {[1, 2, 3, 4, 5].map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>
          </div>

          {/* Facing */}
          <div className="mb-4">
            <label>Facing</label>
            <select
              name="facing"
              value={formdata.facing}
              onChange={handleChange}
              className="border-b-2 border-black w-full mt-2 py-1"
            >
              <option value="">Select Direction</option>
              <option value="East">East</option>
              <option value="West">West</option>
              <option value="North">North</option>
              <option value="South">South</option>
            </select>
          </div>

          {/* Construction Status */}
          <div className="mb-4">
            <label>
              Construction Status <span className="text-red-700">*</span>
            </label>
            <select
              name="constructionstatus"
              value={formdata.constructionstatus}
              onChange={handleChange}
              className="border-b-2 border-black w-full mt-2 py-1"
              required
            >
              <option value="">Select Status</option>
              {variables.constructionstatuslist?.map((item, index) => (
                <option key={index} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          {/* Property Age */}
          <div className="mb-4">
            <label>Property Age (Yrs)</label>
            <input
              name="propertyage"
              value={formdata.propertyage}
              onChange={handleChange}
              type="number"
              className="border-b-2 border-black w-full"
            />
          </div>

          {/* Price */}
          <div className="mb-4">
            <label>
              Price (₹) <span className="text-red-700">*</span>
            </label>
            <input
              name="price"
              value={formdata.price}
              onChange={handleChange}
              type="number"
              className="border-b-2 border-black w-full"
              required
            />
          </div>

          {/* Address */}
          <div className="mb-4">
            <label>
              Address <span className="text-red-700">*</span>
            </label>
            <input
              name="address"
              value={formdata.address}
              onChange={handleChange}
              type="text"
              className="border-b-2 border-black w-full"
              required
            />
          </div>

          {/* Train Line */}
          <div className="mb-4">
            <label>
              Train Line <span className="text-red-700">*</span>
            </label>
            <select
              name="line"
              value={formdata.line}
              onChange={handleChange}
              className="border-b-2 border-black w-full mt-3"
              required
            >
              <option value="">Select Line</option>
              {variables.linelist?.map((item, index) => (
                <option key={index} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          {/* Location */}
          <div className="mb-4">
            <label>
              Location <span className="text-red-600">*</span>
            </label>
            <Select
              options={variables.locationlist?.map((item, index) => ({
                value: item,
                label: item,
                key: index,
              }))}
              isSearchable
              value={
                formdata.location
                  ? { value: formdata.location, label: formdata.location }
                  : null
              }
              onChange={(selectedOption) =>
                setFormdata((prev) => ({
                  ...prev,
                  location: selectedOption?.value || "",
                }))
              }
              placeholder="Select a location..."
              styles={{
                control: (baseStyles) => ({
                  ...baseStyles,
                  backgroundColor: "#fff",
                  borderColor: "#FF5D00",
                  boxShadow: "none",
                  "&:hover": {
                    borderColor: "#FF5D00",
                  },
                }),
                singleValue: (baseStyles) => ({
                  ...baseStyles,
                  color: "#FF5D00",
                }),
                option: (baseStyles, { isSelected, isFocused }) => ({
                  ...baseStyles,
                  backgroundColor: isSelected
                    ? "#FF5D00"
                    : isFocused
                    ? "#FFD3B6"
                    : "#fff",
                  color: isSelected ? "#fff" : "#000",
                }),
                menu: (baseStyles) => ({
                  ...baseStyles,
                  backgroundColor: "#fff",
                  borderRadius: "8px",
                  border: "1px solid #FF5D00",
                }),
              }}
            />
          </div>

          {/* Furnishing */}
          {currentpropertytype !== 3 && (
            <div className="mb-4">
              <label>
                Furnishing <span className="text-red-700">*</span>
              </label>
              <select
                name="furnishing"
                value={formdata.furnishing}
                onChange={handleChange}
                className="border-b-2 border-black w-full mt-3"
                required
              >
                <option value="">Select Type</option>
                {variables.furnishingstatuslist?.map((item, index) => (
                  <option key={index} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Highlights */}
          <div className="mb-4">
            <label>Highlights</label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={highlightInput}
                onChange={(e) => setHighlightInput(e.target.value)}
                className="border-b-2 mt-2 border-black w-full"
                placeholder="Add a highlight..."
              />
              <button
                type="button"
                onClick={addHighlight}
                className="bg-[#FF5D00] text-white px-3 py-1 rounded-md"
              >
                Add
              </button>
            </div>
            <ul className="mt-2">
              {formdata.highlights.map((highlight, index) => (
                <li
                  key={index}
                  className="flex justify-between items-center bg-gray-100 p-2 rounded-md mt-1"
                >
                  {highlight}
                  <button
                    type="button"
                    onClick={() => removeHighlight(index)}
                    className="text-red-600 text-sm"
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Amenities */}
          {currentpropertytype !== 3 && (
            <div className="mb-4">
              <label>
                Amenities <span className="text-red-700">*</span>
              </label>
              <div className="flex flex-wrap gap-4 mt-4">
                {variables.amenitieslist?.map((item, index) => {
                  const isSelected = formdata.amenities.includes(item);
                  return (
                    <button
                      type="button"
                      key={index}
                      onClick={() => {
                        setFormdata((prevData) => ({
                          ...prevData,
                          amenities: isSelected
                            ? prevData.amenities.filter((amenity) => amenity !== item)
                            : [...prevData.amenities, item],
                        }));
                      }}
                      className={`p-2 flex items-center gap-2 rounded-xl ${
                        isSelected ? "bg-blue-500 text-white" : "bg-gray-200 text-black"
                      }`}
                    >
                      <span>{item}</span>
                      {isSelected ? (
                        <span className="text-2xl">-</span>
                      ) : (
                        <span className="text-2xl">+</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Photos */}
          <AddPropertiesPhotos
            newImages={newImages}
            setNewImages={setNewImages}
            existingImages={formdata.images}
            removedImages={removedImages}
            setRemovedImages={setRemovedImages}
            onExistingImagesChange={(index) => {
              // Remove image from formdata.images
              setFormdata(prevData => ({
                ...prevData,
                images: prevData.images.filter((_, i) => i !== index)
              }));
            }}
          />

          {/* Submit Button */}
          <button
            type="submit"
            className="bg-[#FF5D00] text-white px-4 py-2 rounded-md mt-8 w-full"
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : "Update Property"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditPropertyPage;