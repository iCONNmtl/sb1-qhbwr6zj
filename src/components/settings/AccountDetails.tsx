import React, { useState } from 'react';
import { User, Building2, MapPin } from 'lucide-react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import toast from 'react-hot-toast';
import type { UserProfile } from '../../types/user';

interface AccountDetailsProps {
  userId: string;
  userProfile: UserProfile;
  onUpdate: () => void;
}

export default function AccountDetails({ userId, userProfile, onUpdate }: AccountDetailsProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    organizationName: userProfile.organizationName || '',
    address: {
      street: userProfile.address?.street || '',
      city: userProfile.address?.city || '',
      postalCode: userProfile.address?.postalCode || '',
      country: userProfile.address?.country || ''
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        organizationName: formData.organizationName || null,
        address: Object.values(formData.address).some(val => val) 
          ? formData.address 
          : null
      });

      toast.success('Informations mises à jour');
      onUpdate();
    } catch (error) {
      console.error('Error updating user details:', error);
      toast.error('Erreur lors de la mise à jour');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <form onSubmit={handleSubmit} className="space-y-6 border-t border-gray-200 pt-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <User className="h-5 w-5 mr-2" />
            Informations générales
          </h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nom de l'organisation ou nom complet
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Building2 className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={formData.organizationName}
                onChange={(e) => setFormData(prev => ({ ...prev, organizationName: e.target.value }))}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Ma Société ou John Doe"
              />
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <MapPin className="h-5 w-5 mr-2" />
            Adresse
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rue
              </label>
              <input
                type="text"
                value={formData.address.street}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  address: { ...prev.address, street: e.target.value }
                }))}
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="123 rue de la Paix"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ville
              </label>
              <input
                type="text"
                value={formData.address.city}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  address: { ...prev.address, city: e.target.value }
                }))}
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Paris"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Code postal
              </label>
              <input
                type="text"
                value={formData.address.postalCode}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  address: { ...prev.address, postalCode: e.target.value }
                }))}
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="75001"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pays
              </label>
              <input
                type="text"
                value={formData.address.country}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  address: { ...prev.address, country: e.target.value }
                }))}
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="France"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
          >
            {loading ? 'Enregistrement...' : 'Enregistrer'}
          </button>
        </div>
      </form>
    </div>
  );
}