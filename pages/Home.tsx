import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, Users, Zap, HeartPulse, Truck, Sparkles, Utensils, Briefcase } from 'lucide-react';
import { SERVICES, COLORS } from '../constants.tsx';
import { Job } from '../types.ts';
import { JobService } from '../services/jobService.ts';
import { JobCard } from '../components/JobCard.tsx';

const Home: React.FC = () => {
  const [latestJobs, setLatestJobs] = useState<Job[]>([]);
  const [isLoadingJobs, setIsLoadingJobs] = useState<boolean>(true);

  useEffect(() => {
    const fetchLatestJobs = async () => {
      try {
        const res = await JobService.getJobs({ limit: 3, sortBy: 'newest' });
        setLatestJobs(res.jobs);
      } catch (e) {
        console.error('Failed to fetch home vacancies:', e);
      } finally {
        setIsLoadingJobs(false);
      }
    };
    fetchLatestJobs();
  }, []);

  const iconMap: Record<string, React.ReactNode> = {
    HeartPulse: <HeartPulse size={24} />,
    Truck: <Truck size={24} />,
    Sparkles: <Sparkles size={24} />,
    Utensils: <Utensils size={24} />,
  };

  return (
    <div className="overflow-hidden font-sans">
      {/* 1. Hero Section */}
      <section className="relative h-screen flex items-center justify-center pt-20">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&q=80&w=2000" 
            className="w-full h-full object-cover"
            alt="Hero Background"
          />
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px]"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white text-center">
          <div className="max-w-4xl mx-auto animate-fade-in-up">
            <span 
              className="inline-block backdrop-blur-md border px-4 py-1.5 rounded-full text-sm font-bold mb-6"
              style={{ backgroundColor: `${COLORS.primary}80`, borderColor: COLORS.secondary }}
            >
              Recruitment Specialists - London, UK
            </span>
            <h1 className="text-4xl md:text-8xl font-[900] leading-tight mb-8">
              Connecting <span style={{ color: COLORS.secondary }}>Talent</span> <br className="hidden md:block" /> with Opportunity.
            </h1>
            <p className="text-lg md:text-2xl text-slate-200 mb-10 leading-relaxed max-w-2xl mx-auto font-medium">
              We help candidates find reliable jobs and connect employers with the best talent in the Care, Warehouse, Logistics, and Hospitality sectors.
            </p>
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 justify-center">
              <Link 
                to="/book-consultation" 
                className="text-white px-6 py-3 md:px-8 md:py-4 rounded-xl font-black text-base md:text-lg transition-all flex items-center justify-center shadow-2xl hover:opacity-90"
                style={{ backgroundColor: COLORS.primary }}
              >
                Book Consultation / Apply <ArrowRight className="ml-2" size={18} />
              </Link>
              <Link 
                to="/jobs" 
                className="text-slate-900 bg-white px-6 py-3 md:px-8 md:py-4 rounded-xl font-black text-base md:text-lg transition-all flex items-center justify-center shadow-lg hover:bg-slate-100"
              >
                Find a Job
              </Link>
              <Link 
                to="/for-employer" 
                className="text-white px-6 py-3 md:px-8 md:py-4 rounded-xl font-black text-base md:text-lg transition-all shadow-lg border border-white/20 hover:opacity-90 flex items-center justify-center" 
                style={{ backgroundColor: COLORS.secondary }}
              >
                For Employers
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Key Stats */}
      <section className="bg-white py-12 border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl md:text-4xl font-black mb-2" style={{ color: COLORS.primary }}>500+</div>
              <div className="text-slate-500 font-medium">Placements/Month</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-black mb-2" style={{ color: COLORS.primary }}>150+</div>
              <div className="text-slate-500 font-medium">Partner Employers</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-black mb-2" style={{ color: COLORS.primary }}>98%</div>
              <div className="text-slate-500 font-medium">Satisfaction Rate</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-black mb-2" style={{ color: COLORS.primary }}>24/7</div>
              <div className="text-slate-500 font-medium">Client Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Featured & Latest Job Vacancies Section */}
      <section className="py-24 bg-slate-100" id="home-latest-jobs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-xs font-black uppercase tracking-widest text-blue-600 block mb-2">
                Live Opportunities
              </span>
              <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
                Latest Job Vacancies
              </h2>
              <p className="text-base text-slate-600 font-medium mt-1">
                Explore recently added opportunities across London & the UK.
              </p>
            </div>

            <Link
              to="/jobs"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-slate-900 hover:bg-blue-600 text-white text-xs font-black uppercase tracking-wider transition-all shadow-md self-start md:self-auto"
            >
              <span>View All Vacancies</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          {isLoadingJobs ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-3xl p-7 border border-slate-200 shadow-xs animate-pulse h-96"></div>
              ))}
            </div>
          ) : latestJobs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {latestJobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-10 text-center border border-slate-200">
              <p className="text-sm font-semibold text-slate-500">No active vacancies currently posted. Check back shortly!</p>
            </div>
          )}
        </div>
      </section>

      {/* 4. Services Overview */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">Our Expertise</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              We specialize in sectors where reliability and skill are non-negotiable.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {SERVICES.map((service) => (
              <Link 
                key={service.id} 
                to="/services" 
                className="group block bg-white rounded-3xl overflow-hidden hover:shadow-xl transition-all duration-300 border border-slate-100 hover:border-blue-200"
              >
                <div className="h-48 overflow-hidden relative">
                  <img 
                    src={service.image} 
                    alt={service.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-transparent transition-colors"></div>
                  <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur p-3 rounded-xl shadow-lg text-blue-600">
                    {iconMap[service.icon]}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-3 text-slate-900 group-hover:text-blue-600 transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-slate-500 text-sm leading-relaxed mb-4 line-clamp-3">
                    {service.description}
                  </p>
                  <div className="flex items-center text-blue-600 font-bold text-sm">
                    Learn More <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Features */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-6">Why Partner with Promarch?</h2>
          <p className="text-lg text-slate-600 mb-16 max-w-3xl mx-auto">Reliability, speed, and quality vetting are at the core of everything we do.</p>

          <div className="grid md:grid-cols-3 gap-12">
            {[
              { icon: <Users size={32} />, title: "Specialized Talent Pool", desc: "We focus on specific niches, ensuring we have the right candidates ready at short notice." },
              { icon: <CheckCircle size={32} />, title: "Rigorous Vetting", desc: "Every candidate undergoes background checks and skills assessment before placement." },
              { icon: <Zap size={32} />, title: "Rapid Turnaround", desc: "Need staff tomorrow? Our automated system and deep database make it happen." }
            ].map((feature, i) => (
              <div key={i} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-xl transition-all group text-left">
                <div 
                  className="w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:text-white transition-all"
                  style={{ backgroundColor: `${COLORS.secondary}15`, color: COLORS.primary }}
                >
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-4 text-slate-900">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed font-normal">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Call to Action */}
      <section className="py-24" style={{ backgroundColor: COLORS.primary }}>
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-8">Ready for your next career move?</h2>
          <p className="text-xl text-blue-100 mb-12 max-w-3xl mx-auto font-medium">
            Join thousands of professionals already thriving with Promarch Consulting.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
            <Link 
              to="/book-consultation" 
              className="bg-white px-6 py-3 md:px-8 md:py-4 rounded-xl font-black text-base md:text-lg hover:bg-slate-50 transition-all shadow-lg text-slate-900 flex items-center justify-center gap-2" 
            >
              <span>Book Consultation</span>
              <ArrowRight size={18} />
            </Link>
            <Link 
              to="/jobs" 
              className="text-white bg-slate-900/40 border border-white/30 px-6 py-3 md:px-8 md:py-4 rounded-xl font-black text-base md:text-lg hover:bg-slate-900/60 transition-all shadow-lg flex items-center justify-center" 
            >
              Search Jobs
            </Link>
            <Link 
              to="/for-employer" 
              className="text-white px-6 py-3 md:px-8 md:py-4 rounded-xl font-black text-base md:text-lg transition-all shadow-lg border border-white/20 hover:opacity-90 flex items-center justify-center" 
              style={{ backgroundColor: COLORS.secondary }}
            >
              Hire Staff
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
