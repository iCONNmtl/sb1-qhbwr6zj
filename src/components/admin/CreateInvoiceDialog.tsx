import React, { useState, useEffect } from 'react';
import { X, FileText, Loader2, Building2, MapPin, Mail, Phone, Calendar, Layers } from 'lucide-react';
import { collection, addDoc, doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { nanoid } from 'nanoid';
import toast from 'react-hot-toast';
import type { Order } from '../../types/order';
import type { UserProfile } from '../../types/user';

interface CreateInvoiceDialogProps {
  order: Order;
  onClose: () => void;
  onSuccess: () => void;
}

const MAKE_WEBHOOK_URL = 'https://hook.eu1.make.com/s4eqtc0qed24pwb0svc59wgwmbuwzjeq';

export default function CreateInvoiceDialog({ order, onClose, onSuccess }: CreateInvoiceDialogProps) {
  const [loading, setLoading] = useState(false);
  const [note, setNote] = useState('');
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [invoiceNumber] = useState(`INV-${nanoid(8).toUpperCase()}`);
  const [invoiceDate] = useState(new Date().toISOString());

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const userRef = doc(db, 'users', order.userId);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setUserProfile(userSnap.data() as UserProfile);
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    fetchUserProfile();
  }, [order.userId]);

  const generateInvoiceHtml = () => {
    return `
    <div style="
      position: relative;
      width: 595px;
      height: 842px;
      overflow: hidden;
      font-family: 'Inter', system-ui, -apple-system, sans-serif;
      background: white;
      padding: 48px;
      margin: 0 auto;
    ">
      <!-- Header -->
      <div style="
        position: absolute;
        left: 48px;
        top: 48px;
        display: flex;
        justify-content: space-between;
        width: calc(100% - 96px);
      ">
        <div style="
          display: flex;
          align-items: flex-start;
          gap: 12px;
        ">
          <img 
            src="https://d2v7vpg8oce97p.cloudfront.net/Branding/LogoPixmock.webp" 
            alt="Pixmock" 
            style="
              width: 40px;
              height: 40px;
              object-fit: contain;
            "
          >
          <div style="padding-top: 2px;">
            <h1 style="
              font-size: 16pt;
              font-weight: 600;
              color: #1f2937;
              margin: 0 0 2px 0;
            ">Pixmock</h1>
            <a href="mailto:contact@pixmock.com" style="
              color: #4f46e5;
              text-decoration: none;
              font-size: 9pt;
            ">contact@pixmock.com</a>
          </div>
        </div>
        <div style="text-align: right;">
          <div style="
            font-size: 12pt;
            font-weight: 600;
            color: #4f46e5;
            margin-bottom: 2px;
          ">Facture ${invoiceNumber}</div>
          <div style="
            color: #6b7280;
            font-size: 9pt;
          ">Date: ${new Date(invoiceDate).toLocaleDateString()}</div>
        </div>
      </div>

      <!-- Addresses -->
      <div style="
        position: absolute;
        left: 48px;
        top: 144px;
        display: flex;
        justify-content: space-between;
        width: calc(100% - 96px);
      ">
        <div style="max-width: 200px;">
          <div style="
            font-weight: 600;
            margin-bottom: 8px;
            color: #4b5563;
            font-size: 9pt;
            text-transform: uppercase;
            letter-spacing: 0.05em;
          ">Facturé à :</div>
          <div style="font-size: 9pt; line-height: 1.6;">
            <div style="font-weight: 500;">${userProfile?.organizationName}</div>
            <div>${userProfile?.address?.street}</div>
            <div>${userProfile?.address?.postalCode} ${userProfile?.address?.city}</div>
            <div>${userProfile?.address?.country}</div>
          </div>
        </div>
        <div style="max-width: 200px;">
          <div style="
            font-weight: 600;
            margin-bottom: 8px;
            color: #4b5563;
            font-size: 9pt;
            text-transform: uppercase;
            letter-spacing: 0.05em;
          ">Expédié à :</div>
          <div style="font-size: 9pt; line-height: 1.6;">
            <div style="font-weight: 500;">${order.customerName}</div>
            <div>${order.shippingAddress.street}</div>
            <div>${order.shippingAddress.postalCode} ${order.shippingAddress.city}</div>
            <div>${order.shippingAddress.country}</div>
          </div>
        </div>
      </div>

      <!-- Items -->
      <div style="
        position: absolute;
        left: 48px;
        top: 300px;
        width: calc(100% - 96px);
      ">
        <!-- Column Headers -->
        <div style="
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
          border-bottom: 2px solid #e5e7eb;
          font-size: 9pt;
          font-weight: 600;
          color: #4b5563;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        ">
          <div style="width: 50%;">Produit</div>
          <div style="text-align: right;">Prix unitaire</div>
          <div style="text-align: right;">Quantité</div>
          <div style="text-align: right;">Total</div>
        </div>

        ${order.items.map((item, index) => `
          <div style="
            display: flex;
            justify-content: space-between;
            padding: 10px 0;
            border-bottom: 1px solid #e5e7eb;
            font-size: 9pt;
          ">
            <div style="width: 50%;">
              <div style="font-weight: 500; color: #1f2937;">${item.size}</div>
              <div style="color: #6b7280; font-size: 8pt; margin-top: 2px;">${item.dimensions.cm}</div>
            </div>
            <div style="text-align: right;">${item.purchasePrice.toFixed(2)}€</div>
            <div style="text-align: right;">${item.quantity}</div>
            <div style="text-align: right;">${(item.purchasePrice * item.quantity).toFixed(2)}€</div>
          </div>
        `).join('')}

        <!-- Totals -->
        <div style="
          margin-top: 20px;
          padding-top: 12px;
          border-top: 2px solid #e5e7eb;
        ">
          <div style="
            display: flex;
            justify-content: space-between;
            font-size: 9pt;
            margin-bottom: 8px;
          ">
            <div style="flex: 1;"></div>
            <div style="text-align: right; font-weight: 600;">Sous-total</div>
            <div style="text-align: right; width: 100px;">${order.purchasePrice.toFixed(2)}€</div>
          </div>
          <div style="
            display: flex;
            justify-content: space-between;
            font-size: 9pt;
            margin-bottom: 8px;
          ">
            <div style="flex: 1;"></div>
            <div style="text-align: right; font-weight: 600;">Livraison (${order.shippingMethod.carrier})</div>
            <div style="text-align: right; width: 100px;">${order.shippingMethod.cost.toFixed(2)}€</div>
          </div>
          <div style="
            display: flex;
            justify-content: space-between;
            font-size: 10pt;
            color: #4f46e5;
            font-weight: 600;
          ">
            <div style="flex: 1;"></div>
            <div style="text-align: right;">Total TTC</div>
            <div style="text-align: right; width: 100px;">${(order.purchasePrice + order.shippingMethod.cost).toFixed(2)}€</div>
          </div>
        </div>
      </div>

      ${note ? `
        <div style="
          position: absolute;
          left: 48px;
          bottom: 120px;
          width: calc(100% - 96px);
          padding: 12px;
          background-color: #f3f4f6;
          border-radius: 6px;
          font-size: 9pt;
        ">
          <div style="font-weight: 600; margin-bottom: 6px; color: #4b5563;">Note</div>
          <div style="color: #4b5563;">${note}</div>
        </div>
      ` : ''}

      <!-- Footer -->
      <div style="
        position: absolute;
        bottom: 48px;
        left: 48px;
        right: 48px;
        padding-top: 12px;
        border-top: 1px solid #e5e7eb;
        text-align: center;
        color: #6b7280;
        font-size: 8pt;
      ">
        <div style="margin-bottom: 4px;">Commande ${order.orderId}</div>
        <div>Facture générée automatiquement par Pixmock</div>
      </div>
    </div>
  `;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Vérifier que les informations du vendeur sont complètes
      if (!userProfile?.organizationName || !userProfile?.address) {
        throw new Error('Informations vendeur incomplètes');
      }

      // Créer le document dans Firestore
      const docRef = await addDoc(collection(db, 'invoices'), {
        userId: order.userId,
        orderId: order.orderId,
        number: invoiceNumber,
        amount: order.purchasePrice,
        type: 'order',
        note: note.trim() || null,
        createdAt: invoiceDate,
        paidAt: order.paidAt || invoiceDate,
        status: 'pending'
      });

      // Appeler le webhook Make avec la structure HTML complète
      const response = await fetch(MAKE_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          invoiceId: docRef.id,
          html: generateInvoiceHtml()
        })
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la génération de la facture');
      }

      const result = await response.json();
      
      if (!result.success || !result.data?.invoiceUrl) {
        throw new Error('Format de réponse invalide');
      }

      // Mettre à jour le document avec l'URL de la facture
      await updateDoc(doc(db, 'invoices', docRef.id), {
        url: result.data.invoiceUrl,
        status: 'completed'
      });

      toast.success('Facture créée avec succès');
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error('Error creating invoice:', error);
      toast.error(error.message || 'Erreur lors de la création de la facture');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-2xl">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Créer une facture
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Preview */}
          <div className="border border-gray-200 rounded-xl p-6 space-y-6">
            {/* Company Logo and Info */}
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <Layers className="h-6 w-6 text-indigo-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Pixmock</h3>
                <a href="mailto:contact@pixmock.com" className="text-sm text-indigo-600 hover:text-indigo-500">
                  contact@pixmock.com
                </a>
              </div>
            </div>

            {/* Invoice Header */}
            <div className="flex justify-between items-start">
              <div>
                <div className="text-sm text-gray-500">Facture n°</div>
                <div className="text-lg font-medium text-gray-900">{invoiceNumber}</div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-500 flex items-center justify-end gap-1">
                  <Calendar className="h-4 w-4" />
                  Date de facture
                </div>
                <div className="text-lg font-medium text-gray-900">
                  {new Date(invoiceDate).toLocaleDateString()}
                </div>
              </div>
            </div>

            {/* Seller and Customer Info */}
            <div className="flex justify-between">
              {/* Seller Info */}
              <div>
                <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-gray-500" />
                  Informations vendeur
                </h4>
                {userProfile?.organizationName ? (
                  <div className="text-sm space-y-1">
                    <p className="font-medium text-gray-900">{userProfile.organizationName}</p>
                    {userProfile.address && (
                      <>
                        <p className="text-gray-600">{userProfile.address.street}</p>
                        <p className="text-gray-600">
                          {userProfile.address.postalCode} {userProfile.address.city}
                        </p>
                        <p className="text-gray-600">{userProfile.address.country}</p>
                      </>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-red-600">
                    Informations vendeur manquantes
                  </p>
                )}
              </div>

              {/* Customer Info */}
              <div>
                <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  Informations client
                </h4>
                <div className="text-sm space-y-1">
                  <p className="font-medium text-gray-900">{order.customerName}</p>
                  <p className="text-gray-600">{order.shippingAddress.street}</p>
                  <p className="text-gray-600">
                    {order.shippingAddress.postalCode} {order.shippingAddress.city}
                  </p>
                  <p className="text-gray-600">{order.shippingAddress.country}</p>
                  <p className="text-gray-600 flex items-center gap-1">
                    <Mail className="h-3 w-3" />
                    {order.customerEmail}
                  </p>
                  {order.shippingAddress.phone && (
                    <p className="text-gray-600 flex items-center gap-1">
                      <Phone className="h-3 w-3" />
                      {order.shippingAddress.phone}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Order Details */}
            <div>
              <h4 className="font-medium text-gray-900 mb-4">Détails de la commande</h4>
              <table className="w-full text-sm">
                <thead className="border-b border-gray-200">
                  <tr>
                    <th className="py-2 text-left font-medium text-gray-500">Produit</th>
                    <th className="py-2 text-right font-medium text-gray-500">Prix unitaire</th>
                    <th className="py-2 text-right font-medium text-gray-500">Quantité</th>
                    <th className="py-2 text-right font-medium text-gray-500">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {order.items.map((item, index) => (
                    <tr key={index}>
                      <td className="py-3">
                        <div>
                          <div className="font-medium text-gray-900">{item.size}</div>
                          <div className="text-gray-500">{item.dimensions.cm}</div>
                        </div>
                      </td>
                      <td className="py-3 text-right">{item.purchasePrice.toFixed(2)}€</td>
                      <td className="py-3 text-right">{item.quantity}</td>
                      <td className="py-3 text-right font-medium">
                        {(item.purchasePrice * item.quantity).toFixed(2)}€
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="border-t border-gray-200">
                  <tr>
                    <td colSpan={3} className="py-3 text-right font-medium">
                      Sous-total
                    </td>
                    <td className="py-3 text-right font-medium">
                      {order.purchasePrice.toFixed(2)}€
                    </td>
                  </tr>
                  <tr>
                    <td colSpan={3} className="py-3 text-right font-medium">
                      Livraison ({order.shippingMethod.carrier})
                    </td>
                    <td className="py-3 text-right font-medium">
                      {order.shippingMethod.cost.toFixed(2)}€
                    </td>
                  </tr>
                  <tr>
                    <td colSpan={3} className="py-3 text-right font-medium text-lg">
                      Total TTC
                    </td>
                    <td className="py-3 text-right font-medium text-lg text-indigo-600">
                      {(order.purchasePrice + order.shippingMethod.cost).toFixed(2)}€
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Note (optionnelle)
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Ajouter une note à la facture..."
            />
          </div>

          <div className="flex flex-col gap-3">
            <button
              type="submit"
              disabled={loading || !userProfile?.organizationName}
              className="w-full py-3 px-4 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition flex items-center justify-center disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin mr-2" />
                  Création...
                </>
              ) : (
                <>
                  <FileText className="h-5 w-5 mr-2" />
                  Créer la facture
                </>
              )}
            </button>
            {!userProfile?.organizationName && (
              <p className="text-sm text-red-600 text-center">
                Veuillez d'abord configurer vos informations vendeur dans les paramètres
              </p>
            )}
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="w-full py-3 px-4 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition"
            >
              Annuler
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}