import React from 'react';

export default function TermsOfService() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Conditions Générales d'Utilisation
      </h1>

      <div className="prose prose-indigo">
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            1. Objet
          </h2>
          <p className="text-gray-600">
            Les présentes Conditions Générales d'Utilisation (CGU) régissent l'utilisation du service MockupPro, accessible depuis le site web mockuppro.com. Tout accès ou utilisation du service suppose l'acceptation et le respect de l'ensemble des termes des présentes conditions.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            2. Description du service
          </h2>
          <p className="text-gray-600 mb-4">
            MockupPro est un service en ligne permettant aux utilisateurs de générer des mockups professionnels à partir de leurs designs. Le service inclut :
          </p>
          <ul className="list-disc pl-6 text-gray-600 space-y-2">
            <li>La génération de mockups en haute qualité</li>
            <li>L'accès à une bibliothèque de templates</li>
            <li>Le stockage temporaire des designs uploadés</li>
            <li>L'export des mockups générés</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            3. Compte utilisateur
          </h2>
          <p className="text-gray-600 mb-4">
            Pour utiliser le service, l'utilisateur doit créer un compte. Il s'engage à :
          </p>
          <ul className="list-disc pl-6 text-gray-600 space-y-2">
            <li>Fournir des informations exactes et à jour</li>
            <li>Maintenir la confidentialité de ses identifiants</li>
            <li>Ne pas partager son compte avec des tiers</li>
            <li>Informer immédiatement MockupPro de toute utilisation non autorisée</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            4. Propriété intellectuelle
          </h2>
          <p className="text-gray-600 mb-4">
            L'utilisateur conserve tous les droits de propriété intellectuelle sur ses designs. En utilisant le service, il garantit qu'il dispose des droits nécessaires sur les designs uploadés.
          </p>
          <p className="text-gray-600">
            Les mockups générés peuvent être utilisés conformément aux termes de la licence choisie lors de la génération.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            5. Modifications et résiliation
          </h2>
          <p className="text-gray-600 mb-4">
            MockupPro se réserve le droit de modifier ces CGU à tout moment. Les utilisateurs seront informés des modifications par email ou via le site.
          </p>
          <p className="text-gray-600">
            MockupPro peut suspendre ou résilier un compte en cas de violation des présentes CGU, sans préavis ni remboursement.
          </p>
        </section>
      </div>
    </div>
  );
}