"use client";
import apiHandler from "@/utils/apiHandler";
import { signIn } from "next-auth/react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { IoInformationCircleOutline } from "react-icons/io5";
import MdLoader from "../spinner/MdLoader.js";
import { redirect, useSearchParams } from "next/navigation.js";
import { toast } from "sonner";
import Spinner from "../spinner/Spinner.js";
import { useAppDispatch } from "@/lib/store/hooks/hook.js";
import { fetchUser } from "@/lib/store/features/user/AuthSlice.js";

const loginForm = () => {
  const searchParams = useSearchParams();
  let dispatch = useAppDispatch();
  let err_message = searchParams.get("err_message");
  const [isVisiablePass, setVisiablePass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [load, setLoad] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  function inputHandler(e) {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }

  useEffect(() => {
    if (err_message) {
      setError(err_message);
    }
  }, [err_message]);

  async function loginHandler(e) {
    e.preventDefault();
    setLoading(true);
    const now = new Date();
    const formattedDate = now.toLocaleString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "2-digit",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
    // Perform login logic here
    const payload = {
      email: formData.email,
      password: formData.password,
    };
    const response = await apiHandler("/auth/login", "POST", false, payload);
    // console.log("response: ", response);
    if (!response.success) {
      setError(response.message);
    } else {
      localStorage.setItem("authToken", response.data.token);
      dispatch(fetchUser());
      toast("Logged in successfully.", {
        description: formattedDate,
        action: {
          label: "Undo",
          onClick: () => console.log("Undo"),
        },
      });
      redirect("/dashboard");
    }
    setLoading(false);
  }

  async function googleLoginHandler() {
    try {
      setLoad(true);
      // Redirect to a callback route after successful Google sign-in
      await signIn("google", {
        callbackUrl: "/auth/callback?source=login",
      });
    } catch (error) {
      console.error("Login error:", error);
      setError("Google login failed.");
      setLoad(false);
    }
  }

  return (
    <div className="relative">
      <div
        className={`${
          load
            ? "bg-[#ffffffa6] w-full h-full flex justify-center items-center absolute top-0 left-0 z-999"
            : " hidden"
        }`}
      >
        <Spinner />
      </div>
      <form className="mt-6" onSubmit={loginHandler}>
        {/* Email Input */}
        <div>
          <label className="text-gray-700 text-sm font-medium">
            Email Address
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={inputHandler}
            placeholder="you@example.com"
            required
            className="w-full mt-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        {/* Password Input */}
        <div className="mt-4 relative">
          <label className="text-gray-700 text-sm font-medium flex justify-between">
            Password
            <Link
              href={{
                pathname: "/forgot-password",
                query: { email: formData.email }
              }}
              className="text-purple-600 text-sm"
            >
              Forgot Password?
            </Link>
          </label>
          <input
            type={isVisiablePass ? "text" : "password"}
            name="password"
            value={formData.password}
            onChange={inputHandler}
            placeholder="Enter your password"
            required
            className="w-full mt-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <button
            className="text-xl cursor-pointer absolute right-2 top-8"
            type="button"
            onClick={() => setVisiablePass(!isVisiablePass)}
          >
            {isVisiablePass ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
          </button>
        </div>

        {error && (
          <div className="w-full px-2 gap-1 bg-red-100 py-2 flex justify-start items-center border border-red-500 mt-4 rounded-md">
            <IoInformationCircleOutline className="text-lg text-red-500" />
            <p className="text-red-500 text-sm">{error}</p>
          </div>
        )}

        {/* Login Button */}
        <button
          type="submit"
          className="w-full h-10 flex justify-center items-center cursor-pointer mt-4 bg-purple-600 text-white py-2 rounded-md hover:bg-purple-700 transition"
        >
          {loading ? <MdLoader /> : "LOGIN"}
        </button>
      </form>

      {/* OR Divider */}
      <div className="text-center my-4 text-gray-500 text-sm">
        or login with
      </div>

      {/* Social Login Buttons */}
      <div className="flex gap-4">
        <button
          onClick={() => googleLoginHandler()}
          className="w-1/2 cursor-pointer flex items-center justify-center gap-2 border py-2 rounded-md hover:bg-gray-100 transition"
        >
          <FcGoogle className="text-xl" />
          Google
        </button>
        <button className="w-1/2 flex items-center justify-center border py-2 rounded-md hover:bg-gray-100 transition">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/0/05/Facebook_Logo_%282019%29.png"
            alt="Facebook"
            className="w-5 h-5 mr-2"
          />
          Facebook
        </button>
      </div>
    </div>
  );
};

export default loginForm;
