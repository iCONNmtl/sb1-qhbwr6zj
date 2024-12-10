import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { UserProfile } from '../types/user';

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
  mockups: number;
  totalGenerations: number;
  revenue: number;
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

    // Count mockups
    const mockupsSnap = await getDocs(collection(db, 'mockups'));
    const mockupsCount = mockupsSnap.size;

    // Count total generations
    const generationsSnap = await getDocs(collection(db, 'generations'));
    const totalGenerations = generationsSnap.docs.reduce((total, doc) => {
      const generation = doc.data();
      return total + (generation.mockups?.length || 0);
    }, 0);

    // Calculate revenue (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const paymentsQuery = query(
      collection(db, 'payments'),
      where('createdAt', '>=', thirtyDaysAgo.toISOString())
    );
    
    const paymentsSnap = await getDocs(paymentsQuery);
    const revenue = paymentsSnap.docs.reduce(
      (acc, doc) => acc + (doc.data().amount || 0),
      0
    );

    return {
      users: {
        ...userStats,
        basicPercentage,
        proPercentage,
        expertPercentage
      },
      mockups: mockupsCount,
      totalGenerations,
      revenue: revenue / 100 // Convert cents to euros
    };
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    throw error;
  }
}