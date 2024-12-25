import React, { useState } from 'react';
import { Upload, Loader2, ExternalLink } from 'lucide-react';
import { createCustomMockup, initializeCustomMockup } from '../../services/customMockupService';
import toast from 'react-hot-toast';

interface CustomMockupUploaderProps {
  userId: string;
}

export default function CustomMockupUploader({ userId }: CustomMockupUploaderProps) {
  const [mockupId, setMockupId] = useState<string>();
  const [driveUrl, setDriveUrl] = useState<string>();
  const [loading, setLoading] = useState(false);

  const handleInitialize = async () => {
    setLoading(true);
    try {
      const { mockupId, driveUrl } = await initializeCustomMockup(userId);
      setMockupId(mockupId);
      setDriveUrl(driveUrl);
      toast.success('Dossier créé avec succès');
    } catch (error) {
      toast.error('Erreur lors de la création du dossier');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!mockupId) return;
    
    setLoading(true);
    try {
      await createCustomMockup(mockupId);
      toast.success('Mockup créé avec succès');
      setMockupId(undefined);
      setDriveUrl(undefined);
    } catch (error) {
      toast.error('Erreur lors de la création du mockup');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="border-b border-gray-100 p-6">
        <h2 className="text-xl font-semibold text-gray-900">
          Upload de votre PSD
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Commencez par créer un dossier partagé pour uploader votre fichier
        </p>
      </div>

      <div className="p-6">
        {!mockupId ? (
          <button
            onClick={handleInitialize}
            disabled={loading}
            className="w-full py-4 px-6 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin mr-2" />
                Création du dossier...
              </>
            ) : (
              <>
                <Upload className="h-5 w-5 mr-2" />
                Uploader mon PSD
              </>
            )}
          </button>
        ) : (
          <div className="space-y-6">
            <div className="bg-indigo-50 rounded-xl p-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center flex-shrink-0">
                  <Upload className="h-6 w-6 text-indigo-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-indigo-900 mb-2">
                    Dossier créé avec succès !
                  </h3>
                  <div className="space-y-4">
                    <p className="text-sm text-indigo-700">
                      Suivez ces étapes pour finaliser la création de votre mockup :
                    </p>
                    <ol className="text-sm text-indigo-700 space-y-2">
                      <li className="flex items-start">
                        <span className="font-medium mr-2">1.</span>
                        Accédez au dossier en cliquant sur le lien ci-dessous
                      </li>
                      <li className="flex items-start">
                        <span className="font-medium mr-2">2.</span>
                        Déposez votre fichier PSD dans le dossier
                      </li>
                      <li className="flex items-start">
                        <span className="font-medium mr-2">3.</span>
                        Cliquez sur "Créer mon mockup" une fois le fichier déposé
                      </li>
                    </ol>
                    <a
                      href={driveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 bg-white text-indigo-600 rounded-lg hover:bg-indigo-50 transition"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Ouvrir le dossier Drive
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={handleCreate}
              disabled={loading}
              className="w-full py-4 px-6 gradient-bg text-white rounded-xl hover:opacity-90 transition flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin mr-2" />
                  Création du mockup...
                </>
              ) : (
                'Créer mon mockup'
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}