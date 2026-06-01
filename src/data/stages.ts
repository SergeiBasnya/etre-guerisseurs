/**
 * Stages & rendez-vous mis en avant (section "Nos prochains rendez-vous").
 * Éditable à la main. Les images peuvent être des URLs ou, à terme,
 * des fichiers dans src/assets/ pour l'optimisation Astro.
 */
import { ROUTES } from '../consts';

export interface Stage {
  tag: string; // badge (ex : "Stage d'été")
  meta: string; // lieu · durée
  title: string;
  price: string;
  image: string;
  imageAlt: string;
  href?: string;
}

export const STAGES: Stage[] = [
  {
    tag: "Stage d'été",
    meta: 'Provence · 3 jours',
    title: "Stage AIMER — l'été sur l'Amour",
    price: 'À partir de 350€',
    image:
      'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?q=80&w=1200&auto=format&fit=crop',
    imageAlt: 'Stage Aimer en Provence',
    href: ROUTES.stagesRetraites,
  },
  {
    tag: 'Cycle saisons',
    meta: 'Nyons · au rythme des saisons',
    title: 'Maîtriser les Accords Toltèques',
    price: 'À partir de 55€',
    image:
      'https://images.unsplash.com/photo-1502082553048-f009c37129b9?q=80&w=1200&auto=format&fit=crop',
    imageAlt: 'Atelier accords toltèques',
    href: ROUTES.stagesRetraites,
  },
  {
    tag: 'Retraite',
    meta: 'Costa Rica · mer & jungle',
    title: 'Retraite spirituelle entre mer et océan',
    price: 'Sur inscription',
    image:
      'https://images.unsplash.com/photo-1510797215324-95aa89f43c33?q=80&w=1200&auto=format&fit=crop',
    imageAlt: 'Retraite spirituelle au Costa Rica',
    href: ROUTES.stagesRetraites,
  },
];
