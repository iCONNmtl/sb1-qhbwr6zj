import React, { useState } from 'react';
import { ChevronDown, HelpCircle, ChevronUp, Link } from 'lucide-react';
import clsx from 'clsx';

// FAQ items
const FAQ_ITEMS = [
  {
    question: "Comment fonctionnent les crédits ?",
    answer: "Chaque génération de mockup consomme un certain nombre de crédits. Les crédits sont disponibles immédiatement après l'achat et n'expirent jamais. Vous pouvez les utiliser à votre rythme, sans contrainte de temps."
  },
  {
    question: "Quelle est la différence entre les packs et l'abonnement ?",
    answer: "Les packs de crédits sont des achats uniques sans engagement, idéaux pour une utilisation ponctuelle. L'abonnement Expert offre un renouvellement mensuel automatique de 500 crédits, parfait pour une utilisation régulière."
  },
  {
    question: "Puis-je acheter plusieurs packs ?",
    answer: "Oui, vous pouvez acheter autant de packs que vous le souhaitez. Les crédits s'accumulent dans votre compte et sont utilisés selon vos besoins."
  },
  {
    question: "Comment fonctionne le paiement ?",
    answer: "Le paiement est sécurisé via Stripe. Vous pouvez payer par carte bancaire. Les packs sont activés instantanément après le paiement, tandis que l'abonnement Expert est renouvelé automatiquement chaque mois."
  },
  {
    question: "Les crédits expirent-ils ?",
    answer: "Non, les crédits achetés via les packs n'expirent jamais. Vous pouvez les utiliser à votre rythme. Pour l'abonnement Expert, vous recevez 500 nouveaux crédits chaque mois."
  },
  {
    question: "Puis-je me faire rembourser ?",
    answer: "Les crédits non utilisés peuvent être remboursés dans les 14 jours suivant l'achat, conformément à nos conditions générales de vente. L'abonnement Expert peut être annulé à tout moment."
  },
  {
    question: "Y a-t-il des frais cachés ?",
    answer: "Non, le prix affiché est le prix final. Pas d'abonnement caché, pas de frais supplémentaires. Vous ne payez que ce que vous achetez."
  },
  {
    question: "Comment utiliser mes crédits ?",
    answer: "Vos crédits sont automatiquement déduits lorsque vous générez des mockups, achetez des formations premium ou traitez des commandes. Vous pouvez suivre votre solde de crédits dans votre tableau de bord."
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="bg-white rounded-2xl shadow-md p-8">
      <div className="text-center mb-12">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
          Questions fréquentes
        </h2>
        <p className="text-lg text-gray-600">
          Tout ce que vous devez savoir sur nos produits d'impression
        </p>
      </div>

      <div className="max-w-3xl mx-auto divide-y divide-gray-200">
        {FAQ_ITEMS.map((item, index) => (
          <div key={index} className="py-6">
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="flex w-full items-start justify-between text-left"
            >
              <span className="text-lg font-medium text-gray-900">
                {item.question}
              </span>
              <span className="ml-6 flex-shrink-0">
                {openIndex === index ? (
                  <ChevronUp className="h-6 w-6 text-indigo-500" />
                ) : (
                  <ChevronDown className="h-6 w-6 text-indigo-500" />
                )}
              </span>
            </button>
            <div
              className={clsx(
                'mt-2 pr-12 transition-all duration-300',
                openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
              )}
            >
              <p className="text-base text-gray-600">
                {item.answer}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Support CTA */}
      <div className="mt-12 text-center">
        <p className="text-gray-600">
          Vous ne trouvez pas la réponse à votre question ?{' '}
          <Link to="/contact" className="text-indigo-600 hover:text-indigo-500 font-medium">
            Contactez notre support
          </Link>
        </p>
      </div>
    </div>
  );
}