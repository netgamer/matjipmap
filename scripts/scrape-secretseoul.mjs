import puppeteer from 'puppeteer';
import fs from 'fs';

const OUTPUT_FILE = './michelin-data.json';

async function scrapeSecretSeoul() {
  console.log('🚀 시크릿 서울 미쉐린 가이드 크롤링 시작...');
  
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 3000 });
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
  
  try {
    await page.goto('https://secretseoul.com/michelin-guide-restaurants/', { 
      waitUntil: 'networkidle2', 
      timeout: 60000 
    });
    
    // 페이지 로드 후 스크롤
    await autoScroll(page);
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // JSON-LD에서 데이터 추출
    const restaurants = await page.evaluate(() => {
      const scripts = document.querySelectorAll('script[type="application/ld+json"]');
      let result = [];
      
      scripts.forEach(script => {
        try {
          const data = JSON.parse(script.textContent);
          if (data['@graph']) {
            data['@graph'].forEach(item => {
              if (item.articleBody && item.articleBody.includes('⭐')) {
                result.push(item.articleBody);
              }
            });
          }
        } catch (e) {}
      });
      
      return result.join('\n');
    });
    
    console.log('📄 데이터 추출 완료');
    console.log(restaurants.substring(0, 2000));
    
    // 파일로 저장
    fs.writeFileSync(OUTPUT_FILE, restaurants, 'utf-8');
    console.log(`\n💾 ${OUTPUT_FILE}에 저장 완료!`);
    
  } catch (error) {
    console.error('❌ 오류:', error.message);
  }
  
  await browser.close();
}

async function autoScroll(page) {
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      let totalHeight = 0;
      const distance = 500;
      const timer = setInterval(() => {
        const scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;
        
        if (totalHeight >= scrollHeight) {
          clearInterval(timer);
          resolve();
        }
      }, 100);
    });
  });
}

scrapeSecretSeoul()
  .then(() => process.exit(0))
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
