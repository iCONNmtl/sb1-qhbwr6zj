import { useState, useCallback } from 'react';
import { getPlanMockupLimit } from '../utils/subscription';
import type { UserProfile } from '../types/user';

export function useMockupSelection(userProfile: UserProfile | null) {
  const [selectedMockups, setSelectedMockups] = useState<string[]>([]);

  const handleMockupSelection = useCallback((mockupId: string) => {
    if (!userProfile) return;

    const mockupLimit = getPlanMockupLimit(userProfile.subscription.plan);

    setSelectedMockups(prev => {
      if (prev.includes(mockupId)) {
        return prev.filter(id => id !== mockupId);
      }
      if (prev.length >= mockupLimit) {
        return prev;
      }
      return [...prev, mockupId];
    });
  }, [userProfile]);

  return {
    selectedMockups,
    handleMockupSelection
  };
}