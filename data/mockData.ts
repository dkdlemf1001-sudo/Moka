import { Person, MainCategory, SubCategory } from '../types';

// Using consistent seeds for placeholders to simulate specific people
export const MOCK_PEOPLE: Person[] = [
  {
    id: '1',
    name: 'Lee Chaeyoung',
    mainCategory: MainCategory.CELEBRITY,
    subCategory: SubCategory.KPOP_GROUP,
    groupName: 'fromis_9',
    instagramUrl: 'https://www.instagram.com/chaengrang_/',
    // Updated seeds for fresher visuals
    mainImage: 'https://picsum.photos/seed/chaeyoung_update_v2/800/1000',
    galleryImages: [
      'https://picsum.photos/seed/chaeyoung_new_1/800/1000',
      'https://picsum.photos/seed/chaeyoung_new_2/800/1000',
      'https://picsum.photos/seed/chaeyoung_new_3/800/1000',
      'https://picsum.photos/seed/chaeyoung_new_4/800/1000',
      'https://picsum.photos/seed/chaeyoung_new_5/800/1000',
    ],
    tags: ['Variety Queen', 'All-rounder', 'Comedy', 'Visual'],
    info: {
      birthdate: '2000-05-14',
      height: '169cm',
      mbti: 'ISFP',
      hobbies: ['Gaming', 'Exercise', 'Variety Shows'],
      description: 'The mood maker of fromis_9. Known for her hilarious personality on variety shows, stunning visuals, and powerful stage presence.'
    }
  },
  {
    id: '2',
    name: 'Moka',
    mainCategory: MainCategory.CELEBRITY,
    subCategory: SubCategory.KPOP_GROUP,
    groupName: 'ILLIT',
    instagramUrl: 'https://www.instagram.com/illit_official/',
    // Completely refreshed seeds for Moka
    mainImage: 'https://picsum.photos/seed/moka_super_real_2024/800/1000',
    galleryImages: [
      'https://picsum.photos/seed/moka_magnetic_1/800/1000',
      'https://picsum.photos/seed/moka_magnetic_2/800/1000',
      'https://picsum.photos/seed/moka_magnetic_3/800/1000',
      'https://picsum.photos/seed/moka_magnetic_4/800/1000',
    ],
    tags: ['Fairy', 'Cappuccino', 'Soft', 'Dreamy'],
    info: {
      birthdate: '2004-10-08',
      height: 'Unknown',
      mbti: 'ISFP',
      hobbies: ['Watching Movies', 'Sleeping'],
      description: 'A member of ILLIT with a soft, fairy-like visual. Her "cappuccino" catchphrase and dreamy vibe capture hearts instantly.'
    }
  },
  {
    id: '3',
    name: 'Asa',
    mainCategory: MainCategory.CELEBRITY,
    subCategory: SubCategory.KPOP_GROUP,
    groupName: 'BABYMONSTER',
    instagramUrl: 'https://www.instagram.com/babymonster_ygofficial/',
    mainImage: 'https://picsum.photos/seed/asa_main_v2/800/1000',
    galleryImages: [
      'https://picsum.photos/seed/asa_rap_1/800/1000',
      'https://picsum.photos/seed/asa_rap_2/800/1000',
      'https://picsum.photos/seed/asa_rap_3/800/1000',
    ],
    tags: ['Ace', 'Rapper', 'Hip-hop', 'Charisma'],
    info: {
      birthdate: '2006-04-17',
      height: 'Unknown',
      mbti: 'ENFP',
      hobbies: ['Dancing', 'Writing Lyrics'],
      description: 'The ace of BABYMONSTER. Known for her incredible fast rapping skills, dance lines, and undeniable hip-hop swag.'
    }
  }
];