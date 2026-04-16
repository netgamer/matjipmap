import fs from 'fs';

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
    '야들박하게 끓인 백숙이 최고예요. 약초 향이 은은해서 좋아요.',
    '닭이 부드럽게 녹아요. 국물에 밥 말면 세상 끝.',
    '시골 할머니가 끓인 듯한 정감 있는 맛이에요.',
    '여름 보양식으로 최고. 체력 회복에 탁월해요.',
    '인삼 넣어서 먹었더니 더 맛있어요. 강추!',
    '닭이 잡내 없이 순해요.糯米 넣어서 먹으면 꿀맛.',
  ],
  '칼국수만두': [
    '직접 굴린 면이 쫄깃해요. 해물 육수가 진해서 반찬이 필요 없어요.',
    '바지락이 끝내줘요. 국물에 밥 말아 먹으면 미쳐요.',
    '춘천 닭칼국수 먹은 것 같아요. 면이 너무 좋아요.',
    '만두소도 푸짐하고, 국물에 파가루 들어가서 끝내줘요.',
    '겨울에 먹으러 왔는데, 뜨끈한 국물에 몸이 녹아요.',
    '해물 양이 푸짐해요. 한입 베어 물면 해맛이 물러요.',
  ],
  '해물탕매운탕': [
    '붉지 않고 맑은 해물탕인데, 내 위에 좋아서 그냥 좋아요.',
    '꽃게와 전복이 들어가서 감칠맛이 배가나요. 국물만으로 밥 한 그릇.',
    '순두부도 넣어주시고, 김이랑 밥하면 그게 그거예요.',
    '시원하고 깊은 맛이에요. 해산물 Lovers를 위한 천국.',
    '콩나물도 신선하고, 바다냄새가 그대로예요. Locals만 아는 맛.',
    '매운탕은 매운맛이 적당해요. 추어 특유의 구수함도 좋아요.',
  ],
  '오리': [
    '오리 구이가 겉은 바삭하고 속은 부드러워요. 소주 안주로 최고!',
    '오리 삶은 국물이 진해서 면 넣어서 먹었어요. 미쳤어요.',
    '고기가 두툼해요. 불고기보다 이게 낫습니다.',
    '오리 순살이 부드러워서 아이들도 잘 먹어요.',
    '찜도 맛있지만, 구이가 더 좋아요. 껍데기가 바삭해요.',
    '양이 푸짐해요. 매콤한 소스도 맛있어서 강추.',
  ],
  '중식': [
    '짬뽕이 매운맛의 균형이 좋아요. 해장이 될 정도로 속이 편해요.',
    '짬뽕 국물이 끝내줘요. 면도 쫄깃하고 좋아요.',
    '짜장면이 간이 딱 적당해요. 면이 쫄깃하고 군만두도 최고!',
    '탕수육이 바삭해요. 달콤한 소스랑 찰떡이에요.',
    '마라향이 나서 리얼 마라맛이에요. 얼얼한 맛이 중독성 있어요.',
    '쟁반짜장이上来! 양도 푸짐하고 고명이 많아요.',
  ],
  '보쌈족발': [
    '보쌈이 부드러워서 누르락누르락하면 바로 풀려요.',
    '족발보다 이게 더 맛있어요. 껍데기가 녹아요.',
    '야채랑 같이 싸서 먹으면 건강해지는 기분이 들어요.',
    '매운 김치랑 같이 먹으면 술도둑이 안 불러요.',
    '고기가 신선해서 양념 없이도 맛있어요.',
    '껍데기가 쫀득하고 살이 부드러워요. 소주랑 찰떡!',
  ],
  '추어탕': [
    '추어 특유의 구수한 맛이 일품이에요.',
    '밥에 말아먹으면 진짜 맛있어요. 어장 넘버원의 맛.',
    '고추장 양이 푸짐해서 매운탕을 좋아하는 저한테 딱이에요.',
    '순두부가 들어가 있어서 부드러워요. 국물이 끝내줘요.',
    '이 근처 Locals만 아는 숨은 맛집이에요.',
    '비 오는 날 먹으러 오는데, 뜨끈해서 좋아요.',
  ],
  'default': [
    'Locals만 아는 숨은 맛집이에요. 다시 방문 확정!',
    '간이 딱 맞아요. 먹을 때마다 행복해요.',
    '가격 대비 맛이 훌륭해요. 자주 오게 되는店.',
    '직접 만들어주는 메뉴라서 정이 느껴져요.',
    '주변 Locals들이 다 알고 있는 명소예요.',
    '가성비 갑이에요. 양도 푸짐하고 맛도 좋아요.',
  ],
};

const menuTemplates = {
  '백숙삼계탕': ['백숙', '삼계탕', '약초백숙', '영양닭국밥', '인삼닭'],
  '칼국수만두': ['칼국수', '만두', '해물칼국수', '닭칼국수', '수제비'],
  '해물탕매운탕': ['해물탕', '매운탕', '추어탕', '김치해물탕', '꽃게탕'],
  '오리': ['오리구이', '오리 삶은국', '오리炖', '오리 소금구이', '오리 순살'],
  '중식': ['짜장면', '짬뽕', '탕수육', '군만두', '마라탕'],
  '보쌈족발': ['보쌈', '족발', '보쌈정식', '막창', '대창'],
  '추어탕': ['추어탕', '매운추어탕', '고추장추어탕', '민물장어', '미꾸라지'],
  'default': ['한식 정식', '비빔밥', '돌솥비빔밥', '김치찌개', '제육볶음'],
};

const foodImages = {
  '백숙삼계탕': [
    'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1569058242567-93de6f36f8eb?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1547592180-85f173990554?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1607330289024-1535c6b4e1c1?w=600&h=400&fit=crop',
  ],
  '칼국수만두': [
    'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1574484284002-952d92456975?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1552611052-33e04de081de?w=600&h=400&fit=crop',
  ],
  '해물탕매운탕': [
    'https://images.unsplash.com/photo-1559314809-0d155014e29e?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1580959375944-0b7b2f8b3d9e?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1615141982883-c7ad0e69fd62?w=600&h=400&fit=crop',
  ],
  '오리': [
    'https://images.unsplash.com/photo-1588359348347-9bc6cbbb689e?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1432139555190-58524dae6a55?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1518492104633-130d0cc84637?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=600&h=400&fit=crop',
  ],
  '중식': [
    'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1616543723724-2cf5b5374b79?w=600&h=400&fit=crop',
  ],
  '보쌈족발': [
    'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1551782450-17144efb9c50?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1544027994-2519d5a8b5d2?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1559847844-5315695dadae?w=600&h=400&fit=crop',
  ],
  '추어탕': [
    'https://images.unsplash.com/photo-1559847844-5315695dadae?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1534604973900-c43ab4c2e0ab?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1547592180-85f173990554?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1569058242567-93de6f36f8eb?w=600&h=400&fit=crop',
  ],
  'default': [
    'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1490818387583-1baba5e638af?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=600&h=400&fit=crop',
  ],
};

function getReviewType(name) {
  const lowerName = name.toLowerCase();
  if (lowerName.includes('백숙') || lowerName.includes('삼계탕')) return '백숙삼계탕';
  if (lowerName.includes('칼국수') || lowerName.includes('만두') || lowerName.includes('수제비')) return '칼국수만두';
  if (lowerName.includes('해물탕') || lowerName.includes('해물') || lowerName.includes('매운탕') || lowerName.includes('해장국')) return '해물탕매운탕';
  if (lowerName.includes('오리')) return '오리';
  if (lowerName.includes('중식') || lowerName.includes('짬뽕') || lowerName.includes('짜장')) return '중식';
  if (lowerName.includes('보쌈') || lowerName.includes('족발')) return '보쌈족발';
  if (lowerName.includes('추어탕') || lowerName.includes('장어')) return '추어탕';
  return 'default';
}

function getMenuType(name) {
  const lowerName = name.toLowerCase();
  if (lowerName.includes('백숙') || lowerName.includes('삼계탕')) return '백숙삼계탕';
  if (lowerName.includes('칼국수') || lowerName.includes('만두') || lowerName.includes('수제비')) return '칼국수만두';
  if (lowerName.includes('해물탕') || lowerName.includes('해물') || lowerName.includes('매운탕') || lowerName.includes('해장국')) return '해물탕매운탕';
  if (lowerName.includes('오리')) return '오리';
  if (lowerName.includes('중식') || lowerName.includes('짬뽕') || lowerName.includes('짜장')) return '중식';
  if (lowerName.includes('보쌈') || lowerName.includes('족발')) return '보쌈족발';
  if (lowerName.includes('추어탕') || lowerName.includes('장어')) return '추어탕';
  return 'default';
}

let userIndex = 0;
function getNextUser() {
  const user = users[userIndex % users.length];
  userIndex++;
  return user;
}

function getRandomDate() {
  const year = 2026;
  const month = String(Math.floor(Math.random() * 4) + 1).padStart(2, '0');
  const day = String(Math.floor(Math.random() * 28) + 1).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getRandomMenu(name) {
  const menuType = getMenuType(name);
  const menus = menuTemplates[menuType];
  const menuName = menus[Math.floor(Math.random() * menus.length)];
  const price = Math.floor(Math.random() * 12000 + 8000);
  return { name: menuName, price };
}

function getRandomImage(type, index) {
  const images = foodImages[type] || foodImages['default'];
  return images[index % images.length];
}

function getReviews(name, reviewCount, foodType) {
  const templates = reviewTemplates[foodType];
  const reviews = [];
  
  for (let i = 0; i < Math.min(reviewCount, 3); i++) {
    const user = getNextUser();
    const imageUrl = getRandomImage(foodType, i);
    reviews.push({
      userId: user.id,
      nickname: user.nickname,
      rating: Math.floor(Math.random() * 2) + 4,
      content: templates[Math.floor(Math.random() * templates.length)],
      date: getRandomDate(),
      imageUrl: imageUrl,
    });
  }
  return reviews;
}

function parseCSV(content) {
  const lines = content.split('\n').filter(line => line.trim());
  const results = [];
  
  for (let i = 6; i < lines.length; i++) {
    const line = lines[i];
    const match = line.match(/^"([^"]*)","[^"]*","[^"]*","([^"]*)","[^"]*","[^"]*","([^"]*)","([^"]*)","[^"]*","[^"]*"$/);
    if (match) {
      const name = match[1].trim();
      const address = match[2].trim();
      const lng = parseFloat(match[3]) || 126.7 + (Math.random() * 0.2 - 0.1);
      const lat = parseFloat(match[4]) || 37.5 + (Math.random() * 0.2 - 0.1);
      
      if (name && address && name !== '전체' && name !== '음식점' && name !== 'BAR' && name !== '카페') {
        results.push({ name, address, lat, lng });
      }
    }
  }
  return results;
}

function getCategory(name) {
  const lowerName = name.toLowerCase();
  if (lowerName.includes('중식') || lowerName.includes('짬뽕') || lowerName.includes('짜장')) return 'chinese';
  if (lowerName.includes('일식') || lowerName.includes('초밥') || lowerName.includes('횟') || lowerName.includes('라멘')) return 'japanese';
  if (lowerName.includes('양식') || lowerName.includes('피자') || lowerName.includes('파스타') || lowerName.includes('베이커리')) return 'western';
  if (lowerName.includes('분식') || lowerName.includes('떡볶이') || lowerName.includes('국수')) return 'bunsik';
  if (lowerName.includes('카페')) return 'cafe';
  return 'korean';
}

const csv1 = fs.readFileSync('./naver_favorites_2026-04-16.csv', 'utf8');
const csv2 = fs.readFileSync('./naver_favorites_2026-04-16 (1).csv', 'utf8');

const places1 = parseCSV(csv1);
const places2 = parseCSV(csv2);

const allPlaces = [...places1, ...places2.filter(p => !places1.some(p1 => p1.name === p.name))];

const placesDir = './src/content/places';
if (!fs.existsSync(placesDir)) {
  fs.mkdirSync(placesDir, { recursive: true });
}

const files = fs.readdirSync(placesDir).filter(f => f.endsWith('.md'));
files.forEach(f => fs.unlinkSync(`${placesDir}/${f}`));

let count = 0;
allPlaces.forEach((place, index) => {
  const id = String(index + 1).padStart(3, '0');
  const reporter = getNextUser();
  const reviewCount = Math.floor(Math.random() * 8) + 1;
  const foodType = getReviewType(place.name);
  const reviews = getReviews(place.name, reviewCount, foodType);
  const rating = (3.5 + Math.random() * 1.5).toFixed(1);
  const region = place.address.includes('인천') ? '인천' : 
                 place.address.includes('서울') ? '서울' : '경기';
  const menu = getRandomMenu(place.name);
  const mainImage = getRandomImage(foodType, index);
  
  const reviewsYaml = reviews.map(r => 
    `  - userId: "${r.userId}"
    nickname: "${r.nickname}"
    rating: ${r.rating}
    content: "${r.content}"
    date: "${r.date}"
    imageUrl: "${r.imageUrl}"`
  ).join('\n');
  
  const content = `---
name: "${place.name}"
address: "${place.address}"
lat: ${place.lat.toFixed(6)}
lng: ${place.lng.toFixed(6)}
category: "${getCategory(place.name)}"
status: "verified"
menus:
  - name: "${menu.name}"
    price: ${menu.price}
description: "Locals만 아는 숨은 맛집이에요."
rating: ${rating}
reviewCount: ${reviewCount}
reporter: "${reporter.nickname}"
reporterRegion: "${region}"
reporterId: "${reporter.id}"
uploadedAt: "${getRandomDate()}"
ImageUrl: "${mainImage}"
reviews:
${reviewsYaml}
createdAt: "2026-04-16"
---

## ${place.name}

Locals만 아는 숨은 맛집이에요.
`;

  fs.writeFileSync(`${placesDir}/naver-${id}.md`, content, 'utf8');
  count++;
});

console.log(`Generated ${count} place files with food images`);
