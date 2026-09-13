import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  Search, 
  MapPin, 
  Briefcase, 
  SlidersHorizontal, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  RotateCcw,
  AlertCircle,
  Clock,
  Filter,
  Check
} from 'lucide-react';
import { Job } from '../types.ts';
import { JobService, decodeHtml } from '../services/jobService.ts';
import { JobCard } from '../components/JobCard.tsx';
import { JOB_TYPES, WORK_ARRANGEMENTS, COLORS } from '../constants.tsx';

export const Jobs: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Initialize state from URL params
  const urlKeyword = searchParams.get('keyword') || searchParams.get('q') || '';
  const urlLocation = searchParams.get('location') || searchParams.get('loc') || '';
  const urlJobType = searchParams.get('type') || 'all';
  const urlArrangement = searchParams.get('arrangement') || 'all';
  const urlCategory = searchParams.get('category') || searchParams.get('cat') || 'all';
  const urlSalary = searchParams.get('salary') || searchParams.get('sal') || 'all';
  const urlSort = (searchParams.get('sort') as any) || 'newest';
  const urlPage = Number(searchParams.get('page')) || 1;

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState<string>(urlKeyword);
  const [location, setLocation] = useState<string>(urlLocation);
  const [selectedJobType, setSelectedJobType] = useState<string>(urlJobType);
  const [selectedWorkArrangement, setSelectedWorkArrangement] = useState<string>(urlArrangement);
  const [selectedCategory, setSelectedCategory] = useState<string>(urlCategory);
  const [selectedSalary, setSelectedSalary] = useState<string>(urlSalary);
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'closing_soon' | 'salary_high' | 'salary_low'>(urlSort);
  const [currentPage, setCurrentPage] = useState<number>(urlPage);

  // Pagination and status
  const pageSize = 9; // 3 columns x 3 rows on desktop
  const [jobs, setJobs] = useState<Job[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasError, setHasError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [showMobileFilterDrawer, setShowMobileFilterDrawer] = useState<boolean>(false);

  // Synchronize state when URL changes externally (e.g. browser back/forward)
  useEffect(() => {
    setSearchTerm(searchParams.get('keyword') || searchParams.get('q') || '');
    setLocation(searchParams.get('location') || searchParams.get('loc') || '');
    setSelectedJobType(searchParams.get('type') || 'all');
    setSelectedWorkArrangement(searchParams.get('arrangement') || 'all');
    setSelectedCategory(searchParams.get('category') || searchParams.get('cat') || 'all');
    setSelectedSalary(searchParams.get('salary') || searchParams.get('sal') || 'all');
    setSortBy((searchParams.get('sort') as any) || 'newest');
    setCurrentPage(Number(searchParams.get('page')) || 1);
  }, [searchParams]);

  // Update URL Search Parameters
  const updateUrlParams = useCallback((newValues: {
    keyword?: string;
    location?: string;
    type?: string;
    arrangement?: string;
    category?: string;
    salary?: string;
    sort?: string;
    page?: number;
  }) => {
    const params: Record<string, string> = {};

    const kw = newValues.keyword !== undefined ? newValues.keyword : searchTerm;
    const loc = newValues.location !== undefined ? newValues.location : location;
    const jt = newValues.type !== undefined ? newValues.type : selectedJobType;
    const wa = newValues.arrangement !== undefined ? newValues.arrangement : selectedWorkArrangement;
    const cat = newValues.category !== undefined ? newValues.category : selectedCategory;
    const sal = newValues.salary !== undefined ? newValues.salary : selectedSalary;
    const srt = newValues.sort !== undefined ? newValues.sort : sortBy;
    const pg = newValues.page !== undefined ? newValues.page : currentPage;

    if (kw.trim()) params.keyword = kw.trim();
    if (loc.trim()) params.location = loc.trim();
    if (jt && jt !== 'all') params.type = jt;
    if (wa && wa !== 'all') params.arrangement = wa;
    if (cat && cat !== 'all') params.category = cat;
    if (sal && sal !== 'all') params.salary = sal;
    if (srt && srt !== 'newest') params.sort = srt;
    if (pg && pg > 1) params.page = String(pg);

    setSearchParams(params, { replace: true });
  }, [searchTerm, location, selectedJobType, selectedWorkArrangement, selectedCategory, selectedSalary, sortBy, currentPage, setSearchParams]);

  // Fetch jobs
  const fetchJobs = useCallback(async () => {
    setIsLoading(true);
    setHasError(false);
    setErrorMessage('');
    try {
      const minSal = selectedSalary !== 'all' ? Number(selectedSalary) : undefined;
      const res = await JobService.getJobs({
        searchTerm: searchTerm.trim() || undefined,
        location: location.trim() || undefined,
        jobType: selectedJobType !== 'all' ? selectedJobType : undefined,
        workArrangement: selectedWorkArrangement !== 'all' ? selectedWorkArrangement : undefined,
        category: selectedCategory !== 'all' ? selectedCategory : undefined,
        minSalary: minSal,
        sortBy,
        page: currentPage,
        limit: pageSize
      });

      setJobs(res.jobs);
      setTotalCount(res.total);
      if (res.categories && res.categories.length > 0) {
        setCategories(res.categories);
      }
    } catch (err: any) {
      console.error('Failed to load vacancies:', err);
      setHasError(true);
      setErrorMessage(err?.message || 'Unable to retrieve job vacancies. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  }, [searchTerm, location, selectedJobType, selectedWorkArrangement, selectedCategory, selectedSalary, sortBy, currentPage, pageSize]);

  // Trigger search on filter changes
  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  // Submit Primary Search Form
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    updateUrlParams({ keyword: searchTerm, location, page: 1 });
  };

  // Quick Sector Pill Select
  const handleCategorySelect = (cat: string) => {
    setSelectedCategory(cat);
    setCurrentPage(1);
    updateUrlParams({ category: cat, page: 1 });
  };

  // Reset Filters
  const handleClearFilters = () => {
    setSearchTerm('');
    setLocation('');
    setSelectedJobType('all');
    setSelectedWorkArrangement('all');
    setSelectedCategory('all');
    setSelectedSalary('all');
    setSortBy('newest');
    setCurrentPage(1);
    setSearchParams({}, { replace: true });
  };

  const totalPages = Math.ceil(totalCount / pageSize);

  const countActiveFilters = [
    Boolean(searchTerm),
    Boolean(location),
    selectedJobType !== 'all',
    selectedWorkArrangement !== 'all',
    selectedCategory !== 'all',
    selectedSalary !== 'all'
  ].filter(Boolean).length;

  const hasActiveFilters = countActiveFilters > 0;

  return (
    <div className="pt-20 min-h-screen bg-slate-50 font-sans pb-24" id="public-jobs-page">
      {/* 1. JOBS PAGE HERO */}
      <section className="relative bg-slate-900 text-white pt-12 pb-16 lg:pt-16 lg:pb-20 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-15 pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-700 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-8">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest bg-blue-500/15 text-blue-400 border border-blue-500/25 mb-4">
              <Briefcase size={13} />
              <span>Promarch Job Vacancies</span>
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white mb-3.5">
              Find Your Next Opportunity
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-slate-300 font-normal leading-relaxed">
              Discover current job opportunities from employers and recruitment sources across the UK.
            </p>
          </div>

          {/* Integrated Search Controls inside Hero */}
          <div className="max-w-4xl mx-auto bg-white/95 backdrop-blur-md rounded-2xl p-3 sm:p-4 shadow-2xl border border-white/20">
            <form onSubmit={handleSearchSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-2 sm:gap-3">
                {/* Keyword Search */}
                <div className="md:col-span-5 relative">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={17} />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Job title, skill, or keyword..."
                    aria-label="Job title, skill or keyword search"
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-900 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                    id="search-input-keyword"
                  />
                </div>

                {/* Location Input */}
                <div className="md:col-span-4 relative">
                  <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={17} />
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Town, city, or postcode..."
                    aria-label="Town, city or postcode search"
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-900 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                    id="search-input-location"
                  />
                </div>

                {/* Submit & Filter Toggle Buttons */}
                <div className="md:col-span-3 flex items-center gap-2">
                  <button
                    type="submit"
                    className="flex-1 py-3 px-5 rounded-xl font-black text-xs uppercase tracking-wider text-white shadow-md hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
                    style={{ backgroundColor: COLORS.primary }}
                    id="btn-search-jobs"
                  >
                    <Search size={15} />
                    <span>Search</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowMobileFilterDrawer(true)}
                    className="md:hidden py-3 px-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors relative"
                    aria-label="Open filter drawer"
                    id="btn-mobile-filters"
                  >
                    <SlidersHorizontal size={17} />
                    {countActiveFilters > 0 && (
                      <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center shadow-xs">
                        {countActiveFilters}
                      </span>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Quick Sector Pills underneath Search */}
          {categories.length > 0 && (
            <div className="flex flex-wrap items-center justify-center gap-2 mt-6 max-w-4xl mx-auto">
              <button
                type="button"
                onClick={() => handleCategorySelect('all')}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                  selectedCategory === 'all'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-800/90 text-slate-300 hover:bg-slate-700/90 border border-slate-700'
                }`}
              >
                All Sectors
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => handleCategorySelect(cat)}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                    selectedCategory === cat
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-slate-800/90 text-slate-300 hover:bg-slate-700/90 border border-slate-700'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Desktop Structured Filter Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 hidden md:block">
        <div className="bg-white rounded-2xl p-4 shadow-xs border border-slate-200">
          <div className="grid grid-cols-4 gap-3">
            {/* Job Type Dropdown */}
            <div>
              <label htmlFor="filter-job-type" className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1">
                Job Type
              </label>
              <select
                id="filter-job-type"
                value={selectedJobType}
                onChange={(e) => {
                  setSelectedJobType(e.target.value);
                  setCurrentPage(1);
                  updateUrlParams({ type: e.target.value, page: 1 });
                }}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value="all">All Job Types</option>
                {JOB_TYPES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            {/* Work Arrangement */}
            <div>
              <label htmlFor="filter-work-arrangement" className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1">
                Work Arrangement
              </label>
              <select
                id="filter-work-arrangement"
                value={selectedWorkArrangement}
                onChange={(e) => {
                  setSelectedWorkArrangement(e.target.value);
                  setCurrentPage(1);
                  updateUrlParams({ arrangement: e.target.value, page: 1 });
                }}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value="all">All Arrangements</option>
                {WORK_ARRANGEMENTS.map((wa) => (
                  <option key={wa} value={wa}>{wa}</option>
                ))}
              </select>
            </div>

            {/* Category Dropdown */}
            <div>
              <label htmlFor="filter-category" className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1">
                Industry Sector
              </label>
              <select
                id="filter-category"
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setCurrentPage(1);
                  updateUrlParams({ category: e.target.value, page: 1 });
                }}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value="all">All Sectors</option>
                {categories.map((c) => (
                  <option key={c} value={c}>{decodeHtml(c)}</option>
                ))}
              </select>
            </div>

            {/* Minimum Salary Dropdown */}
            <div>
              <label htmlFor="filter-salary" className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1">
                Minimum Salary / Rate
              </label>
              <select
                id="filter-salary"
                value={selectedSalary}
                onChange={(e) => {
                  setSelectedSalary(e.target.value);
                  setCurrentPage(1);
                  updateUrlParams({ salary: e.target.value, page: 1 });
                }}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value="all">Any Salary</option>
                <option value="12">£12+ per hour</option>
                <option value="15">£15+ per hour</option>
                <option value="25000">£25,000+ per year</option>
                <option value="30000">£30,000+ per year</option>
                <option value="35000">£35,000+ per year</option>
                <option value="40000">£40,000+ per year</option>
                <option value="50000">£50,000+ per year</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Active Filter Chips Bar */}
      {hasActiveFilters && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
          <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-blue-50/70 border border-blue-100 rounded-xl text-xs">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-slate-500 font-medium">Filtered by:</span>
              {searchTerm && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white border border-blue-200 text-blue-800 font-bold">
                  Keyword: "{searchTerm}"
                  <button 
                    type="button"
                    onClick={() => {
                      setSearchTerm('');
                      setCurrentPage(1);
                      updateUrlParams({ keyword: '', page: 1 });
                    }}
                    aria-label="Remove keyword filter"
                    className="hover:text-red-500 ml-0.5"
                  >
                    <X size={11} />
                  </button>
                </span>
              )}
              {location && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white border border-blue-200 text-blue-800 font-bold">
                  Location: "{location}"
                  <button 
                    type="button"
                    onClick={() => {
                      setLocation('');
                      setCurrentPage(1);
                      updateUrlParams({ location: '', page: 1 });
                    }}
                    aria-label="Remove location filter"
                    className="hover:text-red-500 ml-0.5"
                  >
                    <X size={11} />
                  </button>
                </span>
              )}
              {selectedCategory !== 'all' && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white border border-blue-200 text-blue-800 font-bold">
                  Sector: {decodeHtml(selectedCategory)}
                  <button 
                    type="button"
                    onClick={() => {
                      setSelectedCategory('all');
                      setCurrentPage(1);
                      updateUrlParams({ category: 'all', page: 1 });
                    }}
                    aria-label="Remove category filter"
                    className="hover:text-red-500 ml-0.5"
                  >
                    <X size={11} />
                  </button>
                </span>
              )}
              {selectedJobType !== 'all' && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white border border-blue-200 text-blue-800 font-bold">
                  {selectedJobType}
                  <button 
                    type="button"
                    onClick={() => {
                      setSelectedJobType('all');
                      setCurrentPage(1);
                      updateUrlParams({ type: 'all', page: 1 });
                    }}
                    aria-label="Remove job type filter"
                    className="hover:text-red-500 ml-0.5"
                  >
                    <X size={11} />
                  </button>
                </span>
              )}
              {selectedWorkArrangement !== 'all' && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white border border-blue-200 text-blue-800 font-bold">
                  {selectedWorkArrangement}
                  <button 
                    type="button"
                    onClick={() => {
                      setSelectedWorkArrangement('all');
                      setCurrentPage(1);
                      updateUrlParams({ arrangement: 'all', page: 1 });
                    }}
                    aria-label="Remove work arrangement filter"
                    className="hover:text-red-500 ml-0.5"
                  >
                    <X size={11} />
                  </button>
                </span>
              )}
              {selectedSalary !== 'all' && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white border border-blue-200 text-blue-800 font-bold">
                  Min Salary: £{Number(selectedSalary).toLocaleString()}
                  <button 
                    type="button"
                    onClick={() => {
                      setSelectedSalary('all');
                      setCurrentPage(1);
                      updateUrlParams({ salary: 'all', page: 1 });
                    }}
                    aria-label="Remove salary filter"
                    className="hover:text-red-500 ml-0.5"
                  >
                    <X size={11} />
                  </button>
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={handleClearFilters}
              className="inline-flex items-center gap-1 text-xs font-bold text-red-600 hover:text-red-700 py-1 px-2 rounded-lg hover:bg-red-50 transition-colors ml-auto shrink-0"
              id="btn-clear-filters"
            >
              <RotateCcw size={12} />
              <span>Reset All</span>
            </button>
          </div>
        </section>
      )}

      {/* Results Header & Sorting Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3.5">
          <div>
            <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
              {isLoading ? (
                <span>Loading vacancies...</span>
              ) : (
                <span>
                  {totalCount} {totalCount === 1 ? 'Job Vacancy' : 'Job Vacancies'} Available
                </span>
              )}
            </h2>
            <p className="text-xs text-slate-500 font-normal mt-0.5">
              Verified opportunities with direct applications to verified UK employers.
            </p>
          </div>

          {/* Sort Control */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <label htmlFor="sort-dropdown" className="text-xs font-bold text-slate-500 whitespace-nowrap">
              Sort by:
            </label>
            <select
              id="sort-dropdown"
              value={sortBy}
              onChange={(e) => {
                const newSort = e.target.value as any;
                setSortBy(newSort);
                setCurrentPage(1);
                updateUrlParams({ sort: newSort, page: 1 });
              }}
              className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 shadow-2xs outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="newest">Newest Posted</option>
              <option value="oldest">Oldest Posted</option>
              <option value="closing_soon">Closing Soonest</option>
              <option value="salary_high">Highest Salary</option>
              <option value="salary_low">Lowest Salary</option>
            </select>
          </div>
        </div>
      </section>

      {/* 2. PROFESSIONAL THREE-COLUMN CARDS GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        {/* Loading Skeleton State */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div 
                key={i} 
                className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs animate-pulse flex flex-col justify-between h-84"
              >
                <div className="space-y-3.5">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-slate-200"></div>
                    <div className="space-y-1.5 flex-1">
                      <div className="h-3 bg-slate-200 rounded-md w-24"></div>
                      <div className="h-3 bg-slate-100 rounded-md w-36"></div>
                    </div>
                  </div>
                  <div className="h-5 bg-slate-200 rounded-md w-4/5"></div>
                  <div className="h-3 bg-slate-100 rounded-md w-28"></div>
                  <div className="flex gap-2">
                    <div className="h-5 bg-slate-100 rounded-md w-16"></div>
                    <div className="h-5 bg-slate-100 rounded-md w-16"></div>
                  </div>
                  <div className="h-3 bg-slate-100 rounded-md w-full"></div>
                  <div className="h-3 bg-slate-100 rounded-md w-2/3"></div>
                </div>
                <div className="h-9 bg-slate-200 rounded-xl mt-4"></div>
              </div>
            ))}
          </div>
        ) : hasError ? (
          /* Error State with Try Again */
          <div className="bg-white rounded-2xl border border-red-200 p-8 sm:p-12 text-center max-w-lg mx-auto shadow-xs">
            <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center mx-auto mb-4">
              <AlertCircle size={28} />
            </div>
            <h3 className="text-lg font-black text-slate-900 mb-2">Unable to Load Vacancies</h3>
            <p className="text-xs text-slate-600 mb-6 font-normal">
              {errorMessage || 'There was an issue connecting to the vacancies catalog. Please try refreshing.'}
            </p>
            <button
              type="button"
              onClick={() => fetchJobs()}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-black uppercase tracking-wider transition-colors shadow-sm"
              id="btn-retry-fetch"
            >
              <RotateCcw size={13} />
              <span>Try Again</span>
            </button>
          </div>
        ) : jobs.length > 0 ? (
          /* 3-Column Grid on Desktop, 2 on Tablet, 1 on Mobile */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="bg-white rounded-2xl border border-slate-200 p-10 sm:p-14 text-center max-w-lg mx-auto shadow-xs">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4">
              <Briefcase size={26} />
            </div>
            <h3 className="text-lg font-black text-slate-900 mb-2">No Matching Vacancies Found</h3>
            <p className="text-xs text-slate-600 mb-6 font-normal leading-relaxed">
              We could not find any active vacancies matching your selected filters. Try broadening your location or resetting filters to see all open positions.
            </p>
            <button
              type="button"
              onClick={handleClearFilters}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-blue-600 text-white text-xs font-black uppercase tracking-wider transition-colors shadow-sm"
            >
              <RotateCcw size={13} />
              <span>Reset Search & Filters</span>
            </button>
          </div>
        )}

        {/* Numbered Pagination */}
        {totalPages > 1 && !isLoading && (
          <div className="flex items-center justify-center gap-1.5 mt-12">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => {
                const newP = Math.max(currentPage - 1, 1);
                setCurrentPage(newP);
                updateUrlParams({ page: newP });
                window.scrollTo({ top: 300, behavior: 'smooth' });
              }}
              className="px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 text-xs font-bold hover:bg-slate-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 shadow-2xs"
            >
              <ChevronLeft size={14} />
              <span>Previous</span>
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
              <button
                key={pageNum}
                type="button"
                onClick={() => {
                  setCurrentPage(pageNum);
                  updateUrlParams({ page: pageNum });
                  window.scrollTo({ top: 300, behavior: 'smooth' });
                }}
                className={`w-9 h-9 rounded-xl text-xs font-black transition-all ${
                  currentPage === pageNum
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 shadow-2xs'
                }`}
              >
                {pageNum}
              </button>
            ))}

            <button
              type="button"
              disabled={currentPage === totalPages}
              onClick={() => {
                const newP = Math.min(currentPage + 1, totalPages);
                setCurrentPage(newP);
                updateUrlParams({ page: newP });
                window.scrollTo({ top: 300, behavior: 'smooth' });
              }}
              className="px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 text-xs font-bold hover:bg-slate-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 shadow-2xs"
            >
              <span>Next</span>
              <ChevronRight size={14} />
            </button>
          </div>
        )}
      </section>

      {/* Employer Staffing Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-10 relative overflow-hidden shadow-lg">
          <div className="absolute -right-16 -bottom-16 w-72 h-72 bg-blue-600/20 rounded-full blur-3xl"></div>
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-left">
              <span className="text-xs font-black uppercase tracking-widest text-blue-400 block">
                UK Employer Staffing
              </span>
              <h3 className="text-xl sm:text-2xl font-black tracking-tight">
                Looking to recruit reliable staff for your business?
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 max-w-xl font-normal">
                Promarch Consulting delivers vetted healthcare, warehouse, cleaning, and hospitality talent with swift placement turnaround across London and the UK.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2.5 shrink-0 w-full md:w-auto">
              <Link
                to="/contact"
                className="px-6 py-3 rounded-xl text-xs font-black uppercase tracking-wider text-center text-white bg-blue-600 hover:bg-blue-500 transition-all shadow-md"
              >
                Hire Staff
              </Link>
              <Link
                to="/services"
                className="px-6 py-3 rounded-xl text-xs font-black uppercase tracking-wider text-center text-slate-200 bg-slate-800 hover:bg-slate-700 transition-all border border-slate-700"
              >
                Our Services
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile Filter Slide-Over Drawer */}
      {showMobileFilterDrawer && (
        <div className="fixed inset-0 z-50 flex justify-end md:hidden">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
            onClick={() => setShowMobileFilterDrawer(false)}
          ></div>

          {/* Drawer Content */}
          <div className="relative w-full max-w-xs bg-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-200">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Filter size={16} className="text-blue-600" />
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">
                  Filter Vacancies
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowMobileFilterDrawer(false)}
                className="p-1 text-slate-400 hover:text-slate-600"
                aria-label="Close filters"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-4 flex-1 overflow-y-auto space-y-4">
              {/* Job Type */}
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-600 mb-1.5">
                  Job Type
                </label>
                <select
                  value={selectedJobType}
                  onChange={(e) => setSelectedJobType(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
                >
                  <option value="all">All Job Types</option>
                  {JOB_TYPES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              {/* Work Arrangement */}
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-600 mb-1.5">
                  Work Arrangement
                </label>
                <select
                  value={selectedWorkArrangement}
                  onChange={(e) => setSelectedWorkArrangement(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
                >
                  <option value="all">All Arrangements</option>
                  {WORK_ARRANGEMENTS.map((wa) => (
                    <option key={wa} value={wa}>{wa}</option>
                  ))}
                </select>
              </div>

              {/* Sector Category */}
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-600 mb-1.5">
                  Industry Sector
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
                >
                  <option value="all">All Sectors</option>
                  {categories.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {/* Salary */}
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-600 mb-1.5">
                  Minimum Salary / Rate
                </label>
                <select
                  value={selectedSalary}
                  onChange={(e) => setSelectedSalary(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
                >
                  <option value="all">Any Salary</option>
                  <option value="12">£12+ per hour</option>
                  <option value="15">£15+ per hour</option>
                  <option value="25000">£25,000+ per year</option>
                  <option value="30000">£30,000+ per year</option>
                  <option value="35000">£35,000+ per year</option>
                  <option value="40000">£40,000+ per year</option>
                  <option value="50000">£50,000+ per year</option>
                </select>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="p-4 border-t border-slate-200 space-y-2 bg-slate-50">
              <button
                type="button"
                onClick={() => {
                  setShowMobileFilterDrawer(false);
                  setCurrentPage(1);
                  updateUrlParams({
                    type: selectedJobType,
                    arrangement: selectedWorkArrangement,
                    category: selectedCategory,
                    salary: selectedSalary,
                    page: 1
                  });
                }}
                className="w-full py-3 px-4 rounded-xl bg-blue-600 text-white font-black text-xs uppercase tracking-wider shadow-md"
              >
                Apply Filters
              </button>
              <button
                type="button"
                onClick={() => {
                  handleClearFilters();
                  setShowMobileFilterDrawer(false);
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-100"
              >
                Reset All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
