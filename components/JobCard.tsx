import React from 'react';
import { Link } from 'react-router-dom';
import { 
  MapPin, 
  Briefcase, 
  Clock, 
  Building2, 
  Sparkles, 
  ArrowRight, 
  Calendar,
  Layers,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import { Job } from '../types.ts';
import { JobService } from '../services/jobService.ts';
import { COLORS } from '../constants.tsx';

// Decode HTML entities if text contains encoded entities like &amp;
const decodeHtml = (str?: string | null): string => {
  if (!str) return '';
  return str
    .replace(/&amp;/g, '&')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'");
};

interface JobCardProps {
  job: Job;
  compact?: boolean;
}

export const JobCard: React.FC<JobCardProps> = ({ job, compact = false }) => {
  const isExpired = JobService.isJobExpired(job);
  const isClosingSoon = JobService.isClosingSoon(job.closingDate);

  // Format salary display cleanly
  const formatSalary = () => {
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

  // Format posted date relative (human readable) with full date in title
  const getRelativePostedDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      
      if (diffHours < 1) return 'Posted just now';
      if (diffHours < 24) return `Posted ${diffHours}h ago`;
      if (diffDays === 1) return 'Posted yesterday';
      if (diffDays < 7) return `Posted ${diffDays} days ago`;
      if (diffDays < 14) return 'Posted 1 week ago';
      if (diffDays < 30) return `Posted ${Math.floor(diffDays / 7)} weeks ago`;
      if (diffDays < 60) return 'Posted 1 month ago';
      return `Posted ${Math.floor(diffDays / 30)} months ago`;
    } catch {
      return 'Recently posted';
    }
  };

  const formattedFullDate = (() => {
    try {
      return new Date(job.datePosted).toLocaleDateString('en-GB', { 
        day: 'numeric', 
        month: 'short', 
        year: 'numeric' 
      });
    } catch {
      return '';
    }
  })();

  const formattedClosingDate = (() => {
    if (!job.closingDate) return null;
    try {
      return new Date(job.closingDate).toLocaleDateString('en-GB', { 
        day: 'numeric', 
        month: 'short', 
        year: 'numeric' 
      });
    } catch {
      return null;
    }
  })();

  // Work arrangement badge styling
  const getWorkArrangementClass = (wa: string) => {
    switch (wa.toLowerCase()) {
      case 'remote':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200/80';
      case 'hybrid':
        return 'bg-purple-50 text-purple-700 border-purple-200/80';
      default:
        return 'bg-blue-50 text-blue-700 border-blue-200/80';
    }
  };

  return (
    <div 
      className={`group relative flex flex-col justify-between bg-white rounded-2xl border transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
        job.featured 
          ? 'border-blue-300 ring-1 ring-blue-500/20 shadow-sm bg-linear-to-b from-blue-50/20 to-white' 
          : 'border-slate-200 hover:border-blue-200 shadow-xs'
      } ${compact ? 'p-5' : 'p-6'}`}
      id={`job-card-${job.id}`}
    >
      {/* Top Header: Company Info & Badges */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-3.5">
          <div className="flex items-center gap-3 min-w-0">
            {job.companyLogo ? (
              <img 
                src={job.companyLogo} 
                alt={`${job.company} logo`} 
                className="w-11 h-11 rounded-xl object-cover border border-slate-100 shadow-2xs shrink-0"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            ) : (
              <div 
                className="w-11 h-11 rounded-xl flex items-center justify-center font-black text-sm text-white shadow-2xs shrink-0"
                style={{ backgroundColor: COLORS.primary }}
              >
                {job.company.substring(0, 2).toUpperCase()}
              </div>
            )}

            <div className="min-w-0">
              <span className="text-xs font-black uppercase tracking-wider text-slate-500 truncate block">
                {decodeHtml(job.company)}
              </span>
              <div className="flex items-center gap-1 text-xs text-slate-600 font-medium mt-0.5">
                <MapPin size={12} className="text-slate-400 shrink-0" />
                <span className="truncate">{decodeHtml(job.location)}</span>
              </div>
            </div>
          </div>

          {/* Featured or Status Badges */}
          <div className="flex flex-col items-end gap-1 shrink-0">
            {job.featured && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-600 text-white shadow-2xs">
                <Sparkles size={10} />
                <span>Featured</span>
              </span>
            )}

            {isExpired ? (
              <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-500 border border-slate-200">
                Closed
              </span>
            ) : isClosingSoon ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                <Clock size={10} className="animate-pulse text-amber-600" />
                <span>Closing Soon</span>
              </span>
            ) : null}
          </div>
        </div>

        {/* 1. Job Title */}
        <Link 
          to={`/jobs/${job.slug}`}
          className="block group-hover:text-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600 rounded-lg"
          aria-label={`View vacancy details for ${job.title} at ${job.company}`}
        >
          <h3 className="text-base sm:text-lg font-black text-slate-900 leading-snug line-clamp-2 tracking-tight mb-2">
            {decodeHtml(job.title)}
          </h3>
        </Link>

        {/* 4. Salary Highlight */}
        <div className="mb-3 flex items-baseline justify-between gap-2">
          <div className="text-sm sm:text-base font-black text-blue-700 tracking-tight">
            {formatSalary()}
          </div>
          {job.salaryTiers && job.salaryTiers.length > 0 && (
            <span className="text-[11px] font-bold text-slate-400 shrink-0">
              Pay tiers apply
            </span>
          )}
        </div>

        {/* 5, 6. Badges (Job Type, Work Arrangement, Category) */}
        <div className="flex flex-wrap gap-1.5 mb-2.5">
          <span className="px-2.5 py-0.5 rounded-lg text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-200/80">
            {job.jobType}
          </span>
          <span className={`px-2.5 py-0.5 rounded-lg text-[11px] font-bold border ${getWorkArrangementClass(job.workArrangement)}`}>
            {job.workArrangement}
          </span>
          <span className="px-2.5 py-0.5 rounded-lg text-[11px] font-medium bg-slate-50 text-slate-600 border border-slate-200/60 truncate max-w-[150px]" title={decodeHtml(job.category)}>
            {decodeHtml(job.category)}
          </span>
        </div>

        {/* Highlighted Job Card Caption / Contract Badge */}
        {Boolean(job.jobCardCaption && job.jobCardCaption.trim()) && (
          <div className="mb-3">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-lg text-[11px] font-bold bg-amber-50 text-amber-900 border border-amber-200/80">
              {decodeHtml(job.jobCardCaption!.trim())}
            </span>
          </div>
        )}

        {/* 8. Short Description */}
        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4 font-normal">
          {job.shortDescription}
        </p>
      </div>

      {/* Footer Section: Meta Info & CTA */}
      <div className="pt-3.5 border-t border-slate-100 mt-auto">
        <div className="flex items-center justify-between text-[11px] text-slate-500 mb-3.5">
          {/* 7. Human-readable Post Date */}
          <span 
            className="font-medium text-slate-500 flex items-center gap-1"
            title={`Date posted: ${formattedFullDate}`}
          >
            <Clock size={11} className="text-slate-400" />
            <span>{getRelativePostedDate(job.datePosted)}</span>
          </span>

          {/* 10. Closing Date or Source Display */}
          {formattedClosingDate && !isExpired ? (
            <span className="font-semibold text-slate-600" title={`Application deadline: ${formattedClosingDate}`}>
              Closes: {formattedClosingDate}
            </span>
          ) : job.sourceName ? (
            <span className="font-medium text-slate-400 truncate max-w-[130px]" title={`Job source: ${job.sourceName}`}>
              Source: {job.sourceName}
            </span>
          ) : null}
        </div>

        {/* 9. View Job CTA Button */}
        <Link
          to={`/jobs/${job.slug}`}
          className={`w-full py-2.5 px-4 rounded-xl font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
            isExpired
              ? 'bg-slate-100 text-slate-400 cursor-default'
              : 'bg-slate-900 group-hover:bg-blue-600 text-white shadow-2xs group-hover:shadow-md'
          }`}
          id={`btn-view-job-${job.id}`}
        >
          <span>{isExpired ? 'Vacancy Closed' : 'View Job'}</span>
          <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
};
