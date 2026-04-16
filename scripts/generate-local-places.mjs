import fs from 'fs';
import users from './sample-users.ts';

// 로컬 찐 맛집 데이터
const places = [
  {
    name: '고기반창고',
    address: '서울 강남구 테헤란로 123',
    lat: 37.5048,
    lng: 127.0492,
    category: 'korean',
    userId: 'user001',
    reason: '사장님이 직접 내는 고기 반찬이 일품이야. 가성비 갑이라는 말은 이걸 두고 하는 거지.',
    visitedAt: '2026-04-10',
    rating: 4.5,
    menu: '소고기 구이 정식',
    price: 15000
  },
  {
    name: '모성손만두',
    address: '서울 마포구 합정동 456',
    lat: 37.5477,
    lng: 126.9094,
    category: 'korean',
    userId: 'user002',
    reason: '할머니가 직접 뽑아주는 손만두.冷冻하지 않아서 그런지 찰지고 쫄깃해.',
    visitedAt: '2026-04-08',
    rating: 4.8,
    menu: '손만두',
    price: 8000
  },
  {
    name: '시골밥상',
    address: '서울 송파구 잠실로 12',
    lat: 37.5134,
    lng: 127.1002,
    category: 'korean',
    userId: 'user003',
    reason: '시골에서 직접 가져온 나물과 젓갈이 최고야. 백반만 먹어도 배부름.',
    visitedAt: '2026-04-05',
    rating: 4.3,
    menu: '시골 백반',
    price: 12000
  },
  {
    name: '동대문 떡볶이',
    address: '서울 중구 을지로 78',
    lat: 37.5662,
    lng: 126.9871,
    category: 'bunsik',
    userId: 'user004',
    reason: '40년 전통의 민트物です。어머니가 떡을 직접 쒔어줘.',
    visitedAt: '2026-04-03',
    rating: 4.6,
    menu: '기본 떡볶이',
    price: 6000
  },
  {
    name: '남산돈까스',
    address: '서울 중구 남산동 234',
    lat: 37.5595,
    lng: 126.9783,
    category: 'western',
    userId: 'user005',
    reason: '바삭한 옷的质量과 부드러운 속살. 소스를 안 찍어먹어도 맛있어.',
    visitedAt: '2026-04-01',
    rating: 4.4,
    menu: '등심돈까스',
    price: 13000
  },
  {
    name: '이태원 라멘',
    address: '서울 용산구 이태원로 56',
    lat: 37.5345,
    lng: 126.9934,
    category: 'japanese',
    userId: 'user006',
    reason: '일본인 주인이 직접 쒔는 라멘. 맑은 국물에 간이 딱 들어와.',
    visitedAt: '2026-03-28',
    rating: 4.7,
    menu: '미소라멘',
    price: 11000
  },
  {
    name: '북악산|Cal前回',
    address: '서울 종로구 북악로 89',
    lat: 37.6023,
    lng: 126.9672,
    category: 'korean',
    userId: 'user007',
    reason: '등산길에 숨겨진 맛집. 단품이最高堂食後朴實한 한식.',
    visitedAt: '2026-03-25',
    rating: 4.2,
    menu: '제육볶음 정식',
    price: 14000
  },
  {
    name: '판교 떡집',
    address: '경기 성남시 분당구 판교로 45',
    lat: 37.4021,
    lng: 127.1083,
    category: 'bunsik',
    userId: 'user008',
    reason: '직접 쒔는 떡이 말해주는 Fresh함. 명절에 사면 며칠이고 먹어.',
    visitedAt: '2026-03-22',
    rating: 4.5,
    menu: '인절미',
    price: 10000
  },
  {
    name: '여의도 국밥',
    address: '서울 영등포구 여의도동 12',
    lat: 37.5214,
    lng: 126.9234,
    category: 'korean',
    userId: 'user009',
    reason: '새벽부터 문 여는 진짜 맛집. 직장인들이 꼽는 1호점.',
    visitedAt: '2026-03-20',
    rating: 4.4,
    menu: '순대국밥',
    price: 9000
  },
  {
    name: '성수족발',
    address: '서울 성동구 성수동 67',
    lat: 37.5451,
    lng: 127.0442,
    category: 'korean',
    userId: 'user010',
    reason: '매일 달고 있는 족발. 김치와 먹으면 밥도둑 등극.',
    visitedAt: '2026-03-18',
    rating: 4.6,
    menu: '보쌈정식',
    price: 25000
  },
  {
    name: '건대 떡갈비',
    address: '서울 광진구 능동 89',
    lat: 37.5412,
    lng: 127.0823,
    category: 'korean',
    userId: 'user011',
    reason: '대치동 아이들 학원 엄마들이 밀어주는的秘密.spot.',
    visitedAt: '2026-03-15',
    rating: 4.3,
    menu: '떡갈비 정식',
    price: 18000
  },
  {
    name: '왕십리 국시',
    address: '서울 성동구 왕십리로 34',
    lat: 37.5612,
    lng: 127.0367,
    category: 'korean',
    userId: 'user012',
    reason: '국시 삶는 냄새가 길까지 배어. 本物の味.',
    visitedAt: '2026-03-12',
    rating: 4.7,
    menu: '칼국수',
    price: 10000
  },
  {
    name: '합정 동교동 국물떡볶이',
    address: '서울 마포구 합정동 123',
    lat: 37.5498,
    lng: 126.9134,
    category: 'bunsik',
    userId: 'user013',
    reason: '학교 앞価格帯美味い店. 친구랑 가면 반반씩 먹어야 해.',
    visitedAt: '2026-03-10',
    rating: 4.4,
    menu: '국물 떡볶이',
    price: 7000
  },
  {
    name: '상수 나曰한식당',
    address: '서울 마포구 상수동 45',
    lat: 37.5478,
    lng: 126.9234,
    category: 'korean',
    userId: 'user014',
    reason: '인테리어는 물론 음식도 완벽. 감성 맛집의 정석.',
    visitedAt: '2026-03-08',
    rating: 4.5,
    menu: '연포탕',
    price: 22000
  },
  {
    name: '역삼 초밥',
    address: '서울 강남구 역삼로 67',
    lat: 37.5012,
    lng: 127.0434,
    category: 'japanese',
    userId: 'user015',
    reason: '선생님이 매일 새벽에 잡어오는 신선함. 이 가격에 이 퀄리티?',
    visitedAt: '2026-03-05',
    rating: 4.8,
    menu: '모듬 초밥',
    price: 25000
  },
  {
    name: '삼성동국밥',
    address: '서울 강남구 삼성로 89',
    lat: 37.5089,
    lng: 127.0634,
    category: 'korean',
    userId: 'user016',
    reason: '직장인들은 다 알아. 점심엔 줄 서는 것도 일과야.',
    visitedAt: '2026-03-03',
    rating: 4.3,
    menu: '황태국밥',
    price: 8000
  },
  {
    name: '구의 감성떡볶이',
    address: '서울 광진구 구의동 23',
    lat: 37.5389,
    lng: 127.0823,
    category: 'bunsik',
    userId: 'user017',
    reason: '감성터보 즐기는 중. 밤에 가면 더 맛있어.',
    visitedAt: '2026-02-28',
    rating: 4.4,
    menu: '감성떡볶이',
    price: 12000
  },
  {
    name: '천호 통통회',
    address: '서울 강동구 천호대로 56',
    lat: 37.5382,
    lng: 127.1234,
    category: 'korean',
    userId: 'user018',
    reason: '회도쁘고 맛도쁘고. 사장님이 서비스로 주는 것이 더 맛있어.',
    visitedAt: '2026-02-25',
    rating: 4.6,
    menu: '모듬회',
    price: 35000
  },
  {
    name: '압구정 로데오 국물',
    address: '서울 강남구 압구정로 78',
    lat: 37.5289,
    lng: 127.0289,
    category: 'korean',
    userId: 'user019',
    reason: '압구정 부촌의 平價美食. 사장님이 운영하는 맛집.',
    visitedAt: '2026-02-22',
    rating: 4.5,
    menu: '소고기국밥',
    price: 11000
  },
  {
    name: '청담동 深夜食堂',
    address: '서울 강남구 청담로 34',
    lat: 37.5234,
    lng: 127.0489,
    category: 'korean',
    userId: 'user020',
    reason: '매일 12시부터 운영. 먹방인들이 몰리는 비밀.',
    visitedAt: '2026-02-20',
    rating: 4.7,
    menu: '갈비탕',
    price: 16000
  }
];

// 기존 파일 삭제
const outputDir = './src/content/places';
const existingFiles = fs.readdirSync(outputDir);
existingFiles.forEach(file => {
  if (file.endsWith('.md')) {
    fs.unlinkSync(`${outputDir}/${file}`);
  }
});
console.log('기존 md 파일 삭제 완료');

// 새 md 파일 생성
places.forEach((place, i) => {
  const user = users.find(u => u.id === place.userId);
  const id = `local-${String(i + 1).padStart(3, '0')}`;
  
  // 랜덤 리뷰 수
  const reviewCount = Math.floor(Math.random() * 15) + 3;
  const daysAgo = Math.floor(Math.random() * 60) + 1;
  const uploadDate = new Date();
  uploadDate.setDate(uploadDate.getDate() - daysAgo);
  
  const content = `---
name: "${place.name}"
address: "${place.address}"
lat: ${place.lat}
lng: ${place.lng}
category: "${place.category}"
status: "verified"
menus:
  - name: "${place.menu}"
    price: ${place.price}
description: "${place.reason}"
rating: ${place.rating}
reviewCount: ${reviewCount}
reporter: "${user.nickname}"
reporterRegion: "${user.region}"
uploadedAt: "${uploadDate.toISOString().split('T')[0]}"
visitedAt: "${place.visitedAt}"
createdAt: "${new Date().toISOString().split('T')[0]}"
---

## ${user.nickname}님의 찐 맛집 추천

${place.name}은(는) ${user.region}에 사는 ${user.nickname}님이 직접 추천하신 **로컬 찐 맛집**입니다.

### 추천 이유
${place.reason}

### 방문 일시
${place.visitedAt}

### 기본 정보
| 항목 | 내용 |
|------|------|
| 가게명 | ${place.name} |
| 주소 | ${place.address} |
| 대표 메뉴 | ${place.menu} |
| 가격 | ${place.price.toLocaleString()}원 |
| 추천인 | ${user.nickname} (${user.region}) |
`;

  fs.writeFileSync(`${outputDir}/${id}.md`, content, 'utf-8');
  console.log(`✅ ${place.name} - ${user.nickname}님 추천`);
});

console.log(`\n🎉 ${places.length}개 로컬 맛집 데이터 생성 완료!`);
console.log(`📊 총 ${users.length}명의 유저가 ${places.length}개 맛집을 추천했습니다.`);
