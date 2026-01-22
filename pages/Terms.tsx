import React from 'react';
import { Shield, FileText, Scale, Info, CheckCircle, AlertCircle } from 'lucide-react';
import { COLORS, COMPANY_NAME } from '../constants.tsx';

const Terms: React.FC = () => {
  const sections = [
    {
      title: "1. Introduction",
      icon: <Info size={24} className="text-blue-500" />,
      content: `Welcome to ${COMPANY_NAME}. These Terms of Service govern your use of our website and recruitment services. By accessing our platform or using our services, you agree to comply with and be bound by these terms. If you do not agree, please refrain from using our services.`
    },
    {
      title: "2. Services Provided",
      icon: <FileText size={24} className="text-blue-500" />,
      content: `${COMPANY_NAME} provides recruitment consultancy services, connecting candidates with potential employers in the care, logistics, warehouse, and hospitality sectors. We act as an intermediary and do not guarantee employment for candidates or performance of staff for employers.`
    },
    {
      title: "3. Candidate Responsibilities",
      icon: <CheckCircle size={24} className="text-blue-500" />,
      content: `Candidates must provide accurate, truthful, and complete information during registration. This includes employment history, qualifications, and right-to-work documentation. Any falsification of records may lead to immediate removal from our database.`
    },
    {
      title: "4. Employer Obligations",
      icon: <Shield size={24} className="text-blue-500" />,
      content: `Employers using our services agree to provide accurate job descriptions and adhere to UK employment laws, including health and safety regulations. Fees for placements are governed by separate commercial agreements provided during the consultation phase.`
    },
    {
      title: "5. Data Protection & Privacy",
      icon: <AlertCircle size={24} className="text-blue-500" />,
      content: `We take data privacy seriously and operate in full compliance with the UK General Data Protection Regulation (GDPR). Please refer to our Privacy Policy for details on how we collect, store, and process your personal data.`
    },
    {
      title: "6. Limitation of Liability",
      icon: <Scale size={24} className="text-blue-500" />,
      content: `To the maximum extent permitted by law, ${COMPANY_NAME} shall not be liable for any indirect, incidental, or consequential damages arising from the use of our services or the conduct of candidates/employers placed through our platform.`
    },
    {
      title: "7. Governing Law",
      icon: <FileText size={24} className="text-blue-500" />,
      content: `These terms are governed by the laws of England and Wales. Any disputes arising from these terms shall be subject to the exclusive jurisdiction of the courts of England and Wales.`
    }
  ];

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="relative h-[40vh] flex items-center justify-center min-h-[350px]">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80&w=2000" 
            className="w-full h-full object-cover"
            alt="Terms of Service Background"
          />
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-[2px]"></div>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 text-center text-white">
          <h1 className="text-5xl md:text-7xl font-black mb-6">Terms of Service</h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Updated January 2024. Please read our guidelines for a safe and professional experience.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="space-y-16">
            {sections.map((section, index) => (
              <div key={index} className="flex flex-col md:flex-row gap-8 pb-12 border-b border-slate-100 last:border-0">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center">
                    {section.icon}
                  </div>
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-900 mb-4">{section.title}</h2>
                  <p className="text-lg text-slate-600 leading-relaxed font-medium">
                    {section.content}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Contact Note */}
          <div className="mt-20 p-10 bg-slate-50 rounded-[40px] border border-slate-100 text-center">
            <h3 className="text-2xl font-black mb-4">Have questions about our terms?</h3>
            <p className="text-slate-500 mb-8 font-medium">If you require clarification on any part of our service agreement, please contact our legal team.</p>
            <a 
              href="mailto:legal@promarchconsulting.co.uk" 
              className="inline-block px-10 py-4 rounded-xl font-black text-white shadow-xl hover:opacity-90 transition-all"
              style={{ backgroundColor: COLORS.primary }}
            >
              Contact Legal Dept
            </a>
          </div>
        </div>
      </section>

      {/* Acceptance Section */}
      <section className="py-24 text-white" style={{ backgroundColor: COLORS.primary }}>
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-black mb-8">Committed to Excellence</h2>
          <p className="text-xl text-blue-100 opacity-90 leading-relaxed max-w-2xl mx-auto">
            These terms ensure that both candidates and employers receive the highest standard of service while maintaining professional integrity across the UK workforce.
          </p>
        </div>
      </section>
    </div>
  );
};

export default Terms;