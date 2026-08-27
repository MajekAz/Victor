import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ExternalLink, 
  ShieldCheck, 
  Clock, 
  Globe, 
  CheckCircle2, 
  HelpCircle, 
  Sparkles, 
  GraduationCap, 
  Briefcase, 
  Plane,
  Loader2,
  Mail,
  Phone
} from 'lucide-react';
import { 
  COMPANY_NAME, 
  COMPANY_EMAIL, 
  COMPANY_PHONE, 
  GOOGLE_FORM_CONSULTATION_URL, 
  GOOGLE_FORM_EMBED_URL, 
  COLORS 
} from '../constants.tsx';

const BookConsultation: React.FC = () => {
  const [iframeLoaded, setIframeLoaded] = useState<boolean>(false);

  return (
    <div className="pt-20 min-h-screen bg-slate-50 font-sans pb-24" id="consultation-page">
      {/* 1. Hero Section */}
      <section className="relative h-[48vh] min-h-[400px] flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=2000" 
            className="w-full h-full object-cover"
            alt="Consultation and Career Abroad"
          />
          <div className="absolute inset-0 bg-slate-900/75 backdrop-blur-[1px]"></div>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs sm:text-sm font-bold uppercase tracking-widest text-blue-200">
            <Sparkles size={14} className="text-blue-400" />
            <span>Official Application & Advisory Portal</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-[900] tracking-tight leading-tight">
            Book a Consultation with <br className="hidden sm:inline" />
            <span style={{ color: COLORS.secondary }}>Promarch Career Abroad</span>
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-slate-200 max-w-3xl mx-auto leading-relaxed font-normal">
            Complete the form below to start your study abroad, career abroad, recruitment, or relocation enquiry. Once submitted, your details will be captured securely and a Promarch consultant will contact you shortly.
          </p>
        </div>
      </section>

      {/* 2. Key Consultation Pathways Banner */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl border border-slate-200/80 p-5 sm:p-7 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="flex items-start space-x-3.5 p-3 rounded-2xl bg-slate-50 border border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
              <GraduationCap size={20} />
            </div>
            <div>
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-900">Study Abroad</h4>
              <p className="text-[11px] text-slate-600 font-medium">University admissions, visa preparation & scholarships.</p>
            </div>
          </div>

          <div className="flex items-start space-x-3.5 p-3 rounded-2xl bg-slate-50 border border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <Briefcase size={20} />
            </div>
            <div>
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-900">Career Abroad</h4>
              <p className="text-[11px] text-slate-600 font-medium">Healthcare, logistics, and skilled professional roles.</p>
            </div>
          </div>

          <div className="flex items-start space-x-3.5 p-3 rounded-2xl bg-slate-50 border border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
              <Plane size={20} />
            </div>
            <div>
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-900">UK Relocation</h4>
              <p className="text-[11px] text-slate-600 font-medium">Settlement advice, compliance, and onboarding support.</p>
            </div>
          </div>

          <div className="flex items-start space-x-3.5 p-3 rounded-2xl bg-slate-50 border border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
              <ShieldCheck size={20} />
            </div>
            <div>
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-900">Direct Vetting</h4>
              <p className="text-[11px] text-slate-600 font-medium">100% confidential, GDPR-compliant data processing.</p>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Main Form Section */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 sm:mt-16">
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
          {/* Form Header Action Bar */}
          <div className="bg-slate-900 text-white p-5 sm:p-7 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800">
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-blue-400 block mb-1">
                Official Consultation Form
              </span>
              <h2 className="text-lg sm:text-xl font-black text-white">
                Application & Consultation Questionnaire
              </h2>
            </div>

            {/* Quick Open Consultation Form Button */}
            <a
              href={GOOGLE_FORM_CONSULTATION_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider text-white shadow-md transition-all hover:opacity-90 self-stretch sm:self-auto justify-center"
              style={{ backgroundColor: COLORS.secondary }}
              id="btn-open-consultation-form-top"
            >
              <span>Open Consultation Form</span>
              <ExternalLink size={14} />
            </a>
          </div>

          {/* Intro Notice inside card */}
          <div className="p-5 sm:p-6 bg-blue-50/70 border-b border-blue-100 text-xs sm:text-sm text-slate-700 leading-relaxed flex items-start space-x-3">
            <Clock size={20} className="text-blue-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-slate-900 mb-1">
                Takes approximately 2-3 minutes to complete.
              </p>
              <p className="text-slate-600 text-xs">
                Please provide accurate contact information and detail your preferred field so our specialist team can match you with the right advisor.
              </p>
            </div>
          </div>

          {/* Embedded Google Form Container */}
          <div className="p-2 sm:p-6 bg-slate-50 relative min-h-[600px] flex flex-col items-center justify-center">
            {!iframeLoaded && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-50 z-10 p-6 space-y-3">
                <Loader2 size={36} className="animate-spin text-blue-600" />
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Loading Consultation Form...
                </p>
              </div>
            )}

            <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden">
              <iframe
                src={GOOGLE_FORM_EMBED_URL}
                title="Promarch Career Abroad Consultation Form"
                width="100%"
                height="950"
                frameBorder="0"
                marginHeight={0}
                marginWidth={0}
                className="w-full border-0"
                onLoad={() => setIframeLoaded(true)}
              >
                Loading form…
              </iframe>
            </div>
          </div>

          {/* Bottom Action Bar with Direct Link & Note */}
          <div className="p-6 sm:p-8 bg-white border-t border-slate-200 space-y-6">
            {/* Fallback Button */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200">
              <div>
                <h4 className="text-sm font-bold text-slate-900">
                  Having trouble loading the form above?
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  You can open and submit the Google Form directly in a new browser tab.
                </p>
              </div>
              
              <a
                href={GOOGLE_FORM_CONSULTATION_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 hover:bg-blue-600 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md shrink-0 w-full sm:w-auto justify-center"
                id="btn-open-form-new-tab-fallback"
              >
                <span>Open Form in New Tab</span>
                <ExternalLink size={14} />
              </a>
            </div>

            {/* Required Note Below the Form */}
            <div className="p-4 sm:p-5 bg-emerald-50 rounded-2xl border border-emerald-200 text-emerald-900 flex items-start space-x-3.5">
              <CheckCircle2 size={22} className="text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-emerald-800 mb-1">
                  Submission & Follow-Up Guarantee
                </h4>
                <p className="text-xs sm:text-sm font-medium leading-relaxed">
                  After submitting the form, please check your email for confirmation. A Promarch Career Abroad consultant will review your details and contact you shortly.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Alternative Enquiries / Help Section */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 text-white flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <span className="text-[10px] font-black uppercase tracking-widest text-blue-400">
              Need Direct Assistance?
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-white">
              Have a general inquiry or employer request?
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl">
              You can also use our direct contact form or speak directly with our London advisory desk.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0">
            <Link
              to="/contact"
              className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider text-center transition-all shadow-md"
            >
              Contact Us Form
            </Link>
            <a
              href={`tel:${COMPANY_PHONE}`}
              className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs uppercase tracking-wider text-center transition-all border border-slate-700"
            >
              Call {COMPANY_PHONE}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BookConsultation;
