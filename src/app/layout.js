import AuthProvider from "@/components/auth/AuthProvider";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner"
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import StoreProvider from "./StoreProvider";

export const metadata = {
  title: "safesubmit.in",
  description: "Home page",
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

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <StoreProvider>
            <main>
                <Navbar/>
                  {children}
                <Footer/>
            </main>
          </StoreProvider>
          
        </AuthProvider>
        <Toaster />
      </body>
    </html>
  );
}
