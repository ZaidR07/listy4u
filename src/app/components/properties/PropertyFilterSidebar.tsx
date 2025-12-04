"use client";

import { AngleDownIcon } from "@/app/Icons";

interface FilterSidebarProps {
  isOpen: boolean;
  appliedFilters: any[];
  variables: any;
  view: string;
  constructionstatusvalues: string[];
  purchasetypevalues: string[];
  bathroomvalues: string[];
  balconyvalues: string[];
  postedbyValues: string[];
  amenitiesvalues: string[];
  furnishingstatusValues: string[];
  range: number[];
  propertiesList: any[];
  onRemoveFilter: (filter: any) => void;
  onConstructionStatusChange: (values: string[]) => void;
  onPurchaseTypeChange: (values: string[]) => void;
  onBathroomChange: (values: string[]) => void;
  onBalconyChange: (values: string[]) => void;
  onPostedByChange: (values: string[]) => void;
  onAmenitiesChange: (values: string[]) => void;
  onFurnishingChange: (values: string[]) => void;
  photosOnly: boolean;
  onPhotosOnlyChange: (value: boolean) => void;
  propertyAge: string;
  onPropertyAgeChange: (value: string) => void;
  priceRange: number[];
  onPriceRangeChange: (range: number[]) => void;
  availableForValues: string[];
  onAvailableForChange: (values: string[]) => void;
  reraApprovedValues: string[];
  onReraApprovedChange: (values: string[]) => void;
  pgServicesValues: string[];
  onPgServicesChange: (values: string[]) => void;
  sharingValues: string[];
  onSharingChange: (values: string[]) => void;
  totalCapacityValues: string[];
  onTotalCapacityChange: (values: string[]) => void;
  onRangeChange: (range: number[]) => void;
  onReset: () => void;
  onClose: () => void;
}

const bathrooms = ["1", "2", "3", "4", "5"];
const balconies = ["0", "1", "2", "3", "4", "5"];

export const PropertyFilterSidebar = ({
  isOpen,
  appliedFilters,
  variables,
  view,
  constructionstatusvalues,
  purchasetypevalues,
  bathroomvalues,
  balconyvalues,
  postedbyValues,
  amenitiesvalues,
  furnishingstatusValues,
  range,
  propertiesList,
  onRemoveFilter,
  onConstructionStatusChange,
  onPurchaseTypeChange,
  onBathroomChange,
  onBalconyChange,
  onPostedByChange,
  onAmenitiesChange,
  onFurnishingChange,
  photosOnly,
  onPhotosOnlyChange,
  propertyAge,
  onPropertyAgeChange,
  priceRange,
  onPriceRangeChange,
  availableForValues,
  onAvailableForChange,
  reraApprovedValues,
  onReraApprovedChange,
  pgServicesValues,
  onPgServicesChange,
  sharingValues,
  onSharingChange,
  totalCapacityValues,
  onTotalCapacityChange,
  onRangeChange,
  onReset,
  onClose,
}: FilterSidebarProps) => {
  return (
    <div
      className={`w-[90%] lg:w-[32%] max-h-[55vh] lg:max-h-[70vh] bg-[#fff] fixed rounded-2xl mt-[12vh] lg:mt-[5vh] z-30 lg:z-0 pl-[8%] pr-4 lg:px-[2%] py-5 border-2 border-[#f3701f] lg:border-gray-300 transition-transform duration-500 ease-in-out overflow-y-scroll 
    lg:translate-x-[5%] ${
      isOpen ? "translate-x-[-5%]" : "-translate-x-full"
    }`}
    >
      {/* Applied Filters */}
      {appliedFilters && appliedFilters.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          <h1 className="text-lg font-semibold">Applied Filters :</h1>
          {appliedFilters.map((filter, index) => (
            <div
              key={index}
              className="flex items-center bg-gray-200 rounded-lg px-3 py-1 text-sm"
            >
              <span>
                <span className="text-orange-600">{filter.label} : </span>
                {filter.value}
              </span>
              <button
                onClick={() => onRemoveFilter(filter)}
                className="ml-2 text-red-600 md:text-base lg:text-lg hover:text-red-800"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Construction Status */}
      {view !== 'Rent' && view !== 'Pg' && (
        <div>
          <div className="flex gap-3">
            <span className="font-semibold text-lg">Construction Status</span>
            <AngleDownIcon width={20} fill="#000" />
          </div>
          <div className="grid grid-cols-2 gap-x-6 gap-y-2">
            {variables.constructionstatuslist &&
              variables.constructionstatuslist.length > 0 &&
              variables.constructionstatuslist.map((item, index) => (
                <label key={index} className="flex gap-2 items-center">
                  <input
                    type="checkbox"
                    value={item}
                    checked={constructionstatusvalues.includes(item)}
                    onChange={(e) => {
                      onConstructionStatusChange(
                        constructionstatusvalues.includes(item)
                          ? constructionstatusvalues.filter((val) => val !== item)
                          : [...constructionstatusvalues, item]
                      );
                    }}
                  />
                  <span>{item}</span>
                </label>
              ))}
          </div>
        </div>
      )}

      {/* Purchase Type */}
      {view !== 'Rent' && view !== 'Pg' && (
        <div>
          <div className="mt-4 flex gap-3">
            <span className="font-semibold text-lg">Purchase Type</span>
            <AngleDownIcon width={20} fill="#000" />
          </div>
          <div className="grid grid-cols-2 gap-x-6 gap-y-2">
            {variables.purchasetypelist &&
              variables.purchasetypelist.length > 0 &&
              variables.purchasetypelist.map((item, index) => (
                <label key={index} className="flex gap-2 items-center">
                  <input
                    type="checkbox"
                    value={item}
                    checked={purchasetypevalues.includes(item)}
                    onChange={(e) => {
                      onPurchaseTypeChange(
                        purchasetypevalues.includes(item)
                          ? purchasetypevalues.filter((val) => val !== item)
                          : [...purchasetypevalues, item]
                      );
                    }}
                  />
                  <span>{item}</span>
                </label>
              ))}
          </div>
        </div>
      )}

      {/* Area */}
      <div className="mt-4">
        <div className="flex gap-3 items-center">
          <span className="font-semibold text-lg">Area</span>
          <AngleDownIcon width={20} fill="#000" />
        </div>
        <input
          type="range"
          min="0"
          max="10000"
          value={range[1]}
          className="w-full mt-2 accent-[#f3701f]"
          onChange={(e) => onRangeChange([range[0], Number(e.target.value)])}
        />
        <div className="flex justify-evenly items-center mt-2">
          <input
            type="number"
            value={range[0]}
            className="border p-2  2xl:w-28 xl:w-24 lg:w-20 w-12 text-center"
            onChange={(e) => onRangeChange([Number(e.target.value), range[1]])}
          />
          <input
            type="number"
            value={range[1]}
            className="border p-2 2xl:w-28 xl:w-24 lg:w-20 w-12 text-center"
            onChange={(e) => onRangeChange([range[0], Number(e.target.value)])}
          />
          <span>
            {propertiesList.length > 0 && propertiesList[0].areaunits}
          </span>
        </div>
      </div>

      {/* Bathrooms */}
      <div>
        <div className="mt-4 flex gap-3">
          <span className="font-semibold text-lg">Bathrooms</span>
          <AngleDownIcon width={20} fill="#000" />
        </div>
        <div className="grid grid-cols-2 gap-x-6 gap-y-2">
          {bathrooms.map((item, index) => (
            <label key={index} className="flex gap-2 items-center">
              <input
                type="checkbox"
                value={item}
                checked={bathroomvalues.includes(item)}
                onChange={(e) => {
                  onBathroomChange(
                    bathroomvalues.includes(item)
                      ? bathroomvalues.filter((val) => val !== item)
                      : [...bathroomvalues, item]
                  );
                }}
              />
              <span>
                {item != "1" ? `${item} Bathrooms` : `${item} Bathroom`}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Balconies */}
      <div>
        <div className="mt-4 flex gap-3">
          <span className="font-semibold text-lg">Balconies</span>
          <AngleDownIcon width={20} fill="#000" />
        </div>
        <div className="grid grid-cols-2 gap-x-6 gap-y-2">
          {balconies.map((item, index) => (
            <label key={index} className="flex gap-2 items-center">
              <input
                type="checkbox"
                value={item}
                checked={balconyvalues.includes(item)}
                onChange={(e) => {
                  onBalconyChange(
                    balconyvalues.includes(item)
                      ? balconyvalues.filter((val) => val !== item)
                      : [...balconyvalues, item]
                  );
                }}
              />
              <span>
                {item != "1" ? `${item} Balconies` : `${item} Balcony`}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Posted By */}
      <div>
        <div className="mt-4 flex gap-3">
          <span className="font-semibold text-lg">Posted By</span>
          <AngleDownIcon width={20} fill="#000" />
        </div>
        <div className="grid grid-cols-2 gap-x-6 gap-y-2">
          {variables.postedbylist &&
            variables.postedbylist.length > 0 &&
            variables.postedbylist.map((item, index) => (
              <label key={index} className="flex gap-2 items-center">
                <input
                  type="checkbox"
                  value={item}
                  checked={postedbyValues.includes(item)}
                  onChange={(e) => {
                    onPostedByChange(
                      postedbyValues.includes(item)
                        ? postedbyValues.filter((val) => val !== item)
                        : [...postedbyValues, item]
                    );
                  }}
                />
                <span>{item}</span>
              </label>
            ))}
        </div>
      </div>

      {/* Amenities */}
      <div>
        <div className="mt-4 flex gap-3">
          <span className="font-semibold text-lg">Amenities</span>
          <AngleDownIcon width={20} fill="#000" />
        </div>
        <div className="grid grid-cols-2 gap-x-6 gap-y-2">
          {variables.amenitieslist &&
            variables.amenitieslist.length > 0 &&
            variables.amenitieslist.map((item, index) => (
              <label key={index} className="flex gap-2 items-center">
                <input
                  type="checkbox"
                  value={item}
                  checked={amenitiesvalues.includes(item)}
                  onChange={(e) => {
                    onAmenitiesChange(
                      amenitiesvalues.includes(item)
                        ? amenitiesvalues.filter((val) => val !== item)
                        : [...amenitiesvalues, item]
                    );
                  }}
                />
                <span>{item}</span>
              </label>
            ))}
        </div>
      </div>

      {/* Furnishing Status */}
      <div>
        <div className="mt-4 flex gap-3">
          <span className="font-semibold text-lg">Furnishing Status</span>
          <AngleDownIcon width={20} fill="#000" />
        </div>
        <div className="grid grid-cols-2 gap-x-6 gap-y-2">
          {variables.furnishingstatuslist &&
            variables.furnishingstatuslist.length > 0 &&
            variables.furnishingstatuslist.map((item, index) => (
              <label key={index} className="flex gap-2 items-center">
                <input
                  type="checkbox"
                  value={item}
                  checked={furnishingstatusValues.includes(item)}
                  onChange={(e) => {
                    onFurnishingChange(
                      furnishingstatusValues.includes(item)
                        ? furnishingstatusValues.filter((val) => val !== item)
                        : [...furnishingstatusValues, item]
                    );
                  }}
                />
                <span>{item}</span>
              </label>
            ))}
        </div>
      </div>

      {/* Available For (Rent) */}
      {view === 'Rent' && (
        <div>
          <div className="mt-4 flex gap-3">
            <span className="font-semibold text-lg">Available For</span>
            <AngleDownIcon width={20} fill="#000" />
          </div>
          <div className="grid grid-cols-2 gap-x-6 gap-y-2">
            {variables.availableforlist && variables.availableforlist.length > 0 && variables.availableforlist.map((item, index) => (
              <label key={index} className="flex gap-2 items-center">
                <input
                  type="checkbox"
                  value={item}
                  checked={availableForValues.includes(item)}
                  onChange={() => {
                    onAvailableForChange(
                      availableForValues.includes(item)
                        ? availableForValues.filter((v) => v !== item)
                        : [...availableForValues, item]
                    );
                  }}
                />
                <span>{item}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* PG Services, Sharing, Total Capacity (Pg) */}
      {view === 'Pg' && (
        <>
          <div>
            <div className="mt-4 flex gap-3">
              <span className="font-semibold text-lg">PG Services</span>
              <AngleDownIcon width={20} fill="#000" />
            </div>
            <div className="grid grid-cols-2 gap-x-6 gap-y-2">
              {variables.pgserviceslist && variables.pgserviceslist.length > 0 && variables.pgserviceslist.map((item, index) => (
                <label key={index} className="flex gap-2 items-center">
                  <input
                    type="checkbox"
                    value={item}
                    checked={pgServicesValues.includes(item)}
                    onChange={() => {
                      onPgServicesChange(
                        pgServicesValues.includes(item)
                          ? pgServicesValues.filter((v) => v !== item)
                          : [...pgServicesValues, item]
                      );
                    }}
                  />
                  <span>{item}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <div className="mt-4 flex gap-3">
              <span className="font-semibold text-lg">Sharing</span>
              <AngleDownIcon width={20} fill="#000" />
            </div>
            <div className="grid grid-cols-2 gap-x-6 gap-y-2">
              {variables.sharinglist && variables.sharinglist.length > 0 && variables.sharinglist.map((item, index) => (
                <label key={index} className="flex gap-2 items-center">
                  <input
                    type="checkbox"
                    value={item}
                    checked={sharingValues.includes(item)}
                    onChange={() => {
                      onSharingChange(
                        sharingValues.includes(item)
                          ? sharingValues.filter((v) => v !== item)
                          : [...sharingValues, item]
                      );
                    }}
                  />
                  <span>{item}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <div className="mt-4 flex gap-3">
              <span className="font-semibold text-lg">Total Capacity</span>
              <AngleDownIcon width={20} fill="#000" />
            </div>
            <div className="grid grid-cols-2 gap-x-6 gap-y-2">
              {variables.totalcapacitylist && variables.totalcapacitylist.length > 0 && variables.totalcapacitylist.map((item, index) => (
                <label key={index} className="flex gap-2 items-center">
                  <input
                    type="checkbox"
                    value={item}
                    checked={totalCapacityValues.includes(item)}
                    onChange={() => {
                      onTotalCapacityChange(
                        totalCapacityValues.includes(item)
                          ? totalCapacityValues.filter((v) => v !== item)
                          : [...totalCapacityValues, item]
                      );
                    }}
                  />
                  <span>{item}</span>
                </label>
              ))}
            </div>
          </div>
        </>
      )}

      {/* RERA Approved (Buy) */}
      {view === 'Sale' && (
        <div>
          <div className="mt-4 flex gap-3">
            <span className="font-semibold text-lg">RERA Approved</span>
            <AngleDownIcon width={20} fill="#000" />
          </div>
          <div className="grid grid-cols-2 gap-x-6 gap-y-2">
            {variables.reraapprovedlist && variables.reraapprovedlist.length > 0 && variables.reraapprovedlist.map((item, index) => (
              <label key={index} className="flex gap-2 items-center">
                <input
                  type="checkbox"
                  value={item}
                  checked={reraApprovedValues.includes(item)}
                  onChange={() => {
                    onReraApprovedChange(
                      reraApprovedValues.includes(item)
                        ? reraApprovedValues.filter((v) => v !== item)
                        : [...reraApprovedValues, item]
                    );
                  }}
                />
                <span>{item}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Properties with photos */}
      <div>
        <div className="mt-4 flex items-center justify-between">
          <span className="font-semibold text-lg">Properties with photos</span>
          <label className="inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={photosOnly}
              onChange={(e) => onPhotosOnlyChange(e.target.checked)}
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all relative peer-checked:bg-[#f3701f]"></div>
          </label>
        </div>
      </div>

      {/* Age of properties */}
      {view !== 'Pg' && (
      <div>
        <div className="mt-4 flex gap-3">
          <span className="font-semibold text-lg">Age of properties</span>
          <AngleDownIcon width={20} fill="#000" />
        </div>
        <div className="grid grid-cols-2 gap-x-6 gap-y-2">
          {['0-1','1-5','5-10','10+'].map((opt) => (
            <label key={opt} className="flex gap-2 items-center">
              <input
                type="radio"
                name="propertyAge"
                value={opt}
                checked={propertyAge === opt}
                onChange={(e) => onPropertyAgeChange(e.target.value)}
              />
              <span>{opt}</span>
            </label>
          ))}
        </div>
      </div>
      )}

      

      {/* Filter and Reset Buttons */}
      <div className="flex justify-between mt-4">
        <button
          onClick={onReset}
          className="border-[#f3701f] border-2 py-2 px-4 rounded-xl text-[#f3701f]"
        >
          Reset
        </button>
        <button
          onClick={onClose}
          className="bg-[#f3701f] py-2 px-4 rounded-xl text-white sm:hidden"
        >
          Close
        </button>
      </div>
    </div>
  );
};
