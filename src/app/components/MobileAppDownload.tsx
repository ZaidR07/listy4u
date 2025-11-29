"use client";
import React from "react";
import Image from "next/image";

const MobileAppDownload = () => {
  return (
    <div id="mobile-app" className="my-8 md:my-12 lg:my-16 px-[5%]  py-8 md:py-12 lg:py-16">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Content */}
          <div className="text-gray-900">
            <h2 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold mb-4 lg:mb-6">
              Download Listy4u Mobile App
            </h2>
            <p className="text-lg md:text-xl lg:text-2xl mb-6 lg:mb-8 opacity-90">
              and never miss out on any update
            </p>
            
            {/* Features List */}
            <div className="space-y-3 lg:space-y-4 mb-6 lg:mb-8">
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 lg:w-6 lg:h-6 text-[#FF5D00]" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-base lg:text-lg">Get to know about newly posted properties as soon as they are posted</span>
              </div>
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 lg:w-6 lg:h-6 text-[#FF5D00]" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-base lg:text-lg">Manage your properties with ease and get instant alerts about responses</span>
              </div>
            </div>

            {/* Download Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="#"
                className="inline-flex items-center justify-center bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors duration-200"
              >
                <svg className="w-6 h-6 mr-2" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
                </svg>
                <div className="text-left">
                  <div className="text-xs">Get it on</div>
                  <div className="text-lg font-semibold">Google Play</div>
                </div>
              </a>
            </div>
          </div>

          {/* Right Content - Static Image */}
          <div className="flex justify-center lg:justify-end">
            <Image
              src="/appdownload.png"
              alt="Listy4u app preview"
              width={640}
              height={480}
              className="w-full max-w-[480px] h-auto rounded-2xl shadow-2xl"
              priority
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileAppDownload;
