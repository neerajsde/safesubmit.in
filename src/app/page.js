import Image from "next/image";
import { FaGlobe, FaUserTie, FaCalendarCheck, FaCommentDots } from "react-icons/fa6";
import FormImage from "@/assets/images/form.png";
import FeaturesSection from "@/components/home/FeaturesSection";
import SetupGuideInteractive from "@/components/common/SetupGuideInteractive";
import HomeHero from "@/components/home/HomeHero";

export default function Home() {
  return (
    <div className="w-full p-4 md:p-6 lg:p-10 flex flex-col items-center gap-10 bg-gray-50">
      {/* Hero Section */}
      <HomeHero/>

      {/* Use Case Section */}
      <section className="w-full flex flex-col border shadow-sm bg-white p-4 lg:py-6 rounded-2xl md:flex-row items-center justify-center gap-6 md:gap-8 lg:gap-12">
        <Image
          src={FormImage}
          alt="Where You Use"
          width={250}
          height={300}
          className="w-full max-w-md rounded-xl shadow-xl transition-transform hover:scale-105 duration-300"
        />
        <div className="md:max-w-lg text-left space-y-2 md:space-y-4">
          <h2 className="text-xl md:text-2xl lg:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
            Where Can You Use It?
          </h2>
          <p className="text-gray-700 text-sm md:text-base lg:text-lg max-sm:text-justify">
            safesubmit.in empowers you to collect data effortlessly—no backend, no complex setup.
            Whether you&#39;re a developer, freelancer, or business owner, simply integrate our solution and start receiving form submissions instantly.
          </p>
          <ul className="space-y-2 md:space-y-4 mt-4 text-sm md:text-base lg:text-lg">
            <li className="flex items-start gap-3 text-gray-600">
              <FaGlobe className="text-purple-600 mt-1" />
              <span>Landing pages with contact or lead forms</span>
            </li>
            <li className="flex items-start gap-3 text-gray-600">
              <FaUserTie className="text-pink-500 mt-1" />
              <span>Portfolio websites to receive client inquiries</span>
            </li>
            <li className="flex items-start gap-3 text-gray-600">
              <FaCalendarCheck className="text-indigo-500 mt-1" />
              <span>Event or RSVP forms for quick responses</span>
            </li>
            <li className="flex items-start gap-3 text-gray-600">
              <FaCommentDots className="text-green-600 mt-1" />
              <span>Feedback and suggestion boxes</span>
            </li>
          </ul>
        </div>
      </section>

      {/* Features Section */}
      <FeaturesSection />

      {/* Setup Guide Section */}
      <div className="w-full">
        <SetupGuideInteractive/>
      </div>
    </div>
  );
}
