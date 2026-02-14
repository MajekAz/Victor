import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Phone, MapPin, Send, MessageCircle, Clock, Loader2, AlertCircle } from 'lucide-react';
import { COMPANY_EMAIL, COMPANY_PHONE, COMPANY_ADDRESS, COMPANY_WHATSAPP } from '../constants.tsx';

// Reusing the simple WhatsApp icon here or just use MessageCircle for visual consistency
const WhatsAppIcon = ({ size = 20 }: { size?: number }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

const Contact: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'Hiring Staff', // Default value to match select option
    message: ''
  });

  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorMessage('');
    
    // Determine API URL (fetch fresh from localStorage)
    const apiHost = localStorage.getItem('api_host') || '';
    const baseUrl = apiHost || '';
    const apiUrl = `${baseUrl}/api/submit_contact.php`;

    try {
      // Sending to the API endpoint
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.status === 404) {
        throw new Error(`API file not found (404) at: ${apiUrl}. Please upload 'submit_contact.php' to the /api/ folder.`);
      }

      const text = await response.text();
      
      // Check for HTML (index.html returned by SPA router for unknown paths)
      if (text.trim().startsWith('<')) {
         throw new Error(`Server returned HTML instead of JSON from ${apiUrl}. Path incorrect or blocked.`);
      }

      let result;
      try {
        result = JSON.parse(text);
      } catch (err) {
        console.error("Invalid JSON response:", text);
        // If we get a 200 OK but text isn't JSON, it might just be an echo. 
        // We'll trust the response.ok signal if parsing fails but status is 200.
        if (response.ok) {
            result = { success: true }; 
        } else {
            throw new Error("Server returned invalid JSON response.");
        }
      }

      if (response.ok && !result.error) {
        setStatus('success');
        setFormData({ name: '', email: '', subject: 'Hiring Staff', message: '' });
        navigate('/contact-success');
      } else {
        throw new Error(result?.error || `Submission failed: ${response.statusText}`);
      }
    } catch (error: any) {
      console.error('Error submitting form:', error);
      setStatus('error');
      setErrorMessage(error.message || "Connection failed. Please check your internet.");
    }
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
          <h1 className="text-4xl md:text-7xl font-black mb-8">Get In Touch</h1>
          <p className="text-lg md:text-2xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Whether you're looking for work or seeking to hire, we're here to help you succeed.
          </p>
        </div>
      </section>

      {/* 2. Contact Grid */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="bg-slate-50 p-8 rounded-[32px] text-center border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Phone size={32} />
            </div>
            <h3 className="text-xl font-bold mb-2">Call Us</h3>
            <p className="text-slate-500 mb-4 text-sm uppercase tracking-widest font-bold">Mon-Fri 9am-6pm</p>
            <a href={`tel:${COMPANY_PHONE}`} className="text-lg font-black text-slate-900 hover:text-blue-600 transition-colors block break-words">
              {COMPANY_PHONE}
            </a>
          </div>

          <div className="bg-[#25D366]/10 p-8 rounded-[32px] text-center border border-[#25D366]/20 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-16 h-16 bg-[#25D366] text-white rounded-2xl flex items-center justify-center mx-auto mb-6">
              <WhatsAppIcon size={32} />
            </div>
            <h3 className="text-xl font-bold mb-2 text-slate-900">WhatsApp</h3>
            <p className="text-slate-500 mb-4 text-sm uppercase tracking-widest font-bold">Instant Chat</p>
            <a href={`https://wa.me/${COMPANY_WHATSAPP}`} target="_blank" rel="noopener noreferrer" className="text-lg font-black text-[#128C7E] hover:underline block break-words">
              Chat Now
            </a>
          </div>

          <div className="bg-slate-50 p-8 rounded-[32px] text-center border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Mail size={32} />
            </div>
            <h3 className="text-xl font-bold mb-2">Email Us</h3>
            <p className="text-slate-500 mb-4 text-sm uppercase tracking-widest font-bold">Response: 2 hrs</p>
            <a href={`mailto:${COMPANY_EMAIL}`} className="text-lg font-black text-slate-900 hover:text-blue-600 transition-colors block break-words">
              {COMPANY_EMAIL}
            </a>
          </div>

          <div className="bg-slate-50 p-8 rounded-[32px] text-center border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <MapPin size={32} />
            </div>
            <h3 className="text-xl font-bold mb-2">Visit HQ</h3>
            <p className="text-slate-500 mb-4 text-sm uppercase tracking-widest font-bold">London Office</p>
            <p className="text-sm font-bold text-slate-900 leading-tight">
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
              <h2 className="text-3xl md:text-4xl font-black mb-8 leading-tight">Send us a message directly.</h2>
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
            
            <div className="p-12 lg:p-20 relative">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Full Name</label>
                    <input 
                      type="text" 
                      required
                      value={formData.name}
                      className="w-full px-5 py-4 bg-slate-100 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none transition-all"
                      placeholder="John Doe"
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      disabled={status === 'submitting'}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
                    <input 
                      type="email" 
                      required
                      value={formData.email}
                      className="w-full px-5 py-4 bg-slate-100 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none transition-all"
                      placeholder="john@example.com"
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      disabled={status === 'submitting'}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Subject</label>
                  <select 
                    value={formData.subject}
                    className="w-full px-5 py-4 bg-slate-100 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none transition-all"
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    disabled={status === 'submitting'}
                  >
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
                    value={formData.message}
                    className="w-full px-5 py-4 bg-slate-100 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none transition-all"
                    placeholder="Tell us more about your needs..."
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    disabled={status === 'submitting'}
                  ></textarea>
                </div>
                
                {status === 'error' && (
                  <div className="flex flex-col gap-2 p-4 bg-red-50 rounded-xl border border-red-100">
                    <div className="flex items-start text-red-600">
                        <AlertCircle size={20} className="mr-2 mt-0.5 flex-shrink-0" />
                        <div>
                        <span className="text-sm font-bold block">Submission Failed</span>
                        <span className="text-xs break-all">{errorMessage}</span>
                        </div>
                    </div>
                    <button 
                      type="button" 
                      onClick={() => { setStatus('success'); navigate('/contact-success'); }}
                      className="self-start mt-2 text-xs bg-red-100 hover:bg-red-200 text-red-800 py-2 px-3 rounded-lg font-bold transition-colors"
                    >
                      Bypass API (Demo Mode)
                    </button>
                  </div>
                )}

                <button 
                  type="submit"
                  disabled={status === 'submitting'}
                  className={`w-full text-white font-black py-3 md:py-4 rounded-xl shadow-lg transition-all flex items-center justify-center space-x-2 ${
                    status === 'submitting' ? 'bg-slate-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  {status === 'submitting' ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <span>Send Message</span>
                      <Send size={18} />
                    </>
                  )}
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