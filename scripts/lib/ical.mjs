/**
 * Parseur iCalendar (.ics) minimal, sans dépendance.
 * Suffisant pour les flux d'événements Facebook / Google Agenda :
 * dépliage des lignes, extraction des VEVENT, déséchappement des valeurs,
 * et lecture des champs utiles (UID, SUMMARY, DTSTART/DTEND, LOCATION, URL,
 * DESCRIPTION, STATUS).
 *
 * On ne fait volontairement PAS de conversion de fuseau : pour l'affichage
 * (jour + mois), on lit les composantes de date telles qu'écrites dans la
 * valeur DTSTART (YYYYMMDD), ce qui correspond à la date « affichée » de
 * l'événement, sans dépendre d'une lib de timezone.
 */

/** Déplie les lignes repliées (RFC 5545 : une ligne de continuation commence par espace ou tab). */
function unfold(text) {
  return text.replace(/\r\n/g, '\n').replace(/\r/g, '\n').replace(/\n[ \t]/g, '');
}

/** Déséchappe une valeur de propriété iCal (\\, \, \; \n \N). */
function unescapeValue(v) {
  return v
    .replace(/\\n/gi, '\n')
    .replace(/\\,/g, ',')
    .replace(/\\;/g, ';')
    .replace(/\\\\/g, '\\');
}

/**
 * Découpe une ligne « NAME;PARAM=x;PARAM2=y:VALUE » en { name, params, value }.
 * Le premier deux-points NON échappé sépare l'en-tête de la valeur.
 */
function parseLine(line) {
  const colon = line.indexOf(':');
  if (colon === -1) return null;
  const head = line.slice(0, colon);
  const value = line.slice(colon + 1);
  const [name, ...paramParts] = head.split(';');
  const params = {};
  for (const p of paramParts) {
    const eq = p.indexOf('=');
    if (eq !== -1) params[p.slice(0, eq).toUpperCase()] = p.slice(eq + 1);
  }
  return { name: name.toUpperCase(), params, value };
}

/**
 * Extrait les composantes de date d'une valeur DTSTART/DTEND.
 * Accepte « 20260925 », « 20260925T160000 », « 20260925T160000Z ».
 * Renvoie { y, m, d, key } où key = AAAAMMJJ (entier comparable) ou null.
 */
export function parseIcalDate(value) {
  const m = /^(\d{4})(\d{2})(\d{2})/.exec(value.trim());
  if (!m) return null;
  const y = Number(m[1]);
  const mo = Number(m[2]);
  const d = Number(m[3]);
  return { y, m: mo, d, key: y * 10000 + mo * 100 + d };
}

/**
 * Parse un texte .ics et renvoie la liste des VEVENT bruts (champs utiles).
 * @param {string} ics
 * @returns {Array<{uid?:string,summary?:string,dtstart?:string,dtend?:string,location?:string,url?:string,description?:string,status?:string}>}
 */
export function parseICS(ics) {
  const lines = unfold(ics).split('\n');
  const events = [];
  let cur = null;

  for (const raw of lines) {
    if (!raw) continue;
    if (raw === 'BEGIN:VEVENT') {
      cur = {};
      continue;
    }
    if (raw === 'END:VEVENT') {
      if (cur) events.push(cur);
      cur = null;
      continue;
    }
    if (!cur) continue;

    const parsed = parseLine(raw);
    if (!parsed) continue;
    const { name, value } = parsed;

    switch (name) {
      case 'UID':
        cur.uid = value;
        break;
      case 'SUMMARY':
        cur.summary = unescapeValue(value);
        break;
      case 'DTSTART':
        cur.dtstart = value;
        break;
      case 'DTEND':
        cur.dtend = value;
        break;
      case 'LOCATION':
        cur.location = unescapeValue(value);
        break;
      case 'URL':
        cur.url = value;
        break;
      case 'DESCRIPTION':
        cur.description = unescapeValue(value);
        break;
      case 'STATUS':
        cur.status = value.toUpperCase();
        break;
      default:
        break;
    }
  }

  return events;
}
