import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, ArrowRight, Star } from 'lucide-react';

const ContactSuccess: React.FC = () => {
  return (
    <div className="pt-20">
      {/* 1. Hero Confirmation */}
      <section className="bg-slate-900 min-h-[50vh] flex flex-col items-center justify-center text-center px-4 py-20 relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-600/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
        
        <div className="relative z-10 max-w-2xl mx-auto animate-fade-in-up">
          <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl">
            <CheckCircle size={48} className="text-white" />
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white mb-6">Message Sent!</h1>
          <p className="text-xl text-slate-300 mb-10 leading-relaxed">
            Thank you for reaching out to Promarch Consulting. Our team has received your inquiry and will respond within 24 hours.
          </p>
          <Link 
            to="/" 
            className="inline-flex items-center bg-blue-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-500/30"
          >
            Return to Home <ArrowRight className="ml-2" size={20} />
          </Link>
        </div>
      </section>

      {/* 2. Success Story Section */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <span className="text-blue-600 font-black tracking-widest uppercase text-sm">Client Success Story</span>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 mt-2">See what's possible with Promarch.</h2>
          </div>

          <div className="bg-slate-50 rounded-[40px] p-8 md:p-12 flex flex-col lg:flex-row items-center gap-12 border border-slate-100 shadow-xl">
            <div className="lg:w-1/2">
               <img 
                 src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=1200" 
                 alt="Success Story - Care Home Team" 
                 className="rounded-3xl shadow-lg w-full object-cover h-[400px]"
               />
            </div>
            <div className="lg:w-1/2 space-y-6">
              <div className="flex gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => <Star key={i} fill="currentColor" size={24} />)}
              </div>
              <blockquote className="text-2xl font-bold text-slate-800 leading-relaxed">
                "Promarch didn't just fill positions; they understood our culture. The staff they provided have become the backbone of our senior care wing."
              </blockquote>
              <div>
                <div className="font-black text-lg text-slate-900">Sarah Jenkins</div>
                <div className="text-slate-500 font-medium">Operations Director, Sunrise Care Homes</div>
              </div>
              <div className="pt-6 border-t border-slate-200 grid grid-cols-2 gap-8">
                <div>
                   <div className="text-3xl font-black text-blue-600">48h</div>
                   <div className="text-sm text-slate-500 font-bold uppercase">Time to Fill</div>
                </div>
                <div>
                   <div className="text-3xl font-black text-blue-600">100%</div>
                   <div className="text-sm text-slate-500 font-bold uppercase">Retention Rate</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactSuccess;