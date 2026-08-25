import React, { useState, useEffect, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';

// Supabase Cloud Configuration
const SUPABASE_URL = 'https://qrdgructcnphiyosakgb.supabase.co';
const SUPABASE_KEY = 'sb_publishable_Ov14SZJ4k0-4UeqQNEQ6CQ_N4da5ABY';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const WAZE_SVG = (
  <svg viewBox="0 0 512 512" width="18" height="18" xmlns="http://www.w3.org/2000/svg">
    <rect width="512" height="512" rx="110" fill="#33ccff"/>
    <path d="M375.4 233.5c-3.7-31.8-29.3-56.7-61.6-59.5-35.3-3.1-66.5 19.3-73.8 53.6-1.5 7-1.4 14.3.4 21.2-22.1 4.7-38.6 24.1-38.6 47.3 0 17.5 9.7 32.7 24.1 40.5l-10.7 33.3c-2.4 7.4 2.8 15 10.6 15 3.3 0 6.4-1.4 8.6-3.8l21.9-23.7c13.7 4.9 28.7 7.5 44.1 7.5 70.7 0 128-50.5 128-112.7 0-11.8-1.8-23.3-5.2-34.4zm-146 5.3c0-11 9-20 20-20s20 9 20 20-9 20-20 20-20-9-20-20zm112 40c-11 0-20-9-20-20s9-20 20-20 20 9 20 20-9 20-20 20zm-56 22c-29.8 0-54-15.6-54-35 0-3.3 2.7-6 6-6h96c3.3 0 6 2.7 6 6 0 19.4-24.2 35-54 35z" fill="#fff"/>
    <path d="M220.5 240c-1.2 5.5-6.2 9.5-12 9.5s-10.8-4-12-9.5-2.8-12.7-14.2-22-27.5-22-15.5 0-28 12.5-28 28s12.5 28 28 28c4.4 0 8 3.6 8 8s-3.6 8-8 8c-24.3 0-44-19.7-44-44s19.7-44 44-44c21.2 0 39.1 14.7 43.5 34.5z" fill="#18181b"/>
    <circle cx="178" cy="246" r="10" fill="#18181b"/>
    <circle cx="282" cy="216" r="10" fill="#18181b"/>
    <circle cx="338" cy="216" r="10" fill="#18181b"/>
  </svg>
);

const MAPS_SVG = (
  <svg viewBox="0 0 512 512" width="18" height="18" xmlns="http://www.w3.org/2000/svg">
    <rect width="512" height="512" rx="110" fill="#f1f5f9"/>
    <path d="M120 392l80-160 160-80-80 160z" fill="#10b981"/>
    <path d="M200 232l152-72-72 152-80-80z" fill="#3b82f6"/>
    <circle cx="260" cy="260" r="50" fill="#fff"/>
    <polygon points="260,225 240,290 260,275 280,290" fill="#2563eb"/>
  </svg>
);

const INITIAL_TRIP_DAYS = [
  {
    date: "2026-09-30",
    label: "רביעי · 30/09",
    fullLabel: "יום רביעי · 30 בספטמבר 2026",
    title: "נחיתה והגעה למלון",
    icon: "✈️",
    challenge: "לצלם את התמונה המשפחתית הראשונה באיטליה.",
    challengeDesc: "הרגע נחתנו! המשימה שלכם: סלפי משפחתי ראשון בשדה או עם הרכב השכור החדש.",
    stops: [
      { time: "16:00", name: "נחיתה בנמל התעופה ורונה", dest: "Verona Villafranca Airport", note: "איסוף מזוודות ואיסוף הרכב השכור." },
      { time: "18:00", name: "נסיעה למלון וארוחת ערב", dest: "Bio Agriturismo Vojon, Ponti sul Mincio, Italy", note: "צ׳ק-אין, התארגנות בחדרים וארוחת ערב פיצה/פסטה משפחתית במסעדה מקומית סמוכה + גלידה ראשונה בפסקיירה.", food: { name: "🍕 פיצריה מקומית + גלידה בפסקיירה", dest: "Peschiera del Garda, Italy" } }
    ]
  },
  {
    date: "2026-10-01",
    label: "חמישי · 01/10",
    fullLabel: "יום חמישי · 01 באוקטובר 2026",
    title: "Gardaland – יום פארק מלא",
    icon: "🎢",
    challenge: "לבחור יחד את שלושת המתקנים הכי אקסטרימיים של היום!",
    challengeDesc: "צלמו תמונה צועקים על אחד המתקנים, וכתבו מי צעק הכי חזק ברכבת הרים.",
    stops: [
      { time: "08:30", name: "יציאה מהמלון ל-Gardaland", dest: "Gardaland Resort, Via Derna 4, Castelnuovo del Garda", note: "לצאת מוקדם ולהגיע בנחת לפני פתיחת השערים." },
      { time: "09:00", name: "חניה וכניסה ל-Gardaland", dest: "Gardaland Parking, Castelnuovo del Garda", note: "מומלץ לשמור את מיקום הרכב בחניה כדי לחזור אליו בקלות בסוף היום." },
      { time: "13:00", name: "ארוחת צהריים בפארק", dest: "Gardaland Resort", note: "אוכל מהיר, פיצות והמבורגרים בתוך הפארק.", food: { name: "🍔 Aladino Pizza & Burger (בתוך הפארק)", dest: "Gardaland Resort" } },
      { time: "19:00", name: "ארוחת ערב", dest: "Osteria Sottoportego, Peschiera del Garda", note: "פסטות מעולות ואווירה על המים בפסקיירה דל גארדה.", food: { name: "🍝 Osteria Sottoportego", dest: "Osteria Sottoportego, Peschiera del Garda" } }
    ]
  },
  {
    date: "2026-10-02",
    label: "שישי · 02/10",
    fullLabel: "יום שישי · 02 באוקטובר 2026",
    title: "סובב אגם גארדה + ראפטינג",
    icon: "🚣",
    challenge: "לצלם תמונה משפחתית מהראפטינג ותמונה עם גלידת לימון!",
    challengeDesc: "משימת אקשן ומים! צלמו את הסירה לפני הירידה למים, וכתבו בדיחה או משפט קורע שקרה במהלך השיט.",
    stops: [
      { time: "08:00", name: "יציאה צפונה לאורך החוף המזרחי", dest: "Malcesine, Italy", note: "נסיעה נופית יפהפייה ועצירה במלצ׳סינה." },
      { time: "12:00", name: "ארוחת צהריים בלימונה", dest: "Limone sul Garda, Italy", note: "עצירה בלימונה לספוג נוף ואוכל טוב.", food: { name: "🍕 Ristorante Pizzeria La Terrazza + גלידת לימון", dest: "Limone sul Garda, Italy" } },
      { time: "14:30", name: "יציאה לראפטינג ב-Valdadige", dest: "Visit Valdadige, Via San Martino, Volargne, Italy", note: "ראפטינג משפחתי חווייתי על נהר האדיג׳ה." }
    ]
  },
  {
    date: "2026-10-03",
    label: "שבת · 03/10",
    fullLabel: "יום שבת · 03 באוקטובר 2026",
    title: "Movieland + Medieval Times",
    icon: "🎬",
    challenge: "לצלם סלפי משפחתי שנראה כמו פוסטר של סרט הוליוודי!",
    challengeDesc: "פוזה דרמטית ליד תפאורת סרט ב-Movieland או תמונה של כולם אוכלים עוף בידיים במופע האבירים.",
    stops: [
      { time: "09:00", name: "יציאה ל-Movieland", dest: "Movieland The Hollywood Park, Via Fossalta 58, Lazise", note: "יום של אקשן וחוויות קולנועיות." },
      { time: "20:00", name: "Medieval Times – מופע האבירים", dest: "Medieval Times, Via Fossalta 58, Lazise", note: "מופע ערב סוחף וארוחה שחיתות בלי סכו״ם (עם הידיים!).", food: { name: "🍗 Medieval Times (אכילה בידיים!)", dest: "Medieval Times, Via Fossalta 58, Lazise" } }
    ]
  },
  {
    date: "2026-10-04",
    label: "ראשון · 04/10",
    fullLabel: "יום ראשון · 04 באוקטובר 2026",
    title: "ונציה – יום מלא",
    icon: "🛶",
    challenge: "למצוא גשר קטן ויפה מחוץ למסלול הראשי ולספור 3 גונדולות!",
    challengeDesc: "צלמו את הגשר הכי מיוחד שמצאתם בסמטאות ונציה, וכתבו את הדבר הכי מוזר או יפה שראיתם בעיר המים.",
    stops: [
      { time: "07:30", name: "יציאה מוקדמת מהמלון לוונציה", dest: "Venezia Tronchetto Parking, Isola Nova del Tronchetto, Venezia", note: "חניית טרונקטו ומעבר בסירה/רכבת קלה למרכז." },
      { time: "12:30", name: "ארוחת צהריים בוונציה", dest: "Pizzeria L'Anfora, Venezia", note: "פיצרייה שכונתית מעולה הרחק מההמונים של סן מרקו.", food: { name: "🍕 Pizzeria L'Anfora + גלידת Suso", dest: "Calle Larga dei Bari, 1223, Venezia" } }
    ]
  },
  {
    date: "2026-10-05",
    label: "שני · 05/10",
    fullLabel: "יום שני · 05 באוקטובר 2026",
    title: "Borghetto sul Mincio + Valeggio",
    icon: "🏘️",
    challenge: "לצלם תמונת בת מצווה מיוחדת בין טחנות המים העתיקות!",
    challengeDesc: "תמונה חגיגית על הגשר של בורגטו + טעימה של הטורטליני המפורסם ('קשר האהבה').",
    stops: [
      { time: "10:00", name: "Borghetto – הכפר והטחנות", dest: "Borghetto sul Mincio, Italy", note: "טיול רגלי ציורי בין הנהר, הגשרים והטחנות." },
      { time: "12:30", name: "ארוחת צהריים – הטורטליני המפורסם", dest: "Ristorante Alla Borsa, Valeggio sul Mincio, Italy", note: "הבית המקורי של כיסוני הטורטליני המכונים 'קשר האהבה'.", food: { name: "🍝 Ristorante Alla Borsa (טורטליני מקורי)", dest: "Ristorante Alla Borsa, Valeggio sul Mincio, Italy" } }
    ]
  },
  {
    date: "2026-10-06",
    label: "שלישי · 06/10",
    fullLabel: "יום שלישי · 06 באוקטובר 2026",
    title: "ורונה + הטיסה הביתה",
    icon: "❤️",
    challenge: "לבחור יחד את רגע השיא (הטופ 1) של כל הטיול!",
    challengeDesc: "כל אחד כותב את הרגע שהוא לעולם לא ישכח מהטיול לאיטליה, ומצטלמים יחד פעם אחרונה בוורונה.",
    stops: [
      { time: "09:00", name: "צ׳ק-אאוט ויציאה לוורונה", dest: "Parcheggio Cittadella, Piazza Cittadella, Verona", note: "סיור קצר בוורונה, הארנה והמרפסת של יוליה." },
      { time: "13:00", name: "ארוחת צהריים מסכמת בוורונה", dest: "Pizzeria Saporè Downtown, Verona", note: "ארוחת פרידה מעולה מאיטליה עם פיצות גורמה ופסטות.", food: { name: "🍕 Pizzeria Saporè Downtown", dest: "Pizzeria Saporè, Verona" } },
      { time: "18:30", name: "החזרת הרכב בשדה התעופה", dest: "Verona Villafranca Airport", note: "התארגנות וטיסה חזרה הביתה." }
    ]
  }
];

const TICKET_DEFAULT_FOLDERS = ['✈️ טיסות ורכב', '🏡 מלון', '🎢 Gardaland', '🚣 ראפטינג', '🎬 Movieland', '🏰 Medieval Times', '🚤 ונציה'];

const DEFAULT_DOCUMENTS = [
  { id: 'israir-flight', folder: '✈️ טיסות ורכב', title: 'הזמנת ישראייר (4623652)', name: 'Israir Flight Booking', type: 'text/flight-info', size: 15400, created: 1000, isFlightInfo: true },
  { id: 'aig-insurance', folder: '✈️ טיסות ורכב', title: 'ביטוח נסיעות AIG (170270213826)', name: 'AIG Insurance Policy', type: 'text/insurance-info', size: 12000, created: 900, isInsuranceInfo: true },
  { id: 'ecovia-car', folder: '✈️ טיסות ורכב', title: 'שובר השכרת רכב (724715780)', name: 'Car Rental Voucher', type: 'text/car-voucher', size: 14000, created: 800, isCarVoucher: true },
  { id: 'vojon-hotel', folder: '🏡 מלון', title: 'הזמנת Bio Agriturismo Vojon', name: 'Hotel Booking Confirmation', type: 'text/hotel-info', size: 13000, created: 700, isHotelInfo: true }
];

const QUICK_PHRASES = [
  { cat: '🍕 מסעדות וקפה', he: 'חשבון בבקשה', it: 'Il conto, per favore', pro: 'אִיל קוֹנְטוֹ, פֶּר פָבוֹרֶה' },
  { cat: '🍕 מסעדות וקפה', he: 'שולחן ל-5 אנשים בבקשה', it: 'Un tavolo per cinque persone, per favore', pro: 'אוּן טָאבוֹלוֹ פֶּר צִ׳ינְקְוֶוה פֶּרְסוֹנֶה' },
  { cat: '🍕 מסעדות וקפה', he: 'בקבוק מים רגילים / מוגזים', it: 'Acqua naturale / gassata per favore', pro: 'אָקְוָוה נָטוּרָלֶה / גָאסָאטָה' },
  { cat: '🍕 מסעדות וקפה', he: 'איפה השירותים?', it: "Dov'è il bagno?", pro: 'דוֹבֶה אִיל בָּאנְיוֹ?' },
  { cat: '🍕 מסעדות וקפה', he: 'טעים מאוד!', it: 'Molto buono!', pro: 'מוֹלְטוֹ בּוּאוֹנוֹ!' },
  { cat: '🍕 מסעדות וקפה', he: 'קפה אספרסו בבקשה', it: 'Un caffè espresso, per favore', pro: 'אוּן קָאפֶה אֶסְפְּרֶסוֹ' },
  { cat: '🍦 גלידה ומתוקים', he: 'גביע של 2 טעמים', it: 'Un cono da due gusti, per favore', pro: 'אוּן קוֹנוֹ דָה דוּאֶה גוּסְטִי' },
  { cat: '🍦 גלידה ומתוקים', he: 'כוסית של 3 טעמים', it: 'Una coppetta da tre gusti', pro: 'אוּנָה קוֹפֶּטָה דָה טְרֶה גוּסְטִי' },
  { cat: '🍦 גלידה ומתוקים', he: 'אפשר לטעום?', it: 'Posso assaggiare?', pro: 'פּוֹסוֹ אַסַאגָ׳ארֶה?' },
  { cat: '🍦 גלידה ומתוקים', he: 'פיסטוק ושוקולד בבקשה', it: 'Pistacchio e cioccolato per favore', pro: 'פִּיסְטָאקְיוֹ אֶה צ׳וֹקוֹלָאטוֹ' },
  { cat: '🍦 גלידה ומתוקים', he: 'עם קצפת מעל?', it: 'Con panna sopra?', pro: 'קוֹן פָּאנָה סוֹפְּרָה?' },
  { cat: '🛒 קניות וחניה', he: 'כמה זה עולה?', it: 'Quanto costa questo?', pro: 'קְוָואנְטוֹ קוֹסְטָה קְוֶוסְטוֹ?' },
  { cat: '🛒 קניות וחניה', he: 'אפשר לשלם באשראי?', it: 'Posso pagare con la carta?', pro: 'פּוֹסוֹ פָּאגָארֶה קוֹן לָה קָארְטָה?' },
  { cat: '🛒 קניות וחניה', he: 'איפה המדחן?', it: 'Dov’è il parcometro?', pro: 'דוֹבֶה אִיל פָּארְקוֹמֶטְרוֹ?' },
  { cat: '🛒 קניות וחניה', he: 'איפה תחנת הדלק הקרובה?', it: 'Dov’è il distributore di benzina più vicino?', pro: 'דוֹבֶה אִיל דִיסְטְרִיבּוּטוֹרֶה...' },
  { cat: '👋 בסיסי ונימוס', he: 'שלום / להתראות', it: 'Ciao / Arrivederci', pro: 'צ׳או / אָרִיבֶדֶרְצִ׳י' },
  { cat: '👋 בסיסי ונימוס', he: 'בוקר טוב / ערב טוב', it: 'Buongiorno / Buonasera', pro: 'בּוּאוֹן ג׳וֹרְנוֹ / בּוּאוֹנָה סֶרָה' },
  { cat: '👋 בסיסי ונימוס', he: 'תודה רבה', it: 'Grazie mille!', pro: 'גְרָאצְיֶה מִילֶה' },
  { cat: '👋 בסיסי ונימוס', he: 'סליחה / מחילה', it: 'Scusi / Permesso', pro: 'סְקוּזִי / פֶּרְמֶסוֹ' },
  { cat: '👋 בסיסי ונימוס', he: 'אתה מדבר אנגלית?', it: 'Parla inglese?', pro: 'פַּארְלָה אִינְגְלֶזֶה?' }
];

export default function App() {
  const [tripDays, setTripDays] = useState(INITIAL_TRIP_DAYS);
  const [activeDay, setActiveDay] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [viewerItem, setViewerItem] = useState(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  const [folders, setFolders] = useState(TICKET_DEFAULT_FOLDERS);
  const [activeFolder, setActiveFolder] = useState('✈️ טיסות ורכב');
  const [ticketFiles, setTicketFiles] = useState(DEFAULT_DOCUMENTS.filter(d => d.folder === '✈️ טיסות ורכב'));
  const [showUploadBox, setShowUploadBox] = useState(false);
  const [newTicketTitle, setNewTicketTitle] = useState('');
  const [selectedUploadFolder, setSelectedUploadFolder] = useState('✈️ טיסות ורכב');

  const [galleryItems, setGalleryItems] = useState([]);
  const [galleryDayFilter, setGalleryDayFilter] = useState('all');
  const [galleryCaption, setGalleryCaption] = useState('');
  const [galleryAuthor, setGalleryAuthor] = useState('אריק');
  const [showGalleryUpload, setShowGalleryUpload] = useState(false);
  const [lightboxItem, setLightboxItem] = useState(null);

  const [completedChallenges, setCompletedChallenges] = useState({});
  const [challengeNote, setChallengeNote] = useState('');
  const [challengeAuthor, setChallengeAuthor] = useState('אריק');
  const [isAdminUnlocked, setIsAdminUnlocked] = useState(false);

  const [hebrewInput, setHebrewInput] = useState('');
  const [italianOutput, setItalianOutput] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('הכל');
  const [phraseSearch, setPhraseSearch] = useState('');
  const [translationHistory, setTranslationHistory] = useState([]);
  
  const audioContextRef = useRef(false);

  const playClickSound = () => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.04);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.04);
    } catch (e) {}
  };

  const handleGlobalClick = (callback) => {
    playClickSound();
    if (!audioContextRef.current) {
      if ('speechSynthesis' in window) {
        const silent = new SpeechSynthesisUtterance('');
        silent.volume = 0;
        window.speechSynthesis.speak(silent);
      }
      audioContextRef.current = true;
    }
    if (callback) callback();
  };

  const touchStartXRef = useRef(0);
  const touchCurrentXRef = useRef(0);

  const handleTouchStart = (e) => {
    touchStartXRef.current = e.touches[0].clientX;
    touchCurrentXRef.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchCurrentXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (onCloseCallback) => {
    const diff = touchCurrentXRef.current - touchStartXRef.current;
    if (diff > 120) {
      onCloseCallback();
    }
  };

  useEffect(() => {
    const updateOnlineStatus = async () => {
      if (!navigator.onLine) {
        setIsOnline(false);
        return;
      }
      
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000);

        const { error } = await supabase.from('trip_data').select('id').limit(1).abortSignal(controller.signal);
        clearTimeout(timeoutId);

        if (error) {
          setIsOnline(false);
        } else {
          setIsOnline(true);
        }
      } catch (err) {
        setIsOnline(false);
      }
    };

    const handleOnline = () => updateOnlineStatus();
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    updateOnlineStatus();
    const interval = setInterval(updateOnlineStatus, 3000);

    async function fetchTripDataFromCloud() {
      try {
        const { data, error } = await supabase
          .from('trip_data')
          .select('*')
          .order('id', { ascending: false })
          .limit(1);

        if (!error && data && data.length > 0 && data[0].data) {
          setTripDays(data[0].data);
          localStorage.setItem('garda-trip-days-cache', JSON.stringify(data[0].data));
          setIsOnline(true);
        } else {
          loadFromLocalCache();
        }
      } catch (err) {
        setIsOnline(false);
        loadFromLocalCache();
      }
    }

    const loadFromLocalCache = () => {
      try {
        const cached = JSON.parse(localStorage.getItem('garda-trip-days-cache'));
        if (Array.isArray(cached) && cached.length) {
          setTripDays(cached);
        }
      } catch (e) {}
    };

    fetchTripDataFromCloud();

    try {
      const savedQuests = JSON.parse(localStorage.getItem('garda-challenges-log')) || {};
      setCompletedChallenges(savedQuests);
    } catch (e) {}

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(interval);
    };
  }, []);

  const saveTripDataToCloud = async (newDays) => {
    setTripDays(newDays);
    localStorage.setItem('garda-trip-days-cache', JSON.stringify(newDays));
    try {
      await supabase
        .from('trip_data')
        .upsert({ id: 1, data: newDays });
      setIsOnline(true);
    } catch (err) {
      setIsOnline(false);
    }
  };

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('garda-ticket-folders'));
      if (Array.isArray(saved) && saved.length) setFolders(saved);
    } catch (e) {}
    initTickets();
    loadGalleryFromCloud();
  }, []);

  useEffect(() => {
    loadFiles(activeFolder);
  }, [activeFolder]);

  const openDb = () => {
    return new Promise((resolve, reject) => {
      const req = indexedDB.open('gardaTripMasterDB', 2);
      req.onupgradeneeded = () => {
        const db = req.result;
        if (!db.objectStoreNames.contains('files')) {
          const st = db.createObjectStore('files', { keyPath: 'id', autoIncrement: true });
          st.createIndex('folder', 'folder', { unique: false });
        }
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  };

  const initTickets = async () => {
    try {
      const db = await openDb();
      const tx = db.transaction('files', 'readonly');
      const req = tx.objectStore('files').getAll();
      req.onsuccess = async () => {
        const all = req.result || [];
        const writeTx = db.transaction('files', 'readwrite');
        const store = writeTx.objectStore('files');
        
        DEFAULT_DOCUMENTS.forEach(doc => {
          if (!all.some(f => f.title === doc.title || (doc.isFlightInfo && f.isFlightInfo) || (doc.isInsuranceInfo && f.isInsuranceInfo) || (doc.isCarVoucher && f.isCarVoucher) || (doc.isHotelInfo && f.isHotelInfo))) {
            store.add(doc);
          }
        });
        writeTx.oncomplete = () => loadFiles(activeFolder);
      };
    } catch (e) {
      console.log('IndexedDB init fallback');
    }
  };

  const loadFiles = async (folder) => {
    try {
      const db = await openDb();
      const tx = db.transaction('files', 'readonly');
      const req = tx.objectStore('files').index('folder').getAll(folder);
      req.onsuccess = () => {
        const dbFiles = req.result || [];
        const defaultsForFolder = DEFAULT_DOCUMENTS.filter(d => d.folder === folder);
        
        const merged = [...dbFiles];
        defaultsForFolder.forEach(def => {
          if (!merged.some(m => m.title === def.title)) {
            merged.push(def);
          }
        });
        setTicketFiles(merged.sort((a, b) => (b.created || 0) - (a.created || 0)));
      };
      req.onerror = () => {
        setTicketFiles(DEFAULT_DOCUMENTS.filter(d => d.folder === folder));
      };
    } catch (e) {
      setTicketFiles(DEFAULT_DOCUMENTS.filter(d => d.folder === folder));
    }
  };

  const loadGalleryFromCloud = async () => {
    try {
      const { data, error } = await supabase
        .from('gallery')
        .select('*')
        .order('created', { ascending: false });

      if (!error && data) {
        setGalleryItems(data);
      }
    } catch (e) {
      console.log('Cloud gallery load error, fallback to local');
    }
  };

  const handleFileUpload = async (e) => {
    const files = [...e.target.files];
    if (!files.length) return;
    const db = await openDb();
    const tx = db.transaction('files', 'readwrite');
    const store = tx.objectStore('files');
    files.forEach(file => {
      store.add({
        folder: selectedUploadFolder || activeFolder,
        title: newTicketTitle || file.name,
        name: file.name,
        type: file.type,
        size: file.size,
        created: Date.now(),
        blob: file
      });
    });
    tx.oncomplete = () => {
      setNewTicketTitle('');
      setShowUploadBox(false);
      loadFiles(activeFolder);
    };
  };

  const saveDailyChallenge = async (photoFile = null) => {
    const dayKey = String(activeDay);
    const updated = {
      ...completedChallenges,
      [dayKey]: {
        completed: true,
        text: challengeNote || 'אתגר הושלם בהצלחה! 🎉',
        author: challengeAuthor || 'משפחה',
        time: new Date().toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' }),
        date: tripDays[activeDay]?.date
      }
    };
    setCompletedChallenges(updated);
    localStorage.setItem('garda-challenges-log', JSON.stringify(updated));

    if (photoFile) {
      try {
        const filePath = `challenge_${Date.now()}_${photoFile.name}`;
        await supabase.storage.from('trip-photos').upload(filePath, photoFile);
        const { data: publicUrlData } = supabase.storage.from('trip-photos').getPublicUrl(filePath);

        await supabase.from('gallery').insert([{
          name: `אתגר: ${tripDays[activeDay]?.title}`,
          type: photoFile.type,
          size: photoFile.size,
          day_index: activeDay,
          caption: `🎯 אתגר היום: ${challengeNote || tripDays[activeDay]?.challenge}`,
          author: challengeAuthor || 'משפחה',
          created: Date.now(),
          media_url: publicUrlData.publicUrl
        }]);
        loadGalleryFromCloud();
      } catch (e) {}
    }

    setChallengeNote('');
    alert('🏆 כל הכבוד! האתגר בוצע ונשמר ביומן האתגרים המשפחתי!');
    setModalType(null);
  };

  const resetSingleChallenge = (dayIdx) => {
    if (!window.confirm(`לאפס את האתגר של ${tripDays[dayIdx]?.label} ולהחזיר למצב לא מבוצע?`)) return;
    const updated = { ...completedChallenges };
    delete updated[String(dayIdx)];
    setCompletedChallenges(updated);
    localStorage.setItem('garda-challenges-log', JSON.stringify(updated));
    if (modalType === 'questModal') setModalType(null);
  };

  const deleteFile = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm('למחוק כרטיס זה לצמיתות?')) return;
    try {
      const db = await openDb();
      const tx = db.transaction('files', 'readwrite');
      tx.objectStore('files').delete(id);
      tx.oncomplete = () => loadFiles(activeFolder);
    } catch (err) {
      setTicketFiles(prev => prev.filter(f => f.id !== id));
    }
  };

  const addNewFolder = () => {
    const name = window.prompt('שם התקייה החדשה:');
    if (!name || !name.trim()) return;
    const clean = '📁 ' + name.trim();
    if (!folders.includes(clean)) {
      const updated = [...folders, clean];
      setFolders(updated);
      localStorage.setItem('garda-ticket-folders', JSON.stringify(updated));
      setActiveFolder(clean);
    }
  };

  const speakItalian = (text) => {
    if (!text || !text.trim()) return;
    playClickSound();
    setIsPlayingAudio(true);

    try {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        
        const utterance = new SpeechSynthesisUtterance(text.trim());
        utterance.lang = 'it-IT';
        utterance.rate = 0.85;

        const voices = window.speechSynthesis.getVoices();
        const itVoice = voices.find(v => v.lang && (v.lang.includes('it') || v.lang.includes('IT')));
        if (itVoice) utterance.voice = itVoice;

        utterance.onend = () => setIsPlayingAudio(false);
        utterance.onerror = () => setIsPlayingAudio(false);

        window.speechSynthesis.speak(utterance);
      } else {
        setIsPlayingAudio(false);
      }
    } catch (e) {
      setIsPlayingAudio(false);
    }
  };

  const translateText = async (textToTranslate) => {
    const query = (textToTranslate || hebrewInput || '').trim();
    if (!query) return;

    setIsTranslating(true);
    setHebrewInput(query);

    const finishTranslation = (italianText) => {
      setItalianOutput(italianText);
      setTranslationHistory(prev => [{ he: query, it: italianText, id: Date.now() }, ...prev.slice(0, 5)]);
      setIsTranslating(false);
    };

    const matched = QUICK_PHRASES.find(p => query.includes(p.he) || p.he.includes(query));
    if (matched) {
      finishTranslation(matched.it);
      return;
    }

    try {
      const res = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=iw&tl=it&dt=t&q=${encodeURIComponent(query)}`);
      const data = await res.json();
      if (data && data[0] && data[0][0] && data[0][0][0]) {
        finishTranslation(data[0][0][0]);
      } else {
        fallbackTranslate(query, finishTranslation);
      }
    } catch (err) {
      fallbackTranslate(query, finishTranslation);
    }
  };

  const fallbackTranslate = async (query, callback) => {
    try {
      const res2 = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(query)}&langpair=he|it`);
      const data2 = await res2.json();
      if (data2 && data2.responseData && data2.responseData.translatedText) {
        callback(data2.responseData.translatedText);
      } else {
        callback('שגיאה בתרגום');
      }
    } catch (e) {
      callback('זמין במצב מקוון');
    }
  };

  const day = tripDays[activeDay] || tripDays[0];
  const isCurrentDayCompleted = completedChallenges[String(activeDay)]?.completed;

  const filteredPhrases = QUICK_PHRASES.filter(p => {
    const matchesCategory = selectedCategory === 'הכל' || p.cat === selectedCategory;
    const cleanSearch = phraseSearch.trim().toLowerCase();
    if (!cleanSearch) return matchesCategory;
    
    const matchesText = p.he.toLowerCase().includes(cleanSearch) || 
                        p.it.toLowerCase().includes(cleanSearch) || 
                        p.pro.toLowerCase().includes(cleanSearch);
    return matchesCategory && matchesText;
  });

  const bgMain = '#ffffff';
  const cardBg = '#ffffff';
  const textColor = '#000000';
  const textSub = '#4b5563';
  const borderColor = '#e5e7eb';
  const cardShadow = '0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05)';
  const yellowBtnBg = '#fef08a';
  const yellowBtnText = '#000000';

  return (
    <div style={{ background: bgMain, minHeight: '100vh', width: '100vw', maxWidth: '100vw', overflowX: 'hidden', fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, sans-serif', color: textColor, direction: 'rtl', paddingBottom: '40px', boxSizing: 'border-box', position: 'relative' }}>
      
      {/* 🍏 Dark Metallic & Extra Wide Apple Silver Bar */}
      <div style={{
        background: 'linear-gradient(135deg, #71717a 0%, #3f3f46 25%, #27272a 50%, #3f3f46 75%, #71717a 100%)',
        color: '#ffffff',
        textAlign: 'center',
        padding: '14px 16px',
        fontSize: '13px',
        fontWeight: '900',
        position: 'sticky',
        top: 0,
        zIndex: 1100,
        width: '100%',
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        borderBottom: '2px solid #18181b',
        boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
        letterSpacing: '0.02em',
        textShadow: '0 1px 2px rgba(0,0,0,0.5)'
      }}>
        <span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%', background: isOnline ? '#34d399' : '#f59e0b', boxShadow: '0 0 10px rgba(255,255,255,0.9)' }}></span>
        {isOnline ? '✨🍏 ONLINE · מחובר לענן (Supabase) · מטאלי יוקרתי' : '✨🍏 OFFLINE · מצב טיסה פעיל · עובד מהזיכרון המקומי'}
      </div>

      <header style={{
        padding: '16px 20px',
        background: bgMain,
        borderBottom: `1px solid ${borderColor}`,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'sticky',
        top: '47px',
        zIndex: 900,
        width: '100%',
        boxSizing: 'border-box'
      }}>
        <button 
          onClick={() => handleGlobalClick(() => setSidebarOpen(true))}
          style={{
            background: 'linear-gradient(135deg, #f4f4f5 0%, #e4e4e7 50%, #d4d4d8 100%)', 
            border: '1px solid #a1a1aa', 
            width: '48px', 
            height: '48px',
            borderRadius: '14px', 
            fontSize: '24px', 
            fontWeight: '900', 
            cursor: 'pointer',
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            color: '#18181b',
            boxShadow: '0 2px 6px rgba(0, 0, 0, 0.15)',
            textShadow: '0 1px 0 rgba(255,255,255,0.8)'
          }}
          title="תפריט מהיר"
        >
          ☰
        </button>

        <div style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: '16px', fontWeight: '900', margin: '0 0 2px', color: textColor, letterSpacing: '-0.01em' }}>אגם גארדה וונציה</h1>
          <p style={{ fontSize: '11px', color: textSub, margin: 0, fontWeight: '700' }}>טיול בת מצווה · 30.09 - 06.10.2026</p>
        </div>

        <button 
          onClick={() => handleGlobalClick(() => {
            setViewerItem({ isHotelInfo: true, title: 'הזמנת Bio Agriturismo Vojon' });
            setModalType('viewer');
          })}
          style={{
            background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '10px 14px',
            borderRadius: '12px', fontSize: '13px', fontWeight: '900', color: '#166534', cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: '6px', boxShadow: '0 2px 5px rgba(0,0,0,0.02)'
          }}
        >
          🏡 Bio Vojon
        </button>
      </header>

      {sidebarOpen && (
        <div 
          onClick={() => setSidebarOpen(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0, 0, 0, 0.4)', zIndex: 2500, width: '100vw', height: '100vh', backdropFilter: 'blur(2px)' }}
        />
      )}
      <aside 
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={() => handleTouchEnd(() => setSidebarOpen(false))}
        style={{
          position: 'fixed', top: 0, bottom: 0, right: sidebarOpen ? 0 : '-340px', width: '300px', maxWidth: '80vw',
          background: cardBg, zIndex: 2600, boxShadow: '-10px 0 30px rgba(0,0,0,0.15)',
          transition: 'right 0.4s cubic-bezier(0.16, 1, 0.3, 1)', padding: '28px 20px',
          display: 'flex', flexDirection: 'column', gap: '10px', borderLeft: `1px solid ${borderColor}`, boxSizing: 'border-box'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1px solid ${borderColor}`, paddingBottom: '14px', marginBottom: '6px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '900', margin: 0, color: textColor }}>תפריט מהיר</h3>
          <button onClick={() => handleGlobalClick(() => setSidebarOpen(false))} style={{ ...modalCloseBtn, background: '#f3f4f6', color: textColor, border: 'none' }}>✕</button>
        </div>
        <button onClick={() => handleGlobalClick(() => { setSidebarOpen(false); setModalType(null); })} style={sidebarBtnStyle}><span>📅</span> מסלול ימי הטיול</button>
        <button onClick={() => handleGlobalClick(() => { setSidebarOpen(false); setModalType('challengesLog'); })} style={sidebarBtnStyle}><span>🏆</span> יומן אתגרים ובדיחות</button>
        <button onClick={() => handleGlobalClick(() => { setSidebarOpen(false); setModalType('phrasebook'); })} style={sidebarBtnStyle}><span>🇮🇹</span> שיחון איטלקי חכם</button>
        <button onClick={() => handleGlobalClick(() => { setSidebarOpen(false); setModalType('gallery'); })} style={sidebarBtnStyle}><span>📸</span> יומן ואלבום תמונות משפחתי</button>
        <button onClick={() => handleGlobalClick(() => { setSidebarOpen(false); setModalType('around'); })} style={sidebarBtnStyle}><span>📍</span> סביבי (Around Me)</button>
        <button onClick={() => handleGlobalClick(() => { setSidebarOpen(false); setModalType('parking'); })} style={sidebarBtnStyle}><span>🚗</span> שמירת מיקום חניה</button>
        <button onClick={() => handleGlobalClick(() => { setSidebarOpen(false); setModalType('tickets'); })} style={sidebarBtnStyle}><span>🎟️</span> ארנק כרטיסים ומסמכים</button>
        <button onClick={() => handleGlobalClick(() => { setSidebarOpen(false); setModalType('emergency'); })} style={sidebarBtnStyle}><span>🆘</span> מספרי חירום</button>
      </aside>

      <main style={{ padding: '20px 16px', maxWidth: '600px', width: '100%', margin: 'auto', boxSizing: 'border-box', overflowX: 'hidden' }}>
        
        {/* כפתורי ימי הטיול בעיצוב Apple Silver מטאלי יוקרתי */}
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '10px', marginBottom: '20px', scrollbarWidth: 'none', width: '100%', boxSizing: 'border-box' }}>
          {tripDays.map((d, i) => (
            <button
              key={i}
              onClick={() => handleGlobalClick(() => setActiveDay(i))}
              style={{
                flex: '0 0 auto',
                padding: '10px 16px',
                borderRadius: '12px',
                background: activeDay === i 
                  ? 'linear-gradient(135deg, #71717a 0%, #3f3f46 50%, #27272a 100%)' 
                  : 'linear-gradient(135deg, #f4f4f5 0%, #e4e4e7 50%, #d4d4d8 100%)',
                color: activeDay === i ? '#ffffff' : '#18181b',
                border: `1px solid ${activeDay === i ? '#18181b' : '#a1a1aa'}`,
                fontSize: '12px',
                fontWeight: '900',
                cursor: 'pointer',
                boxShadow: activeDay === i ? '0 4px 12px rgba(0, 0, 0, 0.25)' : '0 2px 5px rgba(0, 0, 0, 0.08)',
                transition: 'all 0.2s ease',
                textShadow: activeDay === i ? '0 1px 2px rgba(0,0,0,0.5)' : '0 1px 0 rgba(255,255,255,0.8)'
              }}
            >
              {d.label}
            </button>
          ))}
        </div>

        <section style={{ width: '100%', boxSizing: 'border-box', overflowX: 'hidden' }}>
          <div style={{ paddingBottom: '12px', marginBottom: '16px' }}>
            <span style={{ fontSize: '12px', fontWeight: '800', color: '#2563eb', display: 'block', marginBottom: '2px' }}>{day.fullLabel}</span>
            <h2 style={{ margin: 0, fontSize: '22px', fontWeight: '900', color: textColor }}>{day.icon} {day.title}</h2>
          </div>

          <div 
            onClick={() => handleGlobalClick(() => setModalType('questModal'))}
            style={{
              background: '#f0fdf4',
              border: `1px solid ${isCurrentDayCompleted ? '#10b981' : '#bbf7d0'}`,
              borderRadius: '16px',
              padding: '16px 18px',
              marginBottom: '22px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
              boxSizing: 'border-box',
              width: '100%',
              boxShadow: '0 2px 8px rgba(16, 185, 129, 0.05)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: 0 }}>
              <div style={{ minWidth: 0, flex: 1 }}>
                <span style={{ display: 'block', fontSize: '12px', fontWeight: '900', color: '#15803d', marginBottom: '2px' }}>
                  {isCurrentDayCompleted ? 'אתגר היום הושלם בהצלחה! 🎉' : 'אתגר היום:'}
                </span>
                <strong style={{ display: 'block', fontSize: '14px', color: '#166534', fontWeight: '800', lineHeight: '1.4' }}>
                  {day.challenge}
                </strong>
              </div>
            </div>

            <span style={{
              background: '#15803d',
              color: '#ffffff',
              padding: '8px 14px', borderRadius: '10px',
              fontSize: '12px', fontWeight: '800', flexShrink: 0
            }}>
              {isCurrentDayCompleted ? 'צפה ✏️' : 'פתח משימה 🚀'}
            </span>

          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {day.stops && day.stops.map((stop, idx) => (
              <div key={idx} style={{ background: cardBg, border: `1px solid ${borderColor}`, borderRadius: '20px', padding: '20px', boxSizing: 'border-box', width: '100%', boxShadow: cardShadow }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: '900', margin: 0, color: textColor }}>{stop.name}</h3>
                  <span style={{ fontSize: '12px', fontWeight: '800', color: textColor, background: '#f8fafc', padding: '4px 10px', borderRadius: '10px', border: `1px solid ${borderColor}` }}>{stop.time}</span>
                </div>
                <p style={{ fontSize: '13px', color: textSub, margin: '4px 0 16px', lineHeight: '1.5', fontWeight: '600' }}>{stop.note}</p>

                {stop.food && (
                  <div style={{ fontSize: '12px', background: '#fffbeb', color: '#b45309', padding: '14px', borderRadius: '14px', marginBottom: '16px', border: '1px solid #fef3c7', display: 'flex', flexDirection: 'column', gap: '10px', fontWeight: '700', boxSizing: 'border-box' }}>
                    <span><b>🍴 המלצה קולינרית:</b> {stop.food.name}</span>
                    <a 
                      href={`https://www.waze.com/ul?q=${encodeURIComponent(stop.food.dest)}&navigate=yes`}
                      onClick={() => playClickSound()}
                      style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px', background: '#ffffff', color: '#00a6ff', fontWeight: '900', fontSize: '12px', padding: '9px 14px', borderRadius: '12px', textDecoration: 'none', border: '1px solid #bae6fd', alignSelf: 'flex-start', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}
                    >
                      {WAZE_SVG} נווט למסעדה ב-Waze
                    </a>
                  </div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', paddingTop: '14px', borderTop: `1px solid ${borderColor}` }}>
                  <a href={`https://maps.apple.com/?q=${encodeURIComponent(stop.dest)}`} target="_blank" rel="noreferrer" onClick={() => playClickSound()} style={{ ...navBtnStyle, background: '#ffffff', color: textColor, borderColor: borderColor }}>
                    {MAPS_SVG} Maps
                  </a>
                  <a href={`https://www.waze.com/ul?q=${encodeURIComponent(stop.dest)}&navigate=yes`} onClick={() => playClickSound()} style={{ ...navBtnStyle, background: '#ffffff', color: '#00a6ff', borderColor: '#bae6fd' }}>
                    {WAZE_SVG} Waze
                  </a>
                </div>

                <div style={{ marginTop: '10px', display: 'flex', gap: '8px' }}>
                  <a 
                    href="https://maps.apple.com/?q=Parked%20Car" 
                    target="_blank" 
                    rel="noreferrer"
                    onClick={() => playClickSound()}
                    style={{
                      flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                      padding: '10px 14px', borderRadius: '12px', background: '#f8fafc', color: textColor,
                      border: `1px solid ${borderColor}`, fontSize: '12px', fontWeight: '800', textDecoration: 'none', boxSizing: 'border-box'
                    }}
                  >
                    🚗 שמור/מצא רכב חונה
                  </a>
                  <button 
                    onClick={() => handleGlobalClick(() => setModalType('parking'))}
                    style={{ border: `1px solid ${borderColor}`, background: '#f8fafc', color: textColor, borderRadius: '12px', padding: '0 14px', fontSize: '14px', fontWeight: '800', cursor: 'pointer' }}
                    title="הסבר שמירת חניה"
                  >
                    ℹ️
                  </button>
                </div>

              </div>
            ))}
          </div>
        </section>
      </main>

      {modalType === 'questModal' && (
        <div onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={() => handleTouchEnd(() => setModalType(null))} style={{ ...modalStyle, background: bgMain }}>
          <div style={modalContentStyle}>
            <div style={{ background: cardBg, border: `1px solid ${borderColor}`, borderRadius: '24px', padding: '24px', boxSizing: 'border-box', width: '100%', boxShadow: cardShadow }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1px solid ${borderColor}`, paddingBottom: '14px', marginBottom: '18px' }}>
                <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '900', color: textColor }}>הפתעת הבוקר והאתגר!</h2>
                <button onClick={() => handleGlobalClick(() => setModalType(null))} style={{ ...modalCloseBtn, background: '#f3f4f6', color: textColor, border: 'none' }}>✕</button>
              </div>

              <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '16px', padding: '16px', marginBottom: '20px', textAlign: 'center', boxSizing: 'border-box' }}>
                <span style={{ fontSize: '28px', display: 'block', marginBottom: '4px' }}>🎯</span>
                <h3 style={{ margin: '0 0 6px', fontSize: '16px', fontWeight: '900', color: '#166534' }}>{day.challenge}</h3>
                <p style={{ margin: 0, fontSize: '13px', color: '#15803d', lineHeight: '1.4', fontWeight: '700' }}>{day.challengeDesc}</p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '16px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '800', color: textSub, display: 'block', marginBottom: '6px' }}>מי ביצע / מתעד?</label>
                  <select value={challengeAuthor} onChange={(e) => setChallengeAuthor(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '12px', border: `1px solid ${borderColor}`, background: '#f8fafc', color: textColor, fontWeight: '800', boxSizing: 'border-box' }}>
                    <option value="אריק">אריק</option>
                    <option value="עמית">עמית</option>
                    <option value="יולי">יולי</option>
                    <option value="ליאן">ליאן</option>
                    <option value="הראל">הראל</option>
                    <option value="משפחה">כולנו יחד 👨‍👩‍👧‍👧</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: '800', color: textSub, display: 'block', marginBottom: '6px' }}>💬 כתוב בדיחה, משפט קורע או סיכום האתגר:</label>
                  <textarea rows="3" placeholder="לדוגמה: עמית צעקה הכי חזק ברכבת הרים..." value={challengeNote} onChange={(e) => setChallengeNote(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '12px', border: `1px solid ${borderColor}`, background: '#fff', color: textColor, fontSize: '13px', boxSizing: 'border-box', outline: 'none', fontWeight: '600' }} />
                </div>

                <input type="file" id="questPhotoInput" accept="image/*" capture="environment" style={{ display: 'none' }} onChange={(e) => { if (e.target.files && e.target.files[0]) saveDailyChallenge(e.target.files[0]); }} />

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <button onClick={() => handleGlobalClick(() => document.getElementById('questPhotoInput').click())} style={{ padding: '14px', borderRadius: '12px', background: '#f8fafc', color: textColor, border: `1px solid ${borderColor}`, fontWeight: '900', fontSize: '13px', cursor: 'pointer' }}>📸 צלם לאלבום</button>
                  <button onClick={() => handleGlobalClick(() => saveDailyChallenge(null))} style={{ padding: '14px', borderRadius: '12px', background: '#0f172a', color: '#fff', border: 'none', fontWeight: '900', fontSize: '13px', cursor: 'pointer' }}>✅ סמן כהושלם</button>
                </div>

                {isCurrentDayCompleted && (
                  <button onClick={() => handleGlobalClick(() => resetSingleChallenge(activeDay))} style={{ background: '#fef2f2', color: '#dc2626', border: '1px solid #fca5a5', padding: '12px', borderRadius: '12px', fontWeight: '900', fontSize: '13px', cursor: 'pointer', width: '100%', boxSizing: 'border-box' }}>🔄 אפס משימה זו</button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {modalType === 'challengesLog' && (
        <div onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={() => handleTouchEnd(() => setModalType(null))} style={{ ...modalStyle, background: bgMain }}>
          <div style={modalContentStyle}>
            <div style={{ background: cardBg, border: `1px solid ${borderColor}`, borderRadius: '24px', padding: '24px', boxSizing: 'border-box', width: '100%', boxShadow: cardShadow }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1px solid ${borderColor}`, paddingBottom: '14px', marginBottom: '16px' }}>
                <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '900', color: textColor }}>יומן האתגרים והבדיחות</h2>
                <button onClick={() => handleGlobalClick(() => setModalType(null))} style={{ ...modalCloseBtn, background: '#f3f4f6', color: textColor, border: 'none' }}>✕</button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {tripDays.map((d, idx) => {
                  const log = completedChallenges[String(idx)];
                  const isUnlocked = isAdminUnlocked || log?.completed;
                  return (
                    <div key={idx} style={{ background: log?.completed ? '#ecfdf5' : '#f8fafc', border: `1px solid ${log?.completed ? '#10b981' : borderColor}`, borderRadius: '16px', padding: '16px', boxSizing: 'border-box', width: '100%' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                        <span style={{ fontSize: '11px', fontWeight: '800', padding: '3px 8px', borderRadius: '8px', background: log?.completed ? '#10b981' : '#e2e8f0', color: log?.completed ? '#fff' : '#000' }}>
                          {log?.completed ? 'בוצע! 🎉' : 'טרם בוצע'}
                        </span>
                        <span style={{ fontSize: '12px', fontWeight: '800', color: textSub }}>{d.label} · {d.title}</span>
                      </div>
                      {isUnlocked ? (
                        <b style={{ fontSize: '14px', color: textColor, display: 'block' }}>🎯 {d.challenge}</b>
                      ) : (
                        <div style={{ fontSize: '13px', color: textSub, fontWeight: '700' }}>🔒 אתגר סודי</div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {modalType === 'phrasebook' && (
        <div onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={() => handleTouchEnd(() => setModalType(null))} style={{ ...modalStyle, background: bgMain }}>
          <div style={modalContentStyle}>
            <div style={{ background: cardBg, border: `1px solid ${borderColor}`, borderRadius: '24px', padding: '20px 16px', boxSizing: 'border-box', width: '100%', direction: 'rtl', boxShadow: cardShadow }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1px solid ${borderColor}`, paddingBottom: '12px', marginBottom: '16px' }}>
                <h2 style={{ margin: 0, fontSize: '17px', fontWeight: '900', color: textColor }}>שיחון איטלקי חכם</h2>
                <button onClick={() => handleGlobalClick(() => setModalType(null))} style={{ ...modalCloseBtn, background: '#f3f4f6', color: textColor, border: 'none' }}>✕</button>
              </div>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
                <input 
                  type="text" 
                  lang="he" 
                  dir="rtl" 
                  placeholder="הקלד בעברית לתרגום..." 
                  value={hebrewInput} 
                  onChange={(e) => setHebrewInput(e.target.value)} 
                  style={{ flex: 1, padding: '12px', borderRadius: '12px', border: `1px solid ${borderColor}`, background: '#f8fafc', color: textColor, fontWeight: '700', outline: 'none', fontSize: '16px' }} 
                />
                <button onClick={() => handleGlobalClick(() => translateText(hebrewInput))} style={{ padding: '0 16px', background: '#0f172a', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: '900', cursor: 'pointer', fontSize: '14px' }}>תרגם</button>
              </div>
              {italianOutput && (
                <div style={{ background: '#f0fdf4', padding: '12px 14px', borderRadius: '12px', border: '1px solid #bbf7d0', marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <button onClick={() => speakItalian(italianOutput)} style={{ background: '#10b981', color: '#fff', border: 'none', borderRadius: '8px', padding: '6px 12px', fontWeight: '800', cursor: 'pointer' }}>🔊 השמע</button>
                  <strong style={{ fontSize: '15px', color: '#166534', direction: 'ltr' }}>{italianOutput}</strong>
                </div>
              )}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {filteredPhrases.slice(0, 10).map((phrase, idx) => (
                  <div key={idx} onClick={() => speakItalian(phrase.it)} style={{ background: cardBg, border: `1px solid ${borderColor}`, borderRadius: '12px', padding: '10px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
                    <button onClick={(e) => { e.stopPropagation(); speakItalian(phrase.it); }} style={{ background: '#f0fdf4', border: '1px solid #86efac', borderRadius: '8px', width: '36px', height: '36px', fontSize: '15px', cursor: 'pointer', color: '#166534' }}>🔊</button>
                    <div style={{ flex: 1, textAlign: 'right', marginRight: '10px' }}>
                      <span style={{ fontSize: '13px', fontWeight: '800', color: textColor, display: 'block' }}>{phrase.he}</span>
                      <strong style={{ fontSize: '13px', color: '#2563eb', display: 'block' }}>{phrase.it}</strong>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {modalType === 'gallery' && (
        <div onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={() => handleTouchEnd(() => setModalType(null))} style={{ ...modalStyle, background: bgMain }}>
          <div style={modalContentStyle}>
            <div style={{ background: cardBg, border: `1px solid ${borderColor}`, borderRadius: '20px', padding: '22px', boxSizing: 'border-box', width: '100%', boxShadow: cardShadow }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1px solid ${borderColor}`, paddingBottom: '14px', marginBottom: '16px' }}>
                <h2 style={{ margin: 0, fontSize: '19px', fontWeight: '900', color: textColor }}>📸 אלבום המסע המשפחתי</h2>
                <button onClick={() => handleGlobalClick(() => setModalType(null))} style={{ ...modalCloseBtn, background: '#f3f4f6', color: textColor, border: 'none' }}>✕</button>
              </div>
              <button onClick={() => handleGlobalClick(() => setShowGalleryUpload(!showGalleryUpload))} style={{ width: '100%', padding: '12px', borderRadius: '12px', fontWeight: '900', fontSize: '13px', cursor: 'pointer', background: '#0f172a', color: '#fff', border: 'none', marginBottom: '16px' }}>📷 הוסף תמונה / סרטון</button>
            </div>
          </div>
        </div>
      )}

      {modalType === 'viewer' && viewerItem && (
        <div onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={() => handleTouchEnd(() => setModalType(null))} style={{ ...modalStyle, background: bgMain }}>
          <div style={modalContentStyle}>
            <div style={{ background: cardBg, border: `1px solid ${borderColor}`, borderRadius: '24px', padding: '24px', boxSizing: 'border-box', width: '100%', boxShadow: cardShadow }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1px solid ${borderColor}`, paddingBottom: '14px', marginBottom: '16px' }}>
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '900', color: '#166534' }}>🏡 Bio Agriturismo Vojon</h3>
                <button onClick={() => handleGlobalClick(() => setModalType(null))} style={{ ...modalCloseBtn, background: '#f3f4f6', color: textColor, border: 'none' }}>✕</button>
              </div>
              
              <div style={{ lineHeight: '1.8', fontSize: '14px', color: textColor, fontWeight: '600' }}>
                <p><b>סטטוס הזמנה:</b> <span style={{ color: '#059669', fontWeight: '900' }}>Confirmed (מאושר)</span></p>
                <p><b>כתובת המלון:</b><br/><span dir="ltr">Via Del Forte 6, 46040 Ponti Sul Mincio, Italy</span></p>
                <p><b>תאריכי שהות:</b> 30.09.2026 – 06.10.2026 (6 לילות)</p>
                <p><b>טלפון ליצירת קשר:</b> <a href="tel:+393792027060" style={{ color: '#2563eb', fontWeight: '800' }} dir="ltr">+39 379 202 7060</a></p>
                
                <a 
                  href={`https://www.waze.com/ul?q=${encodeURIComponent('Bio Agriturismo Vojon, Ponti sul Mincio, Italy')}&navigate=yes`} 
                  onClick={() => playClickSound()} 
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '14px', background: '#33ccff', color: '#000000', borderRadius: '14px', textDecoration: 'none', fontWeight: '900', marginTop: '20px', boxShadow: '0 2px 6px rgba(0,0,0,0.1)' }}
                >
                  {WAZE_SVG} נווט למלון ב-Waze לפי הכתובת
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {modalType === 'parking' && (
        <div onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={() => handleTouchEnd(() => setModalType(null))} style={{ ...modalStyle, background: bgMain }}>
          <div style={modalContentStyle}>
            <div style={{ background: cardBg, border: `1px solid ${borderColor}`, borderRadius: '20px', padding: '22px', boxSizing: 'border-box', width: '100%', boxShadow: cardShadow }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', borderBottom: `1px solid ${borderColor}`, paddingBottom: '12px' }}>
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '900', color: textColor }}>🚗 איך שומרים את הרכב ב-Apple Maps</h3>
                <button onClick={() => handleGlobalClick(() => setModalType(null))} style={{ ...modalCloseBtn, background: '#f3f4f6', color: textColor, border: 'none' }}>✕</button>
              </div>
              <p style={{ fontSize: '14px', lineHeight: '1.7', color: textColor, fontWeight: '600' }}>
                אם האייפון מחובר ל-Bluetooth או ל-CarPlay ברכב השכור, ברגע שמכבים מנוע ומתנתקים – האייפון שומר <b>אוטומטית</b> את מיקום החניה.
              </p>
            </div>
          </div>
        </div>
      )}

      {modalType === 'around' && (
        <div onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={() => handleTouchEnd(() => setModalType(null))} style={{ ...modalStyle, background: bgMain }}>
          <div style={modalContentStyle}>
            <div style={{ background: cardBg, border: `1px solid ${borderColor}`, borderRadius: '20px', padding: '22px', boxSizing: 'border-box', width: '100%', boxShadow: cardShadow }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', borderBottom: `1px solid ${borderColor}`, paddingBottom: '12px' }}>
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '900', color: textColor }}>📍 סביבי (Around Me)</h3>
                <button onClick={() => handleGlobalClick(() => setModalType(null))} style={{ ...modalCloseBtn, background: '#f3f4f6', color: textColor, border: 'none' }}>✕</button>
              </div>
              <p style={{ fontSize: '13px', color: textSub, marginBottom: '16px', fontWeight: '700' }}>בחר קטגוריה לחיפוש מהיר במפה סביבך:</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <button onClick={() => window.location.href = 'https://maps.apple.com/?q=pizza'} style={{ ...gridModalBtn, background: '#f8fafc', color: textColor, border: `1px solid ${borderColor}` }}>🍕 <span>פיצה</span></button>
                <button onClick={() => window.location.href = 'https://maps.apple.com/?q=gelato'} style={{ ...gridModalBtn, background: '#f8fafc', color: textColor, border: `1px solid ${borderColor}` }}>🍦 <span>גלידה</span></button>
                <button onClick={() => window.location.href = 'https://maps.apple.com/?q=pharmacy'} style={{ ...gridModalBtn, background: '#f8fafc', color: textColor, border: `1px solid ${borderColor}` }}>💊 <span>פארם / בית מרקחת</span></button>
                <button onClick={() => window.location.href = 'https://maps.apple.com/?q=restaurants'} style={{ ...gridModalBtn, background: '#f8fafc', color: textColor, border: `1px solid ${borderColor}` }}>🍝 <span>מסעדות</span></button>
                <button onClick={() => window.location.href = 'https://maps.apple.com/?q=supermarket'} style={{ ...gridModalBtn, background: '#f8fafc', color: textColor, border: `1px solid ${borderColor}` }}>🛒 <span>סופרמרקט</span></button>
                <button onClick={() => window.location.href = 'https://maps.apple.com/?q=gas station'} style={{ ...gridModalBtn, background: '#f8fafc', color: textColor, border: `1px solid ${borderColor}` }}>⛽ <span>תחנת דלק</span></button>
              </div>
            </div>
          </div>
        </div>
      )}

      {modalType === 'emergency' && (
        <div onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={() => handleTouchEnd(() => setModalType(null))} style={{ ...modalStyle, background: bgMain }}>
          <div style={modalContentStyle}>
            <div style={{ background: cardBg, border: `1px solid ${borderColor}`, borderRadius: '20px', padding: '22px', boxSizing: 'border-box', width: '100%', boxShadow: cardShadow }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', borderBottom: `1px solid ${borderColor}`, paddingBottom: '12px' }}>
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '900', color: '#dc2626' }}>🆘 מספרי חירום באיטליה</h3>
                <button onClick={() => handleGlobalClick(() => setModalType(null))} style={{ ...modalCloseBtn, background: '#f3f4f6', color: textColor, border: 'none' }}>✕</button>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <a href="tel:112" style={{ ...gridModalBtn, background: '#fef2f2', color: '#dc2626', borderColor: '#fca5a5', textDecoration: 'none' }}>🚨 חירום כללי: 112</a>
                <a href="tel:118" style={{ ...gridModalBtn, background: '#fef2f2', color: '#dc2626', borderColor: '#fca5a5', textDecoration: 'none' }}>🚑 אמבולנס: 118</a>
              </div>
            </div>
          </div>
        </div>
      )}

      {modalType === 'tickets' && (
        <div onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={() => handleTouchEnd(() => setModalType(null))} style={{ ...modalStyle, background: bgMain }}>
          <div style={modalContentStyle}>
            <div style={{ background: cardBg, border: `1px solid ${borderColor}`, borderRadius: '24px', padding: '24px', boxSizing: 'border-box', width: '100%', boxShadow: cardShadow }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1px solid ${borderColor}`, paddingBottom: '14px', marginBottom: '16px' }}>
                <div>
                  <small style={{ color: '#2563eb', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', fontSize: '11px' }}>ארנק דיגיטלי</small>
                  <h2 style={{ margin: '2px 0 0', fontSize: '19px', fontWeight: '900', color: textColor }}>🎟️ כרטיסים ומסמכים</h2>
                </div>
                <button onClick={() => handleGlobalClick(() => setModalType(null))} style={{ ...modalCloseBtn, background: '#f3f4f6', color: textColor, border: 'none' }}>✕</button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '16px' }}>
                <button onClick={() => handleGlobalClick(() => setShowUploadBox(!showUploadBox))} style={{ padding: '12px', borderRadius: '12px', fontWeight: '900', fontSize: '13px', cursor: 'pointer', border: '1px solid #eab308', background: yellowBtnBg, color: yellowBtnText }}>
                  ➕ הוסף כרטיס
                </button>
                <button onClick={() => handleGlobalClick(addNewFolder)} style={{ padding: '12px', borderRadius: '12px', fontWeight: '900', fontSize: '13px', cursor: 'pointer', border: `1px solid ${borderColor}`, background: '#f3f4f6', color: '#000000' }}>
                  📁 תקייה חדשה
                </button>
              </div>

              {showUploadBox && (
                <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '14px', border: `1px solid ${borderColor}`, marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '12px', boxSizing: 'border-box', width: '100%' }}>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: '800', color: textSub, display: 'block', marginBottom: '4px' }}>בחר תקייה לשמירה:</label>
                    <select value={selectedUploadFolder} onChange={(e) => setSelectedUploadFolder(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: `1px solid ${borderColor}`, background: cardBg, color: textColor, boxSizing: 'border-box', fontWeight: '700' }}>
                      {folders.map((f, i) => <option key={i} value={f}>{f}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: '800', color: textSub, display: 'block', marginBottom: '4px' }}>שם הכרטיס / מסמך:</label>
                    <input type="text" placeholder="לדוגמה: כרטיס כניסה לפארק" value={newTicketTitle} onChange={(e) => setNewTicketTitle(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: `1px solid ${borderColor}`, background: cardBg, color: textColor, boxSizing: 'border-box', fontWeight: '600' }} />
                  </div>
                  <input type="file" id="cameraInput" accept="image/*" capture="environment" style={{ display: 'none' }} onChange={handleFileUpload} />
                  <input type="file" id="fileInput" accept="image/*,application/pdf" multiple style={{ display: 'none' }} onChange={handleFileUpload} />
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <button onClick={() => handleGlobalClick(() => document.getElementById('cameraInput').click())} style={{ ...uploadBtnStyle, background: yellowBtnBg, color: yellowBtnText, border: '1px solid #eab308' }}>📷 צלם במצלמה</button>
                    <button onClick={() => handleGlobalClick(() => document.getElementById('fileInput').click())} style={{ ...uploadBtnStyle, background: yellowBtnBg, color: yellowBtnText, border: '1px solid #eab308' }}>📁 בחר קובץ מהמכשיר</button>
                  </div>
                </div>
              )}

              <h3 style={{ fontSize: '14px', margin: '8px 0 10px', fontWeight: '900', color: textColor }}>תקיות הטיול</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '8px', marginBottom: '18px', width: '100%', boxSizing: 'border-box' }}>
                {folders.map((f, i) => (
                  <div 
                    key={i} 
                    onClick={() => handleGlobalClick(() => setActiveFolder(f))}
                    style={{
                      padding: '12px', borderRadius: '12px',
                      background: activeFolder === f ? yellowBtnBg : '#f8fafc',
                      color: '#000000',
                      border: `1px solid ${activeFolder === f ? '#eab308' : borderColor}`,
                      cursor: 'pointer', display: 'flex', flexDirection: 'column', justifyContent: 'center', boxSizing: 'border-box'
                    }}
                  >
                    <strong style={{ display: 'block', fontSize: '12px', marginBottom: '2px', fontWeight: '900' }}>{f}</strong>
                    <small style={{ color: textSub, fontSize: '10px', fontWeight: '800' }}>הצג קבצים</small>
                  </div>
                ))}
              </div>

              <div style={{ borderBottom: `1px solid ${borderColor}`, paddingBottom: '8px', marginBottom: '12px', fontWeight: '900', fontSize: '13px', color: textColor }}>
                תכולת תיקייה: {activeFolder}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%', boxSizing: 'border-box' }}>
                {ticketFiles.length === 0 ? (
                  <div style={{ textAlign: 'center', color: textSub, padding: '24px', fontSize: '13px', fontWeight: '600' }}>אין עדיין כרטיסים בתקייה זו.</div>
                ) : (
                  ticketFiles.map((x, idx) => (
                    <div 
                      key={x.id || idx} 
                      onClick={() => handleGlobalClick(() => { setViewerItem(x); setModalType('viewer'); })}
                      style={{ 
                        display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', 
                        gap: '12px', padding: '14px', borderRadius: '14px', background: '#f8fafc', 
                        border: `1px solid ${borderColor}`, cursor: 'pointer', boxSizing: 'border-box', width: '100%' 
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0, flex: 1 }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#ffffff', border: `1px solid ${borderColor}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0 }}>
                          {x.isFlightInfo ? '✈️' : (x.isInsuranceInfo ? '🛡️' : (x.isCarVoucher ? '🚗' : (x.isHotelInfo ? '🏡' : '📄')))}
                        </div>
                        <div style={{ minWidth: 0, textAlign: 'right', flex: 1 }}>
                          <b style={{ display: 'block', fontSize: '13px', fontWeight: '900', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: textColor }}>{x.title || x.name}</b>
                          <small style={{ color: textSub, fontSize: '11px', display: 'block', fontWeight: '700' }}>
                            {x.isFlightInfo ? 'ישראייר 4623652' : (x.isInsuranceInfo ? 'AIG פוליסה' : (x.isCarVoucher ? 'Ecovia השכרה' : (x.isHotelInfo ? 'Booking' : `${Math.round((x.size || 1024) / 1024)} KB`)))}
                          </small>
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                        <span style={{ fontSize: '12px', color: '#2563eb', fontWeight: '800' }}>צפה 👁️</span>
                        {!x.isFlightInfo && !x.isInsuranceInfo && !x.isCarVoucher && !x.isHotelInfo && (
                          <button onClick={(e) => deleteFile(x.id, e)} style={{ background: '#fef2f2', color: '#dc2626', border: '1px solid #fca5a5', padding: '4px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: '900', cursor: 'pointer' }}>מחק</button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}

const sidebarBtnStyle = {
  border: `1px solid ${'#e5e7eb'}`, padding: '12px 16px',
  borderRadius: '12px', fontWeight: '800', fontSize: '14px', textAlign: 'right',
  cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', boxSizing: 'border-box', width: '100%',
  background: '#f8fafc', color: '#000000', boxShadow: '0 1px 2px rgba(0,0,0,0.02)'
};

const navBtnStyle = {
  fontSize: '13px', fontWeight: '900',
  padding: '10px 14px', borderRadius: '12px', display: 'flex', alignItems: 'center',
  justifyContent: 'center', gap: '6px', cursor: 'pointer', border: '1px solid', textDecoration: 'none', boxSizing: 'border-box',
  boxShadow: '0 2px 5px rgba(0,0,0,0.02)'
};

const modalStyle = {
  position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
  width: '100vw', maxWidth: '100vw', height: '100vh',
  zIndex: 2000, overflowY: 'auto', overflowX: 'hidden',
  WebkitOverflowScrolling: 'touch', direction: 'rtl', boxSizing: 'border-box'
};

const modalContentStyle = {
  width: '100%', maxWidth: '600px', margin: '0 auto',
  padding: '20px 16px 40px', boxSizing: 'border-box',
  minHeight: '100vh', overflowX: 'hidden'
};

const modalCloseBtn = {
  width: '36px', height: '36px',
  borderRadius: '50%', fontWeight: '900', fontSize: '15px', cursor: 'pointer',
  display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1, flexShrink: 0
};

const gridModalBtn = {
  padding: '14px', borderRadius: '12px',
  fontWeight: '800', fontSize: '13px', textAlign: 'center', cursor: 'pointer',
  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', boxSizing: 'border-box', width: '100%'
};

const uploadBtnStyle = {
  width: '100%', padding: '12px', borderRadius: '10px',
  fontWeight: '900', cursor: 'pointer', fontSize: '12px', boxSizing: 'border-box'
};
