import React, { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import UserSubscription from '../components/dashboard/UserSubscription';
import GenerationGroup from '../components/dashboard/GenerationGroup';
import type { UserProfile } from '../types/user';

export default function Dashboard() {
  const { user, generations } = useStore();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    if (!user) return;

    const unsubscribe = onSnapshot(
      doc(db, 'users', user.uid),
      (doc) => {
        if (doc.exists()) {
          setUserProfile(doc.data() as UserProfile);
        }
      }
    );

    return () => unsubscribe();
  }, [user]);

  // Calculate total generated mockups
  const totalMockupsGenerated = generations.reduce((total, generation) => {
    return total + generation.mockups.length;
  }, 0);

  return (
    <div className="space-y-8">
      {userProfile && (
        <UserSubscription
          plan={userProfile.subscription.plan}
          credits={userProfile.subscription.credits || 0}
          endDate={userProfile.subscription.endDate}
          totalGenerations={totalMockupsGenerated}
        />
      )}

      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-gray-900">
          Vos générations
        </h2>

        <div className="space-y-6">
          {generations.length === 0 ? (
            <div className="text-center py-12 text-gray-500 bg-white rounded-xl shadow-sm">
              Aucune génération pour le moment
            </div>
          ) : (
            generations.map((generation, index) => (
              <GenerationGroup
                key={generation.id}
                generation={generation}
                isLatest={index === 0}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}