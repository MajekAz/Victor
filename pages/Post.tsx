import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, Tag, ArrowLeft, Share2, MessageCircle, User, ChevronRight } from 'lucide-react';
import { BLOG_POSTS, COLORS } from '../constants.tsx';

const Post: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const post = BLOG_POSTS.find(p => p.id === Number(id));

  // Fallback for demo if post ID isn't in constant (e.g. from featured link)
  const displayPost = post || {
    id: 1,
    title: "Mastering Recruitment in a Post-Pandemic London",
    excerpt: "How technology and remote-first culture is reshaping the way we think about logistics and care management...",
    date: "Dec 15, 2023",
    category: "Recruitment",
    image: "https://images.unsplash.com/photo-1600880212340-02d956ea3a8a?auto=format&fit=crop&q=80&w=1200"
  };

  // Content specific images mapping
  const contentImages: Record<number, string[]> = {
    1: ["https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&q=80&w=1200"],
    2: ["https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=1200"],
    3: ["https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&q=80&w=1200"],
    4: [ // Hygiene Standards
      "https://images.unsplash.com/photo-1613665813446-82a78c468a1d?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=1200"
    ],
    5: ["https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&q=80&w=1200"],
    6: [ // Career Progression
      "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1606185542414-064b5894b986?auto=format&fit=crop&q=80&w=1200"
    ]
  };

  const images = contentImages[displayPost.id] || ["https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&q=80&w=1200"];

  return (
    <div className="pt-20">
      {/* 1. Hero Section */}
      <section className="relative h-[60vh] flex items-center min-h-[400px]">
        <div className="absolute inset-0 z-0">
          <img 
            src={displayPost.image} 
            className="w-full h-full object-cover brightness-[0.4]"
            alt={displayPost.title}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent"></div>
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-white text-center">
          <Link to="/blog" className="inline-flex items-center text-blue-400 font-bold mb-6 hover:text-blue-300 transition-colors">
            <ArrowLeft size={18} className="mr-2" /> Back to Industry Insights
          </Link>
          <div className="flex items-center justify-center space-x-4 mb-6 text-sm font-bold uppercase tracking-widest text-slate-300">
            <span className="flex items-center"><Calendar size={14} className="mr-1.5" /> {displayPost.date}</span>
            <span className="bg-blue-600 px-3 py-1 rounded text-white">{displayPost.category}</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black leading-tight mb-4">
            {displayPost.title}
          </h1>
        </div>
      </section>

      {/* 2. Article Content Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="prose prose-lg max-w-none text-slate-700 leading-relaxed">
            <p className="text-2xl font-medium text-slate-900 mb-8 italic border-l-4 border-blue-600 pl-6">
              {displayPost.excerpt}
            </p>
            
            <h2 className="text-3xl font-black text-slate-900 mt-12 mb-6">Expert Analysis: {displayPost.category} Trends</h2>
            <p className="mb-6">
              In the heart of the UK's bustling economy, {displayPost.category.toLowerCase()} plays a pivotal role. As we look towards the coming months, the demand for specialized talent in this sector is projected to reach new heights. Our latest data indicates a shift in candidate expectations and employer requirements.
            </p>
            
            <p className="mb-8">
              At Promarch Consulting, we've analyzed hundreds of successful placements to understand what truly drives success in {displayPost.category}. From rigorous vetting to cultural alignment, the components of a perfect match are more complex than ever.
            </p>

            <div className="relative group">
              <img 
                src={images[0]} 
                className="rounded-3xl shadow-xl my-12 w-full object-cover h-[450px]" 
                alt={`${displayPost.title} visual context`}
              />
              <div className="absolute inset-0 bg-blue-600/5 rounded-3xl group-hover:bg-transparent transition-colors"></div>
            </div>

            <h3 className="text-2xl font-black text-slate-900 mb-4">Core Considerations for Professionals</h3>
            <p className="mb-6">
              Whether you're looking to advance your career or optimize your team, certain fundamentals remain constant. Skill acquisition, reliability, and local market knowledge are the bedrock of the modern workforce.
            </p>

            {/* Additional content image for specific posts */}
            {images.length > 1 && (
              <div className="grid md:grid-cols-2 gap-8 my-12">
                <div className="flex flex-col justify-center">
                  <h4 className="text-xl font-black mb-4">The Impact of Quality Standards</h4>
                  <p className="text-slate-600 mb-0">
                    Implementing high-quality standards isn't just about compliance; it's about building a legacy of excellence. In {displayPost.category}, this means constant improvement and adaptation to new technologies and methodologies.
                  </p>
                </div>
                <img 
                  src={images[1]} 
                  className="rounded-2xl shadow-lg w-full object-cover h-[300px]" 
                  alt="Supplementary visual"
                />
              </div>
            )}

            <h3 className="text-2xl font-black text-slate-900 mb-4">Forward-Looking Strategy</h3>
            <ul className="list-disc pl-6 space-y-3 mb-8">
              <li>Emphasis on digital literacy across all operational roles.</li>
              <li>Increased focus on sustainable and ethical practices in logistics and care.</li>
              <li>The rise of specialized certification as a key differentiator for candidates.</li>
            </ul>

            <p>
              Looking ahead, Promarch Consulting continues to invest in the technologies and people that make the UK job market one of the most vibrant in the world. We are committed to fostering growth and opportunity for every partner we work with.
            </p>
          </div>
        </div>
      </section>

      {/* 3. Author / Bio Section */}
      <section className="py-16 bg-slate-50 border-y border-slate-100">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center bg-white p-8 rounded-[32px] shadow-sm gap-8">
            <img 
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=300" 
              className="w-24 h-24 rounded-2xl object-cover" 
              alt="Michael Vance - Author" 
            />
            <div className="flex-grow text-center md:text-left">
              <h4 className="text-xl font-black mb-2">Written by Michael Vance</h4>
              <p className="text-slate-500 mb-4">Head of Sector Strategy at Promarch Consulting. Michael has over 15 years of experience in UK workforce management and corporate placement strategy.</p>
              <div className="flex justify-center md:justify-start space-x-4">
                <button className="text-blue-600 text-sm font-bold flex items-center hover:underline group">
                  View Full Profile <ChevronRight size={14} className="ml-1 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Social Sharing & Interactions Section */}
      <section className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-8 border-b border-slate-100 pb-12">
          <div className="flex items-center space-x-6">
            <button className="flex items-center space-x-2 text-slate-500 hover:text-blue-600 transition-colors">
              <Share2 size={20} />
              <span className="font-bold">Share Article</span>
            </button>
            <button className="flex items-center space-x-2 text-slate-500 hover:text-blue-600 transition-colors">
              <MessageCircle size={20} />
              <span className="font-bold">Reader Discussion</span>
            </button>
          </div>
          <div className="flex space-x-4">
            {['insights', 'growth', 'uk-jobs', 'promarch'].map(t => (
              <span key={t} className="text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-50 px-3 py-1 rounded border border-slate-100">#{t}</span>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Related Articles Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-black mb-12 text-center">Continue Reading</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {BLOG_POSTS.filter(p => p.id !== displayPost.id).slice(0, 3).map(related => (
              <Link to={`/blog/${related.id}`} key={related.id} className="group">
                <div className="rounded-3xl overflow-hidden mb-6 aspect-video">
                  <img src={related.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={related.title} />
                </div>
                <h3 className="text-lg font-bold mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">{related.title}</h3>
                <p className="text-slate-500 text-sm line-clamp-2">{related.excerpt}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Footer CTA Section */}
      <section className="py-24 text-white overflow-hidden relative" style={{ backgroundColor: COLORS.primary }}>
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl font-black mb-8">Looking for specialized staff in London?</h2>
          <p className="text-xl text-blue-100 mb-12">Our recruitment leads are standing by to help you find the perfect match for your business.</p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link to="/contact" className="bg-white text-blue-600 px-8 py-4 rounded-xl font-black text-lg hover:bg-blue-50 transition-all shadow-lg">
              Contact an Expert
            </Link>
            <Link to="/services" className="bg-blue-800 text-white border border-blue-500/50 px-8 py-4 rounded-xl font-black text-lg hover:bg-blue-900 transition-all">
              Our Service Sectors
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Post;