import * as Icons from 'lucide-react';
import { NewsCategory, Language } from '../types';

interface NewsCategoriesProps {
  categories: NewsCategory[];
  activeCategoryId: string;
  setActiveCategoryId: (id: string) => void;
  language: Language;
}

// Map icon strings to dynamic Lucide elements safely
function CategoryIcon({ name, className }: { name: string; className?: string }) {
  // Safe fallback to generic Newspaper if icon doesn't exist
  const IconComponent = (Icons as any)[name] || Icons.FileText;
  return <IconComponent className={className} size={15} />;
}

export default function NewsCategories({
  categories,
  activeCategoryId,
  setActiveCategoryId,
  language
}: NewsCategoriesProps) {
  const isRTL = language === 'ur';

  // Return appropriate field based on language
  const getCategoryName = (cat: NewsCategory) => {
    if (language === 'ur') return cat.nameUR;
    if (language === 'kn') return cat.nameKN;
    return cat.nameEN;
  };

  return (
    <div className="w-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 transition-colors h-[45px] flex items-center overflow-hidden" id="categories-navigation-bar">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div 
          className={`flex items-center gap-5 overflow-x-auto scrollbar-none scroll-smooth h-[45px] ${
            isRTL ? 'flex-row-reverse justify-start' : 'flex-row justify-start'
          }`}
          style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}
        >
          {categories.map((cat) => {
            const isActive = activeCategoryId === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategoryId(cat.id)}
                className={`flex items-center gap-1.5 h-[45px] border-b-2 font-bold text-xs whitespace-nowrap transition-all duration-150 shrink-0 cursor-pointer ${
                  isActive
                    ? 'border-sky-500 text-sky-500'
                    : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-sky-500 hover:border-sky-500'
                }`}
                id={`category-btn-${cat.id}`}
              >
                <CategoryIcon 
                  name={cat.icon} 
                  className={isActive ? 'text-sky-500' : 'text-slate-400'} 
                />
                <span className="tracking-tight uppercase">{getCategoryName(cat)}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
