export enum MainCategory {
  CELEBRITY = 'Celebrity',
  INFLUENCER = 'Influencer'
}

export enum SubCategory {
  // Celebrity types
  KPOP_GROUP = 'K-Pop Group',
  ACTOR = 'Actor',
  SOLO_ARTIST = 'Solo Artist',
  
  // Influencer types
  YOUTUBE = 'YouTube',
  INSTAGRAM = 'Instagram',
  TWITCH = 'Twitch',
  TIKTOK = 'TikTok'
}

export interface PersonInfo {
  birthdate: string;
  height?: string;
  mbti?: string;
  hobbies?: string[];
  description: string;
}

export interface Person {
  id: string;
  name: string;
  mainCategory: MainCategory;
  subCategory: SubCategory;
  groupName?: string; // Specific group name if applicable (e.g., "NewJeans")
  platformName?: string; // Channel name if applicable
  mainImage: string;
  galleryImages: string[];
  tags: string[];
  info: PersonInfo;
  instagramUrl?: string; // Specific official Instagram link
}