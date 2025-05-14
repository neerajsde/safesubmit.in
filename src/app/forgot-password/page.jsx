import { Suspense } from "react";
import ResetPassword from "./components/ResetPassword";
import Loader from "@/components/spinner/Loader";

export const metadata = {
  title: "Reset Password",
  description: "Reset your password",
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
    <Suspense fallback={<Loader/>} className="w-full p-2 md:p-4">
        <ResetPassword/>
    </Suspense>
  )
}
