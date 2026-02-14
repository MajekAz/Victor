import React from 'react';
import { Shield, Lock, Eye, Server, Cookie, FileText, CheckCircle } from 'lucide-react';
import { COLORS, COMPANY_NAME, COMPANY_EMAIL } from '../constants.tsx';

const Privacy: React.FC = () => {
  const lastUpdated = "January 15, 2024";

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="relative h-[40vh] flex items-center justify-center min-h-[350px]">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=2000" 
            className="w-full h-full object-cover"
            alt="Privacy & Security"
          />
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-[2px]"></div>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 text-center text-white">
          <h1 className="text-5xl md:text-7xl font-black mb-6">Privacy Policy</h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Your data security and privacy rights (GDPR) are our top priority.
          </p>
          <p className="mt-4 text-sm text-slate-400">Last Updated: {lastUpdated}</p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          
          <div className="prose prose-lg max-w-none text-slate-600">
            <p className="lead text-xl text-slate-900 font-bold mb-12">
              At {COMPANY_NAME}, we are committed to protecting and respecting your privacy. This policy explains how we collect, use, and store your personal data in compliance with the UK General Data Protection Regulation (UK GDPR) and the Data Protection Act 2018.
            </p>

            <div className="grid md:grid-cols-2 gap-8 mb-16 not-prose">
              <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100">
                <Shield className="text-blue-600 mb-4" size={32} />
                <h3 className="text-xl font-bold mb-2">Data Controller</h3>
                <p className="text-sm">{COMPANY_NAME} acts as the Data Controller for your personal information. We are responsible for how your data is processed.</p>
              </div>
              <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100">
                <Lock className="text-emerald-600 mb-4" size={32} />
                <h3 className="text-xl font-bold mb-2">Secure Storage</h3>
                <p className="text-sm">We use enterprise-grade encryption and secure servers to store your data. Access is strictly limited to authorized personnel.</p>
              </div>
            </div>

            <h2 className="flex items-center text-2xl font-black text-slate-900 mb-6">
              <Eye className="mr-3 text-blue-500" /> 1. Information We Collect
            </h2>
            <p>We may collect and process the following data about you:</p>
            <ul className="list-disc pl-6 space-y-2 mb-8">
              <li><strong>Identity Data:</strong> First name, last name, username, or similar identifiers.</li>
              <li><strong>Contact Data:</strong> Billing address, delivery address, email address, and telephone numbers.</li>
              <li><strong>Professional Data:</strong> CVs, employment history, qualifications, and right-to-work documentation (for candidates).</li>
              <li><strong>Technical Data:</strong> IP address, browser type and version, time zone setting, and operating system.</li>
            </ul>

            <h2 className="flex items-center text-2xl font-black text-slate-900 mb-6">
              <Server className="mr-3 text-blue-500" /> 2. How We Use Your Data
            </h2>
            <p>We only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:</p>
            <ul className="list-disc pl-6 space-y-2 mb-8">
              <li>To register you as a new candidate or client.</li>
              <li>To match candidates with potential employers (Recruitment Services).</li>
              <li>To manage our relationship with you, including notifying you about changes to our terms or privacy policy.</li>
              <li>To administer and protect our business and this website.</li>
            </ul>

            <h2 className="flex items-center text-2xl font-black text-slate-900 mb-6">
              <CheckCircle className="mr-3 text-blue-500" /> 3. Your GDPR Rights
            </h2>
            <p>Under certain circumstances, you have rights under data protection laws in relation to your personal data, including:</p>
            <ul className="list-disc pl-6 space-y-2 mb-8">
              <li><strong>Request access</strong> to your personal data (commonly known as a "data subject access request").</li>
              <li><strong>Request correction</strong> of the personal data that we hold about you.</li>
              <li><strong>Request erasure</strong> of your personal data ("right to be forgotten").</li>
              <li><strong>Object to processing</strong> of your personal data where we are relying on a legitimate interest.</li>
              <li><strong>Request restriction</strong> of processing of your personal data.</li>
            </ul>

            <h2 className="flex items-center text-2xl font-black text-slate-900 mb-6">
              <Cookie className="mr-3 text-blue-500" /> 4. Cookies
            </h2>
            <p>
              Our website uses cookies to distinguish you from other users of our website. This helps us to provide you with a good experience when you browse our website and also allows us to improve our site. You can set your browser to refuse all or some browser cookies, or to alert you when websites set or access cookies.
            </p>

            <h2 className="flex items-center text-2xl font-black text-slate-900 mb-6">
              <FileText className="mr-3 text-blue-500" /> 5. Contact Us
            </h2>
            <p>
              If you have any questions about this privacy policy or our privacy practices, please contact us at:
            </p>
            <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 not-prose mt-4">
              <p className="font-bold text-slate-900 mb-1">Data Protection Officer</p>
              <p className="text-blue-600 font-bold mb-0">{COMPANY_EMAIL}</p>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
};

export default Privacy;