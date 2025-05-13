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
    <div className="w-full flex flex-col items-center justify-center bg-gray-100">
        <h1 className="text-3xl mt-8 font-bold text-center">Welcome to the Dashboard</h1>
        <span className="text-lg text-center mt-5">Here you can manage your forms and view your submissions.</span>
        <Forms/>
    </div>
  );
};

export default MainDashboard;
