import { useState, useEffect } from 'react';
import Header from './components/Header';
import BreakingNewsTicker from './components/BreakingNewsTicker';
import NewsCategories from './components/NewsCategories';
import FeaturedNews from './components/FeaturedNews';
import LatestNewsGrid from './components/LatestNewsGrid';
import VideoNewsSection from './components/VideoNewsSection';
import TrendingNewsSidebar from './components/TrendingNewsSidebar';
import ArticlePage from './components/ArticlePage';
import AdminPanel from './components/AdminPanel';
import Footer from './components/Footer';

import { 
  NewsArticle, NewsCategory, YouTubeVideo, ArticleComment, 
  PortalSettings, UserAccount, Language 
} from './types';

import { 
  INITIAL_ARTICLES, INITIAL_CATEGORIES, INITIAL_VIDEOS, 
  INITIAL_COMMENTS, DEFAULT_SETTINGS, INSTALLED_ACCOUNTS 
} from './data/initialData';

import { UI_TRANSLATIONS } from './utils/translations';

// --- Firebase SDK Integrations ---
import { 
  collection, 
  onSnapshot, 
  doc, 
  setDoc, 
  deleteDoc, 
  updateDoc, 
  getDoc 
} from 'firebase/firestore';
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut 
} from 'firebase/auth';
import { db, auth, OperationType, handleFirestoreError } from './utils/firebase';
import { seedDatabaseIfEmpty } from './utils/seed';

export default function App() {
  // --- Persistent Firestore Storage State Layers ---
  const [articles, setArticles] = useState<NewsArticle[]>(INITIAL_ARTICLES);
  const [categories, setCategories] = useState<NewsCategory[]>(INITIAL_CATEGORIES);
  const [videos, setVideos] = useState<YouTubeVideo[]>(INITIAL_VIDEOS);
  const [comments, setComments] = useState<ArticleComment[]>(INITIAL_COMMENTS);
  const [settings, setSettings] = useState<PortalSettings>(DEFAULT_SETTINGS);
  const [users, setUsers] = useState<UserAccount[]>(INSTALLED_ACCOUNTS);

  // --- Session & Navigation States ---
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);

  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('ittehad_language');
    return (saved as Language) || 'en';
  });

  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('ittehad_dark_mode');
    return saved === 'true';
  });

  // Subsections states
  const [activeCategoryId, setActiveCategoryId] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentView, setCurrentView] = useState<'home' | 'article' | 'admin'>('home');
  const [currentArticleId, setCurrentArticleId] = useState<string | null>(null);

  // --- 1. Database Seeding on Initial Boot ---
  useEffect(() => {
    const runInitializationSeeding = async () => {
      await seedDatabaseIfEmpty();
    };
    runInitializationSeeding();
  }, []);

  // --- 2. Real-Time Firebase Auth & Role Mapping ---
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (authUser) => {
      if (authUser) {
        try {
          const userUidDocRef = doc(db, 'users', authUser.uid);
          const userUidSnap = await getDoc(userUidDocRef);
          
          let resolvedUserAccount: UserAccount | null = null;
          
          if (userUidSnap.exists()) {
            resolvedUserAccount = userUidSnap.data() as UserAccount;
          } else if (authUser.email) {
            // Check pre-seeding list indexed by email slug
            const emailSlug = authUser.email.replace(/[@.]/g, '_');
            const emailSlugRef = doc(db, 'users', emailSlug);
            const emailSlugSnap = await getDoc(emailSlugRef);
            
            if (emailSlugSnap.exists()) {
              const data = emailSlugSnap.data() as UserAccount;
              // Migrate email-slug to authentic uid-key to lock security rules
              await setDoc(userUidDocRef, data);
              resolvedUserAccount = data;
            } else {
              // Create guest standard reader account
              const newUser: UserAccount = {
                email: authUser.email,
                name: authUser.displayName || authUser.email.split('@')[0],
                role: 'User'
              };
              await setDoc(userUidDocRef, newUser);
              resolvedUserAccount = newUser;
            }
          }
          
          if (resolvedUserAccount) {
            setCurrentUser(resolvedUserAccount);
          }
        } catch (e) {
          console.error("Auth mapping profile error:", e);
        }
      } else {
        setCurrentUser(null);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  // --- 3. Collection Snapshot Sync Subscriptions ---
  useEffect(() => {
    // A. Subscribe Categories
    const unsubCategories = onSnapshot(collection(db, 'categories'), (snapshot) => {
      const list: NewsCategory[] = [];
      snapshot.forEach(doc => list.push(doc.data() as NewsCategory));
      if (list.length > 0) {
        setCategories(list);
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'categories');
    });

    // B. Subscribe Articles
    const unsubArticles = onSnapshot(collection(db, 'articles'), (snapshot) => {
      const list: NewsArticle[] = [];
      snapshot.forEach(doc => list.push(doc.data() as NewsArticle));
      if (list.length > 0) {
        setArticles(list);
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'articles');
    });

    // C. Subscribe Videos
    const unsubVideos = onSnapshot(collection(db, 'videos'), (snapshot) => {
      const list: YouTubeVideo[] = [];
      snapshot.forEach(doc => list.push(doc.data() as YouTubeVideo));
      if (list.length > 0) {
        setVideos(list);
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'videos');
    });

    // D. Subscribe Comments
    const unsubComments = onSnapshot(collection(db, 'comments'), (snapshot) => {
      const list: ArticleComment[] = [];
      snapshot.forEach(doc => list.push(doc.data() as ArticleComment));
      setComments(list.sort((a, b) => b.id.localeCompare(a.id)));
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'comments');
    });

    // E. Subscribe Settings
    const unsubSettings = onSnapshot(collection(db, 'settings'), (snapshot) => {
      snapshot.forEach(doc => {
        if (doc.id === 'current') {
          setSettings(doc.data() as PortalSettings);
        }
      });
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'settings');
    });

    // F. Subscribe privileged Users (only if signed-in as Admin or Editor)
    let unsubUsers = () => {};
    if (currentUser && (currentUser.role === 'Admin' || currentUser.role === 'Editor')) {
      unsubUsers = onSnapshot(collection(db, 'users'), (snapshot) => {
        const list: UserAccount[] = [];
        snapshot.forEach(doc => list.push(doc.data() as UserAccount));
        setUsers(list);
      }, (error) => {
        handleFirestoreError(error, OperationType.GET, 'users');
      });
    }

    return () => {
      unsubCategories();
      unsubArticles();
      unsubVideos();
      unsubComments();
      unsubSettings();
      unsubUsers();
    };
  }, [currentUser]);

  // Sync remaining preferences to local storage
  useEffect(() => {
    localStorage.setItem('ittehad_language', language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem('ittehad_dark_mode', String(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // --- 4. Firestore Transactional Update Handlers ---

  const handleSaveArticles = async (updated: NewsArticle[]) => {
    try {
      const currentIds = new Set(updated.map(a => a.id));
      const deleted = articles.filter(a => !currentIds.has(a.id));
      for (const art of deleted) {
        await deleteDoc(doc(db, 'articles', art.id));
      }
      for (const art of updated) {
        const exist = articles.find(a => a.id === art.id);
        if (!exist || JSON.stringify(exist) !== JSON.stringify(art)) {
          await setDoc(doc(db, 'articles', art.id), art);
        }
      }
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, 'articles');
    }
  };

  const handleSaveCategories = async (updated: NewsCategory[]) => {
    try {
      const currentIds = new Set(updated.map(c => c.id));
      const deleted = categories.filter(c => !currentIds.has(c.id));
      for (const cat of deleted) {
        await deleteDoc(doc(db, 'categories', cat.id));
      }
      for (const cat of updated) {
        const exist = categories.find(c => c.id === cat.id);
        if (!exist || JSON.stringify(exist) !== JSON.stringify(cat)) {
          await setDoc(doc(db, 'categories', cat.id), cat);
        }
      }
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, 'categories');
    }
  };

  const handleSaveVideos = async (updated: YouTubeVideo[]) => {
    try {
      const currentIds = new Set(updated.map(v => v.id));
      const deleted = videos.filter(v => !currentIds.has(v.id));
      for (const vid of deleted) {
        await deleteDoc(doc(db, 'videos', vid.id));
      }
      for (const vid of updated) {
        const exist = videos.find(v => v.id === vid.id);
        if (!exist || JSON.stringify(exist) !== JSON.stringify(vid)) {
          await setDoc(doc(db, 'videos', vid.id), vid);
        }
      }
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, 'videos');
    }
  };

  const handleSaveComments = async (updated: ArticleComment[]) => {
    try {
      const currentIds = new Set(updated.map(c => c.id));
      const deleted = comments.filter(c => !currentIds.has(c.id));
      for (const comm of deleted) {
        await deleteDoc(doc(db, 'comments', comm.id));
      }
      for (const comm of updated) {
        const exist = comments.find(c => c.id === comm.id);
        if (!exist || JSON.stringify(exist) !== JSON.stringify(comm)) {
          await setDoc(doc(db, 'comments', comm.id), comm);
        }
      }
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, 'comments');
    }
  };

  const handleSaveSettings = async (updated: PortalSettings) => {
    try {
      await setDoc(doc(db, 'settings', 'current'), updated);
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, 'settings/current');
    }
  };

  const handleSaveUsers = async (updated: UserAccount[]) => {
    try {
      const currentEmails = new Set(updated.map(u => u.email.toLowerCase()));
      const deleted = users.filter(u => !currentEmails.has(u.email.toLowerCase()));
      for (const usr of deleted) {
        const idSlug = usr.email.replace(/[@.]/g, '_');
        await deleteDoc(doc(db, 'users', idSlug));
      }
      for (const usr of updated) {
        const idSlug = usr.email.replace(/[@.]/g, '_');
        const exist = users.find(u => u.email.toLowerCase() === usr.email.toLowerCase());
        if (!exist || JSON.stringify(exist) !== JSON.stringify(usr)) {
          await setDoc(doc(db, 'users', idSlug), usr);
        }
      }
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, 'users');
    }
  };

  // --- 5. Authentication Flow Handlers ---

  const handleUserLogin = (email: string): boolean => {
    const found = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (found) {
      setCurrentUser(found);
      return true;
    }
    return false;
  };

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Google Sign-In Error:", error);
    }
  };

  const handleUserLogout = async () => {
    try {
      await signOut(auth);
      setCurrentUser(null);
      setCurrentView('home');
    } catch (e) {
      console.error("Logout Error:", e);
    }
  };

  // --- 6. Reader Interactions ---
  
  const handleOpenArticle = async (id: string) => {
    setCurrentArticleId(id);
    setCurrentView('article');
    const art = articles.find(a => a.id === id);
    if (art) {
      try {
        await updateDoc(doc(db, 'articles', id), {
          views: (art.views || 0) + 1
        });
      } catch (e) {
        handleFirestoreError(e, OperationType.UPDATE, `articles/${id}`);
      }
    }
  };

  const handleLikeArticle = async (id: string) => {
    const art = articles.find(a => a.id === id);
    if (art) {
      try {
        await updateDoc(doc(db, 'articles', id), {
          likes: (art.likes || 0) + 1
        });
      } catch (e) {
        handleFirestoreError(e, OperationType.UPDATE, `articles/${id}`);
      }
    }
  };

  const handleAddComment = async (articleId: string, name: string, email: string, content: string) => {
    const newComment: ArticleComment = {
      id: `comm-${Date.now()}`,
      articleId,
      name,
      email,
      content,
      date: new Date().toISOString().split('T')[0] + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      approved: false
    };
    try {
      await setDoc(doc(db, 'comments', newComment.id), newComment);
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, `comments/${newComment.id}`);
    }
  };

  const handleSubscribeNewsletter = async (email: string) => {
    try {
      const updatedNewsletterSubscribers = [...(settings as any).newsletterSubscribers || [], email];
      await updateDoc(doc(db, 'settings', 'current'), {
        newsletterSubscribers: updatedNewsletterSubscribers
      });
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, 'settings/current');
    }
  };

  const activeArticle = articles.find(a => a.id === currentArticleId);

  // --- 7. Articles Filtration Logic ---
  
  const getFilteredArticles = (): NewsArticle[] => {
    let filtered = articles.filter(a => a.language === language);
    const todayStr = new Date().toISOString().split('T')[0];
    filtered = filtered.filter(a => {
      if (a.status === 'scheduled' && a.scheduledDate) {
        return a.scheduledDate <= todayStr;
      }
      return a.status === 'published';
    });

    if (activeCategoryId !== 'all') {
      if (activeCategoryId === 'breaking') {
        filtered = filtered.filter(a => a.breaking);
      } else {
        filtered = filtered.filter(a => a.category === activeCategoryId);
      }
    }

    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(a => 
        a.title.toLowerCase().includes(q) || 
        a.summary.toLowerCase().includes(q) || 
        a.content.toLowerCase().includes(q)
      );
    }

    return filtered;
  };

  const filteredArticles = getFilteredArticles();
  const t = UI_TRANSLATIONS[language];
  const isRTL = language === 'ur';

  return (
    <div className={`min-h-screen font-sans ${darkMode ? 'dark bg-slate-950 text-slate-100' : 'bg-slate-50/40 text-slate-900'} flex flex-col justify-between transition-colors duration-250`}>
      
      <Header
        websiteName={settings.websiteName}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        language={language}
        setLanguage={(l) => {
          setLanguage(l);
          setSearchQuery('');
          setActiveCategoryId('all');
        }}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        onOpenAdmin={() => setCurrentView('admin')}
        onHome={() => { setCurrentView('home'); setActiveCategoryId('all'); setSearchQuery(''); }}
        isSignedIn={!!currentUser}
        currentUserRole={currentUser ? currentUser.role : null}
        onLogout={handleUserLogout}
        pendingCommentsCount={comments.filter(c => !c.approved).length}
      />

      <main className="flex-1 w-full" id="application-core-body">
        
        {currentView === 'admin' ? (
          <AdminPanel
            articles={articles}
            categories={categories}
            videos={videos}
            comments={comments}
            settings={settings}
            users={users}
            onSaveArticles={handleSaveArticles}
            onSaveCategories={handleSaveCategories}
            onSaveVideos={handleSaveVideos}
            onSaveComments={handleSaveComments}
            onSaveSettings={handleSaveSettings}
            onSaveUsers={handleSaveUsers}
            currentUser={currentUser}
            onLogin={handleUserLogin}
            onGoogleLogin={handleGoogleLogin}
            onLogout={handleUserLogout}
            onClose={() => setCurrentView('home')}
          />
        ) : (
          /* VIEW B: ARTICLE READER DISPLAY */
          currentView === 'article' && activeArticle ? (
            <ArticlePage
              article={activeArticle}
              allArticles={articles}
              categories={categories}
              comments={comments}
              language={language}
              onBack={() => setCurrentView('home')}
              onArticleClick={handleOpenArticle}
              onLike={handleLikeArticle}
              onAddComment={handleAddComment}
            />
          ) : (
            /* VIEW C: HOMEPAGE PORTAL INDEX GRID */
            <div className="space-y-0.5">
              
              {/* Breaking News Ticker Bar */}
              <BreakingNewsTicker
                articles={articles}
                language={language}
                onArticleClick={handleOpenArticle}
              />

              {/* Multilingual Horizontal Categories Selection Navigation */}
              <NewsCategories
                categories={categories}
                activeCategoryId={activeCategoryId}
                setActiveCategoryId={(cid) => {
                  setActiveCategoryId(cid);
                  setSearchQuery(''); // clear query when switching categories
                }}
                language={language}
              />

              {/* Main Content Layout Container */}
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                
                {/* 1. Large Top Story Hero Banner (Only visible in 'all/Home' and when no active search) */}
                {activeCategoryId === 'all' && searchQuery === '' && (
                  <FeaturedNews
                    articles={articles}
                    categories={categories}
                    language={language}
                    onArticleClick={handleOpenArticle}
                  />
                )}

                {/* 2. Secondary Bento Columns splits: Left is news grid + YouTube, Right is Sidebar Widgets */}
                <div className={`grid grid-cols-1 lg:grid-cols-3 gap-8 items-start ${
                  isRTL ? 'lg:flex lg:flex-row-reverse lg:gap-8' : ''
                }`}>
                  
                  {/* LEFT STREAM: Latest Grid + YT Video News Carousel */}
                  <div className="lg:col-span-2 space-y-10 order-1">
                    
                    {/* Header Label block */}
                    <div className={`flex items-baseline justify-between border-b border-sky-100 dark:border-slate-800 pb-3 mb-2 ${
                      isRTL ? 'flex-row-reverse' : ''
                    }`}>
                      <h2 className="text-md sm:text-lg font-extrabold tracking-tight text-slate-900 dark:text-white uppercase">
                        {searchQuery ? `${t.latest} (${searchQuery})` : t.latest}
                      </h2>
                      <span className="text-4xs text-slate-400 font-mono">
                        {filteredArticles.length} articles displayed
                      </span>
                    </div>

                    {/* Latest interactive cards grid */}
                    <LatestNewsGrid
                      articles={filteredArticles}
                      categories={categories}
                      language={language}
                      onArticleClick={handleOpenArticle}
                    />

                    {/* YouTube Video bulletins stream section */}
                    <VideoNewsSection
                      videos={videos}
                      categories={categories}
                      language={language}
                    />
                  </div>

                  {/* RIGHT STREAM: Trending headlines list + Simulated AdSense slots */}
                  <div className="space-y-8 order-2 lg:w-full">
                    
                    {/* Standard Google AdSense Sandbox rendering */}
                    {settings.isAdSenseActive && (
                      <div className="bg-slate-100/60 dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-800 rounded-xl p-4 text-center select-none shadow-3xs hover:border-slate-300 dark:hover:border-slate-700 transition-colors">
                        <span className="block text-[8px] tracking-widest text-slate-400 font-bold uppercase font-mono mb-2">
                          ★ Google Ad space • {settings.googleAdSenseCode}
                        </span>
                        <div className="w-full h-32 bg-slate-200/50 dark:bg-slate-950/60 rounded border border-dashed border-slate-300 dark:border-slate-800 flex flex-col justify-center items-center text-slate-400 p-3">
                          <span className="text-[10px] font-sans font-bold leading-normal text-slate-450">Premium Editorial Ad Slot</span>
                          <span className="text-[9px] text-slate-400/80 leading-normal font-sans font-normal max-w-[180px] mt-1">Sponsor content tailored to your reading coordinates</span>
                        </div>
                      </div>
                    )}

                    {/* Numbered trending list columns */}
                    <TrendingNewsSidebar
                      articles={articles}
                      language={language}
                      onArticleClick={handleOpenArticle}
                    />

                    {/* Bottom Google AdSense Sandbox spot */}
                    {settings.isAdSenseActive && (
                      <div className="bg-slate-100/60 dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-800 rounded-xl p-4 text-center select-none shadow-3xs">
                        <span className="block text-[8px] tracking-widest text-slate-400 font-bold uppercase font-mono mb-2">
                          ★ Banner Advertisement
                        </span>
                        <div className="w-full h-24 bg-slate-200/50 dark:bg-slate-950/60 rounded border border-dashed border-slate-300 dark:border-slate-800 flex items-center justify-center text-slate-400 p-2 text-center text-4xs">
                          <span>Ad space ca-pub-1234567890123456</span>
                        </div>
                      </div>
                    )}
                  </div>

                </div>

              </div>
            </div>
          )
        )}
      </main>

      {/* 2. Responsive Multi-modal Footer */}
      <Footer
        settings={settings}
        language={language}
        onAboutClick={() => {
          // Open contact/about segment modal
        }}
        onSubscribeNewsletter={handleSubscribeNewsletter}
      />

    </div>
  );
}
