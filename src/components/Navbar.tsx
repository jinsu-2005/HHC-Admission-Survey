"use client";

import { useState } from "react";
import { Menu, X, GraduationCap } from "lucide-react";
import Link from "next/link";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed w-full z-50 bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center gap-3">
            <div className="bg-hcc-blue text-white p-2 rounded-lg">
              <GraduationCap size={32} />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-hcc-blue text-lg sm:text-xl leading-tight">
                Holy Cross College
              </span>
              <span className="text-xs text-gray-500 font-medium">
                Autonomous | Nagercoil
              </span>
            </div>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <span className="text-gray-700 font-medium tracking-wide">Admission Guidance</span>
            <a href="tel:+918838517277" className="bg-hcc-gold hover:bg-yellow-500 text-hcc-dark px-6 py-2 rounded-full font-semibold transition-colors shadow-sm">
              Call Now
            </a>
          </div>

          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-hcc-blue focus:outline-none"
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100">
          <div className="px-4 pt-2 pb-6 space-y-4">
            <div className="text-center font-medium text-gray-700 py-3 border-b border-gray-50">
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
            <Link href="/admin" className="block text-center text-sm text-gray-500 pt-4">
              Admin Access
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
