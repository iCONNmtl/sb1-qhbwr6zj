import React, { useState } from 'react';
import { X, FileText, Loader2 } from 'lucide-react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { nanoid } from 'nanoid';
import toast from 'react-hot-toast';
import type { Order } from '../../types/order';

interface CreateInvoiceDialogProps {
  order: Order;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreateInvoiceDialog({ order, onClose, onSuccess }: CreateInvoiceDialogProps) {
  const [loading, setLoading] = useState(false);
  const [description, setDescription] = useState(`Commande ${order.orderId}`);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const invoiceNumber = `INV-${nanoid(8).toUpperCase()}`;
      
      // Create invoice document
      await addDoc(collection(db, 'invoices'), {
        userId: order.userId,
        number: invoiceNumber,
        amount: order.totalAmount,
        type: 'credits',
        description,
        createdAt: new Date().toISOString(),
        paidAt: order.paidAt || new Date().toISOString(),
        orderId: order.orderId,
        // The URL will be generated by a cloud function and updated later
        url: null
      });

      toast.success('Facture créée avec succès');
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error creating invoice:', error);
      toast.error('Erreur lors de la création de la facture');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-gray-900">
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
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Client:</span>
              <span className="font-medium text-gray-900">{order.customerName}</span>
            </div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Email:</span>
              <span className="text-gray-900">{order.customerEmail}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Montant:</span>
              <span className="font-medium text-gray-900">{order.totalAmount.toFixed(2)}€</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>

          <div className="flex flex-col gap-3">
            <button
              type="submit"
              disabled={loading}
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