"use client";
import React, { useEffect, useState } from "react";
import { CheckCircle, ArrowRight, ArrowLeft } from "lucide-react";
import { useAppSelector } from "@/lib/store/hooks/hook";
import Loader from "../spinner/Loader";
import { redirect } from "next/navigation";

const steps = [
  {
    title: "Login or Register",
    description: "Begin by logging into your existing account. If you're a new user, register for a new account to get started with our platform.",
    buttonText: "Go to Login",
    url: "/login"
  },
  {
    title: "Access the User Menu",
    description: "After logging in, locate your name or profile icon at the top-right corner of the page. Click on it to open the user dropdown menu.",
    buttonText: "Open User Menu",
    url: "/dashboard"
  },
  {
    title: "Open Your Dashboard",
    description: "From the user dropdown menu, select the 'Dashboard' option to access your personal dashboard where you can manage your forms and settings.",
    buttonText: "Go to Dashboard",
    url: "/dashboard"
  },
  {
    title: "Create a New Form",
    description: "In the dashboard, click on the 'Create New Form' button. Fill in the necessary details like form title and fields, then save it to generate a unique Form Key.",
    buttonText: "Create Form",
    url: "/dashboard"
  },
  {
    title: "Copy the Form Key",
    description: "Once the form is created, a unique Form Key will be displayed. This key is essential for submitting data. Click the copy icon to save it.",
    buttonText: "Copy Form Key",
    url: "/dashboard"
  },
  {
    title: "Navigate to Settings",
    description: "Click on 'Settings' in the sidebar or user menu to configure your account preferences and access integration options.",
    buttonText: "Open Settings",
    url: "/dashboard/settings"
  },
  {
    title: "Copy the API Key",
    description: "Inside the settings page, scroll to the API section. Click the 'Copy API Key' button to copy your secure API key for backend integration.",
    buttonText: "Copy API Key",
    url: "/dashboard/settings"
  },
  {
    title: "Open the Documentation",
    description: "Head to the 'Documentation' section from the main menu or sidebar to understand how to integrate and use your keys effectively.",
    buttonText: "Open Docs",
    url: "/documentation"
  },
  {
    title: "Replace Keys in Documentation",
    description: "In the code examples provided in the documentation, replace the placeholder values with your actual Form Key and API Key.",
    buttonText: "Insert Keys",
    url: "/documentation"
  },
  {
    title: "Update Payload Structure",
    description: "Customize the request payload in the documentation to match the fields and structure of your created form for accurate data submission.",
    buttonText: "Edit Payload",
    url: "/documentation"
  },
  {
    title: "Test Form Submission",
    description: "Use tools like Postman or your frontend application to send test data to the API endpoint using your Form Key and API Key. Check for success status.",
    buttonText: "Test Now",
    url: "/documentation"
  },
  {
    title: "Handle API Responses",
    description: "Pay attention to the API's response messages. Implement proper error handling and success feedback in your application for a better user experience.",
    buttonText: "Review Responses",
    url: "/documentation"
  },
  {
    title: "Monitor Submissions",
    description: "Return to your dashboard to view the submissions made to your form. Each entry will appear in real-time and can be managed or exported.",
    buttonText: "View Submissions",
    url: "/dashboard"
  },
  {
    title: "Deploy Your Integration",
    description: "Once everything is tested, deploy your application with the form integration in place. Ensure environment variables for keys are securely configured.",
    buttonText: "Deploy Now",
    url: "/"
  },
  {
    title: "Get Help & Support",
    description: "If you encounter any issues, visit the support page or contact our team through the help center for guidance and troubleshooting.",
    buttonText: "Visit Support",
    url: "/contact"
  }
];

const SetupGuideInteractive = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const {isAuthenticated, loading} = useAppSelector((state) => state.auth);

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const step = steps[currentStep];
  const isLast = currentStep === steps.length - 1;
  const isFirst = currentStep === 0;

  function btnHandler(url){
    if(isAuthenticated){
      redirect(url);
    }
    else{
      redirect("/login")
    }
  }

  useEffect(() => {
    if(isAuthenticated){
      setCurrentStep(1);
    }
  },[isAuthenticated]);

  if(loading){
    return <Loader/>
  }

  return (
    <div className="w-full border p-6 mt-8 bg-white rounded-xl shadow-lg">
      <div className="mb-6 text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">🚀 Setup Guide</h2>
        <p className="text-gray-500">
          Step {currentStep + 1} of {steps.length}
        </p>
      </div>

      <div className="relative border-l-4 border-blue-500 pl-4 pb-4">
        <CheckCircle className="absolute -left-[14px] top-1 text-blue-500 bg-white" />
        <h3 className="text-xl font-semibold text-gray-800 mb-2">{step.title}</h3>
        <p className="text-gray-600 mb-4">{step.description}</p>
        <button onClick={() => btnHandler(step.url)} className="bg-blue-600 cursor-pointer text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          {step.buttonText}
        </button>
      </div>

      <div className="mt-6 flex justify-between items-center">
        <button
          onClick={prevStep}
          disabled={isFirst}
          className={`flex items-center cursor-pointer gap-2 px-4 py-2 rounded-lg transition ${
            isFirst
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        <div className="w-full h-2 bg-gray-200 rounded-full mx-4 overflow-hidden">
          <div
            className="h-full bg-blue-500 transition-all"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          ></div>
        </div>

        <button
          onClick={nextStep}
          disabled={isLast}
          className={`flex items-center gap-2 cursor-pointer px-4 py-2 rounded-lg transition ${
            isLast
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          Next
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default SetupGuideInteractive;
