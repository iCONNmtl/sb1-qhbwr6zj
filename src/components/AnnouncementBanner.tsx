import React from 'react';
import { X } from 'lucide-react';
import { useStore } from '../store/useStore';
import clsx from 'clsx';

interface AnnouncementBannerProps {
  onClose: () => void;
}

export default function AnnouncementBanner({ onClose }: AnnouncementBannerProps) {
  const { isSidebarCollapsed } = useStore();

  return (
    <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white relative">
      <div 
        className={clsx(
          "transition-all duration-300",
          isSidebarCollapsed ? 'ml-16' : 'ml-64'
        )}
      >
        <div className="max-w-7xl mx-auto py-3 px-4 relative">
          <div className="flex items-center justify-center gap-4">
            <span className="text-white/90">
              Réservez votre appel gratuitement maintenant
            </span>
            <a
              href="https://calendly.com/your-link"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-1 bg-white text-indigo-600 rounded-full hover:bg-indigo-50 transition-colors flex-shrink-0"
            >
              Réserver un appel
            </a>
          </div>
          <button
            onClick={onClose}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}