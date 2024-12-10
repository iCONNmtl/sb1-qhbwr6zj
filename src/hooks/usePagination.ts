import { useState, useEffect } from 'react';

export function usePagination<T>(items: T[], defaultPageSize = 10) {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(defaultPageSize);
  const [paginatedItems, setPaginatedItems] = useState<T[]>([]);

  useEffect(() => {
    const totalPages = Math.ceil(items.length / pageSize);
    if (currentPage > totalPages) {
      setCurrentPage(Math.max(1, totalPages));
    }

    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    setPaginatedItems(items.slice(start, end));
  }, [items, currentPage, pageSize]);

  return {
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    totalItems: items.length,
    paginatedItems
  };
}