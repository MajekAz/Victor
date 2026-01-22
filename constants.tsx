import { NavItem, Service, Testimonial, BlogPost } from './types';

export const COMPANY_NAME = "Promarch Consulting";
export const COMPANY_EMAIL = "info@promarchconsulting.co.uk";
export const COMPANY_PHONE = "+44 (0) 20 1234 5678";
export const COMPANY_ADDRESS = "124 City Road, London, EC1V 2NX, United Kingdom";

// Colors precisely matched from the provided brand logo
export const COLORS = {
  primary: "#00459c",    // Deep Blue from the PROMARCH icon and text
  secondary: "#2699d6",  // Bright Blue from the CONSULTING text
  dark: "#0f172a",       // Slate-900 for high-contrast dark sections
  light: "#f8fafc",      // Slate-50 for backgrounds
};

export const NAV_LINKS: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

export const SERVICES: Service[] = [
  {
    id: "care",
    title: "Care Sector",
    description: "Specialized recruitment for elderly care, nursing homes, and domiciliary care providers across London.",
    icon: "HeartPulse",
    image: "https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "warehouse",
    title: "Warehouse & Logistics",
    description: "Connecting skilled warehouse operatives, forklift drivers, and logistics managers with leading firms.",
    icon: "Truck",
    image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "cleaning",
    title: "Professional Cleaning",
    description: "Providing reliable domestic and industrial cleaning staff for offices, hotels, and residential blocks.",
    icon: "Sparkles",
    image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "hospitality",
    title: "Hospitality & Dining",
    description: "Supplying top-tier front-of-house, kitchen staff, and management for London's premier restaurants.",
    icon: "Utensils",
    image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=800",
  },
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    name: "Sarah Jenkins",
    role: "Warehouse Manager",
    content: "Promarch Consulting provided us with 20 reliable staff within 48 hours. Their vetting process is top-notch.",
    avatar: "https://i.pravatar.cc/150?u=sarah",
  },
  {
    id: 2,
    name: "Dr. James Aris",
    role: "Care Home Director",
    content: "The care staff we received through Promarch are compassionate and highly professional. Highly recommended.",
    avatar: "https://i.pravatar.cc/150?u=james",
  },
];

export const BLOG_POSTS: BlogPost[] = [
  {
    id: 1,
    title: "Navigating the 2024 UK Care Sector Job Market",
    excerpt: "Learn about the latest trends and requirements for international candidates seeking care roles in the UK.",
    date: "Oct 12, 2023",
    category: "Care",
    image: "https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&q=80&w=1200",
  },
  {
    id: 2,
    title: "5 Skills Every Warehouse Operative Needs Today",
    excerpt: "Efficiency is key. We break down the top technical and soft skills employers are looking for right now.",
    date: "Nov 05, 2023",
    category: "Logistics",
    image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=1200",
  },
  {
    id: 3,
    title: "The Future of Hospitality Staffing in London",
    excerpt: "Post-2023 trends show a shift towards flexible work models in high-end dining and hotel management.",
    date: "Dec 01, 2023",
    category: "Hospitality",
    image: "https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&q=80&w=1200",
  },
  {
    id: 4,
    title: "Hygiene Standards: Raising the Bar in Office Spaces",
    excerpt: "Why professional industrial cleaning is no longer just an option but a core business strategy for 2024.",
    date: "Jan 10, 2024",
    category: "Cleaning",
    image: "https://images.unsplash.com/photo-1613665813446-82a78c468a1d?auto=format&fit=crop&q=80&w=1200",
  },
  {
    id: 5,
    title: "International Recruitment: A Guide for UK Employers",
    excerpt: "Sponsoring international talent for care and nursing roles. What you need to know about the new regulations.",
    date: "Feb 15, 2024",
    category: "Recruitment",
    image: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&q=80&w=1200",
  },
  {
    id: 6,
    title: "Career Progression in Modern Logistics",
    excerpt: "Moving from warehouse operative to management. We map out the professional development routes in the UK.",
    date: "Mar 02, 2024",
    category: "Logistics",
    image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=1200",
  },
];