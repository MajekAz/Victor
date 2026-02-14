import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Briefcase, 
  ShieldCheck, 
  Zap, 
  TrendingUp, 
  CheckCircle, 
  Search, 
  Users, 
  Clock,
  ArrowRight
} from 'lucide-react';
import { SERVICES } from '../constants.tsx';

const HireTalent: React.FC = () => {
  const [formData, setFormData] = useState({
    companyName: '',
    contactName: '',
    email: '',
    phone: '',
    sector: '',
    staffCount: '1-5',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Requirement submitted successfully. Our sector specialist will contact you within 2 hours.");
  };

  return (
    <div className="pt-20">
      {/* 1. Hero Section */}
      <section className="relative h-[70vh] flex items-center min-h-[600px] overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=2000" 
            className="w-full h-full object-cover"
            alt="Business Professionals"
          />
          <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-[2px]"></div>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="inline-block bg-blue-600 px-4 py-1 rounded-lg text-white font-bold text-sm mb-6 uppercase tracking-widest">
              For Employers & HR Teams
            </span>
            <h1 className="text-5xl md:text-7xl font-black text-white leading-tight mb-8">
              Build Your <span className="text-blue-500">A-Team</span> Today.
            </h1>
            <p className="text-xl text-slate-300 mb-10 leading-relaxed">
              Stop settling for average. Promarch Consulting delivers pre-vetted, reliable, and highly skilled staff across the UK's most critical sectors.
            </p>
            <div className="flex space-x-4">
              <Link to="/contact" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-black text-lg transition-all shadow-xl shadow-blue-900/20 text-center">
                Request Staff Now
              </Link>
              <Link to="/about" className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/20 px-8 py-4 rounded-xl font-black text-lg transition-all text-center">
                Why Us?
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Strategic Advantages */}
      <section id="why-choose-us" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-12">
            {[
              { 
                icon: <Zap className="text-blue-600" />, 
                title: "Speed to Placement", 
                desc: "Average placement time under 48 hours for temporary staff and 2 weeks for permanent roles." 
              },
              { 
                icon: <ShieldCheck className="text-emerald-600" />, 
                title: "100% Compliance", 
                desc: "Enhanced DBS, right-to-work checks, and comprehensive reference verification as standard." 
              },
              { 
                icon: <TrendingUp className="text-purple-600" />, 
                title: "Retention Focused", 
                desc: "We match candidates based on culture and long-term fit, reducing your churn and training costs." 
              }
            ].map((item, i) => (
              <div key={i} className="bg-slate-50 p-10 rounded-[40px] border border-slate-100 group hover:bg-white hover:shadow-2xl transition-all duration-500">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-8 shadow-sm group-hover:scale-110 transition-transform">
                  {item.icon}
                </div>
                <h3 className="text-2xl font-black mb-4">{item.title}</h3>
                <p className="text-slate-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Sectors of Expertise */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black mb-4">Choose Your Sector</h2>
            <p className="text-slate-600">Specialized teams for specialized needs.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {SERVICES.map((s) => (
              <div key={s.id} className="bg-white p-8 rounded-3xl border border-slate-200 hover:border-blue-500 transition-all group">
                <h4 className="text-xl font-bold mb-4">{s.title}</h4>
                <p className="text-sm text-slate-500 mb-6">{s.description}</p>
                <ul className="space-y-3">
                  <li className="flex items-center text-xs font-bold text-slate-700">
                    <CheckCircle size={14} className="text-blue-500 mr-2" /> Vetted Candidates
                  </li>
                  <li className="flex items-center text-xs font-bold text-slate-700">
                    <CheckCircle size={14} className="text-blue-500 mr-2" /> 24/7 Availability
                  </li>
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. The Vetting Process */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            <div className="lg:w-1/2">
              <h2 className="text-4xl font-black mb-8">Rigorous Vetting as Standard</h2>
              <p className="text-lg text-slate-600 mb-10">
                We don't just send CVs; we send solutions. Every candidate in our database has undergone a strict multi-stage verification process.
              </p>
              <div className="space-y-8">
                {[
                  { icon: <Search />, title: "Initial Screen", desc: "Detailed CV review and initial phone screening for role alignment." },
                  { icon: <Users />, title: "Face-to-Face Interview", desc: "Digital or in-person interviews to assess soft skills and reliability." },
                  { icon: <ShieldCheck />, title: "Document Verification", desc: "DBS, Right to Work, and Qualifications are verified via official channels." },
                  { icon: <Clock />, title: "Reference Checks", desc: "Minimum of two professional references checked manually by our team." }
                ].map((step, i) => (
                  <div key={i} className="flex gap-6">
                    <div className="flex-shrink-0 w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                      {step.icon}
                    </div>
                    <div>
                      <h4 className="font-bold text-lg">{step.title}</h4>
                      <p className="text-slate-500">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="lg:w-1/2 relative">
              <div className="relative z-10 rounded-[40px] overflow-hidden shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=1200" 
                  alt="Professional Vetting and Interview Process" 
                  className="w-full h-auto object-cover"
                />
              </div>
              <div className="absolute -top-10 -right-10 w-64 h-64 bg-blue-100 rounded-full -z-0 blur-2xl"></div>
              <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-purple-100 rounded-full -z-0 blur-2xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Request Talent Form */}
      <section id="request-talent" className="py-24 bg-slate-900">
        <div className="max-w-5xl mx-auto px-4">
          <div className="bg-white rounded-[40px] shadow-2xl overflow-hidden grid lg:grid-cols-5">
            <div className="lg:col-span-2 bg-blue-600 p-12 text-white flex flex-col justify-center">
              <h2 className="text-3xl font-black mb-6">Let's Find Your Staff</h2>
              <p className="text-blue-100 mb-10">
                Fill out your basic requirements and our sector lead will give you a callback with a tailored staffing quote.
              </p>
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <Clock size={18} />
                  </div>
                  <span className="font-bold">2-Hour Response Time</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <Briefcase size={18} />
                  </div>
                  <span className="font-bold">Tailored Pricing Models</span>
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-3 p-12">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Company Name</label>
                    <input 
                      type="text" 
                      required 
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none" 
                      placeholder="Acme Corp"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Contact Person</label>
                    <input 
                      type="text" 
                      required 
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none" 
                      placeholder="Jane Smith"
                    />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Work Email</label>
                    <input 
                      type="email" 
                      required 
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none" 
                      placeholder="hr@acme.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Phone Number</label>
                    <input 
                      type="tel" 
                      required 
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none" 
                      placeholder="+44"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Sector</label>
                  <select className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none appearance-none">
                    <option>Care Sector</option>
                    <option>Logistics & Warehouse</option>
                    <option>Cleaning Services</option>
                    <option>Hospitality</option>
                    <option>Other / Multiple</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Brief Requirements</label>
                  <textarea 
                    rows={3} 
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none" 
                    placeholder="E.g. We need 10 warehouse operatives for a 3-month contract..."
                  ></textarea>
                </div>
                <button type="submit" className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-xl hover:bg-slate-800 transition-all shadow-xl">
                  Submit Requirement
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* 6. FAQ Section */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-black text-center mb-16">Employer FAQs</h2>
          <div className="space-y-6">
            {[
              { q: "What are your fees?", a: "We offer competitive margin-based pricing for temporary roles and percentage-based fees for permanent placements. Contact us for a custom rate card." },
              { q: "Do you handle payroll?", a: "Yes, for temporary staff, we manage all PAYE, NI contributions, and pension requirements directly." },
              { q: "What happens if a candidate isn't the right fit?", a: "We offer a 'Replacement Guarantee' for permanent roles and immediate swap-outs for temporary staff if they don't meet your standards." }
            ].map((faq, i) => (
              <div key={i} className="p-8 bg-slate-50 rounded-3xl border border-slate-100">
                <h4 className="text-lg font-bold mb-3 flex items-center">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
                  {faq.q}
                </h4>
                <p className="text-slate-600 leading-relaxed pl-5">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HireTalent;