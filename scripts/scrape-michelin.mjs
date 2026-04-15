import puppeteer from 'puppeteer';
import fs from 'fs';

const BASE_URL = 'https://www.google.com/maps/d/u/1/viewer?mid=1MY95ploctR2lAFBRh6DWE1OnTYjqqSo&ll=37.53966775586364%2C127.05387799340974&z=12';
const OUTPUT_FILE = './michelin-data.json';

async function scrapeMichelinMap() {
  console.log('🚀 Google Maps 공유 지도 크롤링 시작...');
  
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
  
  try {
    console.log(`📍 ${BASE_URL} 접속 중...`);
    await page.goto(BASE_URL, { waitUntil: 'networkidle2', timeout: 60000 });
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // 페이지 내용 확인
    const title = await page.title();
    console.log(`📋 제목: ${title}`);
    
    // HTML 일부 확인
    const html = await page.content();
    console.log(`HTML 길이: ${html.length}`);
    
    // 텍스트 추출
    const text = await page.evaluate(() => document.body.innerText);
    console.log(`텍스트 길이: ${text.length}`);
    console.log(`텍스트 미리보기: ${text.substring(0, 500)}`);
    
    // KML이나 데이터 링크 확인
    const links = await page.evaluate(() => {
      const hrefs = [];
      document.querySelectorAll('a[href]').forEach(a => {
        if (a.href.includes('kml') || a.href.includes('geojson') || a.href.includes('maps')) {
          hrefs.push(a.href);
        }
      });
      return hrefs;
    });
    console.log(`🔗 관련 링크:`, links);
    
    // Google Maps는 크롤링이 안 됨
    console.log('\n⚠️ Google Maps는 자동화 크롤링이 차단됩니다.');
    console.log('💡 대안: 직접 KML 파일을 다운로드 받아주세요.');
    
  } catch (error) {
    console.error('❌ 오류:', error.message);
  }
  
  await browser.close();
}

scrapeMichelinMap()
  .then(() => process.exit(0))
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
