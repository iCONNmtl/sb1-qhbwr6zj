import React from 'react';
import LogoScroll from './trusted/LogoScroll';

export default function TrustedBy() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Utilisé par les plus grandes plateformes
          </h2>
          <p className="text-xl text-gray-600">
            Plus de 10,000 e-commerçants nous font confiance
          </p>
        </div>

        <LogoScroll />
      </div>
    </section>
  );
}