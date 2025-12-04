import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axios";

const WhatsappIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 448 512"
      fill="#fff"
      width={22}
    >
      <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7 .9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z" />
    </svg>
  );
};

const InstagramIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 448 512"
      fill="#fff"
      width={22}
    >
      <path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z" />
    </svg>
  );
};

const FacebookIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      fill="#fff"
      width={22}
    >
      <path d="M512 256C512 114.6 397.4 0 256 0S0 114.6 0 256C0 376 82.7 476.8 194.2 504.5V334.2H141.4V256h52.8V222.3c0-87.1 39.4-127.5 125-127.5c16.2 0 44.2 3.2 55.7 6.4V172c-6-.6-16.5-1-29.6-1c-42 0-58.2 15.9-58.2 57.2V256h83.6l-14.4 78.2H287V510.1C413.8 494.8 512 386.9 512 256h0z" />
    </svg>
  );
};

const YoutubeIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 576 512"
      fill="#fff"
      width={24}
    >
      <path d="M549.7 124.1c-6.3-23.7-24.8-42.3-48.3-48.6C458.8 64 288 64 288 64S117.2 64 74.6 75.5c-23.5 6.3-42 24.9-48.3 48.6-11.4 42.9-11.4 132.3-11.4 132.3s0 89.4 11.4 132.3c6.3 23.7 24.8 41.5 48.3 47.8C117.2 448 288 448 288 448s170.8 0 213.4-11.5c23.5-6.3 42-24.2 48.3-47.8 11.4-42.9 11.4-132.3 11.4-132.3s0-89.4-11.4-132.3zm-317.5 213.5V175.2l142.7 81.2-142.7 81.2z" />
    </svg>
  );
};

const Footer = () => {
  const router = useRouter();
  const [contact, setContact] = useState({
    contactNumber1: "",
    contactNumber2: "",
    address: "",
    whatsapp: "",
    instagram: "",
    facebook: "",
  });

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const res = await axiosInstance.get("/api/company/settings");
        const payload = res?.data?.payload || {};
        setContact({
          contactNumber1: payload.contactNumber1 || "",
          contactNumber2: payload.contactNumber2 || "",
          address: payload.address || "",
          whatsapp: payload.whatsapp || "",
          instagram: payload.instagram || "",
          facebook: payload.facebook || "",
        });
      } catch {
        // Ignore errors and keep defaults
      }
    };

    loadSettings();
  }, []);

  const primaryPhone = contact.contactNumber1 || "";
  const secondaryPhone = contact.contactNumber2 || "";
  const addressText = contact.address || "";
  const whatsappLink = contact.whatsapp || "";
  const instagramLink = contact.instagram || "";
  const facebookLink = contact.facebook || "#";
  return (
    <div className="bg-[#FF5D00] text-white pb-4 pt-[4vh]">
      <div className="w-full px-[5%] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-6">
        <section className="border-b border-white/30 pb-3 mb-3 lg:border-none lg:pb-0 lg:mb-0 lg:col-span-3 lg:order-1">
          <h1 className="text-lg lg:text-2xl text-[#fff] mb-2">Quick Links</h1>
          <ul className="hover:cursor-pointer text-sm lg:text-lg lg:mt-1 space-y-2 leading-6">
            {/* Existing + New */}
            <li onClick={() => router.push("/")}>Listy4u</li>
            <li onClick={() => router.push("/#mobile-app")}>Mobile App</li>
            <li onClick={() => router.push("/plans")}>Our Services</li>
            {/* <li onClick={() => router.push("/postproperty")}>Post Your Property</li> */}
            <li onClick={() => router.push("/brokerslist")}>Find an Agent</li>
            <li onClick={() => router.push("/contact")}>Customer Service</li>
            <li onClick={() => router.push("/buyproperties?view=Sale")}>
              Buy Properties
            </li>
            <li onClick={() => router.push("/buyproperties?view=Rent")}>
              Rent Properties
            </li>
            <li onClick={() => router.push("/buyproperties?view=PG")}>
              Find PG
            </li>
          </ul>
        </section>
        <section className="border-b border-white/30 pb-3 mb-3 lg:border-none lg:pb-0 lg:mb-0 lg:col-span-3 lg:order-2">
          <h1 className="text-lg lg:text-2xl text-[#fff] mb-2">Company</h1>
          <ul className="hover:cursor-pointer flex flex-col text-sm lg:text-lg lg:mt-1 space-y-2 leading-6">
            <li onClick={() => router.push("/about")}>About Us</li>
            <li onClick={() => router.push("/contact")}>Contact Us</li>
            <li onClick={() => router.push("/careers")}>Careers with Us</li>
            <li onClick={() => router.push("/blogs")}>Blogs</li>
            <li onClick={() => router.push("/terms")}>Terms & Conditions</li>
            <li onClick={() => router.push("/feedback")}>Feedback</li>
            <li onClick={() => router.push("/report-problem")}>
              Report a Problem
            </li>
            <li onClick={() => router.push("/privacy-policy")}>
              Privacy Policy
            </li>
          </ul>
        </section>
        <section className="border-b border-white/30 pb-3 mb-3 lg:border-none lg:pb-0 lg:mb-0 lg:col-span-3 lg:order-3">
          <h1 className="text-lg lg:text-2xl text-[#fff] mb-2">Contact</h1>
          <div className="text-sm lg:text-lg lg:mt-1 space-y-1 leading-6">
            <p className="opacity-90">Address : </p>
            <p className="opacity-90">{addressText}</p>

            <p className="font-semibold mt-3">Contact :</p>
            <div className="flex gap-2">
              <p>
                <a
                  href={`tel:${primaryPhone.replace(/\s+/g, "")}`}
                  className="underline"
                >
                  {primaryPhone}
                </a>
              </p>,
              {secondaryPhone && (
                <p>
                  <a
                    href={`tel:${secondaryPhone.replace(/\s+/g, "")}`}
                    className="underline"
                  >
                    {secondaryPhone}
                  </a>
                </p>
              )}
            </div>
          </div>
        </section>
        <section className="lg:col-span-3 lg:order-4">
          {/* Header visible on desktop */}
          <h1 className="hidden lg:block text-lg lg:text-2xl text-[#fff] mb-2">
            Social Media
          </h1>
          {/* Icons horizontal at all sizes */}
          <ul className="hover:cursor-pointer flex gap-5 items-center leading-6 lg:mt-2 justify-start">
            <li className="flex items-center justify-center">
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 md:p-2 rounded-full bg-white/10 inline-flex"
              >
                <WhatsappIcon />
              </a>
              <span className="hidden ml-2">Whatsapp</span>
            </li>
            <li className="flex items-center justify-center">
              <a
                href={instagramLink}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 md:p-2 rounded-full bg-white/10 inline-flex"
              >
                <InstagramIcon />
              </a>
              <span className="hidden ml-2">Instagram</span>
            </li>
            <li className="flex items-center justify-center">
              <a
                href={facebookLink}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 md:p-2 rounded-full bg-white/10 inline-flex"
              >
                <FacebookIcon />
              </a>
              <span className="hidden ml-2">Facebook</span>
            </li>
            <li className="flex items-center justify-center">
              <div className="p-3 md:p-2 rounded-full bg-white/10">
                <YoutubeIcon />
              </div>
              <span className="hidden ml-2">Youtube</span>
            </li>
          </ul>
        </section>
      </div>
      {/* Company Moto (mobile/tablet) */}
      <section className="px-[5%] mt-6 lg:hidden">
        <h1 className="text-xl border-b-2 inline-block mb-2">Company Moto</h1>
        <br />
        <span className="text-sm sm:text-base leading-6">
          Listy4u — Connecting Homes, Services & People. Find properties, book
          trusted home services, and make every step of home living simple,
          fast, and reliable.
        </span>
      </section>
      <div className="w-[90%] mx-[5%] h-[1px] bg-[#fff] mt-6 md:mt-8 lg:hidden"></div>
      {/* Company Moto (desktop only, bottom) */}
      <section className="hidden lg:block px-[5%] mt-6">
        <h1 className="text-2xl border-b-2 inline-block mb-2">Company Moto</h1>
        <br />
        <span className="text-lg leading-7 opacity-90">
          Listy4u — Connecting Homes, Services & People. Find properties, book
          trusted home services, and make every step of home living simple,
          fast, and reliable.
        </span>
      </section>
      <section className="mt-6 md:mt-8 lg:mt-10">
        <a
          href="http://t-rexinfotech.in"
          className="text-center cursor-pointer lg:text-xl"
          target="_blank"
        >
          <p>Powered by @T-REX Infotech</p>{" "}
        </a>
      </section>
    </div>
  );
};

export default Footer;
