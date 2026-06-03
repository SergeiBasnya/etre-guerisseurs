// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  // Prod : domaine final (l'URL *.netlify.app est temporaire). Servi à la racine.
  site: 'https://etreguerisseurs.com',
  base: '/',

  // v1 : 100 % statique (rapide, SEO, hébergement gratuit).
  // Phase 2 (ventes Stripe / consultations) : passer en 'static' + endpoints
  // serverless, ou 'server' avec un adapter (@astrojs/netlify | @astrojs/vercel).
  output: 'static',

  build: {
    // Garde des URLs propres sans slash final (cohérent avec l'ancien WP)
    format: 'directory',
  },
});
