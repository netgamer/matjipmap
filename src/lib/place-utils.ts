import type { CollectionEntry } from 'astro:content';

type PlaceEntry = CollectionEntry<'places'>;
const INVALID_IMAGE_PATTERNS = [
  'images.unsplash.com',
  'loremflickr.com',
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

function normalizeText(value: string): string {
  return value.toLowerCase().replace(/\s+/g, '').replace(/[^\p{L}\p{N}]/gu, '');
}

function placeKey(place: PlaceEntry): string {
  const name = normalizeText(place.data.name ?? '');
  const address = normalizeText(place.data.address ?? '');
  return `${name}|${address}`;
}

function scorePlace(place: PlaceEntry): number {
  const rating = Number(place.data.rating ?? 0);
  const reviewCount = Number(place.data.reviewCount ?? 0);
  const reviewLen = place.data.reviews?.length ?? 0;
  const imageBonus = getDisplayImageUrl(place.data.imageUrl) ? 1000 : 0;
  return imageBonus + rating * 100 + reviewCount * 10 + reviewLen;
}

export function dedupePlaces(places: PlaceEntry[]): PlaceEntry[] {
  const bestByKey = new Map<string, PlaceEntry>();

  for (const place of places) {
    const key = placeKey(place);
    const existing = bestByKey.get(key);
    if (!existing || scorePlace(place) > scorePlace(existing)) {
      bestByKey.set(key, place);
    }
  }

  return [...bestByKey.values()];
}

export function getDisplayImageUrl(url?: string): string | undefined {
  if (!url) return undefined;

  const normalized = url.trim().replace(/&amp;/g, '&');
  if (!normalized) return undefined;

  if (normalized.startsWith('http://')) return undefined;
  if (INVALID_IMAGE_PATTERNS.some((pattern) => normalized.includes(pattern))) return undefined;

  return normalized;
}
