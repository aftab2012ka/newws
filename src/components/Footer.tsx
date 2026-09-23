import React, { useState } from 'react';
import { Mail, ShieldCheck, MapPin, Twitter, Facebook, Youtube, Rss, ArrowUp } from 'lucide-react';
import { Language, PortalSettings } from '../types';
import { UI_TRANSLATIONS } from '../utils/translations';

interface FooterProps {
  settings: PortalSettings;
  language: Language;
  onAboutClick: () => void;
  onSubscribeNewsletter: (email: string) => void;
}

export default function Footer({
  settings,
  language,
  onAboutClick,
  onSubscribeNewsletter
}: FooterProps) {
  const t = UI_TRANSLATIONS[language];
  const isRTL = language === 'ur';

  // Modal display states for legal parameters
  const [subEmail, setSubEmail] = useState('');
  const [subSuccess, setSubSuccess] = useState(false);
  const [activeModal, setActiveModal] = useState<'privacy' | 'terms' | 'disclaimer' | 'contact' | null>(null);

  const handleSubSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subEmail.trim()) return;
    onSubscribeNewsletter(subEmail.trim());
    setSubEmail('');
    setSubSuccess(true);
    setTimeout(() => setSubSuccess(false), 5000);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full bg-slate-900 border-t border-slate-800 text-slate-300 font-sans py-12 transition-colors duration-200" id="portal-main-footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Top Split segment */}
        <div className={`grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12 pb-10 border-b border-slate-800 ${
          isRTL ? 'text-right' : 'text-left'
        }`}>
          {/* About Column */}
          <div className="space-y-4">
            <h3 className="text-sm font-sans font-extrabold uppercase tracking-widest text-sky-400">
              {settings.websiteName}
            </h3>
            <p className="text-xs sm:text-xs leading-relaxed text-slate-400 font-normal">
              {settings.aboutText || t.aboutText}
            </p>
            <div className={`flex flex-wrap gap-2.5 pt-2 ${isRTL ? 'justify-start flex-row-reverse' : 'justify-start'}`}>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="w-7 h-7 bg-slate-800 hover:bg-sky-500 rounded-full flex items-center justify-center hover:text-white transition-colors" title="Follow on X (Twitter)">
                <Twitter size={13} className="fill-current" />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="w-7 h-7 bg-slate-800 hover:bg-blue-600 rounded-full flex items-center justify-center hover:text-white transition-colors" title="Like on Facebook">
                <Facebook size={13} className="fill-current" />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noreferrer" className="w-7 h-7 bg-slate-800 hover:bg-red-650 rounded-full flex items-center justify-center hover:text-white transition-colors" title="Subscribe on YouTube">
                <Youtube size={13} className="fill-current" />
              </a>
            </div>
          </div>

          {/* Quick Links Column */}
          <div className="space-y-4">
            <h3 className="text-sm font-sans font-extrabold uppercase tracking-widest text-sky-400">
              {language === 'ur' ? 'روابط' : language === 'kn' ? 'ತ್ವರಿತ ಸಂಪರ್ಕಗಳು' : 'Resource Links'}
            </h3>
            <ul className="grid grid-cols-1 gap-2 text-xs sm:text-xs font-semibold">
              <li>
                <button onClick={() => setActiveModal('contact')} className="hover:text-sky-400 text-slate-400 hover:underline text-left cursor-pointer">
                  📬 {t.contactUs}
                </button>
              </li>
              <li>
                <button onClick={() => setActiveModal('privacy')} className="hover:text-sky-400 text-slate-400 hover:underline text-left cursor-pointer">
                  🔒 {t.privacyPolicy}
                </button>
              </li>
              <li>
                <button onClick={() => setActiveModal('terms')} className="hover:text-sky-400 text-slate-400 hover:underline text-left cursor-pointer">
                  📜 {t.termsOfUse}
                </button>
              </li>
              <li>
                <button onClick={() => setActiveModal('disclaimer')} className="hover:text-sky-400 text-slate-400 hover:underline text-left cursor-pointer">
                  ⚖️ {t.disclaimer}
                </button>
              </li>
            </ul>
          </div>

          {/* Newsletter Input Form Column */}
          <div className="space-y-4">
            <h3 className="text-sm font-sans font-extrabold uppercase tracking-widest text-sky-400">
              {t.newsletterNewsletter}
            </h3>
            <p className="text-xs text-slate-450 leading-relaxed font-normal">
              {language === 'ur' ? 'ہمارے روزانہ نیوز لیٹر کو حاصل کر کے تازہ ترین خبروں سے باخبر رہیں۔' : language === 'kn' ? 'ದೈನಂದಿನ ಸುದ್ದಿ ಸುದ್ದಿ ಪತ್ರಕ್ಕೆ ಚಂದಾದಾರರಾಗಿ ಮತ್ತು ಇತ್ತೀಚಿನ ಸುದ್ದಿಗಳೊಂದಿಗೆ ನವೀಕೃತವಾಗಿರಿ.' : 'Receive automated daily brief bulletins and breaking alerts delivered straight to your inbox.'}
            </p>

            {subSuccess && (
              <div className="p-2 bg-sky-950 text-sky-400 text-3xs font-semibold rounded-md border border-sky-900 text-center">
                📬 Email coordinates added to subscription manifest successfully!
              </div>
            )}

            <form onSubmit={handleSubSubmit} className={`flex items-stretch gap-1.5 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <input
                type="email"
                required
                placeholder={t.newsletterEmailPlaceholder}
                value={subEmail}
                onChange={(e) => setSubEmail(e.target.value)}
                className="flex-1 p-2 bg-slate-800 text-xs text-white border border-slate-700 focus:outline-hidden focus:border-sky-500 rounded-md"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-sky-500 hover:bg-sky-650 text-white rounded-md text-xs font-bold shrink-0 transition-all cursor-pointer"
              >
                {t.newsletterSubBtn}
              </button>
            </form>
          </div>
        </div>

        {/* Bottom copyright segments */}
        <div className={`flex flex-col sm:flex-row justify-between items-center text-3xs text-slate-500 gap-4 ${
          isRTL ? 'sm:flex-row-reverse' : ''
        }`}>
          <div>
            <span>{t.copyright} </span>
            <span className="text-sky-600/80 font-semibold font-mono tracking-wide">[Registered Newspaper Group #785A-KN]</span>
          </div>

          <button
            onClick={scrollToTop}
            className="p-1 px-2.5 bg-slate-800 hover:bg-slate-755 hover:text-white rounded-md flex items-center gap-1 cursor-pointer transition-all"
            title="Scroll back to top"
          >
            <ArrowUp size={11} />
            <span>Top</span>
          </button>
        </div>

      </div>

      {/* --- Overlay Modals for Legal Links (Zero external redirect dependency) --- */}
      {activeModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 text-slate-850 dark:text-white max-w-lg w-full rounded-2xl p-6 relative border border-slate-200 dark:border-slate-800 shadow-xl max-h-[85vh] overflow-y-auto">
            
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 p-1 rounded-full text-slate-400 hover:text-slate-650 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            >
              <ArrowUp size={18} className="rotate-90" />
            </button>

            {/* Privacy Policy */}
            {activeModal === 'privacy' && (
              <div className="space-y-4 text-xs">
                <span className="text-3xs uppercase tracking-widest text-sky-500 font-bold font-mono">🔒 Secure Protocol</span>
                <h3 className="text-md sm:text-lg font-bold font-sans">{t.privacyPolicy}</h3>
                <p className="leading-relaxed text-slate-600 dark:text-slate-350">
                  Welcome to <strong>Ittehad News</strong>. We hold your data privacy in the absolute highest regard. This Privacy Statement documents how we manage client-side analytics trackers and browser security preferences:
                </p>
                <ul className="list-disc pl-5 space-y-2 text-slate-500">
                  <li><strong>Local persistence</strong>: All customized news dashboards, language profiles, and dark mode toggles remain client-side within secure keys. We never transfer telemetry data.</li>
                  <li><strong>Newsletter directories</strong>: Newsletter signups require complete administrative authorization. Your emails are never distributed to advertiser pools.</li>
                  <li><strong>Cookies and trackings</strong>: In compliance with Google AdSense and Analytics guidelines, temporary unique numbers are used strictly for service metrics and ad performance analytics.</li>
                </ul>
                <p className="text-slate-500 pet-2">Last Updated: June 11, 2026. For privacy audits, reach us at {settings.contactEmail}.</p>
              </div>
            )}

            {/* Terms of Use */}
            {activeModal === 'terms' && (
              <div className="space-y-4 text-xs">
                <span className="text-3xs uppercase tracking-widest text-sky-500 font-bold font-mono">📜 Editorial Agreement</span>
                <h3 className="text-md sm:text-lg font-bold font-sans">{t.termsOfUse}</h3>
                <p className="leading-relaxed text-slate-600 dark:text-slate-350">
                  By accessing <strong>Ittehad News</strong>, you agree to comply with our editorial and user commenting regulations under standard digital media verification rules:
                </p>
                <ol className="list-decimal pl-5 space-y-2 text-slate-500">
                  <li><strong>Comments Verification</strong>: All comments submitted to our news stories are systematically queued for human editor moderation. Hostile remarks, profane statements, or unvalidated allegations will be instantly deleted.</li>
                  <li><strong>Publishing Ownership</strong>: All copyrighted media assets, multilingual translations, and video streams syndicated on this website are owned by Ittehad News or licensed content providers.</li>
                  <li><strong>Responsibility for Use</strong>: You agree not to replicate raw articles or scrape regional databases for unauthorized commercial redistribution without signed written approval.</li>
                </ol>
              </div>
            )}

            {/* Disclaimer */}
            {activeModal === 'disclaimer' && (
              <div className="space-y-4 text-xs">
                <span className="text-3xs uppercase tracking-widest text-sky-500 font-bold font-mono">⚖️ Legal Safeguard</span>
                <h3 className="text-md sm:text-lg font-bold font-sans">{t.disclaimer}</h3>
                <p className="leading-relaxed text-slate-600 dark:text-slate-350">
                  Please review the following legal disclosures:
                </p>
                <div className="p-3 bg-yellow-50 dark:bg-yellow-950/25 border border-yellow-150 rounded text-[11px] text-yellow-800 dark:text-yellow-450 leading-normal font-sans font-normal">
                  "This website is a demonstration news portal designed to showcase responsive multi-lingual layout rendering, secure admin controls, and local state integrations. All news bulletins, places, and events represented on this platform are for evaluation purposes."
                </div>
                <p className="leading-relaxed text-slate-500">
                  While we work to synthesize unbiased bulletins and historical context across English, Urdu, and Kannada, we make no guarantees about the continuous temporal accuracy of real-time developments. Always verify critical alerts with relevant government departments.
                </p>
              </div>
            )}

            {/* Contact Us */}
            {activeModal === 'contact' && (
              <div className="space-y-4 text-xs">
                <span className="text-3xs uppercase tracking-widest text-sky-500 font-bold font-mono">📬 Newsroom Connection</span>
                <h3 className="text-md sm:text-lg font-bold font-sans">{t.contactUs}</h3>
                <p className="leading-relaxed text-slate-600 dark:text-slate-350">
                  Have a breaking bulletin, localized report, or correction query? Get in touch with our editorial desk:
                </p>
                <div className="space-y-3 pt-2 text-slate-500 text-xs">
                  <div className="flex items-center gap-2.5">
                    <Mail size={14} className="text-sky-500" />
                    <span><strong>Email Desk</strong>: {settings.contactEmail}</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <MapPin size={14} className="text-sky-500" />
                    <span><strong>Main Newsroom Office</strong>: Vidhana Assembly Boulevard, Bengaluru, Karnataka, India</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <ShieldCheck size={14} className="text-sky-550" />
                    <span><strong>Staff Verification</strong>: admin@ittehadnews.com</span>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 text-right">
              <button
                onClick={() => setActiveModal(null)}
                className="px-4 py-1.5 bg-slate-900 text-white dark:bg-sky-500 rounded text-2xs font-bold cursor-pointer"
              >
                Close Window
              </button>
            </div>

          </div>
        </div>
      )}
    </footer>
  );
}
