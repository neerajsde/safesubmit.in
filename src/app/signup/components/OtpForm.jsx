import MdLoader from "@/components/spinner/MdLoader";
import apiHandler from "@/utils/apiHandler";
import { redirect } from "next/navigation";
import React, { useState, useRef, useEffect } from "react";
import { IoInformationCircleOutline } from "react-icons/io5";
import { FaAngleLeft } from "react-icons/fa6";
import { useAppDispatch } from "@/lib/store/hooks/hook";
import { fetchUser } from "@/lib/store/features/user/AuthSlice";

const OtpForm = ({formData, setIsSendOtp}) => {
  let dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [otp, setOtp] = useState("");
  const inputRefs = useRef([]);

  const handleChange = (index, value) => {
    const numericValue = value.replace(/\D/g, "");

    if (!numericValue) {
      // Handle deletion
      const newOtp = otp.slice(0, index) + otp.slice(index + 1);
      setOtp(newOtp);
      return;
    }

    // Update OTP state
    const newOtp =
      otp.slice(0, index) + numericValue.slice(-1) + otp.slice(index + 1);
    setOtp(newOtp);

    // Move focus to next input
    if (index < 5 && numericValue) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      // Move focus to previous input on backspace
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);

    if (pastedData.length === 6) {
      setOtp(pastedData);
      inputRefs.current[5].focus();
    }
  };

  async function loginHandler(){
    const payload = {
      email: formData.email,
      password: formData.password,
    };
    const response = await apiHandler("/auth/login", "POST", false, payload);
    // console.log("response: ", response);
    if (!response.success) {
      setError(response.message);
      redirect("/login");
    } else {
      localStorage.setItem("authToken", response.data.token);
      dispatch(fetchUser());
      redirect("/dashboard");
    }
  }

  async function submitHandler(){
    if(otp.length < 6){
      return;
    }
    setLoading(true);
    let response = await apiHandler("/user", "POST", false, {...formData, otp});
    if(response.success){
      await loginHandler();
    }
    else{
      setError(response.message);
    }
    setLoading(false);
  }

  useEffect(() => {
    if(otp.length === 6){
      submitHandler();
    }
  },[otp]);

  return (
    <>
      <div className=" w-full flex items-center justify-start gap-2">
        <FaAngleLeft onClick={() => setIsSendOtp(false)} className="text-2xl cursor-pointer text-gray-500"/>
        <h2 className="text-2xl font-semibold text-gray-800 text-center">
          Verify email
        </h2>
      </div>
      <p className="text-gray-500 text-center text-sm mt-2">
        A verification code has been sent to you. Enter the code below.
      </p>

      <div className="flex justify-center gap-2 mt-6">
        {[...Array(6)].map((_, index) => (
          <input
            key={index}
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={1}
            value={otp[index] || ""}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            ref={(el) => (inputRefs.current[index] = el)}
            className="w-12 h-12 text-2xl text-center border rounded-md
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
              transition-all duration-150"
            aria-label={`Verification code digit ${index + 1}`}
          />
        ))}
      </div>

      {error && (
        <div className="w-full px-2 gap-1 bg-red-100 py-2 flex justify-start items-center border border-red-500 mt-4 rounded-md">
          <IoInformationCircleOutline className="text-lg text-red-500" />
          <p className="text-red-500 text-sm">{error}</p>
        </div>
      )}

      <button
        onClick={submitHandler}
        className={`w-full h-10 flex justify-center items-center mt-4 text-white py-2 rounded-md transition ${otp.length < 6 ? 'bg-purple-600 opacity-20 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700 cursor-pointer'}`}
      >
        {loading ? <MdLoader /> : "Submit"}
      </button>
    </>
  );
};

export default OtpForm;
