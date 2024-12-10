import React, { useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import toast from 'react-hot-toast';
import type { UserProfile, UserPlan } from '../../types/user';

interface UserEditorProps {
  user: UserProfile & { id: string };
  onClose: () => void;
  onSave: () => void;
}

const PLAN_OPTIONS: UserPlan[] = ['Basic', 'Pro', 'Expert'];

export default function UserEditor({ user, onClose, onSave }: UserEditorProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    plan: user.subscription.plan,
    credits: user.subscription.credits || 0
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const userRef = doc(db, 'users', user.id);
      await updateDoc(userRef, {
        'subscription.plan': formData.plan,
        'subscription.credits': formData.credits
      });

      toast.success('Utilisateur mis à jour avec succès');
      onSave();
      onClose();
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error('Erreur lors de la mise à jour');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold">Modifier l'utilisateur</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Plan
            </label>
            <select
              value={formData.plan}
              onChange={(e) => setFormData({ ...formData, plan: e.target.value as UserPlan })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            >
              {PLAN_OPTIONS.map((plan) => (
                <option key={plan} value={plan}>
                  {plan}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Crédits
            </label>
            <input
              type="number"
              value={formData.credits}
              onChange={(e) => setFormData({ ...formData, credits: Number(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              min="0"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <Loader2 className="h-5 w-5 animate-spin mr-2" />
                Mise à jour...
              </span>
            ) : (
              'Mettre à jour'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}