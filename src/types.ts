export interface Artwork {
  id: string;
  title: string;
  category: 'Branding' | 'Editorial' | 'Posters' | 'UI/UX' | 'Merchandise' | 'Logo Design' | 'Event Identity';
  imageUrl: string;
  description: string;
  year: string;
  artistName: string;
  specs?: string[];
  tags: string[];
  featured?: boolean;
}

export interface Artist {
  id: string;
  name: string;
  role: string;
  avatarUrl: string;
  bio: string;
  specialty: string[];
  instagramUrl?: string;
  linkedinUrl?: string;
  githubUrl?: string;
}

export interface CoreTeamMember {
  id: string;
  name: string;
  role: 'Head' | 'Co-Head' | 'Secretary' | 'President' | 'Faculty Coordinator' | 'Member';
  imageUrl?: string;
  bio: string;
}

export interface TimelineLog {
  id: string;
  title: string;
  category: string;
  description: string;
  period: string;
  events: { date: string; title: string; note?: string; imageUrl?: string }[];
}

export interface ApplicationFormState {
  name: string;
  email: string;
  field: string;
  yearOfStudy: string;
  portfolioUrl: string;
  statement: string;
}
