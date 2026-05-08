import type { Metadata } from "next";
import "./globals.css";
import FloatingContact from "@/components/FloatingContact";
import Footer from "@/components/Footer";
import { ThemeProvider } from "@/components/ThemeProvider";

export const metadata: Metadata = {
  title: "Holy Cross College - Admission Guidance",
  description: "Join Holy Cross College, Nagercoil. Tell us your higher education plans and our admission team will guide you personally.",
  icons: {
    icon: "/hccngl.jpg",
    apple: "/hccngl.jpg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
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
