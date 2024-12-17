import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { companiesData } from './companiesData';

export default function LogoScroll() {
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 4;
  const totalPages = Math.ceil(companiesData.length / itemsPerPage);

  const handlePrevious = () => {
    setCurrentPage((prev) => (prev > 0 ? prev - 1 : totalPages - 1));
  };

  const handleNext = () => {
    setCurrentPage((prev) => (prev < totalPages - 1 ? prev + 1 : 0));
  };

  const visibleLogos = companiesData.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  return (
    <div className="relative max-w-5xl mx-auto">
      <div className="flex items-center">
        <button
          onClick={handlePrevious}
          className="p-2 rounded-full bg-white shadow-md hover:bg-gray-50 transition-all duration-200"
          aria-label="Previous logos"
        >
          <ChevronLeft className="h-6 w-6 text-gray-600" />
        </button>

        <div className="flex-1 px-8">
          <div className="grid grid-cols-4 gap-8">
            {visibleLogos.map((company) => (
              <a
                key={company.name}
                href={company.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center group transition-all duration-300 p-4 hover:bg-gray-50 rounded-xl"
              >
                <img
                  src={company.logo}
                  alt={company.name}
                  className="h-16 md:h-20 grayscale group-hover:grayscale-0 transition-all duration-300"
                />
              </a>
            ))}
          </div>
        </div>

        <button
          onClick={handleNext}
          className="p-2 rounded-full bg-white shadow-md hover:bg-gray-50 transition-all duration-200"
          aria-label="Next logos"
        >
          <ChevronRight className="h-6 w-6 text-gray-600" />
        </button>
      </div>

      {/* Pagination dots */}
      <div className="flex justify-center mt-8 space-x-2">
        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentPage(index)}
            className={`w-2 h-2 rounded-full transition-all duration-200 ${
              currentPage === index ? 'bg-indigo-600 w-4' : 'bg-gray-300'
            }`}
            aria-label={`Go to page ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}