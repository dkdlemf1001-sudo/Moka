export enum MainCategory {
  CELEBRITY = '연예인',
  INFLUENCER = '인플루언서'
}

export enum SubCategory {
  // Celebrity types
  KPOP_GROUP = 'K-POP 그룹',
  ACTOR = '배우',
  SOLO_ARTIST = '솔로 가수',
  
  // Influencer types
  YOUTUBE = '유튜브',
  INSTAGRAM = '인스타그램',
  TWITCH = '트위치',
  TIKTOK = '틱톡'
}

export interface PersonInfo {
  birthdate: string;
  height?: string;
  mbti?: string;
  hobbies?: string[];
  description: string;
}

export interface GalleryItem {
  url: string;
  likes: number;
  comments: number;
}

export interface Person {
  id: string;
  name: string;
  mainCategory: MainCategory;
  subCategory: SubCategory;
  groupName?: string; // Specific group name if applicable (e.g., "NewJeans")
  platformName?: string; // Channel name if applicable
  mainImage: string;
  galleryImages: GalleryItem[];
  tags: string[];
  info: PersonInfo;
  instagramUrl?: string; // Specific official Instagram link
}