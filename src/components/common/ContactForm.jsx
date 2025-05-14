"use client"
import apiHandler from "@/utils/apiHandler";
import { useState } from "react";
import { FaPaperPlane } from "react-icons/fa6";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    let res = await apiHandler("/user/contact", "POST", false, formData);
    if(res.success){
      setSubmitted(true);
      setFormData({ name: "", email: "", message: "" });
      setTimeout(() => setSubmitted(false), 10000);
    }
    else{
      setError(res.message);
      setSubmitted(false);
    }
    setLoading(false);
  };

  return (
    <section className="w-full p-4 md:p-6 lg:py-16 flex flex-col items-center justify-center">
      <h2 className="text-2xl md:text-3xl lg:text-5xl font-bold text-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-transparent bg-clip-text">
        Contact Us
      </h2>
      <p className="text-gray-600 text-center mt-2 md:mt-4 max-w-xl">
        Have a question or want to work with us? Send us a message and we’ll get back to you soon!
      </p>

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-xl mt-10 bg-white rounded-xl p-4 md:p-6 shadow-lg space-y-6"
      >
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
          <input
            type="text"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Your Email</label>
          <input
            type="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Your Message</label>
          <textarea
            name="message"
            required
            rows="5"
            value={formData.message}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
          ></textarea>
        </div>

        <button
          type="submit"
          className="bg-purple-600 cursor-pointer text-white px-6 py-2 rounded-md flex items-center justify-center gap-2 hover:bg-purple-700 transition"
        >
          {loading ? "Loading..." : <>Send Message <FaPaperPlane /></>}
        </button>

        {submitted && (
          <p className="text-green-600 text-center font-medium mt-2">
            ✅ Your message has been sent!
          </p>
        )}

        {error && (
          <p className="text-red-500 text-center font-medium mt-2">
            ❌ {error}
          </p>
        )}
      </form>
    </section>
  );
}
