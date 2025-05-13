import React, { useState } from "react";
import apiHandler from "@/utils/apiHandler";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";

const FIELD_TYPES = ["text", "number", "email", "date", "checkbox", "textarea"];

const CreateForm = ({ onClose, onSuccess }) => {
  const [formName, setFormName] = useState("");
  const [fields, setFields] = useState([
    { field_name: "", required: false, type: "string" },
  ]);
  const [emails, setEmails] = useState([""]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddField = () => {
    setFields([...fields, { field_name: "", required: false, type: "string" }]);
  };

  const handleFieldChange = (index, key, value) => {
    const updated = [...fields];
    updated[index][key] = value;
    setFields(updated);
  };

  const handleEmailChange = (index, value) => {
    const updated = [...emails];
    updated[index] = value;
    setEmails(updated);
  };

  const handleAddEmail = () => {
    setEmails([...emails, ""]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formName);
    if (!formName) {
      return toast.error("Form name is required.");
    }

    const formattedEmails = emails
      .filter((email) => email.trim() !== "")
      .map((email) => ({ email, active: true }));

    const payload = {
      name: formName,
      schema: fields,
      emails: formattedEmails
    };

    setIsSubmitting(true);
    const res = await apiHandler("/form", "POST", true, payload);
    setIsSubmitting(false);

    if (!res.success) {
      return toast.error(res.message || "Failed to create form");
    }

    toast.success("Form created successfully!");
    onSuccess?.(); // refresh form list
    onClose(); // close popup
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed z-[99999] inset-0 backdrop-blur-md bg-[#11111175] bg-opacity-40 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-white rounded-2xl p-6 w-full max-w-xl shadow-lg overflow-y-auto max-h-[90vh]"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.9 }}
        >
          <h2 className="text-xl font-bold mb-4 text-center">
            Create New Form
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium">Form Name</label>
              <input
                type="text"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                className="w-full mt-1 p-2 border rounded"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Fields</label>
              {fields.map((field, index) => (
                <div key={index} className="flex flex-col gap-2 mb-3">
                  <input
                    type="text"
                    placeholder="Field name"
                    value={field.field_name}
                    onChange={(e) =>
                      handleFieldChange(index, "field_name", e.target.value)
                    }
                    className="w-full p-2 border rounded"
                    required
                  />
                  <div className="flex items-center justify-between gap-4">
                    <label className="text-sm">
                      <input
                        type="checkbox"
                        checked={field.required}
                        onChange={(e) =>
                          handleFieldChange(index, "required", e.target.checked)
                        }
                        className="mr-2"
                      />
                      Required
                    </label>
                    <select
                      value={field.type}
                      onChange={(e) =>
                        handleFieldChange(index, "type", e.target.value)
                      }
                      className="p-2 border rounded"
                    >
                      {FIELD_TYPES.map((type) => (
                        <option key={type} value={type}>
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={handleAddField}
                className="text-blue-500 cursor-pointer text-sm"
              >
                + Add Field
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Emails</label>
              {emails.map((email, index) => (
                <input
                  key={index}
                  type="email"
                  value={email}
                  onChange={(e) => handleEmailChange(index, e.target.value)}
                  placeholder="Email address"
                  className="w-full p-2 border rounded mb-2"
                />
              ))}
              <button
                type="button"
                onClick={handleAddEmail}
                className="text-blue-500 cursor-pointer text-sm"
              >
                + Add Email
              </button>
            </div>

            <div className="flex justify-end gap-4 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="bg-gray-300 cursor-pointer px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-indigo-600 cursor-pointer text-white px-4 py-2 rounded hover:bg-indigo-700"
              >
                {isSubmitting ? "Submitting..." : "Create Form"}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CreateForm;
