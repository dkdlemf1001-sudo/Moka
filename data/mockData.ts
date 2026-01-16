import { Person, MainCategory, SubCategory } from '../types';

// Helper to generate random stats
const stats = () => ({
  likes: Math.floor(Math.random() * 50000) + 1000,
  comments: Math.floor(Math.random() * 500) + 10
});

export const MOCK_PEOPLE: Person[] = [
  {
    id: '1',
    name: '모카',
    mainCategory: MainCategory.CELEBRITY,
    subCategory: SubCategory.KPOP_GROUP,
    groupName: '아일릿 (ILLIT)',
    instagramUrl: 'https://www.instagram.com/illit_official/',
    mainImage: 'https://image.pollinations.ai/prompt/photo%20of%20kpop%20idol%20moka%20illit%20selfie%20black%20straight%20hair%20soft%20lighting%20realism%208k%20no%20filter?width=800&height=1000&nologo=true&seed=101',
    galleryImages: [
      { url: 'https://image.pollinations.ai/prompt/kpop%20idol%20girl%20wearing%20pink%20fuzzy%20bear%20hoodie%20with%20paws%20up%20cute%20face%20real%20photo%208k?width=800&height=1000&nologo=true&seed=202', ...stats() },
      { url: 'https://image.pollinations.ai/prompt/kpop%20idol%20girl%20wearing%20black%20beanie%20and%20colorful%20striped%20sweater%20holding%20a%20small%20doll%20real%20photo?width=800&height=1000&nologo=true&seed=303', ...stats() },
      { url: 'https://image.pollinations.ai/prompt/kpop%20idol%20girl%20winking%20with%20finger%20on%20cheek%20white%20outfit%20messy%20hair%20kitchen%20background%20flash%20photography%20real?width=800&height=1000&nologo=true&seed=404', ...stats() },
      { url: 'https://image.pollinations.ai/prompt/extreme%20close%20up%20selfie%20of%20kpop%20idol%20girl%20black%20hair%20bangs%20looking%20at%20camera%20real%20skin%20texture?width=800&height=1000&nologo=true&seed=505', ...stats() },
      { url: 'https://image.pollinations.ai/prompt/kpop%20idol%20girl%20with%20cheek%20heart%20stickers%20on%20face%20smiling%20brightly%20yellow%20frilly%20top%20real%20photo?width=800&height=1000&nologo=true&seed=606', ...stats() },
      { url: 'https://image.pollinations.ai/prompt/kpop%20idol%20airport%20fashion%20casual%20oversized%20hoodie%20mask%20waving%20hand?width=800&height=1000&nologo=true&seed=999', ...stats() },
    ],
    tags: ['인간카푸치노', '입덕요정', '반전매력', '비주얼'],
    info: {
      birthdate: '2004-10-08',
      height: '미공개',
      mbti: 'ISFP',
      hobbies: ['영화 감상', '디저트 먹기'],
      description: '아일릿의 "마더". 차분해 보이지만 무대 위에서는 표정 연기의 달인. 특히 직캠에서의 눈빛 변화가 예술이며, 멤버들을 챙기는 다정함까지 갖춘 완벽한 아이돌.'
    }
  },
  {
    id: '2',
    name: '이채영',
    mainCategory: MainCategory.CELEBRITY,
    subCategory: SubCategory.KPOP_GROUP,
    groupName: '프로미스나인',
    instagramUrl: 'https://www.instagram.com/chaengrang_/',
    mainImage: 'https://image.pollinations.ai/prompt/photo%20of%20kpop%20idol%20lee%20chaeyoung%20fromis9%20long%20black%20hair%20stage%20outfit%20charismatic%20real%20photo?width=800&height=1000&nologo=true&seed=707',
    galleryImages: [
      { url: 'https://image.pollinations.ai/prompt/kpop%20idol%20lee%20chaeyoung%20laughing%20on%20variety%20show%20casual%20clothes%20realism?width=800&height=1000&nologo=true&seed=808', ...stats() },
      { url: 'https://image.pollinations.ai/prompt/kpop%20idol%20girl%20mirror%20selfie%20fashion%20trendy%20real%20photo?width=800&height=1000&nologo=true&seed=909', ...stats() },
    ],
    tags: ['예능신', '올라운더', '확신의개그캐', '비주얼'],
    info: {
      birthdate: '2000-05-14',
      height: '169cm',
      mbti: 'ISFP',
      hobbies: ['게임', '운동', '예능 시청'],
      description: '프로미스나인의 분위기 메이커이자 확신의 예능캐. 하지만 본업 존잘러로 무대 위에서는 파워풀한 보컬과 춤선을 자랑함.'
    }
  },
  {
    id: '3',
    name: '아사',
    mainCategory: MainCategory.CELEBRITY,
    subCategory: SubCategory.KPOP_GROUP,
    groupName: '베이비몬스터',
    instagramUrl: 'https://www.instagram.com/babymonster_ygofficial/',
    mainImage: 'https://image.pollinations.ai/prompt/photo%20of%20kpop%20idol%20asa%20babymonster%20rapper%20cool%20vibe%20black%20outfit%20realism?width=800&height=1000&nologo=true&seed=1010',
    galleryImages: [
      { url: 'https://image.pollinations.ai/prompt/kpop%20idol%20girl%20rapping%20on%20stage%20holding%20microphone%20swag%20real%20photo?width=800&height=1000&nologo=true&seed=1111', ...stats() },
      { url: 'https://image.pollinations.ai/prompt/kpop%20idol%20girl%20in%20practice%20room%20mirror%20selfie%20hip%20hop%20style%20real?width=800&height=1000&nologo=true&seed=1212', ...stats() },
    ],
    tags: ['몬스터래퍼', '황금막내라인', 'YG스웩', '천재'],
    info: {
      birthdate: '2006-04-17',
      height: '미공개',
      mbti: 'ENFP',
      hobbies: ['춤', '작사', '비트메이킹'],
      description: '베이비몬스터의 올라운더 에이스. 속사포 랩은 기본, 춤선까지 완벽한 YG의 보물. 작사 작곡 능력까지 겸비한 완성형 아이돌.'
    }
  }
];