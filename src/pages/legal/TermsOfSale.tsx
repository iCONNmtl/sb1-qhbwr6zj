import React from 'react';

export default function TermsOfSale() {
  return (
    <div className="max-w-4xl">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Conditions Générales de Vente
      </h1>

      <div className="prose prose-indigo">
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            1. Préambule
          </h2>
          <p className="text-gray-600">
            Les présentes Conditions Générales de Vente (CGV) régissent les relations contractuelles entre la société Pixmock SAS, ci-après dénommée "Pixmock", et toute personne physique ou morale effectuant un achat sur la plateforme Pixmock, ci-après dénommée "le Client". Toute commande implique l'acceptation sans réserve par le Client des présentes CGV.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            2. Offres et services
          </h2>
          <p className="text-gray-600 mb-4">
            Pixmock propose une plateforme complète de print-on-demand incluant :
          </p>
          <ul className="list-disc pl-6 text-gray-600 space-y-2">
            <li>Packs de crédits pour l'utilisation des fonctionnalités de la plateforme</li>
            <li>Service de génération de mockups professionnels</li>
            <li>Génération de designs par intelligence artificielle</li>
            <li>Création et gestion de produits d'impression à la demande</li>
            <li>Intégration avec les plateformes de vente Etsy et Shopify</li>
            <li>Génération automatique de fiches produits optimisées</li>
            <li>Traitement et suivi des commandes clients</li>
            <li>Analyse des statistiques de vente et performance</li>
            <li>Programmation de publications sur les réseaux sociaux</li>
            <li>Formations premium sur le e-commerce et le print-on-demand</li>
          </ul>
          <p className="text-gray-600 mt-4">
            Les offres présentées sur le site sont valables dans la limite des stocks disponibles et sous réserve de disponibilité des services.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            3. Prix et paiement
          </h2>
          <p className="text-gray-600 mb-4">
            Les prix sont indiqués en euros et hors taxes. La TVA applicable sera ajoutée au moment du paiement selon le pays de résidence du Client.
          </p>
          <p className="text-gray-600 mb-4">
            Le paiement s'effectue par carte bancaire via notre prestataire de paiement sécurisé Stripe. Les données bancaires sont cryptées et ne transitent jamais par nos serveurs.
          </p>
          <p className="text-gray-600 mb-4">
            Pour les services d'impression à la demande, les prix incluent la fabrication du produit mais pas les frais de livraison, qui sont calculés séparément en fonction de la destination.
          </p>
          <p className="text-gray-600">
            Les prix de vente recommandés pour les produits sont calculés automatiquement en fonction des coûts de production, des frais de livraison et des marges standard du marché, mais peuvent être personnalisés par le Client.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            4. Système de crédits
          </h2>
          <p className="text-gray-600 mb-4">
            Les crédits Pixmock fonctionnent selon les modalités suivantes :
          </p>
          <ul className="list-disc pl-6 text-gray-600 space-y-2">
            <li>Les crédits sont disponibles à l'achat sous forme de packs</li>
            <li>Les crédits sont utilisables pour générer des mockups, accéder à des formations premium, payer des commandes d'impression et utiliser certaines fonctionnalités avancées</li>
            <li>Les crédits achetés n'expirent pas</li>
            <li>Les crédits ne sont pas remboursables une fois utilisés</li>
            <li>Les crédits non utilisés peuvent être remboursés dans les 14 jours suivant l'achat</li>
            <li>Les crédits ne sont pas transférables entre comptes utilisateurs</li>
            <li>Le paiement automatique des commandes avec des crédits peut être activé dans les paramètres</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            5. Service d'impression à la demande
          </h2>
          <p className="text-gray-600 mb-4">
            Pour le service d'impression à la demande, les conditions suivantes s'appliquent :
          </p>
          <ul className="list-disc pl-6 text-gray-600 space-y-2">
            <li>Les produits sont fabriqués à la commande et expédiés directement au client final</li>
            <li>Les délais de fabrication sont généralement de 1 à 3 jours ouvrables</li>
            <li>Les délais de livraison varient selon la destination (2-3 jours en Europe, 3-5 jours en Amérique du Nord, 4-7 jours pour le reste du monde)</li>
            <li>Pixmock travaille avec des partenaires d'impression répartis dans le monde entier pour optimiser les délais de livraison</li>
            <li>Le Client est responsable de la qualité et de la résolution des designs fournis pour l'impression</li>
            <li>Pixmock ne peut être tenu responsable des variations mineures de couleur entre l'écran et l'impression finale</li>
            <li>Les commandes peuvent être traitées automatiquement selon les paramètres définis par le Client</li>
            <li>Les frais d'impression et de livraison sont déduits des revenus du Client ou peuvent être payés avec des crédits</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            6. Intégration avec les plateformes de vente
          </h2>
          <p className="text-gray-600 mb-4">
            Pixmock s'intègre avec plusieurs plateformes de vente en ligne. Les conditions suivantes s'appliquent :
          </p>
          <ul className="list-disc pl-6 text-gray-600 space-y-2">
            <li>L'intégration nécessite l'autorisation d'accès aux comptes des plateformes concernées</li>
            <li>Pixmock synchronise les produits, commandes et informations clients entre les plateformes</li>
            <li>Le Client est responsable du respect des conditions d'utilisation des plateformes tierces</li>
            <li>Les fiches produits générées peuvent être personnalisées avant publication</li>
            <li>Pixmock ne peut garantir la disponibilité continue des API des plateformes tierces</li>
            <li>Les frais de commission des plateformes tierces restent à la charge du Client</li>
            <li>Pixmock n'est pas responsable des modifications apportées par les plateformes tierces à leurs API ou conditions d'utilisation</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            7. Traitement des commandes
          </h2>
          <p className="text-gray-600 mb-4">
            Le traitement des commandes via Pixmock est soumis aux conditions suivantes :
          </p>
          <ul className="list-disc pl-6 text-gray-600 space-y-2">
            <li>Les commandes sont automatiquement synchronisées depuis les plateformes connectées</li>
            <li>Le Client peut choisir de traiter les commandes manuellement ou automatiquement</li>
            <li>Le paiement des commandes peut être effectué avec des crédits Pixmock</li>
            <li>Les factures sont générées automatiquement pour chaque commande traitée</li>
            <li>Le Client est responsable de vérifier l'exactitude des informations de livraison</li>
            <li>Les informations de suivi sont automatiquement transmises aux plateformes connectées</li>
            <li>Pixmock peut prélever des frais de service sur chaque commande traitée, selon les conditions tarifaires en vigueur</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            8. Formations et contenu premium
          </h2>
          <p className="text-gray-600 mb-4">
            L'achat de formations et de contenu premium est soumis aux conditions suivantes :
          </p>
          <ul className="list-disc pl-6 text-gray-600 space-y-2">
            <li>L'accès aux formations est personnel et non transférable</li>
            <li>L'accès est accordé pour une durée illimitée, sauf mention contraire</li>
            <li>Le contenu des formations est protégé par le droit d'auteur</li>
            <li>La redistribution ou le partage du contenu premium est strictement interdit</li>
            <li>Pixmock se réserve le droit de mettre à jour le contenu des formations</li>
            <li>Les formations peuvent être achetées avec des crédits Pixmock</li>
            <li>Les stratégies commerciales présentées dans les formations ne garantissent pas de résultats spécifiques</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            9. Droit de rétractation
          </h2>
          <p className="text-gray-600 mb-4">
            Conformément à la législation en vigueur, le Client dispose d'un délai de 14 jours à compter de la date d'achat pour exercer son droit de rétractation, sans avoir à justifier de motifs ni à payer de pénalités.
          </p>
          <p className="text-gray-600 mb-4">
            Exceptions au droit de rétractation :
          </p>
          <ul className="list-disc pl-6 text-gray-600 space-y-2">
            <li>Les crédits déjà utilisés ne peuvent faire l'objet d'un remboursement</li>
            <li>Les formations dont le contenu a déjà été consulté ne peuvent être remboursées</li>
            <li>Les produits d'impression personnalisés, fabriqués selon les spécifications du Client ou du client final, ne peuvent être remboursés sauf défaut de fabrication</li>
            <li>Conformément à l'article L221-28 du Code de la consommation, le droit de rétractation ne peut être exercé pour les services pleinement exécutés avant la fin du délai de rétractation et dont l'exécution a commencé après accord préalable exprès du consommateur</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            10. Garanties et responsabilités
          </h2>
          <p className="text-gray-600 mb-4">
            Pixmock s'engage à fournir des services conformes aux descriptions présentées sur le site. Cependant :
          </p>
          <ul className="list-disc pl-6 text-gray-600 space-y-2">
            <li>Pixmock ne peut garantir que les résultats obtenus via le service répondront parfaitement aux attentes du Client</li>
            <li>Pour les produits imprimés, Pixmock garantit leur conformité aux standards de qualité de l'industrie</li>
            <li>En cas de produit défectueux ou endommagé, le client final dispose de 14 jours à compter de la réception pour signaler le problème</li>
            <li>Pixmock ne pourra être tenu responsable des dommages indirects résultant de l'utilisation du service</li>
            <li>Pixmock ne garantit pas le succès commercial des produits créés via la plateforme</li>
            <li>Les délais de livraison sont donnés à titre indicatif et peuvent varier selon les circonstances</li>
            <li>Pixmock n'est pas responsable des retards ou problèmes de livraison imputables aux transporteurs</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            11. Propriété intellectuelle
          </h2>
          <p className="text-gray-600 mb-4">
            Le Client conserve tous les droits de propriété intellectuelle sur ses designs. En utilisant le service, il garantit qu'il dispose des droits nécessaires sur les designs uploadés et vendus via la plateforme.
          </p>
          <p className="text-gray-600 mb-4">
            Pour les designs générés par IA, le Client est responsable de vérifier qu'ils ne violent pas les droits de tiers avant de les commercialiser.
          </p>
          <p className="text-gray-600">
            Le Client est seul responsable en cas de violation des droits de propriété intellectuelle de tiers. Pixmock se réserve le droit de supprimer tout contenu faisant l'objet d'une réclamation pour violation de droits d'auteur.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            12. Facturation et fiscalité
          </h2>
          <p className="text-gray-600 mb-4">
            Concernant la facturation et les aspects fiscaux :
          </p>
          <ul className="list-disc pl-6 text-gray-600 space-y-2">
            <li>Pixmock génère automatiquement des factures pour chaque transaction</li>
            <li>Le Client est responsable de déclarer ses revenus conformément à la législation fiscale applicable</li>
            <li>Pour les ventes internationales, le Client doit se conformer aux réglementations fiscales des pays concernés</li>
            <li>Pixmock peut collecter et reverser certaines taxes selon les juridictions, mais ne fournit pas de conseils fiscaux</li>
            <li>Les factures sont disponibles dans l'espace client et peuvent être téléchargées à tout moment</li>
            <li>Le Client doit fournir des informations fiscales exactes et à jour</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            13. Service client
          </h2>
          <p className="text-gray-600">
            Pour toute question relative à votre compte, vos commandes ou aux services de la plateforme, notre service client est disponible par email à support@pixmock.com ou via le formulaire de contact sur notre site.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            14. Litiges
          </h2>
          <p className="text-gray-600 mb-4">
            En cas de litige, une solution amiable sera recherchée avant toute action judiciaire. À défaut, les tribunaux français seront seuls compétents.
          </p>
          <p className="text-gray-600">
            Conformément à l'article L612-1 du Code de la consommation, vous pouvez recourir gratuitement au service de médiation MEDICYS.
          </p>
        </section>
      </div>
    </div>
  );
}