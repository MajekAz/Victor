import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Cookie } from 'lucide-react';
import { COLORS } from '../constants.tsx';

export const CookieConsent: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem('promarch_cookie_consent');
    if (!consent) {
      // Small delay for better UX entrance animation
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('promarch_cookie_consent', 'accepted');
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem('promarch_cookie_consent', 'declined');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-[100] animate-fade-in-up">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 md:p-8 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative overflow-hidden">
        
        {/* Decorative background blur */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 -z-10"></div>

        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
             <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
                <Cookie size={24} />
             </div>
             <h3 className="text-lg font-black text-slate-900">GDPR Cookie Consent</h3>
          </div>
          <p className="text-slate-600 leading-relaxed text-sm">
            We use cookies to personalize content, analyze traffic, and ensure you get the best experience. 
            By clicking "Accept All", you consent to our use of cookies in accordance with UK GDPR. 
            View our <Link to="/privacy" className="text-blue-600 font-bold hover:underline">Privacy Policy</Link> for details.
          </p>
        </div>
        
        <div className="flex flex-row gap-3 w-full lg:w-auto shrink-0">
          <button 
            onClick={handleDecline}
            className="flex-1 lg:flex-none px-6 py-3 rounded-xl font-bold text-slate-600 hover:bg-slate-50 transition-colors border border-slate-200 text-sm"
          >
            Decline
          </button>
          <button 
            onClick={handleAccept}
            className="flex-1 lg:flex-none px-8 py-3 rounded-xl font-bold text-white shadow-lg hover:brightness-110 transition-all text-sm whitespace-nowrap"
            style={{ backgroundColor: COLORS.primary }}
          >
            Accept All
          </button>
        </div>
      </div>
    </div>
  );
};
