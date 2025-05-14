"use client";
import React, { useState } from "react";

const codeSnippets = {
  JavaScript: `
fetch("${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/form-submission", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "x-api-key": "YOUR_API_KEY_HERE",
    "x-form-key": "YOUR_FORM_KEY_HERE"
  },
  body: JSON.stringify({
    name: "John Doe",
    email: "john@example.com",
    subject: "Form Submission",
    message: "Hello, this is a test message."
  })
})
  .then(res => res.json())
  .then(data => console.log(data))
  .catch(err => console.error("Error:", err));
`.trim(),

  JavaScript_With_File:`
  const form = new FormData();
form.append("name", "John Doe");
form.append("email", "john@example.com");
form.append("subject", "File Upload Submission");
form.append("message", "Hello, this is a file upload test.");
form.append("file", yourFileInput.files[0]); // assuming yourFileInput is a file input element

fetch("${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/form-submission", {
  method: "POST",
  headers: {
    "x-api-key": "YOUR_API_KEY_HERE",
    "x-form-key": "YOUR_FORM_KEY_HERE"
    // 'Content-Type' should NOT be set manually when using FormData
  },
  body: form
})
  .then(res => res.json())
  .then(data => console.log(data))
  .catch(err => console.error("Error:", err));
`.trim(),

  Python: `
import requests

headers = {
  "Content-Type": "application/json",
  "x-api-key": "YOUR_API_KEY_HERE",
  "x-form-key": "YOUR_FORM_KEY_HERE"
}

data = {
  "name": "John Doe",
  "email": "john@example.com",
  "subject": "Form Submission",
  "message": "Hello, this is a test message."
}

response = requests.post("${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/form-submission", json=data, headers=headers)
print(response.json())
`.trim(),

  TypeScript: `
const submitForm = async () => {
  const response = await fetch("${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/form-submission", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": "YOUR_API_KEY_HERE",
      "x-form-key": "YOUR_FORM_KEY_HERE"
    },
    body: JSON.stringify({
      name: "John Doe",
      email: "john@example.com",
      subject: "Form Submission",
      message: "Hello, this is a test message."
    })
  });

  const data = await response.json();
  console.log(data);
};
submitForm();
`.trim(),

  Java: `
import java.net.*;
import java.io.*;

public class FormSubmit {
  public static void main(String[] args) throws Exception {
    URL url = new URL("${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/form-submission");
    HttpURLConnection con = (HttpURLConnection) url.openConnection();
    con.setRequestMethod("POST");
    con.setRequestProperty("Content-Type", "application/json");
    con.setRequestProperty("x-api-key", "YOUR_API_KEY_HERE");
    con.setRequestProperty("x-form-key", "YOUR_FORM_KEY_HERE");
    con.setDoOutput(true);

    String jsonInput = "{ \\"name\\": \\"John Doe\\", \\"email\\": \\"john@example.com\\", \\"subject\\": \\"Form Submission\\", \\"message\\": \\"Hello, this is a test message.\\" }";
    try (OutputStream os = con.getOutputStream()) {
      byte[] input = jsonInput.getBytes("utf-8");
      os.write(input, 0, input.length);
    }

    BufferedReader br = new BufferedReader(new InputStreamReader(con.getInputStream(), "utf-8"));
    StringBuilder response = new StringBuilder();
    String responseLine;
    while ((responseLine = br.readLine()) != null) {
      response.append(responseLine.trim());
    }
    System.out.println(response.toString());
  }
}
`.trim(),

  "C++": `
#include <iostream>
#include <curl/curl.h>

int main() {
  CURL *curl;
  CURLcode res;

  curl = curl_easy_init();
  if(curl) {
    struct curl_slist *headers = NULL;
    headers = curl_slist_append(headers, "Content-Type: application/json");
    headers = curl_slist_append(headers, "x-api-key: YOUR_API_KEY_HERE");
    headers = curl_slist_append(headers, "x-form-key: YOUR_FORM_KEY_HERE");

    std::string json = R"({"name": "John Doe", "email": "john@example.com", "subject": "Form Submission", "message": "Hello, this is a test message."})";

    curl_easy_setopt(curl, CURLOPT_URL, "${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/form-submission");
    curl_easy_setopt(curl, CURLOPT_HTTPHEADER, headers);
    curl_easy_setopt(curl, CURLOPT_POSTFIELDS, json.c_str());

    res = curl_easy_perform(curl);
    if(res != CURLE_OK)
      std::cerr << "curl_easy_perform() failed: " << curl_easy_strerror(res) << std::endl;

    curl_easy_cleanup(curl);
  }

  return 0;
}
`.trim(),
};

const APIDocumentation = () => {
  const languages = Object.keys(codeSnippets);
  const [selectedLang, setSelectedLang] = useState("JavaScript");
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(codeSnippets[selectedLang]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full border p-4 md:p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-xl md:text-2xl lg:text-3xl font-bold mb-6">
        📨 API Documentation: Submit Form
      </h2>

      <div className="mb-6 space-y-2">
        <p>
          <strong className="text-sm md:text-base">Endpoint:</strong>{" "}
          <code className="bg-gray-100 px-2 py-1 rounded text-xs md:text-base">
            POST /api/v1/form-submission
          </code>
        </p>
        <p>
          <strong  className="text-sm md:text-base">Required Headers:</strong>
        </p>
        <ul className="list-disc list-inside ml-4 text-sm md:text-base">
          <li>
            <code>x-api-key</code>: Your API key
          </li>
          <li>
            <code>x-form-key</code>: Your Form key
          </li>
          <li>
            <code>Content-Type</code>: <code>application/json</code>
          </li>
        </ul>
        <p  className="text-sm md:text-base">
          <strong>Body Fields:</strong> <code>name</code>, <code>email</code>,{" "}
          <code>subject</code>, <code>message</code>
        </p>
      </div>

      <div className="mb-8">
        <h3 className="text-lg md:text-xl font-semibold mb-2">💻 Code Examples</h3>
        <div className="flex gap-2 mb-4 flex-wrap">
          {languages.map((lang) => (
            <button
              key={lang}
              className={`px-4 py-1.5 cursor-pointer rounded-full text-sm font-medium transition ${
                selectedLang === lang
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
              onClick={() => setSelectedLang(lang)}
            >
              {lang}
            </button>
          ))}
        </div>

        <div className="relative">
          <button
            onClick={handleCopy}
            className="absolute top-2 right-2 bg-blue-600 text-white text-xs px-3 py-1 rounded hover:bg-blue-700"
          >
            {copied ? "Copied!" : "Copy"}
          </button>
          <pre className="bg-gray-900 text-white text-xs md:text-sm p-2  md:p-4 rounded-lg overflow-auto whitespace-pre-wrap">
            <code>{codeSnippets[selectedLang]}</code>
          </pre>
        </div>
      </div>

      <div>
        <h3 className="text-lg md:text-xl font-semibold mb-2">📦 Example Response</h3>
        <pre className="bg-gray-100 text-xs md:text-sm p-2 md:p-4 rounded-lg text-gray-800">
          {`{
  "success": true,
  "message": "Form submitted successfully"
}`}
        </pre>
      </div>
    </div>
  );
};

export default APIDocumentation;
