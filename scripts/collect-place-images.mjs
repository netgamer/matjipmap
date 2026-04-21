import fs from 'fs';
import path from 'path';
import puppeteer from 'puppeteer';

const PLACES_DIR = path.resolve('src/content/places');
const PLACEHOLDER_HOSTS = ['images.unsplash.com', 'loremflickr.com'];
const INVALID_IMAGE_PATTERNS = [
  ...PLACEHOLDER_HOSTS,
  '/undefined',
  'www.menupan.com/restaurant/restimg',
  'www.localview.co.kr/cp/thumbnail',
  'img.siksinhot.com/place',
  'img.restaurantguru.com',
  'pickup-menu.co.kr/wp-content/uploads',
  'img.kr.gcp-karroter.net',
  'image.neoflat.net',
  'thumb.store114.net',
];
const SEARCH_ENGINES = [
  {
    id: 'bing-images',
    buildUrl(query) {
      return `https://www.bing.com/images/search?q=${encodeURIComponent(query)}&form=HDRSC3`;
    },
  },
  {
    id: 'google-images',
    buildUrl(query) {
      return `https://www.google.com/search?tbm=isch&hl=ko&q=${encodeURIComponent(query)}`;
    },
  },
];

function shouldRejectImageUrl(url) {
  return !url
    || !url.startsWith('http')
    || url.startsWith('http://')
    || INVALID_IMAGE_PATTERNS.some((pattern) => url.includes(pattern));
}

function decodeHtmlEntities(text) {
  return text
    .replaceAll('&quot;', '"')
    .replaceAll('&amp;', '&')
    .replaceAll('\\u002f', '/')
    .replaceAll('\\/', '/');
}

function extractBingCandidatesFromHtml(html) {
  const decoded = decodeHtmlEntities(html);
  const patterns = [
    /"murl":"(https?:\/\/[^"]+)"/g,
    /murl":"(https?:\/\/[^"]+)"/g,
    /murl&quot;:&quot;(https?:\/\/[^&]+)&quot;/g,
  ];
  const urls = [];

  for (const pattern of patterns) {
    for (const match of decoded.matchAll(pattern)) {
      const url = match[1];
      if (shouldRejectImageUrl(url)) continue;
      if (!urls.includes(url)) {
        urls.push(url);
      }
    }
  }

  return urls.slice(0, 20).map((src, index) => ({
    index,
    src,
    alt: '',
    width: 0,
    height: 0,
  }));
}

function parseArgs(argv) {
  const args = {};
  for (const arg of argv) {
    if (!arg.startsWith('--')) continue;
    const [key, ...rest] = arg.slice(2).split('=');
    args[key] = rest.length > 0 ? rest.join('=') : 'true';
  }
  return args;
}

function listPlaceFiles() {
  return fs.readdirSync(PLACES_DIR)
    .filter((name) => name.endsWith('.md'))
    .sort()
    .map((name) => path.join(PLACES_DIR, name));
}

function readFile(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}

function getFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) {
    throw new Error(`Frontmatter not found: ${content.slice(0, 80)}`);
  }
  return match[1];
}

function getField(frontmatter, key) {
  const match = frontmatter.match(new RegExp(`^${key}:\\s*"(.*)"$`, 'm'));
  return match ? match[1] : undefined;
}

function isRealImage(url) {
  return Boolean(url)
    && !url.startsWith('http://')
    && !INVALID_IMAGE_PATTERNS.some((pattern) => url.includes(pattern));
}

function updateFrontmatter(content, updates) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) {
    throw new Error('Unable to update frontmatter');
  }

  const frontmatter = match[1];
  const lines = frontmatter.split('\n');

  for (const [key, rawValue] of Object.entries(updates)) {
    const value = rawValue == null ? '' : String(rawValue);
    const line = `${key}: ${JSON.stringify(value)}`;
    let index = lines.findIndex((entry) => entry.startsWith(`${key}:`));
    if (index < 0 && key === 'imageUrl') {
      index = lines.findIndex((entry) => entry.startsWith('ImageUrl:'));
    }
    if (index >= 0) {
      lines[index] = line;
      continue;
    }

    const insertBefore = lines.findIndex((entry) => entry.startsWith('reviews:') || entry.startsWith('createdAt:'));
    if (insertBefore >= 0) {
      lines.splice(insertBefore, 0, line);
    } else {
      lines.push(line);
    }
  }

  const dedupedLines = [];
  const seenKeys = new Set();
  for (const line of lines) {
    const normalizedKey = line.startsWith('ImageUrl:') ? 'imageUrl' : line.split(':')[0];
    if (Object.prototype.hasOwnProperty.call(updates, normalizedKey)) {
      if (seenKeys.has(normalizedKey)) {
        continue;
      }
      seenKeys.add(normalizedKey);
    }
    dedupedLines.push(line);
  }

  return content.replace(match[0], `---\n${dedupedLines.join('\n')}\n---`);
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function dismissGoogleConsent(page) {
  const buttonTexts = ['동의', '모두 수락', 'I agree', 'Accept all'];
  for (const text of buttonTexts) {
    const clicked = await page.evaluate((label) => {
      const buttons = Array.from(document.querySelectorAll('button, input[type="button"]'));
      const target = buttons.find((button) => {
        const value = 'value' in button ? button.value : '';
        return button.textContent?.includes(label) || value?.includes(label);
      });
      if (target) {
        target.click();
        return true;
      }
      return false;
    }, text);
    if (clicked) {
      await sleep(1200);
      return;
    }
  }
}

async function collectCandidates(page, query) {
  let lastError = null;

  for (const engine of SEARCH_ENGINES) {
    const searchUrl = engine.buildUrl(query);

    try {
      await page.goto(searchUrl, { waitUntil: 'domcontentloaded', timeout: 90000 });
      if (engine.id === 'google-images') {
        await dismissGoogleConsent(page);
      }

      await sleep(1500);

      let candidates = [];
      if (engine.id === 'bing-images') {
        const html = await page.content();
        candidates = extractBingCandidatesFromHtml(html);
      }

      if (candidates.length === 0) {
        candidates = await page.evaluate(() => {
          const invalidSrcPatterns = [
            'data:',
            'gstatic.com/images/branding',
            'googlelogo',
            'maps.gstatic.com/tactile',
            '/logos/',
            'th.bing.com/th/id/ODLS.',
          ];

          return Array.from(document.querySelectorAll('img'))
            .map((img, index) => ({
              index,
              src: img.currentSrc || img.src,
              alt: img.alt || '',
              width: img.naturalWidth || img.width || 0,
              height: img.naturalHeight || img.height || 0,
            }))
            .filter((candidate) => {
              if (!candidate.src || !candidate.src.startsWith('http')) return false;
              if (candidate.width < 120 || candidate.height < 120) return false;
              return !invalidSrcPatterns.some((pattern) => candidate.src.includes(pattern));
            })
            .filter((candidate, index, list) => list.findIndex((item) => item.src === candidate.src) === index)
            .slice(0, 20);
        });
      }

      if (candidates.length > 0) {
        return { searchUrl, candidates, engineId: engine.id };
      }
    } catch (error) {
      try {
        const debugTitle = await page.title();
        console.log(`[DEBUG] ${engine.id} failed at ${page.url()} :: ${debugTitle}`);
      } catch {
        console.log(`[DEBUG] ${engine.id} failed before page inspection`);
      }
      lastError = error;
    }
  }

  throw lastError || new Error('No image candidates found');
}

function chooseAutoCandidate(candidates) {
  return candidates.find((candidate) => !shouldRejectImageUrl(candidate.src));
}

function getPlaceRecords(args) {
  const files = listPlaceFiles();
  const requestedId = args.id;
  const limit = Number.parseInt(args.limit || '168', 10);

  let selected = files;
  if (requestedId) {
    selected = files.filter((filePath) => path.basename(filePath, '.md') === requestedId);
  }

  const records = selected.map((filePath) => {
    const content = readFile(filePath);
    const frontmatter = getFrontmatter(content);
    return {
      filePath,
      id: path.basename(filePath, '.md'),
      content,
      name: getField(frontmatter, 'name') || '',
      address: getField(frontmatter, 'address') || '',
      imageUrl: getField(frontmatter, 'imageUrl'),
    };
  });

  const unresolved = records.filter((record) => !isRealImage(record.imageUrl));
  return unresolved.slice(0, Number.isNaN(limit) ? 168 : limit);
}

async function runAutoMode(browser, records) {
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 1200 });
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36');

  let successCount = 0;
  for (const record of records) {
    const query = `${record.name} ${record.address}`;
    console.log(`[AUTO] ${record.id} :: ${query}`);

    try {
      const { searchUrl, candidates, engineId } = await collectCandidates(page, query);
      const selected = chooseAutoCandidate(candidates);
      if (!selected) {
        console.log(`  no candidate found`);
        continue;
      }

      const updated = updateFrontmatter(record.content, {
        imageUrl: selected.src,
        imageSourcePage: searchUrl,
        imageSourceSite: engineId,
        imageCollectedAt: new Date().toISOString(),
        imageCollectionMode: 'auto',
      });

      fs.writeFileSync(record.filePath, updated, 'utf8');
      successCount += 1;
      console.log(`  saved ${selected.src}`);
      await sleep(500);
    } catch (error) {
      console.log(`  failed: ${error.message}`);
    }
  }

  await page.close();
  console.log(`Auto collection complete: ${successCount}/${records.length}`);
}

async function runManualMode(browser, records) {
  const record = records[0];
  if (!record) {
    throw new Error('Manual mode requires one unresolved record');
  }

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 1200 });
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36');

  const query = `${record.name} ${record.address}`;
  const { searchUrl, engineId } = await collectCandidates(page, query);

  let pickedCandidate = null;
  await page.exposeFunction('codexSelectImageCandidate', async (payload) => {
    pickedCandidate = payload;
  });

  await page.evaluate(() => {
    const badgeClass = 'codex-image-index-badge';
    document.querySelectorAll(`.${badgeClass}`).forEach((node) => node.remove());

    const images = Array.from(document.querySelectorAll('img'))
      .filter((img) => {
        const src = img.currentSrc || img.src;
        if (!src || !src.startsWith('http')) return false;
        if ((img.naturalWidth || img.width || 0) < 120) return false;
        if ((img.naturalHeight || img.height || 0) < 120) return false;
        return true;
      });

    const banner = document.createElement('div');
    banner.style.position = 'fixed';
    banner.style.top = '16px';
    banner.style.left = '16px';
    banner.style.zIndex = '2147483647';
    banner.style.padding = '12px 16px';
    banner.style.background = 'rgba(0, 0, 0, 0.85)';
    banner.style.color = '#fff';
    banner.style.borderRadius = '10px';
    banner.style.font = '14px/1.4 sans-serif';
    banner.textContent = '맛집맵 수동 이미지 선택: 원하는 사진을 클릭하면 저장됩니다.';
    document.body.appendChild(banner);

    images.forEach((img, index) => {
      const wrapper = img.parentElement;
      if (!wrapper) return;

      wrapper.style.position = wrapper.style.position || 'relative';
      img.style.cursor = 'crosshair';
      img.style.outline = '3px solid rgba(249, 115, 22, 0.4)';
      img.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        window.codexSelectImageCandidate({
          src: img.currentSrc || img.src,
          alt: img.alt || '',
          width: img.naturalWidth || img.width || 0,
          height: img.naturalHeight || img.height || 0,
        });
      }, true);

      const badge = document.createElement('div');
      badge.className = badgeClass;
      badge.textContent = String(index + 1);
      badge.style.position = 'absolute';
      badge.style.top = '8px';
      badge.style.left = '8px';
      badge.style.zIndex = '2147483647';
      badge.style.width = '28px';
      badge.style.height = '28px';
      badge.style.borderRadius = '999px';
      badge.style.background = '#f97316';
      badge.style.color = '#fff';
      badge.style.display = 'flex';
      badge.style.alignItems = 'center';
      badge.style.justifyContent = 'center';
      badge.style.font = '600 13px/1 sans-serif';
      wrapper.appendChild(badge);
    });
  });

  console.log(`[MANUAL] Opened browser for ${record.id}`);
  console.log(`Query: ${query}`);

  const timeoutMs = 5 * 60 * 1000;
  const startedAt = Date.now();
  while (!pickedCandidate && Date.now() - startedAt < timeoutMs) {
    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  if (!pickedCandidate) {
    await page.close();
    throw new Error('Timed out waiting for manual image selection');
  }

  const updated = updateFrontmatter(record.content, {
    imageUrl: pickedCandidate.src,
    imageSourcePage: searchUrl,
    imageSourceSite: engineId,
    imageCollectedAt: new Date().toISOString(),
    imageCollectionMode: 'manual',
  });

  fs.writeFileSync(record.filePath, updated, 'utf8');
  console.log(`Saved manual image for ${record.id}: ${pickedCandidate.src}`);
  await page.close();
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const mode = args.mode || 'auto';
  const records = getPlaceRecords(args);

  if (records.length === 0) {
    console.log('No unresolved place images found.');
    return;
  }

  const browser = await puppeteer.launch({
    headless: mode === 'manual' ? false : true,
    defaultViewport: null,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  try {
    if (mode === 'manual') {
      await runManualMode(browser, records);
    } else {
      await runAutoMode(browser, records);
    }
  } finally {
    await browser.close();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
