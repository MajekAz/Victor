import React from 'react';
import { Target, Users, ShieldCheck, Globe, Award, Heart } from 'lucide-react';
import { COMPANY_NAME } from '../constants.tsx';

const About: React.FC = () => {
  return (
    <div className="pt-20">
      {/* 1. Hero Section - Centered with Image */}
      <section className="relative h-[60vh] flex items-center justify-center min-h-[500px]">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=2000" 
            className="w-full h-full object-cover"
            alt="About Hero"
          />
          <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-[1px]"></div>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 text-center text-white">
          <h1 className="text-5xl md:text-7xl font-black mb-8">Our Mission & Values</h1>
          <p className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            At {COMPANY_NAME}, we believe that the right job can transform a life, and the right employee can transform a business.
          </p>
        </div>
      </section>

      {/* 2. Who We Are Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="text-blue-600 font-bold mb-4">ESTABLISHED IN LONDON</div>
              <h2 className="text-4xl font-black text-slate-900 mb-6 leading-tight">Expert Recruitment with a Personal Touch</h2>
              <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                Promarch Consulting started with a simple goal: to make the UK recruitment process fairer, faster, and more reliable for essential service industries.
              </p>
              <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                Based in the heart of London, we have built a reputation for excellence in the care, logistics, and cleaning sectors. We partner with local agencies and top-tier employers to ensure that every placement is a perfect match.
              </p>
              <div className="grid grid-cols-2 gap-6">
                <div className="border-l-4 border-blue-600 pl-4">
                  <div className="text-2xl font-bold">10+ Years</div>
                  <div className="text-sm text-slate-500 font-medium uppercase">Industry Experience</div>
                </div>
                <div className="border-l-4 border-blue-600 pl-4">
                  <div className="text-2xl font-bold">10,000+</div>
                  <div className="text-sm text-slate-500 font-medium uppercase">Candidates Placed</div>
                </div>
              </div>
            </div>
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1000" 
                className="rounded-3xl shadow-2xl relative z-10"
                alt="Our Team"
              />
              <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-blue-100 rounded-full -z-0"></div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Core Values Grid */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 text-center mb-16">
          <h2 className="text-4xl font-black mb-4">Values that Drive Us</h2>
          <p className="text-slate-600 max-w-2xl mx-auto">The principles we live by every single day at {COMPANY_NAME}.</p>
        </div>
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-3 gap-8">
          {[
            { icon: <Target className="text-blue-600" />, title: "Precision", desc: "We match skills to needs with surgical precision, reducing turnover for employers." },
            { icon: <ShieldCheck className="text-emerald-600" />, title: "Integrity", desc: "Transparency is our policy. We are honest about candidates and roles." },
            { icon: <Users className="text-purple-600" />, title: "People-First", desc: "Recruitment is more than data; it's about people and their livelihoods." },
            { icon: <Globe className="text-blue-400" />, title: "Inclusivity", desc: "We support diverse backgrounds and help international talent find UK homes." },
            { icon: <Award className="text-amber-500" />, title: "Excellence", desc: "We strive to be the gold standard in recruitment consultancy." },
            { icon: <Heart className="text-rose-500" />, title: "Community", desc: "Supporting local economies by providing reliable workforce solutions." },
          ].map((v, i) => (
            <div key={i} className="bg-white p-8 rounded-2xl shadow-sm hover:-translate-y-2 transition-transform duration-300 border border-slate-100">
              <div className="mb-4">{v.icon}</div>
              <h3 className="text-xl font-bold mb-2">{v.title}</h3>
              <p className="text-slate-600">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Timeline/Evolution Section */}
      <section className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-4xl font-black text-center mb-16">Our Journey</h2>
          <div className="space-y-12">
            {[
              { year: "2013", title: "Founding", text: "Started as a small firm in London focusing on hospitality staffing." },
              { year: "2016", title: "Expansion", text: "Expanded into the warehouse and logistics sectors across the UK." },
              { year: "2020", title: "Care Crisis Response", text: "Pivoted heavily into the care sector to support local authorities during the pandemic." },
              { year: "2023", title: "Global Reach", text: "Launched our international candidate support program for skilled care workers." }
            ].map((item, i) => (
              <div key={i} className="flex gap-8 items-start">
                <div className="flex-shrink-0 w-24 text-3xl font-black text-blue-600">{item.year}</div>
                <div className="flex-grow pb-12 border-l-2 border-slate-100 pl-8 relative">
                  <div className="absolute top-2 -left-[9px] w-4 h-4 rounded-full bg-blue-600"></div>
                  <h4 className="text-xl font-bold mb-2">{item.title}</h4>
                  <p className="text-slate-600">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Contact CTA */}
      <section className="py-24 bg-slate-900 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-black mb-8">Work with a partner who cares.</h2>
          <button className="bg-blue-600 px-8 py-4 rounded-xl font-black text-lg hover:bg-blue-700 transition-all">
            Join the Promarch Family
          </button>
        </div>
      </section>
    </div>
  );
};

export default About;