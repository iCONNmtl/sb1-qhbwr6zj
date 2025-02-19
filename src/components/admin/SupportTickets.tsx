import React from 'react';
import { MessageCircle, Clock, CheckCircle, XCircle, Loader2, Trash2 } from 'lucide-react';
import { doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { usePagination } from '../../hooks/usePagination';
import Pagination from '../Pagination';
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
}

interface SupportTicketsProps {
  tickets: Ticket[];
  onRefresh: () => Promise<void>;
}

export default function SupportTickets({ tickets, onRefresh }: SupportTicketsProps) {
  const [processingId, setProcessingId] = React.useState<string | null>(null);
  const {
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    totalItems,
    paginatedItems: paginatedTickets
  } = usePagination(tickets);

  const handleMarkAsResolved = async (ticketId: string) => {
    setProcessingId(ticketId);
    try {
      const ticketRef = doc(db, 'tickets', ticketId);
      await updateDoc(ticketRef, {
        status: 'closed',
        resolvedAt: new Date().toISOString()
      });

      toast.success('Ticket marqué comme traité');
      await onRefresh();
    } catch (error) {
      console.error('Error resolving ticket:', error);
      toast.error('Erreur lors du traitement du ticket');
    } finally {
      setProcessingId(null);
    }
  };

  const handleDelete = async (ticketId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce ticket ?')) return;

    setProcessingId(ticketId);
    try {
      const ticketRef = doc(db, 'tickets', ticketId);
      await deleteDoc(ticketRef);

      toast.success('Ticket supprimé');
      await onRefresh();
    } catch (error) {
      console.error('Error deleting ticket:', error);
      toast.error('Erreur lors de la suppression du ticket');
    } finally {
      setProcessingId(null);
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
        {paginatedTickets.map((ticket) => (
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
                    {ticket.status === 'open' ? 'En attente' : 'Traité'}
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
                    onClick={() => handleMarkAsResolved(ticket.id)}
                    disabled={processingId === ticket.id}
                    className={clsx(
                      'flex items-center px-3 py-1 rounded-lg transition-colors',
                      'bg-green-600 text-white hover:bg-green-700',
                      'disabled:opacity-50 disabled:cursor-not-allowed'
                    )}
                  >
                    {processingId === ticket.id ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Traitement...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Marquer comme traité
                      </>
                    )}
                  </button>
                )}
                <button
                  onClick={() => handleDelete(ticket.id)}
                  disabled={processingId === ticket.id}
                  className={clsx(
                    'p-2 rounded-lg transition-colors',
                    'text-red-600 hover:bg-red-50',
                    'disabled:opacity-50 disabled:cursor-not-allowed'
                  )}
                  title="Supprimer"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-700 whitespace-pre-wrap">
                {ticket.message}
              </p>
            </div>
          </div>
        ))}
      </div>

      <Pagination
        currentPage={currentPage}
        totalItems={totalItems}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
        onPageSizeChange={setPageSize}
      />
    </div>
  );
}