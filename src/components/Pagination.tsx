import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import clsx from 'clsx';

interface PaginationProps {
  currentPage: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

const PAGE_SIZE_OPTIONS = [10, 25, 50];

export default function Pagination({ 
  currentPage, 
  totalItems, 
  pageSize, 
  onPageChange,
  onPageSizeChange
}: PaginationProps) {
  const totalPages = Math.ceil(totalItems / pageSize);
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-3 bg-white border-t border-gray-200">
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-700">
          Afficher
        </span>
        <select
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
          className="px-3 py-1 text-sm border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
        >
          {PAGE_SIZE_OPTIONS.map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
        <span className="text-sm text-gray-700">éléments</span>
      </div>

      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-700">
          {totalItems > 0 ? `${startItem}-${endItem} sur ${totalItems}` : 'Aucun élément'}
        </span>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={clsx(
              "p-2 rounded-lg transition",
              currentPage === 1
                ? "text-gray-300 cursor-not-allowed"
                : "text-gray-700 hover:bg-gray-100"
            )}
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className={clsx(
              "p-2 rounded-lg transition",
              currentPage >= totalPages
                ? "text-gray-300 cursor-not-allowed"
                : "text-gray-700 hover:bg-gray-100"
            )}
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}