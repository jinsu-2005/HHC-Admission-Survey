import type { Metadata } from "next";
import "./globals.css";
import FloatingContact from "@/components/FloatingContact";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Holy Cross College - Admission Guidance",
  description: "Join Holy Cross College, Nagercoil. Tell us your higher education plans and our admission team will guide you personally.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-gray-50 dark:bg-slate-900 min-h-screen flex flex-col">
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
        <FloatingContact />
      </body>
    </html>
  );
}
