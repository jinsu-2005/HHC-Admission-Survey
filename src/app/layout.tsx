import type { Metadata } from "next";
import "./globals.css";
import FloatingContact from "@/components/FloatingContact";
import Footer from "@/components/Footer";
import { ThemeProvider } from "@/components/ThemeProvider";

export const metadata: Metadata = {
  metadataBase: new URL("https://hcc-survey.vercel.app"), // Replace with your actual domain
  title: "Holy Cross College - Admission Guidance",
  description: "Join Holy Cross College, Nagercoil. Tell us your higher education plans and our admission team will guide you personally.",
  icons: {
    icon: "/hccngl.png",
    apple: "/hccngl.png",
  },
  openGraph: {
    title: "Holy Cross College - Admission Guidance",
    description: "Join Holy Cross College, Nagercoil. Tell us your higher education plans and our admission team will guide you personally.",
    url: "https://hcc-survey.vercel.app", // Fallback URL, update if different
    siteName: "Holy Cross College",
    images: [
      {
        url: "/hccngl.png",
        width: 500,
        height: 500,
        alt: "Holy Cross College Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Holy Cross College - Admission Guidance",
    description: "Join Holy Cross College, Nagercoil. Tell us your higher education plans and our admission team will guide you personally.",
    images: ["/hccngl.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased min-h-screen flex flex-col bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 transition-colors duration-200">
        <ThemeProvider>
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
          <FloatingContact />
        </ThemeProvider>
      </body>
    </html>
  );
}
