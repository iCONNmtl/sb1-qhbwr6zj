import { useState, useMemo } from 'react';
import type { Mockup } from '../types/mockup';

export function useMockupPagination(mockups: Mockup[], itemsPerPage: number = 25) {
  const [currentPage, setCurrentPage] = useState(1);
  
  const paginatedMockups = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return mockups.slice(startIndex, endIndex);
  }, [mockups, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(mockups.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top of mockup grid
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return {
    currentPage,
    totalPages,
    paginatedMockups,
    handlePageChange
  };
}