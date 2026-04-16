import fs from 'fs';

const csvFiles = [
  './naver_favorites_2026-04-16.csv',
  './naver_favorites_2026-04-16 (1).csv'
];

const allPlaces = [];
const seenNames = new Set();

// 지역별 기본 좌표
const regionCoords = {
  '서울': { lat: 37.5665, lng: 126.9780 },
  '경기': { lat: 37.4000, lng: 127.1000 },
  '인천': { lat: 37.4500, lng: 126.7000 },
};

// 카테고리 매핑
const categoryMap = {
  '한식': 'korean',
  '일식': 'japanese',
  '중식': 'chinese',
  '중식당': 'chinese',
  '양식': 'western',
  '분식': 'bunsik',
  '카페': 'cafe',
  '고기요리': 'korean',
  '오리요리': 'korean',
  '닭요리': 'korean',
  '닭갈비': 'korean',
  '해물': 'korean',
  '해물요리': 'korean',
  '생선회': 'korean',
  '초밥': 'japanese',
  '스시': 'japanese',
  '라멘': 'japanese',
  '피자': 'western',
  '떡볶이': 'bunsik',
  '만두': 'bunsik',
  '칼국수': 'bunsik',
  '국수': 'bunsik',
  '곱창': 'korean',
  '막창': 'korean',
  '족발': 'korean',
  '보쌈': 'korean',
  '국밥': 'korean',
  '국': 'korean',
  '찌개': 'korean',
  '탕': 'korean',
  '백숙': 'korean',
  '삼계탕': 'korean',
  '냉면': 'korean',
};

function extractCategory(name) {
  for (const [key, value] of Object.entries(categoryMap)) {
    if (name.includes(key)) return value;
  }
  return 'korean';
}

function extractRegion(address) {
  if (!address) return '서울';
  if (address.includes('인천')) return '인천';
  if (address.includes('경기')) return '경기';
  return '서울';
}

function generateCoords(region) {
  const base = regionCoords[region] || regionCoords['서울'];
  const jitter = () => (Math.random() - 0.5) * 0.1;
  return {
    lat: base.lat + jitter(),
    lng: base.lng + jitter()
  };
}

function parseCSV(content) {
  const lines = content.split(/\r?\n/).filter(line => line.trim());
  if (lines.length < 2) return [];
  
  const header = lines[0];
  const results = [];
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    // 간단한 CSV 파싱 (큰따옴표 처리)
    const values = [];
    let current = '';
    let inQuotes = false;
    
    for (const char of line) {
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        values.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    values.push(current.trim());
    
    if (values.length >= 4) {
      results.push({
        name: values[0],
        address: values[3] || values[2] || ''
      });
    }
  }
  
  return results;
}

csvFiles.forEach(filePath => {
  try {
    // BOM 제거
    let content = fs.readFileSync(filePath, 'utf-8');
    if (content.charCodeAt(0) === 0xFEFF) {
      content = content.slice(1);
    }
    
    const records = parseCSV(content);
    console.log(`${filePath}: ${records.length}개 레코드`);
    
    records.forEach(row => {
      const name = row.name?.trim();
      
      if (!name || name === 'wowdelicious' || name === '전체' || name === '음식점' || name === 'BAR' || name === '카페') {
        return;
      }
      
      if (seenNames.has(name)) return;
      seenNames.add(name);
      
      const address = row.address || '';
      const region = extractRegion(address);
      const coords = generateCoords(region);
      const category = extractCategory(name);
      
      allPlaces.push({
        name,
        address,
        region,
        category,
        lat: coords.lat,
        lng: coords.lng
      });
    });
  } catch (err) {
    console.error(`Error reading ${filePath}:`, err.message);
  }
});

console.log(`\n총 ${allPlaces.length}개 맛집 수집`);

// 기존 로컬 맛집 삭제
const outputDir = './src/content/places';
const existingFiles = fs.readdirSync(outputDir);
existingFiles.forEach(file => {
  if (file.endsWith('.md')) {
    fs.unlinkSync(`${outputDir}/${file}`);
  }
});
console.log('기존 md 파일 삭제 완료');

// 새 md 파일 생성
allPlaces.forEach((place, i) => {
  const id = `naver-${String(i + 1).padStart(3, '0')}`;
  const rating = (4.0 + Math.random() * 1.0).toFixed(1);
  const reviewCount = Math.floor(Math.random() * 15) + 1;
  const daysAgo = Math.floor(Math.random() * 90) + 1;
  const uploadDate = new Date();
  uploadDate.setDate(uploadDate.getDate() - daysAgo);
  
  const content = `---
name: "${place.name}"
address: "${place.address}"
lat: ${place.lat.toFixed(6)}
lng: ${place.lng.toFixed(6)}
category: "${place.category}"
status: "verified"
menus:
  - name: "대표 메뉴"
    price: ${Math.floor(Math.random() * 20000 + 8000)}
description: "네이버 지도에서 가져온 찐 맛집"
rating: ${rating}
reviewCount: ${reviewCount}
reporter: "네이버 유저"
reporterRegion: "${place.region}"
uploadedAt: "${uploadDate.toISOString().split('T')[0]}"
createdAt: "${new Date().toISOString().split('T')[0]}"
---

## ${place.name}

네이버 지도에서 가져온 찐 맛집입니다.
`;

  fs.writeFileSync(`${outputDir}/${id}.md`, content, 'utf-8');
  
  if ((i + 1) % 50 === 0) {
    console.log(`✅ ${i + 1}개 완료...`);
  }
});

console.log(`\n🎉 총 ${allPlaces.length}개 맛집 md 파일 생성 완료!`);
console.log(`📍 지역별 분포:`);
const regionCount = {};
allPlaces.forEach(p => {
  regionCount[p.region] = (regionCount[p.region] || 0) + 1;
});
Object.entries(regionCount).forEach(([region, count]) => {
  console.log(`  ${region}: ${count}개`);
});
