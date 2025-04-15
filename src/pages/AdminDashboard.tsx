import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Users, Package, MessageCircle, ShoppingBag, Book, Search, Filter, ArrowUpDown } from 'lucide-react';
import MockupUploader from '../components/MockupUploader';
import MockupEditor from '../components/MockupEditor';
import UserList from '../components/admin/UserList';
import MockupList from '../components/admin/MockupList';
import OrderList from '../components/admin/OrderList';
import SupportTickets from '../components/admin/SupportTickets';
import TrainingManager from '../components/admin/TrainingManager';
import { initializePlans } from '../utils/plans';
import { fetchAdminStats, getMockupGenerationCount, getUserGenerationCount } from '../utils/adminStats';
import { LoadingSpinner } from '../components/common';
import toast from 'react-hot-toast';
import clsx from 'clsx';
import type { Mockup } from '../types/mockup';
import type { UserProfile } from '../types/user';
import type { Order } from '../types/order';
import type { Training } from '../types/training';

interface Ticket {
  id: string;
  userId: string | null;
  subject: string;
  email: string;
  message: string;
  status: 'open' | 'closed';
  createdAt: string;
}

interface Notification {
  id: string;
  type: string;
  orderId: string;
  userId: string;
  serviceId: string;
  serviceName: string;
  customerName: string;
  customerEmail: string;
  read: boolean;
  createdAt: string;
}

type Tab = 'users' | 'mockups' | 'orders' | 'support' | 'training' | 'services';

const TABS = [
  { id: 'users' as const, label: 'Utilisateurs', icon: Users },
  { id: 'mockups' as const, label: 'Mockups', icon: Package },
  { id: 'orders' as const, label: 'Commandes', icon: ShoppingBag },
  { id: 'support' as const, label: 'Support', icon: MessageCircle },
  { id: 'training' as const, label: 'Formations', icon: Book },
  { id: 'services' as const, label: 'Services', icon: ShoppingBag, badge: true }
] as const;

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>('users');
  const [showUploader, setShowUploader] = useState(false);
  const [editingMockup, setEditingMockup] = useState<Mockup | null>(null);
  const [mockups, setMockups] = useState<(Mockup & { generationCount?: number })[]>([]);
  const [users, setUsers] = useState<(UserProfile & { id: string; generationCount?: number })[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [stats, setStats] = useState({
    users: {
      total: 0,
      basic: 0,
      pro: 0,
      expert: 0,
      basicPercentage: 0,
      proPercentage: 0,
      expertPercentage: 0
    },
    mockups: 0,
    totalGenerations: 0
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'name' | 'status'>('newest');
  const [showSortOptions, setShowSortOptions] = useState(false);

  useEffect(() => {
    const initialize = async () => {
      try {
        await initializePlans();
        const [adminStats, mockupsData, usersData, ordersData, ticketsData, trainingsData, notificationsData] = await Promise.all([
          fetchAdminStats(),
          fetchMockups(),
          fetchUsers(),
          fetchOrders(),
          fetchTickets(),
          fetchTrainings(),
          fetchNotifications()
        ]);
        
        setStats(adminStats);
        setMockups(mockupsData);
        setUsers(usersData);
        setOrders(ordersData);
        setTickets(ticketsData);
        setTrainings(trainingsData);
        setNotifications(notificationsData);
      } catch (error) {
        console.error('Error initializing dashboard:', error);
        toast.error('Erreur lors du chargement des données');
      } finally {
        setLoading(false);
      }
    };

    initialize();
  }, []);

  const fetchMockups = async () => {
    try {
      const mockupsSnap = await getDocs(collection(db, 'mockups'));
      const mockupsData = await Promise.all(
        mockupsSnap.docs.map(async (doc) => {
          const mockup = { ...doc.data(), firestoreId: doc.id } as Mockup;
          const generationCount = await getMockupGenerationCount(mockup.id);
          return { ...mockup, generationCount };
        })
      );
      return mockupsData;
    } catch (error) {
      console.error('Error fetching mockups:', error);
      throw error;
    }
  };

  const fetchUsers = async () => {
    try {
      const usersSnap = await getDocs(collection(db, 'users'));
      const usersData = await Promise.all(
        usersSnap.docs.map(async (doc) => {
          const user = { id: doc.id, ...doc.data() } as UserProfile & { id: string };
          const generationCount = await getUserGenerationCount(doc.id);
          return { ...user, generationCount };
        })
      );
      return usersData;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  };

  const fetchOrders = async () => {
    try {
      // First fetch all products to get design URLs
      const productsRef = collection(db, 'products');
      const productsSnap = await getDocs(productsRef);
      const designUrlMap: Record<string, string> = {};
      
      productsSnap.docs.forEach(doc => {
        const product = doc.data();
        product.variants?.forEach((variant: any) => {
          if (variant.sku && variant.designUrl) {
            designUrlMap[variant.sku] = variant.designUrl;
          }
        });
      });

      // Then fetch and process orders - exclude service orders (platform === 'internal')
      const ordersSnap = await getDocs(collection(db, 'orders'));
      const ordersData = ordersSnap.docs
        .map(doc => {
          const data = doc.data();
          return {
            ...data,
            firestoreId: doc.id,
            totalAmount: Number(data.totalAmount || 0),
            purchasePrice: Number(data.purchasePrice || 0),
            items: data.items.map((item: any) => ({
              ...item,
              price: Number(item.price || 0),
              quantity: Number(item.quantity || 0),
              purchasePrice: Number(item.purchasePrice || 0),
              designUrl: designUrlMap[item.sku] // Add design URL to each item
            }))
          };
        })
        .filter(order => order.platform !== 'internal') as Order[];
      
      ordersData.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      
      return ordersData;
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }
  };

  const fetchTickets = async () => {
    try {
      const ticketsSnap = await getDocs(collection(db, 'tickets'));
      const ticketsData = ticketsSnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Ticket[];
      
      ticketsData.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      
      return ticketsData;
    } catch (error) {
      console.error('Error fetching tickets:', error);
      throw error;
    }
  };

  const fetchTrainings = async () => {
    try {
      const trainingsSnap = await getDocs(collection(db, 'trainings'));
      const trainingsData = trainingsSnap.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      })) as Training[];
      
      trainingsData.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      
      return trainingsData;
    } catch (error) {
      console.error('Error fetching trainings:', error);
      throw error;
    }
  };

  const fetchNotifications = async () => {
    try {
      const notificationsSnap = await getDocs(collection(db, 'notifications'));
      const notificationsData = notificationsSnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Notification[];
      
      notificationsData.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      
      return notificationsData;
    } catch (error) {
      console.error('Error fetching notifications:', error);
      return [];
    }
  };

  const handleRefresh = async () => {
    setLoading(true);
    try {
      const [adminStats, mockupsData, usersData, ordersData, ticketsData, trainingsData, notificationsData] = await Promise.all([
        fetchAdminStats(),
        fetchMockups(),
        fetchUsers(),
        fetchOrders(),
        fetchTickets(),
        fetchTrainings(),
        fetchNotifications()
      ]);
      
      setStats(adminStats);
      setMockups(mockupsData);
      setUsers(usersData);
      setOrders(ordersData);
      setTickets(ticketsData);
      setTrainings(trainingsData);
      setNotifications(notificationsData);
      toast.success('Données mises à jour');
    } catch (error) {
      toast.error('Erreur lors de la mise à jour');
    } finally {
      setLoading(false);
    }
  };

  const markNotificationAsRead = async (notificationId: string) => {
    try {
      const notificationRef = doc(db, 'notifications', notificationId);
      await updateDoc(notificationRef, { read: true });
      
      // Update local state
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === notificationId 
            ? { ...notification, read: true } 
            : notification
        )
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

  // Filter data based on search term
  const getFilteredData = () => {
    switch (activeTab) {
      case 'users':
        return users.filter(user => 
          user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.subscription?.plan?.toLowerCase().includes(searchTerm.toLowerCase())
        );
      case 'mockups':
        return mockups.filter(mockup => 
          mockup.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          mockup.category?.toLowerCase().includes(searchTerm.toLowerCase())
        );
      case 'orders':
        return orders.filter(order => 
          order.orderId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.customerEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.platform?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.status?.toLowerCase().includes(searchTerm.toLowerCase())
        );
      case 'support':
        return tickets.filter(ticket => 
          ticket.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          ticket.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          ticket.message?.toLowerCase().includes(searchTerm.toLowerCase())
        );
      case 'training':
        return trainings.filter(training => 
          training.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          training.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          training.category?.toLowerCase().includes(searchTerm.toLowerCase())
        );
      case 'services':
        return notifications.filter(notification => 
          notification.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          notification.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          notification.customerEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          notification.serviceName?.toLowerCase().includes(searchTerm.toLowerCase())
        );
      default:
        return [];
    }
  };

  // Sort data based on sort option
  const getSortedData = (data: any[]) => {
    switch (sortBy) {
      case 'newest':
        return [...data].sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      case 'oldest':
        return [...data].sort((a, b) => 
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      case 'name':
        return [...data].sort((a, b) => {
          const aName = a.name || a.title || a.email || a.customerName || '';
          const bName = b.name || b.title || b.email || b.customerName || '';
          return aName.localeCompare(bName);
        });
      case 'status':
        return [...data].sort((a, b) => {
          const aStatus = a.status || '';
          const bStatus = b.status || '';
          return aStatus.localeCompare(bStatus);
        });
      default:
        return data;
    }
  };

  const filteredData = getFilteredData();
  const sortedData = getSortedData(filteredData);

  if (loading) {
    return <LoadingSpinner message="Chargement du tableau de bord..." />;
  }

  return (
    <div className="space-y-8">
      {/* Stats Overview */}
      <div className="grid grid-cols-5 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-100 rounded-xl">
              <Users className="h-6 w-6 text-indigo-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{stats.users.total}</div>
              <div className="text-sm text-gray-500">Utilisateurs</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-100 rounded-xl">
              <Package className="h-6 w-6 text-indigo-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{stats.mockups}</div>
              <div className="text-sm text-gray-500">Mockups</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-100 rounded-xl">
              <ShoppingBag className="h-6 w-6 text-indigo-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{orders.length}</div>
              <div className="text-sm text-gray-500">Commandes</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-100 rounded-xl">
              <MessageCircle className="h-6 w-6 text-indigo-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{tickets.length}</div>
              <div className="text-sm text-gray-500">Tickets</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-100 rounded-xl">
              <Book className="h-6 w-6 text-indigo-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{trainings.length}</div>
              <div className="text-sm text-gray-500">Formations</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="border-b border-gray-200">
          <div className="flex">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const badgeCount = tab.badge ? unreadNotificationsCount : 0;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={clsx(
                    'flex items-center px-6 py-4 text-sm font-medium border-b-2 transition-colors relative',
                    activeTab === tab.id
                      ? 'border-indigo-600 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  )}
                >
                  <Icon className="h-5 w-5 mr-2" />
                  {tab.label}
                  
                  {tab.badge && badgeCount > 0 && (
                    <span className="absolute top-2 right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-medium text-white">
                      {badgeCount}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="p-6">
          {/* Search and Sort Bar */}
          <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
            <div className="flex items-center gap-4">
              <div className="relative flex-1 md:max-w-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={`Rechercher ${
                    activeTab === 'users' ? 'un utilisateur' :
                    activeTab === 'mockups' ? 'un mockup' :
                    activeTab === 'orders' ? 'une commande' :
                    activeTab === 'support' ? 'un ticket' :
                    activeTab === 'training' ? 'une formation' :
                    'un service'
                  }...`}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div className="relative">
                <button
                  onClick={() => setShowSortOptions(!showSortOptions)}
                  className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  <ArrowUpDown className="h-5 w-5 text-gray-500" />
                  <span className="text-sm text-gray-700">Trier</span>
                </button>
                
                {showSortOptions && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                    <div className="py-1">
                      <button
                        onClick={() => {
                          setSortBy('newest');
                          setShowSortOptions(false);
                        }}
                        className={clsx(
                          'flex items-center w-full px-4 py-2 text-sm',
                          sortBy === 'newest' 
                            ? 'bg-indigo-50 text-indigo-600' 
                            : 'text-gray-700 hover:bg-gray-50'
                        )}
                      >
                        Plus récents
                      </button>
                      <button
                        onClick={() => {
                          setSortBy('oldest');
                          setShowSortOptions(false);
                        }}
                        className={clsx(
                          'flex items-center w-full px-4 py-2 text-sm',
                          sortBy === 'oldest' 
                            ? 'bg-indigo-50 text-indigo-600' 
                            : 'text-gray-700 hover:bg-gray-50'
                        )}
                      >
                        Plus anciens
                      </button>
                      <button
                        onClick={() => {
                          setSortBy('name');
                          setShowSortOptions(false);
                        }}
                        className={clsx(
                          'flex items-center w-full px-4 py-2 text-sm',
                          sortBy === 'name' 
                            ? 'bg-indigo-50 text-indigo-600' 
                            : 'text-gray-700 hover:bg-gray-50'
                        )}
                      >
                        Nom
                      </button>
                      <button
                        onClick={() => {
                          setSortBy('status');
                          setShowSortOptions(false);
                        }}
                        className={clsx(
                          'flex items-center w-full px-4 py-2 text-sm',
                          sortBy === 'status' 
                            ? 'bg-indigo-50 text-indigo-600' 
                            : 'text-gray-700 hover:bg-gray-50'
                        )}
                      >
                        Statut
                      </button>
                    </div>
                  </div>
                )}
              </div>
              <button
                onClick={handleRefresh}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
              >
                Actualiser
              </button>
            </div>
            
            {activeTab === 'mockups' && (
              <button
                onClick={() => setShowUploader(true)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
              >
                Ajouter un mockup
              </button>
            )}
          </div>

          {activeTab === 'users' && (
            <UserList 
              users={sortedData} 
              onRefresh={handleRefresh}
              stats={stats.users}
            />
          )}

          {activeTab === 'mockups' && (
            <MockupList
              mockups={sortedData}
              totalGenerations={stats.totalGenerations}
              onRefresh={handleRefresh}
              onShowUploader={() => setShowUploader(true)}
              onEdit={setEditingMockup}
            />
          )}

          {activeTab === 'orders' && (
            <OrderList
              orders={sortedData}
              onRefresh={handleRefresh}
            />
          )}

          {activeTab === 'support' && (
            <SupportTickets
              tickets={sortedData}
              onRefresh={handleRefresh}
            />
          )}

          {activeTab === 'training' && (
            <TrainingManager
              trainings={sortedData}
              onRefresh={handleRefresh}
            />
          )}

          {activeTab === 'services' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Services</h2>
              </div>

              {sortedData.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Aucun service commandé</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {sortedData.map(notification => (
                    <div 
                      key={notification.id}
                      className={clsx(
                        "p-4 rounded-lg border transition-colors",
                        notification.read 
                          ? "bg-white border-gray-200" 
                          : "bg-indigo-50 border-indigo-200"
                      )}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="font-medium text-gray-900 mb-1">
                            {notification.type === 'new_service_order' && 'Nouvelle commande de service'}
                          </div>
                          <p className="text-sm text-gray-600">
                            {notification.type === 'new_service_order' && (
                              <>
                                <span className="font-medium">{notification.customerName}</span> a commandé le service <span className="font-medium">{notification.serviceName}</span>
                              </>
                            )}
                          </p>
                          <div className="text-xs text-gray-500 mt-1">
                            {new Date(notification.createdAt).toLocaleString()}
                          </div>
                        </div>
                        
                        {!notification.read && (
                          <button
                            onClick={() => markNotificationAsRead(notification.id)}
                            className="px-3 py-1 bg-indigo-600 text-white text-xs rounded-lg hover:bg-indigo-700 transition"
                          >
                            Marquer comme lu
                          </button>
                        )}
                      </div>
                      
                      {notification.type === 'new_service_order' && (
                        <div className="mt-3 pt-3 border-t border-gray-200">
                          <div className="flex items-center justify-between">
                            <div className="text-sm">
                              <span className="text-gray-500">Email: </span>
                              <a href={`mailto:${notification.customerEmail}`} className="text-indigo-600 hover:text-indigo-500">
                                {notification.customerEmail}
                              </a>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {showUploader && (
        <MockupUploader
          onClose={() => setShowUploader(false)}
          onSuccess={handleRefresh}
        />
      )}

      {editingMockup && (
        <MockupEditor
          mockup={editingMockup}
          onClose={() => setEditingMockup(null)}
          onSuccess={handleRefresh}
        />
      )}
    </div>
  );
}