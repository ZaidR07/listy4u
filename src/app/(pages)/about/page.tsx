"use client";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { vendorData } from "@/app/components/Vendors";

const page = () => {
  const router = useRouter();

  return (
    <>
      <nav
        className="w-full h-[8vh] landscape:h-[15vh] shadow-md flex items-center gap-2 px-3 cursor-pointer"
        onClick={() => router.push("/")}
      >
        <span className="text-xl font-extrabold text-[#f97316] "><svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-left-icon lucide-arrow-left"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg></span>
        <span className="text-[#f97316] text-2xl">Back</span>
      </nav>

      {/* About Section */}
      <section className="px-[5%] py-8 md:py-12 lg:py-16">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-semibold">About Listy4u</h1>
        <p className="mt-4 text-base md:text-lg leading-7">
          Launched in 2025, <strong>Listy4u</strong> aims to be India’s No. 1 property portal.
          We focus on every aspect of a consumer’s real estate needs—helping you advertise,
          search, and browse property quickly, effectively, and affordably. Stay updated with the
          latest trends and insights in the realty sector while we simplify the journey for tenants,
          owners, and brokers.
        </p>

        <h2 className="mt-6 text-xl md:text-2xl font-semibold">What you can do on Listy4u</h2>
        <ul className="list-disc pl-5 mt-3 space-y-2 text-base md:text-lg leading-7">
          <li>Post your property and advertise to reach serious tenants or buyers.</li>
          <li>Search properties tailored to your needs and browse with ease.</li>
          <li>Keep yourself informed with the latest market news and trends.</li>
          <li>Explore multiple service sectors: Rentals, Agreements, Sales, Resales, Pest Control, and more.</li>
        </ul>

        <h2 className="mt-6 text-xl md:text-2xl font-semibold">Why Listy4u?</h2>
        <ol className="list-decimal pl-5 mt-3 space-y-2 text-base md:text-lg leading-7">
          <li>A simple platform built for Tenants, Owners, and Brokers.</li>
          <li>Clear guidance to help you post property and advertise effectively.</li>
          <li>Works in easy steps so you can find your dream home faster.</li>
          <li>We collect your requirements via Google Form/Link for Tenants and Owners.</li>
          <li>Our team reviews requests and gets in touch via WhatsApp or call.</li>
        </ol>

        <div className="mt-6 p-4 rounded-lg bg-yellow-50 border border-yellow-200">
          <p className="text-base md:text-lg leading-7">
            Plus, we connect you with trusted vendors to make moving and maintenance effortless.
            From documentation to cleaning—we’ve got you covered.
          </p>
        </div>
      </section>

      {/* Vendors from platform */}
      <section className="px-[5%] pb-10">
        <h2 className="text-xl md:text-2xl font-semibold">Popular Vendor Services</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          {vendorData.map((v) => (
            <div key={v.id} className="px-3 py-2 rounded-full bg-[#fadcef] text-[#7a2c5b] border border-[#f1c6e0] text-sm md:text-base flex items-center gap-2">
              {v.emoji ? (
                <span className="text-lg md:text-xl">{v.emoji}</span>
              ) : v.image ? (
                <Image src={v.image} alt={v.label} width={20} height={20} />
              ) : null}
              <span>{v.label}</span>
            </div>
          ))}
        </div>
      </section>
    </>
  );
};

export default page;
