import React from 'react';

export default function LegalNotice() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Mentions légales
      </h1>

      <div className="prose prose-indigo">
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            1. Informations légales
          </h2>
          <p className="text-gray-600 mb-4">
            Pixmock est édité par :
          </p>
          <ul className="list-disc pl-6 text-gray-600 space-y-2">
            <li>Raison sociale : Pixmock SAS</li>
            <li>Siège social : 123 Avenue des Champs-Élysées, 75008 Paris</li>
            <li>SIRET : 123 456 789 00012</li>
            <li>Capital social : 10 000€</li>
            <li>Directeur de la publication : John Doe</li>
            <li>Email : contact@pixmock.com</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            2. Hébergement
          </h2>
          <p className="text-gray-600">
            Le site Pixmock est hébergé par :
          </p>
          <ul className="list-disc pl-6 text-gray-600 space-y-2">
            <li>Raison sociale : Netlify, Inc.</li>
            <li>Adresse : 2325 3rd Street, Suite 215, San Francisco, CA 94107</li>
            <li>Site web : www.netlify.com</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            3. Propriété intellectuelle
          </h2>
          <p className="text-gray-600 mb-4">
            L'ensemble du contenu du site Pixmock (logos, textes, éléments graphiques, vidéos, etc.) est protégé par le droit d'auteur et le droit des marques.
          </p>
          <p className="text-gray-600">
            Toute reproduction ou représentation totale ou partielle de ce site par quelque procédé que ce soit, sans autorisation expresse, est interdite et constituerait une contrefaçon sanctionnée par les articles L.335-2 et suivants du Code de la propriété intellectuelle.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            4. Protection des données personnelles
          </h2>
          <p className="text-gray-600">
            Conformément à la loi "Informatique et Libertés" du 6 janvier 1978 modifiée et au Règlement Général sur la Protection des Données (RGPD), vous disposez d'un droit d'accès, de rectification et de suppression de vos données. Pour exercer ce droit, veuillez nous contacter à l'adresse : contact@pixmock.com
          </p>
        </section>
      </div>
    </div>
  );
}