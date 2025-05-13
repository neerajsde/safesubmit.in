'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Mail,
  Server,
  Globe,
  Cloud,
  Wifi,
  Link2,
  Database
} from 'lucide-react'; // Make sure lucide-react is installed

export default function HomeHero() {
  return (
    <div className="relative w-full bg-gray-50 flex flex-col items-center justify-center text-center py-20 overflow-hidden">
      {/* 🔁 Animated Background Icons */}
      <motion.div
        className="absolute top-10 left-10 text-purple-300 opacity-20"
        animate={{ y: [0, -20, 0] }}
        transition={{ repeat: Infinity, duration: 4 }}
      >
        <Server size={48} />
      </motion.div>

      <motion.div
        className="absolute top-20 right-16 text-pink-300 opacity-20"
        animate={{ y: [0, 15, 0] }}
        transition={{ repeat: Infinity, duration: 5 }}
      >
        <Globe size={60} />
      </motion.div>

      <motion.div
        className="absolute bottom-24 left-1/3 text-blue-300 opacity-10"
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 6 }}
      >
        <Mail size={32} />
      </motion.div>

      <motion.div
        className="absolute bottom-10 right-1/4 text-purple-400 opacity-15"
        animate={{ y: [0, -10, 0] }}
        transition={{ repeat: Infinity, duration: 4.5 }}
      >
        <Cloud size={40} />
      </motion.div>

      <motion.div
        className="absolute top-1/3 left-5 text-blue-400 opacity-10"
        animate={{ y: [0, 12, 0] }}
        transition={{ repeat: Infinity, duration: 7 }}
      >
        <Wifi size={28} />
      </motion.div>

      <motion.div
        className="absolute top-16 left-1/2 text-green-300 opacity-15"
        animate={{ y: [0, -8, 0] }}
        transition={{ repeat: Infinity, duration: 6.5 }}
      >
        <Link2 size={36} />
      </motion.div>

      <motion.div
        className="absolute bottom-1/3 right-12 text-indigo-300 opacity-10"
        animate={{ y: [0, 20, 0] }}
        transition={{ repeat: Infinity, duration: 5.5 }}
      >
        <Database size={50} />
      </motion.div>

      {/* 🌟 Hero Text */}
      <motion.h1
        className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 text-transparent bg-clip-text"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1 }}
      >
        FORM SUBMISSIONS MADE EASY
      </motion.h1>

      {/* 📄 Description */}
      <motion.p
        className="mt-6 text-lg md:text-xl text-gray-600 max-w-2xl"
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1.2 }}
      >
        safesubmit.in is a seamless form submission solution that simplifies how users interact with your website.
        Receive form submissions directly in your inbox — no backend needed. Ideal for landing pages, portfolios,
        or businesses seeking fast, secure form management.
      </motion.p>

      {/* 🚀 CTA */}
      <motion.div
        className="mt-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.4 }}
      >
        <Link
          href="/documentation"
          className="px-6 py-3 rounded-full bg-purple-600 hover:bg-purple-700 text-white font-semibold text-lg shadow-md transition"
        >
          Get Started →
        </Link>
      </motion.div>
    </div>
  );
}
