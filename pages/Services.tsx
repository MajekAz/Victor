import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Zap, Briefcase, FileSearch } from 'lucide-react';
import { SERVICES } from '../constants.tsx';

const Services: React.FC = () => {
  return (
    <div className="pt-20">
      {/* 1. Hero - Centered with Image */}
      <section className="relative h-[60vh] flex items-center justify-center min-h-[500px]">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=2000" 
            className="w-full h-full object-cover"
            alt="Professional Workforce Services"
          />
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[1px]"></div>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 text-center text-white">
          <h1 className="text-4xl md:text-7xl font-black mb-8 text-white">Our Services</h1>
          <p className="text-lg md:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
            Comprehensive workforce solutions across the UK's most critical sectors.
          </p>
        </div>
      </section>

      {/* 2. Recruitment Process */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black mb-4">How We Work</h2>
            <p className="text-slate-600">A seamless process designed for speed and reliability.</p>
          </div>
          <div className="grid md:grid-cols-4 gap-8 relative">
            {[
              { icon: <FileSearch />, title: "Consultation", desc: "We analyze your specific requirements and company culture." },
              { icon: <Briefcase />, title: "Sourcing", desc: "We leverage our deep database and local agency networks." },
              { icon: <ShieldCheck />, title: "Vetting", desc: "Intensive screening, compliance checks, and interviewing." },
              { icon: <Zap />, title: "Placement", desc: "The right person starts on the job within your timeline." }
            ].map((step, i) => (
              <div key={i} className="text-center relative">
                <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  {step.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{step.desc}</p>
                {i < 3 && <div className="hidden lg:block absolute top-8 left-1/2 w-full h-0.5 bg-blue-100 -z-10"></div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Detailed Sectors */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 space-y-24">
          {SERVICES.map((s, i) => (
            <div key={s.id} className={`flex flex-col ${i % 2 !== 0 ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-16 items-center`}>
              <div className="lg:w-1/2">
                <img src={s.image} alt={s.title} className="rounded-3xl shadow-xl w-full h-[400px] object-cover" />
              </div>
              <div className="lg:w-1/2">
                <h2 className="text-3xl md:text-4xl font-black mb-6">{s.title} Solutions</h2>
                <p className="text-lg text-slate-600 mb-8 leading-relaxed">{s.description}</p>
                <ul className="space-y-4 mb-10">
                  <li className="flex items-center text-slate-700">
                    <ShieldCheck className="text-blue-600 mr-3" size={20} /> Full DBS & Reference Checks
                  </li>
                  <li className="flex items-center text-slate-700">
                    <ShieldCheck className="text-blue-600 mr-3" size={20} /> Temporary & Permanent Contracts
                  </li>
                  <li className="flex items-center text-slate-700">
                    <ShieldCheck className="text-blue-600 mr-3" size={20} /> 24/7 Support Line for Employers
                  </li>
                </ul>
                <Link 
                  to="/contact" 
                  className="inline-block bg-slate-900 text-white px-6 py-3 md:px-8 md:py-3 rounded-xl font-bold hover:bg-slate-800 transition-colors"
                >
                  Request Staff for {s.title}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Candidate Services */}
      <section className="py-24 bg-white border-y">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-black mb-8">For Candidates</h2>
              <p className="text-lg text-slate-600 mb-8">Looking for your next role? We provide more than just job listings.</p>
              <div className="grid sm:grid-cols-2 gap-6">
                {[
                  "CV Optimization",
                  "Interview Coaching",
                  "Skill Training",
                  "Compliance Guidance",
                  "Career Roadmapping",
                  "Visa Support Info"
                ].map(item => (
                  <div key={item} className="flex items-center bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <Zap className="text-blue-500 mr-3" size={18} />
                    <span className="font-semibold text-slate-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <img src="https://images.unsplash.com/photo-1521791136064-7986c2923216?auto=format&fit=crop&q=80&w=800" className="rounded-3xl shadow-xl" alt="Candidate Support" />
            </div>
          </div>
        </div>
      </section>

      {/* 5. Sector Expansion Cards */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-black mb-16">Additional Niches</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {['Construction', 'Retail', 'IT Support'].map(niche => (
              <div key={niche} className="bg-white p-10 rounded-3xl border border-slate-200 hover:border-blue-500 transition-colors group text-center">
                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <Briefcase />
                </div>
                <h3 className="text-xl font-bold mb-4">{niche}</h3>
                <p className="text-slate-500">We are expanding our network into {niche} to meet growing London demand.</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Partner CTA */}
      <section className="py-24 bg-slate-900 text-white text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-black mb-8">Scale Your Business with Reliable Staff</h2>
          <p className="text-lg md:text-xl text-slate-400 mb-10">Stop worrying about absenteeism and skills gaps. Partner with us today.</p>
          <Link to="/contact" className="inline-block bg-blue-600 px-6 py-3 md:px-10 md:py-4 rounded-xl font-black text-lg hover:bg-blue-700">
            Enquire Now
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Services;