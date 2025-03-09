import React, { useState } from 'react';
import { FileText, Download, Loader2, Filter, Calendar, Package, Book, CreditCard, ChevronLeft, ChevronRight, X, ChevronDown } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { DayPicker } from 'react-day-picker';
import clsx from 'clsx';
import type { Invoice, InvoiceType } from '../../types/invoice';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../ui/popover';

interface InvoiceListProps {
  invoices: Invoice[];
  loading?: boolean;
}

const INVOICE_TYPES: { id: InvoiceType; label: string; icon: React.ElementType }[] = [
  { id: 'order', label: 'Commande', icon: Package },
  { id: 'training', label: 'Formation', icon: Book },
  { id: 'pack', label: 'Pack de crédits', icon: CreditCard }
];

const ITEMS_PER_PAGE = 10;

export default function InvoiceList({ invoices, loading }: InvoiceListProps) {
  const [selectedType, setSelectedType] = useState<InvoiceType | 'all'>('all');
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined
  });
  const [currentPage, setCurrentPage] = useState(1);

  // Filter invoices
  const filteredInvoices = invoices.filter(invoice => {
    // Filter by type
    if (selectedType !== 'all' && invoice.type !== selectedType) {
      return false;
    }

    // Filter by date range
    if (dateRange.from && new Date(invoice.createdAt) < dateRange.from) {
      return false;
    }
    if (dateRange.to && new Date(invoice.createdAt) > dateRange.to) {
      return false;
    }

    return true;
  });

  // Calculate pagination
  const totalPages = Math.ceil(filteredInvoices.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedInvoices = filteredInvoices.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // Reset to first page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [selectedType, dateRange]);

  if (loading) {
    return (
      <div className="text-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600 mx-auto" />
        <p className="mt-4 text-gray-500">Chargement des factures...</p>
      </div>
    );
  }

  if (invoices.length === 0) {
    return (
      <div className="text-center py-12">
        <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">Aucune facture disponible</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex items-center gap-4">
        {/* Type Dropdown */}
        <Popover>
          <PopoverTrigger asChild>
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
              <span className="text-sm text-gray-700">Type:</span>
              <span className="text-sm font-medium text-gray-900">
                {selectedType === 'all' ? 'Tous' : INVOICE_TYPES.find(t => t.id === selectedType)?.label}
              </span>
              <ChevronDown className="h-4 w-4 text-gray-500" />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-48 p-2 bg-white shadow-lg rounded-lg border border-gray-200">
            <div className="space-y-1">
              <button
                onClick={() => setSelectedType('all')}
                className={clsx(
                  'w-full px-3 py-2 text-sm text-left rounded-lg transition-colors',
                  selectedType === 'all' ? 'bg-indigo-50 text-indigo-600' : 'hover:bg-gray-50'
                )}
              >
                Tous
              </button>
              {INVOICE_TYPES.map(type => (
                <button
                  key={type.id}
                  onClick={() => setSelectedType(type.id)}
                  className={clsx(
                    'w-full px-3 py-2 text-sm text-left rounded-lg transition-colors flex items-center gap-2',
                    selectedType === type.id ? 'bg-indigo-50 text-indigo-600' : 'hover:bg-gray-50'
                  )}
                >
                  <type.icon className="h-4 w-4" />
                  {type.label}
                </button>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        {/* Date Range Picker */}
        <Popover>
          <PopoverTrigger asChild>
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
              <Calendar className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-700">
                {dateRange.from ? (
                  dateRange.to ? (
                    <>
                      {format(dateRange.from, 'dd/MM/yyyy')} - {format(dateRange.to, 'dd/MM/yyyy')}
                    </>
                  ) : (
                    format(dateRange.from, 'dd/MM/yyyy')
                  )
                ) : (
                  'Sélectionner une période'
                )}
              </span>
              <ChevronDown className="h-4 w-4 text-gray-500" />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <DayPicker
              mode="range"
              selected={dateRange}
              onSelect={(range) => setDateRange({ from: range?.from, to: range?.to })}
              locale={fr}
              className="p-3"
            />
            <div className="border-t border-gray-200 p-3 bg-gray-50 flex justify-end gap-2">
              <button
                onClick={() => setDateRange({ from: undefined, to: undefined })}
                className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900"
              >
                Réinitialiser
              </button>
            </div>
          </PopoverContent>
        </Popover>

        {/* Active Filters */}
        {(selectedType !== 'all' || dateRange.from) && (
          <button
            onClick={() => {
              setSelectedType('all');
              setDateRange({ from: undefined, to: undefined });
            }}
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            Réinitialiser les filtres
          </button>
        )}
      </div>

      {/* Results Summary */}
      <div className="text-sm text-gray-600">
        {filteredInvoices.length} résultat{filteredInvoices.length > 1 ? 's' : ''}
      </div>

      {/* Invoices Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Numéro
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Montant
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedInvoices.map((invoice) => {
                const TypeIcon = INVOICE_TYPES.find(t => t.id === invoice.type)?.icon || FileText;
                return (
                  <tr key={invoice.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <TypeIcon className="h-5 w-5 text-gray-400 mr-2" />
                        <span className="text-sm font-medium text-gray-900">
                          {invoice.number}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-500">
                        {format(new Date(invoice.createdAt), 'dd/MM/yyyy')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={clsx(
                        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                        invoice.type === 'order'
                          ? 'bg-blue-100 text-blue-800'
                          : invoice.type === 'training'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-green-100 text-green-800'
                      )}>
                        {INVOICE_TYPES.find(t => t.id === invoice.type)?.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-900">
                        {invoice.amount.toFixed(2)}€
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {invoice.url ? (
                        <a
                          href={invoice.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors"
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Télécharger
                        </a>
                      ) : (
                        <span className="text-sm text-gray-500">
                          En cours de génération...
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-3 border-t border-gray-200">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-700">
                Page {currentPage} sur {totalPages}
              </span>
              <span className="text-sm text-gray-500">
                ({startIndex + 1}-{Math.min(startIndex + ITEMS_PER_PAGE, filteredInvoices.length)} sur {filteredInvoices.length})
              </span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className={clsx(
                  'p-2 rounded-lg transition-colors',
                  currentPage === 1
                    ? 'text-gray-300 cursor-not-allowed'
                    : 'text-gray-600 hover:bg-gray-100'
                )}
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className={clsx(
                  'p-2 rounded-lg transition-colors',
                  currentPage === totalPages
                    ? 'text-gray-300 cursor-not-allowed'
                    : 'text-gray-600 hover:bg-gray-100'
                )}
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}