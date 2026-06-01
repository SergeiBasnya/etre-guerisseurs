/**
 * Configuration globale du site.
 * Point unique de vérité : coordonnées, navigation, réseaux sociaux.
 * Modifier ici se répercute partout (header, footer, topbar, SEO).
 */

export const SITE = {
  name: 'Être Guérisseurs',
  // Le nom est affiché en deux parties (la 2e en accent doré)
  nameParts: { lead: 'Être', mark: 'Guérisseurs' },
  baseline:
    "Cabinet de soin et d'accompagnement, animation de stages et d'ateliers de formation dans la voie toltèque.",
  intervenant: 'Pierre-Alexandre Morales',
  url: 'https://etreguerisseurs.com',
  lang: 'fr',
} as const;

export const CONTACT = {
  phone: '06 60 808 474',
  // version sans espaces pour les liens tel:
  phoneHref: 'tel:+33660808474',
  email: 'contact@etreguerisseurs.com',
  address: {
    street: '7 Avenue de Verdun',
    zip: '26110',
    city: 'Nyons',
    country: 'France',
  },
  // Lieux de consultation hors cabinet
  consultations: ['Nîmes', 'Avignon'],
} as const;

export const SOCIALS = {
  instagram: '#',
  facebook: '#',
} as const;

/** Navigation principale (header). */
export const NAV = [
  { label: "L'approche", href: '#approche' },
  { label: 'Les stages', href: '#stages' },
  { label: 'Disciplines', href: '#disciplines' },
  { label: 'Agenda', href: '#agenda' },
  { label: 'Contact', href: '#contact', cta: true },
] as const;

/** Liens du footer, regroupés par colonne. */
export const FOOTER_LINKS = [
  {
    title: 'Découvrir',
    links: [
      { label: 'Les mains lumière', href: '#' },
      { label: 'Médecine toltèque', href: '#' },
      { label: 'Formations', href: '#' },
      { label: 'Accompagner le changement', href: '#' },
    ],
  },
  {
    title: 'Cabinet',
    links: [
      { label: "L'intervenant", href: '#approche' },
      { label: 'Agenda', href: '#agenda' },
      { label: 'Contact', href: '#contact' },
      { label: 'Consultations Nîmes & Avignon', href: '#contact' },
    ],
  },
] as const;
