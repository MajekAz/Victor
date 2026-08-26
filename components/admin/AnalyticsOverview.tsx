import React from 'react';
import { 
  Briefcase, 
  CheckCircle2, 
  Clock, 
  FileText, 
  Sparkles, 
  Eye, 
  MousePointerClick, 
  TrendingUp, 
  AlertTriangle,
  Layers,
  MapPin,
  Plus,
  Upload,
  Download
} from 'lucide-react';
import { JobAnalytics } from '../../types.ts';

interface AnalyticsOverviewProps {
  analytics: JobAnalytics;
  onNavigateTab: (tab: 'jobs' | 'create' | 'import' | 'logs') => void;
  onExportCsv: () => void;
}

export const AnalyticsOverview: React.FC<AnalyticsOverviewProps> = ({
  analytics,
  onNavigateTab,
  onExportCsv
}) => {
  return (
    <div className="space-y-8" id="admin-analytics-view">
      {/* 1. Metric Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Total Vacancies */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">
              Total Vacancies
            </span>
            <div className="text-3xl font-black text-slate-900">{analytics.totalVacancies}</div>
            <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1 mt-1">
              <CheckCircle2 size={12} />
              <span>{analytics.activeVacancies} active live</span>
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Briefcase size={22} />
          </div>
        </div>

        {/* Total Views */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">
              Job Views
            </span>
            <div className="text-3xl font-black text-slate-900">{analytics.totalViews}</div>
            <span className="text-xs font-semibold text-slate-500 flex items-center gap-1 mt-1">
              <TrendingUp size={12} className="text-blue-600" />
              <span>Organic impressions</span>
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <Eye size={22} />
          </div>
        </div>

        {/* Apply Clicks */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">
              Apply Outbound Clicks
            </span>
            <div className="text-3xl font-black text-slate-900">{analytics.totalApplyClicks}</div>
            <span className="text-xs font-semibold text-slate-500 flex items-center gap-1 mt-1">
              <span>
                {analytics.totalViews > 0 
                  ? `${Math.round((analytics.totalApplyClicks / analytics.totalViews) * 100)}% conversion` 
                  : '0% conversion'}
              </span>
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <MousePointerClick size={22} />
          </div>
        </div>

        {/* Expired / Attention */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">
              Action Needed
            </span>
            <div className="text-3xl font-black text-slate-900">
              {analytics.expiringThisWeek + analytics.expiredVacancies}
            </div>
            <span className="text-xs font-semibold text-amber-600 flex items-center gap-1 mt-1">
              <AlertTriangle size={12} />
              <span>{analytics.expiringThisWeek} closing soon</span>
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Clock size={22} />
          </div>
        </div>
      </div>

      {/* 2. Secondary Breakdown & Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Status Distribution */}
        <div className="lg:col-span-6 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-5">
          <h3 className="text-base font-black text-slate-900 uppercase tracking-wider">
            Vacancy Pipeline Status
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-100">
              <span className="text-[10px] font-black uppercase text-emerald-800 block">Published</span>
              <span className="text-2xl font-black text-emerald-950">{analytics.activeVacancies}</span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-100 border border-slate-200">
              <span className="text-[10px] font-black uppercase text-slate-600 block">Drafts</span>
              <span className="text-2xl font-black text-slate-900">{analytics.draftVacancies}</span>
            </div>
            <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100">
              <span className="text-[10px] font-black uppercase text-blue-700 block">Featured</span>
              <span className="text-2xl font-black text-blue-950">{analytics.featuredVacancies}</span>
            </div>
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-100">
              <span className="text-[10px] font-black uppercase text-rose-700 block">Expired</span>
              <span className="text-2xl font-black text-rose-950">{analytics.expiredVacancies}</span>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => onNavigateTab('create')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-black uppercase tracking-wider transition-colors shadow-xs"
            >
              <Plus size={14} />
              <span>Add New Vacancy</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigateTab('import')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-black uppercase tracking-wider transition-colors"
            >
              <Upload size={14} />
              <span>Import CSV</span>
            </button>

            <button
              type="button"
              onClick={onExportCsv}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-black uppercase tracking-wider transition-colors"
            >
              <Download size={14} />
              <span>Export All Jobs</span>
            </button>
          </div>
        </div>

        {/* Top Performing Role & Locations */}
        <div className="lg:col-span-6 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
          <h3 className="text-base font-black text-slate-900 uppercase tracking-wider">
            Sector & Demand Highlights
          </h3>

          <div className="space-y-4">
            {analytics.mostViewedJob && (
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0">
                  <Sparkles size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                    Most Viewed Vacancy
                  </span>
                  <p className="text-sm font-black text-slate-900 truncate">
                    {analytics.mostViewedJob.title}
                  </p>
                  <span className="text-xs text-slate-500 font-medium">
                    {analytics.mostViewedJob.company} • {analytics.mostViewedJob.views} total views
                  </span>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1 flex items-center gap-1">
                  <Layers size={11} /> Top Sector
                </span>
                <p className="text-sm font-black text-slate-900">
                  {analytics.mostPopularCategory?.category || 'Care Sector'}
                </p>
                <span className="text-xs text-slate-500 font-medium">
                  {analytics.mostPopularCategory?.count || 0} active postings
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1 flex items-center gap-1">
                  <MapPin size={11} /> Top Region
                </span>
                <p className="text-sm font-black text-slate-900">
                  {analytics.mostPopularLocation?.location || 'London'}
                </p>
                <span className="text-xs text-slate-500 font-medium">
                  {analytics.mostPopularLocation?.count || 0} vacancies
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
