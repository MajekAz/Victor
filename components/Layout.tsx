import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Menu, X, Phone, Mail, MapPin, 
  Linkedin, Facebook, Twitter, 
  ChevronRight, Clock, Globe, Shield 
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
        <span className="text-slate-500 flex items-center">
          <Globe size={14} className="mr-1.5" /> UK Based
        </span>
        <div className="h-3 w-px bg-slate-700 mx-2"></div>
        <div className="flex items-center space-x-3">
          <a href="#" aria-label="LinkedIn" className="hover:text-blue-400 transition-colors"><Linkedin size={14} /></a>
          <a href="#" aria-label="Facebook" className="hover:text-blue-400 transition-colors"><Facebook size={14} /></a>
          <a href="#" aria-label="Twitter" className="hover:text-blue-400 transition-colors"><Twitter size={14} /></a>
        </div>
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

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen]);

  const navClass = scrolled 
    ? 'bg-white shadow-xl py-3 border-b border-slate-200' 
    : 'bg-slate-900/80 backdrop-blur-lg py-5 border-b border-white/10';

  const linkBaseColor = scrolled ? 'text-slate-700' : 'text-slate-100';

  return (
    <>
      <TopBar />
      <nav className={`fixed w-full z-50 transition-all duration-300 ${navClass} ${scrolled ? 'top-0' : 'lg:top-10 top-0'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <Link to="/" className="flex items-center" aria-label="Promarch Consulting Home">
              <Logo className="h-8 md:h-12" isDark={!scrolled} />
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex space-x-8 items-center">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`text-sm font-bold tracking-wide transition-all relative py-1 group ${
                    location.pathname === link.href ? '' : linkBaseColor
                  }`}
                  style={location.pathname === link.href ? { color: COLORS.primary } : {}}
                >
                  {link.label}
                  <span 
                    className={`absolute bottom-0 left-0 w-full h-0.5 transition-transform duration-300 transform scale-x-0 group-hover:scale-x-100 ${location.pathname === link.href ? 'scale-x-100' : ''}`}
                    style={{ backgroundColor: COLORS.primary }}
                  ></span>
                </Link>
              ))}
              <Link 
                to="/hire-talent" 
                className={`px-4 py-2 md:px-6 md:py-2.5 rounded-xl text-sm font-black transition-all transform hover:-translate-y-0.5 shadow-lg flex items-center gap-2 ${
                  scrolled ? 'text-white' : 'bg-white text-slate-900 hover:bg-slate-50'
                }`}
                style={scrolled ? { backgroundColor: COLORS.primary } : {}}
              >
                Hire Talent
              </Link>
            </div>

            {/* Mobile Toggle */}
            <button 
              className={`md:hidden p-2 rounded-xl transition-colors ${scrolled ? 'bg-slate-100 text-slate-900' : 'bg-white/10 text-white'}`}
              onClick={() => setIsOpen(!isOpen)}
              aria-label={isOpen ? "Close menu" : "Open menu"}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Fullscreen Menu */}
      <div 
        className={`fixed inset-0 bg-slate-900 transition-all duration-500 md:hidden ${
          isOpen ? 'opacity-100 translate-x-0 pointer-events-auto' : 'opacity-0 translate-x-full pointer-events-none'
        }`}
        style={{ zIndex: 100 }}
      >
        <div className="flex flex-col h-full p-6">
          <div className="flex justify-between items-center mb-8">
            <Logo className="h-8" isDark={true} />
            <button onClick={() => setIsOpen(false)} className="text-white p-2 bg-slate-800 rounded-full hover:bg-slate-700 transition-colors">
              <X size={24} />
            </button>
          </div>

          <div className="flex flex-col space-y-2">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setIsOpen(false)}
                className={`text-2xl font-black flex items-center justify-between group py-2 transition-all ${
                  location.pathname === link.href ? 'pl-4 border-l-4' : 'text-slate-300 hover:text-white hover:pl-2'
                }`}
                style={location.pathname === link.href ? { color: COLORS.secondary, borderColor: COLORS.secondary } : {}}
              >
                {link.label}
                <ChevronRight size={20} className={location.pathname === link.href ? 'text-sky-400' : 'text-slate-600'} />
              </Link>
            ))}
            {/* Admin Link Mobile */}
              <Link
                to="/admin"
                onClick={() => setIsOpen(false)}
                className="text-2xl font-black flex items-center justify-between group py-2 text-slate-500 hover:text-white hover:pl-2 transition-all"
              >
                Admin Dashboard
                <Shield size={20} className="text-slate-600 group-hover:text-slate-400" />
              </Link>
          </div>

          <div className="mt-auto pt-8 border-t border-slate-800">
            <div className="flex flex-col space-y-4 mb-6">
              <a href={`tel:${COMPANY_PHONE}`} className="flex items-center space-x-3 text-slate-400 hover:text-white">
                <Phone size={18} className="text-sky-500" />
                <span className="font-bold">{COMPANY_PHONE}</span>
              </a>
              <a href={`https://wa.me/${COMPANY_WHATSAPP}`} className="flex items-center space-x-3 text-slate-400 hover:text-white">
                <WhatsAppIcon size={18} className="text-[#25D366]" />
                <span className="font-bold">WhatsApp Us</span>
              </a>
              <a href={`mailto:${COMPANY_EMAIL}`} className="flex items-center space-x-3 text-slate-400 hover:text-white">
                <Mail size={18} className="text-sky-500" />
                <span className="text-sm">{COMPANY_EMAIL}</span>
              </a>
            </div>
            
            <Link 
              to="/hire-talent"
              className="block w-full text-white text-center py-3 rounded-xl font-black text-lg shadow-xl transition-transform active:scale-95 bg-[#00459c] hover:bg-[#003580]"
              onClick={() => setIsOpen(false)}
            >
              Hire Talent
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

const Footer = () => (
  <footer className="bg-slate-900 text-slate-300 pt-16 pb-10">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
        <div className="space-y-8">
          <Logo className="h-10" isDark={true} />
          <p className="text-sm leading-relaxed text-slate-400">
            A premier UK recruitment agency specialized in connecting exceptional talent with reliable employers in care, logistics, and cleaning sectors.
          </p>
          <div className="flex space-x-5">
            <a href="#" aria-label="LinkedIn" className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-brand-primary hover:text-white transition-all"><Linkedin size={18} /></a>
            <a href="#" aria-label="Facebook" className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-brand-primary hover:text-white transition-all"><Facebook size={18} /></a>
            <a href="#" aria-label="Twitter" className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-brand-primary hover:text-white transition-all"><Twitter size={18} /></a>
          </div>
        </div>

        <div>
          <h4 className="text-white font-bold text-lg mb-8 relative inline-block">
            Quick Links
            <span className="absolute bottom-[-8px] left-0 w-8 h-1 rounded-full" style={{ backgroundColor: COLORS.primary }}></span>
          </h4>
          <ul className="space-y-4">
            {NAV_LINKS.map(link => (
              <li key={link.href}>
                <Link to={link.href} className="text-sm hover:text-brand-secondary transition-colors flex items-center group">
                  <ChevronRight size={14} className="mr-2 text-slate-700" />
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-white font-bold text-lg mb-8 relative inline-block">
            Our Sectors
            <span className="absolute bottom-[-8px] left-0 w-8 h-1 rounded-full" style={{ backgroundColor: COLORS.primary }}></span>
          </h4>
          <ul className="space-y-4 text-sm">
            <li><Link to="/services" className="hover:text-brand-secondary transition-colors flex items-center"><ChevronRight size={14} className="mr-2 text-slate-700" />Care Sector</Link></li>
            <li><Link to="/services" className="hover:text-brand-secondary transition-colors flex items-center"><ChevronRight size={14} className="mr-2 text-slate-700" />Logistics & Warehouse</Link></li>
            <li><Link to="/services" className="hover:text-brand-secondary transition-colors flex items-center"><ChevronRight size={14} className="mr-2 text-slate-700" />Industrial Cleaning</Link></li>
            <li><Link to="/services" className="hover:text-brand-secondary transition-colors flex items-center"><ChevronRight size={14} className="mr-2 text-slate-700" />Hospitality & Dining</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-bold text-lg mb-8 relative inline-block">
            Reach Us
            <span className="absolute bottom-[-8px] left-0 w-8 h-1 rounded-full" style={{ backgroundColor: COLORS.primary }}></span>
          </h4>
          <ul className="space-y-5">
            <li className="flex items-start space-x-3 text-sm group">
              <div className="mt-1 bg-slate-800 p-2 rounded-lg group-hover:bg-brand-primary transition-colors">
                <MapPin style={{ color: COLORS.secondary }} size={16} />
              </div>
              <span className="leading-tight pt-1">{COMPANY_ADDRESS}</span>
            </li>
            <li className="flex items-center space-x-3 text-sm group">
              <a href={`tel:${COMPANY_PHONE}`} className="flex items-center hover:text-white transition-colors">
                <div className="bg-slate-800 p-2 rounded-lg group-hover:bg-brand-primary transition-colors mr-3">
                  <Phone style={{ color: COLORS.secondary }} size={16} />
                </div>
                <span className="font-bold">{COMPANY_PHONE}</span>
              </a>
            </li>
            <li className="flex items-center space-x-3 text-sm group">
              <a href={`https://wa.me/${COMPANY_WHATSAPP}`} target="_blank" rel="noopener noreferrer" className="flex items-center hover:text-white transition-colors">
                <div className="bg-slate-800 p-2 rounded-lg group-hover:bg-[#25D366] transition-colors mr-3">
                  <WhatsAppIcon className="text-slate-300 group-hover:text-white" size={16} />
                </div>
                <span>WhatsApp Us</span>
              </a>
            </li>
            <li className="flex items-center space-x-3 text-sm group">
              <div className="bg-slate-800 p-2 rounded-lg group-hover:bg-brand-primary transition-colors">
                <Mail style={{ color: COLORS.secondary }} size={16} />
              </div>
              <span>{COMPANY_EMAIL}</span>
            </li>
          </ul>
        </div>
      </div>
      
      <div className="border-t border-slate-800 pt-10 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500 space-y-4 md:space-y-0">
        <p>© {new Date().getFullYear()} {COMPANY_NAME}. All rights reserved.</p>
        <div className="flex space-x-8">
          <Link to="/admin" className="text-blue-500 font-bold hover:text-white transition-colors flex items-center">
             <Shield size={12} className="mr-1" /> Admin Dashboard
          </Link>
          <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy & GDPR</Link>
          <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
        </div>
      </div>
    </footer>
);

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
      <CookieConsent />
      {/* Floating WhatsApp Button */}
      <a 
        href={`https://wa.me/${COMPANY_WHATSAPP}`} 
        target="_blank" 
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 bg-[#25D366] hover:bg-[#128C7E] text-white p-4 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-110 flex items-center justify-center"
        aria-label="Chat on WhatsApp"
      >
        <WhatsAppIcon size={32} />
      </a>
    </div>
  );
};
