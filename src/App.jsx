import React, { useState, useEffect } from 'react';

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
    <rect width="512" height="512" rx="110" fill="#e2fbe5"/>
    <path d="M120 392l80-160 160-80-80 160z" fill="#34c759"/>
    <path d="M200 232l152-72-72 152-80-80z" fill="#007aff"/>
    <circle cx="260" cy="260" r="50" fill="#fff"/>
    <polygon points="260,225 240,290 260,275 280,290" fill="#007aff"/>
  </svg>
);

const tripDays = [
  {
    date: "2026-09-30",
    label: "יום 1 · 30/09",
    fullLabel: "רביעי · 30.09.2026",
    title: "נחיתה והגעה למלון",
    icon: "✈️",
    challenge: "לצלם את התמונה המשפחתית הראשונה באיטליה.",
    stops: [
      { time: "16:00", name: "נחיתה בנמל התעופה ורונה", dest: "Verona Villafranca Airport", note: "איסוף מזוודות ורכב שכור." },
      { time: "18:00", name: "נסיעה למלון וארוחת ערב", dest: "Bio Agriturismo Vojon, Ponti sul Mincio, Italy", note: "צ׳ק-אין, התארגנות וארוחת ערב פיצה/פסטה משפחתית במסעדה מקומית סמוכה + גלידה ראשונה בפסקיירה.", food: { name: "🍕 פיצריה מקומית + גלידה בפסקיירה", dest: "Peschiera del Garda, Italy" } }
    ]
  },
  {
    date: "2026-10-01",
    label: "יום 2 · 01/10",
    fullLabel: "חמישי · 01.10.2026",
    title: "Gardaland – יום פארק מלא",
    icon: "🎢",
    challenge: "לבחור יחד את שלושת המתקנים הכי טובים של היום.",
    stops: [
      { time: "08:30", name: "יציאה מהמלון ל-Gardaland", dest: "Gardaland Resort, Via Derna 4, Castelnuovo del Garda", note: "לצאת מוקדם ולהגיע בנחת לפני הכניסה." },
      { time: "09:00", name: "חניה וכניסה ל-Gardaland", dest: "Gardaland Parking, Castelnuovo del Garda", note: "לשמור באפליקציה את מיקום הרכב." },
      { time: "13:00", name: "ארוחת צהריים בפארק", dest: "Gardaland Resort", note: "אוכל מהיר, פיצות והמבורגרים בתוך הפארק.", food: { name: "🍔 Aladino Pizza & Burger (בתוך הפארק)", dest: "Gardaland Resort" } },
      { time: "19:00", name: "ארוחת ערב", dest: "Osteria Sottoportego, Peschiera del Garda", note: "פסטות מעולות ואווירה על המים בפסקיירה דל גארדה.", food: { name: "🍝 Osteria Sottoportego", dest: "Osteria Sottoportego, Peschiera del Garda" } }
    ]
  },
  {
    date: "2026-10-02",
    label: "יום 3 · 02/10",
    fullLabel: "שישי · 02.10.2026",
    title: "סובב אגם גארדה + ראפטינג",
    icon: "🚣",
    challenge: "לצלם תמונה משפחתית אחת עם האגם ואחת מהראפטינג.",
    stops: [
      { time: "08:00", name: "יציאה צפונה לאורך החוף המזרחי", dest: "Malcesine, Italy", note: "נסיעה נופית ועצירה במלצ׳סינה." },
      { time: "12:00", name: "ארוחת צהריים בלימונה", dest: "Limone sul Garda, Italy", note: "עצירה בלימונה לספוג נוף ואוכל טוב.", food: { name: "🍕 Ristorante Pizzeria La Terrazza + גלידת לימון", dest: "Limone sul Garda, Italy" } },
      { time: "14:30", name: "יציאה לראפטינג ב-Valdadige", dest: "Visit Valdadige, Via San Martino, Volargne, Italy", note: "ראפטינג משפחתי על נהר האדיג׳ה." }
    ]
  },
  {
    date: "2026-10-03",
    label: "יום 4 · 03/10",
    fullLabel: "שבת · 03.10.2026",
    title: "Movieland + Medieval Times",
    icon: "🎬",
    challenge: "לצלם סלפי משפחתי שנראה כמו פוסטר של סרט.",
    stops: [
      { time: "09:00", name: "יציאה ל-Movieland", dest: "Movieland The Hollywood Park, Via Fossalta 58, Lazise", note: "יום סרטים ואקשן." },
      { time: "20:00", name: "Medieval Times – מופע האבירים", dest: "Medieval Times, Via Fossalta 58, Lazise", note: "מופע ערב וארוחה שחיתות בלי סכו״ם (עם הידיים!).", food: { name: "🍗 Medieval Times (אכילה בידיים!)", dest: "Medieval Times, Via Fossalta 58, Lazise" } }
    ]
  },
  {
    date: "2026-10-04",
    label: "יום 5 · 04/10",
    fullLabel: "ראשון · 04.10.2026",
    title: "ונציה – יום מלא",
    icon: "🛶",
    challenge: "למצוא גשר קטן ויפה מחוץ למסלול הראשי.",
    stops: [
      { time: "07:30", name: "יציאה מוקדמת מהמלון לוונציה", dest: "Venezia Tronchetto Parking, Isola Nova del Tronchetto, Venezia", note: "חניית טרונקטו ומעבר למרכז." },
      { time: "12:30", name: "ארוחת צהריים בוונציה", dest: "Pizzeria L'Anfora, Venezia", note: "פיצרייה שכונתית מעולה הרחק מההמונים של סן מרקו.", food: { name: "🍕 Pizzeria L'Anfora + גלידת Suso", dest: "Calle Larga dei Bari, 1223, Venezia" } }
    ]
  },
  {
    date: "2026-10-05",
    label: "יום 6 · 05/10",
    fullLabel: "שני · 05.10.2026",
    title: "Borghetto sul Mincio + Valeggio",
    icon: "🏘️",
    challenge: "לצלם תמונת בת מצווה מיוחדת בין טחנות המים.",
    stops: [
      { time: "10:00", name: "Borghetto – הכפר והטחנות", dest: "Borghetto sul Mincio, Italy", note: "טיול רגלי בין הנהר והגשרים." },
      { time: "12:30", name: "ארוחת צהריים – הטורטליני המפורסם", dest: "Ristorante Alla Borsa, Valeggio sul Mincio, Italy", note: "הבית המקורי של כיסוני הטורטליני המכונים 'קשר האהבה'.", food: { name: "🍝 Ristorante Alla Borsa (טורטליני מקורי)", dest: "Ristorante Alla Borsa, Valeggio sul Mincio" } }
    ]
  },
  {
    date: "2026-10-06",
    label: "יום 7 · 06/10",
    fullLabel: "שלישי · 06.10.2026",
    title: "ורונה + הטיסה הביתה",
    icon: "❤️",
    challenge: "לבחור יחד את רגע השיא של כל הטיול.",
    stops: [
      { time: "09:00", name: "צ׳ק-אאוט ויציאה לוורונה", dest: "Parcheggio Cittadella, Piazza Cittadella, Verona", note: "סיור קצר בוורונה והבית של יוליה." },
      { time: "13:00", name: "ארוחת צהריים מסכמת בוורונה", dest: "Pizzeria Saporè Downtown, Verona", note: "ארוחת פרידה מעולה מאיטליה עם פיצות גורמה ופסטות.", food: { name: "🍕 Pizzeria Saporè Downtown", dest: "Pizzeria Saporè, Verona" } },
      { time: "18:30", name: "החזרת הרכב בשדה התעופה", dest: "Verona Villafranca Airport", note: "טיסה חזרה הביתה." }
    ]
  }
];

const TICKET_DEFAULT_FOLDERS = ['✈️ טיסות ורכב', '🏡 מלון', '🎢 Gardaland', '🚣 ראפטינג', '🎬 Movieland', '🏰 Medieval Times', '🚤 ונציה'];

export default function App() {
  const [activeDay, setActiveDay] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [modalType, setModalType] = useState(null); // 'around' | 'emergency' | 'tickets' | 'viewer'
  const [viewerItem, setViewerItem] = useState(null);

  // Tickets State
  const [folders, setFolders] = useState(TICKET_DEFAULT_FOLDERS);
  const [activeFolder, setActiveFolder] = useState('✈️ טיסות ורכב');
  const [ticketFiles, setTicketFiles] = useState([]);
  const [showUploadBox, setShowUploadBox] = useState(false);
  const [newTicketTitle, setNewTicketTitle] = useState('');
  const [selectedUploadFolder, setSelectedUploadFolder] = useState('✈️ טיסות ורכב');

  // Load Folders & DB Setup
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('garda-ticket-folders'));
      if (Array.isArray(saved) && saved.length) setFolders(saved);
    } catch (e) {}
    initTickets();
  }, []);

  useEffect(() => {
    loadFiles(activeFolder);
  }, [activeFolder]);

  const openDb = () => {
    return new Promise((resolve, reject) => {
      const req = indexedDB.open('gardaTicketsDB', 1);
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

  const day = tripDays[activeDay];

  return (
    <div style={{ background: '#f5f5f7', minHeight: '100vh', fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif', color: '#1d1d1f', direction: 'rtl', paddingBottom: '40px' }}>
      
      {/* Header */}
      <header style={{
        padding: '16px 20px',
        background: 'rgba(255, 255, 255, 0.88)',
        borderBottom: '1px solid rgba(0,0,0,0.1)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'sticky',
        top: 0,
        zIndex: 900,
        backdropFilter: 'blur(20px)'
      }}>
        <button 
          onClick={() => setSidebarOpen(true)}
          style={{
            background: '#fff', border: '1px solid rgba(0,0,0,0.12)', width: '42px', height: '42px',
            borderRadius: '14px', fontSize: '20px', fontWeight: 'bold', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
          }}
        >
          ☰
        </button>

        <div style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: '17px', fontWeight: '800', margin: '0 0 2px' }}>אגם גארדה וונציה</h1>
          <p style={{ fontSize: '11px', color: '#86868b', margin: 0, fontWeight: '500' }}>טיול בת מצווה · 30.09 - 06.10.2026</p>
        </div>

        <button 
          onClick={() => {
            setActiveFolder('🏡 מלון');
            setModalType('tickets');
          }}
          style={{
            background: '#fff', border: '1px solid rgba(0,0,0,0.12)', padding: '6px 12px',
            borderRadius: '20px', fontSize: '11px', fontWeight: '600', color: '#1d1d1f', cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
          }}
        >
          🏡 Bio Vojon
        </button>
      </header>

      {/* Sidebar Overlay & Drawer */}
      {sidebarOpen && (
        <div 
          onClick={() => setSidebarOpen(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 2500, backdropFilter: 'blur(8px)' }}
        />
      )}
      <aside style={{
        position: 'fixed', top: 0, bottom: 0, right: sidebarOpen ? 0 : '-340px', width: '300px',
        background: 'rgba(255,255,255,0.96)', zIndex: 2600, boxShadow: '-20px 0 50px rgba(0,0,0,0.15)',
        transition: 'right 0.35s cubic-bezier(0.16, 1, 0.3, 1)', padding: '32px 24px',
        display: 'flex', flexDirection: 'column', gap: '14px', backdropFilter: 'blur(25px)',
        borderLeft: '1px solid rgba(0,0,0,0.1)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(0,0,0,0.1)', paddingBottom: '14px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '700', margin: 0 }}>ניווט מהיר</h3>
          <button 
            onClick={() => setSidebarOpen(false)}
            style={{ border: '1px solid rgba(0,0,0,0.12)', background: '#f5f5f7', width: '34px', height: '34px', borderRadius: '50%', fontWeight: '700', cursor: 'pointer' }}
          >
            ✕
          </button>
        </div>
        <button onClick={() => { setSidebarOpen(false); setModalType(null); }} style={sidebarBtnStyle}><span>📅</span> הצג מסלול ימים</button>
        <button onClick={() => { setSidebarOpen(false); setModalType('around'); }} style={sidebarBtnStyle}><span>📍</span> Around Me</button>
        <button onClick={() => { setSidebarOpen(false); setModalType('tickets'); }} style={sidebarBtnStyle}><span>🎟️</span> ארנק כרטיסים</button>
        <button onClick={() => { setSidebarOpen(false); setModalType('emergency'); }} style={{ ...sidebarBtnStyle, background: 'rgba(255, 59, 48, 0.06)', color: '#ff3b30', borderColor: 'rgba(255,59,48,0.25)' }}><span>🆘</span> מספרי חירום</button>
      </aside>

      {/* Main Container */}
      <main style={{ padding: '16px', maxWidth: '600px', margin: 'auto' }}>
        
        {/* Day Selector Tabs */}
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '10px', marginBottom: '16px', scrollbarWidth: 'none' }}>
          {tripDays.map((d, i) => (
            <button
              key={i}
              onClick={() => setActiveDay(i)}
              style={{
                flex: '0 0 auto',
                padding: '10px 18px',
                borderRadius: '14px',
                background: activeDay === i ? '#1d1d1f' : '#ffffff',
                color: activeDay === i ? '#ffffff' : '#86868b',
                border: activeDay === i ? '1px solid #1d1d1f' : '1px solid rgba(0,0,0,0.12)',
                fontSize: '12px',
                fontWeight: '700',
                cursor: 'pointer',
                boxShadow: activeDay === i ? '0 6px 16px rgba(0,0,0,0.12)' : '0 2px 6px rgba(0,0,0,0.03)',
                transition: 'all 0.2s ease'
              }}
            >
              {d.label}
            </button>
          ))}
        </div>

        {/* Selected Day Content */}
        <section style={{ background: '#ffffff', border: '1px solid rgba(0,0,0,0.12)', borderRadius: '20px', padding: '22px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
          <div style={{ borderBottom: '1px solid rgba(0,0,0,0.08)', paddingBottom: '14px', marginBottom: '14px' }}>
            <span style={{ fontSize: '12px', fontWeight: '600', color: '#0071e3' }}>{day.fullLabel}</span>
            <h2 style={{ margin: '4px 0 0', fontSize: '19px', fontWeight: '800' }}>{day.icon} {day.title}</h2>
          </div>

          <div style={{ background: 'rgba(52, 199, 89, 0.08)', border: '1px solid rgba(52, 199, 89, 0.25)', padding: '14px 16px', borderRadius: '14px', fontSize: '13px', lineHeight: '1.4', color: '#1b5e20', fontWeight: '500', marginBottom: '16px' }}>
            <b>אתגר:</b> {day.challenge}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {day.stops.map((stop, idx) => (
              <div key={idx} style={{ background: '#ffffff', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '16px', padding: '18px', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                  <span style={{ fontSize: '11px', fontWeight: '700', color: '#1d1d1f', background: '#f5f5f7', padding: '5px 10px', borderRadius: '8px', border: '1.5px solid rgba(0,0,0,0.08)' }}>{stop.time}</span>
                  <h3 style={{ fontSize: '16px', fontWeight: '700', margin: 0 }}>{stop.name}</h3>
                </div>
                <p style={{ fontSize: '13px', color: '#86868b', margin: '6px 0 14px', lineHeight: '1.4' }}>{stop.note}</p>

                {stop.food && (
                  <div style={{ fontSize: '12px', background: 'rgba(255, 149, 0, 0.08)', color: '#b45309', padding: '14px', borderRadius: '14px', marginBottom: '14px', border: '1px solid rgba(255, 149, 0, 0.25)', display: 'flex', flexDirection: 'column', gap: '8px', fontWeight: '500' }}>
                    <span><b>המלצה קולינרית:</b> {stop.food.name}</span>
                    <a 
                      href={`https://www.waze.com/ul?q=${encodeURIComponent(stop.food.dest)}&navigate=yes`}
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#ffffff', color: '#0077b6', fontWeight: '700', fontSize: '12px', padding: '8px 14px', borderRadius: '10px', textDecoration: 'none', border: '1px solid #33ccff', alignSelf: 'flex-start' }}
                    >
                      {WAZE_SVG} נווט למסעדה ב-Waze
                    </a>
                  </div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', paddingTop: '14px', borderTop: '1px solid rgba(0,0,0,0.08)' }}>
                  <a href={`https://www.waze.com/ul?q=${encodeURIComponent(stop.dest)}&navigate=yes`} style={navBtnStyle}>
                    {WAZE_SVG} Waze
                  </a>
                  <a href={`https://maps.apple.com/?q=${encodeURIComponent(stop.dest)}`} target="_blank" rel="noreferrer" style={navBtnStyle}>
                    {MAPS_SVG} Maps
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* MODAL: Around Me */}
      {modalType === 'around' && (
        <div style={modalStyle}>
          <div style={modalContentStyle}>
            <button onClick={() => setModalType(null)} style={modalCloseBtn}>✕</button>
            <h3 style={{ margin: '0 0 8px', fontSize: '20px', fontWeight: '700' }}>📍 Around Me</h3>
            <p style={{ fontSize: '13px', color: '#86868b', marginBottom: '20px' }}>בחר קטגוריה לצפייה במפה סביבך:</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <button onClick={() => window.location.href = 'https://maps.apple.com/?q=supermarket'} style={gridModalBtn}>🛒 <span>סופרמרקטים</span></button>
              <button onClick={() => window.location.href = 'https://maps.apple.com/?q=gas station'} style={gridModalBtn}>⛽ <span>תחנות דלק</span></button>
              <button onClick={() => window.location.href = 'https://maps.apple.com/?q=restaurants'} style={gridModalBtn}>🍝 <span>מסעדות</span></button>
              <button onClick={() => window.location.href = 'https://maps.apple.com/?q=pharmacy'} style={gridModalBtn}>💊 <span>סופרפארם / בית מרקחת</span></button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Emergency */}
      {modalType === 'emergency' && (
        <div style={modalStyle}>
          <div style={modalContentStyle}>
            <button onClick={() => setModalType(null)} style={modalCloseBtn}>✕</button>
            <h3 style={{ margin: '0 0 8px', fontSize: '20px', fontWeight: '700', color: '#ff3b30' }}>🆘 מספרי חירום באיטליה</h3>
            <p style={{ fontSize: '13px', color: '#86868b', marginBottom: '20px' }}>לחץ לחיוג מהיר:</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <a href="tel:112" style={{ ...gridModalBtn, background: 'rgba(255,59,48,0.06)', color: '#ff3b30', borderColor: 'rgba(255,59,48,0.25)', textDecoration: 'none' }}>🚨 <span>חירום כללי<br/><b>112</b></span></a>
              <a href="tel:118" style={{ ...gridModalBtn, background: 'rgba(255,59,48,0.06)', color: '#ff3b30', borderColor: 'rgba(255,59,48,0.25)', textDecoration: 'none' }}>🚑 <span>אמבולנס<br/><b>118</b></span></a>
              <a href="tel:115" style={{ ...gridModalBtn, background: 'rgba(255,59,48,0.06)', color: '#ff3b30', borderColor: 'rgba(255,59,48,0.25)', textDecoration: 'none' }}>🚒 <span>כבאות<br/><b>115</b></span></a>
              <a href="tel:113" style={{ ...gridModalBtn, background: 'rgba(255,59,48,0.06)', color: '#ff3b30', borderColor: 'rgba(255,59,48,0.25)', textDecoration: 'none' }}>👮 <span>משטרה<br/><b>113</b></span></a>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Tickets & Wallet */}
      {modalType === 'tickets' && (
        <div style={modalStyle}>
          <div style={modalContentStyle}>
            <button onClick={() => setModalType(null)} style={modalCloseBtn}>✕</button>
            
            <div style={{ borderBottom: '1px solid rgba(0,0,0,0.1)', paddingBottom: '14px', marginBottom: '16px' }}>
              <small style={{ color: '#86868b', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Digital Wallet</small>
              <h2 style={{ margin: '4px 0 0', fontSize: '22px', fontWeight: '800' }}>🎟️ כרטיסים ומסמכים</h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '16px' }}>
              <button onClick={() => setShowUploadBox(!showUploadBox)} style={{ padding: '14px', borderRadius: '14px', fontWeight: '700', fontSize: '13px', cursor: 'pointer', border: 'none', background: '#1d1d1f', color: '#fff' }}>
                ➕ הוסף כרטיס חדש
              </button>
              <button onClick={addNewFolder} style={{ padding: '14px', borderRadius: '14px', fontWeight: '700', fontSize: '13px', cursor: 'pointer', border: '1px solid rgba(0,0,0,0.12)', background: '#fff', color: '#1d1d1f' }}>
                📁 תקייה חדשה
              </button>
            </div>

            {showUploadBox && (
              <div style={{ background: '#f2f2f7', padding: '18px', borderRadius: '16px', border: '1.5px solid rgba(0,0,0,0.1)', marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '700', color: '#86868b', display: 'block', marginBottom: '4px' }}>בחר תקייה לשמירה:</label>
                  <select value={selectedUploadFolder} onChange={(e) => setSelectedUploadFolder(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid rgba(0,0,0,0.15)', background: '#fff' }}>
                    {folders.map((f, i) => <option key={i} value={f}>{f}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '700', color: '#86868b', display: 'block', marginBottom: '4px' }}>שם הכרטיס / מסמך:</label>
                  <input type="text" placeholder="לדוגמה: כרטיס כניסה לפארק" value={newTicketTitle} onChange={(e) => setNewTicketTitle(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid rgba(0,0,0,0.15)', background: '#fff', boxSizing: 'border-box' }} />
                </div>
                <input type="file" id="cameraInput" accept="image/*" capture="environment" style={{ display: 'none' }} onChange={handleFileUpload} />
                <input type="file" id="fileInput" accept="image/*,application/pdf" multiple style={{ display: 'none' }} onChange={handleFileUpload} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <button onClick={() => document.getElementById('cameraInput').click()} style={uploadBtnStyle}>📷 צלם במצלמה</button>
                  <button onClick={() => document.getElementById('fileInput').click()} style={uploadBtnStyle}>📁 בחר קובץ מהמכשיר</button>
                </div>
              </div>
            )}

            <h3 style={{ fontSize: '15px', margin: '8px 0 10px', fontWeight: '700' }}>תקיות הטיול</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '16px' }}>
              {folders.map((f, i) => (
                <div 
                  key={i} 
                  onClick={() => setActiveFolder(f)}
                  style={{
                    padding: '12px 14px', borderRadius: '14px',
                    background: activeFolder === f ? '#1d1d1f' : '#ffffff',
                    color: activeFolder === f ? '#ffffff' : '#1d1d1f',
                    border: activeFolder === f ? '1.5px solid #1d1d1f' : '1.5px solid rgba(0,0,0,0.1)',
                    cursor: 'pointer', boxShadow: '0 2px 6px rgba(0,0,0,0.03)'
                  }}
                >
                  <strong style={{ display: 'block', fontSize: '13px', marginBottom: '2px' }}>{f}</strong>
                  <small style={{ color: activeFolder === f ? 'rgba(255,255,255,0.7)' : '#86868b', fontSize: '11px' }}>הצג קבצים</small>
                </div>
              ))}
            </div>

            <div style={{ borderBottom: '1px solid rgba(0,0,0,0.1)', paddingBottom: '8px', marginBottom: '12px', fontWeight: '700', fontSize: '14px' }}>
              תיקייה: {activeFolder}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              {ticketFiles.length === 0 ? (
                <div style={{ gridColumn: 'span 2', textAlign: 'center', color: '#86868b', padding: '24px', fontSize: '13px' }}>אין עדיין כרטיסים בתקייה זו.</div>
              ) : (
                ticketFiles.map((x) => (
                  <div 
                    key={x.id} 
                    onClick={() => { setViewerItem(x); setModalType('viewer'); }}
                    style={{ display: 'flex', flexDirection: 'row-reverse', alignItems: 'center', gap: '10px', padding: '12px', borderRadius: '14px', background: '#fff', border: '1.5px solid rgba(0,0,0,0.1)', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}
                  >
                    <div style={{ width: '48px', height: '48px', borderRadius: '10px', background: '#e5e5ea', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', flexShrink: 0 }}>
                      {x.isFlightInfo ? '✈️' : (x.isInsuranceInfo ? '🛡️' : (x.isCarVoucher ? '🚗' : (x.isHotelInfo ? '🏡' : '📄')))}
                    </div>
                    <div style={{ flex: 1, minWidth: 0, textAlign: 'right' }}>
                      <b style={{ display: 'block', fontSize: '12px', fontWeight: '700', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{x.title || x.name}</b>
                      <small style={{ color: '#86868b', fontSize: '10px', display: 'block', marginBottom: '4px' }}>
                        {x.isFlightInfo ? 'ישראייר 4623652' : (x.isInsuranceInfo ? 'AIG פוליסה' : (x.isCarVoucher ? 'Ecovia השכרה' : (x.isHotelInfo ? 'Booking' : `${Math.round(x.size / 1024)} KB`)))}
                      </small>
                      <button onClick={(e) => deleteFile(x.id, e)} style={{ background: 'rgba(255,59,48,0.08)', color: '#ff3b30', border: 0, padding: '2px 6px', borderRadius: '6px', fontSize: '10px', fontWeight: '700', cursor: 'pointer' }}>מחק</button>
                    </div>
                  </div>
                ))
              )}
            </div>

          </div>
        </div>
      )}

      {/* MODAL: Full Viewer */}
      {modalType === 'viewer' && viewerItem && (
        <div style={modalStyle}>
          <div style={{ ...modalContentStyle, padding: '20px 20px 40px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(0,0,0,0.1)', paddingBottom: '12px', marginBottom: '16px' }}>
              <span style={{ fontSize: '17px', fontWeight: '700' }}>{viewerItem.title || viewerItem.name}</span>
              <button onClick={() => setModalType('tickets')} style={modalCloseBtn}>✕</button>
            </div>

            {viewerItem.isFlightInfo && (
              <div style={{ lineHeight: '1.8', fontSize: '14px' }}>
                <h3 style={{ color: '#0071e3', margin: '0 0 10px' }}>✈️ פרטי טיסה – ישראייר</h3>
                <p><b>מספר הזמנה (Docket):</b> <span dir="ltr">4623652</span></p>
                <p><b>טיסת הלוך (30.09.2026):</b><br/>שעה: <span dir="ltr">13:15</span> מתל אביב (טרמינל 1) ➔ <span dir="ltr">16:05</span> בוורונה<br/>טיסה: <span dir="ltr">6H 357</span> (Economy)</p>
                <p><b>טיסת חזור (06.10.2026):</b><br/>שעה: <span dir="ltr">21:35</span> מוורונה ➔ <span dir="ltr">02:05</span> בתל אביב (07.10)<br/>טיסה: <span dir="ltr">6H 352</span> (Economy)</p>
                <hr style={{ border: 0, borderTop: '1px solid rgba(0,0,0,0.1)', margin: '15px 0' }}/>
                <b>נוסעים בהזמנה:</b>
                <ul style={{ paddingRight: '20px', margin: '6px 0' }}>
                  <li>Arik Cohen (28/12/1967)</li>
                  <li>Amit Cohen (01/07/2014)</li>
                  <li>Yuly Cohen (01/07/2014)</li>
                  <li>Lian Cohen (14/10/2015)</li>
                  <li>Harel Vilnai Cohen (04/09/1997)</li>
                </ul>
              </div>
            )}

            {viewerItem.isInsuranceInfo && (
              <div style={{ lineHeight: '1.8', fontSize: '14px' }}>
                <h3 style={{ color: '#0071e3', margin: '0 0 10px' }}>🛡️ ביטוח נסיעות לחו"ל – AIG</h3>
                <p><b>מספר פוליסה:</b> <span dir="ltr">170270213826</span></p>
                <p><b>מוקד חירום רפואי 24/7 (עברית):</b></p>
                <ul style={{ paddingRight: '20px', margin: '6px 0' }}>
                  <li>WhatsApp: <a href="https://wa.me/972549940911" target="_blank" rel="noreferrer" style={{ color: '#0071e3' }} dir="ltr">+972-54-9940911</a></li>
                  <li>טלפון ישיר: <a href="tel:+97239191155" style={{ color: '#0071e3' }} dir="ltr">+972-3-9191155</a></li>
                </ul>
                <hr style={{ border: 0, borderTop: '1px solid rgba(0,0,0,0.1)', margin: '15px 0' }}/>
                <a href="https://www.aig.co.il/t/6b66x6" target="_blank" rel="noreferrer" style={{ display: 'block', padding: '12px', background: '#0071e3', color: '#fff', borderRadius: '12px', textAlign: 'center', textDecoration: 'none', fontWeight: '700', marginTop: '10px' }}>כניסה לאזור האישי של AIG</a>
              </div>
            )}

            {viewerItem.isCarVoucher && (
              <div style={{ lineHeight: '1.8', fontSize: '14px' }}>
                <h3 style={{ color: '#0071e3', margin: '0 0 10px' }}>🚗 שובר השכרת רכב – Booking.com (Ecovia)</h3>
                <p><b>מספר הזמנה:</b> <span dir="ltr">724715780</span></p>
                <p><b>רכב:</b> Intermediate SUV – Citroen C5 Aircross או דומה (אוטומטי)</p>
                <p><b>איסוף:</b> 30.09.2026 ב-17:30 – נמל התעופה ורונה</p>
                <p><b>החזרה:</b> 06.10.2026 ב-17:30 – נמל התעופה ורונה</p>
                <p><b>נהג ראשי:</b> <span dir="ltr">Cohen Arik (+972502022768)</span></p>
                <p><b>ביטוח:</b> <span style={{ color: '#34c759', fontWeight: '700' }}>הגנה מלאה כלולה (Full Protection)</span></p>
                <a href="https://www.booking.com" target="_blank" rel="noreferrer" style={{ display: 'block', padding: '12px', background: '#003580', color: '#fff', borderRadius: '12px', textAlign: 'center', textDecoration: 'none', fontWeight: '700', marginTop: '14px' }}>📱 פתח ב-Booking.com</a>
              </div>
            )}

            {viewerItem.isHotelInfo && (
              <div style={{ lineHeight: '1.8', fontSize: '14px' }}>
                <h3 style={{ color: '#0071e3', margin: '0 0 10px' }}>🏡 הזמנת מלון – Bio Agriturismo Vojon</h3>
                <p><b>סטטוס הזמנה:</b> <span style={{ color: '#34c759', fontWeight: '700' }}>Confirmed (מאושר)</span></p>
                <p><b>כתובת:</b> <span dir="ltr">Via Del Forte 6, 46040 Ponti Sul Mincio, Italy</span></p>
                <p><b>תאריכים:</b> 30.09.2026 – 06.10.2026 (6 לילות)</p>
                <p><b>טלפון:</b> <a href="tel:+393792027060" style={{ color: '#0071e3' }} dir="ltr">+39 379 202 7060</a></p>
                
                <a href={`https://www.waze.com/ul?q=${encodeURIComponent('Bio Agriturismo Vojon, Ponti sul Mincio, Italy')}&navigate=yes`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '12px', background: '#fff', border: '1.5px solid #33ccff', color: '#0077b6', borderRadius: '12px', textDecoration: 'none', fontWeight: '700', marginTop: '14px' }}>
                  {WAZE_SVG} נווט למלון ב-Waze
                </a>
              </div>
            )}

            {viewerItem.blob && (viewerItem.type || '').startsWith('image/') && (
              <img src={URL.createObjectURL(viewerItem.blob)} alt="מסמך" style={{ width: '100%', borderRadius: '12px', marginTop: '10px' }} />
            )}
          </div>
        </div>
      )}

    </div>
  );
}

const sidebarBtnStyle = {
  background: '#ffffff',
  border: '1px solid rgba(0,0,0,0.12)',
  padding: '14px 16px',
  borderRadius: '16px',
  fontWeight: '700',
  fontSize: '14px',
  textAlign: 'right',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  color: '#1d1d1f',
  boxShadow: '0 2px 6px rgba(0,0,0,0.03)'
};

const navBtnStyle = {
  fontSize: '13px',
  fontWeight: '700',
  color: '#1d1d1f',
  background: '#ffffff',
  padding: '10px',
  borderRadius: '12px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '8px',
  cursor: 'pointer',
  border: '1px solid rgba(0,0,0,0.12)',
  boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
  textDecoration: 'none'
};

const modalStyle = {
  position: 'fixed',
  inset: 0,
  background: '#ffffff',
  zIndex: 2000,
  display: 'flex',
  flexDirection: 'column',
  overflowY: 'auto'
};

const modalContentStyle = {
  width: '100%',
  maxWidth: '600px',
  margin: 'auto',
  padding: '24px 20px 40px',
  position: 'relative'
};

const modalCloseBtn = {
  border: '1px solid rgba(0,0,0,0.12)',
  background: '#f5f5f7',
  width: '36px',
  height: '36px',
  borderRadius: '50%',
  fontWeight: '700',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#1d1d1f'
};

const gridModalBtn = {
  padding: '16px',
  borderRadius: '14px',
  background: '#ffffff',
  border: '1px solid rgba(0,0,0,0.12)',
  fontWeight: '700',
  fontSize: '13px',
  textAlign: 'center',
  cursor: 'pointer',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '8px',
  color: '#1d1d1f',
  boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
};

const uploadBtnStyle = {
  width: '100%',
  padding: '12px',
  borderRadius: '12px',
  background: '#ffffff',
  color: '#1d1d1f',
  border: '1px solid rgba(0,0,0,0.15)',
  fontWeight: '700',
  cursor: 'pointer',
  fontSize: '13px'
};