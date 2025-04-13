import React, { useState, useEffect } from 'react';
import { X, CreditCard, Loader2, User, Mail, Phone, MessageSquare, Briefcase, Crown, CheckCircle } from 'lucide-react';
import { doc, getDoc, addDoc, collection, updateDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { updateUserCredits } from '../../utils/subscription';
import toast from 'react-hot-toast';
import clsx from 'clsx';
import type { UserProfile } from '../../types/user';

interface ServiceOrderDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  userId: string;
  serviceId: string;
  serviceName: string;
  servicePrice: number;
  serviceIcon: React.ElementType;
}

export default function ServiceOrderDialog({
  isOpen,
  onClose,
  onSuccess,
  userId,
  serviceId,
  serviceName,
  servicePrice,
  serviceIcon: Icon
}: ServiceOrderDialogProps) {
  const [step, setStep] = useState<'contact' | 'payment' | 'success'>('contact');
  const [loading, setLoading] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    company: ''
  });

  // Calculate credits needed (1€ = 40 credits)
  const creditsNeeded = Math.ceil(servicePrice * 40);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const userRef = doc(db, 'users', userId);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const userData = userSnap.data() as UserProfile;
          setUserProfile(userData);
          
          // Pre-fill form with user data if available
          setFormData(prev => ({
            ...prev,
            name: userData.fullName || '',
            email: userData.email || '',
            company: userData.organizationName || ''
          }));
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    if (isOpen && userId) {
      fetchUserProfile();
    }
  }, [isOpen, userId]);

  const handleSubmitContactForm = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.name || !formData.email || !formData.phone) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }
    
    // Move to payment step
    setStep('payment');
  };

  const handlePayment = async () => {
    if (!userProfile) return;
    
    const availableCredits = userProfile.subscription.credits || 0;
    
    if (availableCredits < creditsNeeded) {
      toast.error(`Crédits insuffisants. Il vous manque ${creditsNeeded - availableCredits} crédits.`);
      return;
    }
    
    setLoading(true);
    
    try {
      // 1. Deduct credits from user account
      await updateUserCredits(userId, creditsNeeded);
      
      // 2. Create order in Firestore
      const orderRef = await addDoc(collection(db, 'orders'), {
        userId,
        serviceId,
        serviceName,
        servicePrice,
        creditsUsed: creditsNeeded,
        customerName: formData.name,
        customerEmail: formData.email,
        customerPhone: formData.phone,
        customerCompany: formData.company,
        message: formData.message,
        status: 'paid',
        isPaid: true,
        paidAt: new Date().toISOString(),
        paidWithCredits: true,
        platform: 'internal',
        orderId: `SRV-${Date.now()}`,
        items: [
          {
            productId: serviceId,
            variantId: 'digital',
            quantity: 1,
            price: servicePrice,
            purchasePrice: servicePrice * 0.3, // Assuming 30% cost
            size: 'N/A',
            dimensions: {
              cm: 'N/A',
              inches: 'N/A'
            },
            sku: `SRV-${serviceId}`
          }
        ],
        totalAmount: servicePrice,
        purchasePrice: servicePrice * 0.3,
        shippingAddress: {
          street: 'N/A',
          city: 'N/A',
          state: 'N/A',
          postalCode: 'N/A',
          country: 'N/A'
        },
        shippingMethod: {
          carrier: 'Digital',
          method: 'Digital',
          cost: 0,
          estimatedDays: 0
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      
      // 3. Create notification for admin
      await addDoc(collection(db, 'notifications'), {
        type: 'new_service_order',
        orderId: orderRef.id,
        userId,
        serviceId,
        serviceName,
        customerName: formData.name,
        customerEmail: formData.email,
        read: false,
        createdAt: new Date().toISOString()
      });
      
      // 4. Move to success step
      setStep('success');
      
    } catch (error) {
      console.error('Error processing payment:', error);
      toast.error('Une erreur est survenue lors du traitement du paiement');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <Icon className="h-5 w-5 text-indigo-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">
                  {step === 'contact' && 'Commander un service'}
                  {step === 'payment' && 'Paiement'}
                  {step === 'success' && 'Commande confirmée'}
                </h3>
                <p className="text-sm text-gray-500">
                  {serviceName}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-lg transition"
              disabled={loading}
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {step === 'contact' && (
            <form onSubmit={handleSubmitContactForm} className="space-y-4">
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Nom complet <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Jean Dupont"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Email <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="jean.dupont@example.com"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Téléphone <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="+33 6 12 34 56 78"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Entreprise
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Briefcase className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Nom de votre entreprise (optionnel)"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Message
                </label>
                <div className="relative">
                  <div className="absolute top-3 left-3 flex items-start pointer-events-none">
                    <MessageSquare className="h-5 w-5 text-gray-400" />
                  </div>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    rows={4}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Décrivez votre projet ou vos besoins spécifiques..."
                  />
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full py-3 px-4 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition flex items-center justify-center"
                >
                  Continuer vers le paiement
                </button>
              </div>
            </form>
          )}

          {step === 'payment' && (
            <div className="space-y-6">
              <div className="bg-indigo-50 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <CreditCard className="h-5 w-5 text-indigo-600 mr-2" />
                    <span className="font-medium text-gray-900">Paiement en crédits</span>
                  </div>
                  <div className="text-sm text-indigo-600 font-medium">
                    1 crédit = 0.025€
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Crédits nécessaires:</span>
                    <span className="font-semibold text-gray-900">{creditsNeeded}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Crédits disponibles:</span>
                    <span className="font-semibold text-gray-900">{userProfile?.subscription.credits || 0}</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-6">
                <h4 className="font-medium text-gray-900 mb-4">Récapitulatif de commande</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">{serviceName}</span>
                    <span className="font-medium text-gray-900">{servicePrice}€</span>
                  </div>
                  <div className="pt-3 border-t border-gray-200">
                    <div className="flex justify-between font-medium">
                      <span className="text-gray-900">Total</span>
                      <span className="text-indigo-600">{servicePrice}€</span>
                    </div>
                    <div className="flex justify-between text-sm mt-1">
                      <span className="text-gray-500">Équivalent en crédits</span>
                      <span className="text-gray-900">{creditsNeeded} crédits</span>
                    </div>
                  </div>
                </div>
              </div>

              {(userProfile?.subscription.credits || 0) < creditsNeeded && (
                <div className="bg-red-50 p-4 rounded-lg flex items-start gap-3">
                  <div className="p-1 bg-red-100 rounded-full">
                    <X className="h-4 w-4 text-red-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-red-800">
                      Crédits insuffisants
                    </p>
                    <p className="text-sm text-red-700 mt-1">
                      Il vous manque {creditsNeeded - (userProfile?.subscription.credits || 0)} crédits pour commander ce service.
                    </p>
                    <a 
                      href="/pricing" 
                      className="mt-2 inline-flex items-center text-sm font-medium text-red-600 hover:text-red-500"
                    >
                      <Crown className="h-4 w-4 mr-1" />
                      Acheter des crédits
                    </a>
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-3 pt-4">
                <button
                  onClick={handlePayment}
                  disabled={loading || (userProfile?.subscription.credits || 0) < creditsNeeded}
                  className="w-full py-3 px-4 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin mr-2" />
                      Traitement...
                    </>
                  ) : (
                    <>
                      <CreditCard className="h-5 w-5 mr-2" />
                      Payer avec {creditsNeeded} crédits
                    </>
                  )}
                </button>
                <button
                  onClick={() => setStep('contact')}
                  disabled={loading}
                  className="w-full py-3 px-4 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition"
                >
                  Retour
                </button>
              </div>
            </div>
          )}

          {step === 'success' && (
            <div className="text-center py-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Commande confirmée !
              </h3>
              <p className="text-gray-600 mb-6">
                Votre commande a été enregistrée avec succès. Notre équipe vous contactera dans les plus brefs délais pour démarrer votre projet.
              </p>
              <button
                onClick={onSuccess}
                className="px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition"
              >
                Fermer
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}