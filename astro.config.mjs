// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  // URL de production — à ajuster lors du déploiement
  site: 'https://etreguerisseurs.com',

  // v1 : 100 % statique (rapide, SEO, hébergement gratuit).
  // Phase 2 (ventes Stripe / consultations) : passer en 'static' + endpoints
  // serverless, ou 'server' avec un adapter (@astrojs/netlify | @astrojs/vercel).
  output: 'static',

  build: {
    // Garde des URLs propres sans slash final (cohérent avec l'ancien WP)
    format: 'directory',
  },
});
