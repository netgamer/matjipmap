// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://xn--0z2byb398d.com',
  vite: {
    plugins: [tailwindcss()]
  },
  integrations: [sitemap()]
});
