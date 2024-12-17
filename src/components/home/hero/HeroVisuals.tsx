import React from 'react';

export default function HeroVisuals() {
  return (
    <div className="relative">
      {/* Main image */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-3xl transform rotate-3" />
        <img
          src="https://images.unsplash.com/photo-1661956602116-aa6865609028?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
          alt="Mockup example"
          className="relative rounded-2xl shadow-xl w-full h-auto"
        />
      </div>

      {/* Additional images */}
      <img
        src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
        alt="Analytics"
        className="absolute -bottom-12 -left-12 w-64 h-64 object-cover rounded-2xl shadow-lg"
      />
      
      <img
        src="https://images.unsplash.com/photo-1586280268958-9483002d016a?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
        alt="E-commerce"
        className="absolute -top-8 -right-8 w-48 h-48 object-cover rounded-2xl shadow-lg"
      />
      
      <img
        src="https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
        alt="Marketing"
        className="absolute top-1/2 -right-16 w-40 h-40 object-cover rounded-2xl shadow-lg"
      />
    </div>
  );
}