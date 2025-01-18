import React from 'react';
import { LayoutDashboard, Wand2, CreditCard, Settings } from 'lucide-react';
import { useStore } from '../../store/useStore';
import SidebarLink from './SidebarLink';
import clsx from 'clsx';

interface SidebarNavProps {
  isCollapsed: boolean;
}

interface NavSection {
  title: string;
  items: {
    to: string;
    icon: any;
    label: string;
    primary?: boolean;
  }[];
}

export default function SidebarNav({ isCollapsed }: SidebarNavProps) {
  const { user } = useStore();

  const navSections: NavSection[] = [
    {
      title: 'Mockups',
      items: [
        {
          to: '/generator',
          icon: Wand2,
          label: 'Générateur',
          primary: true
        },
        {
          to: '/dashboard',
          icon: LayoutDashboard,
          label: 'Vos mockups'
        }
      ]
    },
    {
      title: 'Compte',
      items: [
        {
          to: '/pricing',
          icon: CreditCard,
          label: 'Tarifs'
        },
        {
          to: '/settings',
          icon: Settings,
          label: 'Paramètres'
        }
      ]
    }
  ];

  // Add admin section if user is admin
  if (user?.uid === 'Juvh6BgsXhYsi3loKegWfzRIphG2') {
    navSections.push({
      title: 'Administration',
      items: [
        {
          to: '/admin',
          icon: Settings,
          label: 'Admin'
        }
      ]
    });
  }

  return (
    <nav className="space-y-3">
      {navSections.map((section, index) => (
        <div key={section.title} className={index > 0 ? 'border-t border-gray-100 pt-3 mt-2' : ''}>
          {!isCollapsed && (
            <h3 className="px-3 mb-1 text-xs font-medium text-gray-500 uppercase tracking-wider">
              {section.title}
            </h3>
          )}
          <div className="space-y-1 px-3">
            {section.items.map((item) => (
              <SidebarLink
                key={item.to}
                to={item.to}
                icon={item.icon}
                label={item.label}
                isCollapsed={isCollapsed}
                className={clsx(
                  item.primary && 'gradient-bg text-white hover:opacity-90',
                  isCollapsed && 'justify-center'
                )}
              />
            ))}
          </div>
        </div>
      ))}
    </nav>
  );
}