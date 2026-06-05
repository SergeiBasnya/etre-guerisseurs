#!/usr/bin/env node
/**
 * Construit src/data/events.json pour l'agenda du site.
 *
 * Source des dates :
 *  1. events-manual.json — événements curés à la main (toujours présents).
 *  2. Flux iCal Facebook (variable d'env FB_ICAL_URL) — l'URL secrète
 *     « /events/ical/upcoming/?uid=…&key=… » du compte, récupérée une fois
 *     par le client depuis Facebook (Événements → Ajouter au calendrier).
 *     On peut aussi pointer un iCal Google Agenda : le format est le même.
 *
 * Stratégie « sans casse » :
 *  - FB_ICAL_URL absente → events.json = uniquement les événements manuels.
 *  - Flux injoignable / illisible → on log un avertissement et on garde le
 *    manuel. Le build ne plante JAMAIS à cause de la source externe.
 *
 * Lancé par `prebuild` (avant astro build) et manuellement via `pnpm fetch:events`.
 */

import { writeFile, readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { parseICS, parseIcalDate } from './lib/ical.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA = join(__dirname, '..', 'src', 'data');
const MANUAL = join(DATA, 'events-manual.json');
const OUT = join(DATA, 'events.json');

const ICAL_URL = process.env.FB_ICAL_URL;

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

/** Date du jour (AAAAMMJJ) en heure locale du build, pour filtrer le passé. */
function todayKey() {
  const n = new Date();
  return n.getFullYear() * 10000 + (n.getMonth() + 1) * 100 + n.getDate();
}

/** Clé de déduplication : mois (index canonique) + jour + titre normalisé. */
function dedupKey(ev) {
  const title = (ev.title || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
  const mi = monthIndex(ev.month);
  const month = mi === undefined ? (ev.month || '') : mi;
  const day = Number(ev.day) || ev.day || '';
  return `${month}-${day}-${title}`;
}

/** Transforme un VEVENT iCal vers notre format interne d'agenda. */
function mapVevent(ve) {
  const date = ve.dtstart ? parseIcalDate(ve.dtstart) : null;
  const endDate = ve.dtend ? parseIcalDate(ve.dtend) : null;
  // Identifiant de l'événement « parent » : pris dans l'URL (stable, partagé par
  // TOUTES les occurrences d'une série récurrente). L'UID iCal, lui, est propre à
  // chaque occurrence (e<event_time_id>@facebook.com) → inutilisable pour replier
  // une série ou l'apparier avec le manuel.
  const fbId =
    fbIdFromUrl(ve.url) ||
    (ve.uid && /^\d+$/.test(ve.uid.replace(/^e/i, '').split('@')[0])
      ? ve.uid.replace(/^e/i, '').split('@')[0]
      : null);
  // URL d'inscription « propre » (sans ?event_time_id), identique pour toutes les
  // occurrences → c'est le bon lien à injecter dans la fiche curée.
  const url = fbId ? `https://www.facebook.com/events/${fbId}` : ve.url || '#contact';

  // Description : on garde un extrait court (les descriptions FB sont longues).
  const desc = ve.description
    ? ve.description.replace(/\s+/g, ' ').trim().slice(0, 180).replace(/\s\S*$/, '') +
      (ve.description.length > 180 ? '…' : '')
    : undefined;

  return {
    _date: date, // interne, retiré avant écriture
    _endDate: endDate, // interne, pour le filtrage « passé »
    _fbId: fbId, // interne, pour l'appariement avec le manuel
    id: fbId ? `fb-${fbId}` : `fb-${dedupKey({ month: '', day: '', title: ve.summary })}`,
    day: date ? String(date.d).padStart(2, '0') : '—',
    month: date ? MONTHS_FR[date.m - 1] : '',
    year: date ? String(date.y) : undefined,
    title: ve.summary || 'Événement',
    description: desc,
    location: ve.location || undefined,
    price: 'Sur inscription',
    free: false,
    url,
  };
}

/** Extrait l'identifiant numérique d'un événement depuis une URL Facebook. */
function fbIdFromUrl(url) {
  const m = /facebook\.com\/events\/(\d+)/.exec(url || '');
  return m ? m[1] : null;
}

async function loadManual() {
  try {
    const json = JSON.parse(await readFile(MANUAL, 'utf8'));
    return Array.isArray(json.events) ? json.events : [];
  } catch (err) {
    warn(`events-manual.json illisible (${err.message}). Liste manuelle vide.`);
    return [];
  }
}

async function fetchFacebookEvents() {
  if (!ICAL_URL) {
    info('FB_ICAL_URL absente — agenda construit depuis les événements manuels uniquement.');
    return [];
  }

  try {
    let ics;
    if (/^https?:\/\//i.test(ICAL_URL)) {
      const res = await fetch(ICAL_URL, {
        headers: { 'User-Agent': 'EtreGuerisseurs-Agenda/1.0' },
        redirect: 'follow',
      });
      if (!res.ok) {
        warn(`Flux iCal : HTTP ${res.status}. Fallback manuel conservé.`);
        return [];
      }
      ics = await res.text();
    } else {
      // Chemin local (test, ou .ics exporté à la main et déposé dans le repo).
      const path = ICAL_URL.startsWith('/') ? ICAL_URL : join(__dirname, '..', ICAL_URL);
      ics = await readFile(path, 'utf8');
    }
    if (!ics.includes('BEGIN:VEVENT')) {
      warn('Flux iCal sans VEVENT (URL invalide ou aucun événement). Fallback manuel conservé.');
      return [];
    }

    // Le filtrage des événements passés est centralisé dans main() (manuel + FB).
    const events = parseICS(ics)
      .filter((ve) => ve.status !== 'CANCELLED')
      .map(mapVevent);

    info(`${events.length} événement(s) récupéré(s) depuis le flux iCal.`);
    return events;
  } catch (err) {
    warn(`Échec de récupération du flux iCal : ${err.message}. Fallback manuel conservé.`);
    return [];
  }
}

/** Ordre des mois pour le tri chronologique (tolérant aux variantes FR). */
const MONTH_ALIASES = [
  ['jan', 'janv', 'janvier'],
  ['fev', 'fév', 'fevr', 'févr', 'fevrier', 'février'],
  ['mar', 'mars'],
  ['avr', 'avril'],
  ['mai'],
  ['juin'],
  ['juil', 'juill', 'juillet'],
  ['aou', 'aoû', 'aout', 'août'],
  ['sep', 'sept', 'septembre'],
  ['oct', 'octobre'],
  ['nov', 'novembre'],
  ['dec', 'déc', 'decembre', 'décembre'],
];
const MONTH_INDEX = {};
MONTH_ALIASES.forEach((names, i) => names.forEach((n) => (MONTH_INDEX[n] = i)));

function monthIndex(label) {
  if (!label) return undefined;
  return MONTH_INDEX[label.toLowerCase().replace(/\.$/, '').trim()];
}

/**
 * Clé de date AAAAMMJJ d'un événement (FB via _date, manuel via year/month/day).
 * Renvoie null si la date n'est pas déterminable.
 */
function eventDateKey(ev) {
  if (ev._date) return ev._date.key;
  const mi = monthIndex(ev.month);
  if (mi === undefined) return null;
  const year = Number(ev.year) || new Date().getFullYear();
  return year * 10000 + (mi + 1) * 100 + (Number(ev.day) || 1);
}

/**
 * Clé de date de FIN (pour ne retirer un événement qu'une fois RÉELLEMENT passé).
 * FB : DTEND. Manuel : champs optionnels endDay/endMonth. Sinon → date de début.
 */
function eventEndKey(ev) {
  if (ev._endDate) return ev._endDate.key;
  if (ev.endDay) {
    const mi = monthIndex(ev.endMonth ?? ev.month);
    if (mi !== undefined) {
      const year = Number(ev.year) || new Date().getFullYear();
      return year * 10000 + (mi + 1) * 100 + Number(ev.endDay);
    }
  }
  return eventDateKey(ev);
}

const FR_MONTHS_FULL = [
  'janvier', 'février', 'mars', 'avril', 'mai', 'juin',
  'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre',
];
const FR_WEEKDAYS = [
  'dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi',
];

/**
 * Replie une série récurrente (même id FB parent éclaté en N occurrences) en UNE
 * seule entrée = la prochaine occurrence à venir (ou, à défaut, la plus proche).
 * Les événements à occurrence unique passent inchangés.
 */
function collapseByParent(list, today) {
  const groups = new Map();
  list.forEach((ev, i) => {
    const key = ev._fbId || `__solo_${i}`;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(ev);
  });
  const reps = [];
  for (const occ of groups.values()) {
    if (occ.length === 1) {
      reps.push(occ[0]);
      continue;
    }
    occ.sort(
      (a, b) =>
        (eventDateKey(a) ?? Number.MAX_SAFE_INTEGER) -
        (eventDateKey(b) ?? Number.MAX_SAFE_INTEGER),
    );
    const next = occ.find((e) => (eventEndKey(e) ?? Number.MAX_SAFE_INTEGER) >= today);
    reps.push(next || occ[0]);
  }
  return reps;
}

/**
 * Reporte la date d'une occurrence Facebook sur une fiche manuelle `autoDate`
 * (cours récurrent affiché « prochaine date seulement »). Met à jour le badge
 * (day/month/year), la clé de tri interne et un libellé `dateRange` lisible.
 */
function applyAutoDate(manual, fbRep) {
  const d = fbRep._date;
  if (!d) return;
  manual._date = d;
  manual.day = String(d.d).padStart(2, '0');
  manual.month = MONTHS_FR[d.m - 1];
  manual.year = String(d.y);
  const wd = FR_WEEKDAYS[new Date(Date.UTC(d.y, d.m - 1, d.d, 12)).getUTCDay()];
  let range = `${wd[0].toUpperCase()}${wd.slice(1)} ${d.d} ${FR_MONTHS_FULL[d.m - 1]} ${d.y}`;
  if (manual.timeLabel) range += `, ${manual.timeLabel}`;
  manual.dateRange = range;
}

async function main() {
  const manual = await loadManual();
  const today = todayKey();
  const facebookAll = await fetchFacebookEvents();
  const facebook = collapseByParent(facebookAll, today);
  const collapsed = facebookAll.length - facebook.length;
  if (collapsed > 0) info(`${collapsed} occurrence(s) récurrente(s) repliée(s) (séries → prochaine date).`);

  // Fusion par champ : le manuel porte l'affichage curé (titre, prix, lieu),
  // mais on injecte l'URL Facebook d'inscription quand l'événement y existe.
  // Les événements présents seulement sur Facebook sont ajoutés tels quels.
  const byKey = new Map();
  const byFbId = new Map();
  const merged = [];
  for (const ev of manual) {
    const key = dedupKey(ev);
    if (byKey.has(key)) continue;
    byKey.set(key, ev);
    // Index par identifiant Facebook explicite : champ `fbId` (numérique, ou
    // tableau si la fiche couvre plusieurs séries) ou `fbUrl` facebook.com/events/<id>.
    // Appariement fiable, à privilégier sur le titre+date (qui casse si le titre
    // curé diffère du SUMMARY FB).
    const fids = Array.isArray(ev.fbId)
      ? ev.fbId.map(String)
      : ev.fbId
        ? [String(ev.fbId)]
        : fbIdFromUrl(ev.fbUrl)
          ? [fbIdFromUrl(ev.fbUrl)]
          : [];
    for (const f of fids) byFbId.set(f, ev);
    merged.push(ev);
  }
  for (const ev of facebook) {
    // Appariement prioritaire par identifiant FB, repli sur titre+date.
    const existing = (ev._fbId && byFbId.get(ev._fbId)) || byKey.get(dedupKey(ev));
    if (existing) {
      // Même événement : on récupère le lien d'inscription Facebook si le
      // manuel n'en a pas de vrai (placeholder #contact).
      if (ev.url && ev.url.includes('facebook.com') && (!existing.url || existing.url === '#contact')) {
        existing.url = ev.url;
      }
      // Fiche curée « prochaine date » : elle adopte la date de l'occurrence FB.
      if (existing.autoDate) applyAutoDate(existing, ev);
      continue;
    }
    byKey.set(dedupKey(ev), ev);
    if (ev._fbId) byFbId.set(ev._fbId, ev);
    merged.push(ev);
  }

  // Filtre des événements passés (manuel + FB) : on ne garde que ceux dont la
  // date est aujourd'hui ou à venir. Les événements sans date déterminable sont
  // conservés (à corriger à la main). Tri chronologique ensuite.
  const upcoming = merged.filter((ev) => {
    const key = eventEndKey(ev); // date de FIN : un événement en cours reste affiché
    return key === null || key >= today;
  });
  const dropped = merged.length - upcoming.length;
  if (dropped > 0) info(`${dropped} événement(s) passé(s) retiré(s).`);

  // Règle d'affichage (demande client) : on ne montre QUE les événements
  // confirmés sur Facebook (lien d'inscription FB injecté). Les fiches manuelles
  // sans pendant FB restent dans events-manual.json — éditables — mais sont
  // masquées en attendant d'être créées sur Facebook ; elles réapparaîtront
  // seules une fois leur `fbId` renseigné. Garde-fous : on n'applique ce filtre
  // QUE si le flux a réellement été lu (sinon fallback manuel → jamais d'agenda
  // vide) ; `"showWithoutFb": true` force l'affichage d'une fiche donnée.
  let visible = upcoming;
  if (facebook.length > 0) {
    visible = upcoming.filter(
      (ev) => (ev.url || '').includes('facebook.com') || ev.showWithoutFb === true,
    );
    const hidden = upcoming.length - visible.length;
    if (hidden > 0) {
      info(`${hidden} événement(s) sans pendant Facebook masqué(s) (en attente de création sur FB).`);
    }
  }

  // Tri chronologique par date de début.
  visible.sort((a, b) => {
    const ka = eventDateKey(a) ?? Number.MAX_SAFE_INTEGER;
    const kb = eventDateKey(b) ?? Number.MAX_SAFE_INTEGER;
    return ka - kb;
  });

  // Nettoyage des champs internes avant écriture.
  const events = visible.map(
    ({ _date, _endDate, _fbId, autoDate, timeLabel, fbId, showWithoutFb, ...rest }) => rest,
  );

  const source =
    facebook.length > 0 ? (manual.length > 0 ? 'merged' : 'facebook') : 'manual';
  // Horodatage seulement quand une vraie synchro externe a eu lieu : évite le
  // bruit git d'un timestamp qui change à chaque build manuel/local.
  const updatedAt = facebook.length > 0 ? new Date().toISOString() : null;

  await writeFile(OUT, JSON.stringify({ source, updatedAt, events }, null, 2) + '\n', 'utf8');
  info(`events.json écrit — source: ${source}, ${events.length} événement(s).`);
}

main();
