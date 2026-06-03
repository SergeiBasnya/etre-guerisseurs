/**
 * Configuration globale + architecture d'information.
 * Point unique de vérité : coordonnées, navigation, routes, footer, SEO.
 *
 * Arborescence (contre-proposition pro, à partir du contenu client) :
 *   Accueil
 *   Enseignement ▾        → Cours · Stages · Formations · Retraites (sections ancrées)
 *   Accompagnement ▾      → Coaching d'Être · Écoute · Pardon · Marches
 *   Soins & thérapies ▾   → Magnétisme · Soins énergétiques
 *   Agenda · Le praticien · Blog · Contact (CTA)
 *   Transverses : Témoignages, Mentions légales, Confidentialité
 *
 * Le SEO thématique toltèque (accords, cercles de pardon, médecine toltèque)
 * vit dans le BLOG sous forme d'articles piliers. Le SEO local est porté par
 * la page Contact + schema LocalBusiness (areaServed), pas par des pages-villes.
 */

export const SITE = {
  name: 'Être Guérisseurs',
  nameParts: { lead: 'Être', mark: 'Guérisseurs' },
  // Slogan / titre général voulu par le client
  tagline:
    'Être guérisseurs et artistes (créateurs) de sa vie, pour servir la création.',
  subtitle: 'La voie du cœur',
  // Triptyque de positionnement (tags accueil)
  pillars: ['Enseignement', 'Accompagnement', 'Thérapies'],
  baseline:
    "Cabinet de soin et d'accompagnement, animation de stages et d'ateliers de formation dans la voie toltèque.",
  intervenant: 'Pierre-Alexandre Morales',
  // Signature de marque (positionnement) + slogan — affichés header/pied de page.
  signature: "& artistes de l'esprit, au service de la création",
  slogan: "Faire de sa vie une œuvre d'art.",
  url: 'https://etreguerisseurs.com',
  lang: 'fr',
} as const;

export const CONTACT = {
  phone: '06 60 808 474',
  phoneHref: 'tel:+33660808474',
  email: 'contact@etreguerisseurs.com',
  // Nouvelle adresse (changement confirmé)
  address: {
    street: "3 avenue de l'ancienne gare",
    zip: '26170',
    city: 'Mollans-sur-Ouvèze',
    country: 'France',
  },
  // Lieux de consultation / d'intervention (pour le texte + schema areaServed)
  areaServed: ['Nyons', 'Avignon', 'Drôme', 'Vaucluse', 'Provence'],
  // Consultations à distance
  remote: 'France entière et pays francophones, en visio ou par téléphone',
} as const;

export const SOCIALS = {
  // Mettre l'URL réelle pour activer le lien ; '#' = masqué (voir TopBar).
  instagram: '#',
  facebook: 'https://www.facebook.com/PIERREALEXANDRE.MORALES',
} as const;

/* ------------------------------------------------------------------ */
/* Routes — toutes les URLs du site en un seul endroit.                */
/* ------------------------------------------------------------------ */

// Base du site (« / » en local/prod racine, « /etre-guerisseurs » sur GitHub Pages).
const B = import.meta.env.BASE_URL.replace(/\/$/, '');

/** Lien vers un fichier de public/ en tenant compte de la base. */
export const asset = (p: string): string => `${B}/${p.replace(/^\/+/, '')}`;

export const ROUTES = {
  home: `${B}/`,

  enseignement: `${B}/enseignement/`,
  accompagnement: `${B}/accompagnement/`,
  soins: `${B}/soins-therapies/`,

  cerclePardon: `${B}/accompagnement/cercle-de-pardon/`,

  praticien: `${B}/praticien/`,
  agenda: `${B}/agenda/`,
  blog: `${B}/blog/`,
  temoignages: `${B}/temoignages/`,
  contact: `${B}/contact/`,

  mentions: `${B}/mentions-legales/`,
  confidentialite: `${B}/politique-confidentialite/`,
} as const;

/* Ancres des sous-sections (deep-linking + menus déroulants). */
export const ANCHORS = {
  cours: `${ROUTES.enseignement}#cours`,
  stages: `${ROUTES.enseignement}#stages`,
  formations: `${ROUTES.enseignement}#formations`,
  retraites: `${ROUTES.enseignement}#retraites`,

  coaching: `${ROUTES.accompagnement}#coaching`,
  ecoute: `${ROUTES.accompagnement}#ecoute`,
  pardon: `${ROUTES.accompagnement}#pardon`,
  marches: `${ROUTES.accompagnement}#marches`,

  magnetisme: `${ROUTES.soins}#magnetisme`,
  soinsEnergetiques: `${ROUTES.soins}#soins-energetiques`,
} as const;

/* ------------------------------------------------------------------ */
/* Navigation principale (header) avec sous-menus.                     */
/* ------------------------------------------------------------------ */

export interface NavChild {
  label: string;
  href: string;
}
export interface NavItem {
  label: string;
  href: string;
  children?: NavChild[];
  cta?: boolean;
}

export const NAV: NavItem[] = [
  {
    label: 'Enseignement',
    href: ROUTES.enseignement,
    children: [
      { label: 'Cours', href: ANCHORS.cours },
      { label: 'Stages', href: ANCHORS.stages },
      { label: 'Formations', href: ANCHORS.formations },
      { label: 'Retraites spirituelles', href: ANCHORS.retraites },
    ],
  },
  {
    label: 'Accompagnement',
    href: ROUTES.accompagnement,
    children: [
      { label: "Coaching d'Être", href: ANCHORS.coaching },
      { label: "Entretien d'écoute", href: ANCHORS.ecoute },
      { label: 'Protocole Pardon', href: ANCHORS.pardon },
      { label: 'Cercle de Pardon', href: ROUTES.cerclePardon },
      { label: 'Marches accompagnées', href: ANCHORS.marches },
    ],
  },
  {
    label: 'Soins & thérapies',
    href: ROUTES.soins,
    children: [
      { label: 'Magnétisme', href: ANCHORS.magnetisme },
      { label: 'Soins énergétiques', href: ANCHORS.soinsEnergetiques },
    ],
  },
  { label: 'Agenda', href: ROUTES.agenda },
  { label: 'Le praticien', href: ROUTES.praticien },
  { label: 'Blog', href: ROUTES.blog },
  { label: 'Contact', href: ROUTES.contact, cta: true },
];

/* ------------------------------------------------------------------ */
/* Footer — 4 colonnes.                                                */
/* ------------------------------------------------------------------ */

export const FOOTER_LINKS = [
  {
    title: 'Enseignement',
    links: [
      { label: 'Cours', href: ANCHORS.cours },
      { label: 'Stages', href: ANCHORS.stages },
      { label: 'Formations', href: ANCHORS.formations },
      { label: 'Retraites spirituelles', href: ANCHORS.retraites },
    ],
  },
  {
    title: 'Accompagnement',
    links: [
      { label: "Coaching d'Être", href: ANCHORS.coaching },
      { label: "Entretien d'écoute", href: ANCHORS.ecoute },
      { label: 'Protocole Pardon', href: ANCHORS.pardon },
      { label: 'Cercle de Pardon', href: ROUTES.cerclePardon },
      { label: 'Marches accompagnées', href: ANCHORS.marches },
    ],
  },
  {
    title: 'Soins & cabinet',
    links: [
      { label: 'Magnétisme', href: ANCHORS.magnetisme },
      { label: 'Soins énergétiques', href: ANCHORS.soinsEnergetiques },
      { label: 'Le praticien', href: ROUTES.praticien },
      { label: 'Agenda', href: ROUTES.agenda },
    ],
  },
  {
    title: 'Infos',
    links: [
      { label: 'Témoignages', href: ROUTES.temoignages },
      { label: 'Blog', href: ROUTES.blog },
      { label: 'Contact', href: ROUTES.contact },
      { label: 'Mentions légales', href: ROUTES.mentions },
      { label: 'Politique de confidentialité', href: ROUTES.confidentialite },
    ],
  },
] as const;
