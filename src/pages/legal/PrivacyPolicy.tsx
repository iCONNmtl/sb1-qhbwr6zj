import React from 'react';

export default function PrivacyPolicy() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Politique de Confidentialité
      </h1>

      <div className="prose prose-indigo">
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            1. Collecte des données
          </h2>
          <p className="text-gray-600 mb-4">
            Nous collectons les données suivantes :
          </p>
          <ul className="list-disc pl-6 text-gray-600 space-y-2">
            <li>Informations d'identification (nom, email)</li>
            <li>Données de paiement (via notre prestataire Stripe)</li>
            <li>Données d'utilisation du service</li>
            <li>Designs uploadés pour la génération de mockups</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            2. Utilisation des données
          </h2>
          <p className="text-gray-600 mb-4">
            Vos données sont utilisées pour :
          </p>
          <ul className="list-disc pl-6 text-gray-600 space-y-2">
            <li>Fournir et améliorer nos services</li>
            <li>Gérer votre compte et vos abonnements</li>
            <li>Vous contacter concernant votre compte</li>
            <li>Analyser l'utilisation du service</li>
            <li>Respecter nos obligations légales</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            3. Conservation des données
          </h2>
          <p className="text-gray-600 mb-4">
            Nous conservons vos données personnelles tant que votre compte est actif ou nécessaire pour vous fournir nos services.
          </p>
          <p className="text-gray-600">
            Les designs uploadés sont automatiquement supprimés après la génération des mockups.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            4. Vos droits
          </h2>
          <p className="text-gray-600 mb-4">
            Conformément au RGPD, vous disposez des droits suivants :
          </p>
          <ul className="list-disc pl-6 text-gray-600 space-y-2">
            <li>Droit d'accès à vos données</li>
            <li>Droit de rectification</li>
            <li>Droit à l'effacement</li>
            <li>Droit à la limitation du traitement</li>
            <li>Droit à la portabilité des données</li>
            <li>Droit d'opposition</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            5. Contact
          </h2>
          <p className="text-gray-600">
            Pour toute question concernant vos données personnelles ou pour exercer vos droits, contactez notre délégué à la protection des données à privacy@mockuppro.com
          </p>
        </section>
      </div>
    </div>
  );
}