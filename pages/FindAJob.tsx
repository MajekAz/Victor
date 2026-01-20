
import React, { useState } from 'react';
import { Search, MapPin, Briefcase, DollarSign, Clock, ArrowRight, CheckCircle, Upload } from 'lucide-react';

const JOBS_MOCK = [
  { id: 1, title: "Healthcare Assistant", location: "North London", pay: "£14 - £16/hr", type: "Full-time / Temp", category: "Care" },
  { id: 2, title: "Warehouse Operative", location: "Dagenham", pay: "£12.50/hr", type: "Night Shift", category: "Logistics" },
  { id: 3, title: "Registered Nurse", location: "Westminster", pay: "£28 - £35/hr", type: "Permanent", category: "Care" },
  { id: 4, title: "Forklift Driver (Reach)", location: "Enfield", pay: "£15/hr", type: "Contract", category: "Logistics" },
  { id: 5, title: "Commercial Cleaner", location: "City of London", pay: "£11.50/hr", type: "Part-time", category: "Cleaning" },
];

const FindAJob: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="pt-20">
      {/* 1. Hero / Search */}
      <section className="bg-slate-900 pt-32 pb-24 text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="max-w-3xl mb-12">
            <h1 className="text-5xl md:text-7xl font-black mb-6">Your Next <span className="text-blue-500">Career Move</span> Starts Here.</h1>
            <p className="text-xl text-slate-400">Discover hundreds of local opportunities in Care, Logistics, and more.</p>
          </div>
          
          <div className="bg-white p-4 rounded-3xl shadow-2xl flex flex-col md:flex-row gap-4">
            <div className="flex-grow relative">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Job title or keywords..." 
                className="w-full pl-14 pr-6 py-4 bg-slate-50 border-none rounded-2xl text-slate-900 focus:ring-2 focus:ring-blue-600"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex-grow relative">
              <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Location..." 
                className="w-full pl-14 pr-6 py-4 bg-slate-50 border-none rounded-2xl text-slate-900 focus:ring-2 focus:ring-blue-600"
              />
            </div>
            <button className="bg-blue-600 text-white px-10 py-4 rounded-2xl font-black text-lg hover:bg-blue-700 transition-all">
              Find Jobs
            </button>
          </div>
        </div>
      </section>

      {/* 2. Job Listings */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Sidebar Filters */}
            <div className="lg:w-1/4 space-y-8">
              <div>
                <h3 className="text-lg font-black mb-4">Job Categories</h3>
                <div className="space-y-3">
                  {['All Roles', 'Care Sector', 'Warehouse & Logistics', 'Cleaning', 'Hospitality'].map(cat => (
                    <label key={cat} className="flex items-center group cursor-pointer">
                      <input type="checkbox" className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-600 mr-3" />
                      <span className="text-slate-600 group-hover:text-blue-600 transition-colors">{cat}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-lg font-black mb-4">Salary Range</h3>
                <input type="range" className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600" />
                <div className="flex justify-between text-xs font-bold text-slate-500 mt-2">
                  <span>£11/hr</span>
                  <span>£40+/hr</span>
                </div>
              </div>
            </div>

            {/* Job Feed */}
            <div className="lg:w-3/4 space-y-6">
              <div className="flex justify-between items-center mb-8">
                <span className="text-slate-500 font-bold">Showing {JOBS_MOCK.length} available roles</span>
                <select className="bg-transparent border-none font-bold text-blue-600 focus:ring-0">
                  <option>Most Recent</option>
                  <option>Highest Paid</option>
                </select>
              </div>

              {JOBS_MOCK.map(job => (
                <div key={job.id} className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-xl hover:border-blue-200 transition-all group flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full">
                        {job.category}
                      </span>
                      <span className="text-slate-400 text-xs flex items-center">
                        <Clock size={12} className="mr-1" /> Posted 2h ago
                      </span>
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 group-hover:text-blue-600 transition-colors">{job.title}</h3>
                    <div className="flex flex-wrap gap-4 text-slate-500 text-sm font-medium">
                      <span className="flex items-center"><MapPin size={16} className="mr-1.5 text-blue-500" /> {job.location}</span>
                      <span className="flex items-center"><DollarSign size={16} className="mr-1.5 text-blue-500" /> {job.pay}</span>
                      <span className="flex items-center"><Briefcase size={16} className="mr-1.5 text-blue-500" /> {job.type}</span>
                    </div>
                  </div>
                  <button className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-600 transition-all whitespace-nowrap">
                    Apply Now
                  </button>
                </div>
              ))}
              
              <div className="text-center pt-8">
                <button className="text-blue-600 font-black flex items-center justify-center mx-auto hover:underline">
                  Load More Opportunities <ArrowRight size={18} className="ml-2" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Candidate Registration Form */}
      <section className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <div className="bg-blue-600 rounded-[40px] p-12 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
            
            <div className="grid lg:grid-cols-2 gap-16 relative z-10">
              <div>
                <h2 className="text-4xl font-black mb-8">Can't Find Your Role?</h2>
                <p className="text-blue-100 text-lg mb-10">Register your interest and we'll match you with roles that haven't hit the boards yet.</p>
                
                <ul className="space-y-6">
                  {[
                    "Priority access to new listings",
                    "Dedicated recruitment consultant",
                    "Weekly career advice and CV tips",
                    "Instant SMS job alerts"
                  ].map(item => (
                    <li key={item} className="flex items-center font-bold">
                      <CheckCircle size={20} className="mr-3 text-white" /> {item}
                    </li>
                  ))}
                </ul>
              </div>
              
              <form className="bg-white p-10 rounded-3xl text-slate-900 space-y-4 shadow-2xl" onSubmit={e => e.preventDefault()}>
                <h4 className="text-xl font-black mb-6">Quick Registration</h4>
                <input type="text" placeholder="Full Name" className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-blue-600" />
                <input type="email" placeholder="Email Address" className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-blue-600" />
                <select className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-blue-600">
                  <option>Select Preferred Sector</option>
                  <option>Care</option>
                  <option>Warehouse</option>
                  <option>Cleaning</option>
                  <option>Other</option>
                </select>
                <div className="border-2 border-dashed border-slate-200 p-6 rounded-2xl text-center hover:border-blue-400 transition-colors cursor-pointer">
                  <Upload className="mx-auto mb-2 text-slate-400" />
                  <p className="text-sm font-bold text-slate-500">Upload CV (PDF/Word)</p>
                </div>
                <button className="w-full bg-slate-900 text-white py-4 rounded-xl font-black hover:bg-slate-800 transition-all">
                  Get Matched
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FindAJob;
