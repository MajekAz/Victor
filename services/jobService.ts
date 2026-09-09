import { Job, JobFilterParams, JobAnalytics, AdminActivityLog, DuplicateMatch, CsvImportSummary, CsvImportRecord } from '../types.ts';

const STORAGE_KEY = 'promarch_jobs_v2';
const LOGS_STORAGE_KEY = 'promarch_admin_logs_v1';
const VIEWS_TRACK_KEY = 'promarch_viewed_jobs';

// Identifiers for previous demo/seed vacancies to permanently purge
const DEMO_JOB_IDS = new Set([
  'pm-job-001',
  'pm-job-002',
  'pm-job-003',
  'pm-job-004',
  'pm-job-005',
  'pm-job-006'
]);

// Real UK job vacancies supplied by Muve Healthcare to Promarch Consulting
const SEED_JOBS: Job[] = [
  {
    id: 'muve-job-001',
    title: 'Healthcare Support Worker / Complex Support Worker',
    slug: 'healthcare-support-worker-complex-support-worker-muve-healthcare',
    company: 'Muve Healthcare',
    companyLogo: '',
    location: 'United Kingdom – Nationwide',
    city: '',
    region: 'Nationwide (England, Scotland, Wales and Northern Ireland)',
    country: 'United Kingdom',
    postcode: '',
    salaryMin: 14.50,
    salaryMax: 16.00,
    salaryText: '£14.50 – £16.00 per hour',
    salaryPeriod: 'per hour',
    currency: '£',
    salaryTiers: [
      {
        role: 'Support Worker',
        hourlyRate: '£14.50 / hour',
        hours36Yearly: '£27,144 / year',
        hours48Yearly: '£36,192 / year'
      },
      {
        role: 'Complex Support Worker',
        hourlyRate: '£16.00 / hour',
        hours36Yearly: '£29,952 / year',
        hours48Yearly: '£39,936 / year'
      }
    ],
    jobType: 'Contract',
    workArrangement: 'On-site',
    category: 'Healthcare & Social Care',
    shortDescription: 'Muve Healthcare is recruiting Support Workers and Complex Support Workers as part of a new cohort of Local Authority and ICB direct-award contracts. Opportunities are available across a range of healthcare and complex-support settings throughout the UK.',
    fullDescription: `Muve Healthcare is mobilising a new cohort of Local Authority and ICB direct-award contracts and is recruiting healthcare professionals and support staff for opportunities across the United Kingdom.

Support opportunities cover areas including Mental Health, Learning Disabilities, Autism, Complex Care, Positive Behaviour Support, 3:1 and 4:1 support, tracheostomy, ventilation, PEG, PICU and ICU environments.

Available contract options include 36-hour and 48-hour arrangements.`,
    responsibilities: [
      'Mental Health (MH)',
      'Learning Disabilities (LD)',
      'Autism',
      'Complex Care',
      'Positive Behaviour Support (PBS)',
      '3:1 / 4:1 Support',
      'Tracheostomy',
      'Ventilation',
      'PEG',
      'PICU',
      'ICU'
    ],
    skills: [
      'Mental Health Support',
      'Learning Disabilities',
      'Autism Care',
      'Complex Care',
      'Positive Behaviour Support (PBS)',
      '3:1 / 4:1 Support',
      'Tracheostomy Care',
      'Ventilation',
      'PEG Feeding',
      'PICU',
      'ICU'
    ],
    benefits: [
      'Weekly pay',
      'Consistent work opportunities',
      '36 and 48-hour contracts',
      'Rotas available up to 6 months in advance',
      'App-based rota management',
      'Digital care planning',
      'Internal training and development',
      '24/7 MDT support',
      'Support across CAMHS, RMN/RNLD, PICU, ICU, PBS, Service Management and Quality/Governance'
    ],
    workingHours: '36-hour and 48-hour contracts available',
    regionsMentioned: 'England, Scotland, Wales and Northern Ireland',
    sourceName: 'Muve Healthcare recruitment information supplied to Promarch Consulting',
    sourceUrl: '',
    applicationUrl: '',
    datePosted: '2026-09-09T09:00:00.000Z',
    featured: true,
    status: 'published',
    createdAt: '2026-09-09T09:00:00.000Z',
    updatedAt: '2026-09-09T09:00:00.000Z',
    createdBy: 'Muve Healthcare',
    views: 0,
    applyClicks: 0
  },
  {
    id: 'muve-job-002',
    title: 'Registered Nurse – RGN / RMN / RNLD / ICU / RCN',
    slug: 'registered-nurse-rgn-rmn-rnld-icu-rcn-muve-healthcare',
    company: 'Muve Healthcare',
    companyLogo: '',
    location: 'United Kingdom – Nationwide',
    city: '',
    region: 'Nationwide (England, Scotland, Wales and Northern Ireland)',
    country: 'United Kingdom',
    postcode: '',
    salaryMin: 25.00,
    salaryMax: 27.00,
    salaryText: '£25.00 – £27.00 per hour',
    salaryPeriod: 'per hour',
    currency: '£',
    salaryTiers: [
      {
        role: 'RGN / RMN / RNLD',
        hourlyRate: '£25.00 / hour',
        hours36Yearly: '£46,800 / year',
        hours48Yearly: '£62,400 / year'
      },
      {
        role: 'ICU / RCN',
        hourlyRate: '£27.00 / hour',
        hours36Yearly: '£50,544 / year',
        hours48Yearly: '£67,392 / year'
      }
    ],
    jobType: 'Contract',
    workArrangement: 'On-site',
    category: 'Healthcare & Nursing',
    shortDescription: 'Muve Healthcare is recruiting registered nurses across RGN, RMN, RNLD, ICU and RCN roles as part of a new cohort of Local Authority and ICB direct-award contracts, with healthcare opportunities available across the UK.',
    fullDescription: `Muve Healthcare is mobilising a new cohort of Local Authority and ICB direct-award contracts and is recruiting qualified nursing professionals across a range of healthcare settings.

Current nursing opportunities include RGN, RMN, RNLD, ICU and RCN roles, with services covering areas including Mental Health, Learning Disabilities, Complex Care, Positive Behaviour Support, PICU and ICU.

Available contract options include 36-hour and 48-hour arrangements.`,
    responsibilities: [
      'RGN',
      'RMN',
      'RNLD',
      'ICU',
      'RCN',
      'Mental Health',
      'Learning Disabilities',
      'PICU',
      'Complex Care',
      'Positive Behaviour Support'
    ],
    skills: [
      'RGN Nursing',
      'RMN (Mental Health)',
      'RNLD (Learning Disabilities)',
      'ICU Nursing',
      'RCN (Children\'s Nursing)',
      'Mental Health Care',
      'Learning Disabilities Support',
      'Complex Care',
      'Positive Behaviour Support (PBS)',
      'PICU Care'
    ],
    benefits: [
      'Weekly pay',
      'Consistent work opportunities',
      '36 and 48-hour contracts',
      'Rotas available up to 6 months in advance',
      'App-based rota management',
      'Digital care planning',
      'Internal training and development',
      '24/7 MDT support',
      'Support across CAMHS, RMN/RNLD, PICU, ICU, PBS, Service Management and Quality/Governance'
    ],
    workingHours: '36-hour and 48-hour contracts available',
    regionsMentioned: 'England, Scotland, Wales and Northern Ireland',
    sourceName: 'Muve Healthcare recruitment information supplied to Promarch Consulting',
    sourceUrl: '',
    applicationUrl: '',
    datePosted: '2026-09-09T09:00:00.000Z',
    featured: true,
    status: 'published',
    createdAt: '2026-09-09T09:00:00.000Z',
    updatedAt: '2026-09-09T09:00:00.000Z',
    createdBy: 'Muve Healthcare',
    views: 0,
    applyClicks: 0
  }
];

export class JobService {
  // Read all jobs from storage, purge demo jobs, and ensure real vacancies exist
  private static loadJobsFromStorage(): Job[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY) || localStorage.getItem('promarch_jobs_v1');
      let currentList: Job[] = [];

      if (raw) {
        try {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) {
            // Delete all demo/seed jobs and placeholders
            currentList = parsed.filter(j => !DEMO_JOB_IDS.has(j.id) && j.createdBy !== 'System Seed');
          }
        } catch (e) {
          console.error('Error parsing stored jobs:', e);
        }
      }

      // Ensure both Muve Healthcare real vacancies exist in the active collection
      const existingIds = new Set(currentList.map(j => j.id));
      let updated = false;

      for (const seed of SEED_JOBS) {
        if (!existingIds.has(seed.id)) {
          currentList.push({ ...seed });
          updated = true;
        }
      }

      // If any demo jobs were purged or new real vacancies seeded, persist back immediately
      if (updated || !raw || currentList.length !== (raw ? JSON.parse(raw).length : 0)) {
        this.saveJobsToStorage(currentList);
      }

      return currentList;
    } catch (e) {
      console.error('Failed to parse jobs from localStorage:', e);
      return [...SEED_JOBS];
    }
  }

  // Save jobs to storage
  private static saveJobsToStorage(jobs: Job[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(jobs));
    } catch (e) {
      console.error('Failed to save jobs to localStorage:', e);
    }
  }

  // Audit Log recording
  public static logActivity(action: AdminActivityLog['action'], details: string, jobId?: string, jobTitle?: string, user: string = 'Admin'): void {
    try {
      const logs = this.getActivityLogs();
      const newLog: AdminActivityLog = {
        id: 'log-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
        action,
        details,
        jobId,
        jobTitle,
        timestamp: new Date().toISOString(),
        user
      };
      logs.unshift(newLog);
      // Keep last 150 entries
      const trimmed = logs.slice(0, 150);
      localStorage.setItem(LOGS_STORAGE_KEY, JSON.stringify(trimmed));
    } catch (e) {
      console.error('Failed to record activity log:', e);
    }
  }

  public static getActivityLogs(): AdminActivityLog[] {
    try {
      const raw = localStorage.getItem(LOGS_STORAGE_KEY);
      if (!raw) return [];
      return JSON.parse(raw) || [];
    } catch (e) {
      return [];
    }
  }

  // Generate SEO slug safely
  public static generateSlug(title: string, company?: string, existingJobs?: Job[], currentJobId?: string): string {
    let base = title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');

    if (!base) base = 'job-vacancy';

    if (company && company.toLowerCase() !== 'promarch consulting') {
      const compSlug = company.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-');
      if (compSlug && !base.includes(compSlug)) {
        base = `${base}-${compSlug}`;
      }
    }

    const all = existingJobs || this.loadJobsFromStorage();
    let finalSlug = base;
    let counter = 1;

    while (all.some(j => j.slug === finalSlug && j.id !== currentJobId)) {
      counter++;
      finalSlug = `${base}-${counter}`;
    }

    return finalSlug;
  }

  // Check if job is expired based on current date
  public static isJobExpired(job: Job): boolean {
    if (!job.closingDate) return false;
    const closing = new Date(job.closingDate).getTime();
    return closing < Date.now();
  }

  // Check if closing soon (within 7 days)
  public static isClosingSoon(closingDate?: string): boolean {
    if (!closingDate) return false;
    const closing = new Date(closingDate).getTime();
    const now = Date.now();
    const sevenDays = 7 * 24 * 60 * 60 * 1000;
    return closing > now && closing - now <= sevenDays;
  }

  // Public Query (Only active & published)
  public static async getJobs(params: JobFilterParams = {}): Promise<{ jobs: Job[]; total: number; categories: string[] }> {
    const all = this.loadJobsFromStorage();

    // Derive all unique categories from available records
    const categories = Array.from(new Set(all.map(j => j.category).filter(Boolean))).sort();

    // Filter published and non-expired for public
    let filtered = all.filter(j => {
      if (j.status !== 'published') return false;
      if (this.isJobExpired(j)) return false;
      return true;
    });

    // Search term (title, skills, description, company)
    if (params.searchTerm && params.searchTerm.trim()) {
      const term = params.searchTerm.toLowerCase().trim();
      filtered = filtered.filter(j => {
        const inTitle = j.title.toLowerCase().includes(term);
        const inCompany = j.company.toLowerCase().includes(term);
        const inDesc = j.shortDescription.toLowerCase().includes(term) || (j.fullDescription || '').toLowerCase().includes(term);
        const inSkills = j.skills?.some(s => s.toLowerCase().includes(term));
        const inCategory = j.category.toLowerCase().includes(term);
        return inTitle || inCompany || inDesc || inSkills || inCategory;
      });
    }

    // Location
    if (params.location && params.location.trim()) {
      const locTerm = params.location.toLowerCase().trim();
      filtered = filtered.filter(j => {
        const matchLoc = j.location.toLowerCase().includes(locTerm);
        const matchCity = (j.city || '').toLowerCase().includes(locTerm);
        const matchRegion = (j.region || '').toLowerCase().includes(locTerm);
        const matchPostcode = (j.postcode || '').toLowerCase().includes(locTerm);
        return matchLoc || matchCity || matchRegion || matchPostcode;
      });
    }

    // Job Type
    if (params.jobType && params.jobType !== 'all') {
      filtered = filtered.filter(j => j.jobType.toLowerCase() === params.jobType?.toLowerCase());
    }

    // Work Arrangement
    if (params.workArrangement && params.workArrangement !== 'all') {
      filtered = filtered.filter(j => j.workArrangement.toLowerCase() === params.workArrangement?.toLowerCase());
    }

    // Category
    if (params.category && params.category !== 'all') {
      filtered = filtered.filter(j => j.category.toLowerCase() === params.category?.toLowerCase());
    }

    // Min Salary
    if (params.minSalary && params.minSalary > 0) {
      filtered = filtered.filter(j => {
        if (j.salaryMax && j.salaryMax >= params.minSalary!) return true;
        if (j.salaryMin && j.salaryMin >= params.minSalary!) return true;
        return false;
      });
    }

    // Sorting
    const sortBy = params.sortBy || 'newest';
    filtered.sort((a, b) => {
      // Prioritize featured roles first within the sort
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;

      if (sortBy === 'newest') {
        return new Date(b.datePosted).getTime() - new Date(a.datePosted).getTime();
      }
      if (sortBy === 'oldest') {
        return new Date(a.datePosted).getTime() - new Date(b.datePosted).getTime();
      }
      if (sortBy === 'closing_soon') {
        const timeA = a.closingDate ? new Date(a.closingDate).getTime() : Infinity;
        const timeB = b.closingDate ? new Date(b.closingDate).getTime() : Infinity;
        return timeA - timeB;
      }
      if (sortBy === 'salary_high') {
        const salA = a.salaryMax || a.salaryMin || 0;
        const salB = b.salaryMax || b.salaryMin || 0;
        return salB - salA;
      }
      if (sortBy === 'salary_low') {
        const salA = a.salaryMin || a.salaryMax || 0;
        const salB = b.salaryMin || b.salaryMax || 0;
        return salA - salB;
      }
      return 0;
    });

    const total = filtered.length;

    // Pagination
    if (params.page && params.limit) {
      const startIndex = (params.page - 1) * params.limit;
      filtered = filtered.slice(startIndex, startIndex + params.limit);
    } else if (params.limit) {
      filtered = filtered.slice(0, params.limit);
    }

    return {
      jobs: filtered,
      total,
      categories
    };
  }

  // Get single job by slug or ID (returns null if not found)
  public static async getJobBySlug(slug: string): Promise<Job | null> {
    const all = this.loadJobsFromStorage();
    const found = all.find(j => j.slug === slug || j.id === slug);
    if (found) {
      // Increment view count (avoid rapid double counts in same session)
      this.incrementJobView(found.id);
      return { ...found };
    }
    return null;
  }

  // Track Views
  public static incrementJobView(jobId: string): void {
    try {
      const viewedMapRaw = sessionStorage.getItem(VIEWS_TRACK_KEY);
      const viewedMap: Record<string, boolean> = viewedMapRaw ? JSON.parse(viewedMapRaw) : {};

      if (!viewedMap[jobId]) {
        viewedMap[jobId] = true;
        sessionStorage.setItem(VIEWS_TRACK_KEY, JSON.stringify(viewedMap));

        const all = this.loadJobsFromStorage();
        const index = all.findIndex(j => j.id === jobId);
        if (index !== -1) {
          all[index].views = (all[index].views || 0) + 1;
          this.saveJobsToStorage(all);
        }
      }
    } catch (e) {
      // Ignore session storage errors
    }
  }

  // Track Outbound Apply Clicks
  public static incrementApplyClick(jobId: string): void {
    try {
      const all = this.loadJobsFromStorage();
      const index = all.findIndex(j => j.id === jobId);
      if (index !== -1) {
        all[index].applyClicks = (all[index].applyClicks || 0) + 1;
        this.saveJobsToStorage(all);
      }
    } catch (e) {
      console.error('Error tracking apply click:', e);
    }
  }

  // Admin Query (Returns all jobs regardless of status)
  public static async getAllAdminJobs(): Promise<Job[]> {
    return this.loadJobsFromStorage();
  }

  // Create New Job
  public static async createJob(jobData: Omit<Job, 'id' | 'createdAt' | 'updatedAt' | 'views' | 'applyClicks'>, user: string = 'Super Admin'): Promise<Job> {
    const all = this.loadJobsFromStorage();
    const newId = 'pm-job-' + Date.now().toString().slice(-6) + Math.random().toString(36).substring(2, 5);
    const nowIso = new Date().toISOString();

    const slug = jobData.slug || this.generateSlug(jobData.title, jobData.company, all);

    const newJob: Job = {
      ...jobData,
      id: newId,
      slug,
      views: 0,
      applyClicks: 0,
      createdAt: nowIso,
      updatedAt: nowIso,
      createdBy: user,
      updatedBy: user
    };

    all.unshift(newJob);
    this.saveJobsToStorage(all);

    this.logActivity('created', `Created vacancy "${newJob.title}" at ${newJob.company} (${newJob.status})`, newJob.id, newJob.title, user);

    return newJob;
  }

  // Update Existing Job
  public static async updateJob(id: string, updates: Partial<Job>, user: string = 'Super Admin'): Promise<Job> {
    const all = this.loadJobsFromStorage();
    const index = all.findIndex(j => j.id === id);
    if (index === -1) {
      throw new Error(`Job vacancy with ID "${id}" not found.`);
    }

    const existing = all[index];
    let slug = updates.slug || existing.slug;

    if (updates.title && updates.title !== existing.title && !updates.slug) {
      slug = this.generateSlug(updates.title, updates.company || existing.company, all, id);
    }

    const updatedJob: Job = {
      ...existing,
      ...updates,
      id: existing.id,
      slug,
      createdAt: existing.createdAt,
      updatedAt: new Date().toISOString(),
      updatedBy: user
    };

    all[index] = updatedJob;
    this.saveJobsToStorage(all);

    this.logActivity('updated', `Updated vacancy details for "${updatedJob.title}"`, updatedJob.id, updatedJob.title, user);

    return updatedJob;
  }

  // Delete Job
  public static async deleteJob(id: string, user: string = 'Super Admin'): Promise<boolean> {
    const all = this.loadJobsFromStorage();
    const target = all.find(j => j.id === id);
    if (!target) return false;

    const filtered = all.filter(j => j.id !== id);
    this.saveJobsToStorage(filtered);

    this.logActivity('deleted', `Permanently deleted vacancy "${target.title}" (ID: ${id})`, target.id, target.title, user);

    return true;
  }

  // Toggle Publish Status
  public static async togglePublish(id: string, user: string = 'Super Admin'): Promise<Job> {
    const all = this.loadJobsFromStorage();
    const index = all.findIndex(j => j.id === id);
    if (index === -1) throw new Error('Job not found');

    const currentStatus = all[index].status;
    const newStatus = currentStatus === 'published' ? 'draft' : 'published';

    all[index].status = newStatus;
    all[index].updatedAt = new Date().toISOString();
    all[index].updatedBy = user;

    this.saveJobsToStorage(all);

    this.logActivity(
      newStatus === 'published' ? 'published' : 'unpublished',
      `Changed status of "${all[index].title}" to ${newStatus}`,
      all[index].id,
      all[index].title,
      user
    );

    return all[index];
  }

  // Toggle Archive
  public static async toggleArchive(id: string, user: string = 'Super Admin'): Promise<Job> {
    const all = this.loadJobsFromStorage();
    const index = all.findIndex(j => j.id === id);
    if (index === -1) throw new Error('Job not found');

    const newStatus = all[index].status === 'archived' ? 'published' : 'archived';
    all[index].status = newStatus;
    all[index].updatedAt = new Date().toISOString();
    all[index].updatedBy = user;

    this.saveJobsToStorage(all);

    this.logActivity(
      'archived',
      `Toggled archive on "${all[index].title}" (Now ${newStatus})`,
      all[index].id,
      all[index].title,
      user
    );

    return all[index];
  }

  // Toggle Featured
  public static async toggleFeatured(id: string, user: string = 'Super Admin'): Promise<Job> {
    const all = this.loadJobsFromStorage();
    const index = all.findIndex(j => j.id === id);
    if (index === -1) throw new Error('Job not found');

    all[index].featured = !all[index].featured;
    all[index].updatedAt = new Date().toISOString();
    all[index].updatedBy = user;

    this.saveJobsToStorage(all);

    this.logActivity(
      all[index].featured ? 'featured' : 'unfeatured',
      `${all[index].featured ? 'Featured' : 'Unfeatured'} vacancy "${all[index].title}"`,
      all[index].id,
      all[index].title,
      user
    );

    return all[index];
  }

  // Duplicate Job
  public static async duplicateJob(id: string, user: string = 'Super Admin'): Promise<Job> {
    const all = this.loadJobsFromStorage();
    const original = all.find(j => j.id === id);
    if (!original) throw new Error('Job to duplicate was not found');

    const newTitle = `${original.title} (Copy)`;
    const newSlug = this.generateSlug(newTitle, original.company, all);
    const newId = 'pm-job-' + Date.now().toString().slice(-6) + Math.random().toString(36).substring(2, 5);
    const nowIso = new Date().toISOString();

    const clonedJob: Job = {
      ...original,
      id: newId,
      title: newTitle,
      slug: newSlug,
      status: 'draft',
      featured: false,
      views: 0,
      applyClicks: 0,
      createdAt: nowIso,
      updatedAt: nowIso,
      createdBy: user,
      updatedBy: user
    };

    all.unshift(clonedJob);
    this.saveJobsToStorage(all);

    this.logActivity('created', `Duplicated "${original.title}" into new draft "${clonedJob.title}"`, clonedJob.id, clonedJob.title, user);

    return clonedJob;
  }

  // Renew Job (Extend closing date)
  public static async renewJob(id: string, additionalDays: number = 30, user: string = 'Super Admin'): Promise<Job> {
    const all = this.loadJobsFromStorage();
    const index = all.findIndex(j => j.id === id);
    if (index === -1) throw new Error('Job not found');

    const newClosing = new Date(Date.now() + additionalDays * 24 * 60 * 60 * 1000).toISOString();
    all[index].closingDate = newClosing;
    all[index].status = 'published';
    all[index].updatedAt = new Date().toISOString();
    all[index].updatedBy = user;

    this.saveJobsToStorage(all);

    this.logActivity('renewed', `Renewed vacancy "${all[index].title}" for +${additionalDays} days (New closing: ${newClosing.split('T')[0]})`, all[index].id, all[index].title, user);

    return all[index];
  }

  // Bulk Actions
  public static async executeBulkAction(
    jobIds: string[],
    action: 'publish' | 'unpublish' | 'feature' | 'unfeature' | 'archive' | 'delete',
    user: string = 'Super Admin'
  ): Promise<{ affectedCount: number }> {
    const all = this.loadJobsFromStorage();
    let affectedCount = 0;

    if (action === 'delete') {
      const remaining = all.filter(j => !jobIds.includes(j.id));
      affectedCount = all.length - remaining.length;
      this.saveJobsToStorage(remaining);
      this.logActivity('bulk_action', `Bulk deleted ${affectedCount} vacancies`, undefined, undefined, user);
      return { affectedCount };
    }

    all.forEach(job => {
      if (jobIds.includes(job.id)) {
        affectedCount++;
        job.updatedAt = new Date().toISOString();
        job.updatedBy = user;
        if (action === 'publish') job.status = 'published';
        if (action === 'unpublish') job.status = 'draft';
        if (action === 'feature') job.featured = true;
        if (action === 'unfeature') job.featured = false;
        if (action === 'archive') job.status = 'archived';
      }
    });

    this.saveJobsToStorage(all);
    this.logActivity('bulk_action', `Bulk action "${action}" executed on ${affectedCount} vacancies`, undefined, undefined, user);

    return { affectedCount };
  }

  // Duplicate Detection using Title, Company, Location, Source URL, and Application URL
  public static detectDuplicate(
    candidate: { title?: string; company?: string; location?: string; applicationUrl?: string; sourceUrl?: string },
    existingJobs?: Job[],
    currentJobId?: string
  ): DuplicateMatch | null {
    const jobs = existingJobs || this.loadJobsFromStorage();
    const title = (candidate.title || '').trim().toLowerCase();
    const company = (candidate.company || '').trim().toLowerCase();
    const location = (candidate.location || '').trim().toLowerCase();
    const appUrl = (candidate.applicationUrl || '').trim().toLowerCase();
    const sourceUrl = (candidate.sourceUrl || '').trim().toLowerCase();

    if (!title && !appUrl && !sourceUrl) return null;

    for (const job of jobs) {
      if (currentJobId && job.id === currentJobId) continue;

      const reasons: string[] = [];
      const jobTitle = job.title.trim().toLowerCase();
      const jobCompany = job.company.trim().toLowerCase();
      const jobLocation = job.location.trim().toLowerCase();
      const jobAppUrl = (job.applicationUrl || '').trim().toLowerCase();
      const jobSourceUrl = (job.sourceUrl || '').trim().toLowerCase();

      // Check Application URL
      if (appUrl && jobAppUrl && appUrl === jobAppUrl) {
        reasons.push('Identical application URL');
      }

      // Check Source URL
      if (sourceUrl && jobSourceUrl && sourceUrl === jobSourceUrl) {
        reasons.push('Identical source URL');
      }

      // Check Title + Company + Location
      if (title && jobTitle && title === jobTitle) {
        if (company && jobCompany && company === jobCompany) {
          if (location && jobLocation && (location === jobLocation || jobLocation.includes(location) || location.includes(jobLocation))) {
            reasons.push('Identical title, company, and location');
          } else {
            reasons.push('Matching job title and employer name');
          }
        } else {
          reasons.push('Identical job title');
        }
      }

      if (reasons.length > 0) {
        return {
          existingJob: job,
          reasons,
          confidence: reasons.length > 1 || reasons.includes('Identical application URL') || reasons.includes('Identical title, company, and location') ? 'high' : 'medium'
        };
      }
    }

    return null;
  }

  // Analytics Computation
  public static getAnalytics(): JobAnalytics {
    const all = this.loadJobsFromStorage();
    const now = Date.now();
    const sevenDays = 7 * 24 * 60 * 60 * 1000;

    let activeCount = 0;
    let newThisWeek = 0;
    let expiringThisWeek = 0;
    let expiredCount = 0;
    let draftCount = 0;
    let featuredCount = 0;
    let archivedCount = 0;
    let totalViews = 0;
    let totalApplyClicks = 0;

    const categoryCounts: Record<string, { count: number; views: number }> = {};
    const locationCounts: Record<string, number> = {};

    let mostViewed: { id: string; title: string; views: number; company: string } | null = null;

    all.forEach(j => {
      const isExp = this.isJobExpired(j);
      const isClosingSoon = this.isClosingSoon(j.closingDate);
      const isNew = now - new Date(j.datePosted).getTime() <= sevenDays;

      const views = j.views || 0;
      const clicks = j.applyClicks || 0;

      totalViews += views;
      totalApplyClicks += clicks;

      if (!mostViewed || views > mostViewed.views) {
        mostViewed = { id: j.id, title: j.title, views, company: j.company };
      }

      if (j.status === 'draft') draftCount++;
      if (j.status === 'archived') archivedCount++;
      if (j.featured) featuredCount++;

      if (j.status === 'published') {
        if (isExp) {
          expiredCount++;
        } else {
          activeCount++;
          if (isNew) newThisWeek++;
          if (isClosingSoon) expiringThisWeek++;
        }
      }

      // Categories
      if (!categoryCounts[j.category]) {
        categoryCounts[j.category] = { count: 0, views: 0 };
      }
      categoryCounts[j.category].count += 1;
      categoryCounts[j.category].views += views;

      // Locations
      const locKey = j.city || j.location || 'London';
      locationCounts[locKey] = (locationCounts[locKey] || 0) + 1;
    });

    let mostPopularCategory: { category: string; count: number; views: number } | null = null;
    Object.entries(categoryCounts).forEach(([cat, val]) => {
      if (!mostPopularCategory || val.views > mostPopularCategory.views) {
        mostPopularCategory = { category: cat, count: val.count, views: val.views };
      }
    });

    let mostPopularLocation: { location: string; count: number } | null = null;
    Object.entries(locationCounts).forEach(([loc, cnt]) => {
      if (!mostPopularLocation || cnt > mostPopularLocation.count) {
        mostPopularLocation = { location: loc, count: cnt };
      }
    });

    return {
      totalVacancies: all.length,
      activeVacancies: activeCount,
      newThisWeek,
      expiringThisWeek,
      expiredVacancies: expiredCount,
      draftVacancies: draftCount,
      featuredVacancies: featuredCount,
      archivedVacancies: archivedCount,
      totalViews,
      totalApplyClicks,
      mostViewedJob: mostViewed,
      mostPopularCategory,
      mostPopularLocation
    };
  }

  // Export to CSV
  public static exportJobsToCsv(jobsToExport?: Job[]): string {
    const jobs = jobsToExport || this.loadJobsFromStorage();
    const headers = [
      'id',
      'title',
      'slug',
      'company',
      'location',
      'city',
      'region',
      'country',
      'postcode',
      'salaryMin',
      'salaryMax',
      'salaryText',
      'salaryPeriod',
      'currency',
      'jobType',
      'workArrangement',
      'category',
      'shortDescription',
      'fullDescription',
      'responsibilities',
      'requirements',
      'qualifications',
      'skills',
      'benefits',
      'workingHours',
      'sourceName',
      'sourceUrl',
      'applicationUrl',
      'datePosted',
      'closingDate',
      'featured',
      'status',
      'views',
      'applyClicks'
    ];

    const escapeCsv = (str?: string | number | boolean | null) => {
      if (str === null || str === undefined) return '""';
      const s = String(str).replace(/"/g, '""');
      return `"${s}"`;
    };

    const rows = jobs.map(j => [
      escapeCsv(j.id),
      escapeCsv(j.title),
      escapeCsv(j.slug),
      escapeCsv(j.company),
      escapeCsv(j.location),
      escapeCsv(j.city),
      escapeCsv(j.region),
      escapeCsv(j.country),
      escapeCsv(j.postcode),
      j.salaryMin || '',
      j.salaryMax || '',
      escapeCsv(j.salaryText),
      escapeCsv(j.salaryPeriod),
      escapeCsv(j.currency),
      escapeCsv(j.jobType),
      escapeCsv(j.workArrangement),
      escapeCsv(j.category),
      escapeCsv(j.shortDescription),
      escapeCsv(j.fullDescription),
      escapeCsv(j.responsibilities ? j.responsibilities.join(' | ') : ''),
      escapeCsv(j.requirements ? j.requirements.join(' | ') : ''),
      escapeCsv(j.qualifications ? j.qualifications.join(' | ') : ''),
      escapeCsv(j.skills ? j.skills.join(', ') : ''),
      escapeCsv(j.benefits ? j.benefits.join(' | ') : ''),
      escapeCsv(j.workingHours),
      escapeCsv(j.sourceName),
      escapeCsv(j.sourceUrl),
      escapeCsv(j.applicationUrl),
      escapeCsv(j.datePosted),
      escapeCsv(j.closingDate),
      j.featured ? 'true' : 'false',
      escapeCsv(j.status),
      j.views || 0,
      j.applyClicks || 0
    ]);

    return [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
  }

  // Generate Sample CSV Template for Admin Import
  public static generateCsvTemplate(): string {
    const headers = [
      'title',
      'company',
      'location',
      'city',
      'region',
      'country',
      'salaryMin',
      'salaryMax',
      'salaryText',
      'salaryPeriod',
      'jobType',
      'workArrangement',
      'category',
      'shortDescription',
      'fullDescription',
      'responsibilities',
      'requirements',
      'skills',
      'benefits',
      'workingHours',
      'sourceName',
      'sourceUrl',
      'applicationUrl',
      'datePosted',
      'closingDate',
      'featured',
      'status'
    ];

    const sampleRow1 = [
      '"Care Assistant - Day Shift"',
      '"St. Jude Health"',
      '"Camden, London"',
      '"London"',
      '"Greater London"',
      '"United Kingdom"',
      '26000',
      '29000',
      '"£26,000 - £29,000 per year"',
      '"per year"',
      '"Full-time"',
      '"On-site"',
      '"Care Sector"',
      '"Compassionate care assistant required for residential home in Camden."',
      '"Join our warm team supporting elderly residents with dignity and respect."',
      '"Assist with personal care | Support meal times | Record daily observations"',
      '"NVQ Level 2 Health & Social Care | Enhanced DBS | 1 year care experience"',
      '"Care Planning, First Aid, Moving and Handling"',
      '"Company Pension | Paid Induction | Uniform Provided"',
      '"37.5 hours per week"',
      '"Promarch Consulting"',
      '"https://promarchconsulting.co.uk"',
      '"https://promarchconsulting.co.uk/contact"',
      '"2026-08-25"',
      '"2026-10-30"',
      'true',
      '"published"'
    ];

    const sampleRow2 = [
      '"Warehouse Reach Truck Operator"',
      '"DHL Supply Chain"',
      '"Dartford, Kent"',
      '"Dartford"',
      '"Kent"',
      '"United Kingdom"',
      '14.00',
      '16.00',
      '"£14.00 - £16.00 per hour"',
      '"per hour"',
      '"Full-time"',
      '"On-site"',
      '"Warehouse & Logistics"',
      '"Experienced Reach FLT driver needed for pallet stacking in ambient warehouse."',
      '"High volume logistics warehouse operations requiring safety focused reach drivers."',
      '"Operate reach forklift | Put away pallets | Complete vehicle checks"',
      '"Valid RTITB/ITSSAR Reach license | 6 months experience"',
      '"Reach FLT, Goods Inward, RF Scanning"',
      '"Overtime 1.5x, Free Parking, Canteen"',
      '"40 hours, 4 on 4 off rotation"',
      '"Indeed UK"',
      '"https://indeed.com"',
      '"https://promarchconsulting.co.uk/contact"',
      '"2026-08-24"',
      '"2026-09-30"',
      'false',
      '"published"'
    ];

    return [headers.join(','), sampleRow1.join(','), sampleRow2.join(',')].join('\r\n');
  }

  // Parse CSV Line safely handling quotes and commas
  private static parseCsvLine(line: string): string[] {
    const result: string[] = [];
    let cur = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        if (inQuotes && line[i + 1] === '"') {
          cur += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        result.push(cur.trim());
        cur = '';
      } else {
        cur += char;
      }
    }
    result.push(cur.trim());
    return result;
  }

  // Parse & Validate CSV Content
  public static parseAndValidateCsv(csvText: string): CsvImportSummary {
    const existing = this.loadJobsFromStorage();
    const lines = csvText
      .split(/\r?\n/)
      .map(l => l.trim())
      .filter(l => l.length > 0);

    if (lines.length < 2) {
      throw new Error('CSV file must contain a header row and at least one data record.');
    }

    const headerLine = this.parseCsvLine(lines[0]).map(h => h.toLowerCase().replace(/[^a-z0-9]/g, ''));
    const records: CsvImportRecord[] = [];
    let validCount = 0;
    let invalidCount = 0;
    let duplicateCount = 0;

    for (let r = 1; r < lines.length; r++) {
      const cols = this.parseCsvLine(lines[r]);
      const rowData: any = {};
      const errors: string[] = [];

      headerLine.forEach((header, idx) => {
        const val = cols[idx] !== undefined ? cols[idx] : '';
        if (header.includes('title')) rowData.title = val;
        else if (header === 'company' || header === 'employer') rowData.company = val;
        else if (header === 'location') rowData.location = val;
        else if (header === 'city') rowData.city = val;
        else if (header === 'region') rowData.region = val;
        else if (header === 'country') rowData.country = val;
        else if (header === 'postcode' || header === 'zip') rowData.postcode = val;
        else if (header === 'salarymin' || header === 'minsalary') rowData.salaryMin = val ? Number(val) : undefined;
        else if (header === 'salarymax' || header === 'maxsalary') rowData.salaryMax = val ? Number(val) : undefined;
        else if (header === 'salarytext' || header === 'salary') rowData.salaryText = val;
        else if (header === 'salaryperiod' || header === 'period') rowData.salaryPeriod = val || 'per year';
        else if (header === 'currency') rowData.currency = val || '£';
        else if (header === 'jobtype' || header === 'type') rowData.jobType = val || 'Full-time';
        else if (header === 'workarrangement' || header === 'arrangement') rowData.workArrangement = val || 'On-site';
        else if (header === 'category' || header === 'sector') rowData.category = val || 'Care Sector';
        else if (header === 'shortdescription' || header === 'summary') rowData.shortDescription = val;
        else if (header === 'fulldescription' || header === 'description') rowData.fullDescription = val;
        else if (header.includes('responsib')) rowData.responsibilities = val ? val.split(/[|\n]/).map(s => s.trim()).filter(Boolean) : [];
        else if (header.includes('require')) rowData.requirements = val ? val.split(/[|\n]/).map(s => s.trim()).filter(Boolean) : [];
        else if (header.includes('qualif')) rowData.qualifications = val ? val.split(/[|\n]/).map(s => s.trim()).filter(Boolean) : [];
        else if (header.includes('skill')) rowData.skills = val ? val.split(/[,|]/).map(s => s.trim()).filter(Boolean) : [];
        else if (header.includes('benefit')) rowData.benefits = val ? val.split(/[|\n]/).map(s => s.trim()).filter(Boolean) : [];
        else if (header.includes('hour')) rowData.workingHours = val;
        else if (header.includes('sourcename')) rowData.sourceName = val || 'Promarch Consulting';
        else if (header.includes('sourceurl')) rowData.sourceUrl = val;
        else if (header.includes('applicationurl') || header.includes('applyurl')) rowData.applicationUrl = val;
        else if (header.includes('dateposted') || header === 'posted') rowData.datePosted = val ? new Date(val).toISOString() : new Date().toISOString();
        else if (header.includes('closingdate') || header === 'closing') rowData.closingDate = val ? new Date(val).toISOString() : undefined;
        else if (header === 'featured') rowData.featured = val.toLowerCase() === 'true' || val === '1';
        else if (header === 'status') rowData.status = (['draft', 'published', 'expired', 'archived'].includes(val.toLowerCase()) ? val.toLowerCase() : 'published');
      });

      // Validations
      if (!rowData.title) errors.push('Job title is required');
      if (!rowData.company) rowData.company = 'Promarch Consulting';
      if (!rowData.location) rowData.location = 'London, UK';
      if (!rowData.applicationUrl) rowData.applicationUrl = 'https://promarchconsulting.co.uk/contact';
      if (!rowData.shortDescription) {
        rowData.shortDescription = `Exciting career opportunity for ${rowData.title || 'qualified candidates'} with ${rowData.company}.`;
      }
      if (!rowData.datePosted) rowData.datePosted = new Date().toISOString();
      if (!rowData.status) rowData.status = 'published';

      const duplicateWarning = this.detectDuplicate(rowData, existing);

      if (duplicateWarning) {
        duplicateCount++;
      }

      const isValid = errors.length === 0;
      if (isValid) validCount++;
      else invalidCount++;

      records.push({
        rawRowIndex: r,
        data: rowData,
        isValid,
        errors,
        duplicateWarning: duplicateWarning || undefined
      });
    }

    return {
      totalRows: lines.length - 1,
      validRows: validCount,
      invalidRows: invalidCount,
      duplicateCount,
      records
    };
  }

  // Commit Import
  public static async importCsvJobs(records: Partial<Job>[], user: string = 'Super Admin'): Promise<{ importedCount: number }> {
    let importedCount = 0;
    for (const rec of records) {
      await this.createJob({
        title: rec.title || 'Untitled Vacancy',
        slug: rec.slug,
        company: rec.company || 'Promarch Consulting',
        companyLogo: rec.companyLogo,
        location: rec.location || 'London, UK',
        city: rec.city,
        region: rec.region,
        country: rec.country || 'United Kingdom',
        postcode: rec.postcode,
        salaryMin: rec.salaryMin,
        salaryMax: rec.salaryMax,
        salaryText: rec.salaryText,
        salaryPeriod: rec.salaryPeriod || 'per year',
        currency: rec.currency || '£',
        jobType: rec.jobType || 'Full-time',
        workArrangement: rec.workArrangement || 'On-site',
        category: rec.category || 'Care Sector',
        shortDescription: rec.shortDescription || '',
        fullDescription: rec.fullDescription,
        responsibilities: rec.responsibilities,
        requirements: rec.requirements,
        qualifications: rec.qualifications,
        experience: rec.experience,
        skills: rec.skills,
        benefits: rec.benefits,
        workingHours: rec.workingHours,
        sourceName: rec.sourceName || 'Promarch Consulting',
        sourceUrl: rec.sourceUrl,
        applicationUrl: rec.applicationUrl || 'https://promarchconsulting.co.uk/contact',
        datePosted: rec.datePosted || new Date().toISOString(),
        closingDate: rec.closingDate,
        featured: Boolean(rec.featured),
        status: rec.status || 'published'
      }, user);
      importedCount++;
    }

    this.logActivity('imported', `Imported ${importedCount} vacancies via CSV Batch upload`, undefined, undefined, user);

    return { importedCount };
  }
}
