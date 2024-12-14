import React from 'react';

export default function PricingFooter() {
  return (
    <div className="mt-12 text-center">
      <p className="text-gray-600">
        Des questions ? {" "}
        <a href="mailto:support@mockuppro.com" className="text-indigo-600 hover:text-indigo-500">
          Contactez-nous
        </a>
      </p>
    </div>
  );
}