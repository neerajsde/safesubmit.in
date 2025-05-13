import { FaBolt, FaEnvelope, FaServer, FaCode, FaShieldAlt, FaTools } from "react-icons/fa";

const features = [
  {
    icon: <FaBolt className="text-purple-600 text-3xl" />,
    title: "Instant Setup",
    description: "No coding required. Just point your form to safesubmit.in and start receiving entries right away.",
  },
  {
    icon: <FaEnvelope className="text-pink-600 text-3xl" />,
    title: "Email Notifications",
    description: "Get form submissions delivered instantly to your inbox so you never miss a response.",
  },
  {
    icon: <FaServer className="text-indigo-600 text-3xl" />,
    title: "Serverless Backend",
    description: "No need to manage servers—our cloud handles everything securely and reliably.",
  },
  {
    icon: <FaCode className="text-blue-600 text-3xl" />,
    title: "Developer Friendly",
    description: "Easily integrate with static sites, React, Next.js, or any frontend with minimal code.",
  },
  {
    icon: <FaShieldAlt className="text-green-600 text-3xl" />,
    title: "Spam Protection",
    description: "Built-in anti-spam measures like CAPTCHA to keep your inbox clean and protected.",
  },
  {
    icon: <FaTools className="text-yellow-600 text-3xl" />,
    title: "Easy Management",
    description: "Manage all your submissions from a clean, user-friendly dashboard.",
  },
];

export default function FeaturesSection() {
  return (
    <section className="w-full">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
          Powerful Features for Effortless Forms
        </h2>
        <p className="text-gray-600 mb-12 max-w-2xl mx-auto">
          safesubmit.in is packed with everything you need to launch and manage simple yet powerful forms—no backend, no fuss.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {features.map((feature, index) => (
            <div
              key={index}
              className="p-6 rounded-xl shadow-md bg-white hover:shadow-lg transition duration-300 text-left"
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
