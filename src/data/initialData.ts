import { NewsArticle, NewsCategory, YouTubeVideo, ArticleComment, PortalSettings, UserAccount } from '../types';

export const INITIAL_CATEGORIES: NewsCategory[] = [
  { id: 'all', nameEN: 'Home', nameUR: 'ہوم', nameKN: 'ಮುಖಪುಟ', icon: 'Home' },
  { id: 'breaking', nameEN: 'Breaking News', nameUR: 'اہم خبریں', nameKN: 'ಬ್ರೇಕಿಂಗ್ ನ್ಯೂಸ್', icon: 'Zap' },
  { id: 'politics', nameEN: 'Politics', nameUR: 'سیاست', nameKN: 'ರಾಜಕೀಯ', icon: 'FileText' },
  { id: 'crime', nameEN: 'Crime', nameUR: 'جرائم', nameKN: 'ಅಪರಾಧ', icon: 'ShieldAlert' },
  { id: 'education', nameEN: 'Education', nameUR: 'تعلیم', nameKN: 'ಶಿಕ್ಷಣ', icon: 'GraduationCap' },
  { id: 'technology', nameEN: 'Technology', nameUR: 'ٹیکنالوجی', nameKN: 'ತಂತ್ರಜ್ಞಾನ', icon: 'Cpu' },
  { id: 'business', nameEN: 'Business', nameUR: 'تجارت', nameKN: 'ವ್ಯವಹಾರ', icon: 'TrendingUp' },
  { id: 'sports', nameEN: 'Sports', nameUR: 'کھیل', nameKN: 'ಕ್ರೀಡೆ', icon: 'Trophy' },
  { id: 'health', nameEN: 'Health', nameUR: 'صحت', nameKN: 'ಆರೋಗ್ಯ', icon: 'HeartPulse' },
  { id: 'entertainment', nameEN: 'Entertainment', nameUR: 'تفریح', nameKN: 'ಮನರಂಜನೆ', icon: 'Clapperboard' },
  { id: 'local', nameEN: 'Local News', nameUR: 'مقامی خبریں', nameKN: 'ಸ್ಥಳೀಯ ಸುದ್ದಿ', icon: 'MapPin' },
  { id: 'karnataka', nameEN: 'Karnataka', nameUR: 'کرناٹک', nameKN: 'ಕರ್ನಾಟಕ', icon: 'Map' },
  { id: 'bengaluru', nameEN: 'Bengaluru', nameUR: 'بنگلور', nameKN: 'ಬೆಂಗಳೂರು', icon: 'Building' },
  { id: 'belagavi', nameEN: 'Belagavi', nameUR: 'بیلگاوی', nameKN: 'ಬೆಳಗಾವಿ', icon: 'MapPin' },
  { id: 'davangere', nameEN: 'Davangere', nameUR: 'داونگیرے', nameKN: 'ದಾವಣಗೆರೆ', icon: 'MapPin' },
  { id: 'vijayapura', nameEN: 'Vijayapura', nameUR: 'وجیاپورہ', nameKN: 'ವಿಜಯಪುರ', icon: 'MapPin' },
  { id: 'hubballi', nameEN: 'Hubballi', nameUR: 'ہبلی', nameKN: 'ಹುಬ್ಬಳ್ಳಿ', icon: 'Navigation' },
  { id: 'dharwad', nameEN: 'Dharwad', nameUR: 'دھارواڑ', nameKN: 'ಧಾರವಾಡ', icon: 'Navigation' },
  { id: 'national', nameEN: 'National', nameUR: 'قومی', nameKN: 'ರಾಷ್ಟ್ರೀಯ', icon: 'Globe' },
  { id: 'international', nameEN: 'International', nameUR: 'عالمی', nameKN: 'ಅಂತರರಾಷ್ಟ್ರೀಯ', icon: 'Compass' }
];

export const INITIAL_ARTICLES: NewsArticle[] = [
  // --- ENGLISH ARTICLES ---
  {
    id: 'en-f1',
    title: 'Bengaluru Metrorail Expansion: Double-Decker Flyover Ready for Testing',
    summary: 'The upcoming metro phase will see South India’s first major double-decker flyover routing road and rail travel together.',
    content: 'Bengaluru is set to achieve another milestone in urban transportation infrastructure. The Metro Rail Transit System (BMRCL) has completed construction on the critical double-decker flyover linking Ragigudda to Silk Board. \n\nTransit experts suggest this will reduce the average commute time along this notoriously congested corridor by nearly 35 minutes. Pre-commissioning safety trials of the rolling stock are scheduled to commence late this week under strict inspection of the Commissioner of Metro Rail Safety (CMRS). \n\nThe concept, utilizing composite steel spans and specialized cantilever piers, represents the cutting edge of cost-optimized, space-saving metro architecture within highly saturated urban landscapes.',
    image: 'https://images.unsplash.com/photo-1541414779316-956a5084c0d4?auto=format&fit=crop&q=80&w=800',
    category: 'bengaluru',
    language: 'en',
    date: '2026-06-11',
    time: '09:00 AM',
    author: 'Aftab Ahmed',
    authorRole: 'Admin',
    views: 1420,
    likes: 312,
    featured: true,
    breaking: true,
    status: 'published'
  },
  {
    id: 'en-2',
    title: 'Karnataka Budget Highlights: Primary Education Infrastructure Gets 18% Funding Boost',
    summary: 'The state cabinet has sanctioned an augmented credit facility targeting rural schools, smart libraries, and lab equipment.',
    content: 'The Karnataka State Legislature announced its financial allocations for the upcoming fiscal cycle, presenting custom investment packages targeting tier-2 and tier-3 education frameworks. \n\nMinister for Primary and Secondary Education highlighted that over 1,200 schools in Dharwad, Belagavi, and Vijayapura districts will receive smart classroom upgrades, clean water installations, and standard science laboratory equipment. \n\n"Our core goal is bridging the digital disparity between urban elite institutions and community classrooms," the Minister stated during the press assembly in Vidhana Soudha, Bengaluru.',
    image: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&q=80&w=800',
    category: 'education',
    language: 'en',
    date: '2026-06-10',
    time: '04:30 PM',
    author: 'Sunil Kumar',
    authorRole: 'Editor',
    views: 890,
    likes: 124,
    featured: false,
    breaking: false,
    status: 'published'
  },
  {
    id: 'en-3',
    title: 'Hubballi-Dharwad Tech Conclave Welcomes Global Investors',
    summary: 'Over 50 tech enterprises set up incubation hubs and state-of-the-art developer centers in Hubballi.',
    content: 'The twin cities of Hubballi and Dharwad are rising as Karnataka\'s next premier technological powerhouse. The annual Tech Conclave concluded yesterday with memorandums of understanding (MoUs) signed with massive multi-national development firms.\n\n"With high-speed digital trunk routing, reliable energy networks, and high-quality computer science graduates from local technical colleges, Hubballi-Dharwad is poised for rapid advancement," remarked the Secretary of the IT-BT Council of Karnataka.',
    image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&q=80&w=800',
    category: 'technology',
    language: 'en',
    date: '2026-06-10',
    time: '11:15 AM',
    author: 'Ravi Belagere',
    authorRole: 'Reporter',
    views: 651,
    likes: 98,
    featured: false,
    breaking: false,
    status: 'published'
  },
  {
    id: 'en-4',
    title: 'Global Markets Rebound as Trade Corridors Normalize',
    summary: 'Indices across Bengaluru and international exchanges mark positive rally as export barriers soften.',
    content: 'Global stock markets experienced a robust recovery today. Key IT exports from India, particularly those from software development firms situated in Bengaluru, recorded a 2.4% day-over-day increase.\n\nAutomotive manufacturing components coming from Karnataka hubs showed resilient growth signals, supported by relaxed regional logistics duties and stable maritime transit agreements.',
    image: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&q=80&w=800',
    category: 'business',
    language: 'en',
    date: '2026-06-09',
    time: '10:00 AM',
    author: 'Sunil Kumar',
    authorRole: 'Editor',
    views: 432,
    likes: 47,
    featured: false,
    breaking: false,
    status: 'published'
  },

  // --- URDU ARTICLES ---
  {
    id: 'ur-f1',
    title: 'کرناٹک اسمبلی انتخابات: تمام سیاسی جماعتوں نے انتخابی مہم تیز کر دی',
    summary: 'بنگلور، ہبلی اور بیلگاوی میں جلسوں کا انعقاد۔ لیڈران ووٹروں کو راغب کرنے میں مصروف۔',
    content: 'کرناٹک میں سیاسی گہما گہمی عروج پر پہنچ گئی ہے۔ ریاست کے اہم شہروں بنگلور، ہبلی، دھارواڑ اور بیلگاوی میں تمام بڑی سیاسی جماعتوں نے اپنی انتخابی سرگرمیاں تیز کر دی ہیں۔\n\n وزیر اعظم اور اپوزیشن رہنماؤں نے رائے دہندگان سے وعدے کیے۔ عوام کے اہم مسائل جن میں نوجوانوں کے لیے روزگار، زرعی ترقی، اور دیہی علاقوں میں پینے کے پانی کی سپلائی شامل ہیں، بحث کا مرکز بنے ہوئے ہیں۔\n\nانتخابی دنگل میں کامیابی کے لیے سوشل میڈیا اور روایتی انتخابی ریلیوں کا بھرپور استعمال کیا جا رہا ہے۔ سیاسی مبصرین کے مطابق اس بار مقابلہ انتہائی دلچسپ اور سخت ہونے کا امکان ہے۔',
    image: 'https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?auto=format&fit=crop&q=80&w=800',
    category: 'politics',
    language: 'ur',
    date: '2026-06-11',
    time: '08:45 AM',
    author: 'قاضی الطاف رحمان',
    authorRole: 'Admin',
    views: 1845,
    likes: 456,
    featured: true,
    breaking: true,
    status: 'published'
  },
  {
    id: 'ur-2',
    title: 'بیلگاوی کسان کنونشن: زرعی اصلاحات اور کسانوں کے مطالبات پر توجہ',
    summary: 'سرحدی اضلاع کے ہزاروں کاشتکاروں نے کنونشن میں شرکت کی۔ حکومت سے پانی اور بجلی کی بلا تعطل فراہمی کا مطالبہ۔',
    content: 'ضلع بیلگاوی میں کسانوں کا ایک عظیم الشان تاریخی کنونشن منعقد ہوا۔ کسان رہنماؤں نے گنے کی قیمتوں میں اضافے اور فصلوں کے بیمہ اسکیم کو مزید آسان بنانے پر زور دیا۔\n\nکنونشن میں قرارداد منظور کی گئی کہ سرحدی علاقوں میں آبپاشی کے منصوبوں کو فوری مکمل کیا جائے تاکہ فصلیں بروقت سیراب ہو سکیں۔ حکومت کے اعلیٰ نمائندوں نے کسان وفد سے ملاقات کی اور یقین دلایا کہ ان کے مطالبات ہمدردی کے ساتھ تسلیم کیے جائیں گے۔',
    image: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&q=80&w=800',
    category: 'belagavi',
    language: 'ur',
    date: '2026-06-10',
    time: '12:15 PM',
    author: 'امتیاز صدیقی',
    authorRole: 'Reporter',
    views: 932,
    likes: 198,
    featured: false,
    breaking: false,
    status: 'published'
  },
  {
    id: 'ur-3',
    title: 'بنگلور میں جدید صحت مرکز کا افتتاح: عوام کو رعایتی علاج میسر ہوگا',
    summary: 'وزیر موصوف نے ہیلتھ کیئر بینوولینٹ سینٹر کا سنگ بنیاد رکھا۔ جدید ٹیسٹ اور علاج کی سہولت۔',
    content: 'شہر بنگلور کے غریب اور متوسط طبقے کے لیے ایک خوش آئند خبر ہے۔ ایک نیا کثیر سطحی اسپتال اور صحت مرکز قائم کیا گیا ہے جہاں انتہائی کم فیس میں ماہر ڈاکٹروں کی خدمات حاصل ہوں گی۔\n\nاس مرکز میں امراض قلب، شعبہ اطفال، اور ایمرجنسی خدمات کے لیے جدید ترین آلات نصب کیے گئے ہیں۔ چیئرمین نے بتایا کہ مستحق خاندانوں کے لیے ادویات بالکل مفت فراہم کرنے کا بھی انتظام کیا جائے گا۔',
    image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=800',
    category: 'health',
    language: 'ur',
    date: '2026-06-09',
    time: '06:00 PM',
    author: 'قاضی الطاف رحمان',
    authorRole: 'Admin',
    views: 755,
    likes: 110,
    featured: false,
    breaking: false,
    status: 'published'
  },

  // --- KANNADA ARTICLES ---
  {
    id: 'kn-f1',
    title: 'ಬೆಂಗಳೂರು-ಮೈಸೂರು ಎಕ್ಸ್‌ಪ್ರೆಸ್‌ವೇನಲ್ಲಿ ನೂತನ ಮೇಲ್ಸೇತುವೆ ನಿರ್ಮಾಣ ಕಾರ್ಯಕ್ಕೆ ಚಾಲನೆ',
    summary: 'ಸಂಚಾರ ದಟ್ಟಣೆ ನಿಯಂತ್ರಿಸಲು ರಾಷ್ಟ್ರೀಯ ಹೆದ್ದಾರಿ ಪ್ರಾಧಿಕಾರದಿಂದ ಮುನ್ನೂರು ಕೋಟಿ ವೆಚ್ಚದ ಯೋಜನೆ ಘೋಷಣೆ.',
    content: 'ರಾಜಧಾನಿ ಬೆಂಗಳೂರು ನಗರದ ಅತ್ಯಂತ ಬಿಡುವಿಲ್ಲದ ಹೆದ್ದಾರಿಯಾಗಿದ್ದ ಬೆಂಗಳೂರು-ಮೈಸೂರು ರಸ್ತೆಯಲ್ಲಿ ಮತ್ತಷ್ಟು ಸಂಚಾರ ಸುರಕ್ಷತೆ ಒದಗಿಸಲು ಹೈವೇ ನಿಯಂತ್ರಣ ಪ್ರಾಧಿಕಾರ ಮುಂದಾಗಿದೆ.\n\nವಿಶೇಷವಾಗಿ ರಾಮನಗರ ಸಮೀಪ ನೂತನವಾಗಿ ಬೃಹತ್ ಆರ್ಚ್ ರೇಡಿಯಲ್ ಫ್ಲೈಓವರ್ ನಿರ್ಮಿಸಲು ಯೋಜನಾ ನಕಾಶೆ ತಯಾರಾಗಿದೆ. ಇದರಿಂದ ಕೈಗಾರಿಕಾ ವಾಹನಗಳು ನಗರದ ಜನನಿಬಿಡ ವಸತಿ ಪ್ರದೇಶಗಳಿಗೆ ತೊಂದರೆಯಾಗದಂತೆ ನೇರವಾಗಿ ಹೊರವಲಯ ಸಂಪರ್ಕಿಸಬಹುದಾಗಿದೆ. \n\nಮುಂದಿನ ಎರಡು ವರ್ಷಗಳಲ್ಲಿ ಈ ಪ್ರಾಜೆಕ್ಟ್ ಲೋಕಾರ್ಪಣೆಯಾಗಲಿದ್ದು, ವಾಹನ ಸವಾರರಿಗೆ ಇಂಧನ ಹಾಗೂ ಸಮಯದ ಉಳಿತಾಯವಾಗಲಿದೆ ಎಂದು ಇಲಾಖಾ ಪ್ರಕಟಣೆ ತಿಳಿಸಿದೆ.',
    image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=800',
    category: 'karnataka',
    language: 'kn',
    date: '2026-06-11',
    time: '08:15 AM',
    author: 'ಅಭಿಲಾಷ್ ಗೌಡ',
    authorRole: 'Reporter',
    views: 1980,
    likes: 671,
    featured: true,
    breaking: true,
    status: 'published'
  },
  {
    id: 'kn-2',
    title: 'ವಿಜಯಪುರದಲ್ಲಿ ಸುಪ್ರಸಿದ್ಧ ಗೋಲ್ ಗುಂಬಜ್ ಸಾಂಸ್ಕೃತಿಕ ಉತ್ಸವಕ್ಕೆ ಭರ್ಜರಿ ಸಿದ್ಧತೆ',
    summary: 'ಐತಿಹಾಸಿಕ ಭವ್ಯ ತಾಣದಲ್ಲಿ ಕಲೆ ಮತ್ತು ಸಾಹಿತ್ಯ ಪ್ರೇಮಿಗಳ ಪ್ರಮುಖ ಸಮ್ಮೇಳನ ನಾಳೆಯಿಂದ ಪ್ರಾರಂಭ.',
    content: 'ವಿಜಯಪುರದ ಐತಿಹಾಸಿಕ ಹೆಮ್ಮೆಯಾಗಿರುವ ಗೋಲ್ ಗುಂಬಜ್ ಆವರಣದಲ್ಲಿ ನಾಳೆಯಿಂದ ಜಂಟಿ ಸಾಂಸ್ಕೃತಿಕ ಉತ್ಸವ ಆರಂಭಗೊಳ್ಳಲಿದೆ. ಪ್ರವಾಸೋದ್ಯಮ ಇಲಾಖೆ ಹಾಗೂ ಕನ್ನಡ ಮತ್ತು ಸಂಸ್ಕೃತಿ ಇಲಾಖೆಯ ಸಹಯೋಗದಲ್ಲಿ ಈ ಕಾರ್ಯಕ್ರಮ ಮೂರು ದಿನಗಳ ಕಾಲ ಆಯೋಜಿಸಲಾಗಿದೆ.\n\nಇಡೀ ಗೋಲಗುಂಬಜ್ ಪ್ರಧಾನ ಕಟ್ಟಡಕ್ಕೆ ವರ್ಣರಂಜಿತ ಲೇಸರ್ ಬೆಳಕಿನ ಅಲಂಕಾರ ಮಾಡಲಾಗಿದ್ದು, ಶಾಸ್ತ್ರೀಯ ನೃತ್ಯ, ಸುಗಮ ಸಂಗೀತ ಮತ್ತು ಸೂಫಿ ಗಾಯನ ವೈವಿಧ್ಯಗಳು ಪ್ರೇಕ್ಷಕರನ್ನು ಮಂತ್ರಮುಗ್ಧಗೊಳಿಸಲಿವೆ.\n\nಸಮ್ಮೇಳನದಲ್ಲಿ ಕರ್ನಾಟಕದ ವಿವಿಧೆಡೆಗಳಿಂದ ನೂರಾರು ಕುಶಲಕರ್ಮಿಗಳು ಗೃಹ ಕೈಗಾರಿಕಾ ಉತ್ಪಾದನೆಗಳ ಮಳಿಗೆಗಳನ್ನು ತೆರೆದು ಪ್ರದರ್ಶನ ನೀಡಲಿದ್ದಾರೆ.',
    image: 'https://images.unsplash.com/photo-1623492701902-e7fc22e82022?auto=format&fit=crop&q=80&w=800',
    category: 'vijayapura',
    language: 'kn',
    date: '2026-06-10',
    time: '02:00 PM',
    author: 'ಪ್ರವೀಣ್ ಹಾವೇರಿ',
    authorRole: 'Editor',
    views: 1120,
    likes: 245,
    featured: false,
    breaking: false,
    status: 'published'
  },
  {
    id: 'kn-3',
    title: 'ಕ್ರೀಡಾ ಲೋಕ: ರಾಷ್ಟ್ರೀಯ ಅಥ್ಲೆಟಿಕ್ಸ್‌ ಕ್ರೀಡಾಕೂಟಕ್ಕೆ ಬೆಳಗಾವಿಯ ಕ್ರೀಡಾಪಟುಗಳ ಆಯ್ಕೆ',
    summary: 'ರಾಜ್ಯ ತಂಡದ ಪರವಾಗಿ ಮಿಂಚಲು ಬೆಳಗಾವಿಯ ಐದು ಕ್ರೀಡಾತಾರೆಗಳು ಅತ್ಯುತ್ತಮ ಸಾಧನೆಯೊಂದಿಗೆ ಸಿದ್ಧತೆ.',
    content: 'ಬೆಳಗಾವಿ ಜಿಲ್ಲೆಯ ಕ್ರೀಡಾ ವಿಕಾಸ ಮಂಡಳಿ ನಡೆಸಿದ ಅತ್ಯಂತ ಆಕರ್ಷಕ ಅಥ್ಲೆಟಿಕ್ಸ್ ಕೂಟದಲ್ಲಿ ವಿಶಿಷ್ಟ ದಾಖಲೆ ಬರೆದ ಐವರು ತರುಣರು ಮುಂಬರುವ ರಾಷ್ಟ್ರೀಯ ಕ್ರೀಡಾಕೂಟಕ್ಕೆ ಅಧಿಕೃತವಾಗಿ ಸ್ಥಾನ ಪಡೆದಿದ್ದಾರೆ.\n\n೧೦೦ ಮೀಟರ್ ಧಾವನ ಹಾಗೂ ಲಾಂಗ್ ಜಂಪ್ ವಿಭಾಗದಲ್ಲಿ ಸುಪ್ರೀತ್ ಹಿರೇಮಠ ಮತ್ತು ತಂಡವು ಚಿನ್ನದ ಪದಕ ಪಡೆದುಕೊಂಡಿದ್ದಾರೆ. ಜಿಲ್ಲಾ ಕ್ರೀಡಾಧಿಕಾರಿಗಳು ಈ ಕ್ರೀಡಾಪಟುಗಳಿಗೆ ಉಚಿತ ತರಬೇತಿ ಹಾಗೂ ನೆರವು ನೀಡುವುದಾಗಿ ಧೃಡಪಡಿಸಿದ್ದಾರೆ.',
    image: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&q=80&w=800',
    category: 'sports',
    language: 'kn',
    date: '2026-06-09',
    time: '11:00 AM',
    author: 'ಪ್ರವೀಣ್ ಹಾವೇರಿ',
    authorRole: 'Editor',
    views: 864,
    likes: 153,
    featured: false,
    breaking: false,
    status: 'published'
  }
];

export const INITIAL_VIDEOS: YouTubeVideo[] = [
  {
    id: 'vid-1',
    title: 'Bengaluru Smart City Roads Infrastructure Projects Inspection Live',
    description: 'A detailed walking report on the current status of arterial roads in Bengaluru central business district.',
    youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    youtubeId: 'dQw4w9WgXcQ',
    category: 'bengaluru',
    date: '2026-06-11'
  },
  {
    id: 'vid-2',
    title: 'Karnataka Tourism Heritage Exploration: Splendors of Hampi and Vijayapura',
    description: 'An educational documentary capturing the architectural brilliance and complex engineering of monument structures.',
    youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    youtubeId: 'dQw4w9WgXcQ',
    category: 'karnataka',
    date: '2026-06-10'
  }
];

export const INITIAL_COMMENTS: ArticleComment[] = [
  {
    id: 'c-1',
    articleId: 'en-f1',
    name: 'Mohammad Yusuf',
    email: 'yusuf@bengalurumail.com',
    content: 'This double-decker flyover will indeed save so much transit stress at the Silk Board junction. Kudos to the workers for executing this complex infrastructure project!',
    date: '2026-06-11 10:15 AM',
    approved: true
  },
  {
    id: 'c-2',
    articleId: 'ur-f1',
    name: 'ساجد فاروق',
    email: 'sajid@email.com',
    content: 'انتخابات میں امید ہے کہ اس مرتبہ عام مسائل پر زیادہ توجہ دی جائے گی اور تعلیمی نظام بہتر بنانے کے لیے عملی اقدامات کئے جائیں گے۔',
    date: '2026-06-11 11:20 AM',
    approved: true
  }
];

export const DEFAULT_SETTINGS: PortalSettings = {
  websiteName: 'Waqt Ki Awaz',
  contactEmail: 'contact@wka.com',
  aboutText: 'Ittehad News is a modern multilingual, cross-platform news portal committed to high-fidelity reporting, unbiased analysis, and seamless visual storytelling. Delivering real-time regional bulletins from Karnataka (Bengaluru, Belagavi, Davangere, Vijayapura, Hubballi-Dharwad), alongside national and global news in English, Urdu, and Kannada.',
  googleAdSenseCode: 'ca-pub-1234567890123456',
  googleAnalyticsId: 'G-XXXXXXXXXX',
  isAdSenseActive: true,
  isAnalyticsActive: true,
  isPushNotificationSetup: true
};

export const INSTALLED_ACCOUNTS: UserAccount[] = [
  {
    email: 'aftab2012ka@gmail.com',
    name: 'Aftab Ahmed (Owner)',
    role: 'Admin'
  },
  {
    email: 'admin@ittehad.com',
    name: 'Chief Admin',
    role: 'Admin'
  },
  {
    email: 'editor@ittehad.com',
    name: 'Kshitij Gowda',
    role: 'Editor'
  },
  {
    email: 'reporter@ittehad.com',
    name: 'Zameer Alam',
    role: 'Reporter'
  }
];
