import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Users, Package, MessageCircle, ShoppingBag, Book } from 'lucide-react';
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

type Tab = 'users' | 'mockups' | 'orders' | 'support' | 'training';

const TABS = [
  { id: 'users' as const, label: 'Utilisateurs', icon: Users },
  { id: 'mockups' as const, label: 'Mockups', icon: Package },
  { id: 'orders' as const, label: 'Commandes', icon: ShoppingBag },
  { id: 'support' as const, label: 'Support', icon: MessageCircle },
  { id: 'training' as const, label: 'Formations', icon: Book }
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

  useEffect(() => {
    const initialize = async () => {
      try {
        await initializePlans();
        const [adminStats, mockupsData, usersData, ordersData, ticketsData, trainingsData] = await Promise.all([
          fetchAdminStats(),
          fetchMockups(),
          fetchUsers(),
          fetchOrders(),
          fetchTickets(),
          fetchTrainings()
        ]);
        
        setStats(adminStats);
        setMockups(mockupsData);
        setUsers(usersData);
        setOrders(ordersData);
        setTickets(ticketsData);
        setTrainings(trainingsData);
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
        product.variants.forEach((variant: any) => {
          if (variant.sku && variant.designUrl) {
            designUrlMap[variant.sku] = variant.designUrl;
          }
        });
      });

      // Then fetch and process orders
      const ordersSnap = await getDocs(collection(db, 'orders'));
      const ordersData = ordersSnap.docs.map(doc => {
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
      }) as Order[];
      
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

  const handleRefresh = async () => {
    setLoading(true);
    try {
      const [adminStats, mockupsData, usersData, ordersData, ticketsData, trainingsData] = await Promise.all([
        fetchAdminStats(),
        fetchMockups(),
        fetchUsers(),
        fetchOrders(),
        fetchTickets(),
        fetchTrainings()
      ]);
      
      setStats(adminStats);
      setMockups(mockupsData);
      setUsers(usersData);
      setOrders(ordersData);
      setTickets(ticketsData);
      setTrainings(trainingsData);
      toast.success('Données mises à jour');
    } catch (error) {
      toast.error('Erreur lors de la mise à jour');
    } finally {
      setLoading(false);
    }
  };

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
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={clsx(
                    'flex items-center px-6 py-4 text-sm font-medium border-b-2 transition-colors',
                    activeTab === tab.id
                      ? 'border-indigo-600 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  )}
                >
                  <Icon className="h-5 w-5 mr-2" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="p-6">
          {activeTab === 'users' && (
            <UserList 
              users={users} 
              onRefresh={handleRefresh}
              stats={stats.users}
            />
          )}

          {activeTab === 'mockups' && (
            <MockupList
              mockups={mockups}
              totalGenerations={stats.totalGenerations}
              onRefresh={handleRefresh}
              onShowUploader={() => setShowUploader(true)}
              onEdit={setEditingMockup}
            />
          )}

          {activeTab === 'orders' && (
            <OrderList
              orders={orders}
              onRefresh={handleRefresh}
            />
          )}

          {activeTab === 'support' && (
            <SupportTickets
              tickets={tickets}
              onRefresh={handleRefresh}
            />
          )}

          {activeTab === 'training' && (
            <TrainingManager
              trainings={trainings}
              onRefresh={handleRefresh}
            />
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