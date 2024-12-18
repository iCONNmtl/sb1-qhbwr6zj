import React, { useState } from 'react';
import { Building2, ChevronLeft, ChevronRight } from 'lucide-react';
import clsx from 'clsx';
import { TRUSTED_COMPANIES } from '../../data/companies';

export default function TrustedCompanies() {
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 4;
  const totalPages = Math.ceil(TRUSTED_COMPANIES.length / itemsPerPage);

  const visibleCompanies = TRUSTED_COMPANIES.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  const nextPage = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages);
  };

  const prevPage = () => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
  };

  return (
    <section className="py-8 md:py-12">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8 md:mb-12">
          <div className="flex items-center justify-center gap-2 text-gray-600 mb-4">
            <Building2 className="h-5 w-5" />
            <span className="text-sm font-medium uppercase tracking-wider">Ils nous font confiance</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            Utilisé par les meilleures entreprises
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Des startups aux grandes entreprises, MockupPro est la solution de référence pour la création de mockups professionnels
          </p>
        </div>

        <div className="relative max-w-5xl mx-auto">
          {/* Navigation buttons - Hide on mobile */}
          <button
            onClick={prevPage}
            className="hidden md:block absolute -left-12 top-1/2 transform -translate-y-1/2 p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>

          {/* Grid - Responsive layout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {visibleCompanies.map((company, index) => (
              <a
                key={`${company.name}-${index}`}
                href={company.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full h-[160px] bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 transform hover:scale-105 group"
              >
                <div className="h-16 flex items-center justify-center mb-4">
                  <img
                    src={company.logo}
                    alt={company.name}
                    className="max-h-10 w-auto object-contain group-hover:opacity-90 transition-opacity"
                  />
                </div>
                <div className="text-center">
                  <h3 className="font-medium text-gray-900 mb-1 truncate">{company.name}</h3>
                  <p className="text-sm text-gray-500 line-clamp-1">{company.description}</p>
                </div>
              </a>
            ))}
          </div>

          {/* Navigation button - Hide on mobile */}
          <button
            onClick={nextPage}
            className="hidden md:block absolute -right-12 top-1/2 transform -translate-y-1/2 p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          {/* Pagination dots */}
          <div className="flex justify-center mt-8 gap-2">
            {Array.from({ length: totalPages }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentPage(index)}
                className={clsx(
                  "w-2 h-2 rounded-full transition-all duration-200",
                  currentPage === index
                    ? "bg-indigo-600 w-4"
                    : "bg-gray-300 hover:bg-gray-400"
                )}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}