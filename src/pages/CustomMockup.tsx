import React from 'react';
import { useStore } from '../store/useStore';
import CustomMockupInstructions from '../components/mockup/CustomMockupInstructions';
import CustomMockupUploader from '../components/mockup/CustomMockupUploader';
import AuthGuard from '../components/AuthGuard';

export default function CustomMockup() {
  const { user } = useStore();

  return (
    <AuthGuard>
      <div className="space-y-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Créer votre propre mockup
        </h1>

        {/* Vertical stack layout */}
        <div className="space-y-8">
          <CustomMockupInstructions />
          <CustomMockupUploader userId={user?.uid || ''} />
        </div>
      </div>
    </AuthGuard>
  );
}