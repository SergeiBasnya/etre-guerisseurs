# Être Guérisseurs — site web

Refonte du site de Pierre-Alexandre Morales (cabinet de soin & d'accompagnement,
voie toltèque). Remplace l'ancien site WordPress.

- **Stack** : [Astro 5](https://astro.build) — site statique, rapide, SEO-friendly.
- **Contenu** : centralisé dans `src/consts.ts` et `src/data/` (pas de duplication).
- **Agenda** : événements de la Page Facebook récupérés **au build**, avec un
  agenda de secours éditable à la main.

---

## Démarrer

Prérequis : **Node ≥ 20** et **pnpm**.

```bash
pnpm install      # installer les dépendances
pnpm dev          # serveur de dev → http://localhost:4321
pnpm build        # build de production → dist/
pnpm preview      # prévisualiser le build
```

---

## Structure

```
src/
  consts.ts              ← config site : coordonnées, nav, réseaux sociaux (À ÉDITER)
  data/
    stages.ts            ← stages mis en avant (cartes)
    disciplines.ts       ← disciplines / inspirations
    events.json          ← agenda de secours (généré/écrasé par le fetch Facebook)
  styles/global.css      ← design system : couleurs, typo, boutons
  layouts/Base.astro     ← <head>, polices, SEO, scripts globaux
  components/             ← TopBar, Header, Hero, Intro, Stages, Disciplines,
                            Agenda, Values, Closing, Footer
  pages/index.astro      ← assemble la page d'accueil
scripts/
  fetch-facebook-events.mjs  ← récupère les events FB au build
public/favicon.svg
reference/                 ← maquette HTML d'origine (archive)
```

### Modifier le contenu courant

| Pour changer… | Éditer… |
|---|---|
| Téléphone, email, adresse, nav, footer | `src/consts.ts` |
| Stages mis en avant | `src/data/stages.ts` |
| Disciplines | `src/data/disciplines.ts` |
| Agenda (si pas de sync Facebook) | `src/data/events.json` |
| Couleurs / typo | `src/styles/global.css` (variables `:root`) |
| Textes intervenant / valeurs | `src/components/Intro.astro`, `Values.astro` |

---

## Agenda Facebook

Les événements sont récupérés **au moment du build** par
`scripts/fetch-facebook-events.mjs`, qui écrit `src/data/events.json`.

### Configuration

Copier `.env.example` en `.env` et renseigner :

```
FB_PAGE_ID=...
FB_PAGE_ACCESS_TOKEN=...
```

> 🔑 **Où trouver le token ?** L'ancien site WordPress utilise déjà un plugin
> d'agenda Facebook : le **Page Access Token** y est stocké (réglages du plugin
> ou table `wp_options`). Le réutiliser évite de repasser toute la validation
> d'app Facebook.

### Comportement « sans casse »

- **Pas de token** → le build garde l'agenda de secours (`events.json`). Le site
  fonctionne quand même.
- **Appel API en échec** → avertissement en console, fallback conservé. **Le build
  ne plante jamais à cause de Facebook.**
- **Succès** → `events.json` est écrasé avec `source: "facebook"` et l'agenda
  affiche le badge « Synchronisé depuis Facebook ».

> ⚠️ L'API Graph restreint l'edge `/{page-id}/events` depuis 2018 : un token de
> Page avec permissions validées est nécessaire. Si l'accès n'est pas
> récupérable, on bascule sur l'agenda manuel (`events.json`) ou un flux iCal.

### Rafraîchir l'agenda

Le site étant statique, l'agenda est figé au build. Pour le rafraîchir
automatiquement, programmer un **re-build planifié** (1×/jour) :
- Netlify : *Build hooks* + scheduled function / service cron externe.
- Vercel : *Deploy Hooks* + Cron Jobs.

Manuellement : `pnpm fetch:events` puis commit, ou re-déclencher un déploiement.

---

## Déploiement

100 % statique → hébergement gratuit.

### Netlify
- Build command : `pnpm build`
- Publish directory : `dist`
- Variables d'env : `FB_PAGE_ID`, `FB_PAGE_ACCESS_TOKEN`

### Vercel
- Framework preset : Astro (détecté automatiquement)
- Mêmes variables d'env.

Penser à mettre à jour `site:` dans `astro.config.mjs` avec l'URL définitive
(pour les balises canoniques / Open Graph), puis à pointer le DNS du domaine
`etreguerisseurs.com`.

---

## Phase 2 — Ventes en ligne (prévu)

Le client vendra : **places de stages/retraites**, **formations à distance**,
**consultations**. Paiement via **Stripe**. Non implémenté en v1, mais
l'architecture le permet sans refonte :

1. **Passer Astro en mode serveur** : ajouter un adapter
   (`@astrojs/netlify` ou `@astrojs/vercel`) et `output: 'server'` (ou hybride).
2. **Stages / consultations** : pages produit + **Stripe Checkout** (page de
   paiement hébergée). Pour les créneaux de consultation, intégrer un calendrier
   (ex. Cal.com).
3. **Formations à distance** (le plus lourd : espace membre + accès contenu) :
   soit Astro SSR + authentification + contenu protégé, soit brancher une
   plateforme e-learning dédiée. À arbitrer le moment venu.
4. Secrets Stripe : voir le bloc commenté dans `.env.example`.

---

## Notes

- La maquette HTML d'origine est archivée dans `reference/` pour comparaison.
- Les images sont actuellement des URLs Unsplash (placeholders). À remplacer par
  les **photos réelles** du client — idéalement dans `src/assets/` pour profiter
  de l'optimisation d'images d'Astro (`astro:assets`).
- Édition autonome par le client : non couverte en v1. Un CMS léger (Decap CMS,
  branché sur le repo) pourra être ajouté si le besoin se confirme.
