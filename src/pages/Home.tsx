import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, Image } from 'lucide-react';
import TrustedCompanies from '../components/home/TrustedCompanies';
import Testimonials from '../components/home/Testimonials';
import Features from '../components/home/Features';
import FAQ from '../components/home/FAQ';
import CTASection from '../components/home/CTASection';

export default function Home() {
  return (
    <div className="pt-12 md:pt-20 space-y-16 md:space-y-24">
      {/* Hero Section */}
      <section className="text-center px-4 md:px-8">
        <div className="max-w-4xl mx-auto space-y-6 md:space-y-8">
          <h1 className="text-3xl md:text-5xl font-bold text-gray-900 leading-tight">
            Créez des mockups professionnels en quelques secondes
          </h1>
          <p className="text-lg md:text-xl text-gray-600">
            Transformez instantanément vos designs en présentations percutantes. Générez plusieurs mockups en un clic et valorisez vos créations pour captiver vos clients.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/generator"
              className="w-full sm:w-auto inline-flex items-center justify-center px-6 md:px-8 py-3 md:py-4 gradient-bg text-white rounded-xl hover:opacity-90 transition-all duration-200"
            >
              <Zap className="h-5 w-5 mr-2" />
              Commencer gratuitement
            </Link>
            <Link
              to="/mockups"
              className="w-full sm:w-auto inline-flex items-center justify-center px-6 md:px-8 py-3 md:py-4 bg-white border-2 border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200"
            >
              <Image className="h-5 w-5 mr-2" />
              Voir la librairie
            </Link>
          </div>
        </div>
      </section>

      {/* Trusted Companies */}
      <div className="px-4 md:px-0">
        <TrustedCompanies />
      </div>

      {/* Features */}
      <div className="px-4 md:px-0">
        <Features />
      </div>

      {/* Testimonials */}
      <div className="px-4 md:px-0">
        <Testimonials />
      </div>

      {/* FAQ */}
      <div className="px-4 md:px-0">
        <FAQ />
      </div>

      {/* CTA Section */}
      <div className="px-4 md:px-0">
        <CTASection />
      </div>
    </div>
  );
}