import type { Metadata } from "next";
import "./globals.css";
import FloatingContact from "@/components/FloatingContact";
import Footer from "@/components/Footer";
import { ThemeProvider } from "@/components/ThemeProvider";

export const metadata: Metadata = {
  metadataBase: new URL("https://hhc-admission-survey.vercel.app"),
  title: "Holy Cross College - Admission Guidance",
  description: "Join Holy Cross College, Nagercoil. Tell us your higher education plans and our admission team will guide you personally.",
  applicationName: "Holy Cross College Survey",
  keywords: ["Holy Cross College", "Admission", "Nagercoil", "Survey", "Education"],
  alternates: {
    canonical: "https://hhc-admission-survey.vercel.app",
  },
  icons: {
    icon: "/hccngl.png",
    apple: "/hccngl.png",
  },
  openGraph: {
    title: "Holy Cross College - Admission Guidance",
    description: "Join Holy Cross College, Nagercoil. Tell us your higher education plans and our admission team will guide you personally.",
    url: "https://hhc-admission-survey.vercel.app",
    siteName: "Holy Cross College",
    images: [
      {
        url: "https://hhc-admission-survey.vercel.app/hccngl.png",
        secureUrl: "https://hhc-admission-survey.vercel.app/hccngl.png",
        width: 500,
        height: 500,
        type: "image/png",
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
    images: ["https://hhc-admission-survey.vercel.app/hccngl.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" prefix="og: http://ogp.me/ns#" suppressHydrationWarning>
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
