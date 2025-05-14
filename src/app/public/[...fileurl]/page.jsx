import PublicFile from "@/components/common/PublicFile";

export const metadata = {
  title: "View File",
  description: "View your submitted file",
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

export default function publicFile() {
    return (
        <div className="w-full min-h-screen flex flex-col gap-4">
            <PublicFile/>
        </div>
    );
}