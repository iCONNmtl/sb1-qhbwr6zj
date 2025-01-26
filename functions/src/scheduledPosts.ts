import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

export const checkScheduledPosts = functions.pubsub
  .schedule('every 1 hours')
  .onRun(async (context) => {
    const db = admin.firestore();
    const now = new Date();
    
    try {
      // Récupérer les posts programmés pour l'heure actuelle
      const snapshot = await db
        .collection('scheduledPosts')
        .where('status', '==', 'scheduled')
        .where('scheduledFor', '<=', now.toISOString())
        .get();

      const batch = db.batch();
      const publishPromises: Promise<any>[] = [];

      snapshot.docs.forEach(doc => {
        const post = doc.data();
        
        // Appeler le webhook de publication
        const publishPromise = fetch('https://hook.eu1.make.com/1brcdh36omu22jrtb06fwrpkb39nkw9b', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            mockups: post.mockups,
            platforms: post.platforms,
            userId: post.userId
          })
        })
        .then(async response => {
          if (!response.ok) {
            throw new Error('Publication failed');
          }
          
          // Mettre à jour le statut en "published"
          batch.update(doc.ref, {
            status: 'published',
            publishedAt: now.toISOString()
          });
        })
        .catch(error => {
          // En cas d'erreur, mettre à jour le statut en "failed"
          batch.update(doc.ref, {
            status: 'failed',
            error: error.message
          });
        });

        publishPromises.push(publishPromise);
      });

      // Attendre que toutes les publications soient terminées
      await Promise.all(publishPromises);
      
      // Exécuter le batch d'updates
      await batch.commit();

      return null;
    } catch (error) {
      console.error('Error checking scheduled posts:', error);
      return null;
    }
  });