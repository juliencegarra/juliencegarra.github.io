/* Textes du site et choix des publications. C'est le seul fichier à modifier au quotidien. */

export const NAME = "Julien Cegarra";
export const HAL_ID = "juliencegarra";

// Publications mises en avant sur l'accueil, dans l'ordre (identifiants HAL, ou celui d'une entrée EXTRA)
export const SELECTED = [
  "hal-05322388",  // Exosquelettes, Human Factors 2025
  "hal-05777728",  // Véhicules autonomes, Transportation Research Part F 2025
  "hal-04984691",  // Incapacitation cognitive, TIES 2025
  "hal-03986138",  // Type et fiabilité de l'automatisation, IJHCI 2022
  "hal-03274691",  // OpenMATB, Behavior Research Methods 2020
  "hal-03579405",  // Charge et effort mental, Human Factors 2019
  "hal-01356925",  // Réallocation des ressources, Human Factors 2016
  "hal-03346297",  // Typologie des situations d'ordonnancement, TIES 2008
];

// Publications à ajouter à celles de HAL (même format que l'API HAL) ; un même DOI est fusionné tout seul.
export const EXTRA = [];

export const HIDDEN = [];  // identifiants HAL à ne pas afficher

export const ALIASES = {
  "J. Cegarra": "Julien Cegarra",
  "J. Navarro": "Jordan Navarro",
  "Jean-Marc Andre": "Jean-Marc André"
};  // noms à corriger à l'affichage

export const T = {
  en: {
    home: "Home",
    pubs: "Publications",
    other_lang: "fr",
    other_label: "Français",
    description: "Julien Cegarra, professor of ergonomic psychology at INU Champollion (Albi, France).",
    bio: [
      "I am a full professor of ergonomic psychology at the Institut National Universitaire Champollion (University of Toulouse) in Albi, France, and a member of the SCoTE research unit.",
      "I study how people work with automated systems: trust, complacency, mental workload and multitasking. I do so in aviation, in driving among autonomous vehicles, in planning and scheduling, and in the use of exoskeletons at work.",
      "From 2016 to 2026 I headed the SCoTE research unit (cognitive science, technology, ergonomics). I have supervised or co-supervised thirteen PhD theses, two of them in progress.",
      "I have also headed the master's programme in ergonomics (2009–2021), the master's track in quality, environment and industrial risks (QERI, 2016–2021) and the university diploma in environment, industrial risk and safety management (MERIS, 2011–2021).",
      "I develop <a href=\"https://juliencegarra.github.io/OpenMATB/\">OpenMATB</a>, an open-source multi-attribute task battery for research on mental workload."
    ],
    links: [
      "<a href=\"mailto:julien.cegarra@univ-jfc.fr\">julien.cegarra@univ-jfc.fr</a>",
      "<a href=\"https://cv.hal.science/juliencegarra\">HAL</a>",
      "<a href=\"https://orcid.org/0000-0001-8443-2676\">ORCID</a>",
      "<a href=\"https://github.com/juliencegarra\">GitHub</a>"
    ],
    selected: "Selected papers",
    all_pubs: "See all publications",
    sections: [
      [
        "Projects",
        [
          [
            "2027–2029",
            "CHORUS, human-drone cooperation for search and rescue (ANR ASTRID)."
          ],
          [
            "2022–2026",
            "SR-VIUsagers, intelligent vehicles and other road users (French Road Safety Delegation), principal investigator."
          ],
          [
            "2020–2024",
            "Eye-Interaction, eye-based systems against incapacitation (ANR ASTRID Maturation), co-principal investigator."
          ],
          [
            "2019–2023",
            "PER4MANCE, flexible work allocation in aircraft assembly (ANR)."
          ],
          [
            "2016–2020",
            "Smart Planning, planning in road transport (ANR)."
          ]
        ]
      ],
      [
        "Software",
        [
          [
            "OpenMATB",
            "Open-source multi-attribute task battery, <a href=\"https://juliencegarra.github.io/OpenMATB/\">available online</a>."
          ],
          [
            "ErgoPose",
            "Analysis of postural constraints at work. Licensed in 2025 to the start-up <a href=\"https://pilotii.fr/\">Pilotii Lab</a>, of which I am a partner."
          ],
          [
            "ELIZA",
            "Python port of Weizenbaum's program, <a href=\"https://juliencegarra.github.io/eliza-python/web/\">try it online</a>."
          ]
        ]
      ],
      [
        "Background",
        [
          [
            "2014–",
            "Full professor, INU Champollion."
          ],
          [
            "2022–2023",
            "Six-month research leave at the IMS laboratory (CNRS UMR 5218), Bordeaux INP – ENSC."
          ],
          [
            "2012",
            "Habilitation to supervise research."
          ],
          [
            "2006–2014",
            "Associate professor, Centre universitaire Champollion."
          ],
          [
            "2001–2004",
            "PhD in ergonomic psychology, Université Paris 8 and IRCCyN – École Centrale de Nantes."
          ]
        ]
      ]
    ],
  },
  fr: {
    home: "Accueil",
    pubs: "Publications",
    other_lang: "en",
    other_label: "English",
    description: "Julien Cegarra, professeur de psychologie ergonomique à l'INU Champollion (Albi).",
    bio: [
      "Je suis professeur des universités en psychologie ergonomique à l'Institut National Universitaire Champollion (Université de Toulouse), à Albi, et membre de l'unité de recherche SCoTE.",
      "Mes recherches portent sur la coopération entre l'humain et les systèmes automatisés : confiance, contentement, charge mentale et gestion de plusieurs tâches à la fois. Je les mène dans l'aéronautique, la conduite parmi les véhicules autonomes, la planification et l'usage des exosquelettes au travail.",
      "J'ai dirigé de 2016 à 2026 l'unité de recherche SCoTE (Sciences de la cognition, Technologie, Ergonomie). J'ai dirigé ou co-encadré treize thèses, dont deux en cours.",
      "J'ai aussi dirigé le master Ergonomie (2009–2021), le parcours de master Qualité, environnement et risques industriels (QERI, 2016–2021) et le diplôme d'université Management de l'environnement, du risque industriel et de la sécurité (MERIS, 2011–2021).",
      "Je développe <a href=\"https://juliencegarra.github.io/OpenMATB/\">OpenMATB</a>, une batterie de tâches multiples libre pour l'étude de la charge mentale."
    ],
    links: [
      "<a href=\"mailto:julien.cegarra@univ-jfc.fr\">julien.cegarra@univ-jfc.fr</a>",
      "<a href=\"https://cv.hal.science/juliencegarra\">HAL</a>",
      "<a href=\"https://orcid.org/0000-0001-8443-2676\">ORCID</a>",
      "<a href=\"https://github.com/juliencegarra\">GitHub</a>"
    ],
    selected: "Publications choisies",
    all_pubs: "Voir toutes les publications",
    sections: [
      [
        "Projets",
        [
          [
            "2027–2029",
            "CHORUS, coopération humain-drones pour la recherche et le sauvetage (ANR ASTRID)."
          ],
          [
            "2022–2026",
            "SR-VIUsagers, véhicules intelligents et autres usagers de la route (Délégation à la Sécurité Routière), porteur."
          ],
          [
            "2020–2024",
            "Eye-Interaction, systèmes oculaires pour la résistance à l'incapacitation (ANR ASTRID Maturation), co-porteur."
          ],
          [
            "2019–2023",
            "PER4MANCE, répartition flexible du travail en assemblage aéronautique (ANR)."
          ],
          [
            "2016–2020",
            "Smart Planning, planification dans le transport (ANR)."
          ]
        ]
      ],
      [
        "Logiciels",
        [
          [
            "OpenMATB",
            "Batterie de tâches multiples, libre et <a href=\"https://juliencegarra.github.io/OpenMATB/\">utilisable en ligne</a>."
          ],
          [
            "ErgoPose",
            "Analyse des contraintes posturales au travail. Licence concédée en 2025 à la start-up <a href=\"https://pilotii.fr/\">Pilotii Lab</a>, dont je suis associé."
          ],
          [
            "ELIZA",
            "Portage en Python du programme de Weizenbaum, <a href=\"https://juliencegarra.github.io/eliza-python/web/\">à essayer en ligne</a>."
          ]
        ]
      ],
      [
        "Parcours",
        [
          [
            "2014–",
            "Professeur des universités, INU Champollion."
          ],
          [
            "2022–2023",
            "Accueil au laboratoire IMS (CNRS UMR 5218), Bordeaux INP – ENSC."
          ],
          [
            "2012",
            "Habilitation à diriger des recherches."
          ],
          [
            "2006–2014",
            "Maître de conférences, Centre universitaire Champollion."
          ],
          [
            "2001–2004",
            "Doctorat en psychologie ergonomique, université Paris 8 et IRCCyN – École centrale de Nantes."
          ]
        ]
      ]
    ],
  }
};
