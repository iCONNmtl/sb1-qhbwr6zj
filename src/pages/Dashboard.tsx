import React, { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { Search, Filter } from 'lucide-react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import UserSubscription from '../components/dashboard/UserSubscription';
import GenerationGroup from '../components/dashboard/GenerationGroup';
import DashboardStats from '../components/dashboard/DashboardStats';
import type { UserProfile } from '../types/user';

export default function Dashboard() {
  const { user, generations } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'name'>('date');
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

  const stats = {
    totalGenerations: totalMockupsGenerated,
    lastGenerationDate: generations[0]?.createdAt
  };

  const filteredGenerations = generations
    .filter(gen => 
      gen.designName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      gen.mockups.some(m => m.name.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      return a.designName.localeCompare(b.designName);
    });

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-900">
          Tableau de bord
        </h1>
        {userProfile && (
          <UserSubscription
            plan={userProfile.subscription.plan}
            credits={userProfile.subscription.credits || 0}
            endDate={userProfile.subscription.endDate}
          />
        )}
      </div>

      <DashboardStats {...stats} />

      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h2 className="text-xl font-semibold text-gray-900">
            Vos générations
          </h2>
          <div className="flex items-center space-x-4 w-full md:w-auto">
            <div className="relative flex-1 md:flex-none">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Rechercher..."
                className="pl-10 pr-4 py-2 w-full md:w-64 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-gray-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'date' | 'name')}
                className="border border-gray-300 rounded-lg py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="date">Date</option>
                <option value="name">Nom</option>
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredGenerations.length === 0 ? (
            <div className="col-span-full text-center py-12 text-gray-500 bg-white rounded-xl shadow-sm">
              {searchTerm ? 'Aucun résultat trouvé' : 'Aucune génération pour le moment'}
            </div>
          ) : (
            filteredGenerations.map((generation) => (
              <GenerationGroup
                key={generation.id}
                generation={generation}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}