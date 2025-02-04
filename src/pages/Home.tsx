import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, Image } from 'lucide-react';
import { useStore } from '../store/useStore';
import { BackgroundBeamsWithCollision } from '../components/ui/background-beams-with-collision';
import TrustedCompanies from '../components/home/TrustedCompanies';
import Features from '../components/home/Features';
import ROISection from '../components/home/ROISection';
import Testimonials from '../components/home/Testimonials';
import FAQ from '../components/home/FAQ';
import CTASection from '../components/home/CTASection';

export default function Home() {
  const { user } = useStore();

  return (
    <div className="pt-12">
      {/* Hero Section avec Background Beams */}
      <BackgroundBeamsWithCollision className="">
        <div className="relative z-10 max-w-6xl mx-auto space-y-6 md:space-y-8 text-center px-4 md:px-8">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight">
            Créez des{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">
              visuels ultra-réalistes
              </span>{' '}
              en quelques secondes !
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto">
              L'outil indispensable pour augmenter la valeur de vos affiches et faire exploser vos ventes.
            </p>
          </div>

          <div className="flex flex-col items-center space-y-6 pt-4">
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
                  <Link
                    to="/mockups"
                    className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 text-lg bg-white border-2 border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200"
                  >
                    <Image className="h-5 w-5 mr-2" />
                    Voir la librairie
                  </Link>
                </>
              )}
            </div>

            {!user && (
  <div className="flex flex-col items-center gap-4">
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