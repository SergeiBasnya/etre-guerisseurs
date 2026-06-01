/**
 * Configuration globale + architecture d'information.
 * Point unique de vérité : coordonnées, navigation, routes, footer, SEO.
 * Modifier ici se répercute partout (header, footer, fil d'Ariane).
 *
 * Arborescence validée (audit plume, refonte multi-pages) :
 *   Accueil
 *   Soins & accompagnement ▾  → Soins énergétiques · Accompagnement & coaching
 *   Stages & formations ▾     → Stages & retraites · Formations à distance
 *   La voie toltèque ▾        → Accords toltèques · Cercles de pardon
 *   Agenda · Blog · Le praticien · Contact (CTA)
 *   Transverses : Nyons/Avignon/Nîmes, Tarifs, Témoignages, FAQ, Légal
 */

export const SITE = {
  name: 'Être Guérisseurs',
  nameParts: { lead: 'Être', mark: 'Guérisseurs' },
  baseline:
    "Cabinet de soin et d'accompagnement, animation de stages et d'ateliers de formation dans la voie toltèque.",
  intervenant: 'Pierre-Alexandre Morales',
  url: 'https://etreguerisseurs.com',
  lang: 'fr',
} as const;

export const CONTACT = {
  phone: '06 60 808 474',
  phoneHref: 'tel:+33660808474',
  email: 'contact@etreguerisseurs.com',
  address: {
    street: '7 Avenue de Verdun',
    zip: '26110',
    city: 'Nyons',
    country: 'France',
  },
  consultations: ['Nîmes', 'Avignon'],
} as const;

export const SOCIALS = {
  instagram: '#',
  facebook: '#',
} as const;

/* ------------------------------------------------------------------ */
/* Routes — toutes les URLs du site en un seul endroit.                */
/* ------------------------------------------------------------------ */

export const ROUTES = {
  home: '/',

  soins: '/soins-accompagnement/',
  soinsEnergetiques: '/soins-accompagnement/soins-energetiques/',
  magnetisme: '/soins-accompagnement/soins-energetiques/magnetisme/',
  coaching: '/soins-accompagnement/accompagnement-coaching/',

  stagesFormations: '/stages-formations/',
  stagesRetraites: '/stages-formations/stages-retraites/',
  formationsDistance: '/stages-formations/formations-a-distance/',

  voie: '/voie-tolteque/',
  accords: '/voie-tolteque/accords-tolteques/',
  cercles: '/voie-tolteque/cercles-de-pardon/',

  praticien: '/praticien/',
  blog: '/blog/',
  agenda: '/agenda/',
  contact: '/contact/',

  nyons: '/nyons/',
  avignon: '/avignon/',
  nimes: '/nimes/',

  tarifs: '/tarifs/',
  temoignages: '/temoignages/',
  faq: '/faq/',

  mentions: '/mentions-legales/',
  confidentialite: '/politique-confidentialite/',
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
    label: 'Soins & accompagnement',
    href: ROUTES.soins,
    children: [
      { label: 'Soins énergétiques', href: ROUTES.soinsEnergetiques },
      { label: 'Accompagnement & coaching', href: ROUTES.coaching },
    ],
  },
  {
    label: 'Stages & formations',
    href: ROUTES.stagesFormations,
    children: [
      { label: 'Stages & retraites', href: ROUTES.stagesRetraites },
      { label: 'Formations à distance', href: ROUTES.formationsDistance },
    ],
  },
  {
    label: 'La voie toltèque',
    href: ROUTES.voie,
    children: [
      { label: 'Accords toltèques', href: ROUTES.accords },
      { label: 'Cercles de pardon', href: ROUTES.cercles },
    ],
  },
  { label: 'Agenda', href: ROUTES.agenda },
  { label: 'Blog', href: ROUTES.blog },
  { label: 'Le praticien', href: ROUTES.praticien },
  { label: 'Contact', href: ROUTES.contact, cta: true },
];

/* ------------------------------------------------------------------ */
/* Footer — 4 colonnes (structure plume).                              */
/* ------------------------------------------------------------------ */

export const FOOTER_LINKS = [
  {
    title: 'Soins & accompagnement',
    links: [
      { label: 'Soins énergétiques', href: ROUTES.soinsEnergetiques },
      { label: 'Magnétisme', href: ROUTES.magnetisme },
      { label: 'Accompagnement & coaching', href: ROUTES.coaching },
    ],
  },
  {
    title: 'Stages & formations',
    links: [
      { label: 'Stages & retraites', href: ROUTES.stagesRetraites },
      { label: 'Formations à distance', href: ROUTES.formationsDistance },
      { label: 'Agenda', href: ROUTES.agenda },
    ],
  },
  {
    title: 'Le cabinet',
    links: [
      { label: 'Le praticien', href: ROUTES.praticien },
      { label: 'Cabinet de Nyons', href: ROUTES.nyons },
      { label: 'Consultations Avignon', href: ROUTES.avignon },
      { label: 'Consultations Nîmes', href: ROUTES.nimes },
      { label: 'Tarifs', href: ROUTES.tarifs },
      { label: 'Contact', href: ROUTES.contact },
    ],
  },
  {
    title: 'Ressources & infos',
    links: [
      { label: 'La voie toltèque', href: ROUTES.voie },
      { label: 'Blog', href: ROUTES.blog },
      { label: 'Témoignages', href: ROUTES.temoignages },
      { label: 'FAQ', href: ROUTES.faq },
      { label: 'Mentions légales', href: ROUTES.mentions },
      { label: 'Politique de confidentialité', href: ROUTES.confidentialite },
    ],
  },
] as const;
