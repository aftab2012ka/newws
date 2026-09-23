import { Eye, TrendingUp, Calendar, Heart } from 'lucide-react';
import { NewsArticle, Language } from '../types';
import { UI_TRANSLATIONS } from '../utils/translations';

interface TrendingNewsSidebarProps {
  articles: NewsArticle[];
  language: Language;
  onArticleClick: (id: string) => void;
}

export default function TrendingNewsSidebar({
  articles,
  language,
  onArticleClick
}: TrendingNewsSidebarProps) {
  const t = UI_TRANSLATIONS[language];
  const isRTL = language === 'ur';

  // Filter published articles for current language
  const localizedArticles = articles.filter(
    (art) => art.language === language && art.status === 'published'
  );

  // Compute trending (most viewed)
  const trendingArticles = [...localizedArticles]
    .sort((a, b) => b.views - a.views)
    .slice(0, 5);

  // Compute recent
  const recentArticles = [...localizedArticles]
    .sort((a, b) => {
      const dateA = new Date(`${a.date} ${a.time}`);
      const dateB = new Date(`${b.date} ${b.time}`);
      return dateB.getTime() - dateA.getTime();
    })
    .slice(0, 5);

  return (
    <aside className="space-y-4" id="trending-news-sidebar">
      
      {/* 1. Most Viewed/Trending Block */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-4 shadow-3xs">
        <div className={`flex items-center gap-1.5 mb-3 pb-1.5 border-b border-transparent ${
          isRTL ? 'flex-row-reverse' : ''
        }`}>
          <h2 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-tight pb-1 border-b-2 border-sky-500 inline-block">
            {t.trending}
          </h2>
        </div>

        <div className="space-y-3 font-sans">
          {trendingArticles.map((art, idx) => (
            <div
              key={art.id}
              onClick={() => onArticleClick(art.id)}
              className={`flex gap-3 cursor-pointer group pb-2.5 border-b border-dashed border-slate-100 last:border-0 dark:border-slate-850 last:pb-0 ${
                isRTL ? 'flex-row-reverse text-right' : 'text-left'
              }`}
              id={`trending-item-${art.id}`}
            >
              {/* Placement count prefix indicator */}
              <span className="text-base font-black text-slate-205 dark:text-slate-700 group-hover:text-sky-500 transition-colors font-mono tracking-tight w-6 shrink-0 text-center leading-none">
                {idx + 1}
              </span>

              {/* Title & Stats */}
              <div className="flex-1 min-w-0 space-y-1">
                <h4 className="text-[11px] font-bold text-slate-800 dark:text-slate-100 group-hover:text-sky-500 transition-colors leading-snug line-clamp-2">
                  {art.title}
                </h4>
                <div className={`flex items-center gap-2 text-[9px] font-semibold text-slate-400 dark:text-slate-500 ${
                  isRTL ? 'justify-start flex-row-reverse' : 'justify-start'
                }`}>
                  <span className="flex items-center gap-1">
                    <Eye size={10} />
                    {art.views}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1 hover:text-red-500">
                    <Heart size={10} className="text-red-400" />
                    {art.likes}
                  </span>
                </div>
              </div>
            </div>
          ))}

          {trendingArticles.length === 0 && (
            <p className="text-4xs text-slate-400 text-center font-semibold py-2">
              No trending articles
            </p>
          )}
        </div>
      </div>

      {/* 2. Recent Articles Block */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-4 shadow-3xs">
        <div className={`flex items-center gap-1.5 mb-3 pb-1.5 border-b border-transparent ${
          isRTL ? 'flex-row-reverse' : ''
        }`}>
          <h2 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-tight pb-1 border-b-2 border-sky-500 inline-block">
            {language === 'ur' ? 'تازہ ترین اپڈیٹس' : language === 'kn' ? 'ಇತ್ತೀಚಿನ ಸುದ್ದಿಗಳು' : 'Recent Bulletins'}
          </h2>
        </div>

        <div className="space-y-3 font-sans">
          {recentArticles.map((art) => (
            <div
              key={art.id}
              onClick={() => onArticleClick(art.id)}
              className={`flex gap-3 cursor-pointer group pb-2.5 border-b border-dashed border-slate-100 last:border-0 dark:border-slate-850 last:pb-0 ${
                isRTL ? 'flex-row-reverse text-right' : 'text-left'
              }`}
              id={`recent-item-${art.id}`}
            >
              {/* Circle Avatar Mini Photo */}
              <div className="w-10 h-10 rounded-md overflow-hidden bg-slate-50 shrink-0 border border-slate-100 dark:border-slate-800">
                <img
                  src={art.image}
                  alt={art.title}
                  className="w-full h-full object-cover group-hover:scale-102 transition-transform"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                />
              </div>

              {/* Bulletins Text details */}
              <div className="flex-1 min-w-0 space-y-0.5">
                <h4 className="text-[11px] font-bold text-slate-800 dark:text-slate-100 group-hover:text-sky-500 transition-colors leading-snug line-clamp-2">
                  {art.title}
                </h4>
                <div className={`flex items-center gap-1 text-[9px] font-semibold text-slate-400 dark:text-slate-550 font-mono ${
                  isRTL ? 'flex-row-reverse' : ''
                }`}>
                  <Calendar size={9} className="shrink-0" />
                  <span>{art.date} • {art.time}</span>
                </div>
              </div>
            </div>
          ))}

          {recentArticles.length === 0 && (
            <p className="text-4xs text-slate-400 text-center font-semibold py-2">
              No recent articles
            </p>
          )}
        </div>
      </div>
    </aside>
  );
}
