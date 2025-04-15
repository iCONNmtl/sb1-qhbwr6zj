import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, Calendar, Store } from 'lucide-react';
import { useStore } from '../store/useStore';
import { BackgroundBeamsWithCollision } from '../components/ui/background-beams-with-collision';
import Testimonials from '../components/home/Testimonials';
import FAQ from '../components/home/FAQ';
import CTASection from '../components/home/CTASection';
import FeatureBlocks from '../components/home/FeatureBlocks';
import AllInOneToolsSection from '../components/home/AllInOneToolsSection';
import { AnimatedTooltip } from '../components/ui/animated-tooltip';

const USERS = [
  {
    id: 1,
    name: "Sylvain P.",
    designation: "7,600€/mois",
    image: "https://d2v7vpg8oce97p.cloudfront.net/Branding/AHome1.webp",
  },
  {
    id: 2,
    name: "Julie L.",
    designation: "4,900€/mois",
    image: "https://d2v7vpg8oce97p.cloudfront.net/Branding/AHome2.webp",
  },
  {
    id: 3,
    name: "Marc D.",
    designation: "1,300€/mois",
    image: "https://d2v7vpg8oce97p.cloudfront.net/Branding/AHome3.webp",
  },
  {
    id: 4,
    name: "Marine R.",
    designation: "9,800€/mois",
    image: "https://d2v7vpg8oce97p.cloudfront.net/Branding/AHome4.webp",
  },
  {
    id: 5,
    name: "Tom B.",
    designation: "12,300€/mois",
    image: "https://d2v7vpg8oce97p.cloudfront.net/Branding/AHome5.webp",
  },
  {
    id: 6,
    name: "Lisa M.",
    designation: "6,500€/mois",
    image: "https://d2v7vpg8oce97p.cloudfront.net/Branding/AHome6.webp",
  }
];

export default function Home() {
  const { user } = useStore();

  return (
    <div className="pt-12 md:pt-20">
      {/* Hero Section avec Background Beams */}
      <BackgroundBeamsWithCollision className="">
        <div className="relative z-10 max-w-6xl mx-auto space-y-6 md:space-y-8 text-center px-4 md:px-8">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight">
              Monétiser{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">
                vos designs
              </span>{' '}
              en quelques clics !
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto">
              La plateforme de print on demand pour créer et gérer votre business d'affiches de A à Z.
            </p>
          </div>

          <div className="flex flex-col items-center space-y-6 pt-4">
            <div className="flex flex-col items-center gap-4">
              <AnimatedTooltip items={USERS} />
              <p className="text-sm text-gray-600">
                Déjà plus de <span className="font-semibold text-indigo-600">250</span> utilisateurs ont lancé leur business grâce à Pixmock
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              {user ? (
                <Link
                  to="/products"
                  className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 text-lg gradient-bg text-white rounded-xl hover:opacity-90 transition-all duration-200"
                >
                  <Store className="h-5 w-5 mr-2" />
                  Créer vos produits
                </Link>
              ) : (
                <>
                  <Link
                    to="/products"
                    className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 text-lg gradient-bg text-white rounded-xl hover:opacity-90 transition-all duration-200"
                  >
                    <Store className="h-5 w-5 mr-2" />
                    Commencer gratuitement
                  </Link>
                  <a
                    href="https://calendly.com/contact-pixmock/30min"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 text-lg bg-white border-2 border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200"
                  >
                    <Calendar className="h-5 w-5 mr-2" />
                    Réserver un appel
                  </a>
                </>
              )}
            </div>

            {!user && (
              <div className="flex items-center gap-8 text-sm text-gray-500">
                <span className="flex items-center">
                  <Zap className="h-4 w-4 mr-1 text-indigo-600" />
                  Pas de carte requise
                </span>
                <span className="flex items-center">
                  <Zap className="h-4 w-4 mr-1 text-indigo-600" />
                  Pas d'engagement
                </span>
              </div>
            )}
          </div>
        </div>
      </BackgroundBeamsWithCollision>

       {/* Feature Blocks */}
       <FeatureBlocks />

       {/* All-in-One Tools Section */}
      <AllInOneToolsSection />

      {/* Testimonials */}
        <Testimonials />

      {/* FAQ */}
      <div className="pb-20">
        <FAQ />
      </div>

      {!user && (
        <div className="pb-20">
          <CTASection />
        </div>
      )}
    </div>
  );
}