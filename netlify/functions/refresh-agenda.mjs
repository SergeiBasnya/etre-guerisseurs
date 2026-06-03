/**
 * Scheduled Function Netlify — rafraîchit l'agenda.
 *
 * Le site est statique : pour réafficher les nouveaux événements Facebook,
 * il faut le reconstruire. Cette fonction tourne sur planning (voir `config`)
 * et déclenche un rebuild en appelant un Build Hook Netlify. Au build, le hook
 * `prebuild` relance scripts/fetch-facebook-events.mjs qui re-fetch le flux
 * iCal et régénère src/data/events.json.
 *
 * Variables d'environnement requises (Netlify → Site settings → Environment) :
 *   - NETLIFY_BUILD_HOOK : URL du build hook (Site settings → Build & deploy →
 *     Build hooks → « Add build hook »).
 *   - FB_ICAL_URL : utilisée au build par le script de fetch (pas ici).
 *
 * Fonction v2 (ESM, aucune dépendance). Le planning est déclaré via `config`.
 */

export default async () => {
  const hook = process.env.NETLIFY_BUILD_HOOK;
  if (!hook) {
    console.warn('[refresh-agenda] NETLIFY_BUILD_HOOK absent — aucun rebuild déclenché.');
    return new Response('NETLIFY_BUILD_HOOK manquant', { status: 200 });
  }

  try {
    const res = await fetch(hook, { method: 'POST' });
    if (!res.ok) {
      console.error(`[refresh-agenda] Build hook a répondu ${res.status}.`);
      return new Response(`Build hook: ${res.status}`, { status: 200 });
    }
    console.log('[refresh-agenda] Rebuild déclenché avec succès.');
    return new Response('Rebuild déclenché', { status: 200 });
  } catch (err) {
    console.error(`[refresh-agenda] Échec : ${err.message}`);
    return new Response('Échec du déclenchement', { status: 200 });
  }
};

// Planning : tous les jours à 06:00 UTC (08:00 heure de Paris en été).
// Syntaxe cron standard ou raccourcis « @daily »/« @hourly ».
export const config = {
  schedule: '0 6 * * *',
};
