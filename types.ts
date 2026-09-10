
export interface NavItem {
  label: string;
  href: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  image: string;
}

export interface Testimonial {
  id: number;
  name: string;
  role: string;
  content: string;
  avatar: string;
}

export interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  image: string;
}

export type JobType = 
  | 'Full-time' 
  | 'Part-time' 
  | 'Permanent' 
  | 'Temporary' 
  | 'Contract' 
  | 'Apprenticeship' 
  | 'Internship' 
  | 'Freelance';

export type WorkArrangement = 'On-site' | 'Hybrid' | 'Remote';

export type JobStatus = 'draft' | 'published' | 'expired' | 'archived';

export type SalaryPeriod = 'per year' | 'per hour' | 'per day' | 'per month' | 'competitive';

export interface SalaryTier {
  role: string;
  hourlyRate: string;
  hours36Yearly: string;
  hours48Yearly: string;
  notes?: string;
}

export interface Job {
  id: string;
  title: string;
  slug: string;
  company: string;
  companyLogo?: string;
  location: string;
  city?: string;
  region?: string;
  country?: string;
  postcode?: string;
  salaryMin?: number;
  salaryMax?: number;
  salaryText?: string;
  salaryPeriod?: SalaryPeriod;
  salaryTiers?: SalaryTier[];
  currency?: string;
  jobType: JobType;
  workArrangement: WorkArrangement;
  category: string;
  shortDescription: string;
  fullDescription?: string;
  responsibilities?: string[];
  requirements?: string[];
  qualifications?: string[];
  experience?: string;
  skills?: string[];
  benefits?: string[];
  workingHours?: string;
  regionsMentioned?: string;
  sourceName?: string;
  sourceUrl?: string;
  applicationUrl: string;
  datePosted: string; // ISO date string
  closingDate?: string; // ISO date string
  featured: boolean;
  status: JobStatus;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  createdBy?: string;
  updatedBy?: string;
  views?: number;
  applyClicks?: number;
}

export interface JobFilterParams {
  searchTerm?: string;
  location?: string;
  jobType?: string;
  workArrangement?: string;
  category?: string;
  minSalary?: number;
  sortBy?: 'newest' | 'oldest' | 'closing_soon' | 'salary_high' | 'salary_low';
  page?: number;
  limit?: number;
}

export interface AdminActivityLog {
  id: string;
  action: 'created' | 'updated' | 'published' | 'unpublished' | 'featured' | 'unfeatured' | 'archived' | 'deleted' | 'imported' | 'bulk_action' | 'renewed';
  jobId?: string;
  jobTitle?: string;
  details: string;
  timestamp: string;
  user: string;
}

export interface DuplicateMatch {
  existingJob: Job;
  reasons: string[];
  confidence: 'high' | 'medium';
}

export interface CsvImportRecord {
  rawRowIndex: number;
  data: Partial<Job>;
  isValid: boolean;
  errors: string[];
  duplicateWarning?: DuplicateMatch;
}

export interface CsvImportSummary {
  totalRows: number;
  validRows: number;
  invalidRows: number;
  duplicateCount: number;
  records: CsvImportRecord[];
}

export interface JobAnalytics {
  totalVacancies: number;
  activeVacancies: number;
  newThisWeek: number;
  expiringThisWeek: number;
  expiredVacancies: number;
  draftVacancies: number;
  featuredVacancies: number;
  archivedVacancies: number;
  totalViews: number;
  totalApplyClicks: number;
  mostViewedJob: { id: string; title: string; views: number; company: string } | null;
  mostPopularCategory: { category: string; count: number; views: number } | null;
  mostPopularLocation: { location: string; count: number } | null;
}

