import React, { useState } from 'react';
import { ShieldCheck, Zap, TrendingUp, Users, Building2, Globe, Clock, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const ForEmployer: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    company: '',
    email: '',
    phone: '',
    sector: 'Care'
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorMessage('');

    const apiHost = localStorage.getItem('api_host') || '';
    const apiUrl = `${apiHost}/api/submit_contact.php`;
    
    const payload = {
      name: formData.company,
      email: formData.email,
      subject: `Employer Callback: ${formData.company}`,
      message: `Employer callback request.\n\nCompany: ${formData.company}\nSector: ${formData.sector}\nPhone: ${formData.phone}\nEmail: ${formData.email}`
    };

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.status === 404) throw new Error(`API file not found (404) at: ${apiUrl}`);
      
      const text = await response.text();
      if (text.trim().startsWith('<')) throw new Error("Server returned HTML. API path likely incorrect.");

      try {
        const result = JSON.parse(text);
        if (response.ok && !result.error) {
          setStatus('success');
          navigate('/contact-success');
        } else {
          throw new Error(result.error || "Submission failed");
        }
      } catch (e) {
         if (response.ok) {
             setStatus('success'); 
             navigate('/contact-success');
        } else {
             throw e;
        }
      }
    } catch (error: any) {
      console.error(error);
      setStatus('error');
      setErrorMessage(error.message || "Connection failed.");
    }
  };

  return (
    <div className="pt-20">
      {/* 1. Hero Section */}
      <section className="relative h-[80vh] flex items-center min-h-[600px]">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=2000" 
            className="w-full h-full object-cover"
            alt="Corporate Office"
          />
          <div className="absolute inset-0 bg-slate-900/75 backdrop-blur-[1px]"></div>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4">
          <div className="max-w-3xl">
            <span className="text-blue-500 font-black tracking-widest uppercase mb-4 block">Workforce Solutions</span>
            <h1 className="text-4xl md:text-8xl font-black text-white leading-tight mb-8">Reliable Talent. <br /><span className="text-blue-500">Zero Headache.</span></h1>
            <p className="text-lg md:text-xl text-slate-300 mb-10 leading-relaxed">
              From last-minute warehouse staffing to permanent care home management, Promarch Consulting provides the compliant workforce you need to scale.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/hire-talent" className="bg-blue-600 text-white px-6 py-3 md:px-10 md:py-4 rounded-xl font-black text-base md:text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-900/40">
                Request Staff Call
              </Link>
              <a href="#sectors" className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-6 py-3 md:px-10 md:py-4 rounded-xl font-black text-base md:text-lg hover:bg-white/20 transition-all">
                Our Sectors
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Key Pillars */}
      <section className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-16">
            <div className="space-y-6">
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                <ShieldCheck size={32} />
              </div>
              <h3 className="text-2xl font-black">Pre-Vetted & Compliant</h3>
              <p className="text-slate-600 leading-relaxed">
                We handle all DBS, Right-to-Work, and Reference checks. You only interview the candidates that are ready to start.
              </p>
            </div>
            <div className="space-y-6">
              <div className="w-16 h-16 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center">
                <Zap size={32} />
              </div>
              <h3 className="text-2xl font-black">Fast Response Time</h3>
              <p className="text-slate-600 leading-relaxed">
                Our deep database of local candidates allows us to fill temporary gaps often in under 4 hours.
              </p>
            </div>
            <div className="space-y-6">
              <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
                <TrendingUp size={32} />
              </div>
              <h3 className="text-2xl font-black">Scalable Pricing</h3>
              <p className="text-slate-600 leading-relaxed">
                Competitive PAYE margin rates for temps and transparent fixed-fee models for permanent placements.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Industry Showcase */}
      <section id="sectors" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-4xl font-black mb-4">Sectors We Empower</h2>
            <p className="text-slate-500">Deep expertise in the UK's most essential workforce sectors.</p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-12">
            {[
              { 
                title: "Health & Social Care", 
                img: "https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&q=80&w=1000",
                features: ["Enhanced DBS Vetting", "Sponsorship Support", "Temp-to-Perm Options"]
              },
              { 
                title: "Logistics & Warehousing", 
                img: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=1000",
                features: ["Forklift Certified Drivers", "Warehouse Operatives", "Inventory Managers"]
              }
            ].map((sector, i) => (
              <div key={i} className="bg-white rounded-[40px] overflow-hidden shadow-sm border border-slate-100 flex flex-col md:flex-row h-full">
                <div className="md:w-1/2">
                  <img src={sector.img} className="h-full w-full object-cover" alt={sector.title} />
                </div>
                <div className="md:w-1/2 p-10 flex flex-col justify-center">
                  <h3 className="text-3xl font-black mb-6">{sector.title}</h3>
                  <ul className="space-y-4 mb-8">
                    {sector.features.map(f => (
                      <li key={f} className="flex items-center text-slate-700 font-bold">
                        <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-3"></span> {f}
                      </li>
                    ))}
                  </ul>
                  <Link to="/contact" className="text-blue-600 font-black flex items-center hover:translate-x-1 transition-transform">
                    Discuss Requirements <ArrowRight size={18} className="ml-2" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Statistics Section */}
      <section className="py-24 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 lg:grid-cols-4 gap-12 text-center">
          <div>
            <div className="bg-blue-600/20 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Users className="text-blue-500" />
            </div>
            <h4 className="text-3xl md:text-4xl font-black mb-2">15,000+</h4>
            <p className="text-slate-400 font-bold uppercase text-xs tracking-widest">Available Temps</p>
          </div>
          <div>
            <div className="bg-purple-600/20 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Building2 className="text-purple-500" />
            </div>
            <h4 className="text-3xl md:text-4xl font-black mb-2">250+</h4>
            <p className="text-slate-400 font-bold uppercase text-xs tracking-widest">Active Clients</p>
          </div>
          <div>
            <div className="bg-emerald-600/20 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Clock className="text-emerald-500" />
            </div>
            <h4 className="text-3xl md:text-4xl font-black mb-2">2 hrs</h4>
            <p className="text-slate-400 font-bold uppercase text-xs tracking-widest">Avg Response Time</p>
          </div>
          <div>
            <div className="bg-blue-600/20 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Globe className="text-blue-500" />
            </div>
            <h4 className="text-3xl md:text-4xl font-black mb-2">London</h4>
            <p className="text-slate-400 font-bold uppercase text-xs tracking-widest">HQ Location</p>
          </div>
        </div>
      </section>

      {/* 5. Partnership CTA */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-black mb-8">Ready to secure your workforce?</h2>
          <p className="text-xl text-slate-500 mb-12">Join hundreds of London-based companies that rely on Promarch for their growth.</p>
          <div className="bg-slate-50 p-12 rounded-[40px] border border-slate-100 shadow-xl">
            <h4 className="text-2xl font-black mb-8">Request a Callback</h4>
            <form className="grid md:grid-cols-2 gap-6" onSubmit={handleSubmit}>
              <input 
                type="text" 
                placeholder="Company Name" 
                required
                value={formData.company}
                onChange={(e) => setFormData({...formData, company: e.target.value})}
                className="w-full px-6 py-4 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-600" 
                disabled={status === 'submitting'}
              />
              <input 
                type="text" 
                placeholder="Work Email" 
                required
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full px-6 py-4 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-600" 
                disabled={status === 'submitting'}
              />
              <input 
                type="tel" 
                placeholder="Phone Number" 
                required
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="w-full px-6 py-4 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-600" 
                disabled={status === 'submitting'}
              />
              <select 
                value={formData.sector}
                onChange={(e) => setFormData({...formData, sector: e.target.value})}
                className="w-full px-6 py-4 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-600"
                disabled={status === 'submitting'}
              >
                <option value="Care">Care</option>
                <option value="Logistics">Logistics</option>
                <option value="Hospitality">Hospitality</option>
              </select>

              {status === 'error' && (
                  <div className="md:col-span-2 flex flex-col gap-2 p-3 bg-red-50 text-red-600 rounded-lg text-sm border border-red-100">
                    <div className="flex items-center justify-center font-bold">
                       <AlertCircle size={16} className="mr-2" /> Error
                    </div>
                    <span className="break-all text-xs">{errorMessage}</span>
                    <button 
                      type="button" 
                      onClick={() => { setStatus('success'); navigate('/contact-success'); }}
                      className="mt-1 text-xs bg-red-100 hover:bg-red-200 text-red-800 py-2 px-3 rounded font-bold transition-colors mx-auto"
                    >
                      Bypass API (Demo Mode)
                    </button>
                  </div>
              )}

              <button 
                type="submit" 
                disabled={status === 'submitting'}
                className="md:col-span-2 bg-blue-600 text-white py-3 md:py-5 rounded-2xl font-black text-lg md:text-xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-900/20 flex items-center justify-center"
              >
                {status === 'submitting' ? <Loader2 className="animate-spin" /> : "Connect with an Expert"}
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ForEmployer;