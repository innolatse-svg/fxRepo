import { LegalDocument } from '../models/legal.model';
import { LEGAL_CONFIG } from './legal-config';

export const TERMS_DOCUMENT: LegalDocument = {
  id: 'terms-of-service',
  title: 'Conditions d\'utilisation',
  subtitle: 'Les présentes conditions encadrent l\'accès et l\'utilisation de la plateforme Forex Intel.',
  lastUpdated: LEGAL_CONFIG.lastUpdatedDate,
  effectiveDate: LEGAL_CONFIG.effectiveDate,
  draftNotice: LEGAL_CONFIG.noticeDisclaimer,
  sections: [
    {
      id: 'acceptation',
      number: '01',
      title: 'Acceptation des conditions',
      paragraphs: [
        'L\'accès, la navigation et l\'utilisation de la plateforme logicielle FOREX INTEL (ci-après le « Service » ou la « Plateforme ») sont expressément subordonnés à la consultation, la compréhension et l\'acceptation pleine et entière des présentes Conditions d\'Utilisation.',
        'En créant un compte, en accédant aux outils d\'analyse ou en interagissant avec l\'un quelconque des services proposés, l\'utilisateur reconnaît avoir pris connaissance des présentes conditions et s\'engage formellement à les respecter dans leur intégralité.',
        'Si vous n\'acceptez pas l\'une quelconque des dispositions prévues par les présentes conditions, vous devez immédiatement cesser toute utilisation de la Plateforme et ne procéder à aucune inscription.'
      ],
      callout: {
        type: 'info',
        title: 'Engagement contractuel',
        text: 'Toute utilisation continue du Service vaut acceptation irrévocable des conditions en vigueur au jour de la connexion.'
      }
    },
    {
      id: 'description-service',
      number: '02',
      title: 'Description du service & Nature technologique',
      paragraphs: [
        'FOREX INTEL est une solution logicielle en mode SaaS (Software as a Service) dédiée à l\'intelligence de marché, à l\'assistance analytique et à l\'orchestration du risque pour les opérateurs intervenant sur le marché des devises (Forex).',
        'La Plateforme met à la disposition des utilisateurs un ensemble d\'outils informatiques comprenant notamment :',
        '• Des modules d\'analyse technique et d\'analyse macroéconomique fondamentale ;',
        '• Le suivi structuré des événements du calendrier économique et des flux de volatilité ;',
        '• Des moteurs de synthèse assistés par intelligence artificielle et modèles probabilistes ;',
        '• Un gestionnaire centralisé de règles de risque quantitatives (limites de perte, exposition, taille de lot) ;',
        '• Des passerelles techniques de transmission d\'ordres ou de simulations vers des environnements de trading tiers (ex. MetaTrader 5).'
      ],
      callout: {
        type: 'warning',
        title: 'Absence de statut de broker ou de dépositaire',
        text: 'FOREX INTEL n\'est pas un courtier (broker), n\'est pas une société de gestion de portefeuille et ne détient à aucun moment les fonds des utilisateurs. Tous les fonds, dépôts et comptes de trading demeurent hébergés exclusivement auprès des établissements financiers et courtiers tiers choisis de manière indépendante par l\'utilisateur.'
      }
    },
    {
      id: 'absence-conseil',
      number: '03',
      title: 'Absence de conseil financier & d\'incitation',
      paragraphs: [
        'L\'ensemble des informations, données chiffrées, graphiques, scores algorithmiques, synthèses contextuelles et signaux indicatifs mis à disposition au sein de la Plateforme est fourni à titre strictement informatif, pédagogique et technologique.',
        'Aucun contenu diffusé par FOREX INTEL ne constitue, ni ne doit être interprété comme constituant :',
        '• Un conseil en investissement financier ou une recommandation personnalisée ;',
        '• Une sollicitation, une offre ou une incitation d\'achat ou de vente d\'un quelconque instrument financier ;',
        '• Une garantie expresse ou implicite de résultat financier, de profit ou d\'absence de perte.',
        'L\'utilisateur demeure en toutes circonstances seul et unique responsable de l\'interprétation des données, de l\'évaluation de sa propre tolérance au risque et de l\'opportunité d\'engager ou non des opérations sur les marchés financiers.'
      ]
    },
    {
      id: 'risques-trading',
      number: '04',
      title: 'Avertissement relatif aux risques du marché des devises',
      paragraphs: [
        'Le trading sur devises (Forex), sur contrats pour la différence (CFD) et sur l\'ensemble des produits financiers à effet de levier présente un caractère spéculatif prononcé et comporte un niveau de risque de perte particulièrement élevé.',
        'L\'utilisation de l\'effet de levier amplifie de manière symétrique les gains potentiels ainsi que les pertes en capital, lesquelles peuvent survenir très rapidement et dépasser dans certaines configurations les dépôts initiaux selon les conditions du courtier tiers.',
        'Les performances passées, simulations historiques ou modélisations théoriques présentées sur la Plateforme n\'offrent aucune garantie fiable quant aux résultats futurs.',
        'Aucun système algorithmique, indicateur technique, formule mathématique ou modèle d\'intelligence artificielle ne saurait éliminer l\'aléa inhérent aux marchés financiers ou garantir un rendement positif.'
      ],
      callout: {
        type: 'warning',
        title: 'Règle de prudence financière',
        text: 'Vous ne devez en aucun cas engager des capitaux dont la perte intégrale affecterait votre équilibre financier personnel ou vos obligations courantes.'
      }
    },
    {
      id: 'intelligence-artificielle',
      number: '05',
      title: 'Modèles algorithmiques & Intelligence Artificielle',
      paragraphs: [
        'Certains modules de FOREX INTEL exploitent des technologies d\'intelligence artificielle générative, de traitement automatique du langage naturel (NLP) et d\'apprentissage statistique pour agréger des dépêches économiques, synthétiser des contextes de marché ou structurer des matrices de décision.',
        'L\'utilisateur est expressément informé que les systèmes d\'intelligence artificielle peuvent produire des synthèses partielles, des approximations statistiques ou des interprétations différées en fonction de la qualité et de la disponibilité des flux en amont.',
        'Les scores de confiance, probabilités d\'orientation ou résumés de sentiment générés par l\'IA constituent des aides à la réflexion technique et ne doivent jamais être substitués au jugement critique personnel de l\'utilisateur.'
      ]
    },
    {
      id: 'donnees-marche',
      number: '06',
      title: 'Flux de données de marché & Précision indicative',
      paragraphs: [
        'Les cours, cotations de paires de devises, carnets, spreads et calendriers économiques affichés sur l\'interface proviennent de fournisseurs de données tiers indépendants.',
        'Bien que FOREX INTEL s\'efforce de sélectionner des flux d\'information de haute qualité, les cotations peuvent être sujettes à des décalages temporels (latence), des écarts de liquidité ou des interruptions momentanées.',
        'Les données sont présentées à titre indicatif et ne constituent pas une garantie d\'exécution au cours affiché lors de l\'envoi d\'un ordre vers un courtier externe.'
      ]
    },
    {
      id: 'comptes-trading-integrations',
      number: '07',
      title: 'Comptes de trading & Intégrations tierces',
      paragraphs: [
        'La Plateforme propose des connecteurs permettant d\'interfacer le logiciel avec les plateformes de trading tierces de l\'utilisateur (telles que MetaTrader 5).',
        'Concernant ces intégrations :',
        '• FOREX INTEL opère uniquement en qualité de passerelle logicielle cliente ou de pont d\'instruction selon le mode configuré par l\'utilisateur ;',
        '• L\'utilisateur garantit détenir l\'ensemble des autorisations, droits d\'accès et mandats nécessaires pour connecter ses comptes de trading ;',
        '• La bonne transmission et l\'exécution finale des ordres demeurent tributaires de la disponibilité de la connexion réseau, de l\'infrastructure du courtier et des conditions de liquidité du marché ;',
        '• Aucune intégration technique ne garantit une exécution sans slippage (glissement de cours) ou sans rejet d\'ordre par le courtier tiers.'
      ],
      callout: {
        type: 'info',
        title: 'Indépendance vis-à-vis des courtiers',
        text: 'FOREX INTEL ne sponsorise, ne cautionne et n\'est lié par aucun accord d\'exclusivité avec un courtier particulier. Aucune mention d\'un outil tiers ne constitue une recommandation commerciale.'
      }
    },
    {
      id: 'automatisation',
      number: '08',
      title: 'Paramètres d\'automatisation & Garde-fous de risque',
      paragraphs: [
        'La Plateforme intègre une gradation de modes d\'automatisation allant de l\'analyse pure jusqu\'à l\'exécution assistée ou programmée, strictement soumise aux garde-fous quantitatifs définis par l\'utilisateur.',
        'L\'utilisateur conserve le contrôle direct des paramètres critiques :',
        '• Pourcentage maximal de capital risqué par position ;',
        '• Seuil de perte journalière maximale (Max Daily Loss) avec arrêt d\'urgence des transmissions ;',
        '• Nombre maximal d\'expositions simultanées et sélection restrictive des paires de devises autorisées ;',
        '• Option d\'exiger une validation humaine explicite (Confirmation Manuelle) avant tout routage d\'instruction.',
        'L\'activation de tout mode d\'automatisation ou de semi-automatisation relève de l\'entière responsabilité de l\'utilisateur et n\'emporte aucune garantie de rendement.'
      ]
    },
    {
      id: 'responsabilites-utilisateur',
      number: '09',
      title: 'Responsabilités & Obligations de l\'utilisateur',
      paragraphs: [
        'En utilisant le Service, l\'utilisateur s\'engage à :',
        '• Fournir des informations véridiques, exactes et à jour lors de la création de son compte et de ses paramétrages ;',
        '• Préserver la stricte confidentialité de ses identifiants de connexion et de ses clés d\'accès sécurisées ;',
        '• Ne pas tenter de contourner les limites techniques, de décompiler les algorithmes ou d\'exploiter des vulnérabilités logicielles ;',
        '• Veiller à ce que son utilisation du logiciel soit en totale conformité avec la législation financière, fiscale et réglementaire de son pays de résidence fiscale et d\'établissement.'
      ]
    },
    {
      id: 'disponibilite-service',
      number: '10',
      title: 'Disponibilité, maintenance & Évolutions',
      paragraphs: [
        'FOREX INTEL s\'efforce d\'assurer une disponibilité optimale de son infrastructure SaaS. Toutefois, l\'accès à la Plateforme peut être temporairement interrompu pour des motifs de maintenance programmée, de mises à jour correctives ou d\'améliorations fonctionnelles.',
        'Compte tenu de la nature des réseaux de télécommunication et des services cloud mondiaux, FOREX INTEL ne souscrit aucune obligation de disponibilité ininterrompue de 100% (zéro temps d\'arrêt).',
        'L\'utilisateur est invité à disposer de solutions de repli (accès direct au terminal de son courtier) pour gérer ses positions en cas d\'aléa technique externe.'
      ]
    },
    {
      id: 'propriete-intellectuelle',
      number: '11',
      title: 'Propriété intellectuelle',
      paragraphs: [
        'L\'ensemble des éléments constitutifs de la Plateforme, comprenant sans limitation les marques, logos, chartes graphiques, codes sources, architectures logicielles, algorithmes d\'analyse, documentations et interfaces utilisateurs, est la propriété exclusive de FOREX INTEL ou de ses concédants de licence.',
        'L\'inscription confère à l\'utilisateur un droit d\'accès et d\'utilisation personnel, non exclusif, non transférable et révocable, strictement limité à l\'usage de la Plateforme pour ses propres besoins d\'analyse de trading.',
        'Toute reproduction, rétro-ingénierie, extraction automatisée de données (scraping) ou commercialisation non autorisée de tout ou partie du Service est formellement prohibée.'
      ]
    },
    {
      id: 'services-tiers',
      number: '12',
      title: 'Services, API & Bibliothèques tierces',
      paragraphs: [
        'La Plateforme peut interagir avec des services tiers, notamment des fournisseurs d\'infrastructures cloud, des serveurs d\'actualités financières et des protocoles de connexion de plateformes de trading.',
        'L\'utilisation de ces services externes est soumise aux conditions contractuelles, conditions générales et politiques de confidentialité respectives de ces tiers.',
        'FOREX INTEL décline toute responsabilité quant au fonctionnement continu, aux pannes ou aux modifications unilatérales imposées par ces fournisseurs externes.'
      ]
    },
    {
      id: 'suspension-resiliation',
      number: '13',
      title: 'Suspension, limitation & Résiliation',
      paragraphs: [
        'FOREX INTEL se réserve le droit de restreindre, suspendre temporairement ou résilier l\'accès au compte d\'un utilisateur en cas de manquement caractérisé aux présentes Conditions d\'Utilisation, de tentative d\'atteinte à la sécurité du système ou d\'utilisation frauduleuse avérée.',
        'L\'utilisateur peut à tout moment demander la clôture de son compte et l\'interruption de son abonnement conformément aux modalités prévues dans son espace de gestion.'
      ]
    },
    {
      id: 'modification-conditions',
      number: '14',
      title: 'Modification des conditions d\'utilisation',
      paragraphs: [
        'Les présentes Conditions d\'Utilisation peuvent faire l\'objet de modifications régulières afin de refléter l\'évolution des fonctionnalités du Service, les exigences réglementaires ou les impératifs de sécurité.',
        'En cas de mise à jour substantielle, les utilisateurs en seront informés par une notification au sein de la Plateforme ou par e-mail avec mention de la date de prise d\'effet.',
        'La poursuite de l\'utilisation de FOREX INTEL après l\'entrée en vigueur des conditions modifiées vaut acceptation tacite des nouveaux termes.'
      ]
    },
    {
      id: 'droit-juridiction',
      number: '15',
      title: 'Droit applicable & Attribution de juridiction',
      paragraphs: [
        'Les présentes conditions, leur formation, leur exécution et leur interprétation sont régies et soumises aux principes légaux de la juridiction de constitution de la société exploitante.',
        'En cas de différend ou de litige survenant à l\'occasion de l\'utilisation de la Plateforme, les parties s\'engagent à rechercher préalablement une solution amiable de bonne foi.'
      ],
      callout: {
        type: 'placeholder',
        title: 'Clause de juridiction territoriale',
        text: `${LEGAL_CONFIG.jurisdiction} — Cette clause d'attribution de compétence et de droit applicable sera formellement arrêtée et complétée lors de la phase finale d'immatriculation et de qualification juridique avant toute commercialisation.`
      }
    },
    {
      id: 'contact',
      number: '16',
      title: 'Contact & Assistance',
      paragraphs: [
        'Pour toute question, demande de précision ou notification relative aux présentes Conditions d\'Utilisation ou au fonctionnement de la Plateforme, vous pouvez joindre l\'équipe de support technique aux coordonnées ci-après :'
      ],
      callout: {
        type: 'placeholder',
        title: 'Coordonnées de contact',
        text: `Support & Relation Utilisateurs : ${LEGAL_CONFIG.contactEmail} | Entité exploitante : ${LEGAL_CONFIG.companyName}`
      }
    }
  ]
};
