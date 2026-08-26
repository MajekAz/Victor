import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  MapPin, 
  Briefcase, 
  Clock, 
  Building2, 
  Calendar, 
  DollarSign, 
  Globe, 
  ExternalLink, 
  ChevronRight, 
  CheckCircle2, 
  ArrowLeft, 
  Share2, 
  Sparkles, 
  AlertCircle, 
  ShieldCheck, 
  Award, 
  Layers, 
  Copy, 
  Check, 
  Mail, 
  MessageCircle 
} from 'lucide-react';
import { Job } from '../types.ts';
import { JobService } from '../services/jobService.ts';
import { JobCard } from '../components/JobCard.tsx';
import { COLORS, COMPANY_NAME } from '../constants.tsx';

export const JobDetails: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const [job, setJob] = useState<Job | null>(null);
  const [relatedJobs, setRelatedJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [showShareModal, setShowShareModal] = useState<boolean>(false);

  useEffect(() => {
    if (slug) {
      loadJobDetails(slug);
      window.scrollTo(0, 0);
    }
  }, [slug]);

  const loadJobDetails = async (jobSlug: string) => {
    setIsLoading(true);
    try {
      const found = await JobService.getJobBySlug(jobSlug);
      if (found) {
        setJob(found);
        document.title = `${found.title} - ${found.company} | ${COMPANY_NAME} Careers`;

        // Inject JSON-LD Schema
        injectJobPostingSchema(found);

        // Fetch related jobs in the same category or general
        const relRes = await JobService.getJobs({
          category: found.category,
          limit: 6
        });
        
        // Exclude current job, pick top 3
        let matching = relRes.jobs.filter(j => j.id !== found.id);
        if (matching.length < 3) {
          const allRes = await JobService.getJobs({ limit: 6 });
          const extra = allRes.jobs.filter(j => j.id !== found.id && !matching.some(m => m.id === j.id));
          matching = [...matching, ...extra];
        }
        setRelatedJobs(matching.slice(0, 3));
      } else {
        setJob(null);
      }
    } catch (e) {
      console.error('Failed to load vacancy:', e);
    } finally {
      setIsLoading(false);
    }
  };

  // Inject Schema.org JobPosting structured data for SEO
  const injectJobPostingSchema = (j: Job) => {
    const existingScript = document.getElementById('job-schema-jsonld');
    if (existingScript) existingScript.remove();

    const schema = {
      "@context": "https://schema.org/",
      "@type": "JobPosting",
      "title": j.title,
      "description": j.fullDescription || j.shortDescription,
      "identifier": {
        "@type": "PropertyValue",
        "name": j.company,
        "value": j.id
      },
      "datePosted": j.datePosted,
      "validThrough": j.closingDate || undefined,
      "employmentType": j.jobType.toUpperCase().replace('-', '_'),
      "hiringOrganization": {
        "@type": "Organization",
        "name": j.company,
        "sameAs": j.sourceUrl || "https://promarchconsulting.co.uk",
        "logo": j.companyLogo || undefined
      },
      "jobLocation": {
        "@type": "Place",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": j.location,
          "addressLocality": j.city || "London",
          "addressRegion": j.region || "Greater London",
          "postalCode": j.postcode || "",
          "addressCountry": "GB"
        }
      },
      "baseSalary": j.salaryMin ? {
        "@type": "MonetaryAmount",
        "currency": "GBP",
        "value": {
          "@type": "QuantitativeValue",
          "minValue": j.salaryMin,
          "maxValue": j.salaryMax || j.salaryMin,
          "unitText": j.salaryPeriod === 'per hour' ? 'HOUR' : 'YEAR'
        }
      } : undefined
    };

    const script = document.createElement('script');
    script.id = 'job-schema-jsonld';
    script.type = 'application/ld+json';
    script.text = JSON.stringify(schema);
    document.head.appendChild(script);
  };

  const handleApplyClick = () => {
    if (!job) return;
    JobService.incrementApplyClick(job.id);
    const targetUrl = job.applicationUrl || 'https://promarchconsulting.co.uk/#/contact';
    window.open(targetUrl, '_blank', 'noopener,noreferrer');
  };

  const handleCopyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 3000);
    }
  };

  const currentUrl = typeof window !== 'undefined' ? encodeURIComponent(window.location.href) : '';
  const shareTitle = job ? encodeURIComponent(`${job.title} at ${job.company}`) : '';

  const handleNativeShare = async () => {
    if (navigator.share && job) {
      try {
        await navigator.share({
          title: `${job.title} - ${job.company}`,
          text: `Check out this vacancy: ${job.title} at ${job.company}`,
          url: window.location.href
        });
      } catch (err) {
        // User cancelled or share failed
      }
    } else {
      setShowShareModal(true);
    }
  };

  // Format salary
  const formatSalary = () => {
    if (!job) return '';
    if (job.salaryText) return job.salaryText;
    if (job.salaryMin && job.salaryMax) {
      const period = job.salaryPeriod || (job.salaryMin < 100 ? 'per hour' : 'per year');
      return `£${job.salaryMin.toLocaleString()} - £${job.salaryMax.toLocaleString()} ${period}`;
    }
    if (job.salaryMin) {
      const period = job.salaryPeriod || (job.salaryMin < 100 ? 'per hour' : 'per year');
      return `From £${job.salaryMin.toLocaleString()} ${period}`;
    }
    return 'Competitive Salary';
  };

  if (isLoading) {
    return (
      <div className="pt-32 pb-24 min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Loading vacancy details...</p>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="pt-32 pb-24 min-h-screen bg-slate-50">
        <div className="max-w-xl mx-auto px-4 text-center">
          <div className="bg-white rounded-2xl p-10 border border-slate-200 shadow-sm">
            <div className="w-14 h-14 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <AlertCircle size={28} />
            </div>
            <h2 className="text-xl font-black text-slate-900 mb-2">Vacancy Not Found</h2>
            <p className="text-xs text-slate-600 mb-6 font-normal">
              The job vacancy you are looking for may have been filled, removed, or expired.
            </p>
            <Link
              to="/jobs"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-blue-600 text-white text-xs font-black uppercase tracking-wider transition-colors shadow-sm"
            >
              <ArrowLeft size={13} />
              <span>Browse All Open Vacancies</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const isExpired = JobService.isJobExpired(job);
  const isClosingSoon = JobService.isClosingSoon(job.closingDate);

  return (
    <div className="pt-20 min-h-screen bg-slate-50 font-sans pb-24" id="job-details-view">
      {/* Breadcrumbs Navigation */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-2 text-xs font-medium text-slate-500">
          <Link to="/" className="hover:text-blue-600 transition-colors">Home</Link>
          <ChevronRight size={12} className="text-slate-400" />
          <Link to="/jobs" className="hover:text-blue-600 transition-colors">Vacancies</Link>
          <ChevronRight size={12} className="text-slate-400" />
          <span className="text-slate-800 font-bold truncate max-w-xs sm:max-w-md">{job.title}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
          {/* Main Column (8 Cols) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Header Card */}
            <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-xs relative overflow-hidden">
              {job.featured && (
                <div className="absolute top-0 right-0">
                  <div className="bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-bl-xl shadow-2xs flex items-center gap-1">
                    <Sparkles size={10} />
                    <span>Featured Vacancy</span>
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row sm:items-start gap-4 mb-5">
                {job.companyLogo ? (
                  <img 
                    src={job.companyLogo} 
                    alt={job.company} 
                    className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl object-cover border border-slate-100 shadow-2xs shrink-0"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                ) : (
                  <div 
                    className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl flex items-center justify-center font-black text-lg text-white shadow-2xs shrink-0"
                    style={{ backgroundColor: COLORS.primary }}
                  >
                    {job.company.substring(0, 2).toUpperCase()}
                  </div>
                )}

                <div className="space-y-1 flex-1 min-w-0">
                  <span className="text-xs font-black uppercase tracking-widest text-blue-600 block">
                    {job.category}
                  </span>
                  <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 tracking-tight leading-snug">
                    {job.title}
                  </h1>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs sm:text-sm font-semibold text-slate-600 pt-1">
                    <span className="flex items-center gap-1 text-slate-900">
                      <Building2 size={14} className="text-slate-400" />
                      {job.company}
                    </span>
                    <span className="flex items-center gap-1 text-slate-600">
                      <MapPin size={14} className="text-slate-400" />
                      {job.location}
                    </span>
                  </div>
                </div>
              </div>

              {/* Badges / Meta Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-4 border-t border-slate-100">
                <div className="bg-slate-50 p-2.5 rounded-xl">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Salary / Rate</span>
                  <span className="text-xs sm:text-sm font-black text-blue-700">{formatSalary()}</span>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-xl">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Employment Type</span>
                  <span className="text-xs sm:text-sm font-black text-slate-900">{job.jobType}</span>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-xl">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Work Arrangement</span>
                  <span className="text-xs sm:text-sm font-black text-slate-900">{job.workArrangement}</span>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-xl">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Date Posted</span>
                  <span className="text-xs sm:text-sm font-black text-slate-900">
                    {new Date(job.datePosted).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                </div>
              </div>

              {/* Status Warning / Closing Date Notice */}
              {isExpired ? (
                <div className="mt-4 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 flex items-center gap-2.5 text-xs font-semibold">
                  <AlertCircle size={16} className="shrink-0" />
                  <span>This vacancy has reached its closing deadline and is no longer accepting direct applications.</span>
                </div>
              ) : isClosingSoon ? (
                <div className="mt-4 p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 flex items-center gap-2.5 text-xs font-semibold">
                  <Clock size={16} className="shrink-0 text-amber-600 animate-pulse" />
                  <span>Applications close soon on {new Date(job.closingDate!).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}.</span>
                </div>
              ) : null}
            </div>

            {/* Role Details Body Card */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-7">
              {/* Job Overview */}
              {job.shortDescription && (
                <div>
                  <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight mb-2.5">
                    Role Summary
                  </h2>
                  <p className="text-slate-700 leading-relaxed text-xs sm:text-sm font-normal">
                    {job.shortDescription}
                  </p>
                </div>
              )}

              {/* Full Description */}
              {job.fullDescription && (
                <div>
                  <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight mb-2.5">
                    Full Description & Scope
                  </h2>
                  <div className="text-slate-700 leading-relaxed text-xs sm:text-sm font-normal whitespace-pre-line">
                    {job.fullDescription}
                  </div>
                </div>
              )}

              {/* Key Responsibilities */}
              {job.responsibilities && job.responsibilities.length > 0 && (
                <div>
                  <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight mb-3">
                    Key Responsibilities
                  </h2>
                  <ul className="space-y-2.5">
                    {job.responsibilities.map((resp, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 font-normal">
                        <CheckCircle2 size={15} className="text-blue-600 mt-0.5 shrink-0" />
                        <span>{resp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Requirements & Experience */}
              {job.requirements && job.requirements.length > 0 && (
                <div>
                  <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight mb-3">
                    Requirements & Experience
                  </h2>
                  <ul className="space-y-2.5">
                    {job.requirements.map((req, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 font-normal">
                        <CheckCircle2 size={15} className="text-slate-400 mt-0.5 shrink-0" />
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Qualifications */}
              {job.qualifications && job.qualifications.length > 0 && (
                <div>
                  <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight mb-3 flex items-center gap-2">
                    <Award size={17} className="text-blue-600" />
                    <span>Required Qualifications</span>
                  </h2>
                  <ul className="space-y-2">
                    {job.qualifications.map((q, i) => (
                      <li key={i} className="flex items-center gap-2 text-xs sm:text-sm text-slate-700 font-medium">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0"></div>
                        <span>{q}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Skills Tags */}
              {job.skills && job.skills.length > 0 && (
                <div>
                  <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight mb-2.5">
                    Desired Skills & Competencies
                  </h2>
                  <div className="flex flex-wrap gap-1.5">
                    {job.skills.map((skill, i) => (
                      <span key={i} className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-800 text-xs font-bold border border-blue-200">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Benefits */}
              {job.benefits && job.benefits.length > 0 && (
                <div>
                  <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight mb-3">
                    Package & Benefits
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {job.benefits.map((b, i) => (
                      <div key={i} className="flex items-start gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700 font-medium">
                        <CheckCircle2 size={14} className="text-emerald-600 shrink-0 mt-0.5" />
                        <span>{b}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Working Hours */}
              {job.workingHours && (
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-0.5">
                    Working Hours & Schedule
                  </span>
                  <p className="text-xs sm:text-sm font-semibold text-slate-800">{job.workingHours}</p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar Column (4 Cols) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Primary Action Card */}
            <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-sm sticky top-24 space-y-4">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-0.5">
                  Direct Application
                </span>
                <h3 className="text-base font-black text-slate-900">
                  Apply for this Vacancy
                </h3>
              </div>

              {/* Main Apply Button */}
              <button
                type="button"
                disabled={isExpired}
                onClick={handleApplyClick}
                className={`w-full py-3.5 px-5 rounded-xl font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-md ${
                  isExpired
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-500 text-white hover:scale-[1.01]'
                }`}
                id="btn-apply-job"
              >
                <span>{isExpired ? 'Vacancy Closed' : 'Apply for this Job'}</span>
                {!isExpired && <ExternalLink size={14} />}
              </button>

              {/* Trust Notice */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-[11px] text-slate-500 font-medium leading-relaxed">
                <ShieldCheck size={13} className="text-blue-600 inline mr-1" />
                Applications are submitted directly to the verified employer or original vacancy recruitment platform.
              </div>

              {/* Share Vacancy Section */}
              <div className="pt-3 border-t border-slate-100 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                    Share this Opportunity
                  </span>
                  {copiedLink && (
                    <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-1">
                      <Check size={11} /> Link Copied!
                    </span>
                  )}
                </div>

                {/* Social Share Buttons */}
                <div className="grid grid-cols-4 gap-1.5">
                  {/* LinkedIn */}
                  <a
                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${currentUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-slate-50 hover:bg-blue-50 hover:text-blue-600 text-slate-600 border border-slate-200 flex flex-col items-center justify-center text-[10px] font-bold transition-colors"
                    title="Share on LinkedIn"
                  >
                    <span className="text-xs font-black">in</span>
                  </a>

                  {/* WhatsApp */}
                  <a
                    href={`https://api.whatsapp.com/send?text=${shareTitle}%20${currentUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-slate-50 hover:bg-emerald-50 hover:text-emerald-600 text-slate-600 border border-slate-200 flex flex-col items-center justify-center text-[10px] font-bold transition-colors"
                    title="Share on WhatsApp"
                  >
                    <MessageCircle size={14} />
                  </a>

                  {/* Email */}
                  <a
                    href={`mailto:?subject=${shareTitle}&body=I found this vacancy on Promarch Consulting: ${currentUrl}`}
                    className="p-2 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 flex flex-col items-center justify-center text-[10px] font-bold transition-colors"
                    title="Share via Email"
                  >
                    <Mail size={14} />
                  </a>

                  {/* Copy Link Button */}
                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className="p-2 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 flex flex-col items-center justify-center text-[10px] font-bold transition-colors"
                    title="Copy Link"
                  >
                    {copiedLink ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                  </button>
                </div>
              </div>
            </div>

            {/* Employer / Source Card */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3.5">
              <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                Employer & Vacancy Source
              </h4>
              <div className="flex items-center gap-3">
                <div 
                  className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-white text-sm shadow-2xs shrink-0"
                  style={{ backgroundColor: COLORS.primary }}
                >
                  {job.company.substring(0, 2).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <h5 className="text-xs sm:text-sm font-black text-slate-900 truncate">{job.company}</h5>
                  <span className="text-[11px] text-slate-500 font-medium truncate block">{job.location}</span>
                </div>
              </div>

              <div className="text-[11px] text-slate-600 space-y-1.5 pt-2 border-t border-slate-100">
                <div className="flex justify-between">
                  <span className="text-slate-400">Sector:</span>
                  <span className="font-bold text-slate-800">{job.category}</span>
                </div>
                {job.closingDate && (
                  <div className="flex justify-between">
                    <span className="text-slate-400">Application Deadline:</span>
                    <span className="font-bold text-slate-800">
                      {new Date(job.closingDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                )}
                {job.sourceName && (
                  <div className="flex justify-between">
                    <span className="text-slate-400">Origin / Source:</span>
                    <span className="font-bold text-slate-800">{job.sourceName}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 10. Related Jobs Section (Up to 3 similar vacancies) */}
        {relatedJobs.length > 0 && (
          <section className="mt-16 pt-10 border-t border-slate-200">
            <div className="flex items-center justify-between mb-6">
              <div>
                <span className="text-xs font-black uppercase tracking-widest text-blue-600 block">
                  Explore More Roles
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  Similar Opportunities in {job.category}
                </h3>
              </div>
              <Link
                to={`/jobs?category=${encodeURIComponent(job.category)}`}
                className="text-xs font-black uppercase tracking-wider text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                <span>View All In Sector</span>
                <ChevronRight size={13} />
              </Link>
            </div>

            {/* 3-Column Related Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
              {relatedJobs.map((rJob) => (
                <JobCard key={rJob.id} job={rJob} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};
