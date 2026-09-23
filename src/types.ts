export type Language = 'en' | 'ur' | 'kn';

export type UserRole = 'Admin' | 'Editor' | 'Reporter' | 'User';

export interface Author {
  name: string;
  email: string;
  role: UserRole;
}

export interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  content: string;
  image: string;
  category: string; // matches Category ID
  language: Language;
  date: string;
  time: string;
  author: string;
  authorRole: UserRole;
  views: number;
  likes: number;
  featured: boolean;
  breaking: boolean;
  status: 'published' | 'draft' | 'scheduled';
  scheduledDate?: string;
}

export interface NewsCategory {
  id: string;
  nameEN: string; // e.g. "Politics"
  nameUR: string; // e.g. "سیاست"
  nameKN: string; // e.g. "ರಾಜಕೀಯ"
  icon: string;   // Lucide icon identifier
}

export interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  youtubeUrl: string;
  youtubeId: string;
  category: string;
  date: string;
}

export interface ArticleComment {
  id: string;
  articleId: string;
  name: string;
  email: string;
  content: string;
  date: string;
  approved: boolean;
}

export interface PortalSettings {
  websiteName: string;
  contactEmail: string;
  aboutText: string;
  googleAdSenseCode: string;
  googleAnalyticsId: string;
  isAdSenseActive: boolean;
  isAnalyticsActive: boolean;
  isPushNotificationSetup: boolean;
}

export interface UserAccount {
  email: string;
  name: string;
  role: UserRole;
  password?: string;
}
