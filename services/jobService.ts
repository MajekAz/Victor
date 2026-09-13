import { Job, JobFilterParams, JobAnalytics, AdminActivityLog, DuplicateMatch, CsvImportSummary, CsvImportRecord } from '../types.ts';
import { AuthService } from './authService.ts';

const VIEWS_TRACK_KEY = 'promarch_viewed_jobs';

/**
 * Decodes multiply-nested HTML entities (e.g. &amp;amp;amp; -> &)
 * Prevents recursive encoding bugs like "Office &amp;amp;amp; Administration"
 */
export function decodeHtml(str?: string | null): string {
  if (!str) return '';
  let result = String(str);
  let prev = '';
  let iterations = 0;
  while (result.includes('&') && result !== prev && iterations < 12) {
    prev = result;
    result = result
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#039;/g, "'")
      .replace(/&#39;/g, "'")
      .replace(/&apos;/g, "'")
      .replace(/&#x27;/g, "'")
      .replace(/&nbsp;/g, ' ')
      .replace(/&ndash;/g, '–')
      .replace(/&#8211;/g, '–')
      .replace(/&mdash;/g, '—')
      .replace(/&#8212;/g, '—')
      .replace(/&pound;/g, '£')
      .replace(/&#163;/g, '£');
    iterations++;
  }
  return result;
}

/**
 * Normalizes all text properties on a Job object to guarantee clean,
 * entity-free display strings throughout the entire UI.
 */
export function normalizeJob(job: Job): Job {
  if (!job) return job;
  return {
    ...job,
    title: decodeHtml(job.title),
    company: decodeHtml(job.company),
    location: decodeHtml(job.location),
    city: job.city ? decodeHtml(job.city) : job.city,
    region: job.region ? decodeHtml(job.region) : job.region,
    country: job.country ? decodeHtml(job.country) : job.country,
    category: decodeHtml(job.category),
    jobType: decodeHtml(job.jobType) as any,
    workArrangement: decodeHtml(job.workArrangement) as any,
    salaryText: decodeHtml(job.salaryText),
    jobCardCaption: job.jobCardCaption ? decodeHtml(job.jobCardCaption) : job.jobCardCaption,
    shortDescription: decodeHtml(job.shortDescription),
    fullDescription: decodeHtml(job.fullDescription),
    responsibilities: Array.isArray(job.responsibilities) ? job.responsibilities.map(decodeHtml) : job.responsibilities,
    requirements: Array.isArray(job.requirements) ? job.requirements.map(decodeHtml) : job.requirements,
    qualifications: Array.isArray(job.qualifications) ? job.qualifications.map(decodeHtml) : job.qualifications,
    skills: Array.isArray(job.skills) ? job.skills.map(decodeHtml) : job.skills,
    benefits: Array.isArray(job.benefits) ? job.benefits.map(decodeHtml) : job.benefits,
    workingHours: job.workingHours ? decodeHtml(job.workingHours) : job.workingHours,
    regionsMentioned: job.regionsMentioned ? decodeHtml(job.regionsMentioned) : job.regionsMentioned,
    sourceName: job.sourceName ? decodeHtml(job.sourceName) : job.sourceName,
    sourceUrl: job.sourceUrl ? decodeHtml(job.sourceUrl) : job.sourceUrl,
    applicationUrl: job.applicationUrl ? decodeHtml(job.applicationUrl) : job.applicationUrl,
  };
}

export class JobService {
  // In-memory cache of currently loaded jobs for fast client-side calculations (analytics, duplicate detection)
  private static cachedJobs: Job[] = [];
  private static cachedCategories: string[] = [];

  // Fetch headers for authenticated admin API requests (PHP session cookie is sent via credentials: 'include')
  private static getAdminHeaders(): HeadersInit {
    const csrfToken = AuthService.getCSRFToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };
    if (csrfToken) {
      headers['X-CSRF-Token'] = csrfToken;
    }
    return headers;
  }

  // Audit Log recording (Calls backend API or stores in memory)
  public static async logActivity(action: AdminActivityLog['action'], details: string, jobId?: string, jobTitle?: string, user: string = 'Admin'): Promise<void> {
    try {
      // Background ping to backend if supported
      console.log(`[Audit Log] ${action}: ${details} (${jobTitle || ''})`);
    } catch {
      // Ignore logging failures
    }
  }

  public static async getActivityLogs(): Promise<AdminActivityLog[]> {
    try {
      const endpoints = ['/api/admin/logs.php', '/api/admin/logs'];
      for (const ep of endpoints) {
        try {
          const res = await fetch(ep, {
            credentials: 'include',
            headers: this.getAdminHeaders()
          });
          if (res.ok) {
            const json = await res.json();
            const logs = json.data || json;
            if (Array.isArray(logs)) {
              return logs;
            }
          }
        } catch {
          // Try next endpoint
        }
      }
    } catch (e) {
      console.warn('Failed to fetch admin audit logs from server:', e);
    }
    return [];
  }

  // Generate SEO slug safely
  public static generateSlug(title: string, company?: string, existingJobs?: Job[], currentJobId?: string): string {
    let base = title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');

    if (company && company.trim().toLowerCase() !== 'promarch consulting') {
      const compSlug = company
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
      if (compSlug && !base.includes(compSlug)) {
        base = `${base}-${compSlug}`;
      }
    }

    if (!base) base = 'job-opportunity';

    const jobs = existingJobs || this.cachedJobs;
    let candidate = base;
    let counter = 1;

    while (jobs.some(j => j.slug === candidate && j.id !== currentJobId)) {
      candidate = `${base}-${counter}`;
      counter++;
    }

    return candidate;
  }

  // Check if job has expired
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

  // Public Query - Fetches from the production MySQL/PHP backend API
  public static async getJobs(params: JobFilterParams = {}): Promise<{
    jobs: Job[];
    total: number;
    categories: string[];
  }> {
    // Build query string
    const query = new URLSearchParams();
    if (params.searchTerm) query.set('searchTerm', params.searchTerm);
    if (params.location) query.set('location', params.location);
    if (params.jobType && params.jobType !== 'all') query.set('jobType', params.jobType);
    if (params.workArrangement && params.workArrangement !== 'all') query.set('workArrangement', params.workArrangement);
    if (params.category && params.category !== 'all') query.set('category', params.category);
    if (params.minSalary) query.set('minSalary', params.minSalary.toString());
    if (params.sortBy) query.set('sortBy', params.sortBy);
    if (params.page) query.set('page', params.page.toString());
    if (params.limit) query.set('limit', params.limit.toString());

    const qs = query.toString() ? `?${query.toString()}` : '';

    // Primary and fallback endpoints
    const endpoints = [`/api/jobs.php${qs}`, `/api/jobs${qs}`];
    let lastError: any = null;

    for (const ep of endpoints) {
      try {
        const res = await fetch(ep, {
          headers: { 'Accept': 'application/json' }
        });

        if (res.ok) {
          const json = await res.json();
          // Check standard envelope { success: true, data: { jobs, total, categories } }
          if (json.data && Array.isArray(json.data.jobs)) {
            const cleanJobs = json.data.jobs.map(normalizeJob);
            const cleanCategories = Array.from(
              new Set(
                (json.data.categories || [])
                  .map(decodeHtml)
                  .concat(cleanJobs.map((j: Job) => j.category))
                  .filter(Boolean)
              )
            ).sort() as string[];

            this.cachedJobs = cleanJobs;
            this.cachedCategories = cleanCategories;
            return {
              jobs: cleanJobs,
              total: json.data.total ?? cleanJobs.length,
              categories: cleanCategories
            };
          }
          // Check if root array
          if (Array.isArray(json)) {
            const cleanJobs = json.map(normalizeJob);
            const categories = Array.from(new Set(cleanJobs.map((j: Job) => j.category).filter(Boolean))).sort() as string[];
            this.cachedJobs = cleanJobs;
            this.cachedCategories = categories;
            return {
              jobs: cleanJobs,
              total: cleanJobs.length,
              categories
            };
          }
        }
      } catch (e) {
        lastError = e;
      }
    }

    // If API failed and we have no cached data, throw real error to show API error state
    if (this.cachedJobs.length > 0) {
      return {
        jobs: this.cachedJobs,
        total: this.cachedJobs.length,
        categories: this.cachedCategories
      };
    }

    throw new Error(lastError ? `Unable to load vacancies from server: ${lastError.message || lastError}` : 'Unable to connect to vacancy API.');
  }

  // Get single job by slug or ID
  public static async getJobBySlug(slug: string): Promise<Job | null> {
    const endpoints = [
      `/api/jobs.php?slug=${encodeURIComponent(slug)}`,
      `/api/jobs/${encodeURIComponent(slug)}`,
      `/api/jobs?slug=${encodeURIComponent(slug)}`
    ];

    for (const ep of endpoints) {
      try {
        const res = await fetch(ep, {
          headers: { 'Accept': 'application/json' }
        });
        if (res.ok) {
          const json = await res.json();
          const job: Job | null = json.data || json;
          if (job && job.id) {
            const cleanJob = normalizeJob(job);
            this.incrementJobView(cleanJob.id);
            return cleanJob;
          }
        }
      } catch {
        // Try fallback endpoint
      }
    }

    // Check memory cache
    const cached = this.cachedJobs.find(j => j.slug === slug || j.id === slug);
    if (cached) {
      const cleanJob = normalizeJob(cached);
      this.incrementJobView(cleanJob.id);
      return cleanJob;
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

        // Fire to backend
        fetch(`/api/jobs/${encodeURIComponent(jobId)}/view`, { method: 'POST' }).catch(() => {});
      }
    } catch {
      // Ignore session storage errors
    }
  }

  // Track Outbound Apply Clicks
  public static incrementApplyClick(jobId: string): void {
    try {
      fetch(`/api/jobs/${encodeURIComponent(jobId)}/apply-click`, { method: 'POST' }).catch(() => {});
    } catch {
      // Ignore network errors
    }
  }

  // Admin Query (Returns all jobs regardless of status from MySQL)
  public static async getAllAdminJobs(): Promise<Job[]> {
    const endpoints = [
      '/api/admin/jobs.php',
      '/api/admin/jobs'
    ];

    let lastError: any = null;

    for (const ep of endpoints) {
      try {
        const res = await fetch(ep, {
          credentials: 'include',
          headers: this.getAdminHeaders()
        });
        if (res.ok) {
          const json = await res.json();
          const remoteAdminJobs = json.data || json;
          if (Array.isArray(remoteAdminJobs)) {
            const cleanJobs = remoteAdminJobs.map(normalizeJob);
            this.cachedJobs = cleanJobs;
            return cleanJobs;
          }
        } else if (res.status === 401 || res.status === 403) {
          throw new Error('Administrative session expired. Please sign in again.');
        }
      } catch (e) {
        lastError = e;
      }
    }

    if (this.cachedJobs.length > 0) {
      return this.cachedJobs.map(normalizeJob);
    }

    throw new Error(lastError?.message || 'Failed to load administrative vacancies from server.');
  }

  // Create New Job
  public static async createJob(jobData: Omit<Job, 'id' | 'createdAt' | 'updatedAt' | 'views' | 'applyClicks'>, user: string = 'Super Admin'): Promise<Job> {
    const newId = 'pm-job-' + Date.now().toString().slice(-6) + Math.random().toString(36).substring(2, 5);
    const nowIso = new Date().toISOString();
    const slug = jobData.slug || this.generateSlug(jobData.title, jobData.company);

    const newJob: Job = normalizeJob({
      ...jobData,
      id: newId,
      slug,
      views: 0,
      applyClicks: 0,
      createdAt: nowIso,
      updatedAt: nowIso,
      createdBy: user,
      updatedBy: user
    });

    const endpoints = [
      '/api/admin/jobs.php?action=create',
      '/api/admin/jobs.php',
      '/api/admin/jobs'
    ];
    let lastError: any = null;

    for (const ep of endpoints) {
      try {
        const res = await fetch(ep, {
          method: 'POST',
          credentials: 'include',
          headers: this.getAdminHeaders(),
          body: JSON.stringify(newJob)
        });

        if (res.ok) {
          const json = await res.json();
          const saved: Job = normalizeJob(json.data || json || newJob);
          this.cachedJobs.unshift(saved);
          await this.logActivity('created', `Created vacancy "${saved.title}" at ${saved.company}`, saved.id, saved.title, user);
          return saved;
        } else {
          const errData = await res.json().catch(() => null);
          lastError = errData?.message || `Server returned error ${res.status}`;
        }
      } catch (e) {
        lastError = e;
      }
    }

    throw new Error(lastError?.message || lastError || 'Failed to create vacancy on server.');
  }

  // Update Existing Job
  public static async updateJob(id: string, updates: Partial<Job>, user: string = 'Super Admin'): Promise<Job> {
    const existing = this.cachedJobs.find(j => j.id === id);
    let slug = updates.slug || existing?.slug;

    if (updates.title && (!existing || updates.title !== existing.title) && !updates.slug) {
      slug = this.generateSlug(updates.title, updates.company || existing?.company, undefined, id);
    }

    const payload = {
      ...updates,
      id,
      slug,
      updatedAt: new Date().toISOString(),
      updatedBy: user
    };

    const endpoints = [
      `/api/admin/jobs.php?id=${encodeURIComponent(id)}`,
      '/api/admin/jobs.php',
      `/api/admin/jobs/${encodeURIComponent(id)}`
    ];

    let lastError: any = null;

    for (const ep of endpoints) {
      try {
        const res = await fetch(ep, {
          method: 'PUT',
          credentials: 'include',
          headers: this.getAdminHeaders(),
          body: JSON.stringify(payload)
        });

        if (res.ok) {
          const json = await res.json();
          const saved: Job = normalizeJob(json.data || json || { ...existing, ...payload } as Job);
          const idx = this.cachedJobs.findIndex(j => j.id === id);
          if (idx !== -1) {
            this.cachedJobs[idx] = saved;
          } else {
            this.cachedJobs.unshift(saved);
          }
          await this.logActivity('updated', `Updated vacancy details for "${saved.title}"`, saved.id, saved.title, user);
          return saved;
        } else {
          const errData = await res.json().catch(() => null);
          lastError = errData?.message || `Server returned error ${res.status}`;
        }
      } catch (e) {
        lastError = e;
      }
    }

    throw new Error(lastError?.message || lastError || 'Failed to update vacancy on server.');
  }

  // Delete Job
  public static async deleteJob(id: string, user: string = 'Super Admin'): Promise<boolean> {
    const existing = this.cachedJobs.find(j => j.id === id);
    const endpoints = [
      `/api/admin/jobs.php?id=${encodeURIComponent(id)}`,
      '/api/admin/jobs.php',
      `/api/admin/jobs/${encodeURIComponent(id)}`
    ];

    let lastError: any = null;

    for (const ep of endpoints) {
      try {
        const res = await fetch(ep, {
          method: 'DELETE',
          credentials: 'include',
          headers: this.getAdminHeaders()
        });

        if (res.ok) {
          this.cachedJobs = this.cachedJobs.filter(j => j.id !== id);
          if (existing) {
            await this.logActivity('deleted', `Permanently deleted vacancy "${existing.title}"`, existing.id, existing.title, user);
          }
          return true;
        }
      } catch (e) {
        lastError = e;
      }
    }

    throw new Error(lastError?.message || 'Failed to delete vacancy on server.');
  }

  // Toggle Publish Status
  public static async togglePublish(id: string, user: string = 'Super Admin'): Promise<Job> {
    const existing = this.cachedJobs.find(j => j.id === id);
    if (!existing) throw new Error('Job not found in active list');
    const newStatus = existing.status === 'published' ? 'draft' : 'published';
    return this.updateJob(id, { status: newStatus }, user);
  }

  // Toggle Archive
  public static async toggleArchive(id: string, user: string = 'Super Admin'): Promise<Job> {
    const existing = this.cachedJobs.find(j => j.id === id);
    if (!existing) throw new Error('Job not found in active list');
    const newStatus = existing.status === 'archived' ? 'published' : 'archived';
    return this.updateJob(id, { status: newStatus }, user);
  }

  // Toggle Featured
  public static async toggleFeatured(id: string, user: string = 'Super Admin'): Promise<Job> {
    const existing = this.cachedJobs.find(j => j.id === id);
    if (!existing) throw new Error('Job not found in active list');
    return this.updateJob(id, { featured: !existing.featured }, user);
  }

  // Duplicate Job
  public static async duplicateJob(id: string, user: string = 'Super Admin'): Promise<Job> {
    const original = this.cachedJobs.find(j => j.id === id);
    if (!original) throw new Error('Job to duplicate was not found');

    const newTitle = `${original.title} (Copy)`;
    const newSlug = this.generateSlug(newTitle, original.company);

    const clonedJob = {
      ...original,
      title: newTitle,
      slug: newSlug,
      status: 'draft' as const,
      featured: false,
      datePosted: new Date().toISOString()
    };

    return this.createJob(clonedJob, user);
  }

  // Renew Job (Extend closing date)
  public static async renewJob(id: string, additionalDays: number = 30, user: string = 'Super Admin'): Promise<Job> {
    const newClosing = new Date(Date.now() + additionalDays * 24 * 60 * 60 * 1000).toISOString();
    return this.updateJob(id, { closingDate: newClosing, status: 'published' }, user);
  }

  // Bulk Actions
  public static async executeBulkAction(
    jobIds: string[],
    action: 'publish' | 'unpublish' | 'feature' | 'unfeature' | 'archive' | 'delete',
    user: string = 'Super Admin'
  ): Promise<{ affectedCount: number }> {
    let affectedCount = 0;

    if (action === 'delete') {
      for (const id of jobIds) {
        await this.deleteJob(id, user);
        affectedCount++;
      }
      return { affectedCount };
    }

    for (const id of jobIds) {
      const updates: Partial<Job> = {};
      if (action === 'publish') updates.status = 'published';
      if (action === 'unpublish') updates.status = 'draft';
      if (action === 'feature') updates.featured = true;
      if (action === 'unfeature') updates.featured = false;
      if (action === 'archive') updates.status = 'archived';

      await this.updateJob(id, updates, user);
      affectedCount++;
    }

    await this.logActivity('bulk_action', `Bulk action "${action}" executed on ${affectedCount} vacancies`, undefined, undefined, user);

    return { affectedCount };
  }

  // Duplicate Detection using Title, Company, Location, Source URL, and Application URL
  public static detectDuplicate(
    candidate: { title?: string; company?: string; location?: string; applicationUrl?: string; sourceUrl?: string },
    existingJobs?: Job[],
    currentJobId?: string
  ): DuplicateMatch | null {
    const jobs = existingJobs || this.cachedJobs;
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
  public static getAnalytics(jobsList?: Job[]): JobAnalytics {
    const all = jobsList || this.cachedJobs;
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
      const locKey = j.city || j.location || 'United Kingdom';
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
    const jobs = jobsToExport || this.cachedJobs;
    const headers = [
      'id', 'title', 'slug', 'company', 'location', 'city', 'region', 'country', 'postcode',
      'salaryMin', 'salaryMax', 'salaryText', 'salaryPeriod', 'currency', 'jobType',
      'workArrangement', 'category', 'shortDescription', 'fullDescription', 'responsibilities',
      'requirements', 'qualifications', 'skills', 'benefits', 'workingHours', 'jobCardCaption', 'sourceName',
      'sourceUrl', 'applicationUrl', 'datePosted', 'closingDate', 'featured', 'status', 'views', 'applyClicks'
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
      escapeCsv(j.jobCardCaption),
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
      'title', 'company', 'location', 'city', 'region', 'country',
      'salaryMin', 'salaryMax', 'salaryText', 'salaryPeriod', 'jobType',
      'workArrangement', 'category', 'shortDescription', 'fullDescription',
      'responsibilities', 'requirements', 'qualifications', 'skills', 'benefits',
      'workingHours', 'jobCardCaption', 'sourceName', 'applicationUrl', 'closingDate', 'featured', 'status'
    ];

    const sampleRow = [
      '"Specialist Nurse – ICU"',
      '"Muve Healthcare"',
      '"United Kingdom – Nationwide"',
      '""',
      '"Nationwide"',
      '"United Kingdom"',
      '25.00',
      '27.00',
      '"£25.00 – £27.00 per hour"',
      '"per hour"',
      '"Contract"',
      '"On-site"',
      '"Healthcare & Nursing"',
      '"Short summary of the vacancy and key contract terms."',
      '"Full comprehensive description of the clinical role."',
      '"ICU Care | Patient Monitoring | Tracheostomy Support"',
      '"Valid NMC Registration | Current Clinical Competence"',
      '"BSc Nursing or equivalent"',
      '"Critical Care, Medication Administration, Airway Management"',
      '"Weekly Pay | 36 & 48 Hour Contracts | Advanced Rotas"',
      '"36 or 48 hours per week across flexible day/night shifts"',
      '"36-hour and 48-hour contracts available"',
      '"Muve Healthcare"',
      '"https://promarchconsulting.co.uk/contact"',
      '"2026-12-31"',
      '"true"',
      '"published"'
    ];

    return [headers.join(','), sampleRow.join(',')].join('\r\n');
  }

  // Parse and validate CSV content
  public static parseAndValidateCsv(csvText: string): CsvImportSummary {
    const lines = csvText.split(/\r?\n/).filter(line => line.trim().length > 0);
    if (lines.length < 2) {
      return {
        totalRows: 0,
        validRows: 0,
        invalidRows: 0,
        duplicateCount: 0,
        records: []
      };
    }

    const parseLine = (line: string): string[] => {
      const result: string[] = [];
      let current = '';
      let inQuotes = false;
      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"') {
          if (inQuotes && line[i + 1] === '"') {
            current += '"';
            i++;
          } else {
            inQuotes = !inQuotes;
          }
        } else if (char === ',' && !inQuotes) {
          result.push(current.trim());
          current = '';
        } else {
          current += char;
        }
      }
      result.push(current.trim());
      return result;
    };

    const headers = parseLine(lines[0]).map(h => h.toLowerCase().replace(/[^a-z0-9]/g, ''));
    const records: CsvImportRecord[] = [];
    let validCount = 0;
    let duplicateCount = 0;

    for (let i = 1; i < lines.length; i++) {
      const values = parseLine(lines[i]);
      if (values.length === 0 || (values.length === 1 && values[0] === '')) continue;

      const raw: Record<string, string> = {};
      headers.forEach((h, idx) => {
        raw[h] = values[idx] !== undefined ? values[idx] : '';
      });

      const errors: string[] = [];
      const title = raw['title'] || '';
      if (!title) errors.push('Title is required');

      const company = raw['company'] || 'Promarch Consulting';
      const location = raw['location'] || 'London, UK';
      const category = raw['category'] || 'General';
      const shortDesc = raw['shortdescription'] || raw['description'] || '';
      if (!shortDesc) errors.push('Short description is required');

      const jobTypeRaw = (raw['jobtype'] || 'Full-time').toLowerCase();
      let jobType: Job['jobType'] = 'Full-time';
      if (jobTypeRaw.includes('part')) jobType = 'Part-time';
      else if (jobTypeRaw.includes('contract')) jobType = 'Contract';
      else if (jobTypeRaw.includes('temp')) jobType = 'Temporary';
      else if (jobTypeRaw.includes('inter')) jobType = 'Internship';

      const arrangementRaw = (raw['workarrangement'] || 'On-site').toLowerCase();
      let workArrangement: Job['workArrangement'] = 'On-site';
      if (arrangementRaw.includes('remot')) workArrangement = 'Remote';
      else if (arrangementRaw.includes('hyb')) workArrangement = 'Hybrid';

      const statusRaw = (raw['status'] || 'draft').toLowerCase();
      let status: Job['status'] = 'draft';
      if (statusRaw === 'published') status = 'published';
      else if (statusRaw === 'archived') status = 'archived';

      const splitPipe = (val?: string) => val ? val.split('|').map(s => s.trim()).filter(Boolean) : [];
      const splitComma = (val?: string) => val ? val.split(',').map(s => s.trim()).filter(Boolean) : [];

      const duplicate = this.detectDuplicate({
        title,
        company,
        location,
        applicationUrl: raw['applicationurl'] || '',
        sourceUrl: raw['sourceurl'] || ''
      });

      if (duplicate) duplicateCount++;

      const jobData: Partial<Job> = {
        title,
        company,
        location,
        city: raw['city'] || '',
        region: raw['region'] || '',
        country: raw['country'] || 'United Kingdom',
        postcode: raw['postcode'] || '',
        salaryMin: raw['salarymin'] ? parseFloat(raw['salarymin']) : undefined,
        salaryMax: raw['salarymax'] ? parseFloat(raw['salarymax']) : undefined,
        salaryText: raw['salarytext'] || undefined,
        salaryPeriod: (raw['salaryperiod'] as any) || 'per annum',
        currency: raw['currency'] || '£',
        jobType,
        workArrangement,
        category,
        shortDescription: shortDesc,
        fullDescription: raw['fulldescription'] || shortDesc,
        responsibilities: splitPipe(raw['responsibilities']),
        requirements: splitPipe(raw['requirements']),
        qualifications: splitPipe(raw['qualifications']),
        skills: splitComma(raw['skills']),
        benefits: splitPipe(raw['benefits']),
        workingHours: raw['workinghours'] || undefined,
        jobCardCaption: raw['jobcardcaption'] || raw['contractcaption'] || raw['caption'] || undefined,
        sourceName: raw['sourcename'] || undefined,
        sourceUrl: raw['sourceurl'] || undefined,
        applicationUrl: raw['applicationurl'] || 'https://promarchconsulting.co.uk/contact',
        datePosted: raw['dateposted'] || new Date().toISOString(),
        closingDate: raw['closingdate'] || undefined,
        featured: raw['featured'] === 'true' || raw['featured'] === '1',
        status
      };

      const isValid = errors.length === 0;
      if (isValid) validCount++;

      records.push({
        rawRowIndex: i + 1,
        data: jobData,
        isValid,
        errors,
        duplicateWarning: duplicate || undefined
      });
    }

    return {
      totalRows: records.length,
      validRows: validCount,
      invalidRows: records.length - validCount,
      duplicateCount,
      records
    };
  }

  // Import Valid CSV Records into Backend
  public static async importCsvJobs(
    validJobs: Job[],
    user: string = 'Super Admin'
  ): Promise<{ importedCount: number }> {
    let importedCount = 0;

    for (const job of validJobs) {
      try {
        await this.createJob(job, user);
        importedCount++;
      } catch (e: any) {
        console.error('Failed to import job:', e);
      }
    }

    await this.logActivity(
      'imported',
      `Imported ${importedCount} vacancies into the system from CSV file.`,
      undefined,
      undefined,
      user
    );

    return { importedCount };
  }

  // Format salary utility
  public static formatSalary(job: Job): string {
    if (job.salaryText) return job.salaryText;
    const cur = job.currency || '£';
    const period = job.salaryPeriod || 'per annum';

    if (job.salaryMin && job.salaryMax) {
      return `${cur}${job.salaryMin.toLocaleString()} – ${cur}${job.salaryMax.toLocaleString()} ${period}`;
    }
    if (job.salaryMin) {
      return `From ${cur}${job.salaryMin.toLocaleString()} ${period}`;
    }
    if (job.salaryMax) {
      return `Up to ${cur}${job.salaryMax.toLocaleString()} ${period}`;
    }
    return 'Competitive salary';
  }
}
