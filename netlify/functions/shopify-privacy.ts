import { Handler } from '@netlify/functions';
import { doc, collection, query, where, getDocs, deleteDoc, writeBatch } from 'firebase/firestore';
import { db } from '../../src/lib/firebase';

// Verify Shopify webhook
const verifyShopifyWebhook = (headers: { [key: string]: string }, body: string) => {
  const hmac = headers['x-shopify-hmac-sha256'];
  // In production, verify HMAC signature here
  return true;
};

export const handler: Handler = async (event) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    // Verify webhook authenticity
    const isValid = verifyShopifyWebhook(event.headers, event.body || '');
    if (!isValid) {
      return {
        statusCode: 401,
        body: JSON.stringify({ error: 'Invalid webhook signature' })
      };
    }

    const body = JSON.parse(event.body || '');
    const { shop_domain, customer: { id: customerId, email } } = body;

    switch (event.headers['x-shopify-topic']) {
      case 'customers/data_request':
        // Handle customer data request
        const customerData = await getCustomerData(email);
        // In production, send this data to the customer via secure channel
        return {
          statusCode: 200,
          body: JSON.stringify({ message: 'Data request processed', data: customerData })
        };

      case 'customers/redact':
        // Handle customer data redaction
        await redactCustomerData(email);
        return {
          statusCode: 200,
          body: JSON.stringify({ message: 'Customer data redacted' })
        };

      case 'shop/redact':
        // Handle shop data redaction
        await redactShopData(shop_domain);
        return {
          statusCode: 200,
          body: JSON.stringify({ message: 'Shop data redacted' })
        };

      default:
        return {
          statusCode: 400,
          body: JSON.stringify({ error: 'Unsupported webhook topic' })
        };
    }
  } catch (error: any) {
    console.error('Webhook error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message || 'Internal server error' })
    };
  }
};

async function getCustomerData(email: string) {
  // Query all data related to this customer
  const userQuery = query(collection(db, 'users'), where('email', '==', email));
  const userDocs = await getDocs(userQuery);
  
  const data = {
    user: null as any,
    orders: [] as any[],
    generations: [] as any[]
  };

  if (!userDocs.empty) {
    const userId = userDocs.docs[0].id;
    data.user = userDocs.docs[0].data();

    // Get orders
    const ordersQuery = query(collection(db, 'orders'), where('userId', '==', userId));
    const orderDocs = await getDocs(ordersQuery);
    data.orders = orderDocs.docs.map(doc => doc.data());

    // Get generations
    const generationsQuery = query(collection(db, 'generations'), where('userId', '==', userId));
    const generationDocs = await getDocs(generationsQuery);
    data.generations = generationDocs.docs.map(doc => doc.data());
  }

  return data;
}

async function redactCustomerData(email: string) {
  const batch = writeBatch(db);
  
  // Find user by email
  const userQuery = query(collection(db, 'users'), where('email', '==', email));
  const userDocs = await getDocs(userQuery);
  
  if (!userDocs.empty) {
    const userId = userDocs.docs[0].id;

    // Delete or anonymize user data
    batch.update(doc(db, 'users', userId), {
      email: `redacted_${Date.now()}`,
      subscription: {
        plan: 'Basic',
        credits: 0,
        active: false
      },
      platformAccounts: [],
      logoUrl: null,
      pinterestAuth: null,
      shopifyAuth: null,
      etsyAuth: null,
      deletedAt: new Date().toISOString()
    });

    // Delete related data
    const collections = ['orders', 'generations', 'templates'];
    for (const collectionName of collections) {
      const q = query(collection(db, collectionName), where('userId', '==', userId));
      const docs = await getDocs(q);
      docs.forEach(doc => batch.delete(doc.ref));
    }

    await batch.commit();
  }
}

async function redactShopData(shopDomain: string) {
  const batch = writeBatch(db);
  
  // Find all users connected to this shop
  const usersQuery = query(
    collection(db, 'users'), 
    where('shopifyAuth.shop', '==', shopDomain)
  );
  const userDocs = await getDocs(usersQuery);

  for (const userDoc of userDocs.docs) {
    const userId = userDoc.id;

    // Remove Shopify auth data
    batch.update(doc(db, 'users', userId), {
      shopifyAuth: null
    });

    // Delete or anonymize related orders
    const ordersQuery = query(
      collection(db, 'orders'),
      where('userId', '==', userId),
      where('platform', '==', 'shopify')
    );
    const orderDocs = await getDocs(ordersQuery);
    
    orderDocs.forEach(orderDoc => {
      batch.delete(orderDoc.ref);
    });
  }

  await batch.commit();
}