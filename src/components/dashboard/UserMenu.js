"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  FaUserCircle,
  FaSignOutAlt,
  FaCog,
  FaUser,
  FaTachometerAlt,
} from "react-icons/fa";
import { IoIosArrowDown } from "react-icons/io";
import apiHandler from "@/utils/apiHandler";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/lib/store/hooks/hook";
import { logout } from "@/lib/store/features/user/AuthSlice";
import Loader from "../spinner/Loader";

const UserMenu = ({ user }) => {
  let dispatch = useAppDispatch();
  let [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const router = useRouter();

  const toggleMenu = () => setOpen((prev) => !prev);

  const handleClickOutside = (e) => {
    if (menuRef.current && !menuRef.current.contains(e.target)) {
      setOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const LogOutHandler = async () => {
    setLoading(true);
    const res = await apiHandler("/auth/logout", "GET", true);
    if (res.success) {
      setOpen(false);
      localStorage.removeItem('authToken');
      router.push("/login");
      dispatch(logout());
    }
    setLoading(false);
  };

  if(loading){
    return <Loader/>
  }

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      <button
        onClick={toggleMenu}
        type="button"
        className="inline-flex items-center gap-1 md:gap-2 px-2 md:px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none transition-all"
        aria-haspopup="true"
        aria-expanded={open}
      >
        <FaUserCircle className="text-lg md:text-xl" />
        <span className="text-sm font-semibold hidden md:block">{user?.name}</span>
        <IoIosArrowDown
          className={`transition-transform text-base duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      <div
        className={`absolute right-0 z-20 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 transition-all duration-200 ${
          open
            ? "opacity-100 scale-100 visible"
            : "opacity-0 scale-95 invisible"
        }`}
        role="menu"
      >
        <div className="py-1 text-sm text-gray-700">
          <Link
            href="/dashboard/profile"
            className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100"
            role="menuitem"
          >
            <FaUser /> Profile
          </Link>
          <Link
            href="/dashboard"
            className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100"
            role="menuitem"
          >
            <FaTachometerAlt /> Dashboard
          </Link>
          <Link
            href="/dashboard/settings"
            className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100"
            role="menuitem"
          >
            <FaCog /> Settings
          </Link>
          <button
            onClick={LogOutHandler}
            className="flex cursor-pointer w-full items-center gap-2 px-4 py-2 hover:bg-gray-100 text-left"
            role="menuitem"
          >
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserMenu;
