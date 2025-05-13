import React, { useEffect, useState } from "react";
import apiHandler from "@/utils/apiHandler";
import { motion } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import CreateForm from "./CreateForm";
import { GoDotFill } from "react-icons/go";
import { FaRegEdit } from "react-icons/fa";
import Link from "next/link";
import EditFormComponent from "./EditForm";
import Spinner from "../spinner/Spinner";

const Forms = () => {
  const [formsData, setFormsData] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editForm, setEditForm] = useState({ falg: false, data: null });

  async function fetchForms() {
    setLoading(true);
    const res = await apiHandler("/form", "GET", true);
    if (!res.success) {
      setError(res.message);
      setLoading(false);
      return;
    }
    setFormsData(res.data);
    setLoading(false);
  }

  const handleCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Form key copied!");
    } catch (err) {
      toast.error("Failed to copy");
    }
  };

  const toggleEmailStatus = async (formId, emailIndex, emailId) => {
    // Ideally this should hit an API to update backend
    const updatedForms = [...formsData];
    updatedForms.forEach((form) => {
      if (form.id === formId) {
        form.emails[emailIndex].active = !form.emails[emailIndex].active;
      }
    });
    setFormsData(updatedForms);

    let res = await apiHandler(
      `/form/${formId}/emails/${emailId}/notification`,
      "PUT",
      true
    );
    if (!res.success) {
      toast.error(res.message);
      return;
    }
    updatedForms.forEach((form) => {
      if (form.id === formId) {
        form.emails[emailIndex].active =
          res.data.emailStatus === "enabled" ? true : false;
      }
    });
    toast.success(res.message);
  };

  useEffect(() => {
    fetchForms();
  }, []);

  return (
    <div className="w-full p-4 sm:p-8 min-h-screen bg-gray-100">
      {editForm.falg && (
        <EditFormComponent
          data={editForm.data}
          onClose={() => setEditForm({ falg: false, data: null })}
          onUpdate={fetchForms}
        />
      )}

      <div className="w-full flex justify-between items-center mb-6">
        <h1 className="text-2xl md:text-5xl font-bold text-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-transparent bg-clip-text">
          Yours Forms
        </h1>

        <button
          onClick={() => setShowModal(true)}
          className="cursor-pointer bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
        >
          + Create New Form
        </button>

        {showModal && (
          <CreateForm
            onClose={() => setShowModal(false)}
            onSuccess={fetchForms}
          />
        )}
      </div>

      {
        isLoading ? (
          <div className="flex flex-col justify-center items-center w-full">
            <Spinner/>
            Loading...
          </div>
        ) : error ? (
          <p className="text-red-500 text-center">{error}</p>
        ) : formsData.length === 0 ? (
          <p className="text-gray-500 text-center">No forms available.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {formsData.map((form, index) => (
              <motion.div
                key={form.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white shadow-md rounded-2xl p-6 hover:shadow-xl transition-shadow"
              >
                <div className="w-full flex justify-between items-center mb-4">
                  <Link
                    href={`/dashboard/form/${form.id}`}
                    className="text-xl font-semibold"
                  >
                    {form.name}
                  </Link>
                  <button
                    onClick={() => setEditForm({ falg: true, data: form })}
                    className="cursor-pointer text-gray-500 hover:text-black"
                  >
                    <FaRegEdit />
                  </button>
                </div>
                <p className="text-sm text-gray-500">
                  Form Key: <span className="font-mono">{form.keyId}</span>
                </p>
                <button
                  onClick={() => handleCopy(form.keyId)}
                  className="text-blue-500 cursor-pointer text-sm underline mb-4 hover:text-blue-700"
                >
                  Copy Form Key
                </button>

                <div className="mb-3">
                  <h3 className="font-medium">Fields:</h3>
                  <ul className="list-disc text-sm text-gray-700">
                    {form.form_schema.map((field, idx) => (
                      <li
                        key={idx}
                        className="w-full list-disc flex justify-between items-center"
                      >
                        <div className="flex items-center justify-start">
                          <GoDotFill className="text-black text-xs" />
                          <span className="font-semibold">
                            {field.field_name}
                          </span>{" "}
                          ({field.required ? "required" : "optional"})
                        </div>
                        <span>{field.type}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mb-3">
                  <h3 className="font-medium mb-1">Emails:</h3>
                  {form.emails.length > 0 ? (
                    <ul className="pl-2 text-sm text-gray-700 space-y-1">
                      {form.emails.map((emailObj, i) => (
                        <li key={i} className="flex items-center justify-between">
                          <span>{emailObj.email}</span>
                          <label className="flex items-center space-x-2">
                            <span className="text-xs">
                              {emailObj.active ? "On" : "Off"}
                            </span>
                            <input
                              type="checkbox"
                              checked={emailObj.active}
                              onChange={() =>
                                toggleEmailStatus(form.id, i, emailObj.email)
                              }
                              className="toggle-checkbox"
                            />
                          </label>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-500">No emails set.</p>
                  )}
                </div>

                <div className="text-sm text-gray-600">
                  <p>
                    Status:{" "}
                    <span
                      className={form.active ? "text-green-600" : "text-red-600"}
                    >
                      {form.active ? "Active" : "Inactive"}
                    </span>
                  </p>
                  <p>Date: {form.date}</p>
                  <p>Time: {form.time}</p>
                </div>
              </motion.div>
            ))}
          </div>
        )
      }
      <ToastContainer />
    </div>
  );
};

export default Forms;
