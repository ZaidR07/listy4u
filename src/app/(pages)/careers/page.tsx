"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Briefcase, Users, TrendingUp, Award, Mail, MapPin } from "lucide-react";

const CareersPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    position: "",
    experience: "",
    message: "",
  });
  const [resume, setResume] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  const jobOpenings = [
    {
      title: "Digital Marketing Executive",
      type: "Full-time",
      description: "Drive our online presence through SEO, SEM, social media marketing, and content strategy. Create engaging campaigns to attract property seekers and brokers.",
      requirements: [
        "2+ years experience in digital marketing",
        "Strong knowledge of SEO/SEM and social media platforms",
        "Experience with Google Analytics and marketing tools",
        "Creative content creation skills"
      ]
    },
    {
      title: "Tele Caller / Inside Sales",
      type: "Full-time",
      description: "Connect with potential clients, understand their property needs, and guide them through our platform. Build relationships and drive conversions.",
      requirements: [
        "Excellent communication skills in English and Hindi",
        "1+ years experience in telecalling or sales",
        "Persuasive and customer-focused approach",
        "Basic computer knowledge"
      ]
    },
    {
      title: "Field Executive",
      type: "Full-time",
      description: "Meet brokers and property owners on-ground, onboard them to our platform, and provide support. Be the face of Listy4u in your territory.",
      requirements: [
        "Strong interpersonal and negotiation skills",
        "Willingness to travel within assigned territory",
        "Experience in field sales or business development",
        "Two-wheeler with valid license"
      ]
    },
    {
      title: "Customer Support Executive",
      type: "Full-time",
      description: "Provide exceptional support to our users via phone, email, and chat. Resolve queries, handle complaints, and ensure customer satisfaction.",
      requirements: [
        "Excellent problem-solving abilities",
        "Patient and empathetic communication",
        "Experience in customer service preferred",
        "Ability to multitask and work in fast-paced environment"
      ]
    }
  ];

  const whyWorkWithUs = [
    {
      icon: <TrendingUp className="w-8 h-8 text-orange-500" />,
      title: "Growth Opportunities",
      description: "Fast-growing real estate tech platform with clear career progression paths and skill development programs."
    },
    {
      icon: <Users className="w-8 h-8 text-orange-500" />,
      title: "Collaborative Culture",
      description: "Work with a passionate team that values innovation, creativity, and mutual respect in a supportive environment."
    },
    {
      icon: <Award className="w-8 h-8 text-orange-500" />,
      title: "Competitive Benefits",
      description: "Attractive salary packages, performance incentives, health benefits, and work-life balance initiatives."
    },
    {
      icon: <Briefcase className="w-8 h-8 text-orange-500" />,
      title: "Impactful Work",
      description: "Be part of transforming India's real estate industry and help thousands find their dream properties."
    }
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // Validate file type and size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("File size should not exceed 5MB");
        return;
      }
      if (!file.name.match(/\.(pdf|doc|docx)$/i)) {
        alert("Please upload a PDF or DOC file");
        return;
      }
      setResume(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!resume) {
      alert("Please upload your resume");
      return;
    }

    setLoading(true);
    setSubmitStatus("idle");

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("phone", formData.phone);
      formDataToSend.append("position", formData.position);
      formDataToSend.append("experience", formData.experience);
      formDataToSend.append("message", formData.message);
      formDataToSend.append("resume", resume);

      const response = await axios.post("/api/submit-application", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200) {
        setSubmitStatus("success");
        setFormData({
          name: "",
          email: "",
          phone: "",
          position: "",
          experience: "",
          message: "",
        });
        setResume(null);
        alert("Application submitted successfully! We'll get back to you soon.");
      }
    } catch (error) {
      console.error("Error submitting application:", error);
      setSubmitStatus("error");
      alert("Failed to submit application. Please try again or email us directly at hr@listy4u.com");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <nav
        className="w-full h-[8vh] landscape:h-[15vh] shadow-md flex items-center gap-2 px-3 cursor-pointer"
        onClick={() => router.push("/")}
      >
       <span className="text-xl font-extrabold text-[#f97316] "><svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-left-icon lucide-arrow-left"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg></span>
        <span className="text-[#f97316] text-2xl">Back</span>
      </nav>

      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-orange-500 via-orange-600 to-red-500 text-white py-20 lg:py-28 px-4 relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="max-w-6xl mx-auto text-center relative z-10">
            <h1 className="text-5xl lg:text-6xl font-extrabold mb-6 leading-tight">
              Join Our Team
            </h1>
            <p className="text-xl lg:text-2xl opacity-95 max-w-3xl mx-auto leading-relaxed">
              Build Your Career with India's Leading Real Estate Platform
            </p>
            <div className="mt-8 flex flex-col md:flex-row justify-center gap-4">
              <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full">
                <p className="text-sm font-semibold">🚀 Fast Growing</p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full">
                <p className="text-sm font-semibold">💼 Great Benefits</p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full">
                <p className="text-sm font-semibold">🌟 Amazing Culture</p>
              </div>
            </div>
          </div>
        </section>

        {/* Why Work With Us */}
        <section className="py-20 lg:py-24 px-4 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl lg:text-5xl font-bold mb-4 text-gray-900">
                Why Work With Us?
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Join a team that values innovation, growth, and making a real impact in the real estate industry
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {whyWorkWithUs.map((item, index) => (
                <div 
                  key={index} 
                  className="bg-gradient-to-br from-white to-orange-50 border border-orange-100 p-8 rounded-2xl hover:shadow-2xl hover:scale-105 transition-all duration-300 group"
                >
                  <div className="flex justify-center mb-6 transform group-hover:scale-110 transition-transform duration-300">
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-4 text-gray-900 text-center">{item.title}</h3>
                  <p className="text-gray-600 text-center leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Job Openings */}
        <section className="py-20 lg:py-24 px-4 bg-gradient-to-b from-gray-50 to-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl lg:text-5xl font-bold mb-4 text-gray-900">
                Current Openings
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Explore exciting opportunities across various departments and find your perfect role
              </p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {jobOpenings.map((job, index) => (
                <div 
                  key={index} 
                  className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-orange-200"
                >
                  <div className="flex items-start justify-between mb-6">
                    <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 pr-4">{job.title}</h3>
                    <span className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap">
                      {job.type}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-6 leading-relaxed text-base">{job.description}</p>
                  <div className="bg-gray-50 p-6 rounded-xl">
                    <h4 className="font-bold text-gray-900 mb-4 text-lg">Key Requirements:</h4>
                    <ul className="space-y-3">
                      {job.requirements.map((req, idx) => (
                        <li key={idx} className="text-gray-700 text-sm flex items-start">
                          <span className="text-orange-500 mr-3 mt-1 text-lg">✓</span>
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Application Form */}
        <section className="py-20 lg:py-24 px-4 bg-white">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-gray-900">
                Apply Now
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
                Fill out the form below and attach your resume. We'll review your application and get back to you soon.
              </p>
            </div>
            
            <form onSubmit={handleSubmit} className="bg-gradient-to-br from-gray-50 to-white p-10 lg:p-12 rounded-3xl shadow-2xl border border-gray-200 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="your.email@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none transition-all"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="+91 XXXXXXXXXX"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Position *</label>
                  <select
                    name="position"
                    value={formData.position}
                    onChange={handleChange}
                    className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none transition-all bg-white"
                    required
                  >
                    <option value="">Select a position</option>
                    <option value="Digital Marketing Executive">Digital Marketing Executive</option>
                    <option value="Tele Caller / Inside Sales">Tele Caller / Inside Sales</option>
                    <option value="Field Executive">Field Executive</option>
                    <option value="Customer Support Executive">Customer Support Executive</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Years of Experience *</label>
                <input
                  type="text"
                  name="experience"
                  placeholder="e.g., 2 years or Fresher"
                  value={formData.experience}
                  onChange={handleChange}
                  className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Upload Resume * (PDF or DOC, max 5MB)
                </label>
                <div className="relative">
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                    className="w-full p-4 border-2 border-dashed border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none transition-all cursor-pointer hover:border-orange-400 bg-gray-50"
                    required
                  />
                </div>
                {resume && (
                  <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm text-green-700 font-medium flex items-center gap-2">
                      <span className="text-green-500">✓</span>
                      Selected: {resume.name}
                    </p>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Cover Letter / Additional Information (Optional)
                </label>
                <textarea
                  name="message"
                  placeholder="Tell us why you'd be a great fit for this role..."
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none transition-all resize-none"
                  rows={5}
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-5 rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-3">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting Application...
                  </span>
                ) : (
                  "Submit Application"
                )}
              </button>
            </form>

            <div className="mt-12 text-center bg-gradient-to-r from-orange-50 to-red-50 p-8 rounded-2xl border border-orange-100">
              <p className="text-gray-700 mb-4 text-lg font-medium">Prefer to email directly?</p>
              <a
                href="mailto:hr@listy4u.com"
                className="inline-flex items-center gap-3 text-orange-600 font-bold text-xl hover:text-orange-700 transition-colors group"
              >
                <Mail className="w-6 h-6 group-hover:scale-110 transition-transform" />
                hr@listy4u.com
              </a>
            </div>
          </div>
        </section>

        {/* Contact Info */}
        <section className="py-16 lg:py-20 px-4 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
          <div className="max-w-5xl mx-auto text-center">
            <h3 className="text-3xl lg:text-4xl font-bold mb-8">Get in Touch</h3>
            <p className="text-gray-300 mb-10 text-lg max-w-2xl mx-auto">
              Have questions about our openings or the application process? We're here to help!
            </p>
            <div className="flex flex-col md:flex-row justify-center gap-8 lg:gap-12">
              <div className="flex flex-col items-center gap-3 p-6 bg-white/10 backdrop-blur-sm rounded-2xl hover:bg-white/20 transition-all">
                <Mail className="w-8 h-8 text-orange-400" />
                <span className="text-sm text-gray-400 font-medium">Email Us</span>
                <span className="text-lg font-semibold">hr@listy4u.com</span>
              </div>
              <div className="flex flex-col items-center gap-3 p-6 bg-white/10 backdrop-blur-sm rounded-2xl hover:bg-white/20 transition-all">
                <MapPin className="w-8 h-8 text-orange-400" />
                <span className="text-sm text-gray-400 font-medium">Location</span>
                <span className="text-lg font-semibold">Mumbai, India</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default CareersPage;
