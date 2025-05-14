import Documentation from "@/components/home/Documentation";
import SetupGuideInteractive from "../../components/common/SetupGuideInteractive";

export const metadata = {
  title: "Documentation",
  description: "Documentation for safesubmit.in",
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

export default function DocumentationPage() {
  return (
    <div className="w-full p-4 md:p-6 lg:p-8 flex flex-col items-center gap-8">
      <SetupGuideInteractive/>
      <Documentation />
    </div>
  );
}
