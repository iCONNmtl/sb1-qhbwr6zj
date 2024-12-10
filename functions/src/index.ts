import * as admin from 'firebase-admin';
import { handleStripeWebhook } from './stripe';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Initialize Firebase Admin
admin.initializeApp();

// Export the webhook handler
export const stripeWebhook = handleStripeWebhook;