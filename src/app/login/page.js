import Link from "next/link";
import LoginForm from "@/components/common/LoginForm";
import { Suspense } from "react";
import Spinner from "@/components/spinner/Spinner";

export const metadata = {
  title: "Login",
  description: "Login to your account",
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

export default function Login() {
    return (
        <div className="w-full p-2 flex justify-center items-center min-h-screen bg-gray-100">
            <div className="bg-white shadow-md rounded-lg p-4 md:p-6 lg:p-8 w-96">
                <h2 className="text-2xl font-semibold text-gray-800 text-center">Login</h2>
                <p className="text-gray-500 text-center text-sm mt-2">
                    Don&#39;t have an account yet? <Link href="/signup" className="text-purple-600 font-medium">Sign Up</Link>
                </p>
 
                <Suspense fallback={<Spinner/>}>
                    <LoginForm/>
                </Suspense>
            </div>
        </div>
    );
}
