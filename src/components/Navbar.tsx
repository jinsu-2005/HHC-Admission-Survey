"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed w-full z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-sm border-b border-gray-100 dark:border-slate-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-lg overflow-hidden shrink-0 shadow-sm border border-gray-100 dark:border-slate-700">
              <img src="/hccngl.png" alt="HCC Logo" className="w-full h-full object-cover" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-hcc-blue dark:text-blue-400 text-lg sm:text-xl leading-tight">
                Holy Cross College
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                Autonomous | Nagercoil
              </span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <span className="text-gray-600 dark:text-gray-300 font-medium tracking-wide">Admission Guidance</span>
            <ThemeToggle />
            <a href="tel:+918838517277" className="bg-hcc-gold hover:bg-yellow-500 text-hcc-dark px-6 py-2 rounded-full font-semibold transition-colors shadow-sm">
              Call Now
            </a>
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 dark:text-gray-300 hover:text-hcc-blue dark:hover:text-blue-400 focus:outline-none"
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-white dark:bg-slate-900 border-t border-gray-100 dark:border-slate-800">
          <div className="px-4 pt-2 pb-6 space-y-4">
            <div className="text-center font-medium text-gray-700 dark:text-gray-300 py-3 border-b border-gray-100 dark:border-slate-800">
              Admission Guidance
            </div>
            <a
              href="tel:+918838517277"
              className="block w-full text-center bg-hcc-blue text-white px-6 py-3 rounded-xl font-semibold shadow-sm"
            >
              Call Admission Team
            </a>
            <a
              href="https://wa.me/918838517277"
              className="block w-full text-center bg-[#25D366] text-white px-6 py-3 rounded-xl font-semibold shadow-sm"
            >
              WhatsApp Us
            </a>
            <Link href="/admin" className="block text-center text-sm text-gray-400 dark:text-gray-500 pt-4">
              Admin Access
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
