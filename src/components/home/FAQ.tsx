import React from 'react';
import { HelpCircle } from 'lucide-react';

const FAQ_ITEMS = [
  {
    question: "Comment fonctionne Pixmock ?",
    answer: "Pixmock est une plateforme qui vous permet de générer des mockups professionnels en quelques clics. Uploadez votre design, sélectionnez les mockups souhaités et générez !"
  },
  {
    question: "Quels formats de fichiers sont acceptés ?",
    answer: "Nous acceptons les fichiers au format WebP et JPEG. Pour une qualité optimale, nous recommandons des images en bonne résolution."
  },
  {
    question: "Puis-je créer mes propres mockups ?",
    answer: "Oui ! Les utilisateurs peuvent créer et ajouter leurs propres mockups personnalisés. Il vous suffit d'uploader votre fichier PSD en suivant notre guide de structure."
  },
  {
    question: "Comment fonctionne la bibliothèque de mockups ?",
    answer: "Notre bibliothèque contient une large sélection de mockups professionnels, organisés par catégories. Vous pouvez marquer vos mockups favoris pour y accéder rapidement et les retrouver facilement."
  },
  {
    question: "Les mockups générés sont-ils de bonne qualité ?",
    answer: "Absolument ! Tous nos mockups sont optimisés pour un rendu professionnel. Vous pouvez les exporter en haute résolution, parfaits pour vos présentations clients ou vos fiches produits."
  },
  {
    question: "Puis-je utiliser les mockups générés commercialement ?",
    answer: "Oui, tous les mockups générés peuvent être utilisés dans un cadre commercial. Vous pouvez les utiliser pour vos clients, votre portfolio ou tout autre projet professionnel."
  }
];

export default function FAQ() {
  return (
    <section className="bg-gray-50 rounded-2xl p-12">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Questions fréquentes
        </h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Tout ce que vous devez savoir sur Pixmock
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {FAQ_ITEMS.map((item, index) => (
          <div 
            key={index}
            className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200"
          >
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="p-2 bg-indigo-50 rounded-lg">
                  <HelpCircle className="h-5 w-5 text-indigo-600" />
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
        ))}
      </div>
    </section>
  );
}