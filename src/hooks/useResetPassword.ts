import { useState, useEffect } from 'react';
import { verifyPasswordResetCode, confirmPasswordReset } from 'firebase/auth';
import { auth } from '../lib/firebase';

export function useResetPassword(oobCode: string | null) {
  const [isValid, setIsValid] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>();

  useEffect(() => {
    const verifyCode = async () => {
      if (!oobCode) {
        setIsValid(false);
        setIsLoading(false);
        return;
      }

      try {
        await verifyPasswordResetCode(auth, oobCode);
        setIsValid(true);
      } catch (error) {
        setIsValid(false);
        setError('Le lien de réinitialisation est invalide ou a expiré');
      } finally {
        setIsLoading(false);
      }
    };

    verifyCode();
  }, [oobCode]);

  const resetPassword = async (newPassword: string) => {
    if (!oobCode) throw new Error('Code de réinitialisation manquant');
    await confirmPasswordReset(auth, oobCode, newPassword);
  };

  return { isValid, isLoading, error, resetPassword };
}