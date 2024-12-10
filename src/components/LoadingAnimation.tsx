import React from 'react';
import { Loader2 } from 'lucide-react';

export default function LoadingAnimation() {
  return (
    <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="text-center">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-indigo-200 rounded-full animate-spin">
            <div className="absolute top-0 right-0 w-4 h-4 bg-indigo-600 rounded-full"></div>
          </div>
          <Loader2 className="absolute inset-0 m-auto h-10 w-10 text-indigo-600 animate-spin" />
        </div>
        <p className="mt-4 text-lg font-medium text-gray-900">Génération en cours...</p>
        <p className="mt-2 text-sm text-gray-600">Veuillez patienter quelques instants</p>
      </div>
    </div>
  );
}