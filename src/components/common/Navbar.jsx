"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import UserMenu from "../dashboard/UserMenu";
import { useAppSelector } from "@/lib/store/hooks/hook";
import Loader from "../spinner/Loader";

const Navbar = () => {
  const { isAuthenticated, loading, user } = useAppSelector(
    (state) => state.auth
  );

  if(loading){
    return <Loader/>
  }

  return (
    <div className="w-full sticky top-0 bg-white z-[999] shadow-sm shadow-gray-300 flex justify-between items-center px-10 py-2">
      <Link href="/" className="flex items-center">
        <Image src="/logo.png" alt="Logo" width={180} height={100} />
      </Link>

      <div className="flex justify-center items-center gap-4">
        <Link href="/documentation">Documentation</Link>

        {isAuthenticated && user ? (
          <UserMenu user={user} />
        ) : (
          <Link
            href="/login"
            className="py-2 px-6 rounded-full bg-gradient-to-r from-teal-600 via-blue-700 to-green-500 text-white shadow-md hover:opacity-90 transition duration-300"
          >
            Login
          </Link>
        )}
      </div>
    </div>
  );
};

export default Navbar;
