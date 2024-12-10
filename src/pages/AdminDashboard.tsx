import React, { useState, useEffect } from 'react';
import { BarChart, Users, Image as ImageIcon, Eye, EyeOff, CreditCard, Edit, Settings } from 'lucide-react';
import { collection, getDocs, query, where, updateDoc, doc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import MockupUploader from '../components/MockupUploader';
import MockupEditor from '../components/MockupEditor';
import ImageUrlInput from '../components/ImageUrlInput';
import ImageLoader from '../components/ImageLoader';
import AspectRatioBadge from '../components/AspectRatioBadge';
import UserList from '../components/admin/UserList';
import { getMockupUsageCount } from '../utils/mockups';
import { initializePlans } from '../utils/plans';
import { fetchAdminStats } from '../utils/adminStats';
import { usePagination } from '../hooks/usePagination';
import Pagination from '../components/Pagination';
import toast from 'react-hot-toast';
import type { UserProfile, PlanConfig } from '../types/user';
import type { Mockup } from '../types/mockup';

interface PlanEditorProps {
  plan: PlanConfig;
  onSave: (updatedPlan: PlanConfig) => Promise<void>;
  onClose: () => void;
}

function PlanEditor({ plan, onSave, onClose }: PlanEditorProps) {
  const [formData, setFormData] = useState(plan);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSave(formData);
      toast.success('Plan mis à jour avec succès');
      onClose();
    } catch (error) {
      toast.error('Erreur lors de la mise à jour du plan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold">Modifier le plan {plan.name}</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <Settings className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Prix (€)
            </label>
            <input
              type="number"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              min="0"
              step="1"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre de crédits
            </label>
            <input
              type="number"
              value={formData.credits}
              onChange={(e) => setFormData({ ...formData, credits: Number(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              min="1"
              step="1"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? 'Mise à jour...' : 'Mettre à jour'}
          </button>
        </form>
      </div>
    </div>
  );
}

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
    totalGenerations: 0,
    revenue: 0
  });

  const {
    currentPage: mockupsPage,
    setCurrentPage: setMockupsPage,
    pageSize: mockupsPageSize,
    setPageSize: setMockupsPageSize,
    totalItems: totalMockups,
    paginatedItems: paginatedMockups
  } = usePagination(mockups);

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
      const mockupsData = mockupsSnap.docs.map(doc => ({
        ...doc.data(),
        firestoreId: doc.id
      })) as Mockup[];

      const mockupsWithUsage = await Promise.all(
        mockupsData.map(async mockup => ({
          ...mockup,
          usageCount: await getMockupUsageCount(mockup.id)
        }))
      );

      return mockupsWithUsage.sort((a, b) => (b.usageCount || 0) - (a.usageCount || 0));
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

  const toggleMockupStatus = async (mockup: Mockup) => {
    try {
      const mockupRef = doc(db, 'mockups', mockup.firestoreId);
      await updateDoc(mockupRef, {
        active: !mockup.active
      });
      
      setMockups(mockups.map(m => 
        m.id === mockup.id ? { ...m, active: !m.active } : m
      ));
      
      toast.success(`Mockup ${!mockup.active ? 'activé' : 'désactivé'}`);
    } catch (error) {
      toast.error('Erreur lors de la mise à jour du statut');
    }
  };

  const handleImageUpdate = async (mockup: Mockup, url: string) => {
    try {
      const mockupRef = doc(db, 'mockups', mockup.firestoreId);
      await updateDoc(mockupRef, { previewUrl: url });
      
      setMockups(mockups.map(m => 
        m.id === mockup.id ? { ...m, previewUrl: url } : m
      ));
    } catch (error) {
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-indigo-100 rounded-lg">
              <Users className="h-6 w-6 text-indigo-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Utilisateurs</p>
              <p className="text-2xl font-semibold text-gray-900">
                {stats.users.total}
              </p>
              <div className="mt-1 text-sm">
                <span className="text-blue-600">
                  {stats.users.basic} Basic ({stats.users.basicPercentage}%)
                </span>
                {' • '}
                <span className="text-green-600">
                  {stats.users.pro} Pro ({stats.users.proPercentage}%)
                </span>
                {' • '}
                <span className="text-purple-600">
                  {stats.users.expert} Expert ({stats.users.expertPercentage}%)
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-indigo-100 rounded-lg">
              <ImageIcon className="h-6 w-6 text-indigo-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Mockups disponibles</p>
              <p className="text-2xl font-semibold text-gray-900">
                {stats.mockups}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-indigo-100 rounded-lg">
              <BarChart className="h-6 w-6 text-indigo-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Mockups générés</p>
              <p className="text-2xl font-semibold text-gray-900">
                {stats.totalGenerations}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-indigo-100 rounded-lg">
              <CreditCard className="h-6 w-6 text-indigo-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Revenus (30j)</p>
              <p className="text-2xl font-semibold text-gray-900">
                {stats.revenue}€
              </p>
            </div>
          </div>
        </div>
      </div>

      <UserList users={users} onRefresh={fetchUsers} />

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">
            Liste des mockups
          </h2>
          <button
            onClick={() => setShowUploader(true)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          >
            Ajouter un mockup
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Prévisualisation
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nom
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Format
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Catégorie
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Utilisations
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedMockups.map((mockup) => (
                <tr key={mockup.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="relative w-20 h-20">
                      {mockup.previewUrl ? (
                        <ImageLoader
                          src={mockup.previewUrl}
                          alt={mockup.name}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center">
                          <ImageIcon className="h-8 w-8 text-gray-400" />
                        </div>
                      )}
                      <AspectRatioBadge ratio={mockup.aspectRatio} />
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-mono text-gray-600">
                      {mockup.id}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {mockup.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                      {mockup.aspectRatio}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-indigo-100 text-indigo-800">
                      {mockup.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-gray-900">
                      {mockup.usageCount || 0}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      mockup.active
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {mockup.active ? 'Actif' : 'Inactif'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setEditingMockup(mockup)}
                        className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                        title="Modifier"
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                      <ImageUrlInput
                        mockupId={mockup.id}
                        currentUrl={mockup.previewUrl}
                        onUpdate={(url) => handleImageUpdate(mockup, url)}
                      />
                      <button
                        onClick={() => toggleMockupStatus(mockup)}
                        className={`p-2 rounded-lg transition ${
                          mockup.active
                            ? 'text-red-600 hover:bg-red-50'
                            : 'text-green-600 hover:bg-green-50'
                        }`}
                      >
                        {mockup.active ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Pagination
          currentPage={mockupsPage}
          totalItems={totalMockups}
          pageSize={mockupsPageSize}
          onPageChange={setMockupsPage}
          onPageSizeChange={setMockupsPageSize}
        />
      </div>

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