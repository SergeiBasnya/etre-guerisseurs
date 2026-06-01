#!/usr/bin/env node
/**
 * Récupère les événements de la Page Facebook au moment du build et écrit
 * src/data/events.json. Lancé automatiquement par `prebuild` (avant astro build),
 * et manuellement via `pnpm fetch:events`.
 *
 * Stratégie « sans casse » :
 *  - Si FB_PAGE_ID / FB_PAGE_ACCESS_TOKEN sont absents → on ne touche à rien,
 *    le site se construit avec l'agenda de secours (events.json existant).
 *  - Si l'appel API échoue → on log un avertissement et on conserve le fallback.
 *    Le build ne plante JAMAIS à cause de Facebook.
 *
 * ⚠️ L'edge /{page-id}/events de l'API Graph est restreint par Facebook depuis 2018.
 *    Il faut un Page Access Token avec les permissions validées. Le plugin
 *    WordPress actuel possède déjà ce token : le récupérer dans ses réglages.
 */

import { writeFile, readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, '..', 'src', 'data', 'events.json');

const PAGE_ID = process.env.FB_PAGE_ID;
const TOKEN = process.env.FB_PAGE_ACCESS_TOKEN;
const API_VERSION = 'v21.0';

const MONTHS_FR = [
  'Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin',
  'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc',
];

function warn(msg) {
  console.warn(`\x1b[33m[agenda]\x1b[0m ${msg}`);
}
function info(msg) {
  console.log(`\x1b[36m[agenda]\x1b[0m ${msg}`);
}

/** Transforme un event Graph API vers notre format interne. */
function mapEvent(ev) {
  const start = ev.start_time ? new Date(ev.start_time) : null;
  const place = ev.place?.name
    ? [ev.place.name, ev.place.location?.city].filter(Boolean).join(', ')
    : 'Lieu à préciser';

  return {
    id: ev.id,
    day: start ? String(start.getUTCDate()).padStart(2, '0') : '—',
    month: start ? MONTHS_FR[start.getUTCMonth()] : '',
    title: ev.name ?? 'Événement',
    location: place,
    price: 'Sur inscription',
    free: false,
    url: `https://www.facebook.com/events/${ev.id}`,
  };
}

async function main() {
  if (!PAGE_ID || !TOKEN) {
    info('FB_PAGE_ID / FB_PAGE_ACCESS_TOKEN absents — agenda de secours conservé.');
    return;
  }

  const fields = 'id,name,start_time,end_time,place,is_canceled';
  const url =
    `https://graph.facebook.com/${API_VERSION}/${PAGE_ID}/events` +
    `?fields=${fields}&time_filter=upcoming&access_token=${TOKEN}`;

  try {
    const res = await fetch(url);
    const json = await res.json();

    if (!res.ok || json.error) {
      warn(`API Facebook : ${json.error?.message ?? res.status}. Fallback conservé.`);
      return;
    }

    const events = (json.data ?? [])
      .filter((ev) => !ev.is_canceled)
      .map(mapEvent);

    if (events.length === 0) {
      warn('Aucun événement à venir renvoyé par Facebook. Fallback conservé.');
      return;
    }

    // Date du build injectée par l'environnement (évite Date.now non déterministe en CI si besoin)
    const updatedAt = new Date().toISOString();
    const payload = { source: 'facebook', updatedAt, events };
    await writeFile(OUT, JSON.stringify(payload, null, 2) + '\n', 'utf8');
    info(`${events.length} événement(s) récupéré(s) depuis Facebook.`);
  } catch (err) {
    warn(`Échec de la récupération : ${err.message}. Fallback conservé.`);
    // On s'assure que le fichier existe quand même
    try {
      await readFile(OUT);
    } catch {
      warn('events.json introuvable — vérifier src/data/events.json.');
    }
  }
}

main();
