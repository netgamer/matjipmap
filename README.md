# 맛집맵 (MatjipMap)

> "돈을 좀 더 쓰더라도, 진짜 맛있는 한 끼"

집단지성으로 운영되는 신뢰 기반 맛집 지도 서비스입니다.

## 기술 스택

- **프레임워크**: Astro
- **스타일**: Tailwind CSS
- **데이터**: Supabase (PostgreSQL)
- **지도**: 네이버 지도 API
- **호스팅**: Cloudflare Pages

## 시작하기

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 빌드
npm run build
```

## 환경 변수 설정

`.env.example` 파일을 `.env`로 복사하고 값을 채워주세요:

```
PUBLIC_SUPABASE_URL=your_supabase_url
PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 맛집 추가하기

`src/content/places/` 폴더에 md 파일을 추가하세요:

```markdown
---
name: "가게명"
address: "주소"
lat: 37.5665
lng: 126.9780
category: "korean"
status: "pending"
menus:
  - name: "메뉴명"
    price: 12000
description: "한 줄 소개"
---

선택적 본문 내용...
```

## 이미지 수집

기존 168개 맛집 이미지를 빠르게 교체할 때:

```bash
npm run images:auto
```

- `imageUrl` 이 비어 있거나 `Unsplash` / `loremflickr` placeholder 인 항목만 대상으로 처리합니다.
- Google 이미지 검색 결과의 상단 후보를 자동 저장합니다.
- 저장 메타데이터: `imageSourcePage`, `imageSourceSite`, `imageCollectedAt`, `imageCollectionMode`

신규 맛집을 수동으로 고를 때:

```bash
npm run images:manual -- --id=naver-001
```

- 브라우저가 열리면 원하는 사진을 클릭합니다.
- 선택 즉시 해당 md 파일의 `imageUrl` 과 수집 메타데이터를 업데이트합니다.
- 수동 모드는 GUI 브라우저를 띄우므로 로컬 환경에서 실행해야 합니다.

## Supabase 테이블 생성

```sql
-- 맛집 테이블
CREATE TABLE places (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  lat DECIMAL(10, 7) NOT NULL,
  lng DECIMAL(10, 7) NOT NULL,
  category TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  menus JSONB,
  phone TEXT,
  description TEXT,
  rating DECIMAL(2, 1),
  review_count INT DEFAULT 0,
  report_count_after_elimination INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 리뷰 테이블
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  place_id UUID REFERENCES places(id),
  nickname TEXT NOT NULL,
  rating DECIMAL(2, 1) NOT NULL,
  text TEXT,
  visited_at DATE,
  is_onsite BOOLEAN DEFAULT FALSE,
  photos TEXT[],
  revisit_intention BOOLEAN,
  flagged BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 제보 테이블
CREATE TABLE reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  place_id UUID REFERENCES places(id),
  nickname TEXT,
  menu_name TEXT NOT NULL,
  price INT NOT NULL,
  description TEXT,
  photo TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- RLS 정책
ALTER TABLE places ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

-- 공개 읽기
CREATE POLICY "Allow public read" ON places FOR SELECT USING (true);
CREATE POLICY "Allow public read" ON reviews FOR SELECT USING (true);
CREATE POLICY "Allow public read" ON reports FOR SELECT USING (true);

-- 공개 쓰기
CREATE POLICY "Allow public insert" ON reviews FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert" ON reports FOR INSERT WITH CHECK (true);
```
