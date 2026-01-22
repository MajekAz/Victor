import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, ArrowRight, Tag } from 'lucide-react';
import { BLOG_POSTS, COLORS } from '../constants.tsx';

const Blog: React.FC = () => {
  // Use the first post as the featured post for the hero area
  const featuredPost = BLOG_POSTS[0];
  const gridPosts = BLOG_POSTS;

  return (
    <div className="pt-20">
      {/* 1. Hero - Updated high-impact image */}
      <section className="relative h-[60vh] flex items-center justify-center min-h-[500px]">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80&w=2000" 
            className="w-full h-full object-cover"
            alt="Insights Hero"
          />
          <div className="absolute inset-0 bg-slate-900/75 backdrop-blur-[2px]"></div>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 text-center text-white">
          <h1 className="text-5xl md:text-7xl font-black mb-8">Industry Insights</h1>
          <p className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto leading-relaxed font-medium">
            Expert perspectives on the UK's evolving workforce and recruitment landscape.
          </p>
        </div>
      </section>

      {/* 2. Featured Post - Enhanced visual presence */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-0 bg-slate-900 rounded-[40px] overflow-hidden shadow-2xl border border-slate-800">
            <div className="lg:w-3/5 h-[500px] relative">
              <img 
                src={featuredPost.image} 
                className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity duration-500"
                alt="Featured Post"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-slate-900/40 to-transparent lg:hidden"></div>
            </div>
            <div className="lg:w-2/5 p-12 lg:p-16 flex flex-col justify-center text-white">
              <span className="font-black text-xs uppercase tracking-[0.25em] mb-6 flex items-center" style={{ color: COLORS.secondary }}>
                <span className="w-8 h-px bg-current mr-3"></span> Featured Story
              </span>
              <h2 className="text-3xl md:text-4xl font-black mb-6 leading-tight">{featuredPost.title}</h2>
              <p className="text-lg text-slate-400 mb-10 leading-relaxed font-medium">
                {featuredPost.excerpt}
              </p>
              <Link 
                to={`/blog/${featuredPost.id}`} 
                className="inline-flex items-center font-black text-lg transition-all group hover:opacity-80"
                style={{ color: COLORS.secondary }}
              >
                Read Full Insight 
                <ArrowRight className="ml-3 transform group-hover:translate-x-2 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Post Grid - Refined card presentation */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-16">
            <div>
              <h2 className="text-4xl font-black text-slate-900">Latest Articles</h2>
              <p className="text-slate-500 mt-2 font-medium">Deep dives into logistics, care, and hospitality.</p>
            </div>
            <div className="hidden md:block w-32 h-1 rounded-full bg-slate-200"></div>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {gridPosts.map(post => (
              <article key={post.id} className="bg-white rounded-[32px] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-slate-100 flex flex-col group">
                <Link to={`/blog/${post.id}`} className="h-64 overflow-hidden block relative">
                  <img src={post.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={post.title} />
                  <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-transparent transition-colors duration-500"></div>
                  <div className="absolute top-6 left-6">
                    <span className="px-4 py-1.5 rounded-full bg-white/90 backdrop-blur-md text-[10px] font-black uppercase tracking-widest text-slate-900 shadow-sm">
                      {post.category}
                    </span>
                  </div>
                </Link>
                <div className="p-8 flex-grow flex flex-col">
                  <div className="flex items-center text-[10px] font-black uppercase tracking-[0.15em] mb-4 text-slate-400">
                    <Calendar size={12} className="mr-2" /> {post.date}
                  </div>
                  <Link to={`/blog/${post.id}`} className="block">
                    <h3 className="text-xl font-bold mb-4 line-clamp-2 group-hover:text-brand-secondary transition-colors leading-snug text-slate-900">{post.title}</h3>
                  </Link>
                  <p className="text-slate-500 mb-8 line-clamp-3 text-sm leading-relaxed font-medium">{post.excerpt}</p>
                  <div className="mt-auto pt-6 border-t border-slate-50 flex items-center justify-between">
                    <Link to={`/blog/${post.id}`} className="font-black text-sm flex items-center group/btn transition-colors" style={{ color: COLORS.primary }}>
                      Learn More 
                      <ArrowRight size={16} className="ml-2 transform group-hover/btn:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Newsletter Subscription - High contrast styling */}
      <section className="py-24 relative overflow-hidden" style={{ backgroundColor: COLORS.primary }}>
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -mr-48 -mt-48 blur-3xl"></div>
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl md:text-5xl font-black text-white mb-6">Stay Ahead of the Curve</h2>
          <p className="text-blue-100 mb-12 text-lg font-medium opacity-90">Receive the latest UK workforce insights and trends directly in your inbox.</p>
          <form className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto" onSubmit={e => e.preventDefault()}>
            <input 
              type="email" 
              placeholder="Email address" 
              className="flex-grow px-8 py-5 rounded-2xl text-slate-900 focus:outline-none shadow-2xl font-bold placeholder:text-slate-400" 
            />
            <button 
              className="px-10 py-5 rounded-2xl font-black text-white shadow-2xl hover:brightness-110 transition-all whitespace-nowrap active:scale-95"
              style={{ backgroundColor: COLORS.secondary }}
            >
              Subscribe
            </button>
          </form>
          <p className="mt-8 text-xs text-blue-300 font-bold uppercase tracking-widest opacity-60">No Spam. Just Expertise.</p>
        </div>
      </section>

      {/* 5. Categories Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-black mb-12 text-center text-slate-900 uppercase tracking-[0.2em]">Explore Sectors</h2>
          <div className="flex flex-wrap justify-center gap-4">
            {['Care Sector', 'Warehousing', 'Logistics', 'Cleaning', 'Hospitality', 'Recruitment Strategy', 'UK Job Market'].map(cat => (
              <button key={cat} className="px-8 py-4 rounded-2xl border-2 border-slate-100 text-slate-600 font-bold hover:border-brand-secondary hover:text-brand-secondary hover:bg-slate-50 transition-all shadow-sm">
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Professional Consultation CTA */}
      <section className="py-32 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="inline-block p-4 bg-white rounded-3xl shadow-xl mb-12">
            <Tag className="text-blue-600 w-12 h-12" />
          </div>
          <h2 className="text-4xl md:text-5xl font-black mb-8 text-slate-900">Custom Workforce Strategies</h2>
          <p className="text-xl text-slate-500 mb-12 leading-relaxed max-w-2xl mx-auto font-medium">Beyond insights, we provide actionable strategies to scale your business with the right talent.</p>
          <Link 
            to="/contact" 
            className="inline-block px-12 py-6 rounded-2xl font-black text-xl text-white shadow-2xl hover:opacity-90 transition-all transform active:scale-95"
            style={{ backgroundColor: COLORS.primary }}
          >
            Request a Strategy Call
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Blog;