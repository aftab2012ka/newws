import { Calendar, User, Eye, Heart, ArrowRight, ArrowLeft } from 'lucide-react';
import { NewsArticle, Language, NewsCategory } from '../types';
import { UI_TRANSLATIONS } from '../utils/translations';

interface FeaturedNewsProps {
  articles: NewsArticle[];
  categories: NewsCategory[];
  language: Language;
  onArticleClick: (id: string) => void;
}

export default function FeaturedNews({
  articles,
  categories,
  language,
  onArticleClick
}: FeaturedNewsProps) {
  const t = UI_TRANSLATIONS[language];
  const isRTL = language === 'ur';

  // Filter articles for current language, published status, and marked as featured
  const candidateArticles = articles.filter(
    (art) => art.language === language && art.featured && art.status === 'published'
  );

  // Fallback if no featured is found: take the most viewed article of this language
  const featuredArticle = candidateArticles.length > 0 
    ? candidateArticles[0]
    : articles
        .filter((art) => art.language === language && art.status === 'published')
        .sort((a,b) => b.views - a.views)[0];

  if (!featuredArticle) {
    return null;
  }

  // Get localized category name
  const categoryObj = categories.find((c) => c.id === featuredArticle.category);
  const getCategoryName = () => {
    if (!categoryObj) return '';
    if (language === 'ur') return categoryObj.nameUR;
    if (language === 'kn') return categoryObj.nameKN;
    return categoryObj.nameEN;
  };

  return (
    <div className="w-full mb-4" id="featured-story-banner">
      <div 
        onClick={() => onArticleClick(featuredArticle.id)}
        className={`group bg-white dark:bg-slate-900 border border-slate-250 dark:border-slate-800 rounded-lg overflow-hidden shadow-2xs hover:shadow-xs hover:border-slate-350 transition-all duration-200 cursor-pointer flex flex-col md:flex-row ${
          isRTL ? 'md:flex-row-reverse' : ''
        }`}
      >
        {/* Cover Photo / Image Section */}
        <div className="w-full md:w-3/5 h-48 sm:h-56 md:h-[260px] relative overflow-hidden shrink-0">
          <img
            src={featuredArticle.image}
            alt={featuredArticle.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-102"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60"></div>
          
          {/* Overlay Tags */}
          <div className={`absolute top-2.5 ${isRTL ? 'right-2.5' : 'left-2.5'} flex flex-wrap gap-1.5`}>
            <span className="bg-sky-500 text-white text-[8px] uppercase tracking-wider font-extrabold px-1.5 py-0.5 rounded-xs shadow-xs">
              {getCategoryName()}
            </span>
            <span className="bg-red-600 text-white text-[8px] uppercase tracking-wider font-extrabold px-1.5 py-0.5 rounded-xs shadow-xs animate-pulse">
              {language === 'ur' ? 'نمایاں خبر' : language === 'kn' ? 'ವಿಶೇಷ ಸುದ್ದಿ' : 'Featured'}
            </span>
          </div>
        </div>

        {/* Text Details / Editorial Section */}
        <div className="w-full p-4 sm:p-5 flex flex-col justify-between">
          <div className={`space-y-1.5 ${isRTL ? 'text-right' : 'text-left'}`}>
            <span className="inline-block text-sky-600 dark:text-sky-450 text-[9px] uppercase tracking-wider font-bold font-mono">
              ★ {language === 'ur' ? 'آج کی ٹاپ اسٹوری' : language === 'kn' ? 'ಇಂದಿನ ಮುಖ್ಯಾಂಶ' : 'TODAY\'S TOP STORY'}
            </span>
            
            <h1 className="text-sm sm:text-base lg:text-lg font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight group-hover:text-sky-500 transition-colors">
              {featuredArticle.title}
            </h1>
            
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal font-medium line-clamp-3">
              {featuredArticle.summary}
            </p>
          </div>

          <div className="mt-3.5 pt-3.5 border-t border-slate-100 dark:border-slate-850 space-y-3">
            {/* Metadata Footer */}
            <div className={`flex flex-wrap items-center gap-y-1.5 gap-x-3.5 text-[9px] text-slate-450 dark:text-slate-500 font-bold ${
              isRTL ? 'justify-start flex-row-reverse' : 'justify-start'
            }`}>
              <div className="flex items-center gap-1">
                <User size={10} className="text-sky-500" />
                <span className="font-extrabold text-slate-650 dark:text-slate-350">{featuredArticle.author}</span>
                <span className="text-[8px] text-slate-400 font-normal">({featuredArticle.authorRole})</span>
              </div>
              
              <div className="flex items-center gap-1">
                <Calendar size={10} className="text-slate-400" />
                <span>{featuredArticle.date}</span>
              </div>

              <div className="flex items-center gap-1">
                <Eye size={10} className="text-slate-400" />
                <span>{featuredArticle.views}</span>
              </div>

              <div className="flex items-center gap-1">
                <Heart size={10} className="text-red-400" />
                <span>{featuredArticle.likes}</span>
              </div>
            </div>

            {/* Read More Trigger CTA */}
            <div className={`flex ${isRTL ? 'justify-start' : 'justify-end'}`}>
              <span className={`inline-flex items-center gap-1 text-[9px] font-extrabold text-sky-500 dark:text-sky-400 group-hover:text-sky-600 ${
                isRTL ? 'flex-row-reverse' : ''
              }`}>
                <span>{t.readMore}</span>
                {isRTL ? <ArrowLeft size={10} /> : <ArrowRight size={10} />}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
