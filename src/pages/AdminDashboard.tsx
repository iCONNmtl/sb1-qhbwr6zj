import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import MockupUploader from '../components/MockupUploader';
import MockupEditor from '../components/MockupEditor';
import UserList from '../components/admin/UserList';
import MockupList from '../components/admin/MockupList';
import { initializePlans } from '../utils/plans';
import { fetchAdminStats } from '../utils/adminStats';
import toast from 'react-hot-toast';
import type { UserProfile } from '../types/user';
import type { Mockup } from '../types/mockup';

export default function AdminDashboard() {
  const [showUploader, setShowUploader] = useState(false);
  const [editingMockup, setEditingMockup] = useState<Mockup | null>(null);
  const [mockups, setMockups] = useState<Mockup[]>([]);
  const [users, setUsers] = useState<(UserProfile & { id: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    users: {
      total: 0,
      basic: 0,
      pro: 0,
      expert: 0,
      basicPercentage: 0,
      proPercentage: 0,
      expertPercentage: 0
    },
    mockups: 0,
    totalGenerations: 0
  });

  useEffect(() => {
    const initialize = async () => {
      try {
        await initializePlans();
        const [adminStats, mockupsData, usersData] = await Promise.all([
          fetchAdminStats(),
          fetchMockups(),
          fetchUsers()
        ]);
        
        setStats(adminStats);
        setMockups(mockupsData);
        setUsers(usersData);
      } catch (error) {
        console.error('Error initializing dashboard:', error);
        toast.error('Erreur lors du chargement des données');
      } finally {
        setLoading(false);
      }
    };

    initialize();
  }, []);

  const fetchMockups = async () => {
    try {
      const mockupsSnap = await getDocs(collection(db, 'mockups'));
      return mockupsSnap.docs.map(doc => ({
        ...doc.data(),
        firestoreId: doc.id
      })) as Mockup[];
    } catch (error) {
      console.error('Error fetching mockups:', error);
      throw error;
    }
  };

  const fetchUsers = async () => {
    try {
      const usersSnap = await getDocs(collection(db, 'users'));
      return usersSnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as (UserProfile & { id: string })[];
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <UserList 
        users={users} 
        onRefresh={fetchUsers}
        stats={stats.users}
      />

      <MockupList
        mockups={mockups}
        totalGenerations={stats.totalGenerations}
        onRefresh={fetchMockups}
        onShowUploader={() => setShowUploader(true)}
        onEdit={setEditingMockup}
      />

      {showUploader && (
        <MockupUploader
          onClose={() => setShowUploader(false)}
          onSuccess={() => {
            fetchMockups().then(setMockups);
          }}
        />
      )}

      {editingMockup && (
        <MockupEditor
          mockup={editingMockup}
          onClose={() => setEditingMockup(null)}
          onSuccess={() => {
            fetchMockups().then(setMockups);
          }}
        />
      )}
    </div>
  );
}