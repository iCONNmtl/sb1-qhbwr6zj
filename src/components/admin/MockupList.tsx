import React from 'react';
import { Eye, EyeOff, Edit, Image } from 'lucide-react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import ImageUrlInput from '../ImageUrlInput';
import ImageLoader from '../ImageLoader';
import AspectRatioBadge from '../AspectRatioBadge';
import { usePagination } from '../../hooks/usePagination';
import Pagination from '../Pagination';
import toast from 'react-hot-toast';
import type { Mockup } from '../../types/mockup';

interface MockupListProps {
  mockups: Mockup[];
  totalGenerations: number;
  onRefresh: () => Promise<void>;
  onShowUploader: () => void;
  onEdit: (mockup: Mockup) => void;
}

export default function MockupList({
  mockups,
  totalGenerations,
  onRefresh,
  onShowUploader,
  onEdit
}: MockupListProps) {
  const {
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    totalItems,
    paginatedItems
  } = usePagination(mockups);

  const toggleMockupStatus = async (mockup: Mockup) => {
    try {
      const mockupRef = doc(db, 'mockups', mockup.firestoreId!);
      await updateDoc(mockupRef, {
        active: !mockup.active
      });
      await onRefresh();
      toast.success(`Mockup ${!mockup.active ? 'activé' : 'désactivé'}`);
    } catch (error) {
      toast.error('Erreur lors de la mise à jour du statut');
    }
  };

  const handleImageUpdate = async (mockup: Mockup, url: string) => {
    try {
      const mockupRef = doc(db, 'mockups', mockup.firestoreId!);
      await updateDoc(mockupRef, { previewUrl: url });
      await onRefresh();
    } catch (error) {
      throw error;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-200 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            Liste des mockups
          </h2>
          <p className="mt-1 text-sm text-gray-600">
            {mockups.length} mockups disponibles • {totalGenerations} mockups générés
          </p>
        </div>
        <button
          onClick={onShowUploader}
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
                Statut
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedItems.map((mockup) => (
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
                        <Image className="h-8 w-8 text-gray-400" />
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
                      onClick={() => onEdit(mockup)}
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
        currentPage={currentPage}
        totalItems={totalItems}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
        onPageSizeChange={setPageSize}
      />
    </div>
  );
}