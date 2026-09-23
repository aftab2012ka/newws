import { Calendar, User, Eye, Heart, ArrowUpRight } from 'lucide-react';
import { NewsArticle, Language, NewsCategory } from '../types';
import { UI_TRANSLATIONS } from '../utils/translations';

interface LatestNewsGridProps {
  articles: NewsArticle[];
  categories: NewsCategory[];
  language: Language;
  onArticleClick: (id: string) => void;
}

export default function LatestNewsGrid({
  articles,
  categories,
  language,
  onArticleClick
}: LatestNewsGridProps) {
  const t = UI_TRANSLATIONS[language];
  const isRTL = language === 'ur';

  // Return appropriate localized category name
  const getCategoryName = (catId: string) => {
    const categoryObj = categories.find((c) => c.id === catId);
    if (!categoryObj) return '';
    if (language === 'ur') return categoryObj.nameUR;
    if (language === 'kn') return categoryObj.nameKN;
    return categoryObj.nameEN;
  };

  if (articles.length === 0) {
    return (
      <div className="text-center py-12 px-4 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50/50 dark:bg-slate-900/30">
        <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 font-medium max-w-sm mx-auto">
          {t.noNews}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4" id="latest-news-grid">
      {articles.map((art) => (
        <article
          key={art.id}
          onClick={() => onArticleClick(art.id)}
          className="group bg-white dark:bg-slate-900 border border-slate-250 dark:border-slate-800 rounded-lg overflow-hidden shadow-2xs hover:shadow-xs hover:border-slate-350 dark:hover:border-slate-700 transition-all duration-200 cursor-pointer flex flex-col justify-between"
          id={`news-card-${art.id}`}
        >
          {/* Header Image Frame */}
          <div>
            <div className="h-28 sm:h-32 w-full relative overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0">
              <img
                src={art.image}
                alt={art.title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-102"
                referrerPolicy="no-referrer"
                loading="lazy"
              />
              {/* Category tags overlay */}
              <div className={`absolute top-2 ${isRTL ? 'right-2' : 'left-2'}`}>
                <span className="bg-sky-500 text-white text-[8px] uppercase tracking-wider font-extrabold px-1.5 py-0.5 rounded-xs shadow-xs border border-sky-600/10 dark:border-slate-800">
                  {getCategoryName(art.category)}
                </span>
              </div>
              
              {/* Breaking Flag overlay */}
              {art.breaking && (
                <div className={`absolute bottom-2 ${isRTL ? 'left-2' : 'right-2'}`}>
                  <span className="bg-red-600 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-sm uppercase tracking-wider animate-pulse">
                    {language === 'ur' ? 'اہم' : language === 'kn' ? 'ತುರ್ತು' : 'Breaking'}
                  </span>
                </div>
              )}
            </div>

            {/* Title & Summary */}
            <div className={`p-3.5 space-y-1.5 ${isRTL ? 'text-right' : 'text-left'}`}>
              <div className="flex items-center gap-1.5 text-[9px] font-semibold text-slate-400 font-mono">
                <span>{art.time}</span>
                <span>•</span>
                <span>{art.date}</span>
              </div>
              
              <h3 className="text-xs sm:text-xs font-extrabold text-slate-850 dark:text-slate-100 tracking-tight leading-snug group-hover:text-sky-500 dark:group-hover:text-sky-400 transition-colors line-clamp-2">
                {art.title}
              </h3>
              
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal font-medium line-clamp-2">
                {art.summary}
              </p>
            </div>
          </div>

          {/* Footer Metadata */}
          <div className="p-3.5 pt-0">
            <div className={`mt-2 pt-2 border-t border-slate-100 dark:border-slate-850 flex items-center justify-between gap-2 text-[9px] font-bold text-slate-400 dark:text-slate-500 ${
              isRTL ? 'flex-row-reverse' : ''
            }`}>
              
              {/* Author & Date */}
              <div className={`flex flex-col ${isRTL ? 'items-end' : 'items-start'}`}>
                <span className="font-bold text-slate-600 dark:text-slate-350">{art.author}</span>
              </div>

              {/* Counters Info */}
              <div className={`flex items-center gap-2.5 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <span className="flex items-center gap-1">
                  <Eye size={10} className="text-slate-400" />
                  {art.views}
                </span>
                <span className="flex items-center gap-1 hover:text-red-500">
                  <Heart size={10} className="text-red-400" />
                  {art.likes}
                </span>
              </div>
            </div>

            {/* Read More link button */}
            <div className={`mt-2.5 flex ${isRTL ? 'justify-start' : 'justify-end'}`}>
              <div className={`text-[9px] font-extrabold text-sky-500 group-hover:text-sky-600 flex items-center gap-0.5 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <span>{t.readMore}</span>
                <ArrowUpRight size={10} className="transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
