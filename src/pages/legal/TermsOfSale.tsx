import React from 'react';

export default function TermsOfSale() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Conditions Générales de Vente
      </h1>

      <div className="prose prose-indigo">
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            1. Prix et paiement
          </h2>
          <p className="text-gray-600 mb-4">
            Les prix sont indiqués en USD et hors taxes. La TVA applicable sera ajoutée au moment du paiement.
          </p>
          <p className="text-gray-600">
            Le paiement s'effectue par carte bancaire via notre prestataire de paiement sécurisé Stripe.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            3. Droit de rétractation
          </h2>
          <p className="text-gray-600">
            Conformément à l'article L221-28 du Code de la consommation, le droit de rétractation ne peut être exercé pour les services pleinement exécutés avant la fin du délai de rétractation et dont l'exécution a commencé après accord préalable exprès du consommateur.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            4. Service client
          </h2>
          <p className="text-gray-600">
            Pour toute question relative à votre commande, notre service client est disponible par email à contact@pixmock.com.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            5. Litiges
          </h2>
          <p className="text-gray-600 mb-4">
            En cas de litige, une solution amiable sera recherchée avant toute action judiciaire. À défaut, les tribunaux canadiens seront seuls compétents.
          </p>
        </section>
      </div>
    </div>
  );
}