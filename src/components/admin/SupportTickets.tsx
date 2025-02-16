import React, { useState } from 'react';
import { MessageCircle, Clock, CheckCircle, XCircle, Send, Loader2 } from 'lucide-react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import toast from 'react-hot-toast';
import clsx from 'clsx';

interface Ticket {
  id: string;
  userId: string | null;
  subject: string;
  email: string;
  message: string;
  status: 'open' | 'closed';
  createdAt: string;
  response?: string;
}

interface SupportTicketsProps {
  tickets: Ticket[];
  onRefresh: () => Promise<void>;
}

export default function SupportTickets({ tickets, onRefresh }: SupportTicketsProps) {
  const [respondingTo, setRespondingTo] = useState<string | null>(null);
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRespond = async (ticketId: string) => {
    if (!response.trim()) {
      toast.error('Veuillez entrer une réponse');
      return;
    }

    setLoading(true);
    try {
      const ticketRef = doc(db, 'tickets', ticketId);
      await updateDoc(ticketRef, {
        status: 'closed',
        response,
        updatedAt: new Date().toISOString()
      });

      toast.success('Réponse envoyée avec succès');
      setRespondingTo(null);
      setResponse('');
      await onRefresh();
    } catch (error) {
      console.error('Error responding to ticket:', error);
      toast.error('Erreur lors de l\'envoi de la réponse');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'closed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      default:
        return <XCircle className="h-5 w-5 text-red-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'open':
        return 'En attente';
      case 'closed':
        return 'Résolu';
      default:
        return 'Erreur';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <MessageCircle className="h-5 w-5 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Tickets de support
              </h2>
              <p className="text-sm text-gray-500">
                {tickets.length} ticket{tickets.length > 1 ? 's' : ''}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="divide-y divide-gray-200">
        {tickets.map((ticket) => (
          <div key={ticket.id} className="p-6">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <span className="font-medium text-gray-900">
                    {ticket.subject}
                  </span>
                  <div className={clsx(
                    'px-2 py-1 text-xs font-medium rounded-full',
                    ticket.status === 'open'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-green-100 text-green-800'
                  )}>
                    {getStatusText(ticket.status)}
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  De : {ticket.email}
                </div>
                <div className="text-sm text-gray-500">
                  Le {new Date(ticket.createdAt).toLocaleDateString('fr-FR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>

              <div className="flex items-center gap-2">
                {ticket.status === 'open' && (
                  <button
                    onClick={() => setRespondingTo(ticket.id)}
                    className="px-3 py-1 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                  >
                    Répondre
                  </button>
                )}
                {getStatusIcon(ticket.status)}
              </div>
            </div>

            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-700 whitespace-pre-wrap">
                {ticket.message}
              </p>
            </div>

            {ticket.response && (
              <div className="mt-4 ml-8">
                <div className="p-4 bg-indigo-50 rounded-lg">
                  <div className="text-sm font-medium text-indigo-900 mb-2">
                    Réponse :
                  </div>
                  <p className="text-indigo-800 whitespace-pre-wrap">
                    {ticket.response}
                  </p>
                </div>
              </div>
            )}

            {respondingTo === ticket.id && (
              <div className="mt-4 ml-8">
                <div className="p-4 bg-white border border-gray-200 rounded-lg">
                  <textarea
                    value={response}
                    onChange={(e) => setResponse(e.target.value)}
                    placeholder="Votre réponse..."
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 mb-4"
                  />
                  <div className="flex justify-end gap-3">
                    <button
                      onClick={() => {
                        setRespondingTo(null);
                        setResponse('');
                      }}
                      className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
                    >
                      Annuler
                    </button>
                    <button
                      onClick={() => handleRespond(ticket.id)}
                      disabled={loading}
                      className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          Envoi...
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          Envoyer
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}