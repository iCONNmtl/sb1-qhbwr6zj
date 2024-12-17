import React from 'react';
import Hero from '../components/home/Hero';
import Features from '../components/home/Features';
import TrustedBy from '../components/home/TrustedBy';
import Testimonials from '../components/home/Testimonials';
import FAQ from '../components/home/FAQ';
import CTA from '../components/home/CTA';

export default function Home() {
  return (
    <div className="overflow-hidden">
      <Hero />
      <TrustedBy />
      <Features />
      <Testimonials />
      <FAQ />
      <CTA />
    </div>
  );
}