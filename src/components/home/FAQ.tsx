import React from 'react';
import { HelpCircle, CreditCard, Clock, Zap, Shield } from 'lucide-react';

const FAQ_ITEMS = [
  {
    question: "Comment fonctionne le paiement ?",
    answer: "Le paiement est sécurisé via Stripe. Vous pouvez payer par carte bancaire. Les crédits sont activés instantanément après le paiement.",
    icon: CreditCard
  },
  {
    question: "Les crédits expirent-ils ?",
    answer: "Non, les crédits n'expirent jamais. Vous pouvez les utiliser à votre rythme, sans contrainte de temps.",
    icon: Clock
  },
  {
    question: "Puis-je acheter plusieurs packs ?",
    answer: "Oui, vous pouvez acheter autant de packs que vous le souhaitez. Les crédits s'accumulent automatiquement dans votre compte.",
    icon: Zap
  },
  {
    question: "Puis-je me faire rembourser ?",
    answer: "Les crédits non utilisés peuvent être remboursés dans les 14 jours suivant l'achat, conformément à nos conditions générales de vente.",
    icon: Shield
  }
];

export default function FAQ() {
  return (
    <section className="bg-gray-50 rounded-2xl p-12">
      <div className="text-center mb-12">
        <div className="flex items-center justify-center gap-2 text-gray-600 mb-4">
          <HelpCircle className="h-5 w-5" />
          <span className="text-sm font-medium uppercase tracking-wider">FAQ</span>
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Questions fréquentes
        </h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Tout ce que vous devez savoir sur nos offres et le fonctionnement des crédits
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {FAQ_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <div 
              key={item.question}
              className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200"
            >
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="p-2 bg-indigo-50 rounded-lg">
                    <Icon className="h-5 w-5 text-indigo-600" />
                  </div>
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
          );
        })}
      </div>

      <div className="mt-12 text-center">
        <p className="text-gray-600">
          Vous avez d'autres questions ?{' '}
          <a 
            href="mailto:support@mockuppro.com" 
            className="text-indigo-600 hover:text-indigo-500 font-medium"
          >
            Contactez notre support
          </a>
        </p>
      </div>
    </section>
  );
}