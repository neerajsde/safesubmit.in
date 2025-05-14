"use client";
import { redirect } from "next/navigation";
import React from "react";
import Forms from "./Forms";
import { useAppSelector } from "@/lib/store/hooks/hook";
import Loader from "../spinner/Loader";

const MainDashboard = () => {
  const {isAuthenticated, loading} = useAppSelector((state) => state.auth);

  if(loading) {
    return <Loader/>
  }

  if(!isAuthenticated){
    redirect('/login');
  }

  return (
    <div className="w-full p-2 md:p-4 flex flex-col items-center justify-center bg-gray-100">
        <h1 className="text-xl md:text-2xl lg:text-3xl mt-8 font-bold text-center">Welcome to the Dashboard</h1>
        <span className="text-sm md:text-base lg:text-lg text-center mt-2 md:mt-4">Here you can manage your forms and view your submissions.</span>
        <Forms/>
    </div>
  );
};

export default MainDashboard;
