import { useMemo } from 'react';
import type { Mockup } from '../types/mockup';

export function useCategories(mockups: Mockup[], favorites: string[]) {
  const categories = useMemo(() => {
    const baseCategories = [{ id: 'all', name: 'Tous' }];
    
    if (favorites.length > 0) {
      baseCategories.push({ id: 'favorites', name: 'Mes favoris' });
    }
    
    const uniqueCategories = new Set(mockups.map(m => m.category));
    
    return [
      ...baseCategories,
      ...Array.from(uniqueCategories).map(category => ({
        id: category,
        name: category
      }))
    ];
  }, [mockups, favorites]);

  return { categories };
}