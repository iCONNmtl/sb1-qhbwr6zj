import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from 'firebase/auth';

interface Generation {
  id: string;
  designName: string;
  mockups: {
    id: string;
    name: string;
    url: string;
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
      setUser: (user) => set({ user }),
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
        generations: state.generations,
        credits: state.credits,
        isSidebarCollapsed: state.isSidebarCollapsed
      }),
    }
  )
);