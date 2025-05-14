"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import apiHandler from "@/utils/apiHandler";
import Spinner from "@/components/spinner/Spinner";
import { FaArrowLeft } from "react-icons/fa";

const FormMain = () => {
  const params = useParams();
  const formParams = params.form;
  const [formData, setFormdata] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function getFormData() {
    setLoading(true);
    setError(null);
    const res = await apiHandler(`/form/${formParams[1]}`, "GET", true);
    if (res.success) {
      setFormdata(res.data);
    } else {
      setError(res.message);
    }
    setLoading(false);
  }

  useEffect(() => {
    getFormData();
  }, []);

  if (loading) {
    return (
      <div className="w-full h-screen flex flex-col justify-center gap-2 items-center">
        <Spinner />
        <h1 className="text-xl font-semibold">Loading...</h1>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-screen flex flex-col justify-center gap-2 items-center">
        <h1 className="text-xl font-semibold text-red-500">{error}</h1>
        <button
          onClick={() => window.location.reload()}
          className="px-4 cursor-pointer py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
        >
          Retry
        </button>
      </div>
    );
  }

  const { name, schema, emails, submitedData } = formData;

  return (
    <div className="w-full py-6 max-w-6xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        {/* Back Button */}
        <button
          onClick={() => window.history.back()}
          className="flex items-center gap-2 cursor-pointer px-3 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <FaArrowLeft className="text-base md:text-lg" />
          <span className="text-base font-medium hidden md:block">Back</span>
        </button>

        {/* Page Title */}
        <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-800">{name}</h1>
      </div>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">📧 Notification Emails</h2>
        <ul className="list-disc pl-5">
          {emails.map((email) => (
            <li key={email.id}>{email.email}</li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">📨 Submitted Data</h2>
        {submitedData.length === 0 ? (
          <p className="text-gray-500">No submissions yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-300 text-sm">
              <thead className="bg-gray-100">
                <tr>
                  {schema.map((field, idx) => (
                    <th key={idx} className="border px-4 py-2 text-left">
                      {field.field_name}
                      <span className="text-gray-500">({field.type})</span>
                      {field.required && (
                        <span className="text-red-500">*</span>
                      )}
                    </th>
                  ))}
                  <th className="border px-4 py-2 text-left">Date</th>
                  <th className="border px-4 py-2 text-left">Time</th>
                </tr>
              </thead>
              <tbody>
                {submitedData.map((entry) => {
                  const values = JSON.parse(entry.submitted_data);
                  return (
                    <tr key={entry.id} className="hover:bg-gray-50">
                      {schema.map((_, idx) => {
                        const val = values[idx];
                        const isLink =
                          typeof val === "string" && val.startsWith("http");

                        return (
                          <td key={idx} className="border px-4 py-2">
                            {isLink ? (
                              <a
                                href={val}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 underline"
                              >
                                {val}
                              </a>
                            ) : (
                              val || "-"
                            )}
                          </td>
                        );
                      })}
                      <td className="border px-4 py-2">
                        {new Date(entry.created_date).toLocaleDateString()}
                      </td>
                      <td className="border px-4 py-2">{entry.created_time}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
};

export default FormMain;
