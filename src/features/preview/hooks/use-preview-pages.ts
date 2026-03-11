import { useState } from 'react';

export function usePreviewPages(totalPages: number) {
  const [currentPage, setCurrentPage] = useState(0);

  const goToNext = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage((p) => p + 1);
    }
  };

  const goToPrev = () => {
    if (currentPage > 0) {
      setCurrentPage((p) => p - 1);
    }
  };

  return { currentPage, goToNext, goToPrev, totalPages };
}
