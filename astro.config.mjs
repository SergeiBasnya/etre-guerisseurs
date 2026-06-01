// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  // Preview GitHub Pages (sous-chemin). En prod réelle : site domaine + base '/'.
  site: 'https://sergeibasnya.github.io',
  base: '/etre-guerisseurs',

  // v1 : 100 % statique (rapide, SEO, hébergement gratuit).
  // Phase 2 (ventes Stripe / consultations) : passer en 'static' + endpoints
  // serverless, ou 'server' avec un adapter (@astrojs/netlify | @astrojs/vercel).
  output: 'static',

  build: {
    // Garde des URLs propres sans slash final (cohérent avec l'ancien WP)
    format: 'directory',
  },
});
