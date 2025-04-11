import React from 'react';

export default function PrivacyPolicy() {
  return (
    <div className="max-w-4xl">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Politique de Confidentialité
      </h1>

      <div className="prose prose-indigo">
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            1. Introduction
          </h2>
          <p className="text-gray-600 mb-4">
            Chez Pixmock, nous accordons une grande importance à la protection de vos données personnelles. Cette politique de confidentialité explique comment nous collectons, utilisons, partageons et protégeons vos informations lorsque vous utilisez notre plateforme complète de print-on-demand.
          </p>
          <p className="text-gray-600">
            En utilisant Pixmock, vous acceptez les pratiques décrites dans cette politique de confidentialité. Si vous n'acceptez pas ces pratiques, veuillez ne pas utiliser notre service.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            2. Collecte des données
          </h2>
          <p className="text-gray-600 mb-4">
            Nous collectons les données suivantes :
          </p>
          <ul className="list-disc pl-6 text-gray-600 space-y-2">
            <li><strong>Informations d'identification</strong> : nom, prénom, adresse email, adresse postale, numéro de téléphone</li>
            <li><strong>Informations de paiement</strong> : via notre prestataire Stripe (nous ne stockons pas vos données de carte bancaire)</li>
            <li><strong>Données d'utilisation</strong> : statistiques d'utilisation du service, historique des générations, préférences</li>
            <li><strong>Contenu utilisateur</strong> : designs uploadés, mockups générés, produits créés</li>
            <li><strong>Informations de connexion</strong> : adresse IP, type de navigateur, appareil utilisé, pages visitées</li>
            <li><strong>Données d'authentification</strong> : tokens d'accès pour les plateformes connectées (Pinterest, Shopify, Etsy)</li>
            <li><strong>Informations organisationnelles</strong> : nom de l'entreprise, logo, informations de facturation</li>
            <li><strong>Données commerciales</strong> : historique des commandes, statistiques de vente, performance des produits</li>
            <li><strong>Informations clients</strong> : données des clients finaux pour le traitement des commandes</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            3. Utilisation des données
          </h2>
          <p className="text-gray-600 mb-4">
            Vos données sont utilisées pour :
          </p>
          <ul className="list-disc pl-6 text-gray-600 space-y-2">
            <li>Fournir, maintenir et améliorer nos services</li>
            <li>Gérer votre compte et vos abonnements</li>
            <li>Traiter vos paiements et commandes</li>
            <li>Vous contacter concernant votre compte, vos commandes ou pour le support client</li>
            <li>Vous envoyer des informations techniques, des mises à jour et des alertes de sécurité</li>
            <li>Personnaliser votre expérience utilisateur</li>
            <li>Analyser l'utilisation du service pour l'améliorer</li>
            <li>Détecter et prévenir les activités frauduleuses</li>
            <li>Faciliter l'intégration avec les plateformes tierces (Pinterest, Shopify, Etsy)</li>
            <li>Traiter les commandes d'impression via nos partenaires</li>
            <li>Générer des fiches produits optimisées pour les plateformes de vente</li>
            <li>Analyser les performances de vos produits et fournir des statistiques</li>
            <li>Automatiser la publication sur les réseaux sociaux</li>
            <li>Respecter nos obligations légales</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            4. Traitement des données clients finaux
          </h2>
          <p className="text-gray-600 mb-4">
            Dans le cadre de notre service de print-on-demand, nous traitons également les données des clients finaux qui achètent vos produits :
          </p>
          <ul className="list-disc pl-6 text-gray-600 space-y-2">
            <li>Noms et coordonnées pour la livraison</li>
            <li>Adresses email pour les communications relatives aux commandes</li>
            <li>Détails des commandes et préférences d'achat</li>
            <li>Informations de paiement (traitées par nos prestataires de paiement sécurisés)</li>
          </ul>
          <p className="text-gray-600 mt-4">
            En tant qu'utilisateur de notre plateforme, vous êtes responsable d'informer vos clients finaux de ce traitement de données et d'obtenir leur consentement conformément aux réglementations applicables.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            5. Partage des données
          </h2>
          <p className="text-gray-600 mb-4">
            Nous pouvons partager vos données avec :
          </p>
          <ul className="list-disc pl-6 text-gray-600 space-y-2">
            <li><strong>Nos prestataires de services</strong> : hébergement, paiement, impression, livraison</li>
            <li><strong>Partenaires d'intégration</strong> : plateformes de réseaux sociaux et de e-commerce (avec votre autorisation)</li>
            <li><strong>Partenaires d'impression</strong> : pour la production et l'expédition des commandes</li>
            <li><strong>Services logistiques</strong> : pour le suivi et la livraison des commandes</li>
            <li><strong>Autorités légales</strong> : en cas d'obligation légale ou pour protéger nos droits</li>
          </ul>
          <p className="text-gray-600 mt-4">
            Nous ne vendons jamais vos données personnelles à des tiers.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            6. Conservation des données
          </h2>
          <p className="text-gray-600 mb-4">
            Nous conservons vos données personnelles tant que votre compte est actif ou nécessaire pour vous fournir nos services.
          </p>
          <p className="text-gray-600 mb-4">
            Spécificités de conservation :
          </p>
          <ul className="list-disc pl-6 text-gray-600 space-y-2">
            <li>Les designs uploadés sont temporairement stockés pour la génération des mockups, puis automatiquement supprimés après 30 jours</li>
            <li>Les mockups générés sont conservés dans votre compte tant que celui-ci est actif</li>
            <li>Les informations de commande sont conservées conformément aux obligations légales (10 ans pour les documents comptables)</li>
            <li>Les tokens d'accès aux plateformes tierces sont conservés jusqu'à révocation de votre part</li>
            <li>Les données des clients finaux sont conservées pendant la durée nécessaire au traitement des commandes et conformément aux obligations légales</li>
            <li>Les statistiques de vente sont conservées pendant toute la durée de votre compte</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            7. Sécurité des données
          </h2>
          <p className="text-gray-600 mb-4">
            Nous mettons en œuvre des mesures de sécurité appropriées pour protéger vos données contre tout accès, modification, divulgation ou destruction non autorisés :
          </p>
          <ul className="list-disc pl-6 text-gray-600 space-y-2">
            <li>Chiffrement des données sensibles</li>
            <li>Protocoles HTTPS pour toutes les communications</li>
            <li>Accès restreint aux données personnelles</li>
            <li>Surveillance continue des systèmes</li>
            <li>Mises à jour régulières de sécurité</li>
            <li>Authentification sécurisée pour les intégrations avec les plateformes tierces</li>
            <li>Audits réguliers de sécurité</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            8. Intégrations avec des plateformes tierces
          </h2>
          <p className="text-gray-600 mb-4">
            Pixmock propose des intégrations complètes avec plusieurs plateformes tierces :
          </p>
          <ul className="list-disc pl-6 text-gray-600 space-y-2">
            <li><strong>Pinterest</strong> : pour la programmation de publications et la promotion des produits</li>
            <li><strong>Shopify</strong> : pour la gestion des produits, la synchronisation des commandes et le traitement des paiements</li>
            <li><strong>Etsy</strong> : pour la gestion des produits, la synchronisation des commandes et le traitement des paiements</li>
          </ul>
          <p className="text-gray-600 mt-4">
            Ces intégrations nécessitent votre autorisation explicite et impliquent le partage de certaines données entre Pixmock et ces plateformes. Vous pouvez révoquer ces autorisations à tout moment depuis vos paramètres.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            9. Traitement des données pour le print-on-demand
          </h2>
          <p className="text-gray-600 mb-4">
            Dans le cadre de notre service de print-on-demand, nous traitons des données spécifiques :
          </p>
          <ul className="list-disc pl-6 text-gray-600 space-y-2">
            <li>Designs et fichiers d'impression</li>
            <li>Spécifications des produits (tailles, matériaux, etc.)</li>
            <li>Informations de tarification et de marge</li>
            <li>Adresses de livraison des clients finaux</li>
            <li>Préférences d'emballage et d'expédition</li>
            <li>Données de suivi des colis</li>
          </ul>
          <p className="text-gray-600 mt-4">
            Ces données sont partagées avec nos partenaires d'impression uniquement dans la mesure nécessaire pour traiter les commandes.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            10. Vos droits
          </h2>
          <p className="text-gray-600 mb-4">
            Conformément au RGPD, vous disposez des droits suivants :
          </p>
          <ul className="list-disc pl-6 text-gray-600 space-y-2">
            <li><strong>Droit d'accès</strong> : consulter les données que nous détenons sur vous</li>
            <li><strong>Droit de rectification</strong> : modifier ou mettre à jour vos données</li>
            <li><strong>Droit à l'effacement</strong> : demander la suppression de vos données</li>
            <li><strong>Droit à la limitation du traitement</strong> : restreindre l'utilisation de vos données</li>
            <li><strong>Droit à la portabilité</strong> : recevoir vos données dans un format structuré</li>
            <li><strong>Droit d'opposition</strong> : vous opposer au traitement de vos données</li>
            <li><strong>Droit de retirer votre consentement</strong> à tout moment</li>
          </ul>
          <p className="text-gray-600 mt-4">
            Pour exercer ces droits, contactez-nous à privacy@pixmock.com.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            11. Transferts internationaux de données
          </h2>
          <p className="text-gray-600">
            Pixmock peut transférer vos données vers des serveurs situés en dehors de votre pays de résidence, notamment aux États-Unis et dans d'autres pays où sont situés nos partenaires d'impression. Nous nous assurons que ces transferts respectent les réglementations applicables en matière de protection des données, notamment via des clauses contractuelles types approuvées par la Commission européenne.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            12. Analyse des statistiques commerciales
          </h2>
          <p className="text-gray-600 mb-4">
            Notre plateforme collecte et analyse des données commerciales pour vous fournir des insights sur vos performances :
          </p>
          <ul className="list-disc pl-6 text-gray-600 space-y-2">
            <li>Statistiques de vente par produit, région et période</li>
            <li>Taux de conversion et performance des fiches produit</li>
            <li>Analyse des tendances et saisonnalité</li>
            <li>Suivi des marges et rentabilité</li>
            <li>Performance des campagnes marketing</li>
            <li>Comportement d'achat des clients</li>
          </ul>
          <p className="text-gray-600 mt-4">
            Ces analyses sont réalisées dans le but légitime d'améliorer votre expérience et de vous aider à optimiser votre activité commerciale.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            13. Protection des données des enfants
          </h2>
          <p className="text-gray-600">
            Nos services ne s'adressent pas aux personnes de moins de 16 ans. Nous ne collectons pas sciemment des données personnelles concernant des enfants. Si vous êtes parent ou tuteur et que vous pensez que votre enfant nous a fourni des informations, veuillez nous contacter pour que nous puissions prendre les mesures nécessaires.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            14. Modifications de la politique de confidentialité
          </h2>
          <p className="text-gray-600 mb-4">
            Nous pouvons modifier cette politique de confidentialité à tout moment. Les modifications entrent en vigueur dès leur publication sur cette page.
          </p>
          <p className="text-gray-600 mb-4">
            Nous vous informerons de tout changement important par email ou via une notification sur notre site.
          </p>
          <p className="text-gray-600">
            Pour toute question concernant cette politique de confidentialité, contactez notre délégué à la protection des données à privacy@pixmock.com.
          </p>
        </section>
      </div>
    </div>
  );
}