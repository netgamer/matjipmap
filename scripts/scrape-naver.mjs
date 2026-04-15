import puppeteer from 'puppeteer';
import fs from 'fs';

const BASE_URL = 'https://map.naver.com/p/favorite/myPlace/folder/13c789296d6f436f9f84e7acc755c66f?c=12.00,0,0,0,dh';
const OUTPUT_FILE = './michelin-naver.json';

async function scrapeNaverMap() {
  console.log('🚀 네이버 지도 폴더 크롤링 시작...');
  
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
  
  try {
    console.log(`📍 접속 중...`);
    await page.goto(BASE_URL, { waitUntil: 'networkidle2', timeout: 60000 });
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    const title = await page.title();
    console.log(`📋 제목: ${title}`);
    
    // iframe이 있을 수 있음
    const frame = await page.$('iframe');
    if (frame) {
      console.log('📱 iframe 발견, 전환 시도...');
    }
    
    // HTML 길이
    const html = await page.content();
    console.log(`HTML 길이: ${html.length}`);
    
    // 텍스트 추출
    const text = await page.evaluate(() => document.body.innerText);
    console.log(`텍스트 미리보기: ${text.substring(0, 1000)}`);
    
    // 모든 링크
    const links = await page.evaluate(() => {
      const hrefs = [];
      document.querySelectorAll('a').forEach(a => {
        if (a.href && !hrefs.includes(a.href)) {
          hrefs.push(a.href);
        }
      });
      return hrefs.slice(0, 50);
    });
    console.log(`🔗 링크 수: ${links.length}`);
    console.log(links.slice(0, 10));
    
    // 지도 영역 확인
    const mapArea = await page.evaluate(() => {
      return {
        hasMap: !!document.querySelector('#map, .map, [class*="map"]'),
        hasList: !!document.querySelector('[class*="list"], [class*="place"]'),
        elements: document.querySelectorAll('*').length
      };
    });
    console.log('🗺️ 지도 영역:', mapArea);
    
  } catch (error) {
    console.error('❌ 오류:', error.message);
  }
  
  await browser.close();
}

scrapeNaverMap()
  .then(() => process.exit(0))
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
