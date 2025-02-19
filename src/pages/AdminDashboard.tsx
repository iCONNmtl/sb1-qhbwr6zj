import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import MockupUploader from '../components/MockupUploader';
import MockupEditor from '../components/MockupEditor';
import UserList from '../components/admin/UserList';
import MockupList from '../components/admin/MockupList';
import OrderList from '../components/admin/OrderList';
import SupportTickets from '../components/admin/SupportTickets';
import { initializePlans } from '../utils/plans';
import { fetchAdminStats, getMockupGenerationCount, getUserGenerationCount } from '../utils/adminStats';
import { LoadingSpinner } from '../components/common';
import toast from 'react-hot-toast';
import type { Mockup } from '../types/mockup';
import type { UserProfile } from '../types/user';
import type { Order } from '../types/order';

interface Ticket {
  id: string;
  userId: string | null;
  subject: string;
  email: string;
  message: string;
  status: 'open' | 'closed';
  createdAt: string;
  response?: string;
}

export default function AdminDashboard() {
  const [showUploader, setShowUploader] = useState(false);
  const [editingMockup, setEditingMockup] = useState<Mockup | null>(null);
  const [mockups, setMockups] = useState<(Mockup & { generationCount?: number })[]>([]);
  const [users, setUsers] = useState<(UserProfile & { id: string; generationCount?: number })[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
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
        const [adminStats, mockupsData, usersData, ordersData, ticketsData] = await Promise.all([
          fetchAdminStats(),
          fetchMockups(),
          fetchUsers(),
          fetchOrders(),
          fetchTickets()
        ]);
        
        setStats(adminStats);
        setMockups(mockupsData);
        setUsers(usersData);
        setOrders(ordersData);
        setTickets(ticketsData);
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
      const ordersSnap = await getDocs(collection(db, 'orders'));
      const ordersData = ordersSnap.docs.map(doc => {
        const data = doc.data();
        return {
          ...data,
          firestoreId: doc.id,
          totalAmount: Number(data.totalAmount),
          items: data.items.map((item: any) => ({
            ...item,
            price: Number(item.price),
            quantity: Number(item.quantity)
          }))
        };
      }) as Order[];
      
      // Trier par date de création (plus récent en premier)
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
      
      // Trier par date de création (plus récent en premier)
      ticketsData.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      
      return ticketsData;
    } catch (error) {
      console.error('Error fetching tickets:', error);
      throw error;
    }
  };

  const handleRefresh = async () => {
    setLoading(true);
    try {
      const [adminStats, mockupsData, usersData, ordersData, ticketsData] = await Promise.all([
        fetchAdminStats(),
        fetchMockups(),
        fetchUsers(),
        fetchOrders(),
        fetchTickets()
      ]);
      
      setStats(adminStats);
      setMockups(mockupsData);
      setUsers(usersData);
      setOrders(ordersData);
      setTickets(ticketsData);
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
      <UserList 
        users={users} 
        onRefresh={handleRefresh}
        stats={stats.users}
      />

      <OrderList
        orders={orders}
        onRefresh={handleRefresh}
      />

      <MockupList
        mockups={mockups}
        totalGenerations={stats.totalGenerations}
        onRefresh={handleRefresh}
        onShowUploader={() => setShowUploader(true)}
        onEdit={setEditingMockup}
      />

      <SupportTickets
        tickets={tickets}
        onRefresh={handleRefresh}
      />

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