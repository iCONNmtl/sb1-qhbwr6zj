import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const faqs = [
  {
    question: "Comment fonctionne la génération de mockups ?",
    answer: "C'est simple ! Uploadez votre design, sélectionnez les mockups souhaités et notre système génère automatiquement des rendus professionnels en quelques secondes."
  },
  {
    question: "Quels formats d'image sont acceptés ?",
    answer: "Nous acceptons les formats JPG et PNG. Pour un résultat optimal, nous recommandons des images en haute résolution (minimum 1920x1080 pixels)."
  },
  {
    question: "Puis-je utiliser les mockups pour un usage commercial ?",
    answer: "Oui, tous nos mockups sont libres de droits et peuvent être utilisés pour un usage commercial, que ce soit pour vos fiches produits, réseaux sociaux ou supports marketing."
  },
  {
    question: "Comment fonctionnent les crédits ?",
    answer: "Chaque génération de mockup consomme 1 crédit. Les crédits sont renouvelés chaque mois selon votre plan d'abonnement. Les crédits non utilisés sont reportés au mois suivant."
  },
  {
    question: "Quelle est la qualité des exports ?",
    answer: "Nous générons des images en haute résolution (jusqu'à 4K) parfaitement adaptées pour vos fiches produits et supports marketing."
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-20 bg-white">
      <div className="max-w-3xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Questions fréquentes
          </h2>
          <p className="text-xl text-gray-600">
            Tout ce que vous devez savoir pour bien démarrer
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-gray-50 rounded-xl overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-4 flex items-center justify-between text-left"
              >
                <span className="font-medium text-gray-900">{faq.question}</span>
                {openIndex === index ? (
                  <ChevronUp className="h-5 w-5 text-gray-500" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-500" />
                )}
              </button>
              {openIndex === index && (
                <div className="px-6 pb-4">
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}