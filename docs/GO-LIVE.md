# Mise en ligne — remplacer l'ancien site par le nouveau

Plan de bascule de l'ancien WordPress (`etreguerisseurs.com`) vers le nouveau site Astro déployé sur Netlify, **sans perdre le référencement**.

---

## 0. Avant tout — sauvegarde
- [ ] **Exporter une sauvegarde complète de l'ancien WordPress** (fichiers + base) avant toute manip DNS. Filet de sécurité pour rollback.
- [ ] Noter chez quel registrar / hébergeur sont gérés le **domaine** et la **zone DNS**.

## 1. Pré-bascule (sur l'URL Netlify temporaire)
- [ ] Vérifier le site complet sur `https://website-client-etreguerisseurs.netlify.app` (nav, formulaire contact, agenda, blog, mobile).
- [x] **Formulaire de contact** branché sur **Netlify Forms** (champ caché `form-name`, honeypot anti-spam, case de consentement RGPD, redirection vers `/contact/?envoye=1` + message de confirmation).
  - [ ] ⚠️ Dans Netlify : **Site settings → Forms → Form notifications** → ajouter une **notification e-mail** vers l'adresse du client (sinon les messages ne sont vus que dans le dashboard).
  - [ ] Après le 1er déploiement, vérifier que le formulaire `contact` apparaît bien dans **Netlify → Forms**, puis faire un **envoi de test**.
- [x] **Témoignages** : page masquée pour la mise en ligne (retirée du footer + sitemap, 301 vers l'accueil) — à réactiver quand de vrais témoignages seront fournis.
- [x] **Politique de confidentialité** : rédigée (RGPD ; aucun traceur tiers, polices auto-hébergées ✓).
- [x] **Mentions légales** : page rédigée et propre (éditeur, SIRET `752 320 184 00019`, APE 8559A, siège Nîmes, hébergeur Netlify, e-mail `contact@`). À vérifier après le go-live (n'empêche pas la mise en ligne) : siège social toujours à Nîmes (le cabinet a déménagé à Mollans) ? statut exact (micro ?) ? médiateur conso à mentionner si requis. Détails en commentaire dans `src/pages/mentions-legales.astro`.
- [ ] **Contenu** restant : 4 affiches agenda (placeholders Unsplash), relecture des allégations de santé sur `soins-therapies` (déontologie).
- [ ] **Variables d'env Netlify** (Site settings → Environment) :
  - `FB_ICAL_URL` (si la synchro agenda Facebook est prête — sinon agenda manuel).
  - `NETLIFY_BUILD_HOOK` (pour le rebuild quotidien de l'agenda).
- [ ] Tester quelques **redirections** sur le deploy preview (ex. `/le-pardon/`, `/qui-suis-je/`) → doivent renvoyer 301 vers les bonnes pages.

## 2. Bascule du domaine (Netlify)
- [ ] **Abaisser le TTL DNS** ~24 h avant (ex. 300 s) pour une bascule rapide / rollback rapide.
- [ ] Netlify → Domain settings → **Add custom domain** : `etreguerisseurs.com` **et** `www.etreguerisseurs.com`.
- [ ] Mettre à jour le **DNS** chez le registrar : soit les *nameservers* Netlify, soit un enregistrement `A`/`ALIAS`/`CNAME` selon la méthode Netlify proposée.
- [ ] Vérifier le **HTTPS** (certificat Let's Encrypt auto-provisionné par Netlify).
- [ ] Choisir une **forme canonique** (avec ou sans `www`) et rediriger l'autre (Netlify le gère).

> ⚠️ Quand le DNS pointe vers Netlify, l'ancien WordPress n'est **plus servi** sur le domaine. C'est le moment de bascule effectif.

## 3. SEO post-bascule
- [ ] Vérifier les **redirections 301** en prod sur 5-6 anciennes URLs (cf. `public/_redirects`).
- [ ] **Google Search Console** : ajouter/valider la propriété (domaine), **soumettre `https://etreguerisseurs.com/sitemap-index.xml`**.
- [ ] **Bing Webmaster Tools** : idem.
- [ ] Surveiller la **couverture / 404** dans GSC les semaines suivantes ; compléter `_redirects` si d'anciennes URLs oubliées remontent.
- [ ] Tester les **rich results** : [Test des résultats enrichis Google](https://search.google.com/test/rich-results) sur l'accueil (LocalBusiness), une fiche agenda (Event), un article (BlogPosting).
- [ ] Tester l'**aperçu social** : [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/) + LinkedIn Post Inspector (forcer le re-scrape pour purger l'ancien cache OG).

## 4. Vérifications finales
- [ ] `robots.txt` et `sitemap-index.xml` servis et corrects.
- [ ] Liens internes, formulaire de contact, flux RSS (`/rss.xml`).
- [ ] **PageSpeed / Core Web Vitals** (mobile + desktop) sur 2-3 pages clés.
- [ ] Affichage mobile (header, agenda, sous-menus).

## 5. Rollback (si problème)
- [ ] Re-pointer le DNS vers l'ancien hébergeur WordPress (TTL bas = propagation rapide).
- [ ] Restaurer la sauvegarde WordPress si nécessaire.

---

## Table de redirections
Voir `public/_redirects`. Construite à partir du sitemap WordPress
(`wp-sitemap-*`). **À faire valider par le client** — certains mappings sont des
choix (ex. articles éditoriaux sans équivalent direct → renvoyés vers la page
la plus pertinente). Anciennes URLs couvertes :

| Ancienne URL | Nouvelle cible |
|---|---|
| `/les-mains-lumiere-magnetisme-soins/` | `/soins-therapies/` |
| `/medecine-tolteque-coeur/` | `/enseignement/#stages` |
| `/le-pardon/`, `/cercle-de-pardon-…/` | `/accompagnement/cercle-de-pardon/` |
| `/accompagner-le-changement/` | `/accompagnement/` |
| `/qui-suis-je/` | `/praticien/` |
| `/ateliers-stages/`, `/stages-ateliers/` | `/enseignement/#stages` |
| `/formation/`, `/formations_cycles/`, `/formation-a-distance/` | `/enseignement/#formations` |
| `/mentions-legales-confidentialite/` | `/mentions-legales/` |
| `/esprit-nature-photos-poemes/` | `/praticien/` |
| anciens articles | article de blog / page prestation pertinents |
| `/events/*`, `/event/*` | `/agenda/` |

## Points restants connus (hors blocage mise en ligne)
- Migrer les images de `public/` vers `src/assets/` + `astro:assets` (WebP/AVIF, `width/height` anti-CLS, preload) — meilleur LCP.
- Fiabiliser le fuseau horaire des `DTSTART` UTC quand le vrai flux Facebook sera branché.
- Décider du statut de `src/data/events.json` (artefact de build régénéré vs donnée commitée).
