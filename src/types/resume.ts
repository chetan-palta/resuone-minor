export interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedin?: string;
  github?: string;
  website?: string;
  summary?: string;
}

export type GradeType = 'percentage' | 'cgpa10' | 'cgpa9.5';

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  gradeType?: GradeType;
  gradeValue?: string;
  description?: string;
}

export interface ResumeMetadata {
  isFresher?: boolean;
  jobRole?: string;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
  achievements: string[];
}

export interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  link?: string;
  github?: string;
  startDate?: string;
  endDate?: string;
}

export interface Skill {
  id: string;
  category: string;
  skills: string[];
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  expiryDate?: string;
  credentialId?: string;
  link?: string;
}

export interface ResumeSection {
  id: string;
  type: 'personal' | 'education' | 'experience' | 'skills' | 'projects' | 'certifications';
  visible: boolean;
  order: number;
}

export type TemplateId = 'minimal' | 'professional' | 'modern' | 'ats' | 'two-column';

export interface ResumeData {
  id?: string;
  title: string;
  templateId: TemplateId;
  accentColor: string;
  fontFamily: string;
  sections: ResumeSection[];
  personal: PersonalInfo;
  education: Education[];
  experience: Experience[];
  skills: Skill[];
  projects: Project[];
  certifications: Certification[];
  metadata?: ResumeMetadata;
  createdAt?: string;
  updatedAt?: string;
}

export const DEFAULT_RESUME: ResumeData = {
  title: 'My Resume',
  templateId: 'professional',
  accentColor: '#2563eb',
  fontFamily: 'inter',
  sections: [
    { id: 'personal', type: 'personal', visible: true, order: 0 },
    { id: 'experience', type: 'experience', visible: true, order: 1 },
    { id: 'education', type: 'education', visible: true, order: 2 },
    { id: 'skills', type: 'skills', visible: true, order: 3 },
    { id: 'projects', type: 'projects', visible: true, order: 4 },
    { id: 'certifications', type: 'certifications', visible: true, order: 5 },
  ],
  personal: {
    fullName: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    github: '',
    website: '',
    summary: '',
  },
  education: [],
  experience: [],
  skills: [],
  projects: [],
  certifications: [],
};

export const TEMPLATE_OPTIONS = [
  { id: 'minimal', name: 'Minimal', description: 'Clean and simple design' },
  { id: 'professional', name: 'Professional', description: 'Traditional corporate style' },
  { id: 'modern', name: 'Modern', description: 'Contemporary with subtle accents' },
  { id: 'ats', name: 'ATS-Friendly', description: 'Optimized for applicant tracking systems' },
  { id: 'two-column', name: 'Two Column', description: 'Efficient space utilization' },
] as const;

export const FONT_OPTIONS = [
  { id: 'inter', name: 'Inter', className: 'font-resume-inter' },
  { id: 'roboto', name: 'Roboto', className: 'font-resume-roboto' },
  { id: 'lora', name: 'Lora', className: 'font-resume-lora' },
  { id: 'ibm-plex', name: 'IBM Plex Sans', className: 'font-resume-ibm-plex' },
  { id: 'source-sans', name: 'Source Sans', className: 'font-resume-source-sans' },
] as const;
