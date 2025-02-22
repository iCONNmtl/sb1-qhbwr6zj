import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { updateUserCredits } from './subscription';
import toast from 'react-hot-toast';

export async function handleNewOrder(userId: string, orderId: string) {
  try {
    // Get user profile
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    if (!userSnap.exists()) return;

    const userData = userSnap.data();
    const autoPayEnabled = userData.autoPayOrders || false;
    const availableCredits = userData.subscription?.credits || 0;

    if (!autoPayEnabled) return;

    // Get order details
    const orderRef = doc(db, 'orders', orderId);
    const orderSnap = await getDoc(orderRef);
    if (!orderSnap.exists()) return;

    const orderData = orderSnap.data();
    if (orderData.status !== 'pending') return;

    const purchasePrice = Number(orderData.purchasePrice) || 0;
    const creditsNeeded = Math.ceil(purchasePrice * 40); // 1€ = 40 credits

    // Check if user has enough credits
    if (availableCredits < creditsNeeded) return;

    // Update order status
    await updateDoc(orderRef, {
      status: 'paid',
      isPaid: true,
      paidAt: new Date().toISOString(),
      paidWithCredits: true,
      creditsUsed: creditsNeeded
    });

    // Deduct credits
    await updateUserCredits(userId, creditsNeeded);

    toast.success('Commande payée automatiquement');
  } catch (error) {
    console.error('Error handling new order:', error);
  }
}