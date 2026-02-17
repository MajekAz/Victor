
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Menu, X, Phone, Mail, MapPin, 
  Linkedin, Facebook, Twitter, 
  ChevronRight, Clock, Globe, Shield, Lock 
} from 'lucide-react';
import { NAV_LINKS, COMPANY_NAME, COMPANY_EMAIL, COMPANY_PHONE, COMPANY_ADDRESS, COMPANY_WHATSAPP, COLORS } from '../constants.tsx';
import { Logo } from './Logo.tsx';
import { CookieConsent } from './CookieConsent.tsx';

// Custom WhatsApp Icon Component
const WhatsAppIcon = ({ size = 20, className = "" }: { size?: number, className?: string }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

const TopBar = () => (
  <div className="hidden lg:block bg-[#0f172a] text-white py-2 border-b border-slate-800">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center text-xs font-medium tracking-wide">
      <div className="flex items-center space-x-6">
        <a href={`tel:${COMPANY_PHONE}`} className="flex items-center hover:opacity-80 transition-opacity">
          <Phone size={14} className="mr-2" style={{ color: COLORS.secondary }} />
          {COMPANY_PHONE}
        </a>
        <a href={`https://wa.me/${COMPANY_WHATSAPP}`} target="_blank" rel="noopener noreferrer" className="flex items-center hover:opacity-80 transition-opacity">
          <WhatsAppIcon size={14} className="mr-2 text-[#25D366]" />
          WhatsApp
        </a>
        <a href={`mailto:${COMPANY_EMAIL}`} className="flex items-center hover:opacity-80 transition-opacity">
          <Mail size={14} className="mr-2" style={{ color: COLORS.secondary }} />
          {COMPANY_EMAIL}
        </a>
        <div className="flex items-center text-slate-400">
          <Clock size={14} className="mr-2" style={{ color: COLORS.secondary }} />
          Mon - Fri: 09:00 - 18:00
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-3">
          <a href="#" aria-label="LinkedIn" className="hover:text-blue-400 transition-colors"><Linkedin size={14} /></a>
          <a href="#" aria-label="Facebook" className="hover:text-blue-400 transition-colors"><Facebook size={14} /></a>
          <a href="#" aria-label="Twitter" className="hover:text-blue-400 transition-colors"><Twitter size={14} /></a>
        </div>
        <div className="h-3 w-px bg-slate-700 mx-2"></div>
        <Link to="/admin" className="flex items-center text-slate-400 hover:text-white transition-colors">
          <Lock size={12} className="mr-1.5" /> Admin
        </Link>
      </div>
    </div>
  </div>
);

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navClass = scrolled 
    ? 'bg-white shadow-xl py-3 border-b border-slate-200' 
    : 'bg-slate-900/80 backdrop-blur-lg py-5 border-b border-white/10';

  const linkBaseColor = scrolled ? 'text-slate-700' : 'text-slate-100';

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${navClass} ${scrolled ? 'top-0' : 'lg:top-10 top-0'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex-shrink-0">
            <Logo isDark={!scrolled} className="h-10 md:h-12" />
          </Link>
          
          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-8">
            {NAV_LINKS.map((link) => (
              <Link 
                key={link.label} 
                to={link.href} 
                className={`text-sm font-black uppercase tracking-widest hover:opacity-70 transition-all ${
                  location.pathname === link.href 
                    ? (scrolled ? 'text-blue-600' : 'text-blue-400') 
                    : linkBaseColor
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link 
              to="/contact" 
              className="px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest text-white shadow-lg transition-all hover:scale-105"
              style={{ backgroundColor: COLORS.primary }}
            >
              Get Started
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`p-2 rounded-md ${scrolled ? 'text-slate-900' : 'text-white'}`}
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`lg:hidden transition-all duration-300 overflow-hidden ${isOpen ? 'max-h-screen border-t border-slate-100 bg-white shadow-xl' : 'max-h-0'}`}>
        <div className="px-4 pt-2 pb-6 space-y-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              to={link.href}
              className="block px-3 py-4 text-base font-black text-slate-900 border-b border-slate-50 uppercase tracking-widest"
              onClick={() => setIsOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <Link
            to="/admin"
            className="flex items-center px-3 py-4 text-base font-black text-blue-600 border-b border-slate-50 uppercase tracking-widest"
            onClick={() => setIsOpen(false)}
          >
            <Lock size={18} className="mr-2" /> Staff Portal
          </Link>
          <div className="pt-4 px-3">
             <Link 
               to="/contact" 
               className="block w-full text-center py-4 rounded-xl text-white font-black uppercase tracking-widest"
               style={{ backgroundColor: COLORS.primary }}
               onClick={() => setIsOpen(false)}
             >
               Get Started
             </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

const Footer = () => {
  return (
    <footer className="bg-[#0f172a] text-white pt-24 pb-12 overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
          <div className="space-y-8">
            <Logo isDark className="h-10" />
            <p className="text-slate-400 text-sm leading-relaxed font-medium">
              A premier recruitment consultancy based in London, bridging the gap between exceptional talent and top-tier employers in critical sectors.
            </p>
            <div className="flex space-x-5">
              <a href="#" className="p-2.5 bg-slate-800 rounded-xl hover:bg-blue-600 transition-colors"><Linkedin size={18} /></a>
              <a href="#" className="p-2.5 bg-slate-800 rounded-xl hover:bg-blue-600 transition-colors"><Facebook size={18} /></a>
              <a href="#" className="p-2.5 bg-slate-800 rounded-xl hover:bg-blue-600 transition-colors"><Twitter size={18} /></a>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-black mb-8 border-b border-slate-800 pb-2">Our Sectors</h4>
            <ul className="space-y-4">
              <li><Link to="/services" className="text-slate-400 hover:text-white transition-colors text-sm font-medium flex items-center group"><ChevronRight size={14} className="mr-2 group-hover:text-blue-400 transition-colors" /> Care Sector</Link></li>
              <li><Link to="/services" className="text-slate-400 hover:text-white transition-colors text-sm font-medium flex items-center group"><ChevronRight size={14} className="mr-2 group-hover:text-blue-400 transition-colors" /> Warehouse & Logistics</Link></li>
              <li><Link to="/services" className="text-slate-400 hover:text-white transition-colors text-sm font-medium flex items-center group"><ChevronRight size={14} className="mr-2 group-hover:text-blue-400 transition-colors" /> Professional Cleaning</Link></li>
              <li><Link to="/services" className="text-slate-400 hover:text-white transition-colors text-sm font-medium flex items-center group"><ChevronRight size={14} className="mr-2 group-hover:text-blue-400 transition-colors" /> Hospitality</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-black mb-8 border-b border-slate-800 pb-2">Quick Links</h4>
            <ul className="space-y-4">
              <li><Link to="/about" className="text-slate-400 hover:text-white transition-colors text-sm font-medium flex items-center group"><ChevronRight size={14} className="mr-2 group-hover:text-blue-400 transition-colors" /> About Us</Link></li>
              <li><Link to="/blog" className="text-slate-400 hover:text-white transition-colors text-sm font-medium flex items-center group"><ChevronRight size={14} className="mr-2 group-hover:text-blue-400 transition-colors" /> Industry Insights</Link></li>
              <li><Link to="/find-a-job" className="text-slate-400 hover:text-white transition-colors text-sm font-medium flex items-center group"><ChevronRight size={14} className="mr-2 group-hover:text-blue-400 transition-colors" /> Careers / Jobs</Link></li>
              <li><Link to="/admin" className="text-slate-400 hover:text-white transition-colors text-sm font-medium flex items-center group"><Lock size={14} className="mr-2 text-blue-400" /> Admin Access</Link></li>
              <li><Link to="/terms" className="text-slate-400 hover:text-white transition-colors text-sm font-medium flex items-center group"><ChevronRight size={14} className="mr-2 group-hover:text-blue-400 transition-colors" /> Terms of Service</Link></li>
              <li><Link to="/privacy" className="text-slate-400 hover:text-white transition-colors text-sm font-medium flex items-center group"><ChevronRight size={14} className="mr-2 group-hover:text-blue-400 transition-colors" /> Privacy Policy</Link></li>
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="text-lg font-black mb-8 border-b border-slate-800 pb-2">Contact Us</h4>
            <div className="space-y-5">
              <a href={`tel:${COMPANY_PHONE}`} className="flex items-start group">
                <Phone size={18} className="mr-3 text-blue-400 mt-1" />
                <div>
                  <div className="text-xs font-black uppercase tracking-widest text-slate-500 mb-1">Phone</div>
                  <div className="text-sm font-bold group-hover:text-blue-400 transition-colors">{COMPANY_PHONE}</div>
                </div>
              </a>
              <a href={`mailto:${COMPANY_EMAIL}`} className="flex items-start group">
                <Mail size={18} className="mr-3 text-blue-400 mt-1" />
                <div>
                  <div className="text-xs font-black uppercase tracking-widest text-slate-500 mb-1">Email</div>
                  <div className="text-sm font-bold group-hover:text-blue-400 transition-colors break-all">{COMPANY_EMAIL}</div>
                </div>
              </a>
              <div className="flex items-start">
                <MapPin size={18} className="mr-3 text-blue-400 mt-1" />
                <div>
                  <div className="text-xs font-black uppercase tracking-widest text-slate-500 mb-1">Office</div>
                  <div className="text-sm font-bold leading-relaxed">{COMPANY_ADDRESS}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-12 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">
            © {new Date().getFullYear()} {COMPANY_NAME}. Registered in England.
          </p>
          <div className="flex items-center space-x-6 text-[10px] font-black uppercase tracking-widest text-slate-600">
             <span className="flex items-center gap-2"><Shield size={12}/> GDPR Compliant</span>
             <span className="flex items-center gap-2"><Globe size={12}/> Global Reach</span>
          </div>
        </div>
      </div>
      
      {/* Decorative gradient */}
      <div className="absolute top-0 right-0 -mt-24 -mr-24 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl pointer-events-none"></div>
    </footer>
  );
};

interface LayoutProps {
  children: React.ReactNode;
}

// Added export keyword and Layout implementation to fix "Module has no exported member 'Layout'" error
export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <TopBar />
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
      <CookieConsent />
    </div>
  );
};
