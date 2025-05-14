"use client";
import Spinner from "@/components/spinner/Spinner";
import apiHandler from "@/utils/apiHandler";
import React, { useEffect, useState } from "react";

const MainSetting = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [copySuccess, setCopySuccess] = useState('');

  // Password related states
  const [oldPassword, setOldPassword] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordChangeMessage, setPasswordChangeMessage] = useState('');

  async function getSettings() {
    setLoading(true);
    let res = await apiHandler("/settings", "GET", true);
    if (res.success) {
      setUserData(res.message);
    } else {
      setError(res.message || "Failed to load settings.");
    }
    setLoading(false);
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(userData.api_key);
    setCopySuccess("API Key copied!");
    setTimeout(() => setCopySuccess(""), 2000);
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPasswordChangeMessage("");

    if (password !== confirmPassword) {
      setPasswordChangeMessage("Passwords do not match.");
      return;
    }

    const res = await apiHandler("/user/password", "PUT", true, {
      oldPassword,
      newPassword:password,
    });

    if (res.success) {
      setPasswordChangeMessage("Password changed successfully.");
      setOldPassword('');
      setPassword('');
      setConfirmPassword('');
    } else {
      setPasswordChangeMessage(res.message || "Password change failed.");
    }
  };

  useEffect(() => {
    getSettings();
  }, []);

  if (loading) {
    return (
      <div className="w-full h-screen flex flex-col justify-center items-center gap-2">
        <Spinner />
        <h1 className="text-xl font-semibold">Loading...</h1>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-screen flex flex-col justify-center items-center gap-6">
        <h1 className="text-2xl font-semibold">{error}</h1>
        <button
          className="bg-blue-500 cursor-pointer text-white px-4 py-2 rounded"
          onClick={getSettings}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="py-6 max-w-3xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold mb-4">User Settings</h1>

      <div className="bg-white p-4 shadow rounded space-y-2">
        <p><strong>User ID:</strong> {userData?.userId}</p>

        <div className="flex flex-col md:flex-row items-start md:items-center gap-2">
          <p className="w-full overflow-hidden text-ellipsis whitespace-nowrap">
            <strong>API Key:</strong>{" "}
            {showKey ? userData.api_key : "•••••••••••••••••••••••••••••••••••••••"}
          </p>
          <button
            className="text-blue-600 cursor-pointer text-sm underline"
            onClick={() => setShowKey(!showKey)}
          >
            {showKey ? "Hide" : "View"}
          </button>
          <button
            className="text-green-600 cursor-pointer text-sm underline"
            onClick={copyToClipboard}
          >
            Copy
          </button>
        </div>
        {copySuccess && <p className="text-green-500 text-sm">{copySuccess}</p>}
      </div>

      <form
        onSubmit={handlePasswordChange}
        className="bg-white p-4 shadow rounded space-y-4"
      >
        <h2 className="text-xl font-semibold">Change Password</h2>

        {/* Old Password */}
        <div className="relative">
          <input
            type={showOldPassword ? "text" : "password"}
            placeholder="Old password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            required
          />
          <button
            type="button"
            className="absolute top-1/2 right-3  cursor-pointer transform -translate-y-1/2 text-sm text-blue-500"
            onClick={() => setShowOldPassword(!showOldPassword)}
          >
            {showOldPassword ? "Hide" : "Show"}
          </button>
        </div>

        {/* New Password */}
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="New password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            required
          />
          <button
            type="button"
            className="absolute top-1/2 right-3 cursor-pointer transform -translate-y-1/2 text-sm text-blue-500"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>

        {/* Confirm Password */}
        <div className="relative">
          <input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            required
          />
          <button
            type="button"
            className="absolute top-1/2 right-3 cursor-pointer transform -translate-y-1/2 text-sm text-blue-500"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? "Hide" : "Show"}
          </button>
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white cursor-pointer px-4 py-2 rounded"
        >
          Update Password
        </button>

        {passwordChangeMessage && (
          <p
            className={`text-sm ${
              passwordChangeMessage.includes("success")
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            {passwordChangeMessage}
          </p>
        )}
      </form>
    </div>
  );
};

export default MainSetting;