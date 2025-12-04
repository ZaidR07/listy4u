"use client";
import { useState } from "react";
import Image from "next/image";
import { WhatsappIcon, PhoneIcon } from "@/app/Icons";
import { useRouter } from "next/navigation";


const ContactUs = () => {

  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    alert("Your message has been sent!");
  };

  return (
    <>
      <nav
        className="w-full h-[8vh] landscape:h-[15vh] shadow-md flex items-center gap-2 px-3 cursor-pointer"
        onClick={() => router.push("/")}
      >
     <span className="text-xl sm:text-2xl font-extrabold text-[#f97316] "><svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-left-icon lucide-arrow-left"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg></span>
        <span className="text-[#f97316] text-lg sm:text-xl md:text-2xl">Back</span>
      </nav>
      <div className="min-h-[92vh] landscape:min-h-screen flex flex-col lg:flex-row gap-4 items-center lg:justify-center bg-gray-100 px-2 sm:px-4 md:px-6 py-4 relative">
      
      {/* Background Graphic */}

      <div className="bg-white mt-2 lg:mt-4 landscape:mt-2 shadow-lg rounded-lg px-4 sm:px-6 py-3 sm:py-4 max-w-lg w-full relative z-10">
        <div className="flex justify-center mb-4">
          <Image
            src="/envelope1.png"
            alt="Contact Graphic"
            width={250}
            height={80}
            className="w-auto h-auto max-w-[200px] sm:max-w-[250px]"
          />
        </div>
        <form className="space-y-3 sm:space-y-4" onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2 sm:p-3 text-sm sm:text-base border rounded-lg focus:ring-2 focus:ring-orange-400 focus:outline-none"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-2 sm:p-3 text-sm sm:text-base border rounded-lg focus:ring-2 focus:ring-orange-400 focus:outline-none"
            required
          />
          <input
            type="tel"
            name="phone"
            placeholder="Your Phone Number"
            value={formData.phone}
            onChange={handleChange}
            className="w-full p-2 sm:p-3 text-sm sm:text-base border rounded-lg focus:ring-2 focus:ring-orange-400 focus:outline-none"
            required
          />
          <textarea
            name="message"
            placeholder="Your Message"
            value={formData.message}
            onChange={handleChange}
            className="w-full p-2 sm:p-3 text-sm sm:text-base border rounded-lg focus:ring-2 focus:ring-orange-400 focus:outline-none resize-none"
            rows={3}
            required
          ></textarea>
          <button
            type="submit"
            className="w-full bg-[#FF5D00] text-white py-2 sm:py-3 rounded-lg hover:bg-orange-600 transition text-sm sm:text-base font-medium"
          >
            Send Message
          </button>
        </form>
      </div>

      {/* Floating WhatsApp & Phone Sidebar */}
      <div className="hidden lg:flex relative flex-col gap-4 bg-[#fff] shadow-2xl p-4 px-6 py-3 rounded-2xl">
        <div className="bg-green-500 text-white p-3 sm:p-4 rounded-full shadow-lg cursor-pointer flex items-center justify-center hover:bg-green-600 transition">
          <a
            href="https://wa.me/919987048613"
            target="_blank"
            rel="noopener noreferrer"
          >
            <WhatsappIcon width={30} fill={"#fff"} />
          </a>
        </div>
        <div className="bg-blue-500 text-white p-3 sm:p-4 rounded-full shadow-lg cursor-pointer flex items-center justify-center hover:bg-blue-600 transition">
          <a
            href="tel:+919987048613"
          >
            <PhoneIcon width={30} fill={"#fff"} />
          </a>
        </div>
      </div>
      
      {/* Mobile Floating Buttons */}
      <div className="lg:hidden fixed bottom-6 right-4 flex gap-3 z-20">
        <div className="bg-green-500 text-white p-3 rounded-full shadow-lg cursor-pointer flex items-center justify-center hover:bg-green-600 transition">
          <a
            href="https://wa.me/919987048613"
            target="_blank"
            rel="noopener noreferrer"
          >
            <WhatsappIcon width={24} fill={"#fff"} />
          </a>
        </div>
        <div className="bg-blue-500 text-white p-3 rounded-full shadow-lg cursor-pointer flex items-center justify-center hover:bg-blue-600 transition">
          <a
            href="tel:+919987048613"
          >
            <PhoneIcon width={24} fill={"#fff"} />
          </a>
        </div>
      </div>
    </div>
    </>
    
  );
};

export default ContactUs;
