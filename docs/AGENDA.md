# Agenda — synchronisation des événements Facebook

L'agenda du site (`/agenda` + section accueil) affiche en lecture les
événements ; l'inscription se fait sur Facebook (chaque événement renvoie vers
sa page FB). Le site étant **statique**, la mise à jour passe par un rebuild.

## Comment ça marche

```
events-manual.json  ─┐
                     ├─►  scripts/fetch-facebook-events.mjs  ─►  events.json  ─►  <Agenda />
flux iCal Facebook  ─┘        (hook prebuild, à chaque build)
   (FB_ICAL_URL)
```

- **`src/data/events-manual.json`** — événements curés à la main (toujours
  affichés ; portent le prix, le lieu détaillé, etc.). **C'est ici qu'on édite
  à la main.**
- **Flux iCal Facebook** — récupéré au build si `FB_ICAL_URL` est défini.
- **`src/data/events.json`** — **généré** à chaque build (ne pas éditer). Fusion
  des deux sources : le manuel garde l'affichage curé, mais on y **injecte
  l'URL Facebook d'inscription** quand l'événement existe aussi sur FB. Les
  événements présents seulement sur FB sont ajoutés. Passés/annulés filtrés,
  tri chronologique.

> ⚠️ L'API Graph `/{page-id}/events` de Facebook est un endpoint **restreint**
> depuis 2018 (jeu de données vide pour les apps non approuvées). On n'utilise
> donc PAS l'API Graph, mais le **flux iCal** du compte.

## Phase 0 — Récupérer l'URL iCal (action du client, une fois)

> ⚠️ À valider sur du réel : si les événements sont portés par une **Page**
> (et non le profil perso), ils n'apparaissent dans le flux iCal perso que si
> le compte est marqué « Participe / Intéressé ». Si rien ne remonte, voir
> « Plan B » plus bas.

1. Sur Facebook (connecté), aller dans **Événements**.
2. Section **Calendriers de mes événements** / **Ajouter au calendrier** →
   **Exporter** / clic droit sur « Ajouter au calendrier » → **Copier le lien**.
3. L'URL ressemble à :
   `https://www.facebook.com/events/ical/upcoming/?uid=XXXX&key=YYYY`
   (c'est une URL **secrète** : ne pas la committer dans le repo).

### Tester l'URL en local

```bash
FB_ICAL_URL="https://www.facebook.com/events/ical/upcoming/?uid=...&key=..." \
  pnpm fetch:events
# Vérifier que les bons événements apparaissent dans src/data/events.json
```

On peut aussi tester avec un fichier `.ics` local :

```bash
FB_ICAL_URL="scripts/__fixtures__/facebook-sample.ics" pnpm fetch:events
```

## Phase 3 — Mise en place sur Netlify

1. **Variable d'env** : Site settings → Environment →
   `FB_ICAL_URL = <l'URL secrète>`.
2. **Build hook** : Site settings → Build & deploy → Build hooks →
   « Add build hook » (ex. nom « refresh-agenda »). Copier l'URL générée.
3. **Variable d'env** : `NETLIFY_BUILD_HOOK = <URL du build hook>`.
4. La scheduled function `netlify/functions/refresh-agenda.mjs` s'exécute tous
   les jours à 06:00 UTC et POST sur le build hook → rebuild → agenda à jour.
   (Modifier `config.schedule` dans la fonction pour changer la fréquence.)

Chaque déploiement (manuel ou via la fonction) relance `prebuild` qui re-fetch
le flux. Si `FB_ICAL_URL` est absent ou le flux injoignable, le build **ne
plante pas** : l'agenda retombe sur `events-manual.json`.

## Plan B (si le flux iCal Facebook ne contient pas les événements)

- **Google Agenda comme source** : créer un Google Agenda, y reporter les
  dates (ou y abonner le flux FB), puis pointer `FB_ICAL_URL` vers l'**iCal
  secret** du Google Agenda (Paramètres du calendrier → « Adresse secrète au
  format iCal »). Le format est identique : aucun code à changer.
- **Tout en manuel** : continuer à éditer `events-manual.json`.
