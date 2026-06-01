/**
 * Disciplines / inspirations (section "Trouvez votre voie").
 */

export interface Discipline {
  kind: string; // petite étiquette (Soin, Sagesse, Énergie…)
  title: string;
  image: string;
  imageAlt: string;
  href?: string;
}

export const DISCIPLINES: Discipline[] = [
  {
    kind: 'Soin',
    title: 'Magnétisme',
    image:
      'https://images.unsplash.com/photo-1591343395082-e120087004b4?q=80&w=1000&auto=format&fit=crop',
    imageAlt: 'Magnétisme',
  },
  {
    kind: 'Sagesse',
    title: 'Médecine toltèque',
    image:
      'https://images.unsplash.com/photo-1528319725582-ddc096101511?q=80&w=1000&auto=format&fit=crop',
    imageAlt: 'Médecine toltèque',
  },
  {
    kind: 'Énergie',
    title: 'Soins énergétiques',
    image:
      'https://images.unsplash.com/photo-1518621736915-f3b1c41bfd00?q=80&w=1000&auto=format&fit=crop',
    imageAlt: 'Soins énergétiques',
  },
  {
    kind: 'Immersion',
    title: 'Marches toltèques',
    image:
      'https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=1000&auto=format&fit=crop',
    imageAlt: 'Marches dans la nature',
  },
  {
    kind: 'Rituel',
    title: 'Cercles de Pardon',
    image:
      'https://images.unsplash.com/photo-1602192509154-0b900ee1f851?q=80&w=1000&auto=format&fit=crop',
    imageAlt: 'Cercles de pardon',
  },
  {
    kind: 'Coaching',
    title: 'Accompagner le changement',
    image:
      'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?q=80&w=1000&auto=format&fit=crop',
    imageAlt: 'Accompagnement au changement',
  },
];
