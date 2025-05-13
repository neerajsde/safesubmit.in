import Image from "next/image";
import React from "react";

const Loader = () => {
  return (
    <div className="bg-white fixed top-0 left-0 z-[999999] w-full h-screen flex justify-center items-center">
      <Image
        src="/logo.png"
        alt="Logo"
        width={180}
        height={100}
        className=" zoom-animation"
      />
    </div>
  );
};

export default Loader;
