import { FaBolt, FaEnvelopeOpenText, FaCode, FaClock, FaChartBar } from "react-icons/fa6";
import { FaShieldAlt } from "react-icons/fa";

export const metadata = {
  title: "Features",
  description: "Features of safesubmit.in",
  icons: [
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '32x32',
      url: '/favicon_io/favicon-32x32.png',
    },
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '16x16',
      url: '/favicon_io/favicon-16x16.png',
    },
    {
      rel: 'apple-touch-icon',
      sizes: '180x180',
      url: '/favicon_io/apple-touch-icon.png',
    },
  ],
  manifest: '/favicon_io/site.webmanifest'
};


export default function FeaturesPage() {
  const features = [
    {
      title: "No Backend Required",
      description: "Easily collect form submissions without setting up any backend. Just copy and paste.",
      icon: <FaCode className="text-purple-600 text-3xl" />,
    },
    {
      title: "Real-Time Email Delivery",
      description: "Instantly receive form responses directly in your inbox—fast and reliable.",
      icon: <FaEnvelopeOpenText className="text-pink-600 text-3xl" />,
    },
    {
      title: "Spam Protection",
      description: "Built-in spam filtering ensures you only get valid submissions without bots.",
      icon: <FaShieldAlt className="text-indigo-600 text-3xl" />,
    },
    {
      title: "Lightning Fast",
      description: "Optimized to deliver submissions in milliseconds with no lag or delays.",
      icon: <FaBolt className="text-yellow-500 text-3xl" />,
    },
    {
      title: "24/7 Availability",
      description: "Your forms work around the clock with zero downtime, any time, anywhere.",
      icon: <FaClock className="text-teal-600 text-3xl" />,
    },
    {
      title: "Submission Analytics",
      description: "Get insightful analytics to track submission trends and conversion rates.",
      icon: <FaChartBar className="text-blue-600 text-3xl" />,
    },
  ];

  return (
    <div className="w-full p-4 md:p-6 lg:p-10 md:py-16 flex flex-col items-center">
      <h1 className="text-xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent text-center">
        Powerful Features That Simplify Form Submissions
      </h1>
      <p className="text-gray-600 text-center max-w-2xl mt-4 text-sm md:text-base lg:text-lg">
        Whether you&#39;re building a portfolio, running a campaign, or launching a startup,
        safesubmit.in has everything you need to manage forms without code.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mt-6 md:mt-10 lg:mt-12 w-full max-w-6xl">
        {features.map((feature, index) => (
          <div
            key={index}
            className="bg-white rounded-xl p-4 md:p-6 shadow-md hover:shadow-lg border border-gray-100 transition duration-300"
          >
            <div className="mb-4">{feature.icon}</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">{feature.title}</h3>
            <p className="text-gray-600 text-sm">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
