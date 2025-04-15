import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { X, CreditCard, Loader2, User, Mail, MessageSquare, Briefcase, Crown, CheckCircle, FileText } from 'lucide-react';
import { doc, getDoc, collection, runTransaction } from 'firebase/firestore';
import { db } from '../../lib/firebase';
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

// Credit to price conversion rate
const CREDIT_VALUE = 0.025; // 1 credit = 0.025€

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
    company: '',
    message: ''
  });

  // Calculate required credits
  const requiredCredits = Math.ceil(servicePrice / CREDIT_VALUE);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!userId) return;

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
        } else {
          throw new Error('User profile not found');
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
        toast.error('Erreur lors du chargement de votre profil');
        onClose();
      }
    };

    if (isOpen && userId) {
      fetchUserProfile();
    }
  }, [isOpen, userId]);

  const handleSubmitContactForm = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    const requiredFields = ['name', 'email'];
    
    // Check if all required fields are filled
    const missingFields = requiredFields.filter(field => !formData[field as keyof typeof formData]);
    
    if (missingFields.length > 0) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }
    
    // Move to payment step
    setStep('payment');
  };

  const handlePayment = async () => {
    if (!userProfile) {
      toast.error('Profil utilisateur non trouvé');
      return;
    }
    
    const availableCredits = userProfile.subscription?.credits || 0;
    
    // Check if user has sufficient credits
    if (availableCredits < requiredCredits) {
      toast.error(`Crédits insuffisants. Il vous manque ${requiredCredits - availableCredits} crédits.`);
      return;
    }

    setLoading(true);
    
    try {
      // Use a transaction to ensure atomic updates
      await runTransaction(db, async (transaction) => {
        // Get fresh user data
        const userRef = doc(db, 'users', userId);
        const userSnap = await transaction.get(userRef);
        
        if (!userSnap.exists()) {
          throw new Error('User not found');
        }

        const currentCredits = userSnap.data()?.subscription?.credits || 0;
        
        if (currentCredits < requiredCredits) {
          throw new Error('Insufficient credits');
        }

        // Create the order document
        const orderRef = doc(collection(db, 'orders'));
        const orderData = {
          userId,
          serviceId,
          serviceName,
          servicePrice,
          creditsUsed: requiredCredits,
          customerName: formData.name,
          customerEmail: formData.email,
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
              purchasePrice: servicePrice * 0.3,
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
        };

        // Update user credits and create order atomically
        transaction.update(userRef, {
          'subscription.credits': currentCredits - requiredCredits,
          'subscription.updatedAt': new Date().toISOString()
        });
        transaction.set(orderRef, orderData);

        // Create notification
        const notificationRef = doc(collection(db, 'notifications'));
        transaction.set(notificationRef, {
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
      });

      // Move to success step after successful transaction
      setStep('success');
      toast.success('Commande effectuée avec succès');
      
    } catch (error) {
      console.error('Error processing payment:', error);
      
      // Provide more specific error messages based on the error type
      if (error instanceof Error) {
        if (error.message === 'User not found') {
          toast.error('Utilisateur non trouvé. Veuillez vous reconnecter.');
        } else if (error.message === 'Insufficient credits') {
          toast.error('Crédits insuffisants pour effectuer cette commande.');
        } else {
          toast.error('Une erreur est survenue lors du traitement du paiement. Veuillez réessayer.');
        }
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
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
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-76px)]">
          {step === 'contact' && (
            <form onSubmit={handleSubmitContactForm} className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg mb-4">
                <p className="text-sm text-blue-800">
                  Nous vous contacterons par email dans les 24h pour discuter des détails de votre projet.
                </p>
              </div>
              
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
                  Informations complémentaires
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
                    placeholder="Précisez toute information supplémentaire qui pourrait nous aider à mieux comprendre vos besoins..."
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
                    1 crédit = {CREDIT_VALUE.toFixed(3)}€
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Crédits nécessaires:</span>
                    <span className="font-semibold text-gray-900">{requiredCredits}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Crédits disponibles:</span>
                    <span className="font-semibold text-gray-900">{userProfile?.subscription?.credits || 0}</span>
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
                      <span className="text-gray-900">{requiredCredits} crédits</span>
                    </div>
                  </div>
                </div>
              </div>

              {(userProfile?.subscription?.credits || 0) < requiredCredits && (
                <div className="bg-red-50 p-4 rounded-lg flex items-start gap-3">
                  <div className="p-1 bg-red-100 rounded-full">
                    <X className="h-4 w-4 text-red-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-red-800">
                      Crédits insuffisants
                    </p>
                    <p className="text-sm text-red-700 mt-1">
                      Il vous manque {requiredCredits - (userProfile?.subscription?.credits || 0)} crédits pour commander ce service.
                    </p>
                    <Link 
                      to="/pricing"
                      className="mt-2 inline-flex items-center text-sm font-medium text-red-600 hover:text-red-500"
                    >
                      <Crown className="h-4 w-4 mr-1" />
                      Acheter des crédits
                    </Link>
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-3 pt-4">
                <button
                  onClick={handlePayment}
                  disabled={loading || (userProfile?.subscription?.credits || 0) < requiredCredits}
                  className={clsx(
                    "w-full py-3 px-4 rounded-xl flex items-center justify-center transition",
                    loading || (userProfile?.subscription?.credits || 0) < requiredCredits
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-indigo-600 text-white hover:bg-indigo-700"
                  )}
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin mr-2" />
                      Traitement...
                    </>
                  ) : (
                    <>
                      <CreditCard className="h-5 w-5 mr-2" />
                      Payer avec {requiredCredits} crédits
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
                Votre commande a été enregistrée avec succès. Notre équipe vous contactera par email dans les 24h pour démarrer votre projet.
              </p>
              <div className="bg-indigo-50 p-4 rounded-lg mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="h-5 w-5 text-indigo-600" />
                  <h4 className="font-medium text-indigo-900">Prochaines étapes</h4>
                </div>
                <ul className="text-sm text-indigo-800 text-left space-y-2">
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 mt-1.5"></div>
                    <span>Un expert vous contactera par email sous 24h pour discuter de votre projet</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 mt-1.5"></div>
                    <span>Vous recevrez une confirmation avec les détails de votre commande</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 mt-1.5"></div>
                    <span>Vous pouvez suivre l'avancement de votre commande dans votre espace client</span>
                  </li>
                </ul>
              </div>
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