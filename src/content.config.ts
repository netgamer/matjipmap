import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const placesCollection = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/places' }),
  schema: z.object({
    name: z.string(),
    address: z.string(),
    lat: z.number(),
    lng: z.number(),
    category: z.enum(['korean', 'japanese', 'chinese', 'western', 'bunsik', 'cafe', 'other']),
    status: z.enum(['pending', 'verified', 'eliminated', 'reviewing']).default('pending'),
    menus: z.array(z.object({
      name: z.string(),
      price: z.number(),
    })),
    phone: z.string().optional(),
    description: z.string().optional(),
    rating: z.number().optional(),
    reviewCount: z.number().optional(),
    reporter: z.string().optional(),
    reporterId: z.string().optional(),
    reporterRegion: z.string().optional(),
    uploadedAt: z.string().optional(),
    visitedAt: z.string().optional(),
    createdAt: z.string(),
    imageUrl: z.string().optional(),
    reviews: z.array(z.object({
      userId: z.string(),
      nickname: z.string(),
      rating: z.number(),
      content: z.string(),
      date: z.string(),
      imageUrl: z.string().optional(),
    })).optional(),
  }),
});

export const collections = {
  places: placesCollection,
};
