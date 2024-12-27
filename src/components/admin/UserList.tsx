import React, { useState } from 'react';
import { Edit, Mail, Calendar, CreditCard } from 'lucide-react';
import { usePagination } from '../../hooks/usePagination';
import Pagination from '../Pagination';
import UserEditor from './UserEditor';
import type { UserProfile } from '../../types/user';

interface UserStats {
  total: number;
  basic: number;
  pro: number;
  expert: number;
  basicPercentage: number;
  proPercentage: number;
  expertPercentage: number;
}

interface UserListProps {
  users: (UserProfile & { id: string; generationCount?: number })[];
  onRefresh: () => Promise<void>;
  stats: UserStats;
}

export default function UserList({ users, onRefresh, stats }: UserListProps) {
  const [editingUser, setEditingUser] = useState<(UserProfile & { id: string }) | null>(null);
  const {
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    totalItems,
    paginatedItems
  } = usePagination(users);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900">
          Liste des utilisateurs
        </h2>
        <div className="mt-2 flex flex-wrap gap-4 text-sm text-gray-600">
          <div>
            {stats.total} utilisateurs au total
          </div>
          <div className="flex gap-3">
            <span className="text-blue-600">
              {stats.basic} Basic ({stats.basicPercentage}%)
            </span>
            <span className="text-green-600">
              {stats.pro} Pro ({stats.proPercentage}%)
            </span>
            <span className="text-purple-600">
              {stats.expert} Expert ({stats.expertPercentage}%)
            </span>
          </div>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Plan
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Crédits
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Générations
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date d'inscription
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedItems.map((user) => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <Mail className="h-5 w-5 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-900">{user.email}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    user.subscription.plan === 'Expert'
                      ? 'bg-purple-100 text-purple-800'
                      : user.subscription.plan === 'Pro'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {user.subscription.plan}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <CreditCard className="h-5 w-5 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-900">
                      {user.subscription.credits || 0}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-indigo-100 text-indigo-800">
                    {user.generationCount || 0}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-900">
                      {formatDate(user.createdAt)}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => setEditingUser(user)}
                    className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                    title="Modifier"
                  >
                    <Edit className="h-5 w-5" />
                  </button>
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

      {editingUser && (
        <UserEditor
          user={editingUser}
          onClose={() => setEditingUser(null)}
          onSave={onRefresh}
        />
      )}
    </div>
  );
}