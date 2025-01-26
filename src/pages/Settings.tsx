import React, { useState, useEffect } from 'react';
import { doc, updateDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useStore } from '../store/useStore';
import { ShoppingBag, Camera, BookmarkIcon, Save, Loader2, Plus, Trash2, Edit } from 'lucide-react';
import LogoUploader from '../components/settings/LogoUploader';
import toast from 'react-hot-toast';
import type { UserProfile, PlatformAccount } from '../types/user';

const PLATFORMS = [
  { id: 'etsy', label: 'Etsy', icon: ShoppingBag },
  { id: 'shopify', label: 'Shopify', icon: ShoppingBag },
  { id: 'pinterest', label: 'Pinterest', icon: BookmarkIcon },
  { id: 'instagram', label: 'Instagram', icon: Camera },
];

const TABS = [
  { id: 'platforms', label: 'Plateformes' },
  { id: 'branding', label: 'Branding' }
] as const;

type Tab = typeof TABS[number]['id'];

export default function Settings() {
  const { user } = useStore();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [platformAccounts, setPlatformAccounts] = useState<PlatformAccount[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('platforms');
  const [editingAccount, setEditingAccount] = useState<PlatformAccount | null>(null);
  const [newAccount, setNewAccount] = useState<Partial<PlatformAccount>>({});
  const [showNewAccountForm, setShowNewAccountForm] = useState(false);

  useEffect(() => {
    if (!user) return;

    const unsubscribe = onSnapshot(
      doc(db, 'users', user.uid),
      (doc) => {
        if (doc.exists()) {
          const data = doc.data() as UserProfile;
          setUserProfile(data);
          setPlatformAccounts(data.platformAccounts || []);
        }
      }
    );

    return () => unsubscribe();
  }, [user]);

  const handleSave = async () => {
    if (!user) return;

    setIsSaving(true);
    try {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        platformAccounts
      });
      toast.success('Paramètres enregistrés');
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Erreur lors de l\'enregistrement');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddAccount = () => {
    if (!newAccount.platform || !newAccount.name) {
      toast.error('Veuillez remplir tous les champs');
      return;
    }

    setPlatformAccounts(prev => [...prev, {
      id: Date.now().toString(),
      platform: newAccount.platform,
      name: newAccount.name
    }]);
    setNewAccount({});
    setShowNewAccountForm(false);
  };

  const handleUpdateAccount = () => {
    if (!editingAccount) return;

    setPlatformAccounts(prev => prev.map(account => 
      account.id === editingAccount.id ? editingAccount : account
    ));
    setEditingAccount(null);
  };

  const handleDeleteAccount = (accountId: string) => {
    setPlatformAccounts(prev => prev.filter(account => account.id !== accountId));
  };

  return (
    <div className="max-w-4xl space-y-8">
      <h1 className="text-2xl font-bold text-gray-900">
        Paramètres
      </h1>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                ${activeTab === tab.id
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
        {activeTab === 'platforms' && (
          <>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Comptes de publication
              </h2>
              <p className="text-gray-600 mb-6">
                Gérez vos différents comptes pour chaque plateforme
              </p>

              {/* Liste des comptes */}
              <div className="space-y-4 mb-6">
                {platformAccounts.map(account => (
                  <div 
                    key={account.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
                  >
                    <div className="flex items-center space-x-4">
                      {React.createElement(
                        PLATFORMS.find(p => p.id === account.platform)?.icon || ShoppingBag,
                        { className: "h-5 w-5 text-gray-500" }
                      )}
                      <div>
                        <p className="font-medium text-gray-900">{account.name}</p>
                        <p className="text-sm text-gray-500">{
                          PLATFORMS.find(p => p.id === account.platform)?.label
                        }</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setEditingAccount(account)}
                        className="p-2 text-gray-600 hover:bg-gray-200 rounded-lg transition"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteAccount(account.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Formulaire d'ajout */}
              {showNewAccountForm ? (
                <div className="bg-gray-50 rounded-xl p-4 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Plateforme
                    </label>
                    <select
                      value={newAccount.platform || ''}
                      onChange={(e) => setNewAccount(prev => ({ ...prev, platform: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="">Sélectionner une plateforme</option>
                      {PLATFORMS.map(platform => (
                        <option key={platform.id} value={platform.id}>
                          {platform.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nom du compte
                    </label>
                    <input
                      type="text"
                      value={newAccount.name || ''}
                      onChange={(e) => setNewAccount(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Ex: Mon Shop Principal"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={() => setShowNewAccountForm(false)}
                      className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
                    >
                      Annuler
                    </button>
                    <button
                      onClick={handleAddAccount}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                    >
                      Ajouter
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setShowNewAccountForm(true)}
                  className="flex items-center px-4 py-2 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Ajouter un compte
                </button>
              )}
            </div>

            <div className="flex justify-end pt-6 border-t border-gray-200">
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-200 disabled:opacity-50"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                    Enregistrement...
                  </>
                ) : (
                  <>
                    <Save className="h-5 w-5 mr-2" />
                    Enregistrer
                  </>
                )}
              </button>
            </div>
          </>
        )}

        {activeTab === 'branding' && user && (
          <LogoUploader 
            userId={user.uid}
            currentLogo={userProfile?.logoUrl}
          />
        )}
      </div>

      {/* Modal d'édition */}
      {editingAccount && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Modifier le compte
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Plateforme
                </label>
                <select
                  value={editingAccount.platform}
                  onChange={(e) => setEditingAccount(prev => ({ ...prev!, platform: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                >
                  {PLATFORMS.map(platform => (
                    <option key={platform.id} value={platform.id}>
                      {platform.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom du compte
                </label>
                <input
                  type="text"
                  value={editingAccount.name}
                  onChange={(e) => setEditingAccount(prev => ({ ...prev!, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={() => setEditingAccount(null)}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
                >
                  Annuler
                </button>
                <button
                  onClick={handleUpdateAccount}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                >
                  Mettre à jour
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}