import React, { useState } from 'react';
import { ChevronDown, ChevronUp, FileText } from 'lucide-react';
import SidebarLink from './SidebarLink';
import clsx from 'clsx';

interface SidebarLegalProps {
  isCollapsed: boolean;
}

export default function SidebarLegal({ isCollapsed }: SidebarLegalProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const legalPages = [
    { to: '/legal/mentions-legales', label: 'Mentions légales' },
    { to: '/legal/cgu', label: 'CGU' },
    { to: '/legal/cgv', label: 'CGV' },
    { to: '/legal/confidentialite', label: 'Confidentialité' }
  ];

  if (isCollapsed) {
    return (
      <div className="px-3 py-2">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-center p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
          title="Pages légales"
        >
          <FileText className="h-5 w-5" />
        </button>
      </div>
    );
  }

  return (
    <div className="px-3 py-2">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
      >
        <div className="flex items-center">
          <FileText className="h-5 w-5" />
          <span className="ml-3">Pages légales</span>
        </div>
        {isExpanded ? (
          <ChevronUp className="h-4 w-4" />
        ) : (
          <ChevronDown className="h-4 w-4" />
        )}
      </button>

      <div
        className={clsx(
          'mt-1 space-y-1 overflow-hidden transition-all duration-200',
          isExpanded ? 'max-h-48' : 'max-h-0'
        )}
      >
        {legalPages.map((page) => (
          <SidebarLink
            key={page.to}
            to={page.to}
            icon={FileText}
            label={page.label}
            isCollapsed={false}
            className="pl-10"
          />
        ))}
      </div>
    </div>
  );
}