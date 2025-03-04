import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { UserProfile } from '../types/user';
import type { Order } from '../types/order';

interface AdminStats {
  users: {
    total: number;
    basic: number;
    pro: number;
    expert: number;
    basicPercentage: number;
    proPercentage: number;
    expertPercentage: number;
  };
  orders: {
    total: number;
    pending: number;
    paid: number;
    shipped: number;
    delivered: number;
    totalRevenue: number;
    averageOrderValue: number;
  };
  mockups: number;
  totalGenerations: number;
}

export async function fetchAdminStats(): Promise<AdminStats> {
  try {
    // Fetch users
    const usersSnap = await getDocs(collection(db, 'users'));
    const users = usersSnap.docs.map(doc => doc.data() as UserProfile);
    
    const userStats = users.reduce((acc, user) => {
      acc.total++;
      const plan = user.subscription?.plan?.toLowerCase() || 'basic';
      if (plan === 'basic') acc.basic++;
      else if (plan === 'pro') acc.pro++;
      else if (plan === 'expert') acc.expert++;
      return acc;
    }, { total: 0, basic: 0, pro: 0, expert: 0 });

    // Calculate percentages
    const basicPercentage = Math.round((userStats.basic / userStats.total) * 100) || 0;
    const proPercentage = Math.round((userStats.pro / userStats.total) * 100) || 0;
    const expertPercentage = Math.round((userStats.expert / userStats.total) * 100) || 0;

    // Fetch orders
    const ordersSnap = await getDocs(collection(db, 'orders'));
    const orders = ordersSnap.docs.map(doc => doc.data() as Order);
    
    const orderStats = orders.reduce((acc, order) => {
      acc.total++;
      acc.totalRevenue += order.totalAmount;
      
      switch (order.status) {
        case 'pending':
          acc.pending++;
          break;
        case 'paid':
          acc.paid++;
          break;
        case 'shipped':
          acc.shipped++;
          break;
        case 'delivered':
          acc.delivered++;
          break;
      }
      
      return acc;
    }, {
      total: 0,
      pending: 0,
      paid: 0,
      shipped: 0,
      delivered: 0,
      totalRevenue: 0,
      averageOrderValue: 0
    });

    // Calculate average order value
    orderStats.averageOrderValue = orderStats.total > 0 
      ? orderStats.totalRevenue / orderStats.total 
      : 0;

    // Count mockups
    const mockupsSnap = await getDocs(collection(db, 'mockups'));
    const mockupsCount = mockupsSnap.size;

    // Count total generations
    const generationsSnap = await getDocs(collection(db, 'generations'));
    const totalGenerations = generationsSnap.docs.reduce((total, doc) => {
      const generation = doc.data();
      return total + (generation.mockups?.length || 0);
    }, 0);

    return {
      users: {
        ...userStats,
        basicPercentage,
        proPercentage,
        expertPercentage
      },
      orders: orderStats,
      mockups: mockupsCount,
      totalGenerations
    };
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    throw error;
  }
}

export async function getMockupGenerationCount(mockupId: string): Promise<number> {
  try {
    const generationsSnap = await getDocs(collection(db, 'generations'));
    let count = 0;
    
    generationsSnap.docs.forEach(doc => {
      const generation = doc.data();
      if (generation.mockups?.some((m: any) => m.id === mockupId)) {
        count++;
      }
    });
    
    return count;
  } catch (error) {
    console.error('Error getting mockup generation count:', error);
    return 0;
  }
}

export async function getUserGenerationCount(userId: string): Promise<number> {
  try {
    const q = query(collection(db, 'generations'), where('userId', '==', userId));
    const generationsSnap = await getDocs(q);
    let count = 0;
    
    generationsSnap.docs.forEach(doc => {
      const generation = doc.data();
      count += generation.mockups?.length || 0;
    });
    
    return count;
  } catch (error) {
    console.error('Error getting user generation count:', error);
    return 0;
  }
}