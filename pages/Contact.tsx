import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageCircle, Clock } from 'lucide-react';
import { COMPANY_EMAIL, COMPANY_PHONE, COMPANY_ADDRESS } from '../constants';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Message sent! We'll get back to you shortly.");
  };

  return (
    <div className="pt-20">
      {/* 1. Hero - Centered with Image */}
      <section className="relative h-[60vh] flex items-center justify-center min-h-[500px]">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1423666639041-f56000c27a9a?auto=format&fit=crop&q=80&w=2000" 
            className="w-full h-full object-cover"
            alt="Contact Hero"
          />
          <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-[2px]"></div>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 text-center text-white">
          <h1 className="text-5xl md:text-7xl font-black mb-8">Get In Touch</h1>
          <p className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Whether you're looking for work or seeking to hire, we're here to help you succeed.
          </p>
        </div>
      </section>

      {/* 2. Contact Grid */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-3 gap-12">
          <div className="bg-slate-50 p-10 rounded-[32px] text-center border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Phone size={32} />
            </div>
            <h3 className="text-xl font-bold mb-2">Call Us</h3>
            <p className="text-slate-500 mb-4 text-sm uppercase tracking-widest font-bold">Available 9am - 6pm</p>
            <a href={`tel:${COMPANY_PHONE}`} className="text-2xl font-black text-slate-900 hover:text-blue-600 transition-colors">
              {COMPANY_PHONE}
            </a>
          </div>

          <div className="bg-slate-50 p-10 rounded-[32px] text-center border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Mail size={32} />
            </div>
            <h3 className="text-xl font-bold mb-2">Email Us</h3>
            <p className="text-slate-500 mb-4 text-sm uppercase tracking-widest font-bold">Average response: 2 hrs</p>
            <a href={`mailto:${COMPANY_EMAIL}`} className="text-xl font-black text-slate-900 hover:text-blue-600 transition-colors">
              {COMPANY_EMAIL}
            </a>
          </div>

          <div className="bg-slate-50 p-10 rounded-[32px] text-center border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <MapPin size={32} />
            </div>
            <h3 className="text-xl font-bold mb-2">Office Address</h3>
            <p className="text-slate-500 mb-4 text-sm uppercase tracking-widest font-bold">Visit us in London</p>
            <p className="text-lg font-bold text-slate-900 leading-tight">
              {COMPANY_ADDRESS}
            </p>
          </div>
        </div>
      </section>

      {/* 3. Main Contact Form Section */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-white rounded-[40px] shadow-2xl overflow-hidden grid lg:grid-cols-2 border border-slate-100">
            <div className="p-12 lg:p-20 bg-slate-900 text-white">
              <h2 className="text-4xl font-black mb-8 leading-tight">Send us a message directly.</h2>
              <p className="text-slate-400 text-lg mb-12">
                Have a specific requirement? Fill out the form and our specialized sector lead will contact you.
              </p>
              
              <div className="space-y-8">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-blue-600/20 rounded-lg flex items-center justify-center text-blue-500 flex-shrink-0">
                    <Clock size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold">Operating Hours</h4>
                    <p className="text-slate-400 text-sm">Mon-Fri: 09:00 - 18:00<br/>Sat: 10:00 - 14:00</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-emerald-600/20 rounded-lg flex items-center justify-center text-emerald-500 flex-shrink-0">
                    <MessageCircle size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold">Live Support</h4>
                    <p className="text-slate-400 text-sm">Instant chat available on mobile devices during business hours.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-12 lg:p-20">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Full Name</label>
                    <input 
                      type="text" 
                      required
                      className="w-full px-5 py-4 bg-slate-100 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none transition-all"
                      placeholder="John Doe"
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
                    <input 
                      type="email" 
                      required
                      className="w-full px-5 py-4 bg-slate-100 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none transition-all"
                      placeholder="john@example.com"
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Subject</label>
                  <select className="w-full px-5 py-4 bg-slate-100 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none transition-all">
                    <option>Hiring Staff</option>
                    <option>Looking for a Job</option>
                    <option>Partnership Inquiry</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Your Message</label>
                  <textarea 
                    rows={4}
                    required
                    className="w-full px-5 py-4 bg-slate-100 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none transition-all"
                    placeholder="Tell us more about your needs..."
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                  ></textarea>
                </div>
                <button 
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-xl shadow-lg transition-all flex items-center justify-center space-x-2"
                >
                  <span>Send Message</span>
                  <Send size={18} />
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Map Placeholder */}
      <section className="h-[400px] bg-slate-200 relative">
        <img 
          src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&q=80&w=1200" 
          className="w-full h-full object-cover grayscale brightness-50"
          alt="London Map"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-white p-6 rounded-2xl shadow-xl border border-slate-200 text-center max-w-xs">
            <MapPin className="text-blue-600 mx-auto mb-4" size={32} />
            <h4 className="font-bold text-lg mb-1">Our London Hub</h4>
            <p className="text-slate-500 text-sm">{COMPANY_ADDRESS}</p>
          </div>
        </div>
      </section>

      {/* 5. FAQs / Short Q&A Section */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-black text-center mb-16">Quick Questions</h2>
          <div className="space-y-8">
            {[
              { q: "How quickly can you supply staff?", a: "Typically within 24-48 hours for temporary roles, and 2 weeks for permanent placements." },
              { q: "Are all your candidates DBS checked?", a: "Yes, 100% of our care and hospitality staff undergo rigorous enhanced DBS checks." },
              { q: "Do you offer international recruitment?", a: "We specialize in connecting skilled international care workers with UK sponsors." }
            ].map((faq, i) => (
              <div key={i} className="border-b border-slate-100 pb-8">
                <h4 className="text-lg font-bold mb-3">{faq.q}</h4>
                <p className="text-slate-600">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;