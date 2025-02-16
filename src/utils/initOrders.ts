import { collection, query, where, getDocs, addDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { nanoid } from 'nanoid';
import type { Order } from '../types/order';

// Generate sample orders with unique IDs
const generateSampleOrders = (userId: string): Omit<Order, 'firestoreId'>[] => {
  const orders = [];
  const dates = [
    new Date(),
    new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
  ];

  for (let i = 0; i < dates.length; i++) {
    const orderId = nanoid();
    orders.push({
      id: orderId,
      userId,
      platform: i % 2 === 0 ? 'shopify' : 'etsy',
      orderId: `ORD${Date.now()}${i}`,
      customerName: `Client ${i + 1}`,
      customerEmail: `client${i + 1}@example.com`,
      shippingAddress: {
        street: '123 Rue de la Paix',
        city: 'Paris',
        state: 'Île-de-France',
        postalCode: '75001',
        country: 'France',
        phone: '+33612345678'
      },
      items: [
        {
          productId: `PROD${i + 1}`,
          variantId: `VAR${i + 1}`,
          quantity: Math.floor(Math.random() * 3) + 1,
          price: 25.00,
          size: '24x36"',
          dimensions: {
            inches: '24x36"',
            cm: '60x90cm'
          },
          sku: `${orderId}-24x36`
        }
      ],
      totalAmount: 65.00,
      status: i === 0 ? 'pending' : i === 1 ? 'paid' : 'shipped',
      isPaid: i !== 0,
      paidAt: i !== 0 ? dates[i].toISOString() : undefined,
      shippingMethod: {
        carrier: 'Colissimo',
        method: 'Standard',
        cost: 5.90,
        estimatedDays: 3,
        trackingNumber: i === 2 ? '1234567890' : undefined
      },
      createdAt: dates[i].toISOString(),
      updatedAt: dates[i].toISOString(),
      shippedAt: i === 2 ? dates[i].toISOString() : undefined
    });
  }

  return orders;
};

export async function initializeOrders(userId: string): Promise<void> {
  if (!userId) {
    throw new Error('User ID is required');
  }

  try {
    // Check if orders already exist for this user
    const ordersRef = collection(db, 'orders');
    const q = query(ordersRef, where('userId', '==', userId));
    const snapshot = await getDocs(q);

    // If no orders exist, create sample orders
    if (snapshot.empty) {
      const sampleOrders = generateSampleOrders(userId);
      await Promise.all(sampleOrders.map(order => addDoc(ordersRef, order)));
    }
  } catch (error) {
    console.error('Error initializing orders:', error);
    throw error;
  }
}