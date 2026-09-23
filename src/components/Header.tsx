import { useState } from 'react';
import { Search, Moon, Sun, Menu, X, Shield, Globe, Bell, Check } from 'lucide-react';
import { Language } from '../types';
import { UI_TRANSLATIONS } from '../utils/translations';

interface HeaderProps {
  websiteName: string;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;
  onOpenAdmin: () => void;
  onCreateNewArticleClick?: () => void;
  onHome: () => void;
  isSignedIn: boolean;
  currentUserRole: string | null;
  onLogout: () => void;
  pendingCommentsCount: number;
}

export default function Header({
  websiteName,
  searchQuery,
  setSearchQuery,
  language,
  setLanguage,
  darkMode,
  setDarkMode,
  onOpenAdmin,
  onHome,
  isSignedIn,
  currentUserRole,
  onLogout,
  pendingCommentsCount
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const t = UI_TRANSLATIONS[language];
  const isRTL = language === 'ur';

  const languagesConfig = [
    { code: 'en', label: 'English', local: 'English' },
    { code: 'ur', label: 'Urdu', local: 'اردو' },
    { code: 'kn', label: 'Kannada', local: 'ಕನ್ನಡ' }
  ];

  const currentLangLabel = languagesConfig.find(l => l.code === language)?.local || 'English';

  return (
    <header className="sticky top-0 z-50 w-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`flex items-center justify-between h-[60px] ${isRTL ? 'flex-row-reverse' : ''}`}>
          
          {/* Logo Section */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={onHome} id="header-logo">
            <div className="w-8 h-8 rounded-md bg-sky-500 flex items-center justify-center text-white font-extrabold text-lg shadow-2xs">
              I
            </div>
            <div className={`flex items-baseline ${isRTL ? 'text-right' : 'text-left'}`}>
              <span className="text-md sm:text-lg font-extrabold font-sans tracking-tight text-slate-800 dark:text-white hover:text-sky-500 transition-colors">
                {websiteName.split(' ')[0]}
              </span>
              <span className="text-md sm:text-lg font-extrabold font-sans tracking-tight text-slate-500 dark:text-slate-400 ml-1">
                {websiteName.split(' ').slice(1).join(' ') || 'NEWS'}
              </span>
            </div>
          </div>

          {/* Search bar - Desktop */}
          <div className={`hidden md:flex items-center max-w-[320px] lg:max-w-[400px] w-full mx-6 relative ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className="absolute inset-y-0 flex items-center px-3 pointer-events-none text-slate-450 dark:text-slate-500">
              <Search size={14} />
            </div>
            <input
              type="text"
              placeholder={t.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full py-1.5 focus:py-1.5 bg-[#F1F5F9] dark:bg-slate-800 hover:bg-slate-150/70 dark:hover:bg-slate-800/80 focus:bg-white border border-transparent focus:border-slate-300 dark:border-slate-700 rounded-full focus:outline-hidden focus:ring-0 text-xs text-slate-800 dark:text-slate-100 transition-all ${
                isRTL ? 'pr-3 pl-9 text-right' : 'pl-9 pr-3 text-left'
              }`}
              id="search-input-desktop"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className={`absolute inset-y-0 flex items-center px-2.5 text-slate-450 hover:text-slate-600 dark:hover:text-slate-200 ${
                  isRTL ? 'left-0' : 'right-0'
                }`}
              >
                <X size={13} />
              </button>
            )}
          </div>

          {/* Controls - Desktop */}
          <div className={`hidden md:flex items-center gap-2.5 ${isRTL ? 'flex-row-reverse' : ''}`}>
            {/* Language Switcher */}
            <div className="relative">
              <button
                onClick={() => setShowLangDropdown(!showLangDropdown)}
                className="flex items-center gap-1.5 px-2.5 py-1 border border-slate-200 dark:border-slate-700 bg-white hover:bg-slate-50 dark:bg-slate-800 rounded-md text-xs font-semibold text-slate-600 dark:text-slate-200 transition-colors"
                id="language-dropdown-toggle"
              >
                <Globe size={13} />
                <span>{currentLangLabel}</span>
              </button>

              {showLangDropdown && (
                <div 
                  className={`absolute mt-1 w-36 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-750 rounded-md shadow-md py-0.5 z-50 text-left ${
                    isRTL ? 'left-0' : 'right-0'
                  }`}
                >
                  {languagesConfig.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setLanguage(lang.code as Language);
                        setShowLangDropdown(false);
                      }}
                      className="w-full flex items-center justify-between px-2.5 py-1 text-2xs text-slate-705 dark:text-slate-200 hover:bg-sky-50 dark:hover:bg-slate-700 transition-colors text-left"
                    >
                      <div className="flex flex-col">
                        <span className="font-semibold">{lang.local}</span>
                      </div>
                      {language === lang.code && <Check size={12} className="text-sky-500" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Day / Night Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-1.5 border border-slate-200 dark:border-slate-700 rounded-md text-slate-500 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer text-xs"
              aria-label="Toggle Dark Mode"
              id="theme-toggler"
            >
              {darkMode ? <Sun size={14} className="text-yellow-400" /> : <Moon size={14} />}
            </button>

            {/* Admin Section Trigger */}
            {isSignedIn ? (
              <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <button
                  onClick={onOpenAdmin}
                  className="flex items-center gap-1 px-3 py-1 bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400 hover:bg-sky-100 border border-sky-150 rounded-md text-xs font-semibold animate-none"
                >
                  <Shield size={13} />
                  <span>Admin ({currentUserRole})</span>
                  {pendingCommentsCount > 0 && currentUserRole === 'Admin' && (
                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full inline-block animate-pulse"></span>
                  )}
                </button>
                <button
                  onClick={onLogout}
                  className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-350 hover:bg-slate-150 rounded-md text-2xs font-semibold"
                >
                  Log out
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAdmin}
                className="flex items-center gap-1 px-3 py-1.5 bg-[#0EA5E9] text-white hover:bg-[#0369A1] rounded-md text-xs font-bold shadow-2xs transition-all cursor-pointer"
                id="header-admin-login"
              >
                <Shield size={13} />
                <span>{t.adminPortal}</span>
              </button>
            )}
          </div>

          {/* Mobile menu & search toggle */}
          <div className="flex items-center md:hidden gap-2">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 text-slate-700 dark:text-slate-200"
            >
              {darkMode ? <Sun size={18} className="text-yellow-400" /> : <Moon size={18} />}
            </button>
            
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-700 dark:text-slate-200"
              id="mobile-menu-toggle"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 py-4 px-4 space-y-4">
          {/* Mobile Search */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Search size={16} />
            </div>
            <input
              type="text"
              placeholder={t.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-800 dark:text-slate-100"
              id="search-input-mobile"
            />
          </div>

          {/* Languages Selector Mobile */}
          <div>
            <span className="block text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
              Select Language / زبان منتخب کریں / ಭಾಷೆಯನ್ನು ಆರಿಸಿ
            </span>
            <div className="grid grid-cols-3 gap-2">
              {languagesConfig.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    setLanguage(lang.code as Language);
                    setMobileMenuOpen(false);
                  }}
                  className={`py-2 text-center text-xs font-medium rounded-lg border ${
                    language === lang.code
                      ? 'border-sky-500 bg-sky-50 text-sky-600 dark:bg-sky-950 dark:text-sky-300'
                      : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-850 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {lang.local}
                </button>
              ))}
            </div>
          </div>

          {/* Admin panel navigation (Mobile) */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-2">
            {isSignedIn ? (
              <div className="space-y-2">
                <div className="p-3 bg-slate-50 dark:bg-slate-850 rounded-lg text-xs text-slate-600 dark:text-slate-400 flex justify-between items-center">
                  <span>Logged in as: <strong>{currentUserRole}</strong></span>
                  <button onClick={onLogout} className="text-red-500 font-semibold underline">Logout</button>
                </div>
                <button
                  onClick={() => {
                    onOpenAdmin();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-sky-50 dark:bg-sky-900/25 text-sky-600 dark:text-sky-400 border border-sky-100 dark:border-sky-900 rounded-lg text-sm font-semibold"
                >
                  <Shield size={16} />
                  <span>Go to Admin Dashboard</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  onOpenAdmin();
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-slate-900 text-white dark:bg-sky-500 dark:hover:bg-sky-600 rounded-lg text-sm font-semibold"
              >
                <Shield size={16} />
                <span>{t.adminPortal}</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
