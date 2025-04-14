import React from 'react';
import { LayoutDashboard, Wand2, Calendar, Package, ShoppingBag, FileText, Book, CreditCard, Palette } from 'lucide-react';
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
  const [pendingOrders, setPendingOrders] = React.useState(0);
  const [openTickets, setOpenTickets] = React.useState(0);
  const isAdmin = user?.uid === 'Juvh6BgsXhYsi3loKegWfzRIphG2' || user?.uid === 'j5UXKluDdnMFb7mZEagfKRRyhO82';

  React.useEffect(() => {
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
      title: "Business",
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
      title: "Création",
      items: [
        {
          to: '/design-generator',
          icon: Palette,
          label: 'Créer un design'
        },
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
      title: "Ressources",
      items: [
        {
          to: '/training',
          icon: Book,
          label: 'Formations'
        },
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
      title: "Administration",
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
    <nav className="flex-1 overflow-y-auto py-4">
      <div className="space-y-1 px-3">
        {navSections.map((section, index) => (
          <div 
            key={section.title} 
            className={clsx(
              index > 0 ? 'mt-6' : '',
              'space-y-1'
            )}
          >
            {/* Section header - only show when sidebar is expanded */}
            {!isCollapsed && (
              <div className="px-3 py-2">
                <h3 className="text-xs font-medium uppercase tracking-wider text-gray-500">
                  {section.title}
                </h3>
              </div>
            )}
            
            {/* Section items */}
            <div className="space-y-1">
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
      </div>
    </nav>
  );
}