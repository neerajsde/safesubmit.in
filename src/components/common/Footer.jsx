import Link from "next/link";
import { FaGithub, FaLinkedin } from "react-icons/fa6";
import { TbWorldWww } from "react-icons/tb";

export default function Footer() {
  return (
    <footer className="w-full bg-gray-100 text-gray-700 border-t">
      <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Brand & Tagline */}
        <div>
          <h2 className="text-2xl font-bold text-purple-600">safesubmit.in</h2>
          <p className="mt-2 text-sm">
            Your hassle-free form submission solution—no backend, no complexity.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="font-semibold text-gray-800 mb-3">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/" className="hover:text-purple-600 transition">
                Home
              </Link>
            </li>
            <li>
              <Link href="/features" className="hover:text-purple-600 transition">
                Features
              </Link>
            </li>
            <li>
              <Link href="/signup" className="hover:text-purple-600 transition">
                Get Started
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-purple-600 transition">
                Contact Us
              </Link>
            </li>
          </ul>
        </div>

        {/* Social Links */}
        <div>
          <h3 className="font-semibold text-gray-800 mb-3">Connect</h3>
          <div className="flex gap-4">
            <a
              href="https://www.neerajprajapati.in"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-blue-500 text-[22px] transition"
            >
              <TbWorldWww />
            </a>
            <a
              href="https://github.com/neerajsde"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-black text-xl transition"
            >
              <FaGithub />
            </a>
            <a
              href="https://www.linkedin.com/in/neerajprajapatise"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-blue-600 text-xl transition"
            >
              <FaLinkedin />
            </a>
          </div>
        </div>
      </div>

      <div className="text-center py-4 border-t text-sm text-gray-500">
        © {new Date().getFullYear()} safesubmit.in — All rights reserved.
      </div>
    </footer>
  );
}
