import { useState } from 'react';
import { Play, Calendar, Video, ArrowRightLeft } from 'lucide-react';
import { YouTubeVideo, Language, NewsCategory } from '../types';
import { UI_TRANSLATIONS } from '../utils/translations';

interface VideoNewsSectionProps {
  videos: YouTubeVideo[];
  categories: NewsCategory[];
  language: Language;
}

export default function VideoNewsSection({
  videos,
  categories,
  language
}: VideoNewsSectionProps) {
  const t = UI_TRANSLATIONS[language];
  const isRTL = language === 'ur';

  // Get active video state, default to first video if any
  const [activeVideoId, setActiveVideoId] = useState<string | null>(
    videos.length > 0 ? videos[0].id : null
  );

  // If active video is null but we have videos, load first one
  const activeVideo = videos.find(v => v.id === (activeVideoId || (videos[0]?.id)));

  if (videos.length === 0) {
    return null;
  }

  // Localized category label helper
  const getCategoryName = (catId: string) => {
    const category = categories.find(c => c.id === catId);
    if (!category) return '';
    if (language === 'ur') return category.nameUR;
    if (language === 'kn') return category.nameKN;
    return category.nameEN;
  };

  return (
    <section className="w-full bg-[#0F172A] border border-slate-800 rounded-lg p-4 sm:p-5 text-white transition-all overflow-hidden" id="video-news-deck">
      <div className={`flex items-center gap-2 mb-4 border-b border-slate-800 pb-2.5 ${isRTL ? 'flex-row-reverse' : ''}`}>
        <div className="w-7 h-7 rounded-md bg-red-650 flex items-center justify-center text-white shrink-0 shadow-xs">
          <Video size={13} className="fill-current" />
        </div>
        <div>
          <h2 className="text-xs sm:text-sm font-extrabold font-sans tracking-tight uppercase">
            {t.youtubeStreams}
          </h2>
          <p className="text-[10px] text-slate-450 font-semibold">
            {language === 'ur' ? 'ویڈیو رپورٹس اور لائیو کوریج' : language === 'kn' ? 'ಲೈವ್ ಸುದ್ದಿ ಪ್ರಕಟಣೆಗಳು' : 'Interactive video announcements and bulletins'}
          </p>
        </div>
      </div>

      <div className={`grid grid-cols-1 lg:grid-cols-3 gap-4 ${isRTL ? 'lg:flex lg:flex-row-reverse' : ''}`}>
        
        {/* Main Embedded Player Screen */}
        <div className="lg:col-span-2 space-y-3">
          {activeVideo ? (
            <div className="space-y-3">
              <div className="w-full aspect-video rounded-md overflow-hidden bg-black border border-slate-800 shadow-md relative">
                <iframe
                  src={`https://www.youtube.com/embed/${activeVideo.youtubeId}?autoplay=0&rel=0`}
                  title={activeVideo.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="w-full h-full"
                  id={`youtube-player-${activeVideo.id}`}
                ></iframe>
              </div>
              <div className={`space-y-1.5 ${isRTL ? 'text-right' : 'text-left'}`}>
                <div className={`flex items-center gap-1.5 text-[9px] text-sky-400 font-extrabold uppercase tracking-widest ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <span>{getCategoryName(activeVideo.category)}</span>
                  <span>•</span>
                  <span>{activeVideo.date}</span>
                </div>
                <h3 className="text-xs sm:text-sm font-extrabold text-slate-100 tracking-tight leading-snug">
                  {activeVideo.title}
                </h3>
                <p className="text-[11px] text-slate-400 leading-normal font-sans">
                  {activeVideo.description}
                </p>
              </div>
            </div>
          ) : (
            <div className="w-full aspect-video rounded-md bg-slate-950 flex flex-col items-center justify-center border border-slate-800 text-slate-500 font-mono text-xs">
              <Play size={32} className="text-slate-700 mb-2" />
              <span>Select a bulletin from queue</span>
            </div>
          )}
        </div>

        {/* Video Queue Side Deck */}
        <div className="flex flex-col gap-2.5 max-h-[340px] lg:max-h-[380px] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
          {videos.map((vid) => {
            const isActive = activeVideo?.id === vid.id;
            return (
              <div
                key={vid.id}
                onClick={() => setActiveVideoId(vid.id)}
                className={`flex gap-2.5 p-2 rounded-md border cursor-pointer hover:bg-slate-800/80 transition-all duration-150 shrink-0 ${
                  isActive
                    ? 'border-sky-500 bg-slate-850 shadow-xs'
                    : 'border-slate-800 bg-slate-900/50'
                } ${isRTL ? 'flex-row-reverse text-right' : 'text-left'}`}
                id={`video-queue-item-${vid.id}`}
              >
                {/* Thumb placeholder/icon */}
                <div className="w-20 shrink-0 aspect-video rounded bg-slate-950 border border-slate-800/80 overflow-hidden relative flex items-center justify-center">
                  <img
                    src={`https://img.youtube.com/vi/${vid.youtubeId}/hqdefault.jpg`}
                    alt={vid.title}
                    className="w-full h-full object-cover opacity-80"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      // Fallback if thumbnail fetching fails
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                  <div className="absolute inset-0 bg-slate-950/20 hover:bg-slate-950/5 flex items-center justify-center">
                    <div className="w-5 h-5 bg-red-650/90 rounded-full flex items-center justify-center text-white scale-90 group-hover:scale-100 transition-transform shadow-2xs">
                      <Play size={8} className="fill-current" />
                    </div>
                  </div>
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div className="space-y-0.5">
                    <span className="text-[9px] font-bold text-sky-450 uppercase tracking-widest font-mono">
                      {getCategoryName(vid.category)}
                    </span>
                    <h4 className="text-[10px] font-bold text-slate-200 hover:text-sky-450 transition-colors line-clamp-2 leading-tight">
                      {vid.title}
                    </h4>
                  </div>
                  <span className="text-[9px] text-slate-500 font-mono flex items-center gap-1 mt-0.5 font-semibold">
                    <Calendar size={9} />
                    {vid.date}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
