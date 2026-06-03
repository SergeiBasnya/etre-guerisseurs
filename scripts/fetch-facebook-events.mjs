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
  const fbId = ve.uid ? ve.uid.split('@')[0] : null;
  const url =
    ve.url ||
    (fbId && /^\d+$/.test(fbId)
      ? `https://www.facebook.com/events/${fbId}`
      : '#contact');

  return {
    _date: date, // interne, retiré avant écriture
    id: fbId ? `fb-${fbId}` : `fb-${dedupKey({ month: '', day: '', title: ve.summary })}`,
    day: date ? String(date.d).padStart(2, '0') : '—',
    month: date ? MONTHS_FR[date.m - 1] : '',
    title: ve.summary || 'Événement',
    location: ve.location || 'Lieu à préciser',
    price: 'Sur inscription',
    free: false,
    url,
  };
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

    const today = todayKey();
    const events = parseICS(ics)
      .filter((ve) => ve.status !== 'CANCELLED')
      .map(mapVevent)
      // ne garder que les événements à venir (ou sans date lisible)
      .filter((ev) => !ev._date || ev._date.key >= today);

    info(`${events.length} événement(s) à venir récupéré(s) depuis le flux iCal.`);
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

function sortKey(ev) {
  if (ev._date) return ev._date.key;
  const mi = monthIndex(ev.month);
  if (mi === undefined) return Number.MAX_SAFE_INTEGER; // sans date → en fin
  // année inconnue pour les manuels : on suppose l'année courante du build
  return new Date().getFullYear() * 10000 + (mi + 1) * 100 + Number(ev.day || 99);
}

async function main() {
  const manual = await loadManual();
  const facebook = await fetchFacebookEvents();

  // Fusion par champ : le manuel porte l'affichage curé (titre, prix, lieu),
  // mais on injecte l'URL Facebook d'inscription quand l'événement y existe.
  // Les événements présents seulement sur Facebook sont ajoutés tels quels.
  const byKey = new Map();
  const merged = [];
  for (const ev of manual) {
    const key = dedupKey(ev);
    if (byKey.has(key)) continue;
    byKey.set(key, ev);
    merged.push(ev);
  }
  for (const ev of facebook) {
    const key = dedupKey(ev);
    const existing = byKey.get(key);
    if (existing) {
      // Même événement : on récupère le lien d'inscription Facebook si le
      // manuel n'en a pas de vrai (placeholder #contact).
      if (ev.url && ev.url.includes('facebook.com') && (!existing.url || existing.url === '#contact')) {
        existing.url = ev.url;
      }
      continue;
    }
    byKey.set(key, ev);
    merged.push(ev);
  }

  merged.sort((a, b) => sortKey(a) - sortKey(b));

  // Nettoyage des champs internes avant écriture.
  const events = merged.map(({ _date, ...rest }) => rest);

  const source =
    facebook.length > 0 ? (manual.length > 0 ? 'merged' : 'facebook') : 'manual';
  // Horodatage seulement quand une vraie synchro externe a eu lieu : évite le
  // bruit git d'un timestamp qui change à chaque build manuel/local.
  const updatedAt = facebook.length > 0 ? new Date().toISOString() : null;

  await writeFile(OUT, JSON.stringify({ source, updatedAt, events }, null, 2) + '\n', 'utf8');
  info(`events.json écrit — source: ${source}, ${events.length} événement(s).`);
}

main();
