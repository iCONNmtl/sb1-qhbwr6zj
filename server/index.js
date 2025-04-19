import express from 'express';
import cors from 'cors';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../src/lib/firebase';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.get('/api/designs', async (req, res) => {
  try {
    const { userId } = req.query;
    
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }
    
    // Fetch designs from products collection
    const productsRef = collection(db, 'products');
    const q = query(productsRef, where('userId', '==', userId));
    const snapshot = await getDocs(q);
    
    const designs = [];
    
    snapshot.docs.forEach(doc => {
      const product = doc.data();
      if (product.designUrl) {
        designs.push({
          id: doc.id,
          url: product.designUrl,
          name: product.title || product.type || 'Design sans nom',
          createdAt: product.createdAt || new Date().toISOString()
        });
      }
    });
    
    // Sort by creation date (newest first)
    designs.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    
    res.json({ designs });
  } catch (error) {
    console.error('Error fetching designs:', error);
    res.status(500).json({ error: 'Failed to fetch designs' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;