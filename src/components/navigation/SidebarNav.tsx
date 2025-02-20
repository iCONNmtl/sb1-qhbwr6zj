import React from 'react';
import { LayoutDashboard, Wand2, CreditCard, Settings, Calendar, Package, ShoppingBag, FileText, Book } from 'lucide-react';
import { useStore } from '../../store/useStore';
import SidebarLink from './SidebarLink';
import clsx from 'clsx';

interface NavSection {
  title: string;
  items: {
    to: string;
    icon: any;
    label: string;
    primary?: boolean;
    adminOnly?: boolean;
  }[];
}

interface SidebarNavProps {
  isCollapsed: boolean;
}

export default function SidebarNav({ isCollapsed }: SidebarNavProps) {
  const { user } = useStore();
  const isAdmin = user?.uid === 'Juvh6BgsXhYsi3loKegWfzRIphG2';

  const navSections: NavSection[] = [
    {
      title: 'Mockups',
      items: [
        {
          to: '/generator',
          icon: Wand2,
          label: 'Mockups'
        },
        {
          to: '/dashboard',
          icon: LayoutDashboard,
          label: 'Mes visuels'
        }
      ]
    },
    {
      title: 'Produits',
      items: [
        {
          to: '/products',
          icon: Package,
          label: 'Catalogue'
        },
        {
          to: '/my-products',
          icon: ShoppingBag,
          label: 'Mes produits'
        }
      ]
    },
    {
      title: 'Formation',
      items: [
        {
          to: '/training',
          icon: Book,
          label: 'Formations'
        }
      ]
    },
    {
      title: 'Compte',
      items: [
        {
          to: '/orders',
          icon: FileText,
          label: 'Commandes'
        },
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
  if (isAdmin) {
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
            {section.items
              .filter(item => !item.adminOnly || isAdmin)
              .map((item) => (
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