import React, { useState } from 'react';
import { 
  Plus, Edit, Trash2, Check, X, Shield, Lock, LayoutDashboard, FileText, 
  Settings, FolderKanban, Video, Globe, Users, MessageSquare, Bell, ArrowLeft,
  Calendar, Eye, Heart, PlusCircle, CheckCircle, Info, Sparkles
} from 'lucide-react';
import { 
  NewsArticle, NewsCategory, YouTubeVideo, ArticleComment, 
  PortalSettings, UserAccount, Language, UserRole 
} from '../types';

interface AdminPanelProps {
  articles: NewsArticle[];
  categories: NewsCategory[];
  videos: YouTubeVideo[];
  comments: ArticleComment[];
  settings: PortalSettings;
  users: UserAccount[];
  
  onSaveArticles: (arts: NewsArticle[]) => void;
  onSaveCategories: (cats: NewsCategory[]) => void;
  onSaveVideos: (vids: YouTubeVideo[]) => void;
  onSaveComments: (coms: ArticleComment[]) => void;
  onSaveSettings: (setts: PortalSettings) => void;
  onSaveUsers: (usrs: UserAccount[]) => void;
  
  currentUser: UserAccount | null;
  onLogin: (email: string) => boolean;
  onGoogleLogin?: () => void;
  onLogout: () => void;
  onClose: () => void;
}

export default function AdminPanel({
  articles,
  categories,
  videos,
  comments,
  settings,
  users,
  onSaveArticles,
  onSaveCategories,
  onSaveVideos,
  onSaveComments,
  onSaveSettings,
  onSaveUsers,
  currentUser,
  onLogin,
  onGoogleLogin,
  onLogout,
  onClose
}: AdminPanelProps) {
  // Navigation tabs in Admin
  const [activeTab, setActiveTab] = useState<'dashboard' | 'news' | 'categories' | 'videos' | 'comments' | 'settings' | 'users'>('dashboard');

  // Login inputs
  const [loginEmail, setLoginEmail] = useState('');
  const [loginError, setLoginError] = useState('');

  // Editing forms state
  const [newsEditId, setNewsEditId] = useState<string | null>(null); // null means adding new unless writingNew is true
  const [writingNewNews, setWritingNewNews] = useState(false);
  const [newsForm, setNewsForm] = useState<Partial<NewsArticle>>({
    title: '', summary: '', content: '', image: '', category: 'politics',
    language: 'en', featured: false, breaking: false, status: 'published', scheduledDate: ''
  });

  // Category forms state
  const [categoryEditId, setCategoryEditId] = useState<string | null>(null);
  const [writingNewCategory, setWritingNewCategory] = useState(false);
  const [categoryForm, setCategoryForm] = useState<Partial<NewsCategory>>({
    id: '', nameEN: '', nameUR: '', nameKN: '', icon: 'FileText'
  });

  // Video forms state
  const [videoEditId, setVideoEditId] = useState<string | null>(null);
  const [writingNewVideo, setWritingNewVideo] = useState(false);
  const [videoForm, setVideoForm] = useState<Partial<YouTubeVideo>>({
    title: '', description: '', youtubeUrl: '', category: 'politics'
  });

  // Settings form state
  const [settingsForm, setSettingsForm] = useState<PortalSettings>({ ...settings });

  // Users management forms
  const [userFormEmail, setUserFormEmail] = useState('');
  const [userFormName, setUserFormName] = useState('');
  const [userFormRole, setUserFormRole] = useState<UserRole>('Reporter');

  // Push notifications generator state
  const [pushTitle, setPushTitle] = useState('');
  const [pushText, setPushText] = useState('');
  const [pushLogs, setPushLogs] = useState<{ time: string; title: string; text: string }[]>([]);
  const [notificationSuccess, setNotificationSuccess] = useState(false);

  // Status alerts
  const [auditMessage, setAuditMessage] = useState('');

  // Handle Login
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail.trim()) return;
    const ok = onLogin(loginEmail.trim());
    if (ok) {
      setLoginError('');
      setLoginEmail('');
    } else {
      setLoginError('This email is not registered with permissions in Ittehad News. Register first or use Quick Logins below.');
    }
  };

  const handleQuickDemoLogin = (email: string) => {
    onLogin(email);
  };

  // Helper check for role based rights
  const hasAccess = (required: 'Admin' | 'Editor' | 'Reporter'): boolean => {
    if (!currentUser) return false;
    const rolesOrder: UserRole[] = ['Reporter', 'Editor', 'Admin'];
    const userIdx = rolesOrder.indexOf(currentUser.role);
    const reqIdx = rolesOrder.indexOf(required);
    return userIdx >= reqIdx;
  };

  // Calculate generic dashboard summary stats
  const totalNews = articles.length;
  const totalViews = articles.reduce((sum, current) => sum + (current.views || 0), 0);
  const totalUniqueCategories = categories.length;
  const totalYouTubeVideos = videos.length;
  const pendingComments = comments.filter(c => !c.approved);

  // Preset article image URLs for ease of layout creation
  const imagePresetUrls = [
    { label: 'Technology', url: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=800' },
    { label: 'Education/Class', url: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=800' },
    { label: 'Politics Assemble', url: 'https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?auto=format&fit=crop&q=80&w=800' },
    { label: 'Business Growth', url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800' },
    { label: 'Sports Running', url: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&q=80&w=800' },
    { label: 'Health Center', url: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=800' }
  ];

  // Article CRUD Actions
  const handleSaveNewsArticle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    
    // Check permission rules: Reporter can only add, or edit their OWN news.
    if (newsEditId) {
      const original = articles.find(a => a.id === newsEditId);
      if (original) {
        if (currentUser.role === 'Reporter' && original.author !== currentUser.name) {
          alert('Reporter Access Denied: You cannot edit articles drafted by other journalists.');
          return;
        }
      }
    }

    const title = newsForm.title || 'Untitled Bulletin';
    const summary = newsForm.summary || '';
    const content = newsForm.content || '';
    const image = newsForm.image || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&q=80&w=850';
    const cat = newsForm.category || 'politics';
    const lang = newsForm.language || 'en';
    const featured = !!newsForm.featured;
    const breaking = !!newsForm.breaking;
    const status = newsForm.status || 'published';
    const schedDate = newsForm.scheduledDate || '';

    if (newsEditId) {
      // Editing
      const updated = articles.map(art => {
        if (art.id === newsEditId) {
          return {
            ...art,
            title, summary, content, image, category: cat, language: lang,
            featured, breaking, status, scheduledDate: schedDate,
            // maintain statistics
            updatedAt: new Date().toISOString()
          };
        }
        return art;
      });
      onSaveArticles(updated);
      setAuditMessage('Article successfully modified.');
    } else {
      // Create new
      const newArt: NewsArticle = {
        id: `art-${Date.now()}`,
        title, summary, content, image, category: cat, language: lang,
        featured, breaking, status, scheduledDate: schedDate,
        date: new Date().toISOString().split('T')[0],
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        author: currentUser.name,
        authorRole: currentUser.role,
        views: 0,
        likes: 0
      };
      onSaveArticles([newArt, ...articles]);
      setAuditMessage('New article successfully published.');
    }

    // Reset Form
    setNewsEditId(null);
    setWritingNewNews(false);
    setNewsForm({
      title: '', summary: '', content: '', image: '', category: 'politics',
      language: 'en', featured: false, breaking: false, status: 'published', scheduledDate: ''
    });
    setTimeout(() => setAuditMessage(''), 5000);
  };

  const handleEditNewsClick = (article: NewsArticle) => {
    if (currentUser?.role === 'Reporter' && article.author !== currentUser.name) {
      alert('Access Denied: As a Reporter, you can only modify your own written bulletins.');
      return;
    }
    setNewsEditId(article.id);
    setWritingNewNews(true);
    setNewsForm({
      title: article.title,
      summary: article.summary,
      content: article.content,
      image: article.image,
      category: article.category,
      language: article.language,
      featured: article.featured,
      breaking: article.breaking,
      status: article.status,
      scheduledDate: article.scheduledDate || ''
    });
  };

  const handleDeleteNewsClick = (id: string) => {
    const article = articles.find(a => a.id === id);
    if (!article) return;
    if (currentUser?.role === 'Reporter' && article.author !== currentUser.name) {
      alert('Access Denied: As a Reporter, you can only delete your own written bulletins.');
      return;
    }
    if (confirm('Are you absolutely certain you want to delete this article? This operation is irreversible.')) {
      onSaveArticles(articles.filter(a => a.id !== id));
      setAuditMessage('Article deleted successfully.');
      setTimeout(() => setAuditMessage(''), 5000);
    }
  };

  // Category CRUD Actions
  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasAccess('Editor')) {
      alert('Access Denied: You must be an Editor or Administrator to manage categories.');
      return;
    }

    const cid = (categoryForm.id || '').trim().toLowerCase().replace(/\s+/g, '-');
    const nameEN = categoryForm.nameEN || 'Untitled';
    const nameUR = categoryForm.nameUR || '';
    const nameKN = categoryForm.nameKN || '';
    const icon = categoryForm.icon || 'FileText';

    if (!cid) return;

    if (categoryEditId) {
      const updated = categories.map(c => {
        if (c.id === categoryEditId) {
          return { id: c.id, nameEN, nameUR, nameKN, icon };
        }
        return c;
      });
      onSaveCategories(updated);
      setAuditMessage('Category updated successfully.');
    } else {
      if (categories.some(c => c.id === cid)) {
        alert('A category with this ID already exists. Please select a unique identifier.');
        return;
      }
      const newCat: NewsCategory = { id: cid, nameEN, nameUR, nameKN, icon };
      onSaveCategories([...categories, newCat]);
      setAuditMessage('Category created successfully.');
    }

    setCategoryEditId(null);
    setWritingNewCategory(false);
    setCategoryForm({ id: '', nameEN: '', nameUR: '', nameKN: '', icon: 'FileText' });
    setTimeout(() => setAuditMessage(''), 5000);
  };

  const handleEditCategoryClick = (cat: NewsCategory) => {
    if (!hasAccess('Editor')) {
      alert('Access Denied: Editors and Admins only can edit categories.');
      return;
    }
    setCategoryEditId(cat.id);
    setWritingNewCategory(true);
    setCategoryForm({
      id: cat.id,
      nameEN: cat.nameEN,
      nameUR: cat.nameUR,
      nameKN: cat.nameKN,
      icon: cat.icon
    });
  };

  const handleDeleteCategoryClick = (id: string) => {
    if (!hasAccess('Editor')) {
      alert('Access Denied: Editors and Admins only.');
      return;
    }
    if (id === 'all' || id === 'breaking' || id === 'politics' || id === 'local') {
      alert('Preserved core system categories cannot be deleted.');
      return;
    }
    if (confirm(`Are you sure you want to delete category "${id}"? Articles using this category will be preserved but orphaned.`)) {
      onSaveCategories(categories.filter(c => c.id !== id));
      setAuditMessage('Category removed.');
      setTimeout(() => setAuditMessage(''), 4000);
    }
  };

  // Video CRUD Actions
  const handleSaveVideo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasAccess('Editor')) {
      alert('Access Denied: Only Editors/Admins can edit videos.');
      return;
    }

    const title = videoForm.title || 'Untitled video';
    const description = videoForm.description || '';
    const url = videoForm.youtubeUrl || '';
    const category = videoForm.category || 'politics';

    // Extract youtube ID
    let ytId = 'dQw4w9WgXcQ';
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    if (match && match[2].length === 11) {
      ytId = match[2];
    } else {
      alert('Incorrect or unrecognized YouTube URL format. Standard fallback used.');
    }

    if (videoEditId) {
      const updated = videos.map(v => {
        if (v.id === videoEditId) {
          return { id: v.id, title, description, youtubeUrl: url, youtubeId: ytId, category, date: v.date };
        }
        return v;
      });
      onSaveVideos(updated);
      setAuditMessage('Video bulletin modified.');
    } else {
      const newVid: YouTubeVideo = {
        id: `vid-${Date.now()}`,
        title, description, youtubeUrl: url, youtubeId: ytId, category,
        date: new Date().toISOString().split('T')[0]
      };
      onSaveVideos([newVid, ...videos]);
      setAuditMessage('Video bulletin published.');
    }

    setVideoEditId(null);
    setWritingNewVideo(false);
    setVideoForm({ title: '', description: '', youtubeUrl: '', category: 'politics' });
    setTimeout(() => setAuditMessage(''), 5000);
  };

  const handleEditVideoClick = (v: YouTubeVideo) => {
    setVideoEditId(v.id);
    setWritingNewVideo(true);
    setVideoForm({
      title: v.title,
      description: v.description,
      youtubeUrl: v.youtubeUrl,
      category: v.category
    });
  };

  const handleDeleteVideoClick = (id: string) => {
    if (confirm('Delete this YouTube video news?')) {
      onSaveVideos(videos.filter(v => v.id !== id));
      setAuditMessage('Video removed.');
      setTimeout(() => setAuditMessage(''), 4000);
    }
  };

  // Comments moderation
  const toggleCommentApproval = (id: string) => {
    const updated = comments.map(c => {
      if (c.id === id) {
        return { ...c, approved: !c.approved };
      }
      return c;
    });
    onSaveComments(updated);
    setAuditMessage('Comment status revised.');
    setTimeout(() => setAuditMessage(''), 4000);
  };

  const handleDeleteComment = (id: string) => {
    if (confirm('Delete this comment permanently?')) {
      onSaveComments(comments.filter(c => c.id !== id));
      setAuditMessage('Comment deleted.');
      setTimeout(() => setAuditMessage(''), 4050);
    }
  };

  // Portal Master Settings update
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasAccess('Admin')) {
      alert('Only Administrators can edit core portal parameters.');
      return;
    }
    onSaveSettings(settingsForm);
    setAuditMessage('Portal settings successfully updated.');
    setTimeout(() => setAuditMessage(''), 5000);
  };

  // Add new User account
  const handleAddUserAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasAccess('Admin')) {
      alert('Only Administrators can manage user permissions.');
      return;
    }
    if (!userFormEmail.trim() || !userFormName.trim()) return;

    if (users.some(u => u.email.toLowerCase() === userFormEmail.trim().toLowerCase())) {
      alert('An account with this email is already registered.');
      return;
    }

    const newUser: UserAccount = {
      email: userFormEmail.trim().toLowerCase(),
      name: userFormName.trim(),
      role: userFormRole
    };

    onSaveUsers([...users, newUser]);
    setUserFormEmail('');
    setUserFormName('');
    setAuditMessage('Designated user with credential access successfully.');
    setTimeout(() => setAuditMessage(''), 5000);
  };

  // Delete User account
  const handleDeleteUserClick = (email: string) => {
    if (!hasAccess('Admin')) {
      alert('Only Admin permissions.');
      return;
    }
    if (email === 'aftab2012ka@gmail.com') {
      alert('The founder/owner administrative bootstrapped account cannot be revoked.');
      return;
    }
    if (confirm(`Remove access for ${email}?`)) {
      onSaveUsers(users.filter(u => u.email !== email));
      setAuditMessage('User removed.');
      setTimeout(() => setAuditMessage(''), 4000);
    }
  };

  // Push notification testing simulator
  const triggerSimulatedPush = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pushTitle.trim() || !pushText.trim()) return;

    // Log the notification
    const newLog = {
      time: new Date().toLocaleTimeString(),
      title: pushTitle,
      text: pushText
    };
    setPushLogs([newLog, ...pushLogs]);
    setPushTitle('');
    setPushText('');
    setNotificationSuccess(true);
    setTimeout(() => setNotificationSuccess(false), 5000);

    // Trigger visual alarm to simulate browser alert
    alert(`⚡ [LIVE PUSH NOTIFICATION SENT] \n\nTitle: ${newLog.title} \nBody: ${newLog.text}\n\nAll portal subscribers will receive this breaking update!`);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans transition-colors duration-200" id="admin-portal-dashboard">
      
      {/* Top Banner Navigation bar */}
      <nav className="bg-sky-500 text-white shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <Shield size={20} className="text-white" />
              <span className="font-sans font-bold text-lg">
                {settings.websiteName} Admin Panel
              </span>
            </div>
            
            <button
              onClick={onClose}
              className="px-3.5 py-1.5 bg-sky-600 hover:bg-sky-700/80 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
            >
              <ArrowLeft size={14} />
              <span>Exit Portal</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Case: NOT Signed in */}
        {!currentUser ? (
          <div className="max-w-md mx-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-md mt-10">
            <div className="text-center space-y-3 mb-6">
              <div className="w-12 h-12 bg-sky-50 dark:bg-sky-955 rounded-full flex items-center justify-center mx-auto text-sky-500">
                <Lock size={22} />
              </div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Authorized Personnel Access Only
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Provide your registered email. Editors, Reporters, and Administrators possess configured authorizations.
              </p>
            </div>

            {loginError && (
              <div className="mb-4 p-3 bg-red-50 dark:bg-red-950/20 text-red-650 dark:text-red-400 text-2xs font-semibold border border-red-150 rounded-lg text-center leading-relaxed">
                {loginError}
              </div>
            )}

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div className="flex flex-col gap-1.5 text-xs">
                <label className="font-bold text-slate-600 dark:text-slate-350">Credential Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. founder@ittehadnews.com"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="p-2.5 bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-100 focus:outline-hidden focus:ring-1 focus:ring-sky-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-sky-500 hover:bg-sky-600 text-white rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer"
              >
                Access Dashboard
              </button>

              {onGoogleLogin && (
                <button
                  type="button"
                  onClick={onGoogleLogin}
                  className="w-full py-2.5 mt-2 border border-slate-300 dark:border-slate-700 bg-white hover:bg-slate-50 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg text-xs font-bold transition-all shadow-2xs flex items-center justify-center gap-2 cursor-pointer"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.85z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.85c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  <span>Sign in with Google</span>
                </button>
              )}
            </form>

            {/* Quick Demo Accout Logins */}
            <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 text-center space-y-3">
              <span className="block text-[10px] font-bold uppercase tracking-widest text-slate-400">
                ⭐ QUICK EVALUATION ACCESS
              </span>
              <div className="grid grid-cols-1 gap-2">
                <button
                  onClick={() => handleQuickDemoLogin('aftab2012ka@gmail.com')}
                  className="py-1.5 px-3 bg-red-50 dark:bg-slate-800 hover:bg-red-100/60 dark:hover:bg-slate-750 text-red-600 dark:text-red-400 border border-red-100 dark:border-slate-700 rounded-md text-3xs font-extrabold flex justify-between items-center"
                >
                  <span>Log in as Founder (Admin)</span>
                  <span className="bg-red-100 dark:bg-red-950 px-1.5 py-0.5 rounded text-[9px]">aftab2012ka@gmail.com</span>
                </button>
                <button
                  onClick={() => handleQuickDemoLogin('editor@ittehad.com')}
                  className="py-1.5 px-3 bg-sky-50 dark:bg-slate-800 hover:bg-sky-100/60 dark:hover:bg-slate-750 text-sky-600 dark:text-sky-400 border border-sky-100 dark:border-slate-700 rounded-md text-3xs font-extrabold flex justify-between items-center"
                >
                  <span>Log in as Kshitij (Editor)</span>
                  <span className="bg-sky-100 dark:bg-sky-950 px-1.5 py-0.5 rounded text-[9px]">editor@ittehad.com</span>
                </button>
                <button
                  onClick={() => handleQuickDemoLogin('reporter@ittehad.com')}
                  className="py-1.5 px-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-md text-3xs font-extrabold flex justify-between items-center"
                >
                  <span>Log in as Zameer (Reporter)</span>
                  <span className="bg-slate-200 dark:bg-slate-900 px-1.5 py-0.5 rounded text-[9px]">reporter@ittehad.com</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          // Case: SIGNED IN Dashboard
          <div className="space-y-6">
            
            {/* Header Identity bar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-xl gap-4 shadow-3xs">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-full bg-sky-100 dark:bg-sky-950 flex items-center justify-center text-sky-500">
                  <Shield size={18} />
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100">
                    Welcome back, {currentUser.name}!
                  </h3>
                  <div className="flex items-center gap-1 text-[10px] text-slate-400">
                    <span>Assigned Role:</span>
                    <span className="px-2 py-0.1 bg-sky-100 dark:bg-slate-850 text-sky-600 dark:text-sky-400 rounded-full font-bold uppercase tracking-wider text-[9px]">{currentUser.role}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={onLogout}
                  className="px-3.5 py-2 hover:bg-red-50 dark:hover:bg-red-950/25 text-red-500 rounded-lg text-xs font-semibold cursor-pointer border border-transparent hover:border-red-100 transition-all font-mono"
                >
                  Log out Account
                </button>
              </div>
            </div>

            {/* Audit notifications feedback bar */}
            {auditMessage && (
              <div className="p-4 bg-sky-50 dark:bg-sky-950/20 text-sky-700 dark:text-sky-450 text-xs sm:text-sm font-medium rounded-lg border border-sky-100 dark:border-slate-800 text-center animate-bounce flex items-center justify-center gap-2">
                <CheckCircle size={15} />
                <span>{auditMessage}</span>
              </div>
            )}

            {/* Sidebar + Tab layouts */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
              
              {/* Tab Selector Links */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-xl overflow-hidden p-3 space-y-1 shadow-2xs">
                <span className="block text-[10px] font-bold text-slate-400 px-3 pb-2 pt-1 border-b border-slate-50 dark:border-slate-850 mb-2 uppercase tracking-widest">
                  System Consoles
                </span>

                <button
                  onClick={() => { setActiveTab('dashboard'); setWritingNewNews(false); }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-lg text-left cursor-pointer transition-colors ${
                    activeTab === 'dashboard' 
                      ? 'bg-sky-500 text-white' 
                      : 'text-slate-750 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-850'
                  }`}
                >
                  <LayoutDashboard size={14} />
                  <span>Dashboard Stats</span>
                </button>

                <button
                  onClick={() => { setActiveTab('news'); }}
                  className={`w-full flex items-center justify-between gap-1 px-3 py-2 text-xs font-semibold rounded-lg text-left cursor-pointer transition-colors ${
                    activeTab === 'news' 
                      ? 'bg-sky-500 text-white' 
                      : 'text-slate-750 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-850'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <FileText size={14} />
                    <span>Articles ({articles.length})</span>
                  </div>
                </button>

                <button
                  onClick={() => { setActiveTab('categories'); }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-lg text-left cursor-pointer transition-colors ${
                    activeTab === 'categories' 
                      ? 'bg-sky-500 text-white' 
                      : 'text-slate-750 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-850'
                  }`}
                  disabled={!hasAccess('Editor')}
                  title={!hasAccess('Editor') ? 'Requires Editor permissions' : ''}
                >
                  <FolderKanban size={14} className={!hasAccess('Editor') ? 'text-slate-300' : ''} />
                  <span className={!hasAccess('Editor') ? 'text-slate-400 line-through' : ''}>Categories ({categories.length})</span>
                </button>

                <button
                  onClick={() => { setActiveTab('videos'); }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-lg text-left cursor-pointer transition-colors ${
                    activeTab === 'videos' 
                      ? 'bg-sky-500 text-white' 
                      : 'text-slate-750 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-850'
                  }`}
                  disabled={!hasAccess('Editor')}
                >
                  <Video size={14} className={!hasAccess('Editor') ? 'text-slate-300' : ''} />
                  <span className={!hasAccess('Editor') ? 'text-slate-400 line-through' : ''}>Video Streams ({videos.length})</span>
                </button>

                <button
                  onClick={() => { setActiveTab('comments'); }}
                  className={`w-full flex items-center justify-between gap-1 px-3 py-2 text-xs font-semibold rounded-lg text-left cursor-pointer transition-colors ${
                    activeTab === 'comments' 
                      ? 'bg-sky-500 text-white' 
                      : 'text-slate-750 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-850'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <MessageSquare size={14} />
                    <span>Comments ({comments.length})</span>
                  </div>
                  {pendingComments.length > 0 && (
                    <span className="px-1.5 py-0.5 bg-red-500 text-white font-mono font-bold text-[9px] rounded-full scale-90">
                      {pendingComments.length}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => { setActiveTab('settings'); }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-lg text-left cursor-pointer transition-colors ${
                    activeTab === 'settings' 
                      ? 'bg-sky-500 text-white' 
                      : 'text-slate-750 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-850'
                  }`}
                  disabled={!hasAccess('Admin')}
                >
                  <Settings size={14} className={!hasAccess('Admin') ? 'text-slate-300' : ''} />
                  <span className={!hasAccess('Admin') ? 'text-slate-400 line-through' : ''}>Portal Parameters</span>
                </button>

                <button
                  onClick={() => { setActiveTab('users'); }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-lg text-left cursor-pointer transition-colors ${
                    activeTab === 'users' 
                      ? 'bg-sky-500 text-white' 
                      : 'text-slate-750 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-850'
                  }`}
                  disabled={!hasAccess('Admin')}
                >
                  <Users size={14} className={!hasAccess('Admin') ? 'text-slate-300' : ''} />
                  <span className={!hasAccess('Admin') ? 'text-slate-400 line-through' : ''}>User Management</span>
                </button>
              </div>

              {/* Main Active Tab Console Display Panel */}
              <div className="lg:col-span-3 space-y-6">
                
                {/* 1. DASHBOARD OVERVIEW TAB */}
                {activeTab === 'dashboard' && (
                  <div className="space-y-6" id="overview-block">
                    {/* Bento Grid Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 p-5 rounded-xl space-y-1">
                        <span className="block text-2xs font-extrabold uppercase text-slate-400">Total Bullets</span>
                        <span className="block text-xl sm:text-2xl font-bold text-slate-900 dark:text-white font-mono">{totalNews}</span>
                      </div>
                      
                      <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 p-5 rounded-xl space-y-1">
                        <span className="block text-2xs font-extrabold uppercase text-slate-400">Aggregate Views</span>
                        <span className="block text-xl sm:text-2xl font-bold text-slate-900 dark:text-white font-mono">{totalViews}</span>
                      </div>

                      <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 p-5 rounded-xl space-y-1">
                        <span className="block text-2xs font-extrabold uppercase text-slate-400">Categories</span>
                        <span className="block text-xl sm:text-2xl font-bold text-slate-900 dark:text-white font-mono">{totalUniqueCategories}</span>
                      </div>

                      <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 p-5 rounded-xl space-y-1">
                        <span className="block text-2xs font-extrabold uppercase text-slate-400">YouTube Streams</span>
                        <span className="block text-xl sm:text-2xl font-bold text-slate-900 dark:text-white font-mono">{totalYouTubeVideos}</span>
                      </div>
                    </div>

                    {/* Simulation Push Notifications Panel */}
                    <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-xl p-5 sm:p-6 shadow-3xs space-y-4">
                      <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-850">
                        <Bell className="text-sky-500" size={16} />
                        <h3 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100 uppercase tracking-widest">
                          Simulate Real-Time Push Notification Alerts
                        </h3>
                      </div>

                      <p className="text-2xs sm:text-xs text-slate-500 leading-relaxed font-sans font-normal">
                        Compose and dispatch instant announcements down to the user client interface. This updates local subscription queues and displays customized alert models simulating full Google cloud-messaging protocols.
                      </p>

                      {notificationSuccess && (
                        <div className="p-3.5 bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-400 text-xs font-semibold rounded-lg border border-green-100 dark:border-green-900 text-center animate-pulse">
                          Push announcement dispatch successfully triggered!
                        </div>
                      )}

                      <form onSubmit={triggerSimulatedPush} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-4">
                          <div className="flex flex-col gap-1 text-xs">
                            <label className="font-bold text-slate-600 dark:text-slate-350 text-2xs">Alert Headline</label>
                            <input
                              type="text"
                              required
                              placeholder="e.g. Breaking: Bengaluru Metro phase 3 routes approved"
                              value={pushTitle}
                              onChange={(e) => setPushTitle(e.target.value)}
                              className="p-2 bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 rounded-lg text-xs"
                            />
                          </div>

                          <div className="flex flex-col gap-1 text-xs">
                            <label className="font-bold text-slate-600 dark:text-slate-350 text-2xs">Alert Message Detail</label>
                            <textarea
                              required
                              rows={2}
                              placeholder="e.g. Cabinet has officially sanctioned 45 kilometers of additional corridor travel."
                              value={pushText}
                              onChange={(e) => setPushText(e.target.value)}
                              className="p-2 bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 rounded-lg text-xs"
                            />
                          </div>

                          <button
                            type="submit"
                            className="py-1.5 px-3 bg-red-650 hover:bg-red-700 text-white rounded-md text-3xs font-extrabold cursor-pointer"
                          >
                            Send Push Notification
                          </button>
                        </div>

                        {/* Push logs history simulator */}
                        <div className="bg-slate-50 dark:bg-slate-950 rounded-xl p-4 border border-slate-100 dark:border-slate-850/50 space-y-3.5">
                          <span className="block text-4xs font-bold uppercase tracking-widest text-slate-400">
                            Push Dispatch Logs (Live Queue)
                          </span>
                          <div className="space-y-2.5 max-h-[160px] overflow-y-auto text-3xs text-slate-500 leading-normal">
                            {pushLogs.map((log, idx) => (
                              <div key={idx} className="pb-2 border-b border-slate-200/50 dark:border-slate-850 last:border-0">
                                <div className="flex justify-between items-center text-[10px] font-bold text-slate-750 dark:text-slate-300">
                                  <span className="truncate">{log.title}</span>
                                  <span className="font-mono text-slate-450 shrink-0">[{log.time}]</span>
                                </div>
                                <p className="text-slate-450 line-clamp-1">{log.text}</p>
                              </div>
                            ))}
                            {pushLogs.length === 0 && (
                              <p className="text-4xs text-slate-400 italic text-center py-4">No push alerts transmitted in this session</p>
                            )}
                          </div>
                        </div>
                      </form>
                    </div>

                    {/* SEO XML Sitemap & Robots.txt Simulator Frame */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* XML Sitemap */}
                      <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-xl p-5 space-y-2.5 shadow-3xs">
                        <span className="block text-2xs font-extrabold uppercase text-slate-400 font-mono">
                          Generated XML Sitemap (SEO Live)
                        </span>
                        <div className="p-3.5 bg-slate-950 text-amber-500 font-mono text-[10px] rounded-lg border border-slate-850 whitespace-pre overflow-x-auto max-h-[140px]">
{`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${window.location.origin}/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  ${articles.filter(a => a.status === 'published').slice(0, 3).map(a => `
  <url>
    <loc>${window.location.origin}/article/${a.id}</loc>
    <lastmod>${a.date}</lastmod>
    <priority>0.8</priority>
  </url>`).join('')}
</urlset>`}
                        </div>
                      </div>

                      {/* Robots.txt */}
                      <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-xl p-5 space-y-2.5 shadow-3xs">
                        <span className="block text-2xs font-extrabold uppercase text-slate-400 font-mono">
                          robots.txt (SEO Crawler rules)
                        </span>
                        <div className="p-3.5 bg-slate-950 text-green-500 font-mono text-[10px] rounded-lg border border-slate-850 whitespace-pre overflow-x-auto max-h-[140px]">
{`# Robots.txt configured for Ittehad News
User-agent: *
Allow: /
Disallow: /admin
Disallow: /editor-drafts/

Sitemap: ${window.location.origin}/sitemap.xml`}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. NEWS MANAGEMENT ARTICLE TAB */}
                {activeTab === 'news' && (
                  <div className="space-y-6">
                    {/* Header Controls */}
                    <div className="flex justify-between items-center bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 p-4 rounded-xl">
                      <h3 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wider">
                        Written Bulletins List
                      </h3>
                      
                      {!writingNewNews && (
                        <button
                          onClick={() => {
                            setNewsEditId(null);
                            setWritingNewNews(true);
                            setNewsForm({
                              title: '', summary: '', content: '', image: '', category: 'politics',
                              language: 'en', featured: false, breaking: false, status: 'published', scheduledDate: ''
                            });
                          }}
                          className="flex items-center gap-1 py-1.5 px-3.5 bg-sky-500 hover:bg-sky-600 text-white text-3xs font-extrabold uppercase rounded-lg cursor-pointer transition-all"
                        >
                          <PlusCircle size={14} />
                          <span>Add News Article</span>
                        </button>
                      )}
                    </div>

                    {/* WRITING OR EDITING SCREEN GATED */}
                    {writingNewNews ? (
                      <form onSubmit={handleSaveNewsArticle} className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-xl p-5 sm:p-6 space-y-4 shadow-sm" id="article-creation-form">
                        <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-slate-850">
                          <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                            {newsEditId ? 'Edit News Article Form' : 'Design News Article Form'}
                          </h4>
                          <button
                            type="button"
                            onClick={() => setWritingNewNews(false)}
                            className="p-1 text-slate-400 hover:text-slate-600"
                          >
                            <X size={18} />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Title */}
                          <div className="flex flex-col gap-1.5 text-xs">
                            <label className="font-bold text-slate-600 dark:text-slate-350">Story Title Headline</label>
                            <input
                              type="text"
                              required
                              placeholder="e.g. Assembly Sanctions Critical Water Pipeline"
                              value={newsForm.title}
                              onChange={(e) => setNewsForm({ ...newsForm, title: e.target.value })}
                              className="p-2.5 bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-100"
                            />
                          </div>

                          {/* Language Choice */}
                          <div className="flex flex-col gap-1.5 text-xs">
                            <label className="font-bold text-slate-600 dark:text-slate-350">Publishing Language</label>
                            <select
                              value={newsForm.language}
                              onChange={(e) => setNewsForm({ ...newsForm, language: e.target.value as Language })}
                              className="p-2.5 bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-100 font-semibold"
                            >
                              <option value="en">English (LTR)</option>
                              <option value="ur">Urdu (RTL - اردو)</option>
                              <option value="kn">Kannada (LTR - ಕನ್ನಡ)</option>
                            </select>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Categories Select */}
                          <div className="flex flex-col gap-1.5 text-xs">
                            <label className="font-bold text-slate-600 dark:text-slate-350">News Category</label>
                            <select
                              value={newsForm.category}
                              onChange={(e) => setNewsForm({ ...newsForm, category: e.target.value })}
                              className="p-2.5 bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-100 font-semibold"
                            >
                              {categories.filter(c => c.id !== 'all' && c.id !== 'breaking').map(c => (
                                <option key={c.id} value={c.id}>{c.nameEN} ({c.id})</option>
                              ))}
                            </select>
                          </div>

                          {/* Image Path Selector */}
                          <div className="flex flex-col gap-1.5 text-xs">
                            <label className="font-bold text-slate-600 dark:text-slate-350">Cover Image URL Path</label>
                            <input
                              type="url"
                              required
                              placeholder="e.g. https://images.unsplash.com/..."
                              value={newsForm.image}
                              onChange={(e) => setNewsForm({ ...newsForm, image: e.target.value })}
                              className="p-2.5 bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-100 text-xs"
                            />
                            {/* Preset Helpers */}
                            <div className="flex flex-wrap gap-1 mt-1">
                              {imagePresetUrls.map((img) => (
                                <button
                                  key={img.label}
                                  type="button"
                                  onClick={() => setNewsForm({ ...newsForm, image: img.url })}
                                  className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-[10px] rounded text-slate-600 dark:text-slate-400 font-semibold"
                                >
                                  📷 {img.label} Preset
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Status Select & Scheduling */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 dark:bg-slate-950 rounded-lg p-3.5 border border-slate-100 dark:border-slate-850">
                          <div className="flex flex-col gap-1.5 text-xs">
                            <label className="font-bold text-slate-600 dark:text-slate-350">Publishing Status Mode</label>
                            <select
                              value={newsForm.status}
                              onChange={(e) => setNewsForm({ ...newsForm, status: e.target.value as any })}
                              className="p-2 bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-700 rounded text-xs select-none"
                            >
                              <option value="published">Publish story immediately</option>
                              <option value="draft">Save as local editor draft</option>
                              <option value="scheduled">Schedule post for future</option>
                            </select>
                          </div>

                          {newsForm.status === 'scheduled' && (
                            <div className="flex flex-col gap-1.5 text-xs animate-pulse">
                              <label className="font-bold text-red-500">Pick Scheduling Date</label>
                              <input
                                type="date"
                                required
                                value={newsForm.scheduledDate}
                                onChange={(e) => setNewsForm({ ...newsForm, scheduledDate: e.target.value })}
                                className="p-2 bg-white dark:bg-slate-850 border border-red-200 dark:border-slate-700 text-xs rounded"
                              />
                            </div>
                          )}
                        </div>

                        {/* Short Summary and Content */}
                        <div className="flex flex-col gap-1.5 text-xs">
                          <label className="font-bold text-slate-600 dark:text-slate-350">Short Summary description (Grid Snippet)</label>
                          <textarea
                            required
                            rows={2}
                            placeholder="Briefly describe the article summary..."
                            value={newsForm.summary}
                            onChange={(e) => setNewsForm({ ...newsForm, summary: e.target.value })}
                            className="p-2.5 bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-100 text-xs"
                          />
                        </div>

                        <div className="flex flex-col gap-1.5 text-xs">
                          <label className="font-bold text-slate-600 dark:text-slate-350">Complete Article Copy (Paragraph splits on empty lines)</label>
                          <textarea
                            required
                            rows={10}
                            placeholder="Write your news copy here..."
                            value={newsForm.content}
                            onChange={(e) => setNewsForm({ ...newsForm, content: e.target.value })}
                            className="p-2.5 bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-100 text-xs font-sans"
                          />
                        </div>

                        {/* Toggles */}
                        <div className="flex flex-wrap gap-6 py-2">
                          <label className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer select-none">
                            <input
                              type="checkbox"
                              checked={newsForm.featured}
                              onChange={(e) => setNewsForm({ ...newsForm, featured: e.target.checked })}
                              className="w-4 h-4 rounded text-sky-500"
                            />
                            <span>Promote as MAIN Top Story banner</span>
                          </label>

                          <label className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer select-none">
                            <input
                              type="checkbox"
                              checked={newsForm.breaking}
                              onChange={(e) => setNewsForm({ ...newsForm, breaking: e.target.checked })}
                              className="w-4 h-4 rounded text-sky-500"
                            />
                            <span>Promote to Breaking News Scrolling Ticker</span>
                          </label>
                        </div>

                        {/* Actions */}
                        <div className="flex justify-end gap-2.5 pt-4 border-t border-slate-100 dark:border-slate-850">
                          <button
                            type="button"
                            onClick={() => setWritingNewNews(false)}
                            className="px-4 py-2 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-lg text-xs font-bold"
                          >
                            Cancel
                          </button>
                          
                          <button
                            type="submit"
                            className="px-5 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-lg text-xs font-bold shadow-xs hover:shadow-md transition-all flex items-center gap-1"
                          >
                            <Check size={14} />
                            <span>{newsEditId ? 'Update and Save' : 'Publish Story'}</span>
                          </button>
                        </div>
                      </form>
                    ) : (
                      // TABLE/LIST VIEW OF ALL ARTICLES
                      <div className="bg-white dark:bg-slate-900 border border-slate-200/65 dark:border-slate-800 rounded-xl overflow-hidden shadow-2xs">
                        <div className="overflow-x-auto">
                          <table className="w-full text-left text-xs">
                            <thead className="bg-slate-50 dark:bg-slate-850/80 font-mono text-slate-500 uppercase border-b border-slate-150 dark:border-slate-800">
                              <tr>
                                <th className="p-3 sm:p-4">Headline</th>
                                <th className="p-3 sm:p-4">Lang</th>
                                <th className="p-3 sm:p-4">Category</th>
                                <th className="p-3 sm:p-4">Author</th>
                                <th className="p-3 sm:p-4">Status</th>
                                <th className="p-3 sm:p-4 text-center">Indicators</th>
                                <th className="p-3 sm:p-4 text-center">Controls</th>
                              </tr>
                            </thead>
                            
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-850 text-slate-700 dark:text-slate-350">
                              {articles.map((art) => (
                                <tr key={art.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-850/20">
                                  <td className="p-3 sm:p-4 font-semibold max-w-xs sm:max-w-md truncate" title={art.title}>
                                    {art.title}
                                  </td>
                                  
                                  <td className="p-3 sm:p-4 font-mono font-bold uppercase text-sky-600">
                                    {art.language}
                                  </td>

                                  <td className="p-3 sm:p-4 font-bold capitalize text-slate-505">
                                    {art.category}
                                  </td>

                                  <td className="p-3 sm:p-4 text-slate-450 font-medium">
                                    {art.author}
                                  </td>

                                  <td className="p-3 sm:p-4">
                                    <span className={`px-2 py-0.5 rounded-full font-mono text-4xs font-bold uppercase ${
                                      art.status === 'published' 
                                        ? 'bg-green-50 text-green-600 dark:bg-green-950/20' 
                                        : art.status === 'draft' 
                                          ? 'bg-slate-100 text-slate-500' 
                                          : 'bg-amber-50 text-amber-600'
                                    }`}>
                                      {art.status}
                                    </span>
                                  </td>

                                  <td className="p-3 sm:p-4 text-center text-4xs">
                                    <div className="flex items-center justify-center gap-1.5">
                                      {art.featured && <span className="bg-sky-50 text-sky-600 font-bold px-1.5 py-0.5 rounded uppercase">Featured</span>}
                                      {art.breaking && <span className="bg-red-50 text-red-650 font-bold px-1.5 py-0.5 rounded uppercase">Breaking</span>}
                                      {!art.featured && !art.breaking && <span className="text-slate-300">-</span>}
                                    </div>
                                  </td>

                                  <td className="p-3 sm:p-4 text-center">
                                    <div className="flex items-center justify-center gap-1.5">
                                      <button
                                        onClick={() => handleEditNewsClick(art)}
                                        className="p-1 px-2 border border-slate-200 dark:border-slate-700 rounded-md hover:bg-sky-50 dark:hover:bg-slate-800 text-sky-500 font-bold"
                                        title="Edit Article"
                                        id={`edit-art-${art.id}`}
                                      >
                                        <Edit size={12} />
                                      </button>
                                      
                                      <button
                                        onClick={() => handleDeleteNewsClick(art.id)}
                                        className="p-1 px-2 border border-slate-200 dark:border-slate-700 rounded-md hover:bg-red-50 text-red-500 font-bold"
                                        title="Delete Article"
                                        id={`delete-art-${art.id}`}
                                      >
                                        <Trash2 size={12} />
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* 3. CATEGORIES MANAGEMENT TAB GATED */}
                {activeTab === 'categories' && hasAccess('Editor') && (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 p-4 rounded-xl">
                      <h3 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wider">
                        Categories Collection Editor
                      </h3>
                      {!writingNewCategory && (
                        <button
                          onClick={() => {
                            setCategoryEditId(null);
                            setWritingNewCategory(true);
                            setCategoryForm({ id: '', nameEN: '', nameUR: '', nameKN: '', icon: 'FileText' });
                          }}
                          className="flex items-center gap-1 py-1.5 px-3.5 bg-sky-500 hover:bg-sky-600 text-white text-3xs font-extrabold uppercase rounded-lg cursor-pointer"
                        >
                          <PlusCircle size={14} />
                          <span>Add Category</span>
                        </button>
                      )}
                    </div>

                    {writingNewCategory && (
                      <form onSubmit={handleSaveCategory} className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 p-5 rounded-xl space-y-4" id="category-creation-form">
                        <h4 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 uppercase pb-2 border-b border-slate-50 dark:border-slate-850">
                          {categoryEditId ? 'Configure Category Parameter' : 'New News Category'}
                        </h4>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="flex flex-col gap-1 text-xs">
                            <label className="font-bold text-slate-600 dark:text-slate-350">Category ID Identifier (unique English alphabetic url slug)</label>
                            <input
                              type="text"
                              required
                              disabled={!!categoryEditId}
                              placeholder="e.g. karnataka"
                              value={categoryForm.id}
                              onChange={(e) => setCategoryForm({ ...categoryForm, id: e.target.value })}
                              className="p-2 bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 rounded text-xs text-slate-800 dark:text-slate-100"
                            />
                          </div>

                          <div className="flex flex-col gap-1 text-xs">
                            <label className="font-bold text-slate-600 dark:text-slate-350">Lucide Icon Class</label>
                            <select
                              value={categoryForm.icon}
                              onChange={(e) => setCategoryForm({ ...categoryForm, icon: e.target.value })}
                              className="p-2 bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 rounded text-xs select-none text-slate-850 dark:text-slate-100 font-semibold"
                            >
                              <option value="FileText">Generic (FileText)</option>
                              <option value="Globe">Global (Globe)</option>
                              <option value="HeartPulse">Medical (HeartPulse)</option>
                              <option value="Trophy">Sports (Trophy)</option>
                              <option value="Cpu">Technology (Cpu)</option>
                              <option value="TrendingUp">Business (TrendingUp)</option>
                              <option value="Clapperboard">Entertainment (Clapperboard)</option>
                              <option value="MapPin">Location marker (MapPin)</option>
                              <option value="GraduationCap">Academic / Education (GraduationCap)</option>
                            </select>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="flex flex-col gap-1 text-xs">
                            <label className="font-bold text-slate-600 dark:text-slate-350">English Name Label</label>
                            <input
                              type="text"
                              required
                              placeholder="e.g. Health"
                              value={categoryForm.nameEN}
                              onChange={(e) => setCategoryForm({ ...categoryForm, nameEN: e.target.value })}
                              className="p-2 bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 rounded text-xs"
                            />
                          </div>

                          <div className="flex flex-col gap-1 text-xs">
                            <label className="font-bold text-slate-600 dark:text-slate-350">Urdu Name Label</label>
                            <input
                              type="text"
                              required
                              placeholder="مثال کے طور پر: صحت"
                              value={categoryForm.nameUR}
                              onChange={(e) => setCategoryForm({ ...categoryForm, nameUR: e.target.value })}
                              className="p-2 bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 rounded text-xs text-right"
                            />
                          </div>

                          <div className="flex flex-col gap-1 text-xs">
                            <label className="font-bold text-slate-600 dark:text-slate-350">Kannada Name Label</label>
                            <input
                              type="text"
                              required
                              placeholder="ಉದಾಹರಣೆಗೆ: ಆರೋಗ್ಯ"
                              value={categoryForm.nameKN}
                              onChange={(e) => setCategoryForm({ ...categoryForm, nameKN: e.target.value })}
                              className="p-2 bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 rounded text-xs"
                            />
                          </div>
                        </div>

                        <div className="flex justify-end gap-2 text-xs">
                          <button
                            type="button"
                            onClick={() => setWritingNewCategory(false)}
                            className="px-3.5 py-1.5 bg-slate-100 rounded text-slate-700"
                          >
                            Cancel
                          </button>
                          
                          <button
                            type="submit"
                            className="px-4 py-1.5 bg-sky-500 hover:bg-sky-600 text-white rounded font-bold"
                          >
                            Save Category
                          </button>
                        </div>
                      </form>
                    )}

                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-2xs">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-50 dark:bg-slate-850/80 font-mono text-slate-500 uppercase border-b border-slate-150">
                          <tr>
                            <th className="p-3">ID Identifier</th>
                            <th className="p-3">English Label</th>
                            <th className="p-3 text-right">Urdu Label</th>
                            <th className="p-3">Kannada Label</th>
                            <th className="p-3">Associated Icon</th>
                            <th className="p-3 text-center">Actions</th>
                          </tr>
                        </thead>

                        <tbody className="divide-y divide-slate-100 dark:divide-slate-850 text-slate-700 dark:text-slate-350">
                          {categories.map((cat) => (
                            <tr key={cat.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-850/20">
                              <td className="p-3 font-mono font-bold">{cat.id}</td>
                              <td className="p-3 font-semibold">{cat.nameEN}</td>
                              <td className="p-3 text-right font-semibold">{cat.nameUR || '-'}</td>
                              <td className="p-3 font-semibold">{cat.nameKN || '-'}</td>
                              <td className="p-3 font-mono text-slate-450">{cat.icon}</td>
                              <td className="p-3 text-center">
                                <div className="flex justify-center gap-1.5">
                                  <button
                                    onClick={() => handleEditCategoryClick(cat)}
                                    className="p-1 border border-slate-200 dark:border-slate-700 rounded-md text-sky-500 text-2xs hover:bg-sky-50 dark:hover:bg-slate-800"
                                    id={`edit-cat-${cat.id}`}
                                  >
                                    <Edit size={11} />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteCategoryClick(cat.id)}
                                    className="p-1 border border-slate-200 dark:border-slate-700 rounded-md text-red-500 text-2xs hover:bg-red-50"
                                    id={`delete-cat-${cat.id}`}
                                  >
                                    <Trash2 size={11} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* 4. YOUTUBE VIDEO MANAGEMENT TAB GATED */}
                {activeTab === 'videos' && hasAccess('Editor') && (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 p-4 rounded-xl">
                      <h3 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wider">
                        YouTube video news bulletins
                      </h3>
                      {!writingNewVideo && (
                        <button
                          onClick={() => {
                            setVideoEditId(null);
                            setWritingNewVideo(true);
                            setVideoForm({ title: '', description: '', youtubeUrl: '', category: 'politics' });
                          }}
                          className="flex items-center gap-1 py-1.5 px-3.5 bg-sky-500 hover:bg-sky-600 text-white text-3xs font-extrabold uppercase rounded-lg cursor-pointer"
                        >
                          <PlusCircle size={14} />
                          <span>Add Video Link</span>
                        </button>
                      )}
                    </div>

                    {writingNewVideo && (
                      <form onSubmit={handleSaveVideo} className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 p-5 rounded-xl space-y-4" id="video-creation-form">
                        <h4 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 pb-2 border-b border-slate-50 dark:border-slate-850">
                          {videoEditId ? 'Configure Video bulletin details' : 'Publish YouTube Video news'}
                        </h4>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="flex flex-col gap-1 text-xs">
                            <label className="font-bold text-slate-600 dark:text-slate-350">Video Headline Title</label>
                            <input
                              type="text"
                              required
                              placeholder="e.g. Vidhana Soudha High Court Debate Bulletins"
                              value={videoForm.title}
                              onChange={(e) => setVideoForm({ ...videoForm, title: e.target.value })}
                              className="p-2 bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 rounded text-xs"
                            />
                          </div>

                          <div className="flex flex-col gap-1 text-xs">
                            <label className="font-bold text-slate-600 dark:text-slate-350">YouTube watch URL link address</label>
                            <input
                              type="url"
                              required
                              placeholder="e.g. https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                              value={videoForm.youtubeUrl}
                              onChange={(e) => setVideoForm({ ...videoForm, youtubeUrl: e.target.value })}
                              className="p-2 bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 rounded text-xs text-slate-800 dark:text-slate-100"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="flex flex-col gap-1 text-xs">
                            <label className="font-bold text-slate-600 dark:text-slate-350">Organizing Category</label>
                            <select
                              value={videoForm.category}
                              onChange={(e) => setVideoForm({ ...videoForm, category: e.target.value })}
                              className="p-2 bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 rounded text-xs select-none text-slate-800 dark:text-slate-100 font-semibold"
                            >
                              {categories.filter(c => c.id !== 'all').map(c => (
                                <option key={c.id} value={c.id}>{c.nameEN}</option>
                              ))}
                            </select>
                          </div>

                          <div className="flex flex-col gap-1 text-xs">
                            <label className="font-bold text-slate-600 dark:text-slate-350">Bulletin Brief Description</label>
                            <textarea
                              rows={2}
                              placeholder="Specify summary copy of report..."
                              value={videoForm.description}
                              onChange={(e) => setVideoForm({ ...videoForm, description: e.target.value })}
                              className="p-2 bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 rounded text-xs text-slate-800 dark:text-slate-200"
                            />
                          </div>
                        </div>

                        <div className="flex justify-end gap-2 text-xs">
                          <button
                            type="button"
                            onClick={() => setWritingNewVideo(false)}
                            className="px-3.5 py-1.5 bg-slate-100 rounded text-slate-700"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="px-4 py-1.5 bg-sky-500 hover:bg-sky-600 text-white rounded font-bold"
                          >
                            Publish Video
                          </button>
                        </div>
                      </form>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {videos.map((vid) => (
                        <div key={vid.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex gap-3 shadow-xs">
                          <div className="w-28 shrink-0 aspect-video rounded bg-slate-100 dark:bg-slate-950 flex items-center justify-center font-mono text-[9px] font-bold text-slate-400 overflow-hidden relative border border-slate-200/50 dark:border-slate-850">
                            <img
                              src={`https://img.youtube.com/vi/${vid.youtubeId}/hqdefault.jpg`}
                              alt={vid.title}
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                          
                          <div className="flex-1 min-w-0 flex flex-col justify-between">
                            <div className="space-y-0.5">
                              <span className="text-[10px] uppercase font-bold text-sky-500 tracking-wider block">
                                {vid.category}
                              </span>
                              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate leading-tight">
                                {vid.title}
                              </h4>
                              <p className="text-[10px] text-slate-400 line-clamp-2">
                                {vid.description}
                              </p>
                            </div>

                            <div className="flex justify-between items-center mt-2 pt-2 border-t border-slate-50 dark:border-slate-850/50">
                              <span className="text-[9px] text-slate-400 font-mono">{vid.date}</span>
                              <div className="flex gap-1.5 text-[9px]">
                                <button
                                  onClick={() => handleEditVideoClick(vid)}
                                  className="text-sky-500 hover:underline font-bold"
                                  id={`edit-vid-${vid.id}`}
                                >
                                  Configure
                                </button>
                                <button
                                  onClick={() => handleDeleteVideoClick(vid.id)}
                                  className="text-red-500 hover:underline font-bold"
                                  id={`delete-vid-${vid.id}`}
                                >
                                  Delete
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 5. COMMENTS MODERATION TAB ASSEMBLY */}
                {activeTab === 'comments' && (
                  <div className="space-y-6">
                    <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 p-4 rounded-xl">
                      <h3 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100 uppercase tracking-widest">
                        Subscribers Discussion Moderation Queue
                      </h3>
                    </div>

                    <div className="space-y-4">
                      {comments.map((com) => (
                        <div key={com.id} className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-xl p-5 shadow-3xs flex gap-3">
                          <div className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-650 font-bold uppercase shrink-0 select-none">
                            {com.name.charAt(0)}
                          </div>

                          <div className="flex-1 space-y-2 min-w-0">
                            <div className="flex items-center justify-between flex-wrap gap-2 text-xs">
                              <div className="flex flex-col">
                                <span className="font-extrabold text-slate-850 dark:text-slate-100">{com.name}</span>
                                <span className="text-[10px] text-slate-400 tracking-tight font-mono">({com.email})</span>
                              </div>
                              <span className="text-[10px] text-slate-400 font-mono">{com.date}</span>
                            </div>

                            <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-lg text-xs leading-relaxed text-slate-600 dark:text-slate-300 font-sans border border-slate-100/50 dark:border-slate-850">
                              <span className="block text-[9px] font-bold text-sky-500 uppercase font-mono mb-1">Target Article: {com.articleId}</span>
                              <p className="font-normal">{com.content}</p>
                            </div>

                            <div className="flex justify-between items-center pt-2">
                              {/* Status Badge */}
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase font-mono ${
                                com.approved 
                                  ? 'bg-green-50 text-green-600 dark:bg-green-950/20' 
                                  : 'bg-yellow-50 text-yellow-600 dark:bg-yellow-950/20 animate-pulse'
                              }`}>
                                {com.approved ? 'Live/Approved' : 'Pending Moderation'}
                              </span>

                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => toggleCommentApproval(com.id)}
                                  className={`px-3 py-1 text-2xs font-extrabold rounded-md flex items-center gap-1 border cursor-pointer ${
                                    com.approved
                                      ? 'border-yellow-250 bg-yellow-50 text-yellow-600 hover:bg-yellow-100'
                                      : 'border-green-250 bg-green-500 text-white hover:bg-green-600'
                                  }`}
                                  id={`approve-com-btn-${com.id}`}
                                >
                                  {com.approved ? 'Revoke Live' : 'Approve post'}
                                </button>
                                
                                <button
                                  onClick={() => handleDeleteComment(com.id)}
                                  className="px-2.5 py-1 text-2xs font-extrabold border rounded-md text-red-500 hover:bg-red-50"
                                  id={`delete-com-btn-${com.id}`}
                                >
                                  Delete
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}

                      {comments.length === 0 && (
                        <p className="text-sm text-slate-400 italic text-center py-8">No comments to moderate</p>
                      )}
                    </div>
                  </div>
                )}

                {/* 6. PORTAL PARAMETERS MASTER TAB */}
                {activeTab === 'settings' && hasAccess('Admin') && (
                  <form onSubmit={handleSaveSettings} className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 p-5 sm:p-6 rounded-xl space-y-5" id="settings-modification-form">
                    <h3 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 pb-2 border-b border-slate-50 dark:border-slate-850 uppercase tracking-widest">
                      Portal Core configuration panel
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Name of news portal */}
                      <div className="flex flex-col gap-1.5 text-xs">
                        <label className="font-bold text-slate-600 dark:text-slate-350">Intellectual Website Title</label>
                        <input
                          type="text"
                          required
                          value={settingsForm.websiteName}
                          onChange={(e) => setSettingsForm({ ...settingsForm, websiteName: e.target.value })}
                          className="p-2.5 bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-100 text-xs"
                        />
                      </div>

                      {/* Contact admin email */}
                      <div className="flex flex-col gap-1.5 text-xs">
                        <label className="font-bold text-slate-600 dark:text-slate-350">Administrative Contact Email</label>
                        <input
                          type="email"
                          required
                          value={settingsForm.contactEmail}
                          onChange={(e) => setSettingsForm({ ...settingsForm, contactEmail: e.target.value })}
                          className="p-2.5 bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-100 text-xs font-mono"
                        />
                      </div>
                    </div>

                    {/* About Us Paragraph */}
                    <div className="flex flex-col gap-1.5 text-xs">
                      <label className="font-bold text-slate-600 dark:text-slate-350">Global Editorial Biography (About Us Text Block)</label>
                      <textarea
                        required
                        rows={4}
                        value={settingsForm.aboutText}
                        onChange={(e) => setSettingsForm({ ...settingsForm, aboutText: e.target.value })}
                        className="p-2.5 bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-100 text-xs font-sans leading-relaxed"
                      />
                    </div>

                    {/* SEO AdSense/Analytics parameters layout */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-slate-100 dark:border-slate-850">
                      
                      {/* AdSense Settings */}
                      <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-xl space-y-3 border border-slate-100 dark:border-slate-850">
                        <label className="flex items-center gap-2 text-xs font-bold text-slate-755 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settingsForm.isAdSenseActive}
                            onChange={(e) => setSettingsForm({ ...settingsForm, isAdSenseActive: e.target.checked })}
                            className="w-4 h-4 rounded text-sky-500"
                          />
                          <span>Google AdSense Banners (Simulation)</span>
                        </label>
                        
                        {settingsForm.isAdSenseActive && (
                          <div className="flex flex-col gap-1 text-[10px] text-slate-400">
                            <label className="font-bold">Google AdSense Publisher Code ID</label>
                            <input
                              type="text"
                              value={settingsForm.googleAdSenseCode}
                              onChange={(e) => setSettingsForm({ ...settingsForm, googleAdSenseCode: e.target.value })}
                              className="p-2 bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-700 rounded text-xs font-mono"
                            />
                            <span className="text-3xs text-yellow-600 animate-pulse">★ Google Ad spaces are currently live on the main grid pages!</span>
                          </div>
                        )}
                      </div>

                      {/* Google Analytics Settings */}
                      <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-xl space-y-3 border border-slate-100 dark:border-slate-850">
                        <label className="flex items-center gap-2 text-xs font-bold text-slate-755 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settingsForm.isAnalyticsActive}
                            onChange={(e) => setSettingsForm({ ...settingsForm, isAnalyticsActive: e.target.checked })}
                            className="w-4 h-4 rounded text-sky-500"
                          />
                          <span>Google Analytics Tracking ID (SEO live)</span>
                        </label>

                        {settingsForm.isAnalyticsActive && (
                          <div className="flex flex-col gap-1 text-[10px] text-slate-400">
                            <label className="font-bold">Google Analytics Identifier (e.g. G-XXXXX)</label>
                            <input
                              type="text"
                              value={settingsForm.googleAnalyticsId}
                              onChange={(e) => setSettingsForm({ ...settingsForm, googleAnalyticsId: e.target.value })}
                              className="p-2 bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-700 rounded text-xs font-mono"
                            />
                          </div>
                        )}
                      </div>

                    </div>

                    <div className="flex justify-end pt-3 border-t border-slate-100 dark:border-slate-850">
                      <button
                        type="submit"
                        className="py-2.5 px-6 bg-sky-500 hover:bg-sky-600 text-white rounded-lg text-xs font-bold transition-all shadow-xs"
                      >
                        Commit Changes
                      </button>
                    </div>
                  </form>
                )}

                {/* 7. USER MANAGEMENT TAB GATE */}
                {activeTab === 'users' && hasAccess('Admin') && (
                  <div className="space-y-6">
                    {/* Add User account */}
                    <form onSubmit={handleAddUserAccount} className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 p-5 rounded-xl space-y-4 shadow-3xs" id="user-creation-form">
                      <h3 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 pb-2 border-b border-slate-50 dark:border-slate-850 uppercase tracking-widest">
                        Configure writer credential authorization of News Portal
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="flex flex-col gap-1 text-xs">
                          <label className="font-bold text-slate-600 dark:text-slate-350">Real Name</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Salim Yusuf"
                            value={userFormName}
                            onChange={(e) => setUserFormName(e.target.value)}
                            className="p-2 bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 rounded text-xs"
                          />
                        </div>

                        <div className="flex flex-col gap-1 text-xs">
                          <label className="font-bold text-slate-600 dark:text-slate-350">Vetting Email Address</label>
                          <input
                            type="email"
                            required
                            placeholder="username@email.com"
                            value={userFormEmail}
                            onChange={(e) => setUserFormEmail(e.target.value)}
                            className="p-2 bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 rounded text-xs font-mono"
                          />
                        </div>

                        <div className="flex flex-col gap-1 text-xs">
                          <label className="font-bold text-slate-600 dark:text-slate-350">Journalistic Role Assignment</label>
                          <select
                            value={userFormRole}
                            onChange={(e) => setUserFormRole(e.target.value as UserRole)}
                            className="p-2 bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 rounded text-xs select-none font-semibold text-slate-800 dark:text-slate-100"
                          >
                            <option value="Admin">Administrator (Master controls)</option>
                            <option value="Editor">Editor (CRUD articles, categories, and video lists)</option>
                            <option value="Reporter">Reporter (CRUD own raw news feeds articles only)</option>
                          </select>
                        </div>
                      </div>

                      <div className="flex justify-end pt-2">
                        <button
                          type="submit"
                          className="py-1.5 px-4 bg-sky-500 hover:bg-sky-600 text-white text-xs font-bold rounded shadow-xs"
                        >
                          Provision User Account
                        </button>
                      </div>
                    </form>

                    {/* Authorized User Account List */}
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-2xs">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-50 dark:bg-slate-850 font-mono text-slate-500 uppercase border-b border-slate-150">
                          <tr>
                            <th className="p-3">Designee Name</th>
                            <th className="p-3">Email Key</th>
                            <th className="p-3">Authorized Role</th>
                            <th className="p-3 text-center">Revoke Options</th>
                          </tr>
                        </thead>

                        <tbody className="divide-y divide-slate-100 dark:divide-slate-850 text-slate-700 dark:text-slate-350">
                          {users.map((usr) => (
                            <tr key={usr.email} className="hover:bg-slate-50/50 dark:hover:bg-slate-850/20">
                              <td className="p-3 font-semibold">{usr.name}</td>
                              <td className="p-3 font-mono text-slate-450">{usr.email}</td>
                              <td className="p-3">
                                <span className={`px-2 py-0.5 rounded-full text-3xs font-black uppercase ${
                                  usr.role === 'Admin' 
                                    ? 'bg-red-50 text-red-650 dark:bg-red-950/20' 
                                    : usr.role === 'Editor' 
                                      ? 'bg-sky-50 text-sky-600 dark:bg-sky-950/20' 
                                      : 'bg-green-50 text-green-600 dark:bg-green-950/20'
                                }`}>
                                  {usr.role}
                                </span>
                              </td>
                              <td className="p-3 text-center">
                                <button
                                  onClick={() => handleDeleteUserClick(usr.email)}
                                  className="p-1 px-2 border rounded text-red-500 text-2xs hover:bg-red-50"
                                  disabled={usr.email === 'aftab2012ka@gmail.com'}
                                  id={`delete-usr-${usr.email.split('@')[0]}`}
                                >
                                  Revoke
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
