"use client";

import axiosInstance from "@/lib/axios";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Cookies from "js-cookie";
import { X } from "lucide-react";

const Register = ({ registeropen, setRegisterOpen }) => {
  const [operation, setOperation] = useState("Register");
  const [timer, setTimer] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isVerifyingRegister, setIsVerifyingRegister] = useState(false);
  const [registerOtpSent, setRegisterOtpSent] = useState(false);

  const [formdata, setFormdata] = useState({
    name: "",
    email: "",
    mobile: "",
    usertype: 1,
  });

  const [registerOtp, setRegisterOtp] = useState("");

  const [loginformdata, setLoginFormdata] = useState({
    email: "",
    otp: "",
    usertype: 1,
    brokerid: "",
    password: "",
  });

  const [loginotpgenerated, setloginOtpGenerated] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "mobile") {
      const digits = value.replace(/\D/g, "").slice(0, 10);
      setFormdata((prev) => ({ ...prev, mobile: digits }));
      return;
    }
    if (name === "email") {
      setFormdata((prev) => ({ ...prev, email: value.toLowerCase() }));
      return;
    }
    setFormdata((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleDealerLogin = async (e) => {
    e.preventDefault();
    setIsLoggingIn(true);
    try {
      const response = await axiosInstance.post('/api/brokerlogin', {
        brokerid: loginformdata.brokerid,
        password: loginformdata.password,
      });
      toast.success(response.data?.message || 'Login successful');
      if (response.data?.token) {
        Cookies.set('broker', response.data.token, { expires: 7 });
      }
      setRegisterOpen(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Invalid credentials. Please try again.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const LoginChange = (e) => {
    const { name, value } = e.target;
    setLoginFormdata((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Format timer to MM:SS
  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  // Countdown for 2 minutes
  useEffect(() => {
    if (timer <= 0) return;

    const countdown = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(countdown);
  }, [timer]);

  const emailValid = (email) => /.+@.+\..+/.test(email);

  const sendRegisterOtp = async () => {
    if (!formdata.name || !emailValid(formdata.email) || formdata.mobile.length !== 10) {
      toast.error("Please enter valid name, email and 10-digit mobile");
      return;
    }
    setIsSendingOtp(true);
    try {
      const res = await axiosInstance.post('/api/sendregisterotp', { payload: formdata });
      toast.success(res.data.message || "OTP sent to email");
      setRegisterOtpSent(true);
      setTimer(120);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send OTP");
    } finally {
      setIsSendingOtp(false);
    }
  };

  const verifyRegisterOtp = async () => {
    if (!registerOtp || registerOtp.length < 4) {
      toast.error("Enter OTP from your email");
      return;
    }
    setIsVerifyingRegister(true);
    try {
      const res = await axiosInstance.post('/api/verifyregisterotp', { payload: { email: formdata.email, otp: registerOtp } });
      toast.success(res.data.message || "Registered successfully");
      if (res.data?.token) {
        const cookieName = res.data?.role === 'owner' ? 'owner' : 'user';
        Cookies.set(cookieName, res.data.token, { expires: 365 });
      }
      setRegisterOpen(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to verify OTP");
    } finally {
      setIsVerifyingRegister(false);
      setTimer(0);
      setRegisterOtp("");
      setRegisterOtpSent(false);
      setFormdata({ name: "", email: "", mobile: "", usertype: 1 });
    }
  };

  const HandlLogin = async (e) => {
    e.preventDefault();
    setIsLoggingIn(true);

    try {
      const response = await axiosInstance.post(
        '/api/login',
        { payload: loginformdata }
      );

      toast.success(response.data.message);
      if (response.data?.token) {
        const cookieName = response.data?.role === 'owner' ? 'owner' : 'user';
        Cookies.set(cookieName, response.data.token, { expires: 365 });
      }
      setRegisterOpen(false);
    } catch (error) {
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Something Went Wrong");
      }
    } finally {
      setIsLoggingIn(false);
      setLoginFormdata({ email: "", otp: "", usertype: 1, brokerid: "", password: "" });
      setTimer(0);
      setloginOtpGenerated(false);
    }
  };

  const SendLoginOtp = async (e) => {
    e.preventDefault();
    setIsSendingOtp(true);

    try {
      const sendOtpResponse = await axiosInstance.post('/api/sendloginotp', {
        email: loginformdata.email,
        usertype: loginformdata.usertype,
      });

      setloginOtpGenerated(true);
      setTimer(120);
      toast.success(sendOtpResponse.data.message);
    } catch (error) {
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Something Went Wrong");
      }
      console.error("Error:", error);
    } finally {
      setIsSendingOtp(false);
    }
  };

  // Loading spinner component
  const LoadingSpinner = () => (
    <div className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
  );

  return (
    <>
      <AnimatePresence>
        {registeropen && (
          <motion.div
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: "5%", opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 15 }}
            className="fixed z-[8888888888888888888] top-[18vh] lg:w-[35%] w-[80%] left-[10%] lg:left-[32.5%] bg-white shadow-lg p-5 rounded-lg"
          >
            <h2 className="text-xl text-center font-semibold">
              <span
                className="cursor-pointer hover:text-[#f3701f] transition-colors"
                onClick={() => {
                  setOperation("Register");
                  setTimer(0);
                  setloginOtpGenerated(false);
                }}
              >
                {operation}
              </span>
            </h2>

            <button
              className="absolute right-4 top-4 text-3xl"
              onClick={() => setRegisterOpen(false)}
            >
              <X />
            </button>

            {operation == "Register" ? (
              <form className="space-y-4">
                <div className="mt-4 flex justify-center gap-6 p-2 bg-gray-50 rounded-lg">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="usertype"
                      checked={formdata.usertype == 1}
                      value={1}
                      onChange={handleChange}
                      className="text-[#f3701f] focus:ring-[#f3701f]"
                    />
                    <span className="text-gray-700 font-medium">User</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="usertype"
                      checked={formdata.usertype == 2}
                      value={2}
                      onChange={handleChange}
                      className="text-[#f3701f] focus:ring-[#f3701f]"
                    />
                    <span className="text-gray-700 font-medium">Owner</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="usertype"
                      checked={formdata.usertype == 3}
                      value={3}
                      onChange={handleChange}
                      className="text-[#f3701f] focus:ring-[#f3701f]"
                    />
                    <span className="text-gray-700 font-medium">Dealer</span>
                  </label>
                </div>

                {formdata.usertype != 3 && (
                <input
                  name="name"
                  type="text"
                  value={formdata.name}
                  placeholder="Enter Name"
                  className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f3701f] focus:border-transparent"
                  onChange={handleChange}
                  required
                  disabled={registerOtpSent}
                />)}
                {formdata.usertype != 3 && (
                <input
                  name="email"
                  type="email"
                  value={formdata.email}
                  placeholder="Enter Email"
                  className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f3701f] focus:border-transparent"
                  onChange={handleChange}
                  required
                  disabled={registerOtpSent}
                />)}
                {formdata.usertype != 3 && (
                <input
                  name="mobile"
                  type="tel"
                  value={formdata.mobile}
                  placeholder="Enter Mobile"
                  className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f3701f] focus:border-transparent"
                  onChange={handleChange}
                  inputMode="numeric"
                  maxLength={10}
                  required
                  disabled={registerOtpSent}
                />)}

                {formdata.usertype == 3 && (
                  <div className="bg-orange-50 text-orange-800 border border-orange-200 rounded-md p-3 text-sm">
                    Dealer onboarding is handled by admin. Please switch to Login and choose Dealer to sign in.
                  </div>
                )}

                {formdata.usertype != 3 && (!registerOtpSent ? (
                  <button
                    type="button"
                    disabled={isSendingOtp}
                    className="w-full bg-[#f3701f] hover:bg-[#e5601a] text-white py-3 rounded-lg font-medium transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
                    onClick={sendRegisterOtp}
                  >
                    {isSendingOtp ? (
                      <>
                        <LoadingSpinner />
                        Sending OTP...
                      </>
                    ) : (
                      "Send OTP"
                    )}
                  </button>
                ) : (
                  <>
                    <div className="flex gap-2">
                      <input
                        name="registerotp"
                        type="text"
                        value={registerOtp}
                        placeholder={"Enter OTP"}
                        className="flex-1 border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f3701f] focus:border-transparent"
                        onChange={(e)=> setRegisterOtp(e.target.value.replace(/\D/g, "").slice(0,6))}
                        required
                      />
                      <button
                        type="button"
                        disabled={timer > 0 || isSendingOtp}
                        className="px-3 py-3 bg-[#f3701f] hover:bg-[#e5601a] text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-70 disabled:cursor-not-allowed whitespace-nowrap"
                        onClick={sendRegisterOtp}
                      >
                        {timer > 0 ? formatTimer(timer) : "Resend"}
                      </button>
                    </div>

                    <button
                      type="button"
                      disabled={isVerifyingRegister || !registerOtp}
                      className="w-full mt-2 bg-[#f3701f] hover:bg-[#e5601a] text-white py-3 rounded-lg font-medium transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
                      onClick={verifyRegisterOtp}
                    >
                      {isVerifyingRegister ? (
                        <>
                          <LoadingSpinner />
                          Verifying...
                        </>
                      ) : (
                        "Verify & Register"
                      )}
                    </button>
                  </>
                ))}

                <p className="text-center text-gray-600 mt-2">
                  Already have an account?{" "}
                  <span
                    className="text-[#f3701f] font-medium cursor-pointer hover:underline"
                    onClick={() => {
                      setOperation("Login");
                      setTimer(0);
                      setRegisterOtpSent(false);
                      setRegisterOtp("");
                      setloginOtpGenerated(false);
                    }}
                  >
                    Log in
                  </span>
                </p>
              </form>
            ) : (
              <form className="space-y-4">
                {/* User type selector for Login */}
                <div className="mt-4 flex justify-center gap-6 p-2 bg-gray-50 rounded-lg">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="usertype"
                      checked={loginformdata.usertype == 1}
                      value={1}
                      onChange={LoginChange}
                      className="text-[#f3701f] focus:ring-[#f3701f]"
                    />
                    <span className="text-gray-700 font-medium">User</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="usertype"
                      checked={loginformdata.usertype == 2}
                      value={2}
                      onChange={LoginChange}
                      className="text-[#f3701f] focus:ring-[#f3701f]"
                    />
                    <span className="text-gray-700 font-medium">Owner</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="usertype"
                      checked={loginformdata.usertype == 3}
                      value={3}
                      onChange={LoginChange}
                      className="text-[#f3701f] focus:ring-[#f3701f]"
                    />
                    <span className="text-gray-700 font-medium">Dealer</span>
                  </label>
                </div>

                {loginformdata.usertype == 3 ? (
                  <>
                    <input
                      name="brokerid"
                      type="text"
                      value={loginformdata.brokerid}
                      placeholder="Enter Broker ID (e.g., B100001)"
                      className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f3701f] focus:border-transparent"
                      onChange={LoginChange}
                      required
                    />
                    <input
                      name="password"
                      type="password"
                      value={loginformdata.password}
                      placeholder="Enter Password"
                      className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f3701f] focus:border-transparent"
                      onChange={LoginChange}
                      required
                    />
                    <button
                      type="button"
                      disabled={isLoggingIn}
                      className="w-full bg-[#f3701f] hover:bg-[#e5601a] text-white py-3 rounded-lg font-medium transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
                      onClick={handleDealerLogin}
                    >
                      {isLoggingIn ? (
                        <>
                          <LoadingSpinner />
                          Logging in...
                        </>
                      ) : (
                        "Login as Dealer"
                      )}
                    </button>
                  </>
                ) : (
                  <>
                    <input
                      name="email"
                      type="email"
                      value={loginformdata.email}
                      placeholder="Enter Email"
                      className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f3701f] focus:border-transparent"
                      onChange={LoginChange}
                      required
                    />
                    <div className="flex gap-2">
                      <input
                        disabled={!loginotpgenerated}
                        name="otp"
                        type="text"
                        value={loginformdata.otp}
                        placeholder={
                          loginotpgenerated ? "Enter OTP" : "Request OTP first"
                        }
                        className="flex-1 border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f3701f] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                        onChange={LoginChange}
                        required
                      />
                      <button
                        type="button"
                        disabled={timer > 0 || isSendingOtp || !loginformdata.email}
                        className="px-3 py-3 bg-[#f3701f] hover:bg-[#e5601a] text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-1 whitespace-nowrap"
                        onClick={SendLoginOtp}
                      >
                        {isSendingOtp ? (
                          <>
                            <LoadingSpinner />
                          </>
                        ) : timer > 0 ? (
                          formatTimer(timer)
                        ) : (
                          "Send OTP"
                        )}
                      </button>
                    </div>
                    {timer > 0 && (
                      <div className="text-center text-sm text-gray-600">
                        Resend OTP in {formatTimer(timer)}
                      </div>
                    )}
                    <button
                      type="button"
                      disabled={
                        !loginotpgenerated || isLoggingIn || !loginformdata.otp
                      }
                      className="w-full bg-[#f3701f] hover:bg-[#e5601a] text-white py-3 rounded-lg font-medium transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      onClick={HandlLogin}
                    >
                      {isLoggingIn ? (
                        <>
                          <LoadingSpinner />
                          Logging in...
                        </>
                      ) : (
                        "Login"
                      )}
                    </button>
                  </>
                )}

                <p className="text-center text-gray-600 mt-2">
                  Don't have an account?{" "}
                  <span
                    className="text-[#f3701f] font-medium cursor-pointer hover:underline"
                    onClick={() => {
                      setOperation("Register");
                      setTimer(0);
                      setloginOtpGenerated(false);
                    }}
                  >
                    Register
                  </span>
                </p>
              </form>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Register;
