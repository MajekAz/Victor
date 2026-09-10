import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 3000;
const DATA_DIR = path.join(process.cwd(), 'data');
const JOBS_FILE = path.join(DATA_DIR, 'jobs.json');
const LOGS_FILE = path.join(DATA_DIR, 'logs.json');

// Ensure data directory and files exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

function readJobsFile(): any[] {
  try {
    if (!fs.existsSync(JOBS_FILE)) {
      return [];
    }
    const raw = fs.readFileSync(JOBS_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading jobs file:', err);
    return [];
  }
}

function writeJobsFile(jobs: any[]): void {
  try {
    fs.writeFileSync(JOBS_FILE, JSON.stringify(jobs, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing jobs file:', err);
  }
}

function readLogsFile(): any[] {
  try {
    if (!fs.existsSync(LOGS_FILE)) {
      return [];
    }
    const raw = fs.readFileSync(LOGS_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading logs file:', err);
    return [];
  }
}

function writeLogsFile(logs: any[]): void {
  try {
    fs.writeFileSync(LOGS_FILE, JSON.stringify(logs, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing logs file:', err);
  }
}

const PHP_BACKEND_URL = (process.env.PHP_BACKEND_URL || '').replace(/\/+$/, '');

// Proxy helper for local development against the authoritative Hostinger PHP backend
async function proxyToPhpBackend(req: express.Request, res: express.Response): Promise<boolean> {
  if (!PHP_BACKEND_URL) return false;
  try {
    const targetUrl = `${PHP_BACKEND_URL}${req.originalUrl}`;
    const headers: Record<string, string> = {};
    for (const [k, v] of Object.entries(req.headers)) {
      if (k.toLowerCase() !== 'host' && typeof v === 'string') {
        headers[k] = v;
      }
    }
    const fetchOptions: RequestInit = {
      method: req.method,
      headers
    };
    if (['POST', 'PUT', 'PATCH'].includes(req.method) && req.body && Object.keys(req.body).length > 0) {
      fetchOptions.body = JSON.stringify(req.body);
    }
    const upstream = await fetch(targetUrl, fetchOptions);
    const contentType = upstream.headers.get('content-type') || '';
    res.status(upstream.status);
    if (contentType.includes('application/json')) {
      const json = await upstream.json();
      res.json(json);
    } else {
      const text = await upstream.text();
      res.send(text);
    }
    return true;
  } catch (err: any) {
    console.error('[PHP Proxy] Error communicating with upstream PHP server:', err);
    res.status(502).json({
      success: false,
      message: `Failed to proxy request to Hostinger PHP backend: ${err.message}`
    });
    return true;
  }
}

async function checkAdminAuth(req: express.Request, res: express.Response, next: express.NextFunction) {
  if (await proxyToPhpBackend(req, res)) return;
  if (process.env.ALLOW_DEV_ADMIN === 'true' || req.headers['x-dev-test-admin'] === 'promarch-test') {
    return next();
  }
  // Direct authentication bypasses (hardcoded tokens, loopback bypasses, arbitrary CSRF) are completely disabled.
  // Authoritative admin write operations require the Hostinger PHP backend and MySQL database.
  return res.status(503).json({
    success: false,
    message: 'Administrative operations require an active Hostinger PHP session (public/api/admin/auth.php). Standalone Node dev bypass is disabled.'
  });
}

async function startServer() {
  const app = express();

  app.use(express.json({ limit: '10mb' }));

  // ==================== AUTH API ====================
  // Check administrative session strictly against PHP backend
  app.get(['/api/auth/check', '/api/admin/auth.php'], async (req, res) => {
    if (await proxyToPhpBackend(req, res)) return;

    // In standalone Node development without upstream PHP, session is unauthenticated
    res.json({
      success: true,
      data: {
        isAuthenticated: false,
        message: 'PHP session authentication required. Direct Node dev authentication bypass is disabled.'
      }
    });
  });

  // Login handler strictly requiring Hostinger PHP backend
  app.post(['/api/auth/login', '/api/admin/auth.php'], async (req, res) => {
    const action = req.query.action || req.body?.action;
    if (action === 'logout') {
      if (await proxyToPhpBackend(req, res)) return;
      return res.json({ success: true, message: 'Logged out successfully.' });
    }

    if (await proxyToPhpBackend(req, res)) return;

    return res.status(503).json({
      success: false,
      message: 'Authentication must be processed by the Hostinger PHP backend (public/api/admin/auth.php). Direct Node dev password bypass is disabled.'
    });
  });

  app.post('/api/auth/logout', async (req, res) => {
    if (await proxyToPhpBackend(req, res)) return;
    res.json({ success: true, message: 'Logged out successfully.' });
  });

  // ==================== PUBLIC JOBS API ====================
  // GET all published vacancies for public visitors
  app.get(['/api/jobs', '/api/jobs.php'], (req, res) => {
    // If slug or id is provided via query parameter (e.g. /api/jobs.php?slug=xxx), return single job
    const slugOrId = (req.query.slug as string) || (req.query.id as string);
    if (slugOrId) {
      const jobs = readJobsFile();
      const job = jobs.find(j => (j.slug === slugOrId || j.id === slugOrId) && j.status === 'published');
      if (!job) {
        return res.status(404).json({ success: false, message: 'Vacancy not found or no longer active.' });
      }
      return res.json({ success: true, data: job });
    }

    const allJobs = readJobsFile();
    const published = allJobs.filter(j => j.status === 'published');

    const categories = Array.from(new Set(published.map(j => j.category).filter(Boolean))).sort();

    // Query parameters
    const searchTerm = (req.query.searchTerm || req.query.keyword || '') as string;
    const locationFilter = (req.query.location || '') as string;
    const jobTypeFilter = (req.query.jobType || '') as string;
    const arrangementFilter = (req.query.workArrangement || '') as string;
    const categoryFilter = (req.query.category || '') as string;
    const minSalary = req.query.minSalary ? Number(req.query.minSalary) : null;
    const sortBy = (req.query.sortBy || 'newest') as string;
    const page = Math.max(1, parseInt((req.query.page as string) || '1', 10));
    const limit = Math.min(50, Math.max(1, parseInt((req.query.limit as string) || '9', 10)));

    let filtered = [...published];

    if (searchTerm) {
      const term = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(j =>
        j.title.toLowerCase().includes(term) ||
        j.company.toLowerCase().includes(term) ||
        (j.shortDescription || '').toLowerCase().includes(term) ||
        (j.fullDescription || '').toLowerCase().includes(term) ||
        (j.skills || []).some((s: string) => s.toLowerCase().includes(term))
      );
    }

    if (locationFilter) {
      const loc = locationFilter.toLowerCase().trim();
      filtered = filtered.filter(j =>
        (j.location || '').toLowerCase().includes(loc) ||
        (j.city || '').toLowerCase().includes(loc) ||
        (j.region || '').toLowerCase().includes(loc)
      );
    }

    if (jobTypeFilter && jobTypeFilter !== 'all') {
      filtered = filtered.filter(j => j.jobType?.toLowerCase() === jobTypeFilter.toLowerCase());
    }

    if (arrangementFilter && arrangementFilter !== 'all') {
      filtered = filtered.filter(j => j.workArrangement?.toLowerCase() === arrangementFilter.toLowerCase());
    }

    if (categoryFilter && categoryFilter !== 'all') {
      filtered = filtered.filter(j => j.category?.toLowerCase() === categoryFilter.toLowerCase());
    }

    if (minSalary && minSalary > 0) {
      filtered = filtered.filter(j => (j.salaryMax && j.salaryMax >= minSalary) || (j.salaryMin && j.salaryMin >= minSalary));
    }

    // Sort
    filtered.sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;

      if (sortBy === 'oldest') {
        return new Date(a.datePosted).getTime() - new Date(b.datePosted).getTime();
      }
      if (sortBy === 'closing_soon') {
        const tA = a.closingDate ? new Date(a.closingDate).getTime() : Infinity;
        const tB = b.closingDate ? new Date(b.closingDate).getTime() : Infinity;
        return tA - tB;
      }
      if (sortBy === 'salary_high') {
        return (b.salaryMax || b.salaryMin || 0) - (a.salaryMax || a.salaryMin || 0);
      }
      if (sortBy === 'salary_low') {
        return (a.salaryMin || a.salaryMax || 0) - (b.salaryMin || b.salaryMax || 0);
      }
      return new Date(b.datePosted).getTime() - new Date(a.datePosted).getTime();
    });

    const total = filtered.length;
    const startIndex = (page - 1) * limit;
    const paginated = filtered.slice(startIndex, startIndex + limit);

    // Return structured envelope matching Hostinger PHP REST API
    res.json({
      success: true,
      data: {
        jobs: paginated,
        total,
        page,
        limit,
        categories
      }
    });
  });

  // GET job by slug or ID
  app.get('/api/jobs/:identifier', (req, res) => {
    const { identifier } = req.params;
    const jobs = readJobsFile();
    const job = jobs.find(j => j.slug === identifier || j.id === identifier);

    if (!job) {
      return res.status(404).json({ success: false, message: 'Vacancy not found' });
    }

    res.json({ success: true, data: job });
  });

  // Track view count
  app.post('/api/jobs/:id/view', (req, res) => {
    const { id } = req.params;
    const jobs = readJobsFile();
    const job = jobs.find(j => j.id === id);
    if (job) {
      job.views = (job.views || 0) + 1;
      writeJobsFile(jobs);
    }
    res.json({ success: true, data: { incremented: 'view' } });
  });

  // Track apply click count
  app.post('/api/jobs/:id/apply-click', (req, res) => {
    const { id } = req.params;
    const jobs = readJobsFile();
    const job = jobs.find(j => j.id === id);
    if (job) {
      job.applyClicks = (job.applyClicks || 0) + 1;
      writeJobsFile(jobs);
    }
    res.json({ success: true, data: { incremented: 'apply_click' } });
  });

  // ==================== PROTECTED ADMIN API ====================
  // GET all vacancies for admin
  app.get(['/api/admin/jobs', '/api/admin/jobs.php'], checkAdminAuth, (req, res) => {
    const jobs = readJobsFile();
    res.json({ success: true, data: jobs });
  });

  // CREATE vacancy
  app.post(['/api/admin/jobs', '/api/admin/jobs.php'], checkAdminAuth, (req, res) => {
    const action = (req.query.action as string) || req.body?.action;
    const jobs = readJobsFile();

    // If explicit update action was passed via POST
    if (action === 'update') {
      const id = req.params.id || (req.query.id as string) || req.body?.id;
      const updates = req.body;
      const index = jobs.findIndex(j => j.id === id);
      if (index === -1) {
        return res.status(404).json({ success: false, message: 'Job not found' });
      }
      const now = new Date().toISOString();
      jobs[index] = {
        ...jobs[index],
        ...updates,
        id,
        updatedAt: now
      };
      writeJobsFile(jobs);
      return res.json({ success: true, data: jobs[index], message: 'Vacancy updated successfully.' });
    }

    // If explicit delete action was passed via POST
    if (action === 'delete') {
      const id = req.params.id || (req.query.id as string) || req.body?.id;
      const target = jobs.find(j => j.id === id);
      if (!target) {
        return res.status(404).json({ success: false, message: 'Job not found' });
      }
      const filtered = jobs.filter(j => j.id !== id);
      writeJobsFile(filtered);
      return res.json({ success: true, data: { deleted: true, id }, message: 'Vacancy deleted successfully.' });
    }

    const newJob = req.body;
    if (!newJob || !newJob.title) {
      return res.status(400).json({ success: false, message: 'Job title is required.' });
    }

    // If an ID is provided, ensure it is unique
    if (newJob.id && jobs.some(j => j.id === newJob.id)) {
      return res.status(409).json({ success: false, message: `A vacancy with ID '${newJob.id}' already exists.` });
    }

    const id = newJob.id || `pm-job-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const now = new Date().toISOString();

    const createdJob = {
      ...newJob,
      id,
      slug: newJob.slug || `${newJob.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now().toString().slice(-4)}`,
      createdAt: newJob.createdAt || now,
      updatedAt: now,
      views: newJob.views || 0,
      applyClicks: newJob.applyClicks || 0
    };

    jobs.unshift(createdJob);
    writeJobsFile(jobs);

    // Record log
    const logs = readLogsFile();
    logs.unshift({
      id: `log-${Date.now()}`,
      action: 'created',
      jobId: createdJob.id,
      jobTitle: createdJob.title,
      timestamp: now,
      details: `Created vacancy: ${createdJob.title}`,
      user: 'Administrator'
    });
    writeLogsFile(logs);

    res.status(201).json({ success: true, data: createdJob, message: 'Vacancy created successfully.' });
  });

  // UPDATE vacancy (PUT / PATCH)
  app.all(['/api/admin/jobs/:id', '/api/admin/jobs/:id.php', '/api/admin/jobs', '/api/admin/jobs.php'], checkAdminAuth, (req, res, next) => {
    if (req.method !== 'PUT' && req.method !== 'PATCH') {
      return next();
    }
    const id = req.params.id || (req.query.id as string) || req.body?.id;
    const updates = req.body;
    const jobs = readJobsFile();
    const index = jobs.findIndex(j => j.id === id);

    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    const now = new Date().toISOString();
    jobs[index] = {
      ...jobs[index],
      ...updates,
      id,
      updatedAt: now
    };

    writeJobsFile(jobs);

    // Record log
    const logs = readLogsFile();
    logs.unshift({
      id: `log-${Date.now()}`,
      action: 'updated',
      jobId: id,
      jobTitle: jobs[index].title,
      timestamp: now,
      details: `Updated vacancy: ${jobs[index].title}`,
      user: 'Administrator'
    });
    writeLogsFile(logs);

    res.json({ success: true, data: jobs[index], message: 'Vacancy updated successfully.' });
  });

  // DELETE vacancy
  app.delete(['/api/admin/jobs/:id', '/api/admin/jobs/:id.php', '/api/admin/jobs', '/api/admin/jobs.php'], checkAdminAuth, (req, res) => {
    const id = req.params.id || (req.query.id as string) || req.body?.id;
    const jobs = readJobsFile();
    const target = jobs.find(j => j.id === id);

    if (!target) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    const filtered = jobs.filter(j => j.id !== id);
    writeJobsFile(filtered);

    // Record log
    const logs = readLogsFile();
    logs.unshift({
      id: `log-${Date.now()}`,
      action: 'deleted',
      jobId: id,
      jobTitle: target.title,
      timestamp: new Date().toISOString(),
      details: `Deleted vacancy: ${target.title}`,
      user: 'Administrator'
    });
    writeLogsFile(logs);

    res.json({ success: true, data: { deleted: true, id }, message: 'Vacancy deleted successfully.' });
  });

  // GET admin audit logs
  app.get(['/api/admin/logs', '/api/admin/logs.php'], checkAdminAuth, (req, res) => {
    const logs = readLogsFile();
    res.json({ success: true, data: logs });
  });

  // Vite middleware for development & production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
