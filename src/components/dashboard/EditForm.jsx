import React, { useState } from "react";
import { toast } from "react-toastify";
import apiHandler from "@/utils/apiHandler";
import { motion } from "framer-motion";

const FIELD_TYPES = ["text", "number", "email", "date", "checkbox", "textarea"];

const EditFormComponent = ({ data, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    id: data.id,
    name: data.name,
    form_schema: [...data.form_schema],
    emails: [...data.emails.map(e => ({ ...e }))],
  });

  const handleFieldChange = (index, key, value) => {
    const updatedFields = [...formData.form_schema];
    updatedFields[index][key] = value;
    setFormData({ ...formData, form_schema: updatedFields });
  };

  const addField = () => {
    setFormData({
      ...formData,
      form_schema: [...formData.form_schema, { field_name: "", type: "text", required: false }],
    });
  };

  const handleEmailChange = (index, value) => {
    const updatedEmails = [...formData.emails];
    updatedEmails[index].email = value;
    setFormData({ ...formData, emails: updatedEmails });
  };

  const addEmail = () => {
    setFormData({
      ...formData,
      emails: [...formData.emails, { email: "", active: true }],
    });
  };

  const deleteEmail = (index) => {
    const updatedEmails = [...formData.emails];
    updatedEmails.splice(index, 1);
    setFormData({ ...formData, emails: updatedEmails });
  };

  const handleSave = async () => {
    const payload = {
        name: formData.name,
        schema: formData.form_schema,
        emails: formData.emails.filter(email => email.email.trim() !== "")
    };
    const res = await apiHandler(`/form/${parseInt(formData.id)}`, "PUT", true, payload);
    if (res.success) {
      toast.success("Form updated successfully!");
      if (onUpdate) onUpdate(); // refresh parent
      onClose(); // close modal
    } else {
      toast.error(res.message || "Update failed");
    }
  };

  return (
    <div className="fixed inset-0 backdrop-blur-md bg-[#11111175] bg-opacity-50 z-[99999] flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-xl w-full max-w-3xl p-6 space-y-4 overflow-y-auto max-h-[90vh]"
      >
        <h2 className="text-xl font-semibold mb-2">Edit Form: {data.name}</h2>

        {/* Edit Form Name */}
        <div>
          <label className="block text-sm font-medium">Form Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full mt-1 p-2 border rounded"
          />
        </div>

        {/* Fields */}
        <div>
          <h3 className="font-medium">Fields</h3>
          {formData.form_schema.map((field, idx) => (
            <div key={idx} className="flex space-x-2 mb-2 items-center">
              <input
                type="text"
                value={field.field_name}
                onChange={(e) => handleFieldChange(idx, "field_name", e.target.value)}
                placeholder="Field name"
                className="w-1/2 p-2 border rounded"
              />
              <select
                value={field.type}
                onChange={(e) => handleFieldChange(idx, "type", e.target.value)}
                className="w-1/3 p-2 border rounded"
              >
                {FIELD_TYPES.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              <label className="flex items-center space-x-1 text-sm">
                <input
                  type="checkbox"
                  checked={field.required}
                  onChange={(e) => handleFieldChange(idx, "required", e.target.checked)}
                />
                <span>Required</span>
              </label>
            </div>
          ))}
          <button
            onClick={addField}
            className="text-sm cursor-pointer text-blue-600 hover:underline"
          >
            + Add Field
          </button>
        </div>

        {/* Emails */}
        <div>
          <h3 className="font-medium">Emails</h3>
          {formData.emails.map((emailObj, idx) => (
            <div key={idx} className="flex space-x-2 mb-2 items-center">
              <input
                type="email"
                value={emailObj.email}
                onChange={(e) => handleEmailChange(idx, e.target.value)}
                className="w-full p-2 border rounded"
              />
              <button
                onClick={() => deleteEmail(idx)}
                className="text-red-600 cursor-pointer text-sm hover:underline"
              >
                Delete
              </button>
            </div>
          ))}
          <button
            onClick={addEmail}
            className="text-sm cursor-pointer text-blue-600 hover:underline"
          >
            + Add Email
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 cursor-pointer py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 cursor-pointer py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          >
            Save Changes
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default EditFormComponent;
