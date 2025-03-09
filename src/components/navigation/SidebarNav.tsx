import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Wand2, Calendar, Package, ShoppingBag, FileText, Book, CreditCard } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../../lib/firebase';
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
    showNotification?: boolean;
  }[];
}

interface SidebarNavProps {
  isCollapsed: boolean;
}

export default function SidebarNav({ isCollapsed }: SidebarNavProps) {
  const { user } = useStore();
  const [pendingOrders, setPendingOrders] = useState(0);
  const [openTickets, setOpenTickets] = useState(0);
  const isAdmin = user?.uid === 'Juvh6BgsXhYsi3loKegWfzRIphG2';
  const [visibleSections, setVisibleSections] = useState<string[]>([]);

  useEffect(() => {
    if (!user) return;

    // Subscribe to pending orders count
    const ordersQuery = query(
      collection(db, 'orders'),
      where('status', '==', 'pending')
    );

    const unsubscribeOrders = onSnapshot(ordersQuery, (snapshot) => {
      setPendingOrders(snapshot.size);
    });

    // Subscribe to open tickets count
    const ticketsQuery = query(
      collection(db, 'tickets'),
      where('status', '==', 'open')
    );

    const unsubscribeTickets = onSnapshot(ticketsQuery, (snapshot) => {
      setOpenTickets(snapshot.size);
    });

    return () => {
      unsubscribeOrders();
      unsubscribeTickets();
    };
  }, [user]);

  const navSections: NavSection[] = [
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
        },
        {
          to: '/orders',
          icon: FileText,
          label: 'Commandes',
          showNotification: true
        }
      ]
    },
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
      title: 'Cours',
      items: [
        {
          to: '/training',
          icon: Book,
          label: 'Cours'
        }
      ]
    },
    {
      title: 'Tarifs',
      items: [
        {
          to: '/pricing',
          icon: CreditCard,
          label: 'Tarifs'
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
          icon: LayoutDashboard,
          label: 'Admin',
          showNotification: true
        }
      ]
    });
  }

  return (
    <nav id="sidebar-nav" className="space-y-3 overflow-y-auto max-h-[calc(100vh-200px)]">
      {navSections.map((section, index) => (
        <div 
          key={section.title} 
          id={`section-${index}`}
          className={clsx(
            'nav-section',
            index > 0 ? 'border-t border-gray-100 pt-3 mt-2' : ''
          )}
        >
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
                  notificationCount={
                    item.showNotification && item.to === '/admin' ? (pendingOrders + openTickets) :
                    item.showNotification && item.to === '/orders' ? pendingOrders :
                    undefined
                  }
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