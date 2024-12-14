import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  message?: string;
}

export default function LoadingSpinner({ message = 'Chargement...' }: LoadingSpinnerProps) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600 mx-auto" />
        <p className="mt-2 text-gray-600">{message}</p>
      </div>
    </div>
  );
}