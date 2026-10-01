export type Language = 'ua' | 'en';
export type ThemeMode = 'dark' | 'light';

export interface ServiceItem {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  description: string;
  deliverables: string[];
  techStack: string[];
  timeline: string;
  startingPrice: string;
}

export interface CaseStudy {
  id: string;
  title: string;
  client: string;
  category: 'saas' | 'ecommerce' | 'corporate' | 'iot';
  categoryLabel: string;
  year: string;
  summary: string;
  metricHighlight: string;
  metricLabel: string;
  challenge: string;
  solution: string;
  results: string[];
  technologies: string[];
  accentColor: string;
}

export interface Testimonial {
  id: string;
  author: string;
  role: string;
  company: string;
  avatarText: string;
  text: string;
  outcome: string;
}

export interface ProcessStep {
  step: string;
  title: string;
  duration: string;
  description: string;
  checklist: string[];
}

export interface EstimatorOptions {
  projectType: string;
  designComplexity: string;
  features: string[];
  timeline: string;
  currency: 'UAH' | 'USD';
}
