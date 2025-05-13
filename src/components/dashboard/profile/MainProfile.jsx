"use client";
import apiHandler from "@/utils/apiHandler";
import React, { useEffect, useState } from "react";
import contryCodes from "@/assets/data/countrycode";
import Loader from "@/components/spinner/Loader";

const MainProfile = () => {
  let [isUpdate, setIsUpdate] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [saveMessage, setSaveMessage] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    userImg: null,
    country_code: '',
    phone: ''
  });

  const getProfile = async () => {
    setLoading(true);
    const res = await apiHandler("/profile", "GET", true);
    if (res.success) {
      setUserData(res.data);
      setFormData({
        name: res.data.name || '',
        email: res.data.email || '',
        country_code: res.data.country_code || '',
        phone: res.data.phone || '+91',
        userImg: res.data.user_img || null // file input stays null unless re-selected
      });
    } else {
      setError(res.message || "Failed to load profile.");
    }
    setLoading(false);
  };

  useEffect(() => {
    getProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if( name === "phone" && value.length > 10) {
        return;
    }
    if (name === "userImg") {
      setFormData((prev) => ({ ...prev, userImg: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
    if(!isUpdate) {
      setIsUpdate(true);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaveMessage('');
    if(!isUpdate){
      setSaveMessage('No changes made to save.');
      return;
    }

    const payload = new FormData();
    payload.append("name", formData.name);
    payload.append("email", formData.email);
    payload.append("country_code", formData.country_code);
    payload.append("phone", formData.phone);
    if (formData.userImg) {
        payload.append("userImg", formData.userImg);
    }

    const res = await apiHandler("/profile", "PUT", true, payload);
    if (res.success) {
      setSaveMessage("Profile updated successfully.");
      getProfile(); // Refresh profile
      setIsUpdate(false); // Reset update state
    } else {
      setSaveMessage(res.message || "Failed to update profile.");
    }
  };

  if (loading) {
    return <Loader/>
  }

  if (error) {
    return (
      <div className="w-full h-screen flex flex-col justify-center items-center gap-6">
        <h1 className="text-2xl font-semibold">{error}</h1>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={getProfile}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="py-6 max-w-3xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold mb-4">User Profile</h1>

      <form onSubmit={handleSave} className="bg-white p-4 shadow rounded space-y-4">
        <div className="flex items-center gap-4">
          <img
            src={userData?.user_img || "/default-avatar.png"}
            alt="User"
            className="w-10 h-10 rounded-full object-cover"
          />

          <input
            type="file"
            name="userImg"
            accept="image/*"
            onChange={handleChange}
            className="text-sm cursor-pointer text-blue-400"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            disabled
          />
        </div>

        <div className="flex gap-4">
          <div className="w-1/3">
            <label className="block mb-1 font-medium">Country Code</label>
            <select
              type="text"
              name="country_code"
              value={formData.country_code}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              required
            >
              {contryCodes ? contryCodes.map((code,i) => (
                <option key={`${code.code}-${i}`} value={code.code}>
                  {code.country} ({code.code})
                </option>
              )): (<option value="+91">Loading...</option>)}
            </select>
          </div>

          <div className="w-2/3">
            <label className="block mb-1 font-medium">Phone Number</label>
            <input
              type="number"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              placeholder="9876543210"
              required
            />
          </div>
        </div>

        <div className="flex gap-4">
          <p><strong>Status:</strong> {userData?.active ? "Active" : "Inactive"}</p>
          <p><strong>Approved:</strong> {userData?.approve ? "Yes" : "No"}</p>
        </div>

        <button
          type="submit"
          className="bg-blue-600  cursor-pointer text-white px-4 py-2 rounded"
        >
          Save Changes
        </button>

        {saveMessage && (
          <p className={`text-sm ${saveMessage.includes("success") ? "text-green-600" : "text-red-600"}`}>
            {saveMessage}
          </p>
        )}
      </form>
    </div>
  );
};

export default MainProfile;
