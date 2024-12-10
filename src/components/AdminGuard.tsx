import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface AdminGuardProps {
  children: React.ReactNode;
}

export default function AdminGuard({ children }: AdminGuardProps) {
  const { user } = useStore();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdminAccess = async () => {
      if (!user) {
        navigate('/');
        return;
      }

      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (!userDoc.exists() || user.uid !== 'Juvh6BgsXhYsi3loKegWfzRIphG2') {
          navigate('/');
        }
      } catch (error) {
        console.error('Error checking admin access:', error);
        navigate('/');
      }
    };

    checkAdminAccess();
  }, [user, navigate]);

  if (!user || user.uid !== 'Juvh6BgsXhYsi3loKegWfzRIphG2') {
    return null;
  }

  return <>{children}</>;
}