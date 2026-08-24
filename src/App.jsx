import React, { useState, useEffect, useRef } from 'react';

const WAZE_SVG = (
  <svg viewBox="0 0 512 512" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
    <rect width="512" height="512" rx="110" fill="#33ccff"/>
    <path d="M375.4 233.5c-3.7-31.8-29.3-56.7-61.6-59.5-35.3-3.1-66.5 19.3-73.8 53.6-1.5 7-1.4 14.3.4 21.2-22.1 4.7-38.6 24.1-38.6 47.3 0 17.5 9.7 32.7 24.1 40.5l-10.7 33.3c-2.4 7.4 2.8 15 10.6 15 3.3 0 6.4-1.4 8.6-3.8l21.9-23.7c13.7 4.9 28.7 7.5 44.1 7.5 70.7 0 128-50.5 128-112.7 0-11.8-1.8-23.3-5.2-34.4zm-146 5.3c0-11 9-20 20-20s20 9 20 20-9 20-20 20-20-9-20-20zm112 40c-11 0-20-9-20-20s9-20 20-20 20 9 20 20-9 20-20 20zm-56 22c-29.8 0-54-15.6-54-35 0-3.3 2.7-6 6-6h96c3.3 0 6 2.7 6 6 0 19.4-24.2 35-54 35z" fill="#fff"/>
    <path d="M220.5 240c-1.2 5.5-6.2 9.5-12 9.5s-10.8-4-12-9.5c-2.8-12.7-14.2-22-27.5-22-15.5 0-28 12.5-28 28s12.5 28 28 28c4.4 0 8 3.6 8 8s-3.6 8-8 8c-24.3 0-44-19.7-44-44s19.7-44 44-44c21.2 0 39.1 14.7 43.5 34.5z" fill="#18181b"/>
    <circle cx="178" cy="246" r="10" fill="#18181b"/>
    <circle cx="282" cy="216" r="10" fill="#18181b"/>
    <circle cx="338" cy="216" r="10" fill="#18181b"/>
  </svg>
);

const MAPS_SVG = (
  <svg viewBox="0 0 512 512" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
    <rect width="512" height="512" rx="110" fill="#f1f5f9"/>
    <path d="M120 392l80-160 160-80-80 160z" fill="#10b981"/>
    <path d="M200 232l152-72-72 152-80-80z" fill="#3b82f6"/>
    <circle cx="260" cy="260" r="50" fill="#fff"/>
    <polygon points="260,225 240,290 260,275 280,290" fill="#2563eb"/>
  </svg>
);

const tripDays = [
  {
    date: "2026-09-30",
    label: "רביעי · 30/09",
    fullLabel: "יום רביעי · 30 בספטמבר 2026",
    title: "נחיתה והגעה למלון",
    icon: "✈️",
    challenge: "לצלם את התמונה המשפחתית הראשונה באיטליה.",
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
    challenge: "לבחור יחד את שלושת המתקנים הכי טובים של היום.",
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
    challenge: "לצלם תמונה משפחתית אחת עם האגם ואחת מהראפטינג.",
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
    challenge: "לצלם סלפי משפחתי שנראה כמו פוסטר של סרט.",
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
    challenge: "למצוא גשר קטן ויפה מחוץ למסלול הראשי.",
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
    challenge: "לצלם תמונת בת מצווה מיוחדת בין טחנות המים.",
    stops: [
      { time: "10:00", name: "Borghetto – הכפר והטחנות", dest: "Borghetto sul Mincio, Italy", note: "טיול רגלי ציורי בין הנהר, הגשרים והטחנות." },
      { time: "12:30", name: "ארוחת צהריים – הטורטליני המפורסם", dest: "Ristorante Alla Borsa, Valeggio sul Mincio, Italy", note: "הבית המקורי של כיסוני הטורטליני המכונים 'קשר האהבה'.", food: { name: "🍝 Ristorante Alla Borsa (טורטליני מקורי)", dest: "Ristorante Alla Borsa, Valeggio sul Mincio" } }
    ]
  },
  {
    date: "2026-10-06",
    label: "שלישי · 06/10",
    fullLabel: "יום שלישי · 06 באוקטובר 2026",
    title: "ורונה + הטיסה הביתה",
    icon: "❤️",
    challenge: "לבחור יחד את רגע השיא של כל הטיול.",
    stops: [
      { time: "09:00", name: "צ׳ק-אאוט ויציאה לוורונה", dest: "Parcheggio Cittadella, Piazza Cittadella, Verona", note: "סיור קצר בוורונה, הארנה והמרפסת של יוליה." },
      { time: "13:00", name: "ארוחת צהריים מסכמת בוורונה", dest: "Pizzeria Saporè Downtown, Verona", note: "ארוחת פרידה מעולה מאיטליה עם פיצות גורמה ופסטות.", food: { name: "🍕 Pizzeria Saporè Downtown", dest: "Pizzeria Saporè, Verona" } },
      { time: "18:30", name: "החזרת הרכב בשדה התעופה", dest: "Verona Villafranca Airport", note: "התארגנות וטיסה חזרה הביתה." }
    ]
  }
];

const TICKET_DEFAULT_FOLDERS = ['✈️ טיסות ורכב', '🏡 מלון', '🎢 Gardaland', '🚣 ראפטינג', '🎬 Movieland', '🏰 Medieval Times', '🚤 ונציה'];

const QUICK_PHRASES = [
  { cat: '🍕 מסעדה וקפה', he: 'חשבון בבקשה', it: 'Il conto, per favore', pro: 'אִיל קוֹנְטוֹ, פֶּר פָבוֹרֶה' },
  { cat: '🍕 מסעדה וקפה', he: 'שולחן ל-5 אנשים בבקשה', it: 'Un tavolo per cinque persone, per favore', pro: 'אוּן טָאבוֹלוֹ פֶּר צִ׳ינְקְוֶוה פֶּרְסוֹנֶה' },
  { cat: '🍕 מסעדה וקפה', he: 'בקבוק מים רגילים / מוגזים', it: 'Acqua naturale / gassata per favore', pro: 'אָקְוָוה נָטוּרָלֶה / גָאסָאטָה' },
  { cat: '🍕 מסעדה וקפה', he: 'איפה השירותים?', it: "Dov'è il bagno?", pro: 'דוֹבֶה אִיל בָּאנְיוֹ?' },
  { cat: '🍦 גלידה ופינוקים', he: 'גביע / כוסית של 2 טעמים', it: 'Un cono / una coppetta da due gusti', pro: 'אוּן קוֹנוֹ / קוֹפֶּטָה דָה דוּאֶה גוּסְטִי' },
  { cat: '🍦 גלידה ופינוקים', he: 'אפשר לטעום?', it: 'Posso assaggiare?', pro: 'פּוֹסוֹ אַסַאגָ׳ארֶה?' },
  { cat: '🛒 קניות וחניה', he: 'כמה זה עולה?', it: 'Quanto costa?', pro: 'קְוָואנְטוֹ קוֹסְטָה?' },
  { cat: '🛒 קניות וחניה', he: 'אפשר לשלם באשראי?', it: 'Posso pagare con la carta?', pro: 'פּוֹסוֹ פָּאגָארֶה קוֹן לָה קָארְטָה?' },
  { cat: '🛒 קניות וחניה', he: 'איפה המדחן?', it: 'Dov’è il parcometro?', pro: 'דוֹבֶה אִיל פָּארְקוֹמֶטְרוֹ?' },
  { cat: '👋 בסיסי ונימוס', he: 'שלום / ביי', it: 'Ciao!', pro: 'צ׳או' },
  { cat: '👋 בסיסי ונימוס', he: 'בוקר טוב / ערב טוב', it: 'Buongiorno / Buonasera', pro: 'בּוּאוֹן ג׳וֹרְנוֹ / בּוּאוֹנָה סֶרָה' },
  { cat: '👋 בסיסי ונימוס', he: 'תודה רבה', it: 'Grazie mille!', pro: 'גְרָאצְיֶה מִילֶה' },
  { cat: '👋 בסיסי ונימוס', he: 'סליחה / מחילה', it: 'Scusi / Permesso', pro: 'סְקוּזִי / פֶּרְמֶסוֹ' }
];

export default function App() {
  const [activeDay, setActiveDay] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [viewerItem, setViewerItem] = useState(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Tickets State
  const [folders, setFolders] = useState(TICKET_DEFAULT_FOLDERS);
  const [activeFolder, setActiveFolder] = useState('✈️ טיסות ורכב');
  const [ticketFiles, setTicketFiles] = useState([]);
  const [showUploadBox, setShowUploadBox] = useState(false);
  const [newTicketTitle, setNewTicketTitle] = useState('');
  const [selectedUploadFolder, setSelectedUploadFolder] = useState('✈️ טיסות ורכב');

  // Album / Gallery State
  const [galleryItems, setGalleryItems] = useState([]);
  const [galleryDayFilter, setGalleryDayFilter] = useState('all');
  const [galleryCaption, setGalleryCaption] = useState('');
  const [galleryAuthor, setGalleryAuthor] = useState('אריק');
  const [showGalleryUpload, setShowGalleryUpload] = useState(false);
  const [lightboxItem, setLightboxItem] = useState(null);

  // Translator & Speech State
  const [hebrewInput, setHebrewInput] = useState('');
  const [italianOutput, setItalianOutput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('הכל');
  const recognitionRef = useRef(null);

  // Register In-Line Service Worker for 100% Offline Support
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    if ('serviceWorker' in navigator && window.location.protocol.startsWith('http')) {
      const swCode = `
        const CACHE_NAME = 'garda-trip-v4';
        self.addEventListener('install', (e) => {
          self.skipWaiting();
        });
        self.addEventListener('activate', (e) => {
          e.waitUntil(
            caches.keys().then((keys) =>
              Promise.all(keys.map((k) => k !== CACHE_NAME && caches.delete(k)))
            )
          );
          self.clients.claim();
        });
        self.addEventListener('fetch', (e) => {
          if (e.request.method !== 'GET') return;
          e.respondWith(
            fetch(e.request)
              .then((res) => {
                const copy = res.clone();
                caches.open(CACHE_NAME).then((cache) => cache.put(e.request, copy));
                return res;
              })
              .catch(() => caches.match(e.request))
          );
        });
      `;
      const blob = new Blob([swCode], { type: 'application/javascript' });
      const swUrl = URL.createObjectURL(blob);
      navigator.serviceWorker.register(swUrl).catch(() => {});
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Load Folders & DB Setup
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('garda-ticket-folders'));
      if (Array.isArray(saved) && saved.length) setFolders(saved);
    } catch (e) {}
    initTickets();
    loadGallery();
  }, []);

  useEffect(() => {
    loadFiles(activeFolder);
  }, [activeFolder]);

  const openDb = () => {
    return new Promise((resolve, reject) => {
      const req = indexedDB.open('gardaTripMasterDB', 2);
      req.onupgradeneeded = (e) => {
        const db = req.result;
        if (!db.objectStoreNames.contains('files')) {
          const st = db.createObjectStore('files', { keyPath: 'id', autoIncrement: true });
          st.createIndex('folder', 'folder', { unique: false });
        }
        if (!db.objectStoreNames.contains('gallery')) {
          const gst = db.createObjectStore('gallery', { keyPath: 'id', autoIncrement: true });
          gst.createIndex('dayIndex', 'dayIndex', { unique: false });
        }
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  };

  const initTickets = async () => {
    const db = await openDb();
    const tx = db.transaction('files', 'readonly');
    const req = tx.objectStore('files').getAll();
    req.onsuccess = async () => {
      const all = req.result || [];
      const writeTx = db.transaction('files', 'readwrite');
      const store = writeTx.objectStore('files');
      
      if (!all.some(f => f.isFlightInfo)) {
        store.add({
          folder: '✈️ טיסות ורכב',
          title: 'הזמנת ישראייר (4623652)',
          name: 'Israir Flight Booking',
          type: 'text/flight-info',
          size: 15400,
          created: Date.now(),
          isFlightInfo: true
        });
      }
      if (!all.some(f => f.isInsuranceInfo)) {
        store.add({
          folder: '✈️ טיסות ורכב',
          title: 'ביטוח נסיעות AIG (170270213826)',
          name: 'AIG Insurance Policy',
          type: 'text/insurance-info',
          size: 12000,
          created: Date.now() - 1000,
          isInsuranceInfo: true
        });
      }
      if (!all.some(f => f.isCarVoucher)) {
        store.add({
          folder: '✈️ טיסות ורכב',
          title: 'שובר השכרת רכב (724715780)',
          name: 'Car Rental Voucher',
          type: 'text/car-voucher',
          size: 14000,
          created: Date.now() - 2000,
          isCarVoucher: true
        });
      }
      if (!all.some(f => f.isHotelInfo)) {
        store.add({
          folder: '🏡 מלון',
          title: 'הזמנת Bio Agriturismo Vojon',
          name: 'Hotel Booking Confirmation',
          type: 'text/hotel-info',
          size: 13000,
          created: Date.now(),
          isHotelInfo: true
        });
      }
      writeTx.oncomplete = () => loadFiles(activeFolder);
    };
  };

  const loadFiles = async (folder) => {
    const db = await openDb();
    const tx = db.transaction('files', 'readonly');
    const req = tx.objectStore('files').index('folder').getAll(folder);
    req.onsuccess = () => {
      const res = req.result || [];
      setTicketFiles(res.sort((a, b) => b.created - a.created));
    };
  };

  const loadGallery = async () => {
    const db = await openDb();
    const tx = db.transaction('gallery', 'readonly');
    const req = tx.objectStore('gallery').getAll();
    req.onsuccess = () => {
      const res = req.result || [];
      setGalleryItems(res.sort((a, b) => b.created - a.created));
    };
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

  const handleGalleryUpload = async (e) => {
    const files = [...e.target.files];
    if (!files.length) return;
    const db = await openDb();
    const tx = db.transaction('gallery', 'readwrite');
    const store = tx.objectStore('gallery');

    files.forEach(file => {
      store.add({
        name: file.name,
        type: file.type,
        size: file.size,
        dayIndex: galleryDayFilter === 'all' ? activeDay : Number(galleryDayFilter),
        caption: galleryCaption || '',
        author: galleryAuthor || 'משפחה',
        created: Date.now(),
        blob: file
      });
    });

    tx.oncomplete = () => {
      setGalleryCaption('');
      setShowGalleryUpload(false);
      loadGallery();
    };
  };

  const deleteGalleryItem = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm('למחוק תמונה/סרטון זה מהאלבום?')) return;
    const db = await openDb();
    const tx = db.transaction('gallery', 'readwrite');
    tx.objectStore('gallery').delete(id);
    tx.oncomplete = () => {
      if (lightboxItem && lightboxItem.id === id) setLightboxItem(null);
      loadGallery();
    };
  };

  const deleteFile = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm('למחוק כרטיס זה לצמיתות?')) return;
    const db = await openDb();
    const tx = db.transaction('files', 'readwrite');
    tx.objectStore('files').delete(id);
    tx.oncomplete = () => loadFiles(activeFolder);
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

  // Italian Speech Synthesis
  const speakItalian = (text) => {
    if (!('speechSynthesis' in window)) {
      alert('דפדפן זה אינו תומך בהקראה קולית');
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'it-IT';
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  };

  // Translation Function (Hebrew -> Italian)
  const translateText = async (textToTranslate) => {
    if (!textToTranslate || !textToTranslate.trim()) return;
    setIsTranslating(true);
    try {
      const res = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(textToTranslate)}&langpair=he|it`);
      const data = await res.json();
      if (data && data.responseData && data.responseData.translatedText) {
        const clean = data.responseData.translatedText;
        setItalianOutput(clean);
        speakItalian(clean);
      } else {
        setItalianOutput('שגיאה בתרגום');
      }
    } catch (err) {
      // Fallback offline dictionary match
      const matched = QUICK_PHRASES.find(p => textToTranslate.includes(p.he) || p.he.includes(textToTranslate));
      if (matched) {
        setItalianOutput(matched.it);
        speakItalian(matched.it);
      } else {
        setItalianOutput('תרגום חי דורש חיבור לרשת');
      }
    } finally {
      setIsTranslating(false);
    }
  };

  // Voice Recognition (Hebrew Speech-to-Text)
  const toggleListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('זיהוי קולי אינו נתמך בדפדפן זה. ניתן להקליד ישירות בתיבה.');
      return;
    }

    if (isListening) {
      if (recognitionRef.current) recognitionRef.current.stop();
      setIsListening(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'he-IL';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setHebrewInput(transcript);
      translateText(transcript);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);

    recognitionRef.current = recognition;
    recognition.start();
  };

  const day = tripDays[activeDay];

  const filteredGallery = galleryDayFilter === 'all'
    ? galleryItems
    : galleryItems.filter(item => String(item.dayIndex) === String(galleryDayFilter));

  const categories = ['הכל', '🍕 מסעדה וקפה', '🍦 גלידה ופינוקים', '🛒 קניות וחניה', '👋 בסיסי ונימוס'];
  const filteredPhrases = selectedCategory === 'הכל'
    ? QUICK_PHRASES
    : QUICK_PHRASES.filter(p => p.cat === selectedCategory);

  return (
    <div style={{ background: '#f1f5f9', minHeight: '100vh', fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, sans-serif', color: '#1e293b', direction: 'rtl', paddingBottom: '40px' }}>
      
      {/* Offline Alert Top Bar */}
      {!isOnline && (
        <div style={{ background: '#dc2626', color: '#ffffff', textAlign: 'center', padding: '7px 12px', fontSize: '11px', fontWeight: '800', position: 'sticky', top: 0, zIndex: 1100, boxShadow: '0 2px 6px rgba(220, 38, 38, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
          <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: '#fff' }}></span>
          מצב אופליין פעיל (ללא אינטרנט) · כל המסלולים, המלון, הכרטיסים והשיחון זמינים כרגיל!
        </div>
      )}

      {/* Header */}
      <header style={{
        padding: '12px 16px',
        background: 'rgba(255, 255, 255, 0.95)',
        borderBottom: '1.5px solid #cbd5e1',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'sticky',
        top: !isOnline ? '30px' : 0,
        zIndex: 900,
        backdropFilter: 'blur(16px)',
        boxShadow: '0 2px 8px rgba(15, 23, 42, 0.05)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button 
            onClick={() => setSidebarOpen(true)}
            style={{
              background: '#f8fafc', 
              border: '1.5px solid #94a3b8', 
              width: '38px', 
              height: '38px',
              borderRadius: '10px', 
              fontSize: '20px', 
              fontWeight: '900', 
              cursor: 'pointer',
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              color: '#0f172a',
              boxShadow: '0 2px 4px rgba(15, 23, 42, 0.06)',
              lineHeight: 1
            }}
            title="פתח תפריט"
          >
            ☰
          </button>

          {/* Traffic Light Online/Offline Indicator */}
          <div 
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              background: isOnline ? '#f0fdf4' : '#fef2f2',
              border: `1.5px solid ${isOnline ? '#86efac' : '#fca5a5'}`,
              padding: '4px 8px',
              borderRadius: '20px',
              fontSize: '10px',
              fontWeight: '800',
              color: isOnline ? '#166534' : '#991b1b',
              boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
            }}
            title={isOnline ? 'מחובר לאינטרנט' : 'עובד באופליין מלא'}
          >
            <span style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: isOnline ? '#22c55e' : '#ef4444',
              display: 'inline-block',
              boxShadow: isOnline ? '0 0 6px #22c55e' : '0 0 6px #ef4444'
            }}></span>
            <span>{isOnline ? 'אונליין' : 'אופליין'}</span>
          </div>
        </div>

        <div style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: '15px', fontWeight: '800', margin: '0 0 2px', color: '#0f172a', letterSpacing: '-0.01em' }}>אגם גארדה וונציה</h1>
          <p style={{ fontSize: '10px', color: '#64748b', margin: 0, fontWeight: '600' }}>30.09 - 06.10.2026</p>
        </div>

        <button 
          onClick={() => {
            setViewerItem({ isHotelInfo: true, title: 'הזמנת Bio Agriturismo Vojon' });
            setModalType('viewer');
          }}
          style={{
            background: '#f8fafc', border: '1.5px solid #cbd5e1', padding: '6px 11px',
            borderRadius: '16px', fontSize: '11px', fontWeight: '700', color: '#334155', cursor: 'pointer',
            boxShadow: '0 2px 4px rgba(15, 23, 42, 0.04)', display: 'flex', alignItems: 'center', gap: '4px'
          }}
        >
          🏡 Vojon
        </button>
      </header>

      {/* Sidebar Overlay & Drawer */}
      {sidebarOpen && (
        <div 
          onClick={() => setSidebarOpen(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.45)', zIndex: 2500, backdropFilter: 'blur(6px)' }}
        />
      )}
      <aside style={{
        position: 'fixed', top: 0, bottom: 0, right: sidebarOpen ? 0 : '-340px', width: '300px',
        background: '#ffffff', zIndex: 2600, boxShadow: '-10px 0 40px rgba(0,0,0,0.12)',
        transition: 'right 0.35s cubic-bezier(0.16, 1, 0.3, 1)', padding: '32px 24px',
        display: 'flex', flexDirection: 'column', gap: '12px', borderLeft: '1.5px solid #cbd5e1'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1.5px solid #e2e8f0', paddingBottom: '16px', marginBottom: '8px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '800', margin: 0, color: '#0f172a' }}>תפריט מהיר</h3>
          <button 
            onClick={() => setSidebarOpen(false)}
            style={modalCloseBtn}
            title="סגור תפריט"
          >
            ✕
          </button>
        </div>
        <button onClick={() => { setSidebarOpen(false); setModalType(null); }} style={sidebarBtnStyle}><span>📅</span> מסלול ימי הטיול</button>
        <button onClick={() => { setSidebarOpen(false); setModalType('phrasebook'); }} style={{ ...sidebarBtnStyle, background: '#f0fdf4', color: '#15803d', borderColor: '#86efac' }}><span>🇮🇹</span> שיחון איטלקי + הקראה קולית</button>
        <button onClick={() => { setSidebarOpen(false); setModalType('gallery'); }} style={{ ...sidebarBtnStyle, background: '#fdf4ff', color: '#a21caf', borderColor: '#f0abfc' }}><span>📸</span> יומן ואלבום תמונות משפחתי</button>
        <button onClick={() => { setSidebarOpen(false); setModalType('around'); }} style={sidebarBtnStyle}><span>📍</span> סביבי (Around Me)</button>
        <button onClick={() => { setSidebarOpen(false); setModalType('parking'); }} style={sidebarBtnStyle}><span>🚗</span> שמירת מיקום חניה</button>
        <button onClick={() => { setSidebarOpen(false); setModalType('tickets'); }} style={sidebarBtnStyle}><span>🎟️</span> ארנק כרטיסים ומסמכים</button>
        <button onClick={() => { setSidebarOpen(false); setModalType('emergency'); }} style={{ ...sidebarBtnStyle, background: '#fef2f2', color: '#dc2626', borderColor: '#fca5a5' }}><span>🆘</span> מספרי חירום</button>
      </aside>

      {/* Main Container */}
      <main style={{ padding: '16px', maxWidth: '600px', margin: 'auto' }}>
        
        {/* Day Selector Tabs */}
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '8px', marginBottom: '16px', scrollbarWidth: 'none' }}>
          {tripDays.map((d, i) => (
            <button
              key={i}
              onClick={() => setActiveDay(i)}
              style={{
                flex: '0 0 auto',
                padding: '9px 16px',
                borderRadius: '12px',
                background: activeDay === i ? '#0f172a' : '#ffffff',
                color: activeDay === i ? '#ffffff' : '#475569',
                border: activeDay === i ? '1.5px solid #0f172a' : '1.5px solid #cbd5e1',
                fontSize: '12px',
                fontWeight: '700',
                cursor: 'pointer',
                boxShadow: activeDay === i ? '0 4px 12px rgba(15, 23, 42, 0.2)' : '0 2px 4px rgba(15, 23, 42, 0.04)',
                transition: 'all 0.15s ease'
              }}
            >
              {d.label}
            </button>
          ))}
        </div>

        {/* Selected Day Content */}
        <section style={{ background: '#ffffff', border: '1.5px solid #cbd5e1', borderRadius: '20px', padding: '22px', boxShadow: '0 4px 16px rgba(15, 23, 42, 0.06)' }}>
          <div style={{ borderBottom: '1.5px solid #f1f5f9', paddingBottom: '14px', marginBottom: '16px' }}>
            <span style={{ fontSize: '12px', fontWeight: '700', color: '#2563eb' }}>{day.fullLabel}</span>
            <h2 style={{ margin: '4px 0 0', fontSize: '19px', fontWeight: '800', color: '#0f172a' }}>{day.icon} {day.title}</h2>
          </div>

          <div style={{ background: '#ecfdf5', border: '1.5px solid #86efac', padding: '12px 16px', borderRadius: '14px', fontSize: '13px', lineHeight: '1.4', color: '#065f46', fontWeight: '600', marginBottom: '18px', boxShadow: '0 2px 6px rgba(16, 185, 129, 0.08)' }}>
            <b>🎯 אתגר היום:</b> {day.challenge}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {day.stops.map((stop, idx) => (
              <div key={idx} style={{ background: '#ffffff', border: '1.5px solid #cbd5e1', borderRadius: '16px', padding: '16px', boxShadow: '0 2px 8px rgba(15, 23, 42, 0.04)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                  <span style={{ fontSize: '11px', fontWeight: '800', color: '#0f172a', background: '#f8fafc', padding: '4px 8px', borderRadius: '8px', border: '1.5px solid #cbd5e1' }}>{stop.time}</span>
                  <h3 style={{ fontSize: '15px', fontWeight: '700', margin: 0, color: '#0f172a' }}>{stop.name}</h3>
                </div>
                <p style={{ fontSize: '13px', color: '#475569', margin: '4px 0 14px', lineHeight: '1.45' }}>{stop.note}</p>

                {stop.food && (
                  <div style={{ fontSize: '12px', background: '#fffbeb', color: '#92400e', padding: '12px 14px', borderRadius: '12px', marginBottom: '14px', border: '1.5px solid #fcd34d', display: 'flex', flexDirection: 'column', gap: '8px', fontWeight: '600', boxShadow: '0 2px 6px rgba(217, 119, 6, 0.06)' }}>
                    <span><b>🍴 המלצה קולינרית:</b> {stop.food.name}</span>
                    <a 
                      href={`https://www.waze.com/ul?q=${encodeURIComponent(stop.food.dest)}&navigate=yes`}
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#ffffff', color: '#0284c7', fontWeight: '700', fontSize: '12px', padding: '7px 12px', borderRadius: '10px', textDecoration: 'none', border: '1.5px solid #7dd3fc', alignSelf: 'flex-start', boxShadow: '0 2px 4px rgba(2, 132, 199, 0.08)' }}
                    >
                      {WAZE_SVG} נווט למסעדה ב-Waze
                    </a>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', paddingTop: '12px', borderTop: '1.5px solid #f1f5f9' }}>
                  <a href={`https://www.waze.com/ul?q=${encodeURIComponent(stop.dest)}&navigate=yes`} style={navBtnStyle}>
                    {WAZE_SVG} ניווט ב-Waze
                  </a>
                  <a href={`https://maps.apple.com/?q=${encodeURIComponent(stop.dest)}`} target="_blank" rel="noreferrer" style={navBtnStyle}>
                    {MAPS_SVG} ניווט במפות
                  </a>
                </div>

                {/* Parked Car Button */}
                <div style={{ marginTop: '8px', display: 'flex', gap: '8px' }}>
                  <a 
                    href="https://maps.apple.com/?q=Parked%20Car" 
                    target="_blank" 
                    rel="noreferrer"
                    style={{
                      flex: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      padding: '8px 12px',
                      borderRadius: '10px',
                      background: '#eff6ff',
                      color: '#1d4ed8',
                      border: '1.5px solid #93c5fd',
                      fontSize: '12px',
                      fontWeight: '700',
                      textDecoration: 'none',
                      boxSizing: 'border-box',
                      boxShadow: '0 1px 3px rgba(37, 99, 235, 0.05)'
                    }}
                  >
                    🚗 שמור/מצא רכב חונה (Apple Maps)
                  </a>
                  <button 
                    onClick={() => setModalType('parking')}
                    style={{
                      border: '1.5px solid #93c5fd',
                      background: '#ffffff',
                      color: '#1d4ed8',
                      borderRadius: '10px',
                      padding: '0 10px',
                      fontSize: '12px',
                      fontWeight: '700',
                      cursor: 'pointer',
                      boxShadow: '0 1px 3px rgba(37, 99, 235, 0.05)'
                    }}
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

      {/* MODAL: Italian Phrasebook & Live Voice Translator */}
      {modalType === 'phrasebook' && (
        <div style={modalStyle}>
          <div style={modalContentStyle}>
            <div style={{ background: '#ffffff', border: '1.5px solid #cbd5e1', borderRadius: '20px', padding: '22px', boxShadow: '0 8px 30px rgba(15, 23, 42, 0.08)', boxSizing: 'border-box', width: '100%' }}>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1.5px solid #f1f5f9', paddingBottom: '14px', marginBottom: '16px' }}>
                <div>
                  <small style={{ color: '#16a34a', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', fontSize: '11px' }}>דיבור ותרגום מהיר</small>
                  <h2 style={{ margin: '2px 0 0', fontSize: '19px', fontWeight: '800', color: '#0f172a' }}>🇮🇹 שיחון איטלקי חכם</h2>
                </div>
                <button onClick={() => setModalType(null)} style={modalCloseBtn}>✕</button>
              </div>

              {/* Live Voice Translation Box */}
              <div style={{ background: '#f0fdf4', border: '1.5px solid #86efac', borderRadius: '16px', padding: '16px', marginBottom: '20px', boxShadow: '0 2px 8px rgba(34, 197, 94, 0.08)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span style={{ fontSize: '13px', fontWeight: '800', color: '#166534' }}>🎙️ דבר בעברית ותרגם לאיטלקית:</span>
                  {isTranslating && <small style={{ color: '#15803d', fontWeight: '700' }}>מתרגם...</small>}
                </div>

                <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                  <input 
                    type="text"
                    placeholder="הקלד או לחץ על המיקרופון..."
                    value={hebrewInput}
                    onChange={(e) => setHebrewInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') translateText(hebrewInput); }}
                    style={{ flex: 1, padding: '10px 12px', borderRadius: '10px', border: '1px solid #86efac', fontSize: '13px', background: '#fff' }}
                  />
                  <button 
                    onClick={toggleListening}
                    style={{
                      background: isListening ? '#ef4444' : '#16a34a',
                      color: '#fff', border: 'none', borderRadius: '10px', width: '44px', height: '42px',
                      fontSize: '18px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.15)'
                    }}
                    title={isListening ? 'מקליט... לחץ לסיום' : 'לחץ ודבר בעברית'}
                  >
                    {isListening ? '⏹️' : '🎙️'}
                  </button>
                  <button 
                    onClick={() => translateText(hebrewInput)}
                    style={{ background: '#0f172a', color: '#fff', border: 'none', borderRadius: '10px', padding: '0 14px', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}
                  >
                    תרגם
                  </button>
                </div>

                {italianOutput && (
                  <div style={{ background: '#ffffff', borderRadius: '12px', padding: '12px 14px', border: '1.5px solid #bbf7d0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
                    <div style={{ textAlign: 'right', flex: 1 }}>
                      <span style={{ fontSize: '11px', color: '#64748b', display: 'block', fontWeight: '600' }}>איטלקית:</span>
                      <strong style={{ fontSize: '15px', color: '#0f172a', display: 'block', direction: 'ltr', textAlign: 'left' }}>{italianOutput}</strong>
                    </div>
                    <button 
                      onClick={() => speakItalian(italianOutput)}
                      style={{ background: '#ecfdf5', border: '1.5px solid #86efac', borderRadius: '10px', padding: '8px 12px', fontSize: '16px', cursor: 'pointer', color: '#166534', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px' }}
                      title="השמע באיטלקית"
                    >
                      🔊 השמע
                    </button>
                  </div>
                )}
              </div>

              {/* Ready Phrases Section */}
              <div style={{ borderBottom: '1.5px solid #f1f5f9', paddingBottom: '10px', marginBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: '800', fontSize: '14px', color: '#0f172a' }}>📚 משפטים שימושיים מוכנים</span>
              </div>

              {/* Categories Tabs */}
              <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '8px', marginBottom: '14px', scrollbarWidth: 'none' }}>
                {categories.map((cat, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedCategory(cat)}
                    style={{
                      flex: '0 0 auto', padding: '6px 12px', borderRadius: '10px', fontSize: '11px', fontWeight: '700', cursor: 'pointer',
                      background: selectedCategory === cat ? '#16a34a' : '#f8fafc',
                      color: selectedCategory === cat ? '#fff' : '#475569',
                      border: '1px solid #cbd5e1'
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Phrases List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {filteredPhrases.map((phrase, idx) => (
                  <div 
                    key={idx}
                    style={{
                      background: '#ffffff',
                      border: '1.5px solid #cbd5e1',
                      borderRadius: '14px',
                      padding: '12px 14px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      boxShadow: '0 2px 4px rgba(15, 23, 42, 0.03)'
                    }}
                  >
                    <div style={{ flex: 1, paddingLeft: '10px' }}>
                      <span style={{ fontSize: '13px', fontWeight: '800', color: '#0f172a', display: 'block' }}>{phrase.he}</span>
                      <strong style={{ fontSize: '14px', color: '#16a34a', display: 'block', margin: '2px 0', direction: 'ltr', textAlign: 'left' }}>{phrase.it}</strong>
                      <small style={{ fontSize: '11px', color: '#64748b', fontWeight: '600' }}>הגייה: {phrase.pro}</small>
                    </div>

                    <button 
                      onClick={() => speakItalian(phrase.it)}
                      style={{
                        background: '#f0fdf4',
                        border: '1.5px solid #86efac',
                        borderRadius: '10px',
                        width: '38px',
                        height: '38px',
                        fontSize: '16px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}
                      title="השמע הגייה"
                    >
                      🔊
                    </button>
                  </div>
                ))}
              </div>

            </div>
          </div>
        </div>
      )}

      {/* MODAL: Family Gallery & Photo Album */}
      {modalType === 'gallery' && (
        <div style={modalStyle}>
          <div style={modalContentStyle}>
            <div style={{ background: '#ffffff', border: '1.5px solid #cbd5e1', borderRadius: '20px', padding: '22px', boxShadow: '0 8px 30px rgba(15, 23, 42, 0.08)', boxSizing: 'border-box', width: '100%' }}>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1.5px solid #f1f5f9', paddingBottom: '14px', marginBottom: '16px' }}>
                <div>
                  <small style={{ color: '#a21caf', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', fontSize: '11px' }}>יומן וזיכרונות</small>
                  <h2 style={{ margin: '2px 0 0', fontSize: '19px', fontWeight: '800', color: '#0f172a' }}>📸 אלבום המסע המשפחתי</h2>
                </div>
                <button onClick={() => setModalType(null)} style={modalCloseBtn}>✕</button>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
                <button 
                  onClick={() => setShowGalleryUpload(!showGalleryUpload)} 
                  style={{ flex: 1, padding: '12px', borderRadius: '12px', fontWeight: '700', fontSize: '13px', cursor: 'pointer', border: 'none', background: '#a21caf', color: '#fff', boxShadow: '0 2px 6px rgba(162, 28, 175, 0.25)' }}
                >
                  📷 {showGalleryUpload ? 'סגור העלאה' : 'הוסף תמונה / סרטון'}
                </button>
              </div>

              {showGalleryUpload && (
                <div style={{ background: '#fdf4ff', padding: '16px', borderRadius: '14px', border: '1.5px solid #f0abfc', marginBottom: '18px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: '700', color: '#86198f', display: 'block', marginBottom: '4px' }}>שייך ליום במסלול:</label>
                    <select 
                      value={galleryDayFilter === 'all' ? activeDay : galleryDayFilter} 
                      onChange={(e) => setGalleryDayFilter(e.target.value)}
                      style={{ width: '100%', padding: '9px', borderRadius: '8px', border: '1px solid #f0abfc', background: '#fff', fontWeight: '600' }}
                    >
                      {tripDays.map((d, i) => (
                        <option key={i} value={i}>{d.label} - {d.title}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: '12px', fontWeight: '700', color: '#86198f', display: 'block', marginBottom: '4px' }}>מי מעלה?</label>
                    <select 
                      value={galleryAuthor} 
                      onChange={(e) => setGalleryAuthor(e.target.value)}
                      style={{ width: '100%', padding: '9px', borderRadius: '8px', border: '1px solid #f0abfc', background: '#fff', fontWeight: '600' }}
                    >
                      <option value="אריק">אריק</option>
                      <option value="עמית">עמית</option>
                      <option value="יולי">יולי</option>
                      <option value="ליאן">ליאן</option>
                      <option value="הראל">הראל</option>
                      <option value="משפחה">כולנו יחד 👨‍👩‍👧‍👧</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: '12px', fontWeight: '700', color: '#86198f', display: 'block', marginBottom: '4px' }}>תיאור קצר או כותרת (לא חובה):</label>
                    <input 
                      type="text" 
                      placeholder="לדוגמה: על הרכבת הרים בגרדלנד!" 
                      value={galleryCaption} 
                      onChange={(e) => setGalleryCaption(e.target.value)} 
                      style={{ width: '100%', padding: '9px', borderRadius: '8px', border: '1px solid #f0abfc', background: '#fff', boxSizing: 'border-box' }} 
                    />
                  </div>

                  <input type="file" id="cameraPhoto" accept="image/*" capture="environment" style={{ display: 'none' }} onChange={handleGalleryUpload} />
                  <input type="file" id="cameraVideo" accept="video/*" capture="environment" style={{ display: 'none' }} onChange={handleGalleryUpload} />
                  <input type="file" id="galleryMulti" accept="image/*,video/*" multiple style={{ display: 'none' }} onChange={handleGalleryUpload} />

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '6px', marginTop: '4px' }}>
                    <button onClick={() => document.getElementById('cameraPhoto').click()} style={galleryActionBtn}>📸 צלם תמונה</button>
                    <button onClick={() => document.getElementById('cameraVideo').click()} style={galleryActionBtn}>🎥 צלם וידאו</button>
                    <button onClick={() => document.getElementById('galleryMulti').click()} style={galleryActionBtn}>📁 בחר מהגלריה</button>
                  </div>
                </div>
              )}

              {/* Day Filter Pills */}
              <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '8px', marginBottom: '14px', scrollbarWidth: 'none' }}>
                <button
                  onClick={() => setGalleryDayFilter('all')}
                  style={{
                    flex: '0 0 auto', padding: '6px 12px', borderRadius: '10px', fontSize: '11px', fontWeight: '700', cursor: 'pointer',
                    background: galleryDayFilter === 'all' ? '#a21caf' : '#f8fafc',
                    color: galleryDayFilter === 'all' ? '#fff' : '#475569',
                    border: '1px solid #cbd5e1'
                  }}
                >
                  הכל ({galleryItems.length})
                </button>
                {tripDays.map((d, i) => (
                  <button
                    key={i}
                    onClick={() => setGalleryDayFilter(String(i))}
                    style={{
                      flex: '0 0 auto', padding: '6px 12px', borderRadius: '10px', fontSize: '11px', fontWeight: '700', cursor: 'pointer',
                      background: String(galleryDayFilter) === String(i) ? '#a21caf' : '#f8fafc',
                      color: String(galleryDayFilter) === String(i) ? '#fff' : '#475569',
                      border: '1px solid #cbd5e1'
                    }}
                  >
                    {d.label}
                  </button>
                ))}
              </div>

              {/* Photos & Videos Grid */}
              {filteredGallery.length === 0 ? (
                <div style={{ textAlign: 'center', color: '#94a3b8', padding: '36px 16px', fontSize: '13px', fontWeight: '500', background: '#f8fafc', borderRadius: '14px', border: '1px dashed #cbd5e1' }}>
                  📸 אין עדיין תמונות או סרטונים ביום זה.<br/>לחצו על <b>"הוסף תמונה / סרטון"</b> כדי להעלות את התמונה הראשונה!
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                  {filteredGallery.map((item) => {
                    const isVideo = (item.type || '').startsWith('video/');
                    const mediaUrl = item.blob ? URL.createObjectURL(item.blob) : '';
                    return (
                      <div 
                        key={item.id}
                        onClick={() => setLightboxItem(item)}
                        style={{
                          background: '#ffffff',
                          borderRadius: '12px',
                          border: '1.5px solid #e2e8f0',
                          overflow: 'hidden',
                          boxShadow: '0 2px 6px rgba(15, 23, 42, 0.04)',
                          cursor: 'pointer',
                          display: 'flex',
                          flexDirection: 'column',
                          position: 'relative'
                        }}
                      >
                        <div style={{ width: '100%', height: '120px', background: '#0f172a', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          {isVideo ? (
                            <video src={mediaUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          ) : (
                            <img src={mediaUrl} alt={item.caption || 'תמונה מהטיול'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          )}
                          {isVideo && (
                            <div style={{ position: 'absolute', background: 'rgba(0,0,0,0.6)', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '14px' }}>
                              ▶
                            </div>
                          )}
                          <span style={{ position: 'absolute', top: '6px', right: '6px', background: 'rgba(15, 23, 42, 0.75)', color: '#fff', fontSize: '9px', fontWeight: '700', padding: '2px 6px', borderRadius: '6px', backdropFilter: 'blur(4px)' }}>
                            {tripDays[item.dayIndex]?.label || 'כללי'}
                          </span>
                        </div>
                        <div style={{ padding: '8px 10px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                          <span style={{ fontSize: '12px', fontWeight: '700', color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {item.caption || item.name}
                          </span>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '10px', color: '#64748b', fontWeight: '600' }}>
                            <span>צילם/ה: {item.author}</span>
                            <button 
                              onClick={(e) => deleteGalleryItem(item.id, e)}
                              style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer', padding: '2px', fontWeight: '700' }}
                            >
                              מחק
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

            </div>
          </div>
        </div>
      )}

      {/* MODAL: Gallery Lightbox Viewer */}
      {lightboxItem && (
        <div 
          onClick={() => setLightboxItem(null)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.92)', zIndex: 3000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', backdropFilter: 'blur(8px)' }}
        >
          <div 
            onClick={(e) => e.stopPropagation()} 
            style={{ maxWidth: '500px', width: '100%', background: '#ffffff', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 10px 40px rgba(0,0,0,0.3)' }}
          >
            <div style={{ position: 'relative', background: '#000', maxHeight: '65vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {(lightboxItem.type || '').startsWith('video/') ? (
                <video src={URL.createObjectURL(lightboxItem.blob)} controls autoPlay style={{ width: '100%', maxHeight: '65vh' }} />
              ) : (
                <img src={URL.createObjectURL(lightboxItem.blob)} alt={lightboxItem.caption} style={{ width: '100%', maxHeight: '65vh', objectFit: 'contain' }} />
              )}
              <button 
                onClick={() => setLightboxItem(null)} 
                style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(0,0,0,0.6)', color: '#fff', border: 'none', width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer', fontWeight: '900', fontSize: '14px' }}
              >
                ✕
              </button>
            </div>
            <div style={{ padding: '16px', textAlign: 'right' }}>
              <h4 style={{ margin: '0 0 4px', fontSize: '15px', fontWeight: '800', color: '#0f172a' }}>{lightboxItem.caption || lightboxItem.name}</h4>
              <p style={{ margin: 0, fontSize: '12px', color: '#64748b', fontWeight: '600' }}>
                יום: {tripDays[lightboxItem.dayIndex]?.fullLabel || 'כללי'} · צילום: {lightboxItem.author}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Parking Guide */}
      {modalType === 'parking' && (
        <div style={modalStyle}>
          <div style={modalContentStyle}>
            <div style={{ background: '#ffffff', border: '1.5px solid #cbd5e1', borderRadius: '20px', padding: '22px', boxShadow: '0 8px 30px rgba(15, 23, 42, 0.08)', boxSizing: 'border-box' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', borderBottom: '1.5px solid #f1f5f9', paddingBottom: '12px' }}>
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '800', color: '#2563eb' }}>🚗 איך שומרים את הרכב ב-Apple Maps</h3>
                <button onClick={() => setModalType(null)} style={modalCloseBtn}>✕</button>
              </div>
              
              <div style={{ fontSize: '14px', lineHeight: '1.7', color: '#334155' }}>
                <p><b>1. אוטומטית (הכי נוח):</b><br/>
                אם האייפון מחובר ל-Bluetooth או ל-CarPlay ברכב השכור, ברגע שמכבים מנוע ומתנתקים – האייפון שומר <b>אוטומטית</b> את מיקום החניה.</p>
                
                <p><b>2. ידנית בלחיצה אחת:</b><br/>
                פותחים את אפליקציית Apple Maps ➔ לוחצים על <b>הנקודה הכחולה</b> (המיקום שלכם) ➔ ובוחרים ב-<b>"סמן מיקום רכב חונה" (Mark as Parked Car)</b>.</p>

                <p><b>3. איך חוזרים לרכב?</b><br/>
                פותחים את Apple Maps, לוחצים על הנעץ <b>Parked Car</b> ובוחרים בניווט רגלי 🚶‍♂️.</p>
                
                <a 
                  href="https://maps.apple.com/?q=Parked%20Car" 
                  target="_blank" 
                  rel="noreferrer"
                  style={{
                    display: 'block',
                    textAlign: 'center',
                    padding: '12px',
                    borderRadius: '12px',
                    background: '#2563eb',
                    color: '#fff',
                    fontWeight: '700',
                    textDecoration: 'none',
                    marginTop: '16px',
                    boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)'
                  }}
                >
                  🗺️ פתח עכשיו את Apple Maps
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Around Me */}
      {modalType === 'around' && (
        <div style={modalStyle}>
          <div style={modalContentStyle}>
            <div style={{ background: '#ffffff', border: '1.5px solid #cbd5e1', borderRadius: '20px', padding: '22px', boxShadow: '0 8px 30px rgba(15, 23, 42, 0.08)', boxSizing: 'border-box' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', borderBottom: '1.5px solid #f1f5f9', paddingBottom: '12px' }}>
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '800', color: '#0f172a' }}>📍 סביבי (Around Me)</h3>
                <button onClick={() => setModalType(null)} style={modalCloseBtn}>✕</button>
              </div>
              <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '18px' }}>בחר קטגוריה לצפייה במפה סביב מיקומך הנוכחי:</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <button onClick={() => window.location.href = 'https://maps.apple.com/?q=supermarket'} style={gridModalBtn}>🛒 <span>סופרמרקטים</span></button>
                <button onClick={() => window.location.href = 'https://maps.apple.com/?q=gas station'} style={gridModalBtn}>⛽ <span>תחנות דלק</span></button>
                <button onClick={() => window.location.href = 'https://maps.apple.com/?q=restaurants'} style={gridModalBtn}>🍝 <span>מסעדות ופיצריות</span></button>
                <button onClick={() => window.location.href = 'https://maps.apple.com/?q=pharmacy'} style={gridModalBtn}>💊 <span>בית מרקחת / פארם</span></button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Emergency */}
      {modalType === 'emergency' && (
        <div style={modalStyle}>
          <div style={modalContentStyle}>
            <div style={{ background: '#ffffff', border: '1.5px solid #cbd5e1', borderRadius: '20px', padding: '22px', boxShadow: '0 8px 30px rgba(15, 23, 42, 0.08)', boxSizing: 'border-box' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', borderBottom: '1.5px solid #f1f5f9', paddingBottom: '12px' }}>
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '800', color: '#dc2626' }}>🆘 מספרי חירום באיטליה</h3>
                <button onClick={() => setModalType(null)} style={modalCloseBtn}>✕</button>
              </div>
              <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '18px' }}>לחץ לחיוג מהיר ומיידי:</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <a href="tel:112" style={{ ...gridModalBtn, background: '#fef2f2', color: '#dc2626', borderColor: '#fca5a5', textDecoration: 'none' }}>🚨 <span>חירום כללי<br/><b>112</b></span></a>
                <a href="tel:118" style={{ ...gridModalBtn, background: '#fef2f2', color: '#dc2626', borderColor: '#fca5a5', textDecoration: 'none' }}>🚑 <span>אמבולנס<br/><b>118</b></span></a>
                <a href="tel:115" style={{ ...gridModalBtn, background: '#fef2f2', color: '#dc2626', borderColor: '#fca5a5', textDecoration: 'none' }}>🚒 <span>כבאות<br/><b>115</b></span></a>
                <a href="tel:113" style={{ ...gridModalBtn, background: '#fef2f2', color: '#dc2626', borderColor: '#fca5a5', textDecoration: 'none' }}>👮 <span>משטרה<br/><b>113</b></span></a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Tickets & Wallet */}
      {modalType === 'tickets' && (
        <div style={modalStyle}>
          <div style={modalContentStyle}>
            <div style={{ background: '#ffffff', border: '1.5px solid #cbd5e1', borderRadius: '20px', padding: '22px', boxShadow: '0 8px 30px rgba(15, 23, 42, 0.08)', boxSizing: 'border-box', width: '100%' }}>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1.5px solid #f1f5f9', paddingBottom: '14px', marginBottom: '16px' }}>
                <div>
                  <small style={{ color: '#2563eb', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', fontSize: '11px' }}>ארנק דיגיטלי</small>
                  <h2 style={{ margin: '2px 0 0', fontSize: '19px', fontWeight: '800', color: '#0f172a' }}>🎟️ כרטיסים ומסמכים</h2>
                </div>
                <button onClick={() => setModalType(null)} style={modalCloseBtn}>✕</button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '16px' }}>
                <button onClick={() => setShowUploadBox(!showUploadBox)} style={{ padding: '12px', borderRadius: '12px', fontWeight: '700', fontSize: '13px', cursor: 'pointer', border: 'none', background: '#0f172a', color: '#fff', boxShadow: '0 2px 6px rgba(15, 23, 42, 0.15)' }}>
                  ➕ הוסף כרטיס
                </button>
                <button onClick={addNewFolder} style={{ padding: '12px', borderRadius: '12px', fontWeight: '700', fontSize: '13px', cursor: 'pointer', border: '1.5px solid #cbd5e1', background: '#f8fafc', color: '#334155' }}>
                  📁 תקייה חדשה
                </button>
              </div>

              {showUploadBox && (
                <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '14px', border: '1px solid #cbd5e1', marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', display: 'block', marginBottom: '4px' }}>בחר תקייה לשמירה:</label>
                    <select value={selectedUploadFolder} onChange={(e) => setSelectedUploadFolder(e.target.value)} style={{ width: '100%', padding: '9px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#fff' }}>
                      {folders.map((f, i) => <option key={i} value={f}>{f}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', display: 'block', marginBottom: '4px' }}>שם הכרטיס / מסמך:</label>
                    <input type="text" placeholder="לדוגמה: כרטיס כניסה לפארק" value={newTicketTitle} onChange={(e) => setNewTicketTitle(e.target.value)} style={{ width: '100%', padding: '9px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#fff', boxSizing: 'border-box' }} />
                  </div>
                  <input type="file" id="cameraInput" accept="image/*" capture="environment" style={{ display: 'none' }} onChange={handleFileUpload} />
                  <input type="file" id="fileInput" accept="image/*,application/pdf" multiple style={{ display: 'none' }} onChange={handleFileUpload} />
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <button onClick={() => document.getElementById('cameraInput').click()} style={uploadBtnStyle}>📷 צלם במצלמה</button>
                    <button onClick={() => document.getElementById('fileInput').click()} style={uploadBtnStyle}>📁 בחר קובץ מהמכשיר</button>
                  </div>
                </div>
              )}

              <h3 style={{ fontSize: '14px', margin: '8px 0 10px', fontWeight: '800', color: '#334155' }}>תקיות הטיול</h3>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', 
                gap: '8px', 
                marginBottom: '18px' 
              }}>
                {folders.map((f, i) => (
                  <div 
                    key={i} 
                    onClick={() => setActiveFolder(f)}
                    style={{
                      padding: '10px 12px', borderRadius: '12px',
                      background: activeFolder === f ? '#0f172a' : '#f8fafc',
                      color: activeFolder === f ? '#ffffff' : '#334155',
                      border: activeFolder === f ? '1.5px solid #0f172a' : '1.5px solid #cbd5e1',
                      cursor: 'pointer', boxShadow: '0 2px 4px rgba(15, 23, 42, 0.03)',
                      display: 'flex', flexDirection: 'column', justifyContent: 'center'
                    }}
                  >
                    <strong style={{ display: 'block', fontSize: '12px', marginBottom: '2px' }}>{f}</strong>
                    <small style={{ color: activeFolder === f ? 'rgba(255,255,255,0.7)' : '#64748b', fontSize: '10px', fontWeight: '600' }}>הצג קבצים</small>
                  </div>
                ))}
              </div>

              <div style={{ borderBottom: '1.5px solid #f1f5f9', paddingBottom: '8px', marginBottom: '12px', fontWeight: '800', fontSize: '13px', color: '#0f172a' }}>
                תכולת תיקייה: {activeFolder}
              </div>

              {/* Files List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
                {ticketFiles.length === 0 ? (
                  <div style={{ textAlign: 'center', color: '#94a3b8', padding: '24px', fontSize: '13px', fontWeight: '500' }}>אין עדיין כרטיסים בתקייה זו.</div>
                ) : (
                  ticketFiles.map((x) => (
                    <div 
                      key={x.id} 
                      onClick={() => { setViewerItem(x); setModalType('viewer'); }}
                      style={{ 
                        display: 'flex', 
                        flexDirection: 'row', 
                        alignItems: 'center', 
                        justifyContent: 'space-between', 
                        gap: '12px', 
                        padding: '12px', 
                        borderRadius: '14px', 
                        background: '#ffffff', 
                        border: '1.5px solid #cbd5e1', 
                        cursor: 'pointer', 
                        boxShadow: '0 2px 6px rgba(15, 23, 42, 0.04)', 
                        boxSizing: 'border-box', 
                        width: '100%' 
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0, flex: 1 }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#f1f5f9', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0 }}>
                          {x.isFlightInfo ? '✈️' : (x.isInsuranceInfo ? '🛡️' : (x.isCarVoucher ? '🚗' : (x.isHotelInfo ? '🏡' : '📄')))}
                        </div>
                        <div style={{ minWidth: 0, textAlign: 'right', flex: 1 }}>
                          <b style={{ display: 'block', fontSize: '13px', fontWeight: '700', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: '#0f172a' }}>{x.title || x.name}</b>
                          <small style={{ color: '#64748b', fontSize: '11px', display: 'block', fontWeight: '500' }}>
                            {x.isFlightInfo ? 'ישראייר 4623652' : (x.isInsuranceInfo ? 'AIG פוליסה' : (x.isCarVoucher ? 'Ecovia השכרה' : (x.isHotelInfo ? 'Booking' : `${Math.round(x.size / 1024)} KB`)))}
                          </small>
                        </div>
                      </div>

                      <button 
                        onClick={(e) => deleteFile(x.id, e)} 
                        style={{ background: '#fef2f2', color: '#dc2626', border: '1.5px solid #fca5a5', padding: '5px 10px', borderRadius: '8px', fontSize: '11px', fontWeight: '700', cursor: 'pointer', flexShrink: 0 }}
                      >
                        מחק
                      </button>
                    </div>
                  ))
                )}
              </div>

            </div>
          </div>
        </div>
      )}

      {/* MODAL: Full Viewer */}
      {modalType === 'viewer' && viewerItem && (
        <div style={modalStyle}>
          <div style={modalContentStyle}>
            <div style={{ background: '#ffffff', border: '1.5px solid #cbd5e1', borderRadius: '20px', padding: '22px', boxShadow: '0 8px 30px rgba(15, 23, 42, 0.08)', boxSizing: 'border-box' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1.5px solid #f1f5f9', paddingBottom: '12px', marginBottom: '16px' }}>
                <span style={{ fontSize: '16px', fontWeight: '800', color: '#0f172a' }}>{viewerItem.title || viewerItem.name}</span>
                <button onClick={() => setModalType('tickets')} style={modalCloseBtn}>✕</button>
              </div>

              {viewerItem.isFlightInfo && (
                <div style={{ lineHeight: '1.8', fontSize: '14px', color: '#334155' }}>
                  <h3 style={{ color: '#2563eb', margin: '0 0 10px', fontSize: '16px' }}>✈️ פרטי טיסה – ישראייר</h3>
                  <p><b>מספר הזמנה (Docket):</b> <span dir="ltr">4623652</span></p>
                  <p><b>טיסת הלוך (30.09.2026):</b><br/>שעה: <span dir="ltr">13:15</span> מתל אביב (טרמינל 1) ➔ <span dir="ltr">16:05</span> בוורונה<br/>טיסה: <span dir="ltr">6H 357</span> (Economy)</p>
                  <p><b>טיסת חזור (06.10.2026):</b><br/>שעה: <span dir="ltr">21:35</span> מוורונה ➔ <span dir="ltr">02:05</span> בתל אביב (07.10)<br/>טיסה: <span dir="ltr">6H 352</span> (Economy)</p>
                  <hr style={{ border: 0, borderTop: '1.5px solid #f1f5f9', margin: '14px 0' }}/>
                  <b>נוסעים בהזמנה:</b>
                  <ul style={{ paddingRight: '20px', margin: '6px 0', color: '#475569' }}>
                    <li>Arik Cohen (28/12/1967)</li>
                    <li>Amit Cohen (01/07/2014)</li>
                    <li>Yuly Cohen (01/07/2014)</li>
                    <li>Lian Cohen (14/10/2015)</li>
                    <li>Harel Vilnai Cohen (04/09/1997)</li>
                  </ul>
                </div>
              )}

              {viewerItem.isInsuranceInfo && (
                <div style={{ lineHeight: '1.8', fontSize: '14px', color: '#334155' }}>
                  <h3 style={{ color: '#2563eb', margin: '0 0 10px', fontSize: '16px' }}>🛡️ ביטוח נסיעות לחו"ל – AIG</h3>
                  <p><b>מספר פוליסה:</b> <span dir="ltr">170270213826</span></p>
                  <p><b>מוקד חירום רפואי 24/7 (עברית):</b></p>
                  <ul style={{ paddingRight: '20px', margin: '6px 0' }}>
                    <li>WhatsApp: <a href="https://wa.me/972549940911" target="_blank" rel="noreferrer" style={{ color: '#2563eb' }} dir="ltr">+972-54-9940911</a></li>
                    <li>טלפון ישיר: <a href="tel:+97239191155" style={{ color: '#2563eb' }} dir="ltr">+972-3-9191155</a></li>
                  </ul>
                  <hr style={{ border: 0, borderTop: '1.5px solid #f1f5f9', margin: '14px 0' }}/>
                  <a href="https://www.aig.co.il/t/6b66x6" target="_blank" rel="noreferrer" style={{ display: 'block', padding: '12px', background: '#2563eb', color: '#fff', borderRadius: '12px', textAlign: 'center', textDecoration: 'none', fontWeight: '700', marginTop: '10px', boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)' }}>כניסה לאזור האישי של AIG</a>
                </div>
              )}

              {viewerItem.isCarVoucher && (
                <div style={{ lineHeight: '1.8', fontSize: '14px', color: '#334155' }}>
                  <h3 style={{ color: '#2563eb', margin: '0 0 10px', fontSize: '16px' }}>🚗 שובר השכרת רכב – Booking.com (Ecovia)</h3>
                  <p><b>מספר הזמנה:</b> <span dir="ltr">724715780</span></p>
                  <p><b>רכב:</b> Intermediate SUV – Citroen C5 Aircross או דומה (אוטומטי)</p>
                  <p><b>איסוף:</b> 30.09.2026 ב-17:30 – נמל התעופה ורונה</p>
                  <p><b>החזרה:</b> 06.10.2026 ב-17:30 – נמל התעופה ורונה</p>
                  <p><b>נהג ראשי:</b> <span dir="ltr">Cohen Arik (+972502022768)</span></p>
                  <p><b>ביטוח:</b> <span style={{ color: '#059669', fontWeight: '700' }}>הגנה מלאה כלולה (Full Protection)</span></p>
                  <a href="https://www.booking.com" target="_blank" rel="noreferrer" style={{ display: 'block', padding: '12px', background: '#0284c7', color: '#fff', borderRadius: '12px', textAlign: 'center', textDecoration: 'none', fontWeight: '700', marginTop: '14px', boxShadow: '0 4px 12px rgba(2, 132, 199, 0.25)' }}>📱 פתח ב-Booking.com</a>
                </div>
              )}

              {viewerItem.isHotelInfo && (
                <div style={{ lineHeight: '1.8', fontSize: '14px', color: '#334155' }}>
                  <h3 style={{ color: '#2563eb', margin: '0 0 10px', fontSize: '16px' }}>🏡 הזמנת מלון – Bio Agriturismo Vojon</h3>
                  <p><b>סטטוס הזמנה:</b> <span style={{ color: '#059669', fontWeight: '700' }}>Confirmed (מאושר)</span></p>
                  <p><b>כתובת:</b> <span dir="ltr">Via Del Forte 6, 46040 Ponti Sul Mincio, Italy</span></p>
                  <p><b>תאריכים:</b> 30.09.2026 – 06.10.2026 (6 לילות)</p>
                  <p><b>טלפון:</b> <a href="tel:+393792027060" style={{ color: '#2563eb' }} dir="ltr">+39 379 202 7060</a></p>
                  
                  <a href={`https://www.waze.com/ul?q=${encodeURIComponent('Bio Agriturismo Vojon, Ponti sul Mincio, Italy')}&navigate=yes`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '12px', background: '#fff', border: '1.5px solid #38bdf8', color: '#0284c7', borderRadius: '12px', textDecoration: 'none', fontWeight: '700', marginTop: '14px', boxShadow: '0 2px 6px rgba(2, 132, 199, 0.1)' }}>
                    {WAZE_SVG} נווט למלון ב-Waze
                  </a>
                </div>
              )}

              {viewerItem.blob && (viewerItem.type || '').startsWith('image/') && (
                <img src={URL.createObjectURL(viewerItem.blob)} alt="מסמך" style={{ width: '100%', borderRadius: '12px', marginTop: '10px', border: '1.5px solid #cbd5e1' }} />
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

const sidebarBtnStyle = {
  background: '#f8fafc',
  border: '1.5px solid #cbd5e1',
  padding: '12px 14px',
  borderRadius: '12px',
  fontWeight: '700',
  fontSize: '13px',
  textAlign: 'right',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  color: '#334155',
  boxShadow: '0 2px 4px rgba(15, 23, 42, 0.03)'
};

const navBtnStyle = {
  fontSize: '12px',
  fontWeight: '700',
  color: '#334155',
  background: '#f8fafc',
  padding: '9px',
  borderRadius: '10px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '6px',
  cursor: 'pointer',
  border: '1.5px solid #cbd5e1',
  boxShadow: '0 2px 4px rgba(15, 23, 42, 0.03)',
  textDecoration: 'none'
};

const modalStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  width: '100vw',
  height: '100vh',
  background: '#f1f5f9',
  zIndex: 2000,
  overflowY: 'auto',
  overflowX: 'hidden',
  WebkitOverflowScrolling: 'touch',
  direction: 'rtl'
};

const modalContentStyle = {
  width: '100%',
  maxWidth: '600px',
  margin: '0 auto',
  padding: '16px 16px 40px',
  boxSizing: 'border-box',
  minHeight: '100vh',
  background: '#f1f5f9'
};

const modalCloseBtn = {
  border: '1.5px solid #94a3b8',
  background: '#ffffff',
  width: '36px',
  height: '36px',
  borderRadius: '50%',
  fontWeight: '900',
  fontSize: '15px',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#0f172a',
  boxShadow: '0 2px 5px rgba(15, 23, 42, 0.08)',
  lineHeight: 1
};

const gridModalBtn = {
  padding: '14px',
  borderRadius: '12px',
  background: '#ffffff',
  border: '1.5px solid #cbd5e1',
  fontWeight: '700',
  fontSize: '13px',
  textAlign: 'center',
  cursor: 'pointer',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '6px',
  color: '#334155',
  boxShadow: '0 2px 4px rgba(15, 23, 42, 0.03)'
};

const uploadBtnStyle = {
  width: '100%',
  padding: '11px',
  borderRadius: '10px',
  background: '#ffffff',
  color: '#334155',
  border: '1.5px solid #cbd5e1',
  fontWeight: '700',
  cursor: 'pointer',
  fontSize: '12px'
};

const galleryActionBtn = {
  padding: '10px 6px',
  borderRadius: '10px',
  background: '#ffffff',
  border: '1px solid #f0abfc',
  color: '#86198f',
  fontWeight: '700',
  fontSize: '11px',
  cursor: 'pointer',
  boxShadow: '0 1px 3px rgba(162, 28, 175, 0.08)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center'
};
