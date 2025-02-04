import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import clsx from 'clsx';

const FAQ_ITEMS = [
  {
    question: "Comment fonctionne Pixmock ?",
    answer: [
      "Pixmock est une plateforme intuitive qui transforme vos designs en mockups professionnels en quelques clics :",
      "1. Uploadez votre design au format WebP ou JPEG",
      "2. Sélectionnez vos mockups préférés dans notre bibliothèque",
      "3. Personnalisez le texte et les éléments si besoin",
      "4. Générez vos mockups instantanément en haute qualité"
    ]
  },
  {
    question: "Quels formats de fichiers sont acceptés ?",
    answer: [
      "Nous acceptons deux formats optimisés pour le web :",
      "• WebP : Format moderne recommandé pour une qualité optimale",
      "• JPEG : Format universel compatible avec tous les logiciels",
      "Pour des résultats optimaux, nous recommandons :",
      "• Résolution minimale : 2000px de large",
      "• Ratio : Adapté à votre design final",
      "• Qualité : Export en haute qualité"
    ]
  },
  {
    question: "Puis-je créer mes propres mockups ?",
    answer: [
      "Oui ! Les utilisateurs Pro et Expert peuvent créer leurs mockups personnalisés :",
      "• Upload de fichiers PSD structurés",
      "• Positionnement intelligent des designs",
      "• Personnalisation complète des effets",
      "• Intégration dans votre bibliothèque privée",
      "Un guide détaillé est fourni pour vous accompagner dans le processus."
    ]
  },
  {
    question: "Comment fonctionne la bibliothèque de mockups ?",
    answer: [
      "Notre bibliothèque est organisée pour une expérience fluide :",
      "• Catégories intuitives (Devices, Print, Packaging...)",
      "• Filtres avancés (Format, Style, Orientation)",
      "• Système de favoris pour un accès rapide",
      "• Prévisualisation instantanée",
      "• Mise à jour régulière avec de nouveaux mockups"
    ]
  },
  {
    question: "Les mockups générés sont-ils de bonne qualité ?",
    answer: [
      "Absolument ! Nos mockups sont optimisés pour un usage professionnel :",
      "• Résolution 4K pour une qualité maximale",
      "• Rendu photoréaliste avec ombres et reflets",
      "• Respect des perspectives et déformations",
      "• Export en haute définition",
      "• Parfaits pour les présentations clients et portfolios"
    ]
  },
  {
    question: "Puis-je utiliser les mockups générés commercialement ?",
    answer: [
      "Oui, tous nos mockups sont libres de droits pour un usage commercial :",
      "• Utilisation illimitée pour vos clients",
      "• Intégration dans vos portfolios",
      "• Présentation sur les réseaux sociaux",
      "• Marketing et publicité",
      "• Projets personnels et professionnels"
    ]
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="max-w-3xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Questions fréquentes
        </h2>
        <p className="text-gray-600">
          Tout ce que vous devez savoir sur Pixmock
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm divide-y divide-gray-100">
        {FAQ_ITEMS.map((item, index) => (
          <div key={index} className="overflow-hidden">
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="flex items-center justify-between w-full p-6 text-left hover:bg-gray-50 transition-colors"
            >
              <span className="font-medium text-gray-900">{item.question}</span>
              <ChevronDown 
                className={clsx(
                  "h-5 w-5 text-gray-500 transition-transform duration-200 flex-shrink-0 ml-4",
                  openIndex === index ? "rotate-180" : ""
                )}
              />
            </button>
            
            <div 
              className={clsx(
                "transition-all duration-200 ease-in-out bg-gray-50",
                openIndex === index 
                  ? "max-h-[500px] opacity-100" 
                  : "max-h-0 opacity-0"
              )}
            >
              <div className="p-6 space-y-4">
                {Array.isArray(item.answer) ? (
                  item.answer.map((paragraph, i) => (
                    <p 
                      key={i} 
                      className={clsx(
                        "text-gray-600",
                        i === 0 ? "font-medium text-gray-700" : "",
                        paragraph.startsWith('•') ? "pl-4" : "",
                        paragraph.startsWith('1.') ? "pl-4" : ""
                      )}
                    >
                      {paragraph}
                    </p>
                  ))
                ) : (
                  <p className="text-gray-600">{item.answer}</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}