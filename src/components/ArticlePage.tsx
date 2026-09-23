import React, { useState } from 'react';
import { 
  Calendar, User, Eye, Heart, ArrowLeft, ArrowRight, Share2, 
  MessageSquare, Copy, Twitter, Facebook, Sparkles, Send, Check
} from 'lucide-react';
import { NewsArticle, Language, NewsCategory, ArticleComment } from '../types';
import { UI_TRANSLATIONS } from '../utils/translations';

interface ArticlePageProps {
  article: NewsArticle;
  allArticles: NewsArticle[];
  categories: NewsCategory[];
  comments: ArticleComment[];
  language: Language;
  onBack: () => void;
  onArticleClick: (id: string) => void;
  onLike: (id: string) => void;
  onAddComment: (articleId: string, name: string, email: string, content: string) => void;
}

export default function ArticlePage({
  article,
  allArticles,
  categories,
  comments,
  language,
  onBack,
  onArticleClick,
  onLike,
  onAddComment
}: ArticlePageProps) {
  const t = UI_TRANSLATIONS[language];
  const isRTL = language === 'ur';

  // Comment Form States
  const [comName, setComName] = useState('');
  const [comEmail, setComEmail] = useState('');
  const [comContent, setComContent] = useState('');
  const [feedbackMsg, setFeedbackMsg] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Filter approved comments for this specific article
  const articleComments = comments.filter((c) => c.articleId === article.id && c.approved);

  // Find related articles in same category & language, excluding current article
  const relatedArticles = allArticles
    .filter((a) => a.category === article.category && a.language === language && a.id !== article.id && a.status === 'published')
    .slice(0, 3);

  // Fallback to general latest in same language if related is empty
  const displayRelated = relatedArticles.length > 0 
    ? relatedArticles 
    : allArticles.filter((a) => a.language === language && a.id !== article.id && a.status === 'published').slice(0, 3);

  // Calculate previous and next articles within the current category/language
  const siblings = allArticles.filter((a) => a.language === language && a.status === 'published');
  const currentIndex = siblings.findIndex((s) => s.id === article.id);
  const prevArticle = currentIndex > 0 ? siblings[currentIndex - 1] : null;
  const nextArticle = currentIndex < siblings.length - 1 ? siblings[currentIndex + 1] : null;

  // Resolve Category name
  const catObj = categories.find((c) => c.id === article.category);
  const getCategoryLabel = () => {
    if (!catObj) return '';
    if (language === 'ur') return catObj.nameUR;
    if (language === 'kn') return catObj.nameKN;
    return catObj.nameEN;
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comName.trim() || !comEmail.trim() || !comContent.trim()) return;
    onAddComment(article.id, comName, comEmail, comContent);
    setComName('');
    setComEmail('');
    setComContent('');
    setFeedbackMsg(true);
    setTimeout(() => setFeedbackMsg(false), 8000);
  };

  const shareTitle = encodeURIComponent(article.title);
  const shareUrl = encodeURIComponent(window.location.href);

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 sm:py-10" id="individual-article-view">
      
      {/* Back button */}
      <div className={`mb-6 sm:mb-8 flex ${isRTL ? 'justify-end' : 'justify-start'}`}>
        <button
          onClick={onBack}
          className={`flex items-center gap-2 text-xs sm:text-sm font-semibold text-sky-650 hover:text-sky-800 transition-colors cursor-pointer ${
            isRTL ? 'flex-row-reverse' : ''
          }`}
          id="btn-back-to-grid"
        >
          {isRTL ? <ArrowRight size={16} /> : <ArrowLeft size={16} />}
          <span>{language === 'ur' ? 'پیچھے جائیں' : language === 'kn' ? 'ಹಿಂದಕ್ಕೆ ಹೋಗು' : 'Back to News'}</span>
        </button>
      </div>

      <article className="bg-white dark:bg-slate-900 border border-slate-250 dark:border-slate-800 rounded-lg p-4 sm:p-5 shadow-3xs">
        
        {/* Header Title Section */}
        <div className={`space-y-2 mb-4 ${isRTL ? 'text-right' : 'text-left'}`}>
          <div className={`flex flex-wrap items-center gap-1.5 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <span className="bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-450 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm border border-sky-100 dark:border-slate-800">
              {getCategoryLabel()}
            </span>
          </div>

          <h1 className="text-lg sm:text-xl lg:text-2xl font-extrabold text-slate-950 dark:text-white tracking-tight leading-tight">
            {article.title}
          </h1>

          {/* Author info & timestamps */}
          <div className={`flex flex-wrap items-center gap-y-1.5 gap-x-3.5 text-[10px] text-slate-500 dark:text-slate-400 pb-3 border-b border-slate-100 dark:border-slate-800 ${
            isRTL ? 'flex-row-reverse justify-start' : 'justify-start'
          }`}>
            <div className={`flex items-center gap-1.5 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className="w-5 h-5 rounded-full bg-sky-100 dark:bg-slate-800 flex items-center justify-center text-sky-600 dark:text-sky-450 font-bold text-[10px] uppercase">
                {article.author.charAt(0)}
              </div>
              <div>
                <span className="font-bold text-slate-800 dark:text-slate-200">{article.author}</span>
                <span className="text-[9px] text-slate-400"> ({article.authorRole})</span>
              </div>
            </div>

            <div className="flex items-center gap-1 font-mono">
              <Calendar size={11} />
              <span>{article.date} | {article.time}</span>
            </div>

            <div className="flex items-center gap-1 font-mono">
              <Eye size={11} />
              <span>{article.views} {t.views}</span>
            </div>
          </div>
        </div>

        {/* Featured Cover Image */}
        <div className="w-full h-56 sm:h-64 md:h-[320px] rounded-md overflow-hidden mb-4 border border-slate-150 dark:border-slate-800">
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Dynamic Social Sharing Deck */}
        <div className={`flex flex-wrap gap-2.5 mb-8 pb-5 border-b border-slate-100 dark:border-slate-800 ${
          isRTL ? 'flex-row-reverse' : ''
        }`}>
          <button
            onClick={() => onLike(article.id)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-red-50 hover:bg-red-100 text-red-500 dark:bg-red-950/20 dark:hover:bg-red-950/40 rounded-lg text-xs font-semibold cursor-pointer border border-red-100 dark:border-red-900/30 transition-colors"
            id="action-like-article"
          >
            <Heart size={14} className="fill-current" />
            <span>{article.likes}</span>
          </button>

          <button
            onClick={handleCopyLink}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-semibold cursor-pointer border border-slate-200 dark:border-slate-700"
            title="Copy URL Address"
          >
            {copiedLink ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
            <span>{copiedLink ? 'Copied' : 'Copy'}</span>
          </button>

          <a
            href={`https://twitter.com/intent/tweet?text=${shareTitle}&url=${shareUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-sky-50 dark:bg-sky-950/20 hover:bg-sky-100 dark:hover:bg-sky-950/40 text-sky-600 dark:text-sky-400 rounded-lg text-xs font-semibold border border-sky-100 dark:border-sky-900/40"
          >
            <Twitter size={14} className="fill-current" />
            <span>Tweet</span>
          </a>

          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 dark:bg-blue-950/20 hover:bg-blue-100 dark:hover:bg-blue-950/40 text-blue-650 dark:text-blue-400 rounded-lg text-xs font-semibold border border-blue-100 dark:border-blue-900/40"
          >
            <Facebook size={14} className="fill-current" />
            <span>Share</span>
          </a>

          <a
            href={`https://api.whatsapp.com/send?text=${shareTitle}%20--%20${shareUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 dark:bg-green-950/20 hover:bg-green-100 dark:hover:bg-green-950/40 text-green-650 dark:text-green-400 rounded-lg text-xs font-semibold border border-green-100 dark:border-green-900/40"
          >
            <Share2 size={14} />
            <span>WhatsApp</span>
          </a>
        </div>

        {/* Content Body Pane */}
        <div className={`prose dark:prose-invert max-w-none text-slate-850 dark:text-slate-100 leading-relaxed text-sm sm:text-base font-normal mb-8 ${
          isRTL ? 'text-right dir-rtl font-serif' : 'text-left font-sans'
        }`}>
          {article.content.split('\n\n').map((para, idx) => (
            <p key={idx} className="mb-4 sm:mb-6 last:mb-0">
              {para}
            </p>
          ))}
        </div>

        {/* Sibling Article Navigation */}
        <div className={`border-t border-b border-slate-100 dark:border-slate-800 py-5 my-8 flex items-center justify-between gap-4 flex-col sm:flex-row ${
          isRTL ? 'sm:flex-row-reverse' : ''
        }`}>
          {prevArticle ? (
            <div 
              onClick={() => onArticleClick(prevArticle.id)}
              className={`flex-1 flex gap-2.5 items-center cursor-pointer p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-850 border border-transparent hover:border-slate-100 dark:hover:border-slate-800 min-w-0 ${
                isRTL ? 'text-right justify-start flex-row-reverse' : 'text-left justify-start'
              }`}
            >
              <div className="w-8 h-8 rounded-full bg-sky-50 dark:bg-slate-800 flex items-center justify-center shrink-0">
                <ArrowLeft size={16} className="text-sky-500" />
              </div>
              <div className="min-w-0">
                <span className="text-4xs text-slate-400 uppercase tracking-widest block">{t.prevArticle}</span>
                <span className="text-2xs sm:text-xs font-bold text-slate-700 dark:text-slate-350 truncate block mt-0.5">{prevArticle.title}</span>
              </div>
            </div>
          ) : (
            <div className="flex-1 hidden sm:block"></div>
          )}

          {nextArticle ? (
            <div 
              onClick={() => onArticleClick(nextArticle.id)}
              className={`flex-1 flex gap-2.5 items-center cursor-pointer p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-850 border border-transparent hover:border-slate-100 dark:hover:border-slate-800 min-w-0 ${
                isRTL ? 'text-left justify-start flex-row-reverse' : 'text-right justify-start'
              }`}
            >
              <div className="min-w-0 flex-1">
                <span className="text-4xs text-slate-400 uppercase tracking-widest block">{t.nextArticle}</span>
                <span className="text-2xs sm:text-xs font-bold text-slate-700 dark:text-slate-350 truncate block mt-0.5">{nextArticle.title}</span>
              </div>
              <div className="w-8 h-8 rounded-full bg-sky-50 dark:bg-slate-800 flex items-center justify-center shrink-0">
                <ArrowRight size={16} className="text-sky-500" />
              </div>
            </div>
          ) : (
            <div className="flex-1 hidden sm:block"></div>
          )}
        </div>

        {/* Discussion / Comments Section */}
        <div className="mt-10 pt-4" id="article-comments-deck">
          <div className={`flex items-center gap-2 mb-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <MessageSquare size={18} className="text-sky-500" />
            <h3 className={`text-md sm:text-lg font-bold text-slate-900 dark:text-white ${isRTL ? 'text-right' : 'text-left'}`}>
              {t.commentsList} ({articleComments.length})
            </h3>
          </div>

          {/* New comment input form */}
          <form onSubmit={handleCommentSubmit} className="space-y-4 mb-8 bg-slate-50/50 dark:bg-slate-950/20 border border-slate-100 dark:border-slate-850 rounded-xl p-5 sm:p-6 text-slate-700">
            <h4 className={`text-xs sm:text-sm font-semibold text-slate-850 dark:text-slate-200 uppercase tracking-widest mb-1 ${isRTL ? 'text-right' : 'text-left'}`}>
              {t.postComment}
            </h4>

            {feedbackMsg && (
              <div className={`p-4 bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-400 text-xs sm:text-sm font-medium rounded-lg border border-green-100 dark:border-green-900/30 text-center`}>
                {t.commentsPending}
              </div>
            )}

            <div className={`grid grid-cols-1 sm:grid-cols-2 gap-4 ${isRTL ? 'dir-rtl' : ''}`}>
              <div className="flex flex-col gap-1.5 text-xs">
                <label className="font-semibold text-slate-600 dark:text-slate-350">{t.commentName}</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Salim Patel"
                  value={comName}
                  onChange={(e) => setComName(e.target.value)}
                  className="p-2.5 text-xs bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-sky-500 text-slate-800 dark:text-slate-100"
                />
              </div>

              <div className="flex flex-col gap-1.5 text-xs">
                <label className="font-semibold text-slate-600 dark:text-slate-350">{t.commentEmail}</label>
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={comEmail}
                  onChange={(e) => setComEmail(e.target.value)}
                  className="p-2.5 text-xs bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-sky-500 text-slate-800 dark:text-slate-100"
                />
              </div>
            </div>

            <div className={`flex flex-col gap-1.5 text-xs ${isRTL ? 'dir-rtl' : ''}`}>
              <label className="font-semibold text-slate-600 dark:text-slate-350">Message</label>
              <textarea
                required
                rows={4}
                placeholder={t.commentContent}
                value={comContent}
                onChange={(e) => setComContent(e.target.value)}
                className="p-2.5 text-xs bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-sky-500 text-slate-800 dark:text-slate-100"
              />
            </div>

            <div className={`flex ${isRTL ? 'justify-start' : 'justify-end'}`}>
              <button
                type="submit"
                className={`py-2 px-5 bg-sky-500 hover:bg-sky-600 text-white rounded-lg text-xs font-bold shadow-xs hover:shadow-md transition-all flex items-center gap-1.5 cursor-pointer ${
                  isRTL ? 'flex-row-reverse' : ''
                }`}
              >
                <Send size={13} />
                <span>{t.btnComment}</span>
              </button>
            </div>
          </form>

          {/* List of comments */}
          <div className="space-y-4">
            {articleComments.map((com) => (
              <div 
                key={com.id} 
                className={`p-4 bg-slate-50 dark:bg-slate-850 rounded-xl border border-slate-100/50 dark:border-slate-800 flex gap-3 ${
                  isRTL ? 'flex-row-reverse text-right' : 'text-left'
                }`}
                id={`comment-item-${com.id}`}
              >
                <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-100 flex items-center justify-center font-bold text-xs shrink-0 select-none uppercase">
                  {com.name.charAt(0)}
                </div>
                <div className="flex-1 space-y-1.5">
                  <div className={`flex items-baseline justify-between flex-wrap gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <span className="text-xs font-bold text-slate-850 dark:text-slate-200">{com.name}</span>
                    <span className="text-4xs text-slate-400 font-mono">{com.date}</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-350 leading-relaxed font-sans font-normal">
                    {com.content}
                  </p>
                </div>
              </div>
            ))}

            {articleComments.length === 0 && (
              <div className="text-center py-6 text-slate-400 dark:text-slate-550 font-mono text-2xs">
                {t.noComments}
              </div>
            )}
          </div>
        </div>

      </article>

      {/* Related Stories Bar Section */}
      <section className="mt-12 sm:mt-16 space-y-4" id="related-news-section">
        <h3 className={`text-md sm:text-lg font-extrabold text-slate-950 dark:text-white tracking-tight ${isRTL ? 'text-right' : 'text-left'}`}>
          {t.relatedArticles}
        </h3>

        <div className={`grid grid-cols-1 sm:grid-cols-3 gap-6 ${isRTL ? 'dir-rtl' : ''}`}>
          {displayRelated.map((a) => (
            <div
              key={a.id}
              onClick={() => onArticleClick(a.id)}
              className="bg-white dark:bg-slate-900 border border-slate-150/70 dark:border-slate-800/80 rounded-xl overflow-hidden cursor-pointer shadow-2xs hover:shadow-xs group transition-all"
            >
              <div className="h-36 w-full overflow-hidden bg-slate-100">
                <img
                  src={a.image}
                  alt={a.title}
                  className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                />
              </div>
              <div className={`p-4 space-y-1 ${isRTL ? 'text-right' : 'text-left'}`}>
                <span className="text-[10px] text-sky-500 font-bold uppercase tracking-wider block">
                  {categories.find((c) => c.id === a.category)?.nameEN || 'Local'}
                </span>
                <h4 className="text-xs sm:text-xs font-bold text-slate-850 dark:text-slate-155 group-hover:text-sky-500 line-clamp-2 leading-snug transition-colors">
                  {a.title}
                </h4>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
