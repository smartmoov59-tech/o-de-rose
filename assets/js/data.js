/* ==========================================================================
   Ô de Rose — données du site (prix, durées, avis)
   Source : page Planity de l'institut (relevé du 5 novembre 2026).
   Format d'une prestation : [nom, durée, prix, note]
   prix : nombre (en €) ou texte libre.
   ========================================================================== */

window.ODR = window.ODR || {};

ODR.INFO = {
  name: 'Ô de Rose',
  phone: '06 16 81 26 42',
  phoneTel: '+33616812642',
  planity: 'https://www.planity.com/o-de-rose-04000-digne-les-bains',
  maps: 'https://www.google.com/maps/place/Institut+%C3%94+de+Rose/@44.0855419,6.2222266,17z/data=!4m6!3m5!1s0x12cb9b62c5d7cccd:0xa61922d03b42040b!8m2!3d44.0855419!4d6.2222266!16s%2Fg%2F11h0t6tnws',
  instagram: 'https://www.instagram.com/institutoderose/',
  facebook: 'https://www.facebook.com/AlbaneseManon/',
  // jour JS (0 = dimanche) -> [ouverture, fermeture] en heures décimales, null = fermé
  hours: {
    0: null,
    1: [9, 18],
    2: [9, 18],
    3: null,
    4: [9, 18],
    5: [9, 18],
    6: [9, 13]
  }
};

ODR.MENU = [
  {
    id: 'headspa',
    title: 'Head Spa',
    kicker: 'Rituel japonais du cuir chevelu',
    intro: "Le Head Spa japonais associe soins capillaires et relaxation profonde. Après le soin, un sèche-cheveux et une brosse sont à votre disposition.",
    items: [
      ['Soin Découverte · 30 min', '45 min', 69, 'Modelage de bienvenue, gommage du cuir chevelu, 2 shampooings traitants selon votre type de cheveux.'],
      ['Soin Global · 60 min', '1 h 15', 99, 'Modelage de bienvenue, peignes en bois et brosses massantes, gommage, 2 shampooings traitants, modelage du cuir chevelu, soin sous dôme de vapeur.'],
      ['Soin Prestige · 1 h 15', '1 h 30', 139, 'Le soin Global, prolongé d’un soin du visage : nettoyage, gommage et masque.'],
      ['Option masque mains ou pieds', '5 min', 10, ''],
      ['Option massage pieds ou mains', '5 min', 15, ''],
      ['Option masque visage collagène', '5 min', 15, '']
    ]
  },
  {
    id: 'visage',
    title: 'Soins du visage',
    kicker: 'Méthode Physiodermie & JADEA',
    intro: 'Des soins sur mesure, du coup d’éclat express au traitement anti-âge premium. Un diagnostic de peau est conseillé avant un peeling.',
    items: [
      ['Équilibre Essentiel Flash · 30 min', '40 min', 45, 'Soin coup d’éclat de Méthode Physiodermie.'],
      ['Équilibre Essentiel · 45 min', '55 min', 59, 'Traitement sur mesure équilibrant.'],
      ['Équilibre Essentiel Expert · 75 min', '1 h 25', 89, 'Traitement global personnalisé.'],
      ['Chrono Repair', '1 h 20', 105, 'Traitement anti-âge premium.'],
      ['Peeling Bio Rénovateur · 45 min', '50 min', 80, 'Resserre les pores, optimise le renouvellement cellulaire, gomme rides et ridules. Contre-indications : diagnostic de peau préférable.'],
      ['Peeling Bio Rénovateur · 60 min', '1 h 15', 99, 'Même soin, version prolongée.'],
      ['Soin Physiotonifiant', '1 h 35', 110, 'Traitement liftant et remodelant : les muscles du visage travaillés manuellement.'],
      ['Morpho-Lympho Drainage du visage', '30 min', 39, 'Massage drainant du visage.'],
      ['Modelage Physiotonifiant', '50 min', 45, ''],
      ['Soin Flash purifiant JADEA · 20 min', '30 min', 21, ''],
      ['Soin complet purifiant JADEA · 60 min', '1 h 10', 59, ''],
      ['Extraction des comédons', '15 min', 10, 'En supplément d’un soin du visage.'],
      ['Option masque collagène', '15 min', 15, ''],
      ['Soin à déterminer sur place', '1 h 25', 'Sur place', 'On choisit ensemble, après le diagnostic de peau.']
    ]
  },
  {
    id: 'corps',
    title: 'Soins du corps',
    kicker: 'Gommages & modelages',
    intro: 'Des modelages relaxants, du dos à la bougie à la pause Cocoon pour les futures mamans.',
    items: [
      ['Gommage (lait pour le corps)', '40 min', 40, ''],
      ['Modelage relaxant · 25 min', '35 min', 35, ''],
      ['Modelage relaxant · 50 min', '1 h', 65, ''],
      ['Modelage du dos à la bougie', '35 min', 45, ''],
      ['Modelage Cocoon', '1 h 10', 75, 'Idéal pour les futures mamans : une pause pour se sentir légère, radieuse et épanouie.'],
      ['Escale du moment · corps · 45 min', '50 min', 59, ''],
      ['Escale du moment · corps et visage · 60 min', '1 h 15', 79, '']
    ]
  },
  {
    id: 'ceremonies',
    title: 'Soins cérémonies',
    kicker: 'Deux soins, un seul rendez-vous',
    intro: 'Des forfaits qui enchaînent deux soins pour une vraie parenthèse.',
    items: [
      ['Bien-être · gommage + modelage 25 min', '1 h 05', 70, ''],
      ['Lâcher prise · gommage + modelage 50 min', '1 h 30', 99, ''],
      ['Relaxation · soin visage Équilibre Essentiel + modelage 25 min', '1 h 20', 89, ''],
      ['Détente · soin visage Équilibre Essentiel + modelage 50 min', '1 h 45', 119, '']
    ]
  },
  {
    id: 'regard',
    title: 'Beauté du regard',
    kicker: 'Cils & sourcils',
    intro: 'Le rehaussement de cils Yumi Lashes (100 % français) allie rehaussement, teinture et soin à la kératine. Venez démaquillée.',
    items: [
      ['Yumi Lashes · rehaussement & teinture des cils', '1 h', 75, 'Dans les 24 h : ne pas mouiller, ne pas frotter, aucun produit sur les cils, éviter sauna et hammam.'],
      ['Teinture cils', '20 min', 19, ''],
      ['Teinture sourcils', '25 min', 15, ''],
      ['Teinture + épilation sourcils', '30 min', 19, ''],
      ['Magie du regard Starvac', '40 min', 49, 'Stretching cellulaire 20 min puis 10 min de soin manuel : illumine et détoxifie.']
    ]
  },
  {
    id: 'mains',
    title: 'Mains & pieds',
    kicker: 'Beauté, semi-permanent, callosités',
    intro: 'Le vernis semi-permanent ne comprend ni rallongement d’ongles, ni baby-boomer, ni nail art (réalisés par Aurore, prothésiste ongulaire, sur rendez-vous).',
    items: [
      ['Beauté des mains', '45 min', 35, 'Cuticules, limage, massage et vernis fortifiant transparent.'],
      ['Beauté des pieds', '45 min', 39, 'Cuticules, limage, retrait des callosités, massage et vernis fortifiant.'],
      ['Vernis semi-permanent mains', '45 min', 35, ''],
      ['Vernis semi-permanent mains + dépose', '1 h', 39, ''],
      ['Vernis semi-permanent pieds', '30 min', 35, ''],
      ['Vernis semi-permanent pieds + dépose', '1 h', 39, ''],
      ['Semi-permanent mains + pieds', '1 h 15', 59, ''],
      ['Forfait semi-permanent mains + pieds avec dépose', '1 h 45', 69, ''],
      ['Dépose semi-permanent mains', '20 min', 15, ''],
      ['Dépose semi-permanent pieds', '20 min', 15, ''],
      ['CalluZéro · retrait des callosités', '40 min', 39, 'En douceur.'],
      ['Semi-permanent mains + beauté des mains express', '1 h', 49, 'Si les ongles sont peu ou pas entretenus.'],
      ['Semi-permanent pieds + beauté des pieds express', '45 min', 49, 'Si les ongles sont peu ou pas entretenus.'],
      ['Retouche ongle cassé (moins de 2 semaines)', '10 min', 'jusqu’à 5', '']
    ]
  },
  {
    id: 'epil-femme',
    title: 'Épilations femme',
    kicker: 'À la cire, à la pince pour les sourcils',
    intro: 'Rapide, efficace, matériel stérile sous emballage.',
    items: [
      ['Sourcils (entretien)', '15 min', 9, 'Entretien d’une ligne déjà existante, essentiellement à la pince.'],
      ['Restructuration sourcils', '30 min', 18, 'Pour des sourcils non entretenus depuis 2 mois ou plus.'],
      ['Lèvres', '10 min', 8, ''],
      ['Menton', '10 min', 8, ''],
      ['Bas du visage', '15 min', 13, ''],
      ['Visage complet', '25 min', 21, ''],
      ['Aisselles', '15 min', 13, ''],
      ['Avant-bras', '30 min', 16, ''],
      ['Bras complet', '30 min', 19, ''],
      ['½ jambes', '20 min', 18, ''],
      ['Cuisses', '20 min', 17, ''],
      ['Jambes complètes', '30 min', 25, ''],
      ['Maillot classique', '15 min', 13, ''],
      ['Maillot échancré', '20 min', 16, ''],
      ['Maillot américain', '25 min', 18, ''],
      ['Maillot intégral', '30 min', 23, ''],
      ['Maillot intégral + sillon interfessier', '30 min', 25, ''],
      ['Fesses', '15 min', 12, '']
    ]
  },
  {
    id: 'forfaits',
    title: 'Forfaits épilation',
    kicker: 'Plus malin à plusieurs zones',
    intro: 'Des combinaisons de zones à prix doux.',
    items: [
      ['Lèvres + sourcils', '20 min', 15, ''],
      ['Lèvres + menton', '15 min', 13, ''],
      ['½ jambes + maillot classique + aisselles', '45 min', 39, ''],
      ['½ jambes + maillot échancré + aisselles', '50 min', 42, ''],
      ['½ jambes + maillot semi-intégral + aisselles', '55 min', 44, ''],
      ['½ jambes + maillot intégral + aisselles', '1 h', 48, ''],
      ['½ jambes + maillot intégral (+ sillon) + aisselles', '1 h', 50, ''],
      ['Jambes complètes + maillot classique + aisselles', '50 min', 45, ''],
      ['Jambes complètes + maillot échancré + aisselles', '1 h', 48, ''],
      ['Jambes complètes + maillot semi-intégral + aisselles', '1 h 10', 50, ''],
      ['Jambes complètes + maillot intégral + aisselles', '1 h 15', 54, ''],
      ['Jambes complètes + maillot intégral (+ sillon) + aisselles', '1 h 15', 56, '']
    ]
  },
  {
    id: 'ipl-femme',
    title: 'Lumière pulsée femme',
    kicker: 'Prix à la séance · 6 à 8 séances conseillées',
    intro: 'Des résultats proches du laser, pour une dépilation moins coûteuse et moins douloureuse. Premier rendez-vous : contactez l’institut.',
    items: [
      ['Lèvres', '10 min', 35, ''],
      ['Joues', '15 min', 36, ''],
      ['Menton', '10 min', 39, ''],
      ['Lèvres + menton', '15 min', 60, ''],
      ['Bas du visage', '15 min', 60, ''],
      ['Visage', '20 min', 100, ''],
      ['Buste', '15 min', 45, ''],
      ['Aisselles', '15 min', 50, ''],
      ['Maillot', '20 min', 70, ''],
      ['Maillot brésilien', '30 min', 80, ''],
      ['Maillot intégral', '40 min', 90, ''],
      ['Fesses', '30 min', 90, ''],
      ['Avant-bras', '20 min', 65, ''],
      ['Bras complets', '30 min', 90, ''],
      ['½ jambes', '30 min', 150, ''],
      ['Cuisses', '30 min', 160, ''],
      ['Jambes complètes', '40 min', 250, ''],
      ['½ jambes + maillot + aisselles', '45 min', 230, ''],
      ['½ jambes + maillot brésilien + aisselles', '1 h', 238, ''],
      ['½ jambes + maillot intégral + aisselles', '1 h 15', 246, ''],
      ['Jambes complètes + maillot + aisselles', '1 h', 335, ''],
      ['Jambes complètes + maillot brésilien + aisselles', '1 h 10', 345, ''],
      ['Jambes complètes + maillot intégral + aisselles', '1 h 20', 355, '']
    ]
  },
  {
    id: 'photo',
    title: 'Photo-rajeunissement',
    kicker: 'Lumière pulsée sur le visage',
    intro: 'Un soin de la peau par lumière pulsée pour raviver l’éclat.',
    items: [
      ['Soin visage express et cou', '30 min', 70, ''],
      ['Soin complet visage et cou', '1 h', 100, ''],
      ['Option décolleté', '10 min', 15, '']
    ]
  },
  {
    id: 'starvac-minceur',
    title: 'Minceur & fermeté Starvac',
    kicker: 'Minceur, fermeté et détox en un seul soin',
    intro: 'Une technologie qui travaille un double pli de peau pour stimuler en même temps les cellules graisseuses, les cellules de la jeunesse et les fibres de structure. Bilan minceur obligatoire, offert pour l’achat d’une cure.',
    items: [
      ['Bilan minceur obligatoire', '15 min', 'Offert avec une cure', 'Jusqu’à 15 € sans cure.'],
      ['Starvac Diag', '30 min', '25 – 50', 'Bilan de l’équilibre corporel (indices métabolique, hydrique, masse grasse, masse musculaire…). −50 % avec une cure minceur.'],
      ['Starvac Nutrition', '5 min', 30, ''],
      ['Minceur et fermeté Starvac', '45 min', 45, ''],
      ['Minceur et fermeté + pressodynamie', '1 h', 65, ''],
      ['Minceur et fermeté · zone focus (ventre, bras ou hanche)', '25 min', 30, ''],
      ['Anti-vergetures (par zone)', '20 min', 25, ''],
      ['Push up fesses', '30 min', 45, '']
    ]
  },
  {
    id: 'starvac-visage',
    title: 'Anti-âge visage Starvac',
    kicker: 'Stretching cellulaire',
    intro: 'La seule méthode anti-âge naturelle et sans douleur qui réactive les cellules endormies.',
    items: [
      ['Soin visage complet Starvac', '45 min', 60, ''],
      ['Magie du regard Starvac', '40 min', 49, ''],
      ['Cou double Starvac', '35 min', 39, '']
    ]
  },
  {
    id: 'pressodynamie',
    title: 'Pressodynamie',
    kicker: 'Massage par bottes',
    intro: 'Dynamise les flux lymphatique et veineux pour relancer le métabolisme, et soulage les douleurs liées à une activité sportive.',
    items: [
      ['Séance de pressodynamie', '30 min', 30, ''],
      ['Cure de 10 séances', '30 min', 'Sur demande', '']
    ]
  },
  {
    id: 'homme',
    title: 'Soins & épilations homme',
    kicker: 'Visage, dos, épilation',
    intro: 'Le même savoir-faire, pensé pour les hommes.',
    items: [
      ['Soin visage Équilibre Essentiel Flash', '35 min', 45, 'Coup d’éclat, Méthode Physiodermie.'],
      ['Soin visage Équilibre Essentiel', '50 min', 59, ''],
      ['Soin visage Équilibre Essentiel Expert', '1 h 20', 89, ''],
      ['Modelage relaxant 25 min (arrière des jambes et dos)', '35 min', 35, ''],
      ['Modelage du dos à la bougie', '30 min', 45, ''],
      ['Soin du dos purifiant', '1 h', 69, 'Gommage, vapeur, extraction si besoin, modelage, masque.'],
      ['Séance de pressodynamie', '30 min', 30, ''],
      ['Épilation sourcils', '15 min', 9, ''],
      ['Épilation pommettes', '15 min', 9, ''],
      ['Épilation aisselles', '15 min', 18, ''],
      ['Épilation épaules', '15 min', 18, ''],
      ['Épilation dos', '30 min', 22, ''],
      ['Épilation torse', '30 min', 22, ''],
      ['Épilation jambes complètes', '50 min', 30, '']
    ]
  },
  {
    id: 'ipl-homme',
    title: 'Lumière pulsée homme',
    kicker: 'Prix à la séance · 6 à 8 séances conseillées',
    intro: 'Premier rendez-vous : contactez l’institut.',
    items: [
      ['Barbe', '25 min', 132, ''],
      ['Épaules', '15 min', 90, ''],
      ['Torse', '25 min', 150, ''],
      ['Dos', '30 min', 250, ''],
      ['Ventre', '15 min', 90, ''],
      ['Bas du ventre', '15 min', 60, '']
    ]
  }
];

/* Avis réels : Planity (anonymes) et Google (prénoms publics).
   Textes repris tels qu'affichés, parfois raccourcis aux phrases complètes. */
ODR.REVIEWS = [
  { t: "Un moment suspendu… Très agréable d’être dans un endroit hyper silencieux (pas de bruits de porte, téléphone ou autre cliente) pour un massage relaxant… très belle découverte.", a: 'Cliente', s: 'Planity', d: 'janvier 2026' },
  { t: "Soin visage purifiant très agréable. Cadre apaisant, cabine très propre et Manon est très professionnelle. Merci pour ce moment de bien-être.", a: 'Cliente', s: 'Planity', d: 'septembre 2026' },
  { t: "Prestation Head Spa Prestige ! Un moment de détente absolu. Locaux joliment décorés, propres et cosy. Manon est très agréable et pro. Merci infiniment !", a: 'Cliente', s: 'Planity', d: 'mars 2026' },
  { t: "Accueil chaleureux, ambiance détendue, intimité respectée, matériel et locaux impeccables, prestataire douce et efficace. Très professionnel, je recommande vivement.", a: 'Cliente', s: 'Planity', d: 'mars 2026' },
  { t: "J’ai rarement vu un institut aussi propre. Le lieu est hyper accueillant.", a: 'Cliente', s: 'Planity', d: 'mai 2026' },
  { t: "Première prestation avec Manon. Qualité de l’épilation irréprochable, tout en étant rapide, efficace et sans douleur ! Je reviendrai sans aucun doute.", a: 'Cliente', s: 'Planity', d: 'juillet 2025' },
  { t: "Accueil chaleureux, café offert dans un lieu où le bien-être est primordial. Matériel stérile, sous emballage. Aurore sait vous mettre à l’aise en toute simplicité.", a: 'Cliente', s: 'Planity', d: 'juillet 2025' },
  { t: "Manon est la meilleure esthéticienne que l’on pourrait espérer. Gentille, à l’écoute, patiente. Très professionnelle, elle répond à toutes les demandes.", a: 'Cliente', s: 'Planity', d: 'décembre 2025' },
  { t: "Un vrai moment de détente, un accueil sympathique et un massage relaxant effectué tout en douceur. Je recommande.", a: 'Cliente', s: 'Planity', d: 'septembre 2026' },
  { t: "J’ai été bien accueillie, l’espace est confortable, confidentiel et chaleureux. J’y retournerai avec plaisir !", a: 'Cliente', s: 'Planity', d: 'juillet 2026' },
  { t: "Je recommande vivement Aurore pour son travail de grande qualité ! J’ai opté pour une pose en gel (French manucure) et le résultat est impeccable.", a: 'Corine', s: 'Google', d: 'avril 2026' },
  { t: "Quel bonheur… un massage incroyable… Un institut très reposant. Aucun bruit qui parasite ce moment de détente : la musique, les odeurs et la douceur de Manon, un moment suspendu.", a: 'Emilie', s: 'Google', d: 'janvier 2026' },
  { t: "Première fois que je viens me faire épiler dans cet institut, je recommande vivement ! L’esthéticienne est super sympathique et très efficace.", a: 'Léa', s: 'Google', d: 'octobre 2026' },
  { t: "Une découverte d’un nouveau soin offert par ma fille. Un moment de bonheur et j’adore ce salon d’esthétique.", a: 'Cliente', s: 'Planity', d: 'novembre 2025' }
];
