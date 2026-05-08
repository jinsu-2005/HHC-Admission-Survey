import Navbar from "@/components/Navbar";
import SurveyForm from "@/components/SurveyForm";
import { BookOpen, MapPin, Award, ShieldCheck, Home as HomeIcon, Briefcase } from "lucide-react";

export default function Home() {
  const highlights = [
    { icon: <Award className="text-hcc-gold" />, title: "NAAC A++ Accredited", desc: "Top tier excellence" },
    { icon: <ShieldCheck className="text-hcc-gold" />, title: "Established 1965", desc: "Decades of trust" },
    { icon: <BookOpen className="text-hcc-gold" />, title: "UG & PG Courses", desc: "Wide range of studies" },
    { icon: <HomeIcon className="text-hcc-gold" />, title: "Hostel Facilities", desc: "Safe & secure campus" },
    { icon: <Briefcase className="text-hcc-gold" />, title: "Placements", desc: "Career guidance" },
    { icon: <MapPin className="text-hcc-gold" />, title: "Nagercoil", desc: "Accessible location" },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-20 pb-12 lg:pt-32 lg:pb-24 overflow-hidden min-h-[60vh] flex items-center">
        <div className="absolute inset-0 bg-hcc-blue z-0">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-20 mix-blend-overlay"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-hcc-blue/90 via-hcc-blue/70 to-hcc-blue/95"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-white space-y-6 text-center lg:text-left mt-10 lg:mt-0">
              <span className="inline-block py-1 px-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-sm font-medium text-hcc-gold mb-2">
                Admission 2026 Open
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight">
                Shape Your Future With <span className="text-hcc-gold">Holy Cross</span>
              </h1>
              <p className="text-lg sm:text-xl text-blue-100 max-w-2xl mx-auto lg:mx-0">
                Tell us your higher education plans and our admission team will guide you personally towards the right career path.
              </p>
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-4">
                <a 
                  href="#fullName" 
                  className="bg-hcc-gold hover:bg-yellow-500 text-hcc-dark px-8 py-3.5 rounded-full font-bold transition-transform hover:scale-105 shadow-lg flex items-center gap-2"
                >
                  Start Survey
                </a>
                <a 
                  href="tel:+918838517277" 
                  className="bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/30 text-white px-8 py-3.5 rounded-full font-bold transition-all flex items-center gap-2"
                >
                  Call Now
                </a>
              </div>
            </div>

            <div id="survey" className="w-full max-w-md mx-auto lg:max-w-none">
              <div className="glass-card rounded-2xl p-6 sm:p-8 relative overflow-hidden shadow-2xl shadow-black/20">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-hcc-gold to-yellow-300"></div>
                <SurveyForm />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Highlights Section */}
      <section className="py-16 sm:py-24 bg-gray-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Why Choose Holy Cross College?</h2>
            <div className="h-1 w-20 bg-hcc-gold mx-auto rounded-full"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              We empower young women with quality education, ethical values, and holistic development to build a bright future.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {highlights.map((item, idx) => (
              <div key={idx} className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 text-center hover:shadow-md transition-shadow group">
                <div className="w-12 h-12 mx-auto bg-blue-50 dark:bg-slate-700 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  {item.icon}
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-1">{item.title}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
