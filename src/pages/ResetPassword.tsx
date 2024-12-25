import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Lock, AlertCircle } from 'lucide-react';
import { useResetPassword } from '../hooks/useResetPassword';
import ResetPasswordForm from '../components/auth/ResetPasswordForm';
import ResetPasswordSuccess from '../components/auth/ResetPasswordSuccess';
import ResetPasswordError from '../components/auth/ResetPasswordError';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const oobCode = searchParams.get('oobCode');
  const { isValid, isLoading, error, resetPassword } = useResetPassword(oobCode);

  if (isLoading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!oobCode || !isValid) {
    return <ResetPasswordError error={error} />;
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="bg-white p-8 rounded-xl shadow-sm">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="h-8 w-8 text-indigo-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">
              Réinitialiser votre mot de passe
            </h1>
          </div>

          <ResetPasswordForm 
            oobCode={oobCode} 
            onReset={resetPassword}
            onSuccess={() => navigate('/login')}
          />
        </div>
      </div>
    </div>
  );
}