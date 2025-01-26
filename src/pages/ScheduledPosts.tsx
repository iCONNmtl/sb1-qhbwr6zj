import React, { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { collection, query, where, onSnapshot, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Calendar, Clock, CheckCircle, XCircle, AlertTriangle, Trash2, Edit } from 'lucide-react';
import DateTimePicker from '../components/scheduling/DateTimePicker';
import toast from 'react-hot-toast';
import type { ScheduledPost } from '../types/scheduling';

export default function ScheduledPosts() {
  const { user } = useStore();
  const [posts, setPosts] = useState<(ScheduledPost & { id: string })[]>([]);
  const [editingPost, setEditingPost] = useState<string | null>(null);
  const [editDate, setEditDate] = useState<Date | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'scheduledPosts'),
      where('userId', '==', user.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const postsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as (ScheduledPost & { id: string })[];

      setPosts(postsData.sort((a, b) => 
        new Date(a.scheduledFor).getTime() - new Date(b.scheduledFor).getTime()
      ));
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const handleEdit = (postId: string) => {
    const post = posts.find(p => p.id === postId);
    if (!post) return;

    setEditingPost(postId);
    setEditDate(new Date(post.scheduledFor));
  };

  const handleSaveEdit = async (postId: string) => {
    if (!editDate) return;

    try {
      const postRef = doc(db, 'scheduledPosts', postId);
      await updateDoc(postRef, {
        scheduledFor: editDate.toISOString()
      });
      
      setEditingPost(null);
      setEditDate(null);
      toast.success('Date mise à jour');
    } catch (error) {
      console.error('Error updating post:', error);
      toast.error('Erreur lors de la mise à jour');
    }
  };

  const handleDelete = async (postId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette programmation ?')) return;

    try {
      await deleteDoc(doc(db, 'scheduledPosts', postId));
      toast.success('Publication supprimée');
    } catch (error) {
      console.error('Error deleting post:', error);
      toast.error('Erreur lors de la suppression');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'published':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'failed':
        return <XCircle className="h-5 w-5 text-red-600" />;
      default:
        return <Clock className="h-5 w-5 text-indigo-600" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'published':
        return 'Publié';
      case 'failed':
        return 'Échec';
      default:
        return 'Programmé';
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-500">Chargement des publications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-gray-900">
        Publications programmées
      </h1>

      {posts.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-8 text-center">
          <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">
            Aucune publication programmée
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contenu
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Plateformes
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
                {posts.map((post) => (
                  <tr key={post.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingPost === post.id ? (
                        <div className="flex items-center space-x-2">
                          <DateTimePicker
                            value={editDate!}
                            onChange={setEditDate}
                            minDate={new Date()}
                          />
                          <button
                            onClick={() => handleSaveEdit(post.id)}
                            className="px-3 py-1 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition text-sm"
                          >
                            OK
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <Calendar className="h-5 w-5 text-gray-400 mr-2" />
                          <span className="text-sm text-gray-900">
                            {new Date(post.scheduledFor).toLocaleDateString('fr-FR', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric',
                              hour: '2-digit'
                            })}h
                          </span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-900">
                        {post.mockups.length} mockup{post.mockups.length > 1 ? 's' : ''}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-2">
                        {post.platforms.map((platform, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-indigo-100 text-indigo-800 text-xs font-medium rounded-full"
                          >
                            {platform.platform}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getStatusIcon(post.status)}
                        <span className="ml-2 text-sm text-gray-900">
                          {getStatusText(post.status)}
                        </span>
                      </div>
                      {post.error && (
                        <div className="flex items-center mt-1 text-xs text-red-600">
                          <AlertTriangle className="h-4 w-4 mr-1" />
                          {post.error}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        {post.status === 'scheduled' && (
                          <button
                            onClick={() => handleEdit(post.id)}
                            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
                            title="Modifier"
                          >
                            <Edit className="h-5 w-5" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(post.id)}
                          className="p-2 text-gray-600 hover:bg-red-100 hover:text-red-600 rounded-lg transition"
                          title="Supprimer"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}