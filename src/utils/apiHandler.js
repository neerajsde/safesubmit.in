import { encrypt, decrypt } from "../utils/parse.js";

export default async function apiHandler(pathname, method = "GET", includeToken = false, body = null, isEncrypt = true) {
  try {
    const headers = {};
    const options = { method, headers };

    // Attach token if required
    if (includeToken) {
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("Please login to continue");
      headers["Authorization"] = `Bearer ${token}`;
    }

    // Handle request body
    if (method !== "GET" && body) {
      if (body instanceof FormData) {
        options.body = body;
      }  else {
        headers["Content-Type"] = "application/json";
        options.body = JSON.stringify(encrypt(body));
      }
    }

    const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "";
    const response = await fetch(`${baseUrl}/api/v1${pathname}`, options);
    const result = await response.json();
    return decrypt(result);
  } catch (error) {
    return { success: false, message: error.message };
  }
}