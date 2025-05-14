import ContactForm from "@/components/common/ContactForm";

export const metadata = {
  title: "Contact Us",
  description: "Contact us page for our website",
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

export default function ContactPage() {
  return <ContactForm />;
}
