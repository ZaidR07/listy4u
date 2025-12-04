"use client";

import { Suspense, useState, useEffect, useMemo, useCallback } from "react";
import Header from "@/app/components/Header";
import axiosInstance from "@/lib/axios";
import { QueryParamsHandler } from "@/app/components/SearchParameters";
import { useRouter } from "next/navigation";
import { SearchIcon, AngleDownIcon, FilterIcon } from "@/app/Icons";
import PropertiesNav from "@/app/components/PropertiesNav";
import { PropertyDropdown, PriceDropdown, PropertyCard, PropertyFilterSidebar } from "@/app/components/properties";
import { useSelector } from "react-redux";

const Page = () => {
  const placeholders = useMemo(
    () => ["Enter Location...", "Enter Pincode...", "Enter Project..."],
    []
  );



  const locationstate = useSelector((state: any) => state.location.location);

  const [type, setType] = useState("");
  const [view, setView] = useState("");
  const [search, setSearch] = useState("");

  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [buyRentValue, setBuyRentValue] = useState("Buy");
  const [bhkValue, setBhkValue] = useState("Bedrooms");
  const [propertyValue, setPropertyValue] = useState("Type");
  const [constructionstatusvalues, setConstructionStatusValues] = useState([]);
  const [furnishingstatusValues, setFurnishingStatusValues] = useState([]);
  const [amenitiesvalues, setAmenitiesValues] = useState([]);
  const [postedbyValues, setPostedByValues] = useState([]);
  const [purchasetypevalues, setPurchaseTypeValues] = useState([]);
  const [bathroomvalues, setBathroomValues] = useState([]);
  const [balconyvalues, setBalconyValues] = useState([]);
  const [photosOnly, setPhotosOnly] = useState(false);
  const [propertyAge, setPropertyAge] = useState("");
  const [availableForValues, setAvailableForValues] = useState([]);
  const [reraApprovedValues, setReraApprovedValues] = useState([]);
  const [pgServicesValues, setPgServicesValues] = useState([]);
  const [sharingValues, setSharingValues] = useState([]);
  const [totalCapacityValues, setTotalCapacityValues] = useState([]);

  const [range, setRange] = useState([100, 10000]); // Default min-max values
  const [priceRange, setPriceRange] = useState([0, 1000000000]); // Price range state

  const [propertiesList, setPropertiesList] = useState([]);
  const [originalpropertiesList, setOriginalPropertiesList] = useState([]);

  const [filteropen, setFilterOpen] = useState(false);

  const [variables, setVariables] = useState({
    bhklist: [],
    propertytypelist: [],
    constructionstatuslist: [],
    amenitieslist: [],
    furnishingstatuslist: [],
    purchasetypelist: [],
    postedbylist: [],
  });


  const [appliedFilters, setAppliedFilters] = useState([]);

  // Function to update applied filters whenever filter values change
  useEffect(() => {
    const filters = [];

    if (bhkValue && bhkValue !== "Bedrooms") {
      filters.push({ type: "bhk", label: "BHK", value: bhkValue });
    }

    if (propertyValue && propertyValue !== "Type") {
      filters.push({
        type: "propertyType",
        label: "Type",
        value: propertyValue,
      });
    }

    if (constructionstatusvalues.length > 0) {
      filters.push({
        type: "constructionStatus",
        label: "Construction",
        value: constructionstatusvalues.join(", "),
      });
    }

    if (postedbyValues.length > 0) {
      filters.push({
        type: "postedby",
        label: "Posted By",
        value: postedbyValues.join(", "),
      });
    }

    if (amenitiesvalues.length > 0) {
      filters.push({
        type: "amenities",
        label: "Amenities",
        value: amenitiesvalues.join(", "),
      });
    }

    if (bathroomvalues.length > 0) {
      filters.push({
        type: "bathrooms",
        label: "Bathrooms",
        value: bathroomvalues.join(", "),
      });
    }

    if (balconyvalues.length > 0) {
      filters.push({
        type: "balconies",
        label: "Balconies",
        value: balconyvalues.join(", "),
      });
    }

    if (furnishingstatusValues.length > 0) {
      filters.push({
        type: "furnishing",
        label: "Furnishing",
        value: furnishingstatusValues.join(", "),
      });
    }

    if (photosOnly) {
      filters.push({ type: "photosOnly", label: "Photos", value: "With photos" });
    }

    if (propertyAge) {
      filters.push({ type: "propertyAge", label: "Age", value: propertyAge });
    }

    if (availableForValues.length > 0) {
      filters.push({ type: "availableFor", label: "Available For", value: availableForValues.join(", ") });
    }

    if (reraApprovedValues.length > 0) {
      filters.push({ type: "reraApproved", label: "RERA", value: reraApprovedValues.join(", ") });
    }

    if (pgServicesValues.length > 0) {
      filters.push({ type: "pgServices", label: "PG Services", value: pgServicesValues.join(", ") });
    }

    if (sharingValues.length > 0) {
      filters.push({ type: "sharing", label: "Sharing", value: sharingValues.join(", ") });
    }

    if (totalCapacityValues.length > 0) {
      filters.push({ type: "totalCapacity", label: "Total Capacity", value: totalCapacityValues.join(", ") });
    }

    if (priceRange[0] !== 0 || priceRange[1] !== 1000000000) {
      filters.push({
        type: "price",
        label: "Price",
        value: `₹${priceRange[0]} - ₹${priceRange[1]}`,
      });
    }

    setAppliedFilters(filters);
  }, [
    bhkValue,
    propertyValue,
    constructionstatusvalues,
    amenitiesvalues,
    furnishingstatusValues,
    priceRange,
    postedbyValues,
    balconyvalues,
    bathroomvalues,
    photosOnly,
    propertyAge,
  ]);

  // Function to handle removing a filter
  const handleRemoveFilter = (filter) => {
    switch (filter.type) {
      case "bhk":
        setBhkValue("Bedrooms");
        break;
      case "propertyType":
        setPropertyValue("Type");
        break;
      case "constructionStatus":
        setConstructionStatusValues([]);
        break;
      case "postedby":
        setPostedByValues([]);
        break;
      case "amenities":
        setAmenitiesValues([]);
        break;
      case "balconies":
        setBalconyValues([]);
        break;
      case "bathrooms":
        setBathroomValues([]);
        break;
      case "furnishing":
        setFurnishingStatusValues([]);
        break;
      case "price":
        setPriceRange([0, 1000000000]);
        break;
      case "photosOnly":
        setPhotosOnly(false);
        break;
      case "propertyAge":
        setPropertyAge("");
        break;
      case "availableFor":
        setAvailableForValues([]);
        break;
      case "reraApproved":
        setReraApprovedValues([]);
        break;
      case "pgServices":
        setPgServicesValues([]);
        break;
      case "sharing":
        setSharingValues([]);
        break;
      case "totalCapacity":
        setTotalCapacityValues([]);
        break;
      default:
        break;
    }
  };

  const [windowwidth, setWindowWidth] = useState(0);

  useEffect(() => {
    // This code only runs on the client side
    setWindowWidth(window.innerWidth);
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Get query parameters on component mount and set state
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setType(params.get("type") || "");
    setView(params.get("view") || "");
    setSearch(params.get("search") || "");
  }, []); // Runs once on mount

  const normalizeNoSpace = (s) => String(s || "").toLowerCase().replace(/\s+/g, "");

  // Jaro-Winkler Similarity function
  const jaroWinkler = (s1, s2) => {
    const m = [...s1].filter((c) => s2.includes(c)).length;
    if (m === 0) return 0;

    const transpositions =
      [...s1].reduce((acc, c, i) => acc + (c !== s2[i] ? 1 : 0), 0) / 2;
    const prefixLength = Math.min(
      4,
      [...s1].findIndex((c, i) => c !== s2[i]) + 1
    );

    const jaro = (m / s1.length + m / s2.length + (m - transpositions) / m) / 3;
    return jaro + prefixLength * 0.1 * (1 - jaro);
  };

  // Check if similarity score is 70% or more
  const isSimilar = (input, target) => {
    if (!input || !target) return false;
    input = normalizeNoSpace(input);
    target = normalizeNoSpace(target);
    const similarity = jaroWinkler(input, target) * 100; // Convert to percentage
    return similarity >= 70;
  };

  // Main function to fetch data
  const getData = useCallback(async () => {
    try {
      const [propertyRes, variableRes] = await Promise.all([
        axiosInstance.get('/api/getproperties'),
        axiosInstance.get('/api/getvariables'),
      ]);

      if (!propertyRes.data.payload || !variableRes.data.payload) {
        console.error("Invalid response data");
        return;
      }

      let filteredList = propertyRes.data.payload;

      // Filter by location state if available
      if (locationstate) {
        filteredList = filteredList.filter((item) => {
          const itemLocation = normalizeNoSpace(item.location);
          const locationStateNorm = normalizeNoSpace(locationstate);
          return itemLocation.includes(locationStateNorm) || isSimilar(itemLocation, locationStateNorm);
        });
      }

      if (type)
        filteredList = filteredList.filter((item) => item.type === type);

      if (view) filteredList = filteredList.filter((item) => item.for.toLowerCase() === view.toLowerCase());

      if (search) {
        const searchNorm = normalizeNoSpace(search);

        filteredList = filteredList.filter((item) => {
          const location = normalizeNoSpace(item.location);
          const societyName = normalizeNoSpace(item.Societyname);

          // Matches if location OR society name has 70% similarity OR contains search query
          return (
            location.includes(searchNorm) ||
            societyName.includes(searchNorm) ||
            isSimilar(location, searchNorm) ||
            isSimilar(societyName, searchNorm)
          );
        });
      }

      setPropertiesList(filteredList);
      setOriginalPropertiesList(filteredList);
      setVariables(variableRes.data.payload);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, [type, view, search, locationstate]);

  useEffect(() => {
    if (type != "" || view != "" || search != "" || locationstate) {
      getData();
    }
  }, [type, view, search, locationstate]); // Runs when type/view/location change

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prevIndex) => (prevIndex + 1) % placeholders.length);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const filterpropertylist = () => {
    let newlist = originalpropertiesList;

    if (bhkValue && bhkValue !== "Bedrooms") {
      newlist = newlist.filter((item) => item.bedrooms == bhkValue);
    }

    if (propertyValue && propertyValue !== "Type") {
      newlist = newlist.filter((item) => item.type == propertyValue);
    }

    if (constructionstatusvalues && constructionstatusvalues.length > 0) {
      newlist = newlist.filter((item) =>
        constructionstatusvalues.includes(item.constructionstatus)
      );
    }

    if (postedbyValues && postedbyValues.length > 0) {
      const selected = postedbyValues.map((v) => String(v).toLowerCase());
      newlist = newlist.filter((item) => {
        let val = (item.postedbytype || "").toString().toLowerCase();
        if(val === 'broker') {
          val ='dealer'
        }
        return selected.includes(val);
      });
    }

    if (bathroomvalues && bathroomvalues.length > 0) {
      const selected = bathroomvalues.map((val) => parseInt(val, 10));
      newlist = newlist.filter((item) => {
        const b = parseInt(item.bathrooms, 10);
        if (isNaN(b)) return false;
        return selected.includes(b);
      });
    }

    if (balconyvalues && balconyvalues.length > 0) {
      const selected = balconyvalues.map((val) => parseInt(val, 10));
      newlist = newlist.filter((item) => {
        const b = parseInt(item.balconies, 10);
        if (isNaN(b)) return false;
        return selected.includes(b);
      });
    }

    // Filter by Amenities (ALL selected amenities must be present)
    if (amenitiesvalues && amenitiesvalues.length > 0) {
      newlist = newlist.filter((item) =>
        amenitiesvalues.every((amenity) => item.amenities.includes(amenity))
      );
    }

    // Filter by furnishing status
    if (furnishingstatusValues && furnishingstatusValues.length > 0) {
      newlist = newlist.filter((item) =>
        furnishingstatusValues.includes(item.furnishing)
      );
    }

    // Filter by Purchase Type
    if (purchasetypevalues && purchasetypevalues.length > 0) {
      newlist = newlist.filter((item) =>
        purchasetypevalues.includes(item.purchasetype)
      );
    }

    // Filter by Price Range
    if (priceRange) {
      newlist = newlist.filter(
        (item) => item.price >= priceRange[0] && item.price <= priceRange[1]
      );
    }

    // Filter by Area Range
    if (range && Array.isArray(range) && range.length === 2) {
      const [minA, maxA] = range;
      newlist = newlist.filter((item) => {
        const a = Number(item.area);
        if (isNaN(a)) return false;
        return a >= minA && a <= maxA;
      });
    }

    // Properties with photos
    if (photosOnly) {
      newlist = newlist.filter(
        (item) => Array.isArray(item.images) && item.images.some((img) => !!img)
      );
    }

    // Property Age (soft string comparison)
    if (propertyAge) {
      const sel = propertyAge;
      newlist = newlist.filter((item) => {
        const age = parseInt((item.propertyage ?? "").toString(), 10);
        if (isNaN(age)) return false;
        if (sel === "0-1") return age >= 0 && age <= 1;
        if (sel === "1-5") return age >= 1 && age <= 5;
        if (sel === "5-10") return age > 5 && age <= 10;
        if (sel === "10+") return age >= 10;
        return false;
      });
    }

    // Available For (Rent)
    if (availableForValues.length > 0) {
      newlist = newlist.filter((item) => {
        const raw = item.availablefor;
        if (!raw) return false;
        const arr = Array.isArray(raw)
          ? raw
          : String(raw).split(",").map((s) => s.trim());
        const arrLower = arr.map((s) => s.toLowerCase());
        return availableForValues.some((v) => arrLower.includes(String(v).toLowerCase()));
      });
    }

    // RERA Approved (Buy)
    if (reraApprovedValues.length > 0) {
      newlist = newlist.filter((item) => {
        const val = (item.reraapproved || "").toString().toLowerCase();
        return reraApprovedValues.some((v) => val.includes(String(v).toLowerCase()));
      });
    }

    // PG Services (ALL selected must be present)
    if (pgServicesValues.length > 0) {
      newlist = newlist.filter((item) => {
        const raw = item.pgservices || [];
        const arr = Array.isArray(raw)
          ? raw
          : String(raw).split(",").map((s) => s.trim());
        const arrLower = arr.map((s) => s.toLowerCase());
        return pgServicesValues.every((v) => arrLower.includes(String(v).toLowerCase()));
      });
    }

    // Sharing (any)
    if (sharingValues.length > 0) {
      newlist = newlist.filter((item) => {
        const val = (item.sharing || "").toString().toLowerCase();
        return sharingValues.some((v) => val.includes(String(v).toLowerCase()));
      });
    }

    // Total Capacity (any)
    if (totalCapacityValues.length > 0) {
      newlist = newlist.filter((item) => {
        const val = (item.totalcapacity || "").toString().toLowerCase();
        return totalCapacityValues.some((v) => val.includes(String(v).toLowerCase()));
      });
    }

    setPropertiesList(newlist);
  };

  useEffect(() => {
    filterpropertylist();
  }, [
    propertyValue,
    bhkValue,
    priceRange,
    range,
    constructionstatusvalues,
    amenitiesvalues,
    furnishingstatusValues,
    postedbyValues,
    bathroomvalues,
    balconyvalues,
    photosOnly,
    propertyAge,
    availableForValues,
    reraApprovedValues,
    pgServicesValues,
    sharingValues,
    totalCapacityValues,
  ]);

  const handleReset = () => {
    setBhkValue("Bedrooms");
    setPropertyValue("Type");
    setConstructionStatusValues([]);
    setAmenitiesValues([]);
    setRange([100, 10000]);
    setPriceRange([0, 10000000000]);
    setPropertiesList(originalpropertiesList);
    setFurnishingStatusValues([]);
    setPhotosOnly(false);
    setPropertyAge("");
    setAvailableForValues([]);
    setReraApprovedValues([]);
    setPgServicesValues([]);
    setSharingValues([]);
    setTotalCapacityValues([]);
  };

  return (
    <>
      <div className="lg:hidden">
        <Header />
      </div>
      <div className="hidden lg:block">
        <PropertiesNav />
      </div>

      <div className="bg-gray-100 mt-[8vh] lg:mt-[14vh] lg:pt-[5vh] 2xl:pt-2 min-h-screen">
        <Suspense fallback={<div>Loading...</div>}>
          <QueryParamsHandler
            onParams={useCallback(({ type, view, search }) => {
              setType(type);
              setView(view);
              setSearch(search);
            }, [])}
          />
        </Suspense>
        <nav className="lg:hidden w-full min-h-[8vh] landscape:mt-[20vh] landscape:h-[20vh] bg-[#f3701f] shadow-2xl flex items-center px-4">
          <div className="relative w-full py-2 sm:py-0">
            <SearchIcon fill="#aaa" width={18} />
            <input
              className="border-2 border-gray-100 rounded-xl pl-10 pr-2 text-sm py-2 w-full outline-none"
              type="search"
              placeholder={placeholders[placeholderIndex]}
              aria-label="Search location or project"
            />
          </div>
        </nav>

        {/* Filter & Sort Buttons */}
        <div className="mt-[2vh] lg:mt-[5vh]   flex justify-between px-5">
          <button
            onClick={() => setFilterOpen(!filteropen)}
            className="lg:hidden border-[#f3701f] border-2 py-2 px-4 flex gap-2 rounded-xl"
          >
            <span className="text-[#f3701f]">Filter</span>
            <FilterIcon width={18} fill="#f3701f" />
          </button>
        </div>
        {/* Filter Sidebar  */}
        <PropertyFilterSidebar
          isOpen={filteropen}
          appliedFilters={appliedFilters}
          variables={variables}
          view={view}
          constructionstatusvalues={constructionstatusvalues}
          purchasetypevalues={purchasetypevalues}
          bathroomvalues={bathroomvalues}
          balconyvalues={balconyvalues}
          postedbyValues={postedbyValues}
          amenitiesvalues={amenitiesvalues}
          furnishingstatusValues={furnishingstatusValues}
          range={range}
          priceRange={priceRange}
          propertiesList={propertiesList}
          onRemoveFilter={handleRemoveFilter}
          onConstructionStatusChange={setConstructionStatusValues}
          onPurchaseTypeChange={setPurchaseTypeValues}
          onBathroomChange={setBathroomValues}
          onBalconyChange={setBalconyValues}
          onPostedByChange={setPostedByValues}
          onAmenitiesChange={setAmenitiesValues}
          onFurnishingChange={setFurnishingStatusValues}
          photosOnly={photosOnly}
          onPhotosOnlyChange={setPhotosOnly}
          propertyAge={propertyAge}
          onPropertyAgeChange={setPropertyAge}
          onPriceRangeChange={setPriceRange}
          availableForValues={availableForValues}
          onAvailableForChange={setAvailableForValues}
          reraApprovedValues={reraApprovedValues}
          onReraApprovedChange={setReraApprovedValues}
          pgServicesValues={pgServicesValues}
          onPgServicesChange={setPgServicesValues}
          sharingValues={sharingValues}
          onSharingChange={setSharingValues}
          totalCapacityValues={totalCapacityValues}
          onTotalCapacityChange={setTotalCapacityValues}
          onRangeChange={setRange}
          onReset={handleReset}
          onClose={() => setFilterOpen(false)}
        />

        <section className="flex mt-[2vh] lg:-mt-8  px-[5%] lg:px-[3%] w-full gap-2 lg:fixed">
          <PriceDropdown
            onApply={(range) => {
              setPriceRange(range);
              filterpropertylist();
            }}
          />
          <PropertyDropdown
            label="BHK"
            options={variables.bhklist || []}
            selected={bhkValue}
            onSelect={setBhkValue}
          />
          {type == "" && (
            <PropertyDropdown
              label="Type"
              options={variables.propertytypelist || []}
              selected={propertyValue}
              onSelect={setPropertyValue}
            />
          )}
        </section>
        {/* Properties List */}
        <section className=" px-[5%] lg:ml-[32%] py-5 flex flex-col gap-4">
          <div></div>
          {Array.isArray(propertiesList) && propertiesList.length > 0 ? (
            propertiesList.map((item, key) => (
              <PropertyCard key={key} property={item} windowwidth={windowwidth} />
            ))
          ) : (
            <div>Nothing Found</div>
          )}
        </section>
      </div>
    </>
  );
};

export default Page;
