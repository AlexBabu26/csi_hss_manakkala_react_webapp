// Accessibility
export type FontSize = 'small' | 'normal' | 'large' | 'extraLarge';
export type FontFamily = 'standard' | 'dyslexic';
export type Contrast = 'normal' | 'high';
export type Motion = 'normal' | 'reduced';

export interface AccessibilityPreferences {
  fontSize: FontSize;
  fontFamily: FontFamily;
  contrast: Contrast;
  motion: Motion;
}

export interface AccessibilityContextType {
  preferences: AccessibilityPreferences;
  setFontSize: (size: FontSize) => void;
  setFontFamily: (family: FontFamily) => void;
  setContrast: (contrast: Contrast) => void;
  setMotion: (motion: Motion) => void;
}

// Auth
export interface User {
  email: string;
}

export interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  loading: boolean;
}

// Content
export interface HeroContent {
  heading: string;
  subheading: string;
  imageUrl: string;
  csiLogoUrl?: string; // CSI Logo for Header
  schoolLogoUrl?: string; // School Logo - left side of heading (aligned with 'C')
  defLogoUrl?: string; // Def Logo - right side of heading (aligned with 'g' of 'Hearing,')
}

export interface Feature {
  id: string;
  icon: string; // Placeholder for icon component name or path
  title: string;
  description: string;
}

export interface Testimonial {
  id: string;
  quote: string;
  name: string;
  role: string;
  imageUrl: string;
}

export interface HomePageContent {
  hero: HeroContent;
  features: Feature[];
  testimonials: Testimonial[];
}

export interface Leadership {
  id: string;
  name: string;
  title: string;
  imageUrl: string;
}

export interface Facility {
  id: string;
  caption: string;
  imageUrl: string;
  altText: string;
}

export interface AboutPageContent {
  bannerImageUrl: string;
  mission: string;
  philosophy: string;
  leadership: Leadership[];
  facilities: Facility[];
}

export interface Program {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  altText: string;
}

export interface ProgramsPageContent {
  bannerImageUrl: string;
  programs: {
    academics: Program;
    therapeutics: Program;
    arts: Program;
    skills: Program;
  };
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface AdmissionsPageContent {
  bannerImageUrl: string;
  tuitionInfo: string;
  faqs: FaqItem[];
}

export interface ContactPageContent {
  address: string;
  phone: string;
  email: string;
}

export interface Event {
  id: string;
  title: string;
  date: string;
  description: string;
  images: string[];
}

export interface SiteContent {
  home: HomePageContent;
  about: AboutPageContent;
  programs: ProgramsPageContent;
  admissions: AdmissionsPageContent;
  contact: ContactPageContent;
  events: Event[];
}

export interface ContentContextType {
  content: SiteContent;
  updateHomePage: (data: HomePageContent) => Promise<void>;
  updateAboutPage: (data: AboutPageContent) => Promise<void>;
  updateProgramsPage: (data: ProgramsPageContent) => Promise<void>;
  updateAdmissionsPage: (data: AdmissionsPageContent) => Promise<void>;
  updateContactPage: (data: ContactPageContent) => Promise<void>;
  updateEvents: (data: Event[]) => Promise<void>;
  loading: boolean;
}
