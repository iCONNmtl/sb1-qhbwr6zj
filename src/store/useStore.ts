import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from 'firebase/auth';
import type { GenerationPlatform } from '../types/mockup';

interface Generation {
  id: string;
  userId: string; // Ajout du userId
  designName: string;
  mockups: {
    id: string;
    name: string;
    url: string;
    platform?: GenerationPlatform;
  }[];
  createdAt: string;
}

interface Store {
  user: User | null;
  setUser: (user: User | null) => void;
  credits: number;
  setCredits: (credits: number) => void;
  generations: Generation[];
  addGeneration: (generation: Generation) => void;
  setGenerations: (generations: Generation[]) => void;
  isSidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
}

export const useStore = create<Store>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => {
        set({ user });
        // Réinitialiser les générations quand l'utilisateur change
        if (!user) {
          set({ generations: [] });
        }
      },
      credits: 5,
      setCredits: (credits) => set({ credits }),
      generations: [],
      addGeneration: (generation) => set((state) => ({
        generations: [generation, ...state.generations]
      })),
      setGenerations: (generations) => set({ generations }),
      isSidebarCollapsed: false,
      setSidebarCollapsed: (collapsed) => set({ isSidebarCollapsed: collapsed }),
    }),
    {
      name: 'mockup-pro-storage',
      partialize: (state) => ({
        generations: state.generations.filter(gen => gen.userId === state.user?.uid), // Filtrer par userId
        credits: state.credits,
        isSidebarCollapsed: state.isSidebarCollapsed
      }),
    }
  )
);
