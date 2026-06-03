/**
 * Catalogue des stages saisonniers (cycle annuel toltèque).
 * Quatre saisons, chacune portée par un thème, contenant un ou plusieurs
 * stages de trois jours en résidentiel. Source unique pour l'accordéon de la
 * page Enseignement (section « Stages »).
 *
 * Les dates ponctuelles (sessions à venir) vivent en plus dans l'agenda
 * (src/data/events.json) qui sert aussi au futur sync Facebook.
 */
import { ROUTES } from '../consts';

export interface SaisonStage {
  /** Slug pour l'ancre et la clé de rendu. */
  id: string;
  title: string;
  subtitle: string;
  /** Description longue, un paragraphe par entrée. */
  paragraphs: string[];
  /** Programme détaillé (puces). Optionnel. */
  programme?: string[];
  duree: string;
  frequence: string;
  tarif: string;
  /** Prochaine session datée, si connue. */
  nextDate?: string;
  /** Lieu de la prochaine session, si connu. */
  lieu?: string;
  /** Badge « Nouveau ». */
  isNew?: boolean;
  /** CTA. Par défaut : page Contact. */
  ctaHref?: string;
}

export interface Saison {
  key: 'printemps' | 'ete' | 'automne' | 'hiver';
  name: string;
  /** Thème de la saison (ex. « l'impeccabilité »). */
  theme: string;
  /** Glyphe interne (voir SeasonStages.astro). */
  icon: 'sprout' | 'sun' | 'leaf' | 'snow';
  stages: SaisonStage[];
}

export const SAISONS: Saison[] = [
  {
    key: 'printemps',
    name: 'Printemps',
    theme: "l'impeccabilité",
    icon: 'sprout',
    stages: [
      {
        id: 'renaitre',
        title: 'RENAÎTRE',
        subtitle: 'Être et bien-être impeccablement impeccable',
        paragraphs: [
          "Se remettre au point zéro pour naître et renaître, prendre un nouveau départ et vivre un Renouveau pour l'année nouvelle par la tenségrité — une autre façon de vivre l'impeccabilité, thème central et élevé de ce nouveau stage pratique de printemps, abordé et revisité sous toutes ses facettes : spirituelle, émotionnelle, mentale, physique et psychique.",
          'Enseignement théorique et pratique, avec rituels, gestuelles conscientes et passes magnétiques.',
        ],
        duree: 'Trois jours en résidentiel en pleine nature ou à la campagne (Drôme & Vaucluse).',
        frequence: 'De la fin janvier à la mi-avril.',
        tarif: '350 €',
      },
    ],
  },
  {
    key: 'ete',
    name: 'Été',
    theme: "l'amour",
    icon: 'sun',
    stages: [
      {
        id: 'aimer',
        title: 'AIMER',
        subtitle: "Choisir l'amour, libérer et adoucir le cœur",
        paragraphs: [
          "Un stage d'été telle une porte ouverte montante vers le solstice de juin, le jour le plus long, pour émettre une intention claire et ferme de libération du cœur de sa prison de négativité — pour l'été, pour l'année, pour la bonne santé émotionnelle de votre âme, au travers des enseignements toltèques de l'amour.",
          "Dans un lieu de paradis des montagnes provençales (Hautes Baronnies et Haut Ventoux), vous apprendrez, au cours de ces trois jours, à conclure de nouveaux accords fondés sur l'amour et non sur la peur, après avoir effectué l'inventaire de vos conditionnements toxiques.",
          "La spécificité de ce nouveau stage : choisir d'aimer malgré tout, dans le monde tel qu'il est, en faisant le tour des enseignements toltèques de l'amour pour en maîtriser la teneur et le sens — et découvrir ce qui se cache derrière la peur…",
          "Ce stage fait suite au stage de printemps RENAÎTRE sur l'impeccabilité et s'inscrit dans le cycle annuel de stages thématiques par saison, sur les enseignements toltèques transmis par Don Miguel Ruiz, notamment, mais pas seulement.",
          'Enseignement théorique et pratique, avec rituels, gestuelles conscientes, mouvement corporel, temps de créativité et passes magnétiques.',
        ],
        duree: 'Trois jours en résidentiel en pleine nature dans la Haute Drôme.',
        frequence: 'Du début mai au début septembre.',
        tarif: '350 €',
        nextDate: '29–31 mai 2026',
        lieu: 'Reilhanette (26570)',
      },
      {
        id: 'medecine-coeur',
        title: 'MÉDECINE TOLTÈQUE DU CŒUR',
        subtitle: 'Guérir le cœur, guérir par le cœur',
        paragraphs: [
          "Dans les montagnes de la Drôme provençale, avec l'esprit de la nature. Cette session de trois jours sur la Médecine Toltèque du Cœur permet de parcourir la voie toltèque des trois maîtrises, pour vivre une vie meilleure avec soi et avec les autres, au plus près de votre rêve de paradis personnel.",
          "En ces temps incertains de changement et de chaos organisé, il importe plus que jamais de répondre aux aspirations de son âme, en alignement avec son être véritable, pour concrétiser son rêve de paradis personnel et collectif : en guérissant son cœur, en guérissant par le cœur. L'amour est la médecine qui accélère la guérison selon Don Miguel Ruiz — et la médecine du cœur la plus puissante de toutes. Voir aussi, en accompagnement, le <a href='/accompagnement/cercle-de-pardon/'>Cercle de Pardon</a>.",
        ],
        programme: [
          "Maîtrise de l'attention et de la transformation",
          'Rompre et conclure des accords',
          'Médecine toltèque du cœur et art de vivre',
          'Préparation toltèque',
          'Une médecine toltèque du cœur pour guérir son cœur, par le cœur',
          'Neutraliser le parasite et adopter un nouvel état d’esprit',
          'Enseignements théoriques et pratiques',
          'Expression corporelle et dansée, gestuelles conscientes, mouvement, créativité, jeux de rôles… et surprises',
          "Rituels symboliques avec l'esprit de la nature",
        ],
        duree: 'Trois jours en résidentiel en pleine nature dans la Haute Drôme.',
        frequence: 'De mai à août.',
        tarif: '350 €',
        nextDate: '19–21 juin 2026',
        lieu: 'Reilhanette (26570)',
      },
      {
        id: 'maitrise-amour-ete',
        title: "LA MAÎTRISE DE L'AMOUR",
        subtitle: 'Pratiquer un art de vivre de la relation aimable et aimante',
        paragraphs: [
          "Un art des relations selon les enseignements de la Maîtrise de l'Amour de Don Miguel Ruiz. Être en relation est tout un monde, fait de liens multiples qui nous relient à l'autre et à soi, et nous confrontent aussi à la différence, à l'altérité, à la singularité, au point de vue opposé au nôtre.",
          "La voie toltèque enseigne l'amour de soi dans le respect de l'autre — qui d'abord est autre, tout en étant notre semblable. Chaque être humain est un artiste rêveur qui crée son monde dans son esprit et le projette dans le grand rêve collectif. Les relations nous donnent l'affection dont nous avons besoin, nous nourrissent, nous grandissent… et peuvent aussi nous affecter.",
          "Devenu maître dans l'art des relations, Don Miguel Ruiz nous invite à faire de même : pratiquer au quotidien un art des relations fondé sur l'amour, la conscience et le respect, où chacun des accords toltèques devient, à tour de rôle, une ressource.",
        ],
        programme: [
          "Maîtrise de l'attention et de la transformation",
          'Rompre et conclure des accords',
          "Maîtrise de l'amour : un art toltèque des relations",
          'Préparation toltèque',
          'Une médecine toltèque du cœur pour guérir ses relations',
          'Neutraliser le parasite et adopter un nouvel état d’esprit',
          'Enseignements théoriques et pratiques',
          'Expression corporelle et dansée, gestuelles conscientes, mouvement, créativité, jeux de rôles… et surprises',
          "Rituels symboliques avec l'esprit de la nature",
        ],
        duree: 'Trois jours en résidentiel en pleine nature dans la Haute Drôme.',
        frequence: 'De juin à août.',
        tarif: '350 €',
        nextDate: '21–23 août 2026',
        lieu: 'Reilhanette (26570)',
      },
    ],
  },
  {
    key: 'automne',
    name: 'Automne',
    theme: 'la vérité',
    icon: 'leaf',
    stages: [
      {
        id: 'accepter-lacher-prise',
        title: 'ACCEPTER ET LÂCHER-PRISE',
        subtitle: 'La quête de la vérité selon les Toltèques',
        paragraphs: [
          "Ce premier stage d'automne propose de parcourir maîtrises et accords de l'enseignement toltèque selon Don Miguel Ruiz et ses fils, Don José et Don Miguel Jr., en prenant le temps de s'arrêter sur chacun des accords — qui agissent comme des révélateurs de l'âme — et de faire le point, tel un bilan de l'été, dans la transition de l'automne, entre lumière et ombre.",
          "Nous œuvrerons avec l'énergie de l'équinoxe d'automne et ses changements significatifs vers l'hiver, saison de la terre et de la mort sur un plan symbolique. Que souhaitez-vous laisser partir dans votre vie en automne ? De quoi souhaitez-vous vous alléger ?",
          "La quête de la vérité — qu'est-ce que la vérité du point de vue toltèque ? — sera au centre de ce stage, avec la proposition d'allier la tête et le cœur, le mental et les émotions, l'air et l'eau, et de les faire danser ensemble : car tout va par paires dans l'enseignement toltèque du tonal et du nagual, opposés complémentaires. De quoi nous tenir, vivants, équilibristes équilibrés, quand décline l'énergie saisonnière — en ordre, par un mental éclairé, maître du discernement.",
          'Si ce projet vous intéresse, bienvenue au bon endroit !',
        ],
        programme: [
          "Apports théoriques sur les accords, suivis d'exercices pratiques diversifiés en lien avec l'esprit de la nature",
          'Enseignements inspirés et inspirants',
          'Respiration, intention, méditation',
          'Ouverture des centres de force (préparation)',
          'Exercices écrits, ludiques et pratiques',
          'Yoga du son, yoga toltèque et gestuelles conscientes',
          "Rituels avec l'esprit de la nature",
          'Médecines toltèques (Aigle et Jaguar)',
          'Cercles de parole',
          'Voyage chamanique (en option)',
          'Expression corporelle et mouvement dansé',
          'Temps de silence…',
        ],
        duree: 'Trois jours en résidentiel en pleine nature dans la Haute Drôme.',
        frequence: "De la mi-août à l'équinoxe d'automne.",
        tarif: '350 €',
        nextDate: '25–27 septembre 2026',
        lieu: 'Caderousse (84860)',
      },
      {
        id: 'maitrise-amour-automne',
        title: "LA MAÎTRISE DE L'AMOUR",
        subtitle: 'Un art toltèque des relations en automne',
        paragraphs: [
          "Ce stage sur la Maîtrise de l'Amour est orienté vie intérieure, attachement-détachement et relation à soi, pour concilier ombre et lumière, entre été et hiver. Avec l'intention de transformer la mélancolie et la dépression chronique automnales, en abordant le processus d'attachement et de détachement comme une ressource pour des relations humaines plus équilibrées, plus paisibles et plus aimantes.",
          "Une place particulière est faite au processus d'attachement et de détachement, en lien direct avec l'énergie de l'automne — temps propice pour descendre à l'intérieur de soi et accepter de regarder la vérité en face, même quand cette vérité est faite d'ombre… qui deviendra lumière par le travail alchimique de transformation intérieure des accords toltèques.",
          "Nous verrons comment vivre des relations au quotidien en apprenant à conclure de nouveaux accords fondés sur l'amour, et non sur la peur. Nous aborderons des notions-clés : l'art du rêve et de la traque, la relation parfaite, le corps, le sexe et le mental, la cuisine magique, la médecine du cœur pour guérir l'ego blessé.",
          'La quête de la vérité du point de vue toltèque sera aussi au cœur de ce stage. Des ponts philosophiques et chamaniques seront établis avec d’autres traditions et philosophies, notamment les mystères de la Grèce antique.',
        ],
        programme: [
          "Alternance dosée d'enseignements théoriques et d'exercices pratiques",
          "Maîtrise de l'attention et de la transformation",
          'Rompre et conclure des accords',
          "Maîtrise de l'amour : un art toltèque des relations",
          'Préparation toltèque',
          'Une médecine toltèque du cœur pour guérir ses relations',
          'Gestuelles conscientes et yogas toltèques',
          "Rituels symboliques avec l'esprit de la saison",
          'Expression corporelle et mouvement dansé',
          'Temps de créativité, de méditation, d’introspection…',
        ],
        duree: 'Trois jours en résidentiel en pleine nature dans la Haute Drôme.',
        frequence: 'De la fin septembre au début novembre.',
        tarif: '350 €',
        nextDate: '22–25 octobre 2026',
        lieu: 'Caderousse (84860)',
      },
      {
        id: 'accords-attachements',
        title: 'LES ACCORDS TOLTÈQUES REVISITÉS À LA LUMIÈRE DE NOS ATTACHEMENTS',
        subtitle: "Entre lumière et ombre, l'esprit de l'automne pour être en ordre en hiver",
        isNew: true,
        paragraphs: [
          "Ce stage est une invitation à revenir au centre de notre respiration, à s'aérer, à trier et à mettre de l'ordre en nous, à lâcher prise et à nous défaire de tous nos encombrants, à nous délester de nos fardeaux avant l'hiver. À nous mettre en ordre, au bon moment, au bon endroit, avec les bons humains, quand vient la nuit de l'hiver : une invitation à ralentir, à vivre un nouveau rêve, en transformant notre intérieur.",
          'Vous regarderez vos suppositions et vos attachements à la lumière des enseignements toltèques, en résonance avec les types d’attachement psychanalytiques. Transformer ses attachements malsains en attachements sains vous offrira une liberté personnelle plus grande et une mise en ordre, en vous et autour de vous, pour vivre en paix, en bonne santé, équilibré et équilibriste, centré et aligné.',
          "Un stage nouveau, créé en 2025, pour bien intégrer l'esprit de l'automne et vivre l'hiver lui aussi comme une réjouissance, une fête intérieure.",
        ],
        programme: [
          "Alternance dosée d'enseignements théoriques et d'exercices pratiques",
          "Accords toltèques et niveaux d'attachement",
          "Typologies d'attachements",
          'Traque et miroir de fumée',
          'Rompre et conclure des accords',
          'Gestuelles conscientes et yogas toltèques',
          "Rituels symboliques avec l'esprit de la saison",
          'Expression corporelle et mouvement dansé',
          'Temps de créativité, de méditation, d’introspection',
          'Processus attachement-détachement',
          'Cercles de feu',
        ],
        duree: 'Trois jours en résidentiel en pleine nature ou à la campagne (Drôme & Vaucluse).',
        frequence: 'De la fin octobre à la fin novembre.',
        tarif: '350 €',
        nextDate: '20–22 novembre 2026',
        lieu: 'Caderousse (84860)',
      },
    ],
  },
  {
    key: 'hiver',
    name: 'Hiver',
    theme: "l'action",
    icon: 'snow',
    stages: [
      {
        id: 'mourir',
        title: 'MOURIR',
        subtitle: "Embrasser l'ange de la mort",
        paragraphs: [
          "Ce stage sur la médecine de l'hiver propose de parcourir maîtrises et accords de l'enseignement toltèque selon Don Miguel Ruiz et ses fils, Don José et Don Miguel Jr., en prenant le temps de s'arrêter sur chacun des accords, qui agissent comme des révélateurs de l'âme.",
          "Nous œuvrerons durant ces trois jours avec l'énergie de l'hiver, en ordre et alignés avec ses intentions, pour bien préparer le nouveau foyer, le nouveau feu intérieur — afin que l'hiver soit aussi une réjouissance de cette flamme qui éclaire et brille quand vient la nuit, la ténèbre hivernale, le long sommeil et la nuit noire de la saison froide : mort symbolique de ce qui n'est plus, pour renaître au printemps.",
          "L'hiver commande de nous abandonner à la terre, de revenir à soi, au corps, au creux, afin de vivre ce moment comme un temps de méditation sur la mort — et de l'aborder selon l'enseignement toltèque de la prise de conscience du cadeau de vivre. Que souhaitez-vous ordonner en vous cet hiver ? Quel hiver souhaitez-vous vivre ?",
          "Après l'été, saison du cœur, et l'automne, élément air et mental, voici venu le temps du corps — pour vivre l'hiver comme un repos, une réflexion et une fête intérieure, dans la chaleur du foyer. Nous solliciterons l'énergie de l'hiver et l'élément terre pour honorer la dimension féminine de la nature : le corps, la flamme de vie du dedans, le foyer, la matrice, le chaudron, la nuit, le repos.",
          'Des temps de toucher, de contact physique doux, bienveillant et respectueux de chacun, ainsi que des massages, sont prévus : les médecines toltèques hivernales sont autant de ressources pour bien vivre l’hiver, en ralentissant, en s’enracinant, en se reposant.',
          "L'esprit des lieux, la nature et l'énergie de saison seront des ressources créatives pour former des intentions nouvelles, conclure de nouveaux accords de pouvoir et accepter de mourir… pour renaître au printemps. Qu'allez-vous planter en terre froide pour vos saisons à venir, vos projets de printemps et vos actions d'été ?",
        ],
        programme: [
          "Apports théoriques sur les accords, suivis d'exercices pratiques en lien avec l'esprit de la nature",
          'Rompre et conclure des accords',
          'Gestuelles conscientes et yogas toltèques',
          "Rituels symboliques avec l'esprit de la saison",
          'Expression corporelle et mouvement dansé',
          'Temps de toucher et de contact physique, bienveillant, doux et respectueux',
          "Temps de massages et médecines toltèques de l'hiver, de la terre",
          'Cercles de feu',
          'Temps de créativité, de méditation, d’introspection',
        ],
        duree: 'Trois jours en résidentiel en pleine nature ou à la campagne (Drôme & Vaucluse).',
        frequence: 'Du début novembre à la fin janvier.',
        tarif: '350 €',
        nextDate: '27–29 novembre 2026',
        lieu: 'Caderousse (84860)',
      },
    ],
  },
];

/** Note commune à tous les stages (affichée une fois sous le catalogue). */
export const STAGE_NOTE =
  "Possibilité de programmer chaque stage ailleurs en France et à l'étranger francophone, à partir de huit personnes.";

/** CTA par défaut des stages. */
export const STAGE_CTA = ROUTES.contact;
