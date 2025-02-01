import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, Image } from 'lucide-react';
import { useStore } from '../store/useStore';
import { BackgroundBeamsWithCollision } from '../components/ui/background-beams-with-collision';
import TrustedCompanies from '../components/home/TrustedCompanies';
import Features from '../components/home/Features';
import Testimonials from '../components/home/Testimonials';
import FAQ from '../components/home/FAQ';
import CTASection from '../components/home/CTASection';

export default function Home() {
  const { user } = useStore();

  return (
    <div className="pt-12 md:pt-20">
      {/* Hero Section avec Background Beams */}
      <BackgroundBeamsWithCollision className="mb-20">
        <div className="relative z-10 max-w-6xl mx-auto space-y-6 md:space-y-8 text-center px-4 md:px-8">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight">
              La plateforme de{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-indigo-500 to-indigo-600">
                génération de mockups
              </span>{' '}
              qui livre des résultats professionnels
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto">
              Des mockups de qualité professionnelle en quelques secondes. Transformez vos designs en présentations percutantes.
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

    {/* Avatars et texte de confiance */}
    <div className="flex items-center rounded-full border border-gray-200 bg-white p-1 shadow shadow-black/5">
      <div className="flex -space-x-1.5">
        <img
          className="rounded-full ring-1 ring-white"
          src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=64&h=64&fit=crop&crop=faces"
          width={20}
          height={20}
          alt="Avatar 01"
        />
        <img
          className="rounded-full ring-1 ring-white"
          src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=64&h=64&fit=crop&crop=faces"
          width={20}
          height={20}
          alt="Avatar 02"
        />
        <img
          className="rounded-full ring-1 ring-white"
          src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=64&h=64&fit=crop&crop=faces"
          width={20}
          height={20}
          alt="Avatar 03"
        />
        <img
          className="rounded-full ring-1 ring-white"
          src="https://images.unsplash.com/photo-1488161628813-04466f872be2?w=64&h=64&fit=crop&crop=faces"
          width={20}
          height={20}
          alt="Avatar 04"
        />
      </div>
      <p className="px-2 text-xs text-gray-500">
        Utilisé par <strong className="font-medium text-gray-900">60K+</strong> designers
      </p>
    </div>
  </div>
)}

          </div>
        </div>
      </BackgroundBeamsWithCollision>

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