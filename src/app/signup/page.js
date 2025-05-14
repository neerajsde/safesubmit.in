import { Suspense } from "react";
import Signup from "./components/Signup";
import Loader from "@/components/spinner/Loader";

export const metadata = {
  title: "Sign Up",
  description: "Create your account",
  icons: [
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '32x32',
      url: '/favicon_io/favicon-32x32.png',
    },
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '16x16',
      url: '/favicon_io/favicon-16x16.png',
    },
    {
      rel: 'apple-touch-icon',
      sizes: '180x180',
      url: '/favicon_io/apple-touch-icon.png',
    },
  ],
  manifest: '/favicon_io/site.webmanifest'
};

export default function signup(){
    return (
        <div className="w-full p-2 flex justify-center items-center min-h-screen bg-gray-100">
            <div className="bg-white shadow-md rounded-lg p-4 md:p-6 lg:p-8 w-96">
                <Suspense fallback={<Loader/>}>
                    <Signup/>
                </Suspense>
            </div>
        </div>
    )
}