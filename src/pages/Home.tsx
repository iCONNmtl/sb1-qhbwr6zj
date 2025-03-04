import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, Calendar } from 'lucide-react';
import { useStore } from '../store/useStore';
import { BackgroundBeamsWithCollision } from '../components/ui/background-beams-with-collision';
import TrustedCompanies from '../components/home/TrustedCompanies';
import Features from '../components/home/Features';
import ROISection from '../components/home/ROISection';
import Testimonials from '../components/home/Testimonials';
import FAQ from '../components/home/FAQ';
import CTASection from '../components/home/CTASection';
import { AnimatedTooltip } from '../components/ui/animated-tooltip';

const USERS = [
  {
    id: 1,
    name: "Sophie M.",
    designation: "15,600€/mois",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8YXZhdGFyfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",
  },
  {
    id: 2,
    name: "Marc D.",
    designation: "8,900€/mois",
    image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YXZhdGFyfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",
  },
  {
    id: 3,
    name: "Julie L.",
    designation: "12,300€/mois",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGF2YXRhcnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
  },
  {
    id: 4,
    name: "Thomas R.",
    designation: "9,800€/mois",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3540&q=80",
  }
];

export default function Home() {
  const { user } = useStore();

  return (
    <div className="pt-12 md:pt-20">
      {/* Hero Section avec Background Beams */}
      <BackgroundBeamsWithCollision className="mb-20">
        <div className="relative z-10 max-w-6xl mx-auto space-y-6 md:space-y-8 text-center px-4 md:px-8">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight">
              Créez et vendez{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
                vos affiches personnalisés
              </span>{' '}
              en quelques clics !
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto">
              La plateforme de print on demand tout en un indispensable pour créer votre business d'affiches et enchaîner les ventes.
            </p>
          </div>

          <div className="flex flex-col items-center space-y-6 pt-4">
            <div className="flex flex-col items-center gap-4">
              <AnimatedTooltip items={USERS} />
              <p className="text-sm text-gray-600">
                Déjà plus de <span className="font-semibold text-indigo-600">300</span> utilisateurs ont lancé leur business grâce à Pixmock
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              {user ? (
                <Link
                  to="/generator"
                  className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 text-lg gradient-bg text-white rounded-xl hover:opacity-90 transition-all duration-200"
                >
                  <Zap className="h-5 w-5 mr-2" />
                  Générer vos mockups
                </Link>
              ) : (
                <>
                  <Link
                    to="/generator"
                    className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 text-lg gradient-bg text-white rounded-xl hover:opacity-90 transition-all duration-200"
                  >
                    <Zap className="h-5 w-5 mr-2" />
                    Commencer gratuitement
                  </Link>
                  <a
                    href="https://calendly.com/your-link"
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

      {/* ROI Section */}
      <ROISection />

      {/* Features */}
      <Features />

      {/* Testimonials */}
      <div className="px-4 md:px-0 py-20">
        <Testimonials />
      </div>

      {/* FAQ */}
      <div className="px-4 md:px-0 pt-8 pb-20">
        <FAQ />
      </div>

      {!user && (
        <div className="px-4 md:px-0 pb-20">
          <CTASection />
        </div>
      )}
    </div>
  );
}