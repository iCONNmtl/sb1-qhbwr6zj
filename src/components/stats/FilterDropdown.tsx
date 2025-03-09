import React from 'react';
import { ChevronDown } from 'lucide-react';
import clsx from 'clsx';

interface FilterDropdownProps {
  label: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

export default function FilterDropdown({ label, isOpen, onToggle, children }: FilterDropdownProps) {
  return (
    <div className="relative">
      <button
        onClick={onToggle}
        className={clsx(
          'flex items-center justify-between w-full px-4 py-2 bg-white border rounded-lg transition-colors',
          isOpen ? 'border-indigo-600' : 'border-gray-200 hover:border-gray-300'
        )}
      >
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <ChevronDown className={clsx(
          'h-5 w-5 text-gray-400 transition-transform',
          isOpen && 'transform rotate-180'
        )} />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg p-4">
          {children}
        </div>
      )}
    </div>
  );
}