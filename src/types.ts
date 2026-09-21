export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin';
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: string;
  name: string;
  professional_title: string;
  supporting_line: string;
  short_intro: string;
  about_description: string;
  location: string;
  phone: string;
  email: string;
  profile_image: string;
  logo_text: string;
  availability_status: string;
  iqama_status: string;
  resume_url?: string;
  updated_at: string;
}

export interface SocialLink {
  id: string;
  platform: string;
  url: string;
  icon?: string;
  is_active: boolean;
  sort_order: number;
}

export interface Skill {
  id: string;
  name: string;
  category: string;
  proficiency_level?: number;
  description?: string;
  icon?: string;
  is_active: boolean;
  is_featured?: boolean;
  sort_order: number;
}

export interface Service {
  id: string;
  code: string;
  title: string;
  subtitle: string;
  description: string;
  tags?: string[];
  icon: string;
  is_active: boolean;
  sort_order: number;
}

export interface Project {
  id: string;
  title: string;
  category: string;
  short_description: string;
  full_description: string;
  description?: string;
  thumbnail_url: string;
  images?: string[];
  technologies: string[];
  live_url?: string;
  github_url?: string;
  youtube_url?: string;
  is_featured: boolean;
  status: 'published' | 'draft' | 'hidden';
  sort_order: number;
  created_at: string;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  location: string;
  start_date: string;
  end_date: string;
  is_current: boolean;
  responsibilities: string[];
  technologies?: string[];
  sort_order: number;
}

export interface Education {
  id: string;
  degree: string;
  institution: string;
  location: string;
  start_year: string;
  end_year: string;
  grade: string;
  description?: string;
  sort_order: number;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  issue_date: string;
  credential_url?: string;
  image_url?: string;
  description?: string;
  sort_order: number;
}

export interface Award {
  id: string;
  title: string;
  issuer: string;
  year: string;
  description: string;
  sort_order: number;
}

export interface Activity {
  id: string;
  title: string;
  role: string;
  organization: string;
  period: string;
  description: string;
  sort_order: number;
}

export interface ProcessStep {
  id: string;
  step_number: string;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  sort_order: number;
}

export interface Testimonial {
  id: string;
  client_name: string;
  position: string;
  company: string;
  avatar_url?: string;
  text: string;
  rating: number;
  status: 'published' | 'hidden';
  sort_order: number;
}

export interface YouTubeVideo {
  id: string;
  youtube_url: string;
  video_id: string;
  title: string;
  category: string;
  description: string;
  thumbnail_url: string;
  is_featured: boolean;
  status: 'published' | 'hidden';
  sort_order: number;
  publish_date: string;
  duration?: string;
  tools_used?: string[];
  key_steps?: string[];
  lab_badge?: string;
}

export interface Hobby {
  id: string;
  name: string;
  icon: string;
  description: string;
  sort_order: number;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  project_type: string;
  message: string;
  is_read: boolean;
  is_replied: boolean;
  status?: 'unread' | 'read' | 'replied';
  notes?: string;
  created_at: string;
}

export interface SiteSettings {
  id: string;
  seo_title: string;
  site_title?: string;
  meta_description: string;
  keywords: string;
  og_title: string;
  og_description: string;
  og_image: string;
  enable_dark_mode: boolean;
  lets_talk_url: string;
  lets_talk_label: string;
  copyright_text: string;
  footer_copyright?: string;
  custom_css?: string;
}

export interface PortfolioData {
  profile: Profile;
  social_links: SocialLink[];
  skills: Skill[];
  services: Service[];
  projects: Project[];
  experience: Experience[];
  education: Education[];
  certifications: Certification[];
  awards: Award[];
  activities: Activity[];
  process_steps: ProcessStep[];
  testimonials: Testimonial[];
  youtube_videos: YouTubeVideo[];
  videos?: YouTubeVideo[];
  hobbies: Hobby[];
  settings: SiteSettings;
  stats: {
    total_projects: number;
    total_videos: number;
    skills_count: number;
    experience_count: number;
    education_count: number;
    messages_count?: number;
    unread_messages_count?: number;
  };
}
