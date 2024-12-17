import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import clsx from 'clsx';

interface MockupPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function MockupPagination({ 
  currentPage, 
  totalPages,
  onPageChange 
}: MockupPaginationProps) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  
  // Show max 5 page numbers
  const getVisiblePages = () => {
    if (totalPages <= 5) return pages;
    
    if (currentPage <= 3) return pages.slice(0, 5);
    if (currentPage >= totalPages - 2) return pages.slice(totalPages - 5);
    
    return pages.slice(currentPage - 3, currentPage + 2);
  };

  return (
    <div className="flex items-center justify-center space-x-2 mt-8">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={clsx(
          "p-2 rounded-lg transition-all duration-200",
          currentPage === 1
            ? "text-gray-300 cursor-not-allowed"
            : "text-gray-600 hover:bg-gray-100"
        )}
      >
        <ChevronLeft className="h-5 w-5" />
      </button>

      {getVisiblePages().map(page => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={clsx(
            "w-10 h-10 rounded-lg transition-all duration-200",
            currentPage === page
              ? "gradient-bg text-white"
              : "text-gray-600 hover:bg-gray-100"
          )}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={clsx(
          "p-2 rounded-lg transition-all duration-200",
          currentPage === totalPages
            ? "text-gray-300 cursor-not-allowed"
            : "text-gray-600 hover:bg-gray-100"
        )}
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  );
}