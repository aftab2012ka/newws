import { useEffect, useState } from 'react';
import { Zap, Volume2, ArrowRightLeft } from 'lucide-react';
import { NewsArticle, Language } from '../types';
import { UI_TRANSLATIONS } from '../utils/translations';

interface BreakingNewsTickerProps {
  articles: NewsArticle[];
  language: Language;
  onArticleClick: (id: string) => void;
}

export default function BreakingNewsTicker({
  articles,
  language,
  onArticleClick
}: BreakingNewsTickerProps) {
  const t = UI_TRANSLATIONS[language];
  const isRTL = language === 'ur';

  // Filter breaking articles for the current selected language
  const breakingNews = articles.filter(
    (art) => art.breaking && art.language === language && art.status === 'published'
  );

  // If none, take top 3 latest published news in this language as a fallback
  const displayArticles = breakingNews.length > 0 
    ? breakingNews 
    : articles.filter(art => art.language === language && art.status === 'published').slice(0, 3);

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (displayArticles.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % displayArticles.length);
    }, 6000); // changes every 6s for comfortable reading
    return () => clearInterval(interval);
  }, [displayArticles]);

  if (displayArticles.length === 0) {
    return null;
  }

  const currentArticle = displayArticles[currentIndex];

  return (
    <div className="w-full bg-[#0F172A] text-white border-b border-slate-800 py-1 px-4 sm:px-6 md:px-8 h-8 flex items-center overflow-hidden relative" id="breaking-ticker-container">
      <div className={`max-w-7xl mx-auto flex items-center gap-3 w-full ${isRTL ? 'flex-row-reverse' : ''}`}>
        
        {/* Animated Badge */}
        <div className="flex items-center gap-1 shrink-0 px-2 py-0.5 bg-[#EF4444] text-white text-[10px] font-extrabold rounded-[2px] animate-pulse shadow-xs uppercase tracking-wide">
          <Zap size={11} className="fill-current" />
          <span>{language === 'ur' ? 'بریکنگ نیوز' : language === 'kn' ? 'ಬ್ರೇಕಿಂಗ್ ನ್ಯೂಸ್' : 'Breaking'}</span>
        </div>

        {/* Ticker Content Frame */}
        <div className={`flex-1 relative h-5 overflow-hidden text-xs font-semibold ${isRTL ? 'text-right' : 'text-left'}`}>
          <div 
            key={currentArticle?.id}
            onClick={() => onArticleClick(currentArticle?.id)}
            className="absolute inset-0 flex items-center gap-2 cursor-pointer text-slate-100 hover:text-sky-400 transition-all duration-500 transform translate-y-0 hover:translate-x-1"
          >
            <span className="text-sky-400 shrink-0 font-mono text-[10px] font-bold">
              [{currentArticle?.time}]
            </span>
            <span className="truncate font-semibold tracking-tight">
              {currentArticle?.title}
            </span>
          </div>
        </div>

        {/* Controls Indicator */}
        {displayArticles.length > 1 && (
          <div className={`hidden sm:flex items-center gap-1 text-[10px] text-slate-500 font-mono ${isRTL ? 'flex-row-reverse' : ''}`}>
            <span>{currentIndex + 1}</span>
            <span>/</span>
            <span>{displayArticles.length}</span>
          </div>
        )}
      </div>
    </div>
  );
}
