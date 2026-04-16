import fs from 'fs';
import path from 'path';

const users = [
  { id: 'user001', nickname: '김민수', region: '강남구' },
  { id: 'user002', nickname: '이서연', region: '홍대' },
  { id: 'user003', nickname: '박지훈', region: '잠실' },
  { id: 'user004', nickname: '최유나', region: '신촌' },
  { id: 'user005', nickname: '정우석', region: '명동' },
  { id: 'user006', nickname: '한소희', region: '이태원' },
  { id: 'user007', nickname: '강동원', region: '강북' },
  { id: 'user008', nickname: '윤서진', region: '판교' },
  { id: 'user009', nickname: '조민호', region: '여의도' },
  { id: 'user010', nickname: '장서윤', region: '성수' },
  { id: 'user011', nickname: '임준호', region: '건대' },
  { id: 'user012', nickname: '배수현', region: '왕십리' },
  { id: 'user013', nickname: '손예지', region: '합정' },
  { id: 'user014', nickname: '홍석천', region: '상수' },
  { id: 'user015', nickname: '고한별', region: '역삼' },
  { id: 'user016', nickname: '문우빈', region: '삼성' },
  { id: 'user017', nickname: '황민지', region: '구의' },
  { id: 'user018', nickname: '서준우', region: '천호' },
  { id: 'user019', nickname: '나연아', region: '압구정' },
  { id: 'user020', nickname: '차민혁', region: '청담' },
];

const reviewTemplates = {
  '백숙삼계탕': [
    '약초 향이 진하게 우러나는 백숙이 끝내줍니다. 삼계탕보다 더 깊고 깊은 맛이에요.',
    '시골에서 직접 키운 닭이라 고소하고 신선해요. 국물이 진해요.',
    '시골할머니가 직접 끓인 것처럼 정감이 느껴지는 백숙이에요.',
    '소고기가 부드럽게 녹아서 먹는 재미가 있어요. 국물만으로도 밥 한 그릇 뚝딱.',
    '여름 보양식으로 최고예요. 야채가 신선하고 육수가 진해요.',
    '인삼 향이 은은하고 닭이 부드러워서 금방 녹아요. 여름철 필수!',
    '정통 삼계탕의 맛이에요. 인삼 넣어서 더 맛있게 먹었어요.',
    '닭통살이 부드럽고糯米가 찐득해서 같이 먹으면 환상이에요.',
    '국물이 진하고 건강한 맛이에요. 다음엔 인삼 더 넣어달라고 할래요.',
    '체력 회복에 최고예요. 양도 푸짐하고 가성비 좋아요.',
  ],
  '칼국수만두': [
    '해물이 신선해서 육수가 진짜 맛있어요. 매운맛이 적당해서 좋아요.',
    '직접 만든 국수가 쫄깃해서 먹을 때마다 행복해요. 해물탕도 강추!',
    '바지락이 복날것이에요. 국물에 밥 말아 먹으면 미쳤어요.',
    '추워서 시어서 먹었는데, 뜨끈한 국물에 몸이 녹아요.',
    '해물 양이 푸짐하고, 면이 국수집 수준이에요. 인정해요!',
    '만두소도 푸짐하고 찐득해요. Sejauh ini paling enak!',
  ],
  '해물탕': [
    '붉지 않고 맑은 해물탕인데, 내장에 좋아서 그냥 좋아요.',
    '꽃게와 전복이 들어있어서 감칠맛이 대박이에요. 국물이 진짜 맛있어요.',
    '순두부도 넣어주시고, 김이랑 밥하면 그게 그거예요.',
    '시원하고 깊은 맛이에요. 해산물 Lovers를 위한 천국이에요.',
    '콩나물도 신선하고, 바다냄새 그대로예요. Locals이 좋아하는 이유.',
  ],
  '오리': [
    '오리구이가 겉은 바삭하고 속은 부드러워요. 소주 안주 최고!',
    '오리 삶은 국물이 진해서 면 넣어서 먹었어요. 미쳤어요 진짜.',
    '양이 푸짐하고 고기가 두툼해요. 불고기보다 이게 낫습니다.',
    '오리 순살이 부드러워서 아이들도 잘 먹어요. 매콤한 소스도 맛있어요.',
    '찜도 맛있지만, 구이가 더 좋아요. 껍데기가 바삭해요.',
  ],
  '중식': [
    '짬뽕이 매운맛의 균형이 좋아요. 해장이 될 정도로 속이 편해요.',
    '짬뽕이 아니라 탕면이라고 해야하나... 내 취향에 딱이에요.',
    '짜장면이 간이 딱 적당하고, 면이 쫄깃해요. 군만두도 최고!',
    '탕수육이 바삭해서 정말 맛있어요. 달콤한 소스랑 찰떡이에요.',
    '마라향이 나서 리얼 마라맛이에요. 얼얼한 맛이 중독성 있어요.',
  ],
  '보쌈족발': [
    '보쌈이 부드러워서 누르락누르락하면 바로 풀려요. 김치랑 먹으면 배가 불러요.',
    '족발보다 이게 더 맛있어요. 껍데기가 녹아요.',
    '야채랑 같이 싸서 먹으면 건강해지는 기분이 들어요.',
    '매운김치랑 같이 먹으면 술도둑이 안 불러요.',
    '고기가 신선해서 아무런 양념 없이도 맛있어요.',
    '껍데기가 쫀득하고 살이 부드러워요. 소주랑 찰떡!',
  ],
  '추어탕': [
    '추어특유의 구수한 맛이 일품이에요. 매운맛이 적당해서 좋아요.',
    '밥에 말아먹으면 진짜 맛있어요. 어장 넘버원의 맛이에요.',
    '고추장 양이 푸짐해서 매운탕을 좋아하는 저한테 딱이에요.',
    '순두부가 들어가 있어서 부드러워요. 국물이 끝내줘요.',
    '이 근처 Locals만 아는 숨은 맛집이에요. 비 오는 날 딱이에요.',
  ],
  'default': [
    'Locals만 아는 숨은 맛집이에요. 다시 방문 확정!',
    '간이 딱 맞아서 먹을 때마다 행복해요. 강추해요!',
    '가격 대비 맛이 훌륭해요. 자주 오게 되는店이에요.',
    '직접 만들어주는 메뉴라서 그런지 정이 느껴져요.',
    '주변 Locals들이 다 알고 있는 명소예요.',
    '가성비 갑이에요. 양도 푸짐하고 맛도 좋아요.',
    '야식으로도, 점심으로도 최고예요. 재방문 의향 있어요!',
  ],
};

function getReviewType(name) {
  const lowerName = name.toLowerCase();
  if (lowerName.includes('백숙') || lowerName.includes('삼계탕')) return '백숙삼계탕';
  if (lowerName.includes('칼국수') || lowerName.includes('만두')) return '칼국수만두';
  if (lowerName.includes('해물탕') || lowerName.includes('해물')) return '해물탕';
  if (lowerName.includes('오리')) return '오리';
  if (lowerName.includes('중식') || lowerName.includes('짬뽕') || lowerName.includes('짜장')) return '중식';
  if (lowerName.includes('보쌈') || lowerName.includes('족발')) return '보쌈족발';
  if (lowerName.includes('추어탕')) return '추어탕';
  return 'default';
}

function getRandomUser(excludeIds = []) {
  const available = users.filter(u => !excludeIds.includes(u.id));
  return available[Math.floor(Math.random() * available.length)];
}

function getRandomDate() {
  const year = 2026;
  const month = String(Math.floor(Math.random() * 4) + 1).padStart(2, '0');
  const day = String(Math.floor(Math.random() * 28) + 1).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getReviewsForPlace(name, reviewCount) {
  const reviewType = getReviewType(name);
  const templates = reviewTemplates[reviewType];
  const reviews = [];
  const usedUserIds = [];
  
  for (let i = 0; i < Math.min(reviewCount, 3); i++) {
    const user = getRandomUser(usedUserIds);
    usedUserIds.push(user.id);
    reviews.push({
      userId: user.id,
      nickname: user.nickname,
      rating: Math.floor(Math.random() * 2) + 4,
      content: templates[Math.floor(Math.random() * templates.length)],
      date: getRandomDate(),
    });
  }
  return reviews;
}

function generateNewContent(originalContent, name, reviewCount) {
  const reporter = getRandomUser();
  const reviews = getReviewsForPlace(name, reviewCount);
  
  const reviewsYaml = reviews.map(r => 
    `  - userId: "${r.userId}"
    nickname: "${r.nickname}"
    rating: ${r.rating}
    content: "${r.content}"
    date: "${r.date}"`
  ).join('\n');
  
  let newContent = originalContent
    .replace(/reporter: "[^"]*"/, `reporter: "${reporter.nickname}"`)
    .replace(/(reporterRegion: "[^"]*"\n)/, `reporterRegion: "${reporter.region}"\n  reporterId: "${reporter.id}"\n`)
    .replace(/reporterId: "[^"]*"\n?/g, '');
  
  newContent = newContent.replace(
    /---$/m,
    `reviews:\n${reviewsYaml}\n---`
  );
  
  return newContent;
}

function updatePlaceFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  content = content.replace(/\n{2,}---$/m, '\n---');
  
  const nameMatch = content.match(/name: "([^"]+)"/);
  const reviewCountMatch = content.match(/reviewCount: (\d+)/);
  
  if (!nameMatch || !reviewCountMatch) return false;
  
  const name = nameMatch[1];
  const reviewCount = parseInt(reviewCountMatch[1]);
  
  if (reviewCount === 0) return false;
  
  if (content.includes('reporterId:')) return false;
  
  const newContent = generateNewContent(content, name, reviewCount);
  fs.writeFileSync(filePath, newContent, 'utf8');
  return true;
}

const placesDir = './src/content/places';
const files = fs.readdirSync(placesDir).filter(f => f.endsWith('.md'));

let count = 0;
files.forEach(file => {
  if (updatePlaceFile(path.join(placesDir, file))) {
    count++;
  }
});

console.log(`Updated ${count} place files with reviews and recommenders`);
