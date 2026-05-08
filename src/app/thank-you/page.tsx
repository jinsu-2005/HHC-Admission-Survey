"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { CheckCircle, PhoneCall, MessageCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function ThankYouPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Simple confetti effect could be added here
  }, []);

  if (!mounted) return null;

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <section className="flex-grow flex items-center justify-center pt-24 pb-12 px-4 bg-gray-50 dark:bg-slate-900">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, type: "spring" }}
          className="max-w-xl w-full bg-white dark:bg-slate-800 p-8 sm:p-12 rounded-3xl shadow-xl text-center border border-gray-100 dark:border-slate-700"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          >
            <CheckCircle className="w-24 h-24 text-green-500 mx-auto mb-6" />
          </motion.div>
          
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Thank you for your interest!
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
            Your response has been saved successfully. Our admission guidance team will contact you shortly.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <a 
              href="tel:+918838517277" 
              className="flex items-center justify-center gap-2 bg-hcc-blue hover:bg-blue-800 text-white p-4 rounded-xl font-semibold transition-colors shadow-sm"
            >
              <PhoneCall size={20} /> Call Admission Team
            </a>
            <a 
              href="https://wa.me/918838517277?text=Hello,%20I%20am%20interested%20in%20Holy%20Cross%20College%20admission%20guidance." 
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-[#25D366] hover:bg-green-600 text-white p-4 rounded-xl font-semibold transition-colors shadow-sm"
            >
              <MessageCircle size={20} /> WhatsApp Us
            </a>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-100 dark:border-slate-700">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Admission Helpline: <span className="text-hcc-blue dark:text-blue-400 font-bold">8838517277</span>
            </p>
            <a href="/" className="inline-block mt-4 text-sm text-hcc-blue hover:underline font-medium">
              Return to Home
            </a>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
