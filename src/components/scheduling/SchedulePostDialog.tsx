import React, { useState } from 'react';
import { X, Calendar, Loader2 } from 'lucide-react';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import DateTimePicker from './DateTimePicker';
import toast from 'react-hot-toast';
import type { ScheduledPost } from '../../types/scheduling';
import type { PlatformAccount } from '../../types/user';

interface SchedulePostDialogProps {
  userId: string;
  mockups: {
    id: string;
    name: string;
    url: string;
    platform?: string;
  }[];
  platforms: {
    accountId: string;
    platform: string;
    name: string;
    productId?: string;
    content?: string;
  }[];
  onClose: () => void;
}

export default function SchedulePostDialog({ 
  userId, 
  mockups, 
  platforms,
  onClose 
}: SchedulePostDialogProps) {
  const [scheduledDate, setScheduledDate] = useState(() => {
    const date = new Date();
    date.setHours(date.getHours() + 1);
    date.setMinutes(0);
    date.setSeconds(0);
    date.setMilliseconds(0);
    return date;
  });
  const [loading, setLoading] = useState(false);

  const handleSchedule = async () => {
    setLoading(true);
    try {
      // Créer le document de programmation dans Firestore
      const scheduledPost: Omit<ScheduledPost, 'id'> = {
        userId,
        mockups,
        platforms,
        scheduledFor: scheduledDate.toISOString(),
        status: 'scheduled',
        createdAt: new Date().toISOString()
      };

      // Ajouter à Firestore
      const docRef = await addDoc(collection(db, 'scheduledPosts'), scheduledPost);

      // Appeler le webhook Make
      const response = await fetch('https://hook.eu1.make.com/1brcdh36omu22jrtb06fwrpkb39nkw9b', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          postId: docRef.id,
          userId,
          mockups,
          platforms,
          scheduledFor: scheduledDate.toISOString()
        })
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la programmation');
      }

      toast.success('Publication programmée avec succès');
      onClose();
    } catch (error) {
      console.error('Error scheduling post:', error);
      toast.error('Erreur lors de la programmation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-gray-900">
            Programmer la publication
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-6">
          <DateTimePicker
            value={scheduledDate}
            onChange={setScheduledDate}
            minDate={new Date()}
          />

          <div className="bg-indigo-50 rounded-lg p-4">
            <h4 className="font-medium text-indigo-900 mb-2">
              Résumé de la publication
            </h4>
            <ul className="space-y-2 text-sm text-indigo-900">
              <li>• {mockups.length} mockup{mockups.length > 1 ? 's' : ''}</li>
              <li>• {platforms.length} compte{platforms.length > 1 ? 's' : ''} :</li>
              <ul className="ml-4 mt-1 space-y-1">
                {platforms.map((platform, index) => (
                  <li key={index}>
                    - {platform.name} ({platform.platform})
                  </li>
                ))}
              </ul>
              <li>• Publication prévue le {scheduledDate.toLocaleDateString()} à {scheduledDate.getHours()}h</li>
            </ul>
          </div>

          <div className="flex flex-col gap-3">
            <button
              onClick={handleSchedule}
              disabled={loading}
              className="w-full py-3 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition flex items-center justify-center disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin mr-2" />
                  Programmation...
                </>
              ) : (
                <>
                  <Calendar className="h-5 w-5 mr-2" />
                  Programmer
                </>
              )}
            </button>
            <button
              onClick={onClose}
              disabled={loading}
              className="w-full py-3 px-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
            >
              Annuler
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}