import { LegalDocument } from '../models/legal.model';
import { LEGAL_CONFIG } from './legal-config';

export const PRIVACY_DOCUMENT: LegalDocument = {
  id: 'privacy-policy',
  title: 'Politique de confidentialité',
  subtitle: 'Cette politique explique de manière générale comment les données personnelles peuvent être collectées, traitées et protégées dans le cadre de l\'utilisation de Forex Intel.',
  lastUpdated: LEGAL_CONFIG.lastUpdatedDate,
  effectiveDate: LEGAL_CONFIG.effectiveDate,
  draftNotice: LEGAL_CONFIG.noticeDisclaimer,
  sections: [
    {
      id: 'introduction',
      number: '01',
      title: 'Introduction & Portée',
      paragraphs: [
        'La protection des données personnelles et le respect de la vie privée constituent un engagement essentiel pour FOREX INTEL. La présente Politique de Confidentialité a pour objet d\'exposer de façon claire, transparente et loyale les modalités selon lesquelles vos données peuvent être recueillies, traitées, sécurisées et conservées lors de votre navigation sur notre site et lors de l\'utilisation de nos services SaaS.',
        'La Plateforme s\'engage à appliquer des pratiques rigoureuses de minimisation des données, en ne traitant que les éléments strictement nécessaires au fonctionnement technique, à la configuration de vos critères de trading et à la sécurité de votre compte.',
        'La présente politique s\'adresse à tout utilisateur, visiteur ou représentant d\'entité accédant aux interfaces de FOREX INTEL.'
      ]
    },
    {
      id: 'donnees-collectees',
      number: '02',
      title: 'Catégories de données susceptibles d\'être traitées',
      paragraphs: [
        'Selon les fonctionnalités que vous activez et le degré d\'interaction avec la Plateforme, FOREX INTEL est susceptible de traiter les catégories d\'informations suivantes :'
      ],
      subsections: [
        {
          title: 'A. Données de compte & d\'identification',
          content: [
            '• Prénom et nom de famille ;',
            '• Adresse de courrier électronique (e-mail) valide ;',
            '• Mot de passe chiffré (hashé de manière unidirectionnelle, inaccessible en clair) ;',
            '• Préférences de langue, fuseau horaire de référence et état de validation du compte.'
          ]
        },
        {
          title: 'B. Données d\'utilisation & Télémétrie technique',
          content: [
            '• Données de connexion, adresses IP tronquées ou anonymisées, horodatages d\'accès ;',
            '• Type de terminal, version du navigateur et identifiants techniques de session nécessaires au maintien de la connexion sécurisée ;',
            '• Données de navigation interne et logs d\'erreurs techniques pour le diagnostic de performance.'
          ]
        },
        {
          title: 'C. Données de configuration & Paramètres de risque',
          content: [
            '• Paires de devises sélectionnées pour la surveillance (ex. EUR/USD, GBP/JPY) ;',
            '• Règles de gestion du risque configurées (seuil de perte par trade, limite journalière, exposition cumulée) ;',
            '• Niveau d\'automatisation souhaité et état d\'activation de la confirmation manuelle ;',
            '• Historique des simulations ou des alertes de marché générées au sein de l\'interface.'
          ]
        }
      ],
      callout: {
        type: 'info',
        title: 'Principe de proportionnalité',
        text: 'FOREX INTEL ne collecte aucune donnée financière sensible relative à vos cartes bancaires sur ses serveurs applicatifs. Les transactions d\'abonnement éventuelles sont déléguées à des prestataires de paiement tiers certifiés PCI-DSS.'
      }
    },
    {
      id: 'donnees-sensibles-integrations',
      number: '03',
      title: 'Identifiants de services tiers & Sécurité des passerelles',
      paragraphs: [
        'Dans le cadre de l\'interconnexion future avec vos terminaux de trading externes (tels que MetaTrader 5) :',
        '• FOREX INTEL privilégie des architectures techniques minimisant la détention de secrets d\'accès, s\'appuyant sur des tokens d\'API sécurisés, des certificats délégués ou des agents d\'exécution locaux isolés ;',
        '• La Plateforme ne sollicite jamais et ne stocke en aucun cas vos mots de passe de gestion de compte bancaire personnel ou d\'accès au portail client de votre courtier ;',
        '• Les spécifications techniques finales de chiffrement des secrets de pont de trading seront publiées et documentées de manière détaillée lors de l\'ouverture de chaque intégration spécifique en production.'
      ]
    },
    {
      id: 'finalites-traitement',
      number: '04',
      title: 'Finalités des traitements de données',
      paragraphs: [
        'Les données recueillies par FOREX INTEL sont traitées pour des objectifs précis et légitimes, incluant notamment :',
        '• La fourniture, l\'administration et l\'exécution des fonctionnalités logicielles de la Plateforme ;',
        '• L\'individualisation de vos tableaux de bord, calculs de risque et synthèses macroéconomiques ;',
        '• La gestion de la sécurité des accès, la prévention des fraudes et la détection d\'activités suspectes ;',
        '• L\'envoi de notifications opérationnelles indispensables (alertes de marché paramétrées, réinitialisation de mot de passe) ;',
        '• L\'assistance technique et le support client en réponse à vos sollicitations ;',
        '• Le respect des obligations légales, réglementaires et comptables applicables à l\'éditeur.'
      ]
    },
    {
      id: 'bases-juridiques',
      number: '05',
      title: 'Bases juridiques des traitements',
      paragraphs: [
        'Les opérations de traitement effectuées par FOREX INTEL reposent sur les fondements juridiques reconnus par le droit applicable à la protection des données, notamment :',
        '• L\'exécution du contrat ou des mesures précontractuelles (création du compte, fourniture du service SaaS, respect des conditions d\'utilisation) ;',
        '• L\'intérêt légitime de FOREX INTEL (sécurisation des systèmes, prévention des attaques informatiques, amélioration de la fiabilité logicielle) ;',
        '• Le respect des obligations légales incombant à l\'éditeur du service ;',
        '• Le consentement explicite de l\'utilisateur lorsque celui-ci est spécifiquement requis par la loi.'
      ],
      callout: {
        type: 'placeholder',
        title: 'Validation des bases réglementaires',
        text: `${LEGAL_CONFIG.legalBasisNote} — Les fondements précis seront alignés formellement avec le Règlement Général sur la Protection des Données (RGPD / GDPR) ou les réglementations nationales équivalentes lors de l'audit pré-production.`
      }
    },
    {
      id: 'conservation-donnees',
      number: '06',
      title: 'Durée de conservation des données',
      paragraphs: [
        'FOREX INTEL conserve vos données personnelles uniquement pendant la durée strictement nécessaire à l\'accomplissement des finalités pour lesquelles elles ont été collectées :',
        '• Données de compte actif : conservées pendant toute la durée de la relation contractuelle et d\'utilisation active du service ;',
        '• Données de compte résilié ou inactif : conservées pour une durée transitoire définie avant suppression définitive ou anonymisation irréversible, sous réserve des délais de prescription légale ou d\'obligations d\'archivage probatoire ;',
        '• Logs techniques et journaux de sécurité : conservés pour des périodes tournantes conformes aux recommandations de cybersécurité.'
      ]
    },
    {
      id: 'partage-donnees',
      number: '07',
      title: 'Destinataires & Partage encadré des données',
      paragraphs: [
        'FOREX INTEL ne commercialise, ne loue, ne cède et ne vend aucune de vos données personnelles à des tiers à des fins publicitaires ou de prospection commerciale.',
        'Les données peuvent être transmises de façon strictement encadrée aux catégories de destinataires suivantes :',
        '• Nos sous-traitants techniques et prestataires de services informatiques (hébergeurs d\'infrastructure cloud sécurisée, services d\'envoi d\'e-mails transactionnels, outils de monitoring) intervenant sous engagement contractuel strict de confidentialité ;',
        '• Les autorités administratives ou judiciaires compétentes, uniquement en cas de réquisition légale formelle ou d\'obligation légale impérative.'
      ]
    },
    {
      id: 'transferts-internationaux',
      number: '08',
      title: 'Transferts internationaux de données',
      paragraphs: [
        'Dans l\'hypothèse où certains sous-traitants techniques opèrent des centres de traitement situés en dehors de l\'Espace Économique Européen ou de votre juridiction de résidence, FOREX INTEL veille à ce que ces transferts soient assortis de garanties appropriées.',
        'Ces garanties comprennent le recours à des pays reconnus comme assurant un niveau de protection adéquat, ou la signature de Clauses Contractuelles Types approuvées par les autorités compétentes, complétées par des mesures techniques de chiffrement adaptées.'
      ]
    },
    {
      id: 'securite-mesures',
      number: '09',
      title: 'Mesures de sécurité & Confidentialité',
      paragraphs: [
        'FOREX INTEL met en œuvre un ensemble de mesures organisationnelles, logiques et physiques proportionnées afin de protéger l\'intégrité, la disponibilité et la confidentialité de vos données personnelles contre tout accès non autorisé, altération, divulgation ou destruction.',
        'Ces mesures incluent le chiffrement des communications réseau via le protocole TLS/HTTPS, le hachage robuste des mots de passe, l\'isolation des environnements de calcul et la restriction stricte des accès administratifs au principe du moindre privilège.',
        'Toutefois, compte tenu des caractéristiques inhérentes au réseau Internet et aux menaces informatiques contemporaines, aucun système informatique ne peut offrir une garantie de sécurité absolue ou invulnérable.'
      ]
    },
    {
      id: 'droits-utilisateurs',
      number: '10',
      title: 'Vos droits concernant vos données',
      paragraphs: [
        'Conformément aux réglementations relatives à la protection des données personnelles applicables à votre situation, vous disposez d\'un ensemble de prérogatives :',
        '• Droit d\'accès : obtenir confirmation que vos données sont traitées et en obtenir communication ;',
        '• Droit de rectification : demander la mise à jour ou la correction de données inexactes ou incomplètes ;',
        '• Droit à l\'effacement (« droit à l\'oubli ») : solliciter la suppression de vos données personnelles lorsque les motifs légaux sont réunis ;',
        '• Droit à la limitation du traitement : demander le gel temporaire du traitement de vos données dans certaines circonstances ;',
        '• Droit à la portabilité : recevoir les données fournies dans un format structuré, couramment utilisé et lisible par machine ;',
        '• Droit d\'opposition : vous opposer à tout moment, pour des motifs légitimes, au traitement de vos données personnelles.'
      ],
      callout: {
        type: 'info',
        title: 'Exercice de vos droits',
        text: 'Vous pouvez exercer l\'ensemble de ces droits en adressant une demande écrite accompagnée des justificatifs nécessaires à notre référent protection des données via le formulaire ou l\'adresse de contact dédiée.'
      }
    },
    {
      id: 'cookies-traceurs',
      number: '11',
      title: 'Cookies, jetons de session & Traceurs',
      paragraphs: [
        'La Plateforme utilise des identifiants techniques et des jetons d\'authentification de session indispensables pour sécuriser votre connexion, mémoriser votre état de connexion et protéger l\'interface contre les attaques de type Cross-Site Request Forgery (CSRF).',
        'Aucun cookie tiers à finalité de ciblage publicitaire intrusif n\'est déposé sur votre terminal sans information préalable.',
        'Une politique spécifique de gestion des cookies et un module de consentement granulaire pourront être intégrés et déployés en fonction des outils analytiques retenus lors de la mise en exploitation finale.'
      ]
    },
    {
      id: 'modifications-politique',
      number: '12',
      title: 'Évolution de la politique de confidentialité',
      paragraphs: [
        'FOREX INTEL se réserve la faculté d\'actualiser la présente Politique de Confidentialité afin de refléter l\'évolution des pratiques de traitement des données, le déploiement de nouveaux modules d\'analyse ou les modifications législatives.',
        'La date de dernière mise à jour figurant en tête de ce document sera modifiée en conséquence.',
        'Nous vous invitons à consulter régulièrement cette page pour vous tenir informé des modalités de protection de vos données.'
      ]
    },
    {
      id: 'contact-dpo',
      number: '13',
      title: 'Contact pour la protection des données',
      paragraphs: [
        'Pour toute question relative à la présente Politique de Confidentialité, pour exercer vos droits individuels ou pour échanger avec notre équipe responsable de la conformité des données personnelles, vous pouvez nous contacter :'
      ],
      callout: {
        type: 'placeholder',
        title: 'Délégué / Référent à la Protection des Données',
        text: `Courriel dédié à la protection des données : ${LEGAL_CONFIG.privacyEmail} | Société : ${LEGAL_CONFIG.companyName}`
      }
    }
  ]
};
