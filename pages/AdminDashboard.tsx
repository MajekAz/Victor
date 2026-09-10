import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Lock, 
  Unlock, 
  LogOut, 
  Briefcase, 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Copy, 
  Trash2, 
  Eye, 
  CheckCircle2, 
  XCircle, 
  Sparkles, 
  Archive, 
  RefreshCw, 
  Download, 
  Upload, 
  History, 
  Shield, 
  AlertTriangle, 
  AlertCircle, 
  ChevronRight, 
  ExternalLink,
  Save,
  RotateCcw,
  BarChart3,
  Layers,
  MapPin,
  Clock,
  Loader2,
  ShieldCheck
} from 'lucide-react';
import { Job, JobType, WorkArrangement, JobStatus, SalaryPeriod, DuplicateMatch, SalaryTier } from '../types.ts';
import { JobService } from '../services/jobService.ts';
import { AuthService } from '../services/authService.ts';
import { AnalyticsOverview } from '../components/admin/AnalyticsOverview.tsx';
import { CsvImportView } from '../components/admin/CsvImportView.tsx';
import { ActivityLogView } from '../components/admin/ActivityLogView.tsx';
import { JOB_CATEGORIES, JOB_TYPES, WORK_ARRANGEMENTS, COLORS, COMPANY_NAME } from '../constants.tsx';

type AdminTab = 'analytics' | 'jobs' | 'create' | 'import' | 'logs' | 'security';

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Auth State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [emailInput, setEmailInput] = useState<string>('info@promarchconsulting.co.uk');
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string>('');

  // Active Navigation Tab
  const [activeTab, setActiveTab] = useState<AdminTab>('analytics');

  // Job Data State
  const [allJobs, setAllJobs] = useState<Job[]>([]);
  const [isLoadingJobs, setIsLoadingJobs] = useState<boolean>(true);
  const [analytics, setAnalytics] = useState(JobService.getAnalytics());

  // Job Management Filters & Multi-select
  const [tableSearch, setTableSearch] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [selectedJobIds, setSelectedJobIds] = useState<string[]>([]);

  // Editing State
  const [editingJobId, setEditingJobId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState<{
    title: string;
    slug: string;
    company: string;
    companyLogo: string;
    location: string;
    city: string;
    region: string;
    country: string;
    postcode: string;
    regionsMentioned: string;
    salaryMin: string;
    salaryMax: string;
    salaryText: string;
    salaryPeriod: SalaryPeriod;
    currency: string;
    salaryTiers: SalaryTier[];
    jobType: JobType;
    workArrangement: WorkArrangement;
    category: string;
    shortDescription: string;
    fullDescription: string;
    responsibilitiesText: string;
    requirementsText: string;
    qualificationsText: string;
    experienceText: string;
    skillsText: string;
    benefitsText: string;
    workingHours: string;
    sourceName: string;
    sourceUrl: string;
    applicationMethod: 'promarch' | 'external';
    applicationUrl: string;
    datePosted: string;
    closingDate: string;
    featured: boolean;
    status: JobStatus;
  }>({
    title: '',
    slug: '',
    company: 'Promarch Consulting',
    companyLogo: '',
    location: 'London, UK',
    city: 'London',
    region: 'Greater London',
    country: 'United Kingdom',
    postcode: '',
    regionsMentioned: '',
    salaryMin: '',
    salaryMax: '',
    salaryText: '',
    salaryPeriod: 'per year',
    currency: '£',
    salaryTiers: [],
    jobType: 'Full-time',
    workArrangement: 'On-site',
    category: 'Care Sector',
    shortDescription: '',
    fullDescription: '',
    responsibilitiesText: '',
    requirementsText: '',
    qualificationsText: '',
    experienceText: '',
    skillsText: '',
    benefitsText: '',
    workingHours: '',
    sourceName: 'Promarch Consulting',
    sourceUrl: 'https://promarchconsulting.co.uk',
    applicationMethod: 'promarch',
    applicationUrl: '',
    datePosted: new Date().toISOString().split('T')[0],
    closingDate: '',
    featured: false,
    status: 'published'
  });

  // Duplicate warning for active form
  const [formDuplicateWarning, setFormDuplicateWarning] = useState<DuplicateMatch | null>(null);
  const [formError, setFormError] = useState<string>('');
  const [formSuccess, setFormSuccess] = useState<string>('');

  // Delete Confirmation Modal
  const [deleteTargetJob, setDeleteTargetJob] = useState<Job | null>(null);
  const [bulkDeleteConfirm, setBulkDeleteConfirm] = useState<boolean>(false);

  // Renew Modal
  const [renewTargetJob, setRenewTargetJob] = useState<Job | null>(null);
  const [renewDays, setRenewDays] = useState<number>(30);

  useEffect(() => {
    const initAuth = async () => {
      const session = await AuthService.checkSession();
      setIsAuthenticated(session.isAuthenticated);
      if (session.isAuthenticated) {
        loadJobsData();
      } else {
        setIsLoadingJobs(false);
      }
    };
    initAuth();
  }, []);

  useEffect(() => {
    const p = location.pathname;
    if (p === '/admin/jobs/new') {
      handleStartCreateJob();
    } else if (p === '/admin/jobs') {
      setActiveTab('jobs');
    } else if (p === '/admin/import') {
      setActiveTab('import');
    } else if (p === '/admin/logs') {
      setActiveTab('logs');
    } else if (p === '/admin/settings' || p === '/admin/security') {
      setActiveTab('security');
    } else if (p === '/admin' || p === '/admin/dashboard') {
      setActiveTab('analytics');
    }
  }, [location.pathname]);

  const loadJobsData = async () => {
    setIsLoadingJobs(true);
    try {
      const list = await JobService.getAllAdminJobs();
      setAllJobs(list);
      setAnalytics(JobService.getAnalytics(list));
    } catch (e) {
      console.error('Failed to load admin jobs:', e);
    } finally {
      setIsLoadingJobs(false);
    }
  };

  // Login Handler strictly verifying PHP/MySQL server session
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    const cleanEmail = emailInput.trim().toLowerCase();
    if (!cleanEmail) {
      setAuthError('Administrator email is required.');
      return;
    }
    if (!passwordInput) {
      setAuthError('Password is required.');
      return;
    }

    setIsLoggingIn(true);
    try {
      const res = await AuthService.login(cleanEmail, passwordInput);
      if (res.success) {
        const session = await AuthService.checkSession();
        if (session.isAuthenticated) {
          setIsAuthenticated(true);
          setPasswordInput('');
          loadJobsData();
        } else {
          setAuthError('Session validation failed. Please verify that browser cookies are permitted.');
        }
      } else {
        setAuthError(res.error || 'Invalid administrator credentials. Please try again.');
      }
    } catch (err: any) {
      setAuthError(err?.message || 'Authentication service is unavailable. Please try again.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Logout invalidating PHP server session
  const handleLogout = async () => {
    await AuthService.logout();
    setIsAuthenticated(false);
    setPasswordInput('');
    navigate('/admin/login');
  };

  // Switch to Create New Job
  const handleStartCreateJob = () => {
    setEditingJobId(null);
    setFormData({
      title: '',
      slug: '',
      company: 'Promarch Consulting',
      companyLogo: '',
      location: 'London, UK',
      city: 'London',
      region: 'Greater London',
      country: 'United Kingdom',
      postcode: '',
      regionsMentioned: '',
      salaryMin: '',
      salaryMax: '',
      salaryText: '',
      salaryPeriod: 'per year',
      currency: '£',
      salaryTiers: [],
      jobType: 'Full-time',
      workArrangement: 'On-site',
      category: 'Care Sector',
      shortDescription: '',
      fullDescription: '',
      responsibilitiesText: '',
      requirementsText: '',
      qualificationsText: '',
      experienceText: '',
      skillsText: '',
      benefitsText: '',
      workingHours: '',
      sourceName: 'Promarch Consulting',
      sourceUrl: 'https://promarchconsulting.co.uk',
      applicationMethod: 'promarch',
      applicationUrl: '',
      datePosted: new Date().toISOString().split('T')[0],
      closingDate: '',
      featured: false,
      status: 'published'
    });
    setFormDuplicateWarning(null);
    setFormError('');
    setFormSuccess('');
    setActiveTab('create');
  };

  // Salary Tier State Handlers
  const handleAddSalaryTier = () => {
    setFormData(prev => ({
      ...prev,
      salaryTiers: [
        ...prev.salaryTiers,
        {
          role: '',
          hourlyRate: '',
          hours36Yearly: '',
          hours48Yearly: '',
          notes: ''
        }
      ]
    }));
  };

  const handleRemoveSalaryTier = (index: number) => {
    setFormData(prev => ({
      ...prev,
      salaryTiers: prev.salaryTiers.filter((_, i) => i !== index)
    }));
  };

  const handleUpdateSalaryTier = (index: number, field: keyof SalaryTier, val: string) => {
    setFormData(prev => {
      const copy = [...prev.salaryTiers];
      copy[index] = { ...copy[index], [field]: val };
      return { ...prev, salaryTiers: copy };
    });
  };

  // Switch to Edit Existing Job
  const handleStartEditJob = (job: Job) => {
    setEditingJobId(job.id);
    const hasExternalUrl = Boolean(job.applicationUrl && job.applicationUrl.trim() && !job.applicationUrl.includes('/contact'));
    setFormData({
      title: job.title,
      slug: job.slug,
      company: job.company,
      companyLogo: job.companyLogo || '',
      location: job.location,
      city: job.city || '',
      region: job.region || '',
      country: job.country || 'United Kingdom',
      postcode: job.postcode || '',
      regionsMentioned: job.regionsMentioned || '',
      salaryMin: job.salaryMin ? String(job.salaryMin) : '',
      salaryMax: job.salaryMax ? String(job.salaryMax) : '',
      salaryText: job.salaryText || '',
      salaryPeriod: job.salaryPeriod || 'per year',
      currency: job.currency || '£',
      salaryTiers: job.salaryTiers ? job.salaryTiers.map(t => ({ ...t })) : [],
      jobType: job.jobType,
      workArrangement: job.workArrangement,
      category: job.category,
      shortDescription: job.shortDescription || '',
      fullDescription: job.fullDescription || '',
      responsibilitiesText: job.responsibilities ? job.responsibilities.join('\n') : '',
      requirementsText: job.requirements ? job.requirements.join('\n') : '',
      qualificationsText: job.qualifications ? job.qualifications.join('\n') : '',
      experienceText: job.experience || '',
      skillsText: job.skills ? job.skills.join(', ') : '',
      benefitsText: job.benefits ? job.benefits.join('\n') : '',
      workingHours: job.workingHours || '',
      sourceName: job.sourceName || 'Promarch Consulting',
      sourceUrl: job.sourceUrl || '',
      applicationMethod: hasExternalUrl ? 'external' : 'promarch',
      applicationUrl: job.applicationUrl || '',
      datePosted: job.datePosted ? job.datePosted.split('T')[0] : new Date().toISOString().split('T')[0],
      closingDate: job.closingDate ? job.closingDate.split('T')[0] : '',
      featured: job.featured,
      status: job.status
    });
    setFormDuplicateWarning(null);
    setFormError('');
    setFormSuccess('');
    setActiveTab('create');
  };

  // Duplicate Job
  const handleDuplicateJob = async (jobId: string) => {
    try {
      const cloned = await JobService.duplicateJob(jobId);
      await loadJobsData();
      handleStartEditJob(cloned);
    } catch (e: any) {
      alert(e.message || 'Failed to duplicate job.');
    }
  };

  // Toggle Publish Status
  const handleTogglePublish = async (jobId: string) => {
    try {
      await JobService.togglePublish(jobId);
      await loadJobsData();
    } catch (e: any) {
      alert(e.message);
    }
  };

  // Toggle Featured
  const handleToggleFeatured = async (jobId: string) => {
    try {
      await JobService.toggleFeatured(jobId);
      await loadJobsData();
    } catch (e: any) {
      alert(e.message);
    }
  };

  // Toggle Archive
  const handleToggleArchive = async (jobId: string) => {
    try {
      await JobService.toggleArchive(jobId);
      await loadJobsData();
    } catch (e: any) {
      alert(e.message);
    }
  };

  // Confirm Single Delete
  const handleConfirmDelete = async () => {
    if (!deleteTargetJob) return;
    try {
      await JobService.deleteJob(deleteTargetJob.id);
      setDeleteTargetJob(null);
      await loadJobsData();
    } catch (e: any) {
      alert(e.message);
    }
  };

  // Confirm Bulk Action
  const handleExecuteBulkAction = async (action: 'publish' | 'unpublish' | 'feature' | 'unfeature' | 'archive' | 'delete') => {
    if (selectedJobIds.length === 0) return;

    if (action === 'delete') {
      setBulkDeleteConfirm(true);
      return;
    }

    try {
      await JobService.executeBulkAction(selectedJobIds, action);
      setSelectedJobIds([]);
      await loadJobsData();
    } catch (e: any) {
      alert(e.message);
    }
  };

  // Confirm Bulk Delete
  const handleConfirmBulkDelete = async () => {
    try {
      await JobService.executeBulkAction(selectedJobIds, 'delete');
      setSelectedJobIds([]);
      setBulkDeleteConfirm(false);
      await loadJobsData();
    } catch (e: any) {
      alert(e.message);
    }
  };

  // Confirm Renew
  const handleConfirmRenew = async () => {
    if (!renewTargetJob) return;
    try {
      await JobService.renewJob(renewTargetJob.id, renewDays);
      setRenewTargetJob(null);
      await loadJobsData();
    } catch (e: any) {
      alert(e.message);
    }
  };

  // Export CSV
  const handleExportCsv = () => {
    const csvContent = JobService.exportJobsToCsv(allJobs);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `promarch_jobs_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Check Duplicates in Form on title or application URL change
  const handleTitleOrUrlChange = (newTitle: string, newUrl: string) => {
    const dup = JobService.detectDuplicate({
      title: newTitle,
      company: formData.company,
      applicationUrl: newUrl
    }, allJobs, editingJobId || undefined);
    setFormDuplicateWarning(dup);
  };

  // Save Job Form Submit (Create or Update)
  const handleSaveJobSubmit = async (targetStatus?: JobStatus) => {
    setFormError('');
    setFormSuccess('');

    if (!formData.title.trim()) {
      setFormError('Job Title is required.');
      return;
    }
    if (!formData.company.trim()) {
      setFormError('Company Name is required.');
      return;
    }
    if (!formData.location.trim()) {
      setFormError('Location is required.');
      return;
    }

    let finalApplicationUrl = '';
    if (formData.applicationMethod === 'external') {
      if (!formData.applicationUrl.trim()) {
        setFormError('Application URL is required when Direct External Application is selected.');
        return;
      }
      finalApplicationUrl = formData.applicationUrl.trim();
    } else {
      // Register Interest via Promarch Consulting
      finalApplicationUrl = '';
    }

    try {
      const responsibilities = formData.responsibilitiesText
        .split('\n')
        .map(s => s.trim())
        .filter(Boolean);

      const requirements = formData.requirementsText
        .split('\n')
        .map(s => s.trim())
        .filter(Boolean);

      const qualifications = formData.qualificationsText
        .split('\n')
        .map(s => s.trim())
        .filter(Boolean);

      const skills = formData.skillsText
        .split(',')
        .map(s => s.trim())
        .filter(Boolean);

      const benefits = formData.benefitsText
        .split('\n')
        .map(s => s.trim())
        .filter(Boolean);

      const cleanedSalaryTiers = formData.salaryTiers
        .filter(t => t.role && t.role.trim())
        .map(t => ({
          role: t.role.trim(),
          hourlyRate: t.hourlyRate?.trim() || '',
          hours36Yearly: t.hours36Yearly?.trim() || '',
          hours48Yearly: t.hours48Yearly?.trim() || '',
          notes: t.notes?.trim() || ''
        }));

      const jobPayload: any = {
        title: formData.title.trim(),
        slug: formData.slug.trim() || undefined,
        company: formData.company.trim(),
        companyLogo: formData.companyLogo.trim() || undefined,
        location: formData.location.trim(),
        city: formData.city.trim() || undefined,
        region: formData.region.trim() || undefined,
        country: formData.country.trim() || 'United Kingdom',
        postcode: formData.postcode.trim() || undefined,
        regionsMentioned: formData.regionsMentioned.trim() || undefined,
        salaryMin: formData.salaryMin ? Number(formData.salaryMin) : undefined,
        salaryMax: formData.salaryMax ? Number(formData.salaryMax) : undefined,
        salaryText: formData.salaryText.trim() || undefined,
        salaryPeriod: formData.salaryPeriod,
        currency: formData.currency,
        salaryTiers: cleanedSalaryTiers.length > 0 ? cleanedSalaryTiers : undefined,
        jobType: formData.jobType,
        workArrangement: formData.workArrangement,
        category: formData.category,
        shortDescription: formData.shortDescription.trim() || `Exciting opportunity for ${formData.title} with ${formData.company}.`,
        fullDescription: formData.fullDescription.trim() || undefined,
        responsibilities: responsibilities.length > 0 ? responsibilities : undefined,
        requirements: requirements.length > 0 ? requirements : undefined,
        qualifications: qualifications.length > 0 ? qualifications : undefined,
        experience: formData.experienceText.trim() || undefined,
        skills: skills.length > 0 ? skills : undefined,
        benefits: benefits.length > 0 ? benefits : undefined,
        workingHours: formData.workingHours.trim() || undefined,
        sourceName: formData.sourceName.trim() || 'Promarch Consulting',
        sourceUrl: formData.sourceUrl.trim() || undefined,
        applicationUrl: finalApplicationUrl,
        datePosted: formData.datePosted ? new Date(formData.datePosted).toISOString() : new Date().toISOString(),
        closingDate: formData.closingDate ? new Date(formData.closingDate).toISOString() : undefined,
        featured: formData.featured,
        status: targetStatus || formData.status
      };

      if (editingJobId) {
        await JobService.updateJob(editingJobId, jobPayload);
        setFormSuccess('Vacancy successfully updated.');
      } else {
        await JobService.createJob(jobPayload);
        setFormSuccess('New vacancy successfully created and saved.');
      }

      await loadJobsData();

      setTimeout(() => {
        setActiveTab('jobs');
      }, 1200);
    } catch (err: any) {
      setFormError(err.message || 'Failed to save vacancy.');
    }
  };

  // Filter Table Jobs
  const filteredTableJobs = allJobs.filter(j => {
    if (filterStatus !== 'all') {
      const isExp = JobService.isJobExpired(j);
      if (filterStatus === 'expired' && !isExp) return false;
      if (filterStatus === 'closing_soon' && (!JobService.isClosingSoon(j.closingDate) || isExp)) return false;
      if (filterStatus === 'published' && (j.status !== 'published' || isExp)) return false;
      if (filterStatus === 'draft' && j.status !== 'draft') return false;
      if (filterStatus === 'archived' && j.status !== 'archived') return false;
      if (filterStatus === 'featured' && !j.featured) return false;
    }

    if (filterCategory !== 'all' && j.category !== filterCategory) return false;

    if (tableSearch.trim()) {
      const term = tableSearch.toLowerCase().trim();
      const inTitle = j.title.toLowerCase().includes(term);
      const inCompany = j.company.toLowerCase().includes(term);
      const inLoc = j.location.toLowerCase().includes(term);
      const inSource = (j.sourceName || '').toLowerCase().includes(term);
      return inTitle || inCompany || inLoc || inSource;
    }

    return true;
  });

  // Select all checkbox
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedJobIds(filteredTableJobs.map(j => j.id));
    } else {
      setSelectedJobIds([]);
    }
  };

  // Toggle single item selection
  const handleToggleSelectOne = (jobId: string) => {
    if (selectedJobIds.includes(jobId)) {
      setSelectedJobIds(selectedJobIds.filter(id => id !== jobId));
    } else {
      setSelectedJobIds([...selectedJobIds, jobId]);
    }
  };

  // Render Login Form if unauthenticated
  if (!isAuthenticated) {
    return (
      <div className="pt-32 pb-24 min-h-screen bg-slate-900 flex items-center justify-center px-4 font-sans">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-10 shadow-2xl border border-slate-800">
          <div className="w-16 h-16 rounded-3xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-6 shadow-xs">
            <Lock size={28} />
          </div>

          <div className="text-center mb-8">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Staff Portal Access</h1>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Promarch Consulting Vacancy Management System
            </p>
          </div>

          {authError && (
            <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold flex items-center gap-2">
              <AlertCircle size={16} className="shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1.5">
                Administrator Email
              </label>
              <input
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="info@promarchconsulting.co.uk"
                required
                disabled={isLoggingIn}
                className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium text-slate-900 outline-none focus:ring-2 focus:ring-blue-600 transition-all disabled:opacity-60"
              />
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1.5">
                Password
              </label>
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="Enter password..."
                required
                disabled={isLoggingIn}
                className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium text-slate-900 outline-none focus:ring-2 focus:ring-blue-600 transition-all disabled:opacity-60"
              />
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-4 px-6 rounded-2xl font-black text-xs uppercase tracking-wider text-white shadow-lg transition-all hover:opacity-90 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
              style={{ backgroundColor: COLORS.primary }}
            >
              {isLoggingIn ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <Unlock size={14} />
                  <span>Sign In Securely</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <Link to="/" className="text-xs font-bold text-slate-500 hover:text-blue-600 transition-colors">
              ← Return to Main Website
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Authenticated Admin Dashboard
  return (
    <div className="pt-24 min-h-screen bg-slate-100 font-sans pb-24" id="admin-dashboard-container">
      {/* Admin Top Header */}
      <header className="bg-white border-b border-slate-200 sticky top-16 z-30 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
              <Briefcase size={20} />
            </div>
            <div>
              <h1 className="text-lg font-black text-slate-900 tracking-tight">
                Job Vacancy Management
              </h1>
              <span className="text-[11px] text-slate-500 font-semibold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Logged in as Super Admin
              </span>
            </div>
          </div>

          {/* Quick Actions & Navigation Bar */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            <Link
              to="/jobs"
              target="_blank"
              className="inline-flex items-center gap-1 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 border border-slate-200 transition-colors"
            >
              <span>Public Jobs</span>
              <ExternalLink size={12} />
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 border border-red-200 transition-colors"
            >
              <LogOut size={13} />
              <span>Log Out</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation Pill Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-2 overflow-x-auto no-scrollbar py-2.5 border-t border-slate-100">
          <button
            type="button"
            onClick={() => setActiveTab('analytics')}
            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'analytics'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <BarChart3 size={14} />
            <span>Overview & Analytics</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('jobs')}
            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'jobs'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Briefcase size={14} />
            <span>Manage Vacancies ({allJobs.length})</span>
          </button>

          <button
            type="button"
            onClick={handleStartCreateJob}
            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'create'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Plus size={14} />
            <span>{editingJobId ? 'Edit Vacancy' : 'Add Vacancy'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('import')}
            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'import'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Upload size={14} />
            <span>Import CSV</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('logs')}
            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'logs'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <History size={14} />
            <span>Audit Trail</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('security')}
            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'security'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Shield size={14} />
            <span>Settings & Backup</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* TAB 1: Analytics & Overview */}
        {activeTab === 'analytics' && (
          <AnalyticsOverview
            analytics={analytics}
            onNavigateTab={(t) => {
              if (t === 'create') handleStartCreateJob();
              else setActiveTab(t);
            }}
            onExportCsv={handleExportCsv}
          />
        )}

        {/* TAB 2: Manage Vacancies Table */}
        {activeTab === 'jobs' && (
          <div className="space-y-6" id="admin-manage-jobs">
            {/* Search, Filter & Bulk Controls */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                {/* Search */}
                <div className="md:col-span-5 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input
                    type="text"
                    value={tableSearch}
                    onChange={(e) => setTableSearch(e.target.value)}
                    placeholder="Search by title, company, location, or source..."
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium text-slate-900 outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                {/* Status Filter */}
                <div className="md:col-span-3">
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-full px-3.5 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-800 outline-none focus:ring-2 focus:ring-blue-600"
                  >
                    <option value="all">All Statuses ({allJobs.length})</option>
                    <option value="published">Published & Active ({analytics.activeVacancies})</option>
                    <option value="closing_soon">Closing Soon (Next 7 Days) ({analytics.expiringThisWeek})</option>
                    <option value="expired">Expired Jobs ({analytics.expiredVacancies})</option>
                    <option value="draft">Drafts ({analytics.draftVacancies})</option>
                    <option value="featured">Featured Jobs ({analytics.featuredVacancies})</option>
                    <option value="archived">Archived ({analytics.archivedVacancies})</option>
                  </select>
                </div>

                {/* Category Filter */}
                <div className="md:col-span-2">
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="w-full px-3.5 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-800 outline-none focus:ring-2 focus:ring-blue-600"
                  >
                    <option value="all">All Sectors</option>
                    {JOB_CATEGORIES.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                {/* Add Vacancy & Export Shortcuts */}
                <div className="md:col-span-2 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleStartCreateJob}
                    className="flex-1 py-3 px-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-xs transition-colors"
                  >
                    <Plus size={15} />
                    <span>Add</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      const csvContent = JobService.exportJobsToCsv(filteredTableJobs);
                      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                      const url = URL.createObjectURL(blob);
                      const link = document.createElement('a');
                      link.setAttribute('href', url);
                      link.setAttribute('download', `promarch_jobs_export_${new Date().toISOString().split('T')[0]}.csv`);
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                    }}
                    title={`Export ${filteredTableJobs.length} visible vacancies to CSV`}
                    className="py-3 px-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-black uppercase tracking-wider flex items-center justify-center transition-colors"
                  >
                    <Download size={15} />
                  </button>
                </div>
              </div>

              {/* Bulk Action Bar (Visible when items selected) */}
              {selectedJobIds.length > 0 && (
                <div className="p-3.5 bg-blue-50/80 border border-blue-200 rounded-2xl flex flex-wrap items-center justify-between gap-3 text-xs">
                  <span className="font-bold text-blue-900">
                    {selectedJobIds.length} {selectedJobIds.length === 1 ? 'vacancy' : 'vacancies'} selected
                  </span>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleExecuteBulkAction('publish')}
                      className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl font-bold text-emerald-700 shadow-2xs"
                    >
                      Publish
                    </button>
                    <button
                      type="button"
                      onClick={() => handleExecuteBulkAction('unpublish')}
                      className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl font-bold text-slate-700 shadow-2xs"
                    >
                      Unpublish
                    </button>
                    <button
                      type="button"
                      onClick={() => handleExecuteBulkAction('feature')}
                      className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl font-bold text-purple-700 shadow-2xs"
                    >
                      Mark Featured
                    </button>
                    <button
                      type="button"
                      onClick={() => handleExecuteBulkAction('unfeature')}
                      className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl font-bold text-slate-600 shadow-2xs"
                    >
                      Remove Featured
                    </button>
                    <button
                      type="button"
                      onClick={() => handleExecuteBulkAction('archive')}
                      className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl font-bold text-amber-700 shadow-2xs"
                    >
                      Archive
                    </button>
                    <button
                      type="button"
                      onClick={() => handleExecuteBulkAction('delete')}
                      className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded-xl font-bold shadow-2xs"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Vacancy Table */}
            <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-[10px] font-black uppercase tracking-wider text-slate-400 border-b border-slate-200">
                    <tr>
                      <th className="py-4 px-4 w-10">
                        <input
                          type="checkbox"
                          onChange={handleSelectAll}
                          checked={selectedJobIds.length > 0 && selectedJobIds.length === filteredTableJobs.length}
                          className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                        />
                      </th>
                      <th className="py-4 px-4">Job Title & Sector</th>
                      <th className="py-4 px-4">Employer & Location</th>
                      <th className="py-4 px-4">Type & Model</th>
                      <th className="py-4 px-4">Posted / Closing</th>
                      <th className="py-4 px-4">Status</th>
                      <th className="py-4 px-4">Metrics</th>
                      <th className="py-4 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {filteredTableJobs.map((job) => {
                      const isExp = JobService.isJobExpired(job);
                      const isClosingSoon = JobService.isClosingSoon(job.closingDate);
                      const isSelected = selectedJobIds.includes(job.id);

                      return (
                        <tr key={job.id} className={`hover:bg-slate-50/60 transition-colors ${isSelected ? 'bg-blue-50/30' : ''}`}>
                          {/* Checkbox */}
                          <td className="py-4 px-4">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => handleToggleSelectOne(job.id)}
                              className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                            />
                          </td>

                          {/* Title & Category */}
                          <td className="py-4 px-4">
                            <div className="space-y-1">
                              <div className="flex items-center gap-1.5">
                                <span className="font-black text-slate-900 hover:text-blue-600 transition-colors cursor-pointer" onClick={() => handleStartEditJob(job)}>
                                  {job.title}
                                </span>
                                {job.featured && (
                                  <span className="p-0.5 rounded bg-blue-100 text-blue-700" title="Featured Vacancy">
                                    <Sparkles size={11} />
                                  </span>
                                )}
                              </div>
                              <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">
                                {job.category}
                              </span>
                            </div>
                          </td>

                          {/* Company & Location */}
                          <td className="py-4 px-4">
                            <div className="text-slate-800 font-bold">{job.company}</div>
                            <div className="text-slate-500 text-[11px]">{job.location}</div>
                          </td>

                          {/* Type & Model */}
                          <td className="py-4 px-4">
                            <span className="inline-block px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-700 mb-1">
                              {job.jobType}
                            </span>
                            <div className="text-slate-400 text-[10px]">{job.workArrangement}</div>
                          </td>

                          {/* Dates */}
                          <td className="py-4 px-4">
                            <div className="text-slate-700 text-[11px]">
                              {new Date(job.datePosted).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                            </div>
                            {job.closingDate ? (
                              <div className={`text-[10px] ${isExp ? 'text-red-500 font-bold' : isClosingSoon ? 'text-amber-600 font-bold' : 'text-slate-400'}`}>
                                Close: {new Date(job.closingDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                              </div>
                            ) : (
                              <div className="text-slate-400 text-[10px]">Open-ended</div>
                            )}
                          </td>

                          {/* Status */}
                          <td className="py-4 px-4">
                            {isExp ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-red-50 text-red-700 border border-red-200">
                                Expired
                              </span>
                            ) : job.status === 'published' ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                Published
                              </span>
                            ) : job.status === 'draft' ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
                                Draft
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                                Archived
                              </span>
                            )}
                          </td>

                          {/* Metrics */}
                          <td className="py-4 px-4">
                            <div className="text-[11px] text-slate-700 font-bold">
                              {job.views || 0} views
                            </div>
                            <div className="text-[10px] text-slate-400">
                              {job.applyClicks || 0} clicks
                            </div>
                          </td>

                          {/* Action Buttons */}
                          <td className="py-4 px-4 text-right">
                            <div className="flex items-center justify-end gap-1">
                              {/* Public view */}
                              <Link
                                to={`/jobs/${job.slug}`}
                                target="_blank"
                                className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-slate-100 transition-colors"
                                title="View Public Page"
                              >
                                <Eye size={14} />
                              </Link>

                              {/* Edit */}
                              <button
                                type="button"
                                onClick={() => handleStartEditJob(job)}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-slate-100 transition-colors"
                                title="Edit Vacancy"
                              >
                                <Edit size={14} />
                              </button>

                              {/* Duplicate */}
                              <button
                                type="button"
                                onClick={() => handleDuplicateJob(job.id)}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-purple-600 hover:bg-slate-100 transition-colors"
                                title="Duplicate Vacancy"
                              >
                                <Copy size={14} />
                              </button>

                              {/* Toggle Publish */}
                              <button
                                type="button"
                                onClick={() => handleTogglePublish(job.id)}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-slate-100 transition-colors"
                                title={job.status === 'published' ? 'Unpublish to Draft' : 'Publish to Live'}
                              >
                                {job.status === 'published' ? <XCircle size={14} /> : <CheckCircle2 size={14} />}
                              </button>

                              {/* Renew if expired */}
                              {isExp && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setRenewTargetJob(job);
                                    setRenewDays(30);
                                  }}
                                  className="p-1.5 rounded-lg text-amber-600 hover:bg-amber-50 transition-colors"
                                  title="Renew / Extend Vacancy"
                                >
                                  <RefreshCw size={14} />
                                </button>
                              )}

                              {/* Delete */}
                              <button
                                type="button"
                                onClick={() => setDeleteTargetJob(job)}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-slate-100 transition-colors"
                                title="Delete Permanently"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {filteredTableJobs.length === 0 && (
                <div className="p-12 text-center text-slate-500 text-xs font-medium">
                  No vacancies found matching the current search & status filters.
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: Add / Edit Vacancy Comprehensive Form */}
        {activeTab === 'create' && (
          <div className="space-y-8" id="admin-job-form">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black text-slate-900 tracking-tight">
                  {editingJobId ? 'Edit Vacancy Posting' : 'Create New Job Vacancy'}
                </h2>
                <p className="text-xs text-slate-500 font-medium mt-1">
                  Complete all structured fields to ensure optimal candidate discovery, structured schema rendering, and clean routing.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setActiveTab('jobs')}
                className="text-xs font-bold text-slate-600 hover:text-slate-900 px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors"
              >
                Back to Vacancies
              </button>
            </div>

            {/* Error / Success Alerts */}
            {formError && (
              <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold flex items-center gap-2">
                <AlertCircle size={16} className="shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            {formSuccess && (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 size={16} className="shrink-0" />
                <span>{formSuccess}</span>
              </div>
            )}

            {/* Duplicate Detection Warning */}
            {formDuplicateWarning && (
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold flex items-start gap-2.5">
                <AlertTriangle size={18} className="shrink-0 mt-0.5 text-amber-600" />
                <div>
                  <strong className="font-black block">Potential Duplicate Vacancy Detected:</strong>
                  Matches existing role: <Link to={`/jobs/${formDuplicateWarning.existingJob.slug}`} target="_blank" className="underline font-bold">{formDuplicateWarning.existingJob.title}</Link> ({formDuplicateWarning.reasons.join(', ')}).
                </div>
              </div>
            )}

            <form onSubmit={(e) => { e.preventDefault(); handleSaveJobSubmit('published'); }} className="space-y-8">
              {/* Section 1: Basic Information */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-3 flex items-center gap-2">
                  <Briefcase size={16} className="text-blue-600" />
                  <span>1. Basic Role Information</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  {/* Title */}
                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1.5">
                      Job Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => {
                        setFormData({ ...formData, title: e.target.value });
                        handleTitleOrUrlChange(e.target.value, formData.applicationUrl);
                      }}
                      placeholder="e.g. Senior Care Assistant (Night Shifts)"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm font-bold text-slate-900 outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>

                  {/* Company */}
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1.5">
                      Company / Employer *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      placeholder="e.g. St. Jude Healthcare Services"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm font-semibold text-slate-900 outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>

                  {/* Company Logo */}
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1.5">
                      Company Logo URL (Optional)
                    </label>
                    <input
                      type="url"
                      value={formData.companyLogo}
                      onChange={(e) => setFormData({ ...formData, companyLogo: e.target.value })}
                      placeholder="https://example.com/logo.png"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm text-slate-900 outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>

                  {/* Location */}
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1.5">
                      Display Location *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      placeholder="e.g. Camden, London, UK"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm font-semibold text-slate-900 outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>

                  {/* City */}
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1.5">
                      City / Town
                    </label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      placeholder="e.g. London"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm text-slate-900 outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>

                  {/* Region / County */}
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1.5">
                      Region / County
                    </label>
                    <input
                      type="text"
                      value={formData.region}
                      onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                      placeholder="e.g. Greater London"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm text-slate-900 outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>

                  {/* Postcode */}
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1.5">
                      Postcode / Area Code
                    </label>
                    <input
                      type="text"
                      value={formData.postcode}
                      onChange={(e) => setFormData({ ...formData, postcode: e.target.value })}
                      placeholder="e.g. EC2V 6AU or N15 3TH"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm text-slate-900 outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>

                  {/* Specific Boroughs / Regions Mentioned */}
                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1.5">
                      Boroughs / Target Locations Mentioned (Optional)
                    </label>
                    <input
                      type="text"
                      value={formData.regionsMentioned}
                      onChange={(e) => setFormData({ ...formData, regionsMentioned: e.target.value })}
                      placeholder="e.g. Haringey, Greater London or City of London, Greater London"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm text-slate-900 outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Employment & Compensation */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-3 flex items-center gap-2">
                  <Layers size={16} className="text-blue-600" />
                  <span>2. Employment & Compensation</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                  {/* Category */}
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1.5">
                      Industry Sector *
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm font-bold text-slate-800 outline-none focus:ring-2 focus:ring-blue-600"
                    >
                      {JOB_CATEGORIES.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  {/* Job Type */}
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1.5">
                      Job Type *
                    </label>
                    <select
                      value={formData.jobType}
                      onChange={(e) => setFormData({ ...formData, jobType: e.target.value as JobType })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm font-bold text-slate-800 outline-none focus:ring-2 focus:ring-blue-600"
                    >
                      {JOB_TYPES.map(t => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>

                  {/* Work Arrangement */}
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1.5">
                      Work Model *
                    </label>
                    <select
                      value={formData.workArrangement}
                      onChange={(e) => setFormData({ ...formData, workArrangement: e.target.value as WorkArrangement })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm font-bold text-slate-800 outline-none focus:ring-2 focus:ring-blue-600"
                    >
                      {WORK_ARRANGEMENTS.map(wa => (
                        <option key={wa} value={wa}>{wa}</option>
                      ))}
                    </select>
                  </div>

                  {/* Working Hours */}
                  <div className="sm:col-span-3">
                    <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1.5">
                      Working Hours / Shift Schedule
                    </label>
                    <input
                      type="text"
                      value={formData.workingHours}
                      onChange={(e) => setFormData({ ...formData, workingHours: e.target.value })}
                      placeholder="e.g. 40 hours per week (12-month Fixed Term Contract) or Full-time, Permanent (37.5 hours)"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm font-semibold text-slate-900 outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                </div>

                {/* Salary Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 pt-4 border-t border-slate-100">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1.5">
                      Currency
                    </label>
                    <select
                      value={formData.currency}
                      onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm font-bold text-slate-800 outline-none focus:ring-2 focus:ring-blue-600"
                    >
                      <option value="£">£ (GBP)</option>
                      <option value="$">$ (USD)</option>
                      <option value="€">€ (EUR)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1.5">
                      Salary Period
                    </label>
                    <select
                      value={formData.salaryPeriod}
                      onChange={(e) => setFormData({ ...formData, salaryPeriod: e.target.value as SalaryPeriod })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm font-bold text-slate-800 outline-none focus:ring-2 focus:ring-blue-600"
                    >
                      <option value="per year">per year</option>
                      <option value="per hour">per hour</option>
                      <option value="per day">per day</option>
                      <option value="per month">per month</option>
                      <option value="competitive">competitive</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1.5">
                      Salary Minimum
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={formData.salaryMin}
                      onChange={(e) => setFormData({ ...formData, salaryMin: e.target.value })}
                      placeholder="e.g. 50000"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm font-semibold text-slate-900 outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1.5">
                      Salary Maximum
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={formData.salaryMax}
                      onChange={(e) => setFormData({ ...formData, salaryMax: e.target.value })}
                      placeholder="e.g. 55000"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm font-semibold text-slate-900 outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1.5">
                      Salary Display Text
                    </label>
                    <input
                      type="text"
                      value={formData.salaryText}
                      onChange={(e) => setFormData({ ...formData, salaryText: e.target.value })}
                      placeholder="e.g. £50,000 - £55,000 per year"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm font-semibold text-slate-900 outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                </div>

                {/* Structured Salary Tiers / Pay Bands */}
                <div className="pt-6 border-t border-slate-100 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-2">
                        <span>Structured Pay Tiers / Shift Bands</span>
                        <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                          {formData.salaryTiers.length} added
                        </span>
                      </h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Define role-specific rates, night/weekend premiums, or structured annual bands (36h / 48h equivalents).
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleAddSalaryTier}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold rounded-xl transition-colors self-start sm:self-auto"
                    >
                      <Plus size={14} />
                      <span>Add Salary Tier</span>
                    </button>
                  </div>

                  {formData.salaryTiers.length === 0 ? (
                    <div className="bg-slate-50 rounded-2xl border border-dashed border-slate-200 p-6 text-center">
                      <p className="text-xs text-slate-500 font-medium">No structured salary tiers added. Click &quot;Add Salary Tier&quot; if this position has multi-level pay rates or hourly shift options.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {formData.salaryTiers.map((tier, idx) => (
                        <div key={idx} className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-3">
                          <div className="flex items-center justify-between pb-2 border-b border-slate-200/80">
                            <span className="text-xs font-bold text-slate-700">Salary Tier #{idx + 1}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveSalaryTier(idx)}
                              className="text-red-500 hover:text-red-700 text-xs flex items-center gap-1 font-bold"
                            >
                              <Trash2 size={13} />
                              <span>Remove Tier</span>
                            </button>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                            <div className="sm:col-span-2">
                              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                                Role / Shift Label *
                              </label>
                              <input
                                type="text"
                                value={tier.role}
                                onChange={(e) => handleUpdateSalaryTier(idx, 'role', e.target.value)}
                                placeholder="e.g. Healthcare Support Worker (Day)"
                                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 outline-none focus:ring-1 focus:ring-blue-600"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                                Hourly / Base Rate
                              </label>
                              <input
                                type="text"
                                value={tier.hourlyRate}
                                onChange={(e) => handleUpdateSalaryTier(idx, 'hourlyRate', e.target.value)}
                                placeholder="e.g. £13.50 / hour"
                                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 outline-none focus:ring-1 focus:ring-blue-600"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                                Annual (36 hrs/wk)
                              </label>
                              <input
                                type="text"
                                value={tier.hours36Yearly}
                                onChange={(e) => handleUpdateSalaryTier(idx, 'hours36Yearly', e.target.value)}
                                placeholder="e.g. £25,272"
                                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 outline-none focus:ring-1 focus:ring-blue-600"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                                Annual (48 hrs/wk)
                              </label>
                              <input
                                type="text"
                                value={tier.hours48Yearly}
                                onChange={(e) => handleUpdateSalaryTier(idx, 'hours48Yearly', e.target.value)}
                                placeholder="e.g. £33,696"
                                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 outline-none focus:ring-1 focus:ring-blue-600"
                              />
                            </div>
                            <div className="sm:col-span-2 md:col-span-3">
                              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                                Tier Notes / Benefits (Optional)
                              </label>
                              <input
                                type="text"
                                value={tier.notes || ''}
                                onChange={(e) => handleUpdateSalaryTier(idx, 'notes', e.target.value)}
                                placeholder="e.g. Enhanced pension contribution and performance bonus"
                                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 outline-none focus:ring-1 focus:ring-blue-600"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Section 3: Detailed Descriptions & Lists */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-3 flex items-center gap-2">
                  <Edit size={16} className="text-blue-600" />
                  <span>3. Vacancy Description & Specifications</span>
                </h3>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1.5">
                    Short Summary (Displayed on Job Cards) *
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={formData.shortDescription}
                    onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                    placeholder="Brief 1-2 sentence overview of the role..."
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm font-medium text-slate-900 outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1.5">
                    Full Detailed Role Description
                  </label>
                  <textarea
                    rows={5}
                    value={formData.fullDescription}
                    onChange={(e) => setFormData({ ...formData, fullDescription: e.target.value })}
                    placeholder="Comprehensive job description..."
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm font-medium text-slate-900 outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1.5">
                      Key Responsibilities (One per line)
                    </label>
                    <textarea
                      rows={4}
                      value={formData.responsibilitiesText}
                      onChange={(e) => setFormData({ ...formData, responsibilitiesText: e.target.value })}
                      placeholder="Supervise team on shift&#10;Administer medication safely&#10;Conduct care audits"
                      className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-mono text-slate-900 outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1.5">
                      Requirements & Criteria (One per line)
                    </label>
                    <textarea
                      rows={4}
                      value={formData.requirementsText}
                      onChange={(e) => setFormData({ ...formData, requirementsText: e.target.value })}
                      placeholder="NVQ Level 3 in Health & Social Care&#10;2+ years UK care experience&#10;Enhanced DBS certificate"
                      className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-mono text-slate-900 outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1.5">
                      Skills (Comma separated)
                    </label>
                    <input
                      type="text"
                      value={formData.skillsText}
                      onChange={(e) => setFormData({ ...formData, skillsText: e.target.value })}
                      placeholder="Medication Administration, First Aid, Care Planning"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium text-slate-900 outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1.5">
                      Benefits & Perks (One per line)
                    </label>
                    <textarea
                      rows={3}
                      value={formData.benefitsText}
                      onChange={(e) => setFormData({ ...formData, benefitsText: e.target.value })}
                      placeholder="Paid Training&#10;Company Pension&#10;Free Uniform"
                      className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-mono text-slate-900 outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                </div>
              </div>

              {/* Section 4: Application Routing & Dates */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-3 flex items-center gap-2">
                  <ExternalLink size={16} className="text-blue-600" />
                  <span>4. Application Routing & Publishing</span>
                </h3>

                {/* Application Method Selection */}
                <div className="space-y-3">
                  <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500">
                    Candidate Application / Interest Method *
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, applicationMethod: 'promarch', applicationUrl: '' }))}
                      className={`p-4 rounded-2xl border text-left transition-all ${
                        formData.applicationMethod === 'promarch'
                          ? 'border-blue-600 bg-blue-50/50 ring-1 ring-blue-600'
                          : 'border-slate-200 bg-slate-50 hover:bg-slate-100/70'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-slate-900">Register Interest via Promarch</span>
                        <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                          formData.applicationMethod === 'promarch' ? 'border-blue-600' : 'border-slate-300'
                        }`}>
                          {formData.applicationMethod === 'promarch' && <span className="w-2 h-2 rounded-full bg-blue-600" />}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1 font-medium">
                        Candidates register interest directly through Promarch Consulting (e.g. healthcare, managed staffing roles).
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, applicationMethod: 'external' }))}
                      className={`p-4 rounded-2xl border text-left transition-all ${
                        formData.applicationMethod === 'external'
                          ? 'border-blue-600 bg-blue-50/50 ring-1 ring-blue-600'
                          : 'border-slate-200 bg-slate-50 hover:bg-slate-100/70'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-slate-900">Direct External Application URL</span>
                        <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                          formData.applicationMethod === 'external' ? 'border-blue-600' : 'border-slate-300'
                        }`}>
                          {formData.applicationMethod === 'external' && <span className="w-2 h-2 rounded-full bg-blue-600" />}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1 font-medium">
                        Directs candidate to client portal, ATS, or corporate application page (e.g. Veolia, corporate clients).
                      </p>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 pt-2">
                  {formData.applicationMethod === 'external' ? (
                    <div className="md:col-span-2">
                      <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1.5">
                        External Application URL (Destination for Apply Button) *
                      </label>
                      <input
                        type="url"
                        required={formData.applicationMethod === 'external'}
                        value={formData.applicationUrl}
                        onChange={(e) => {
                          setFormData({ ...formData, applicationUrl: e.target.value });
                          handleTitleOrUrlChange(formData.title, e.target.value);
                        }}
                        placeholder="https://client.careers.com/job/12345"
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold text-slate-900 outline-none focus:ring-2 focus:ring-blue-600"
                      />
                    </div>
                  ) : (
                    <div className="md:col-span-2 p-3.5 bg-blue-50/50 border border-blue-100 rounded-2xl flex items-center gap-2.5 text-xs text-blue-900 font-medium">
                      <CheckCircle2 size={16} className="text-blue-600 shrink-0" />
                      <span>Candidates clicking &quot;Register Interest&quot; will be guided to submit their details directly to the Promarch recruitment team.</span>
                    </div>
                  )}

                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1.5">
                      Source / Client Name
                    </label>
                    <input
                      type="text"
                      value={formData.sourceName}
                      onChange={(e) => setFormData({ ...formData, sourceName: e.target.value })}
                      placeholder="e.g. Promarch Consulting, Veolia UK, or Alderstone"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold text-slate-900 outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1.5">
                      Source / Posting Reference URL (Optional)
                    </label>
                    <input
                      type="url"
                      value={formData.sourceUrl}
                      onChange={(e) => setFormData({ ...formData, sourceUrl: e.target.value })}
                      placeholder="https://example.com/original-posting"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold text-slate-900 outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1.5">
                      Date Posted
                    </label>
                    <input
                      type="date"
                      value={formData.datePosted}
                      onChange={(e) => setFormData({ ...formData, datePosted: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold text-slate-900 outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                        Closing Date (Optional)
                      </label>
                      {formData.closingDate && (
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, closingDate: '' })}
                          className="text-[10px] font-bold text-blue-600 hover:text-blue-800"
                        >
                          Clear (Ongoing)
                        </button>
                      )}
                    </div>
                    <input
                      type="date"
                      value={formData.closingDate}
                      onChange={(e) => setFormData({ ...formData, closingDate: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold text-slate-900 outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                </div>

                {/* Status & Featured Toggles */}
                <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.featured}
                      onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-xs font-bold text-slate-800">Feature this Vacancy on Homepage & Top of Search</span>
                  </label>

                  <div className="flex items-center gap-2">
                    <label className="text-[10px] font-black uppercase tracking-wider text-slate-500">Default Status:</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as JobStatus })}
                      className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none"
                    >
                      <option value="published">Published</option>
                      <option value="draft">Draft</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('jobs')}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-2xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 text-xs font-black uppercase tracking-wider transition-colors"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={() => handleSaveJobSubmit('draft')}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-black uppercase tracking-wider transition-colors shadow-xs"
                >
                  Save as Draft
                </button>

                <button
                  type="submit"
                  className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-black uppercase tracking-wider transition-colors shadow-md flex items-center justify-center gap-2"
                >
                  <Save size={15} />
                  <span>{editingJobId ? 'Update & Publish' : 'Publish Vacancy Live'}</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 4: CSV Import */}
        {activeTab === 'import' && (
          <CsvImportView
            onImportCompleted={async () => {
              await loadJobsData();
              setActiveTab('jobs');
            }}
          />
        )}

        {/* TAB 5: Audit Log */}
        {activeTab === 'logs' && <ActivityLogView />}

        {/* TAB 6: Settings & Backup */}
        {activeTab === 'security' && (
          <div className="space-y-6" id="admin-security-view">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-5">
              <h3 className="text-base font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <ShieldCheck size={18} className="text-blue-600" />
                <span>Security & Administrator Access</span>
              </h3>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5 text-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 py-1 border-b border-slate-200/60">
                  <span className="font-bold text-slate-500">Authorized Administrator:</span>
                  <span className="font-mono font-bold text-slate-900">info@promarchconsulting.co.uk</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 py-1 border-b border-slate-200/60">
                  <span className="font-bold text-slate-500">Authentication Authority:</span>
                  <span className="font-bold text-emerald-700">Hostinger PHP / MySQL Database</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 py-1">
                  <span className="font-bold text-slate-500">Session Security:</span>
                  <span className="text-slate-600">Strict HTTP-Only Cookie Session & CSRF Token Verification</span>
                </div>
              </div>

              <p className="text-xs text-slate-500 leading-relaxed">
                Administrator credentials and password hashes are secured directly in the MySQL database via bcrypt. Administrative authentication is verified exclusively on the PHP server runtime.
              </p>
            </div>

            {/* Backup & Maintenance */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
              <h3 className="text-base font-black text-slate-900 uppercase tracking-wider">
                Database Backup & Export
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed font-normal">
                Export all active, draft, and expired vacancies as a clean CSV file with all custom fields.
              </p>

              <button
                type="button"
                onClick={handleExportCsv}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-black uppercase tracking-wider transition-colors"
              >
                <Download size={14} />
                <span>Export Full Jobs Database (CSV)</span>
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Delete Confirmation Modal */}
      {deleteTargetJob && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-200 text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto">
              <Trash2 size={24} />
            </div>
            <h4 className="text-lg font-black text-slate-900">Delete Vacancy?</h4>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              Are you sure you want to permanently delete <strong className="text-slate-900">"{deleteTargetJob.title}"</strong>? This action cannot be undone.
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteTargetJob(null)}
                className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-black uppercase tracking-wider hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-black uppercase tracking-wider shadow-sm"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Delete Modal */}
      {bulkDeleteConfirm && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-200 text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto">
              <Trash2 size={24} />
            </div>
            <h4 className="text-lg font-black text-slate-900">Delete Multiple Vacancies?</h4>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              Are you sure you want to permanently delete <strong className="text-slate-900">{selectedJobIds.length}</strong> selected vacancies?
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setBulkDeleteConfirm(false)}
                className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-black uppercase tracking-wider hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmBulkDelete}
                className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-black uppercase tracking-wider shadow-sm"
              >
                Delete Selected
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Renew Modal */}
      {renewTargetJob && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-200 space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mx-auto">
              <RefreshCw size={24} />
            </div>
            <div className="text-center">
              <h4 className="text-lg font-black text-slate-900">Renew & Extend Vacancy</h4>
              <p className="text-xs text-slate-500 mt-1 font-medium">
                "{renewTargetJob.title}"
              </p>
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1.5">
                Extend Expiration By:
              </label>
              <select
                value={renewDays}
                onChange={(e) => setRenewDays(Number(e.target.value))}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-800 outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value={14}>+14 Days (2 Weeks)</option>
                <option value={30}>+30 Days (1 Month)</option>
                <option value={60}>+60 Days (2 Months)</option>
                <option value={90}>+90 Days (3 Months)</option>
              </select>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setRenewTargetJob(null)}
                className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-black uppercase tracking-wider hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmRenew}
                className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-black uppercase tracking-wider shadow-sm"
              >
                Extend & Publish
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
