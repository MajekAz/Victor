import { Job, JobFilterParams, JobAnalytics, AdminActivityLog, DuplicateMatch, CsvImportSummary, CsvImportRecord } from '../types.ts';

const STORAGE_KEY = 'promarch_jobs_v2';
const LOGS_STORAGE_KEY = 'promarch_admin_logs_v1';
const VIEWS_TRACK_KEY = 'promarch_viewed_jobs';

// Initial high-quality UK job vacancies for Promarch Consulting sectors
const SEED_JOBS: Job[] = [
  {
    id: 'pm-job-001',
    title: 'Senior Care Assistant (Night Shifts)',
    slug: 'senior-care-assistant-night-shifts-london',
    company: 'St. Jude Healthcare Services',
    companyLogo: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&q=80&w=200',
    location: 'Camden, London, UK',
    city: 'London',
    region: 'Greater London',
    country: 'United Kingdom',
    postcode: 'NW1 8NH',
    salaryMin: 28500,
    salaryMax: 32000,
    salaryText: '£28,500 - £32,000 per year',
    salaryPeriod: 'per year',
    currency: '£',
    jobType: 'Full-time',
    workArrangement: 'On-site',
    category: 'Care Sector',
    shortDescription: 'Experienced Senior Care Assistant needed to lead our dedicated night shift team delivering high standard residential care.',
    fullDescription: 'St. Jude Healthcare is seeking a compassionate, skilled Senior Care Assistant to join our residential facility in Camden. You will lead the night care team, administer prescribed medications, monitor resident wellbeing, and support residents with dignified, person-centred care.',
    responsibilities: [
      'Supervise and support a team of care assistants during waking night shifts',
      'Safe administration, recording, and storage of resident medications according to CQC guidelines',
      'Conduct regular welfare checks and update electronic care planning records accurately',
      'Respond calmly and efficiently to medical emergencies and liaise with on-call GP or NHS 111 services',
      'Assist residents with personal care, mobility needs, and comfort throughout the night'
    ],
    requirements: [
      'NVQ/QCF Level 3 in Health and Social Care (or Level 2 working towards Level 3)',
      'Minimum 2 years previous care home or domiciliary care experience in the UK',
      'Valid Medication Administration training certificate',
      'Enhanced DBS check (or willingness to obtain via Promarch)',
      'Strong leadership and compassionate communication skills'
    ],
    qualifications: [
      'NVQ Level 3 in Health and Social Care',
      'Emergency First Aid at Work certificate',
      'Moving and Handling Passport (UK)'
    ],
    experience: '2+ years in UK adult residential or nursing care settings',
    skills: ['Medication Administration', 'Person-Centred Care', 'Care Planning', 'First Aid', 'Dementia Care', 'Team Leadership'],
    benefits: [
      'Competitive night-rate enhancements',
      'Comprehensive paid induction & ongoing training',
      'Company pension contribution',
      'Uniform provided free of charge',
      'Employee Assistance Programme with 24/7 mental health support'
    ],
    workingHours: '36 hours per week (3 x 12-hour waking nights, 20:00 - 08:00)',
    sourceName: 'Promarch Consulting',
    sourceUrl: 'https://promarchconsulting.co.uk',
    applicationUrl: 'https://promarchconsulting.co.uk/contact',
    datePosted: '2026-08-20T09:00:00.000Z',
    closingDate: '2026-09-30T23:59:59.000Z',
    featured: true,
    status: 'published',
    createdAt: '2026-08-20T09:00:00.000Z',
    updatedAt: '2026-08-20T09:00:00.000Z',
    createdBy: 'System Seed',
    views: 142,
    applyClicks: 28
  },
  {
    id: 'pm-job-002',
    title: 'Forklift Driver (Reach & Counterbalance)',
    slug: 'forklift-driver-reach-counterbalance-dartford',
    company: 'Apex Global Logistics UK',
    companyLogo: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=200',
    location: 'Dartford, Kent, UK',
    city: 'Dartford',
    region: 'Kent',
    country: 'United Kingdom',
    postcode: 'DA1 5FW',
    salaryMin: 14.50,
    salaryMax: 16.50,
    salaryText: '£14.50 - £16.50 per hour',
    salaryPeriod: 'per hour',
    currency: '£',
    jobType: 'Full-time',
    workArrangement: 'On-site',
    category: 'Warehouse & Logistics',
    shortDescription: 'Seeking accredited Forklift Drivers for high-volume distribution warehouse handling goods-in and pallet racking.',
    fullDescription: 'Apex Global Logistics is expanding operations in Dartford. We require accredited FLT Reach and Counterbalance drivers to safely load/unload articulated trailers, stack high-bay pallet racking, and prepare orders for dispatch.',
    responsibilities: [
      'Operate Reach and Counterbalance forklift trucks safely in a fast-paced ambient distribution centre',
      'Offload incoming deliveries, verify freight manifests, and locate stock in high-density racking',
      'Replenish picking bays and stage outbound pallets at loading docks',
      'Perform daily pre-use FLT safety and battery inspection checks',
      'Adhere strictly to warehouse health & safety, PPE, and pedestrian segregation protocols'
    ],
    requirements: [
      'Valid RTITB, ITSSAR, or NPORS accredited Forklift Licence (Reach or Counterbalance)',
      'Minimum 12 months recent warehouse FLT driving experience',
      'Safety footwear and high-visibility vest required',
      'Good numerical skills and basic barcode scanner (RF Gun) literacy'
    ],
    qualifications: [
      'RTITB / ITSSAR Forklift Accreditation',
      'Health and Safety in the Workplace Level 2 (preferred)'
    ],
    experience: '1+ years operating FLT in high-bay logistics facilities',
    skills: ['Forklift Reach Truck', 'Counterbalance FLT', 'RF Scanners', 'Stock Replenishment', 'Goods Inward', 'Health & Safety'],
    benefits: [
      'Overtime paid at 1.5x basic rate',
      'Subsidised on-site canteen and free parking',
      'Temp-to-perm opportunity for high performers',
      'Weekly pay via Promarch payroll'
    ],
    workingHours: '40 hours per week (4 on / 4 off shift rotation, 06:00 - 18:00)',
    sourceName: 'Indeed UK',
    sourceUrl: 'https://www.indeed.com',
    applicationUrl: 'https://promarchconsulting.co.uk/contact',
    datePosted: '2026-08-22T11:30:00.000Z',
    closingDate: '2026-09-25T23:59:59.000Z',
    featured: true,
    status: 'published',
    createdAt: '2026-08-22T11:30:00.000Z',
    updatedAt: '2026-08-22T11:30:00.000Z',
    createdBy: 'System Seed',
    views: 98,
    applyClicks: 19
  },
  {
    id: 'pm-job-003',
    title: 'Commercial Office Cleaning Supervisor',
    slug: 'commercial-office-cleaning-supervisor-city-of-london',
    company: 'Prime Clean Facilities Group',
    companyLogo: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=200',
    location: 'City of London, UK',
    city: 'London',
    region: 'Greater London',
    country: 'United Kingdom',
    postcode: 'EC2M 7PP',
    salaryMin: 15.00,
    salaryMax: 17.00,
    salaryText: '£15.00 - £17.00 per hour',
    salaryPeriod: 'per hour',
    currency: '£',
    jobType: 'Permanent',
    workArrangement: 'On-site',
    category: 'Professional Cleaning',
    shortDescription: 'Dedicated Evening Cleaning Supervisor to oversee cleaning teams across corporate financial headquarters in Central London.',
    fullDescription: 'Prime Clean Facilities Group provides premium sanitation services for corporate banking institutions in the City of London. We are recruiting an Evening Cleaning Supervisor to manage an 8-person team ensuring prestigious offices, boardrooms, and communal spaces maintain pristine cleanliness.',
    responsibilities: [
      'Direct and supervise evening cleaning operatives across 5 commercial office floors',
      'Conduct daily quality audits and sign off on completed hygiene checklists',
      'Manage cleaning chemical inventories (COSHH compliant) and replenish equipment stocks',
      'Train new cleaning recruits on health & safety, colour-coded cleaning techniques, and security procedures',
      'Liaise with building security and client facilities management teams'
    ],
    requirements: [
      'Prior supervisory or team lead experience in commercial cleaning or facilities services',
      'Knowledge of British Institute of Cleaning Science (BICSc) standards and COSHH regulations',
      'Trustworthy with excellent punctuality and clean background check',
      'Effective English communication skills'
    ],
    qualifications: [
      'BICSc Level 1 or 2 (advantageous)',
      'COSHH Awareness Training Certificate'
    ],
    experience: '2+ years commercial or corporate cleaning with 1+ year supervision',
    skills: ['Team Supervision', 'COSHH Compliance', 'Quality Auditing', 'BICSc Standards', 'Deep Cleaning', 'Inventory Control'],
    benefits: [
      'Guaranteed permanent contract with stable evening hours',
      'Full branded uniform and safety kit',
      'Access to corporate wellness benefits',
      'Career progression to Regional Facilities Manager'
    ],
    workingHours: '25 hours per week (Monday to Friday, 17:30 - 22:30)',
    sourceName: 'Promarch Consulting',
    sourceUrl: 'https://promarchconsulting.co.uk',
    applicationUrl: 'https://promarchconsulting.co.uk/contact',
    datePosted: '2026-08-18T14:00:00.000Z',
    closingDate: '2026-09-20T23:59:59.000Z',
    featured: false,
    status: 'published',
    createdAt: '2026-08-18T14:00:00.000Z',
    updatedAt: '2026-08-18T14:00:00.000Z',
    createdBy: 'System Seed',
    views: 74,
    applyClicks: 12
  },
  {
    id: 'pm-job-004',
    title: 'Head Chef / Kitchen Manager',
    slug: 'head-chef-kitchen-manager-west-end-london',
    company: 'The Connaught Grill & Brasserie',
    companyLogo: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=200',
    location: 'West End, London, UK',
    city: 'London',
    region: 'Greater London',
    country: 'United Kingdom',
    postcode: 'W1K 2AL',
    salaryMin: 42000,
    salaryMax: 48000,
    salaryText: '£42,000 - £48,000 per year + Tronc',
    salaryPeriod: 'per year',
    currency: '£',
    jobType: 'Full-time',
    workArrangement: 'On-site',
    category: 'Hospitality & Dining',
    shortDescription: 'Passionate Head Chef wanted for an established contemporary European restaurant in Mayfair. Excellent package and bonus.',
    fullDescription: 'An exciting opportunity has arisen for a seasoned Head Chef to direct the kitchen brigade at The Connaught Grill & Brasserie. We serve fresh, seasonal European cuisine to high-profile diners. The successful candidate will oversee menu design, GP margins, staff development, and Food Hygiene Level 5 standards.',
    responsibilities: [
      'Lead and inspire a brigade of 10 chefs and kitchen porters during high-volume lunch and dinner services',
      'Design seasonal menus with strong focus on locally sourced British produce and high profitability (Target 70% GP)',
      'Enforce exemplary food hygiene, HACCP systems, temperature recording, and allergen controls',
      'Manage supplier relationships, order ingredients, and maintain strict stock control',
      'Train junior chefs and foster a collaborative, respectful kitchen culture'
    ],
    requirements: [
      'Proven track record as Head Chef or Senior Sous Chef in a fast-paced premium restaurant',
      'Level 3 Food Safety & Hygiene in Catering certification',
      'Strong financial acumen regarding food costs, labour cost management, and stock auditing',
      'Passion for culinary excellence and plating aesthetics'
    ],
    qualifications: [
      'City & Guilds 706/1 & 706/2 or NVQ Professional Cookery Level 3',
      'Level 3 Supervising Food Safety in Catering'
    ],
    experience: '3+ years in senior kitchen management roles in Central London',
    skills: ['Kitchen Management', 'Menu Engineering', 'HACCP & Food Safety', 'Cost Control', 'Sous Vide Cooking', 'Team Mentoring'],
    benefits: [
      'Generous Tronc service charge distribution (approx. £6,000/yr)',
      'Performance-based quarterly profitability bonus',
      'Staff meals on shift and 50% dining discount across the restaurant group',
      '28 days paid annual leave'
    ],
    workingHours: '48 hours per week (5 days out of 7 on rota basis)',
    sourceName: 'Totaljobs',
    sourceUrl: 'https://www.totaljobs.com',
    applicationUrl: 'https://promarchconsulting.co.uk/contact',
    datePosted: '2026-08-23T16:00:00.000Z',
    closingDate: '2026-10-15T23:59:59.000Z',
    featured: true,
    status: 'published',
    createdAt: '2026-08-23T16:00:00.000Z',
    updatedAt: '2026-08-23T16:00:00.000Z',
    createdBy: 'System Seed',
    views: 115,
    applyClicks: 22
  },
  {
    id: 'pm-job-005',
    title: 'Registered General Nurse (RGN) - Complex Care',
    slug: 'registered-general-nurse-rgn-complex-care-croydon',
    company: 'Apex Healthcare Trust',
    companyLogo: 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&q=80&w=200',
    location: 'Croydon, Greater London, UK',
    city: 'Croydon',
    region: 'Greater London',
    country: 'United Kingdom',
    postcode: 'CR0 2YN',
    salaryMin: 36000,
    salaryMax: 41000,
    salaryText: '£36,000 - £41,000 per year',
    salaryPeriod: 'per year',
    currency: '£',
    jobType: 'Full-time',
    workArrangement: 'On-site',
    category: 'Nursing & Healthcare',
    shortDescription: 'Seeking an enthusiastic RGN with active NMC PIN for complex nursing care in modern private clinic environment.',
    fullDescription: 'Apex Healthcare Trust is recruiting Registered General Nurses (RGNs) for our dedicated complex rehabilitation and nursing unit in Croydon. You will provide individualised nursing care, manage syringe drivers, wound care, and multidisciplinary treatment plans.',
    responsibilities: [
      'Assess, plan, implement, and evaluate clinical nursing care plans for complex patients',
      'Administer intravenous therapies, complex medications, and wound dressings',
      'Collaborate with doctors, physiotherapists, and occupational therapists to promote recovery',
      'Act as Named Nurse and lead clinical handovers between shift teams',
      'Maintain exact nursing documentation compliant with NMC Code of Conduct'
    ],
    requirements: [
      'Current, active NMC Registration (Adult Branch)',
      'Valid UK PIN with no restrictions',
      'Minimum 1 year post-registration nursing experience',
      'Right to work in the United Kingdom'
    ],
    qualifications: [
      'BSc (Hons) in Adult Nursing (or equivalent)',
      'Active NMC Registration (RGN)'
    ],
    experience: '1+ years post-registration nursing experience in NHS or private UK healthcare',
    skills: ['NMC Registered', 'Clinical Assessment', 'IV Therapy', 'Wound Care', 'Phlebotomy', 'Care Management'],
    benefits: [
      'NMC annual registration fee reimbursed',
      'Funded CPD training and Revalidation assistance',
      'Generous NHS-matched pension scheme',
      'Subsidised gym membership and healthcare cash plan'
    ],
    workingHours: '37.5 hours per week (Internal rotation between day and night shifts)',
    sourceName: 'NHS Jobs',
    sourceUrl: 'https://www.jobs.nhs.uk',
    applicationUrl: 'https://promarchconsulting.co.uk/contact',
    datePosted: '2026-08-15T10:00:00.000Z',
    closingDate: '2026-09-18T23:59:59.000Z',
    featured: false,
    status: 'published',
    createdAt: '2026-08-15T10:00:00.000Z',
    updatedAt: '2026-08-15T10:00:00.000Z',
    createdBy: 'System Seed',
    views: 89,
    applyClicks: 16
  },
  {
    id: 'pm-job-006',
    title: 'Logistics Operations Coordinator',
    slug: 'logistics-operations-coordinator-heathrow',
    company: 'FreightLink International UK',
    companyLogo: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=200',
    location: 'Heathrow / Hounslow, London, UK',
    city: 'Hounslow',
    region: 'Greater London',
    country: 'United Kingdom',
    postcode: 'TW6 2GW',
    salaryMin: 30000,
    salaryMax: 35000,
    salaryText: '£30,000 - £35,000 per year',
    salaryPeriod: 'per year',
    currency: '£',
    jobType: 'Permanent',
    workArrangement: 'Hybrid',
    category: 'Management & Supervision',
    shortDescription: 'Coordinate air freight and road haulage movements for global supply chain clients near Heathrow Airport.',
    fullDescription: 'FreightLink International is looking for a proactive Logistics Operations Coordinator to manage day-to-day freight consignments, liaise with road carriers and customs clearance agents, and track cross-border deliveries.',
    responsibilities: [
      'Coordinate air freight export/import schedules and overland courier logistics',
      'Prepare airway bills (AWB), customs declarations, and commercial invoices',
      'Track shipments in real-time and provide transparent status updates to key corporate clients',
      'Resolve delivery exceptions and carrier delays proactively',
      'Audit freight invoices and negotiate spot haulage rates'
    ],
    requirements: [
      'At least 2 years experience in freight forwarding, road haulage, or 3PL operations',
      'Knowledge of UK customs procedures and Incoterms 2020',
      'Strong proficiency in logistics TMS/WMS software and Microsoft Excel',
      'Excellent problem-solving and client relationship skills'
    ],
    qualifications: [
      'Diploma in International Trade / Logistics (preferred)',
      'Dangerous Goods by Air Awareness (advantageous)'
    ],
    experience: '2+ years in UK logistics coordination or freight forwarding',
    skills: ['Freight Forwarding', 'Customs Declarations', 'TMS Systems', 'Incoterms', 'Client Communication', 'Excel'],
    benefits: [
      'Hybrid work model (3 days office / 2 days remote)',
      'Annual company performance bonus',
      'Life assurance and private medical coverage',
      '25 days annual leave + bank holidays'
    ],
    workingHours: '40 hours per week (Monday to Friday, 08:30 - 17:30)',
    sourceName: 'LinkedIn',
    sourceUrl: 'https://www.linkedin.com',
    applicationUrl: 'https://promarchconsulting.co.uk/contact',
    datePosted: '2026-08-21T13:00:00.000Z',
    closingDate: '2026-09-28T23:59:59.000Z',
    featured: true,
    status: 'published',
    createdAt: '2026-08-21T13:00:00.000Z',
    updatedAt: '2026-08-21T13:00:00.000Z',
    createdBy: 'System Seed',
    views: 104,
    applyClicks: 18
  }
];

export class JobService {
  // Read all jobs from storage or fallback to seed
  private static loadJobsFromStorage(): Job[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_JOBS));
        return [...SEED_JOBS];
      }
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
      return [...SEED_JOBS];
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
