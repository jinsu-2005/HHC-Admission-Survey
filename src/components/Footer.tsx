import { Phone, MapPin, Mail, Globe } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 py-10 px-6 sm:px-12 mt-12 border-t border-slate-800">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="text-xl font-bold text-white mb-4">Holy Cross College</h3>
          <p className="text-sm mb-4">
            Empowering women since 1965 through quality education and holistic development.
            NAAC A++ Accredited.
          </p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-white transition-colors"><Globe size={20} /></a>
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Contact Us</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <MapPin size={20} className="shrink-0 text-hcc-gold" />
              <span className="text-sm">Holy Cross College (Autonomous),<br/>Roch Nagar, Nagercoil 629 004,<br/>Tamil Nadu, India</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone size={20} className="shrink-0 text-hcc-gold" />
              <span className="text-sm">8838517277</span>
            </div>
            <div className="flex items-center gap-3">
              <Mail size={20} className="shrink-0 text-hcc-gold" />
              <span className="text-sm">Contact Administration</span>
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="/" className="hover:text-hcc-gold transition-colors">Home</a></li>
            <li><a href="https://holycrossngl.edu.in/" target="_blank" rel="noopener noreferrer" className="hover:text-hcc-gold transition-colors">Official Website</a></li>
            <li><a href="https://www.youtube.com/@holycrosscollegenagercoil/videos" target="_blank" rel="noopener noreferrer" className="hover:text-hcc-gold transition-colors">YouTube Channel</a></li>
            <li><a href="/admin" className="hover:text-hcc-gold transition-colors">Admin Login</a></li>
          </ul>
        </div>
      </div>
      
      <div className="max-w-6xl mx-auto mt-10 pt-6 border-t border-slate-800 text-center text-sm">
        <p>&copy; {new Date().getFullYear()} Holy Cross College. All rights reserved.</p>
      </div>
    </footer>
  );
}
