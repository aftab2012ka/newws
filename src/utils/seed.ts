import { 
  collection, 
  getDocs, 
  setDoc, 
  doc, 
  writeBatch 
} from 'firebase/firestore';
import { db } from './firebase';
import { 
  INITIAL_CATEGORIES, 
  INITIAL_ARTICLES, 
  INITIAL_VIDEOS, 
  INITIAL_COMMENTS, 
  DEFAULT_SETTINGS, 
  INSTALLED_ACCOUNTS 
} from '../data/initialData';

export async function seedDatabaseIfEmpty() {
  try {
    // 1. Check & Seed Settings (Document ID 'current' under 'settings')
    const settingsColl = await getDocs(collection(db, 'settings'));
    if (settingsColl.empty) {
      console.log('Seeding settings...');
      await setDoc(doc(db, 'settings', 'current'), {
        ...DEFAULT_SETTINGS,
        newsletterSubscribers: []
      });
    }

    // 2. Check & Seed Categories
    const categoriesColl = await getDocs(collection(db, 'categories'));
    if (categoriesColl.empty) {
      console.log('Seeding categories...');
      const batch = writeBatch(db);
      INITIAL_CATEGORIES.forEach((cat) => {
        const catRef = doc(db, 'categories', cat.id);
        batch.set(catRef, cat);
      });
      await batch.commit();
    }

    // 3. Check & Seed Articles
    const articlesColl = await getDocs(collection(db, 'articles'));
    if (articlesColl.empty) {
      console.log('Seeding articles...');
      const batch = writeBatch(db);
      INITIAL_ARTICLES.forEach((art) => {
        const artRef = doc(db, 'articles', art.id);
        batch.set(artRef, art);
      });
      await batch.commit();
    }

    // 4. Check & Seed Videos
    const videosColl = await getDocs(collection(db, 'videos'));
    if (videosColl.empty) {
      console.log('Seeding videos...');
      const batch = writeBatch(db);
      INITIAL_VIDEOS.forEach((vid) => {
        const vidRef = doc(db, 'videos', vid.id);
        batch.set(vidRef, vid);
      });
      await batch.commit();
    }

    // 5. Check & Seed Comments
    const commentsColl = await getDocs(collection(db, 'comments'));
    if (commentsColl.empty) {
      console.log('Seeding comments...');
      const batch = writeBatch(db);
      INITIAL_COMMENTS.forEach((comm) => {
        const commRef = doc(db, 'comments', comm.id);
        batch.set(commRef, comm);
      });
      await batch.commit();
    }

    // 6. Seed initial user metadata so security rules doesn't block them
    const usersColl = await getDocs(collection(db, 'users'));
    if (usersColl.empty) {
      console.log('Seeding pre-approved accounts...');
      const batch = writeBatch(db);
      // We also seed Aftab's and default accounts using their e-mail slug as ID
      INSTALLED_ACCOUNTS.forEach((usr) => {
        const emailSlug = usr.email.replace(/[@.]/g, '_');
        const userRef = doc(db, 'users', emailSlug);
        batch.set(userRef, usr);
      });
      await batch.commit();
    }

    console.log('Firebase Seeding Check: Seeding verification completed safely.');
  } catch (error) {
    console.warn('Initialization Seeding Notice (May occur if unauthenticated):', error);
  }
}
