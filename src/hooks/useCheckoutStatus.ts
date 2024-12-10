import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useStore } from '../store/useStore';
import toast from 'react-hot-toast';

export function useCheckoutStatus() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useStore();

  useEffect(() => {
    if (!user) return;

    // Listen for subscription changes
    const unsubscribe = onSnapshot(
      doc(db, 'users', user.uid),
      (doc) => {
        if (doc.exists()) {
          const userData = doc.data();
          const previousPlan = localStorage.getItem('previousPlan');
          const currentPlan = userData.subscription?.plan;

          if (currentPlan && currentPlan !== 'Basic' && currentPlan !== previousPlan) {
            // Show success popup
            toast.success(
              <div className="text-center">
                <p className="font-semibold mb-1">Abonnement activé !</p>
                <p>Votre plan {currentPlan} est maintenant actif</p>
              </div>,
              {
                duration: 5000,
                position: 'top-center',
                className: 'bg-white shadow-lg rounded-lg p-4'
              }
            );

            // Store the new plan to prevent showing the popup again
            localStorage.setItem('previousPlan', currentPlan);
            
            // Navigate to dashboard
            navigate('/dashboard', { replace: true });
          }
        }
      },
      (error) => {
        console.error('Error listening to subscription changes:', error);
        toast.error('Une erreur est survenue lors de la vérification de votre abonnement');
      }
    );

    return () => unsubscribe();
  }, [user, navigate]);
}