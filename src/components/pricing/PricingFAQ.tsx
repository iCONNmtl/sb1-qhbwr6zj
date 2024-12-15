import React from 'react';
import { HelpCircle } from 'lucide-react';

const FAQ_ITEMS = [
  {
    question: "Comment fonctionnent les crédits ?",
    answer: "Chaque génération de mockup consomme 1 crédit. Les crédits sont disponibles immédiatement après l'achat et n'expirent jamais."
  },
  {
    question: "Puis-je acheter plusieurs packs ?",
    answer: "Oui, vous pouvez acheter autant de packs que vous le souhaitez. Les crédits s'accumulent dans votre compte."
  },
  {
    question: "Comment fonctionne le paiement ?",
    answer: "Le paiement est sécurisé via Stripe. Vous pouvez payer par carte bancaire. Le pack est activé instantanément après le paiement."
  },
  {
    question: "Les crédits expirent-ils ?",
    answer: "Non, les crédits n'expirent jamais. Vous pouvez les utiliser à votre rythme."
  },
  {
    question: "Puis-je me faire rembourser ?",
    answer: "Les crédits non utilisés peuvent être remboursés dans les 14 jours suivant l'achat, conformément à nos conditions générales de vente."
  },
  {
    question: "Y a-t-il des frais cachés ?",
    answer: "Non, le prix affiché est le prix final. Pas d'abonnement, pas de frais cachés. Vous ne payez que ce que vous achetez."
  }
];

export default function PricingFAQ() {
  return (
    <section className="max-w-4xl mx-auto mt-20">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Questions fréquentes
        </h2>
        <p className="text-xl text-gray-600">
          Tout ce que vous devez savoir sur nos offres
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {FAQ_ITEMS.map((item, index) => (
          <div 
            key={index}
            className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex items-start gap-4">
              <div className="p-2 bg-indigo-50 rounded-lg">
                <HelpCircle className="h-5 w-5 text-indigo-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  {item.question}
                </h3>
                <p className="text-gray-600">
                  {item.answer}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}