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
    michelinStars: z.number().optional(),
    michelinCategory: z.string().optional(),
    createdAt: z.string(),
  }),
});

export const collections = {
  places: placesCollection,
};
