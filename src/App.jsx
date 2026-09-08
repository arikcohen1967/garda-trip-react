import React, { useState, useEffect, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';

// Supabase Cloud Configuration
const SUPABASE_URL = 'https://qrdgructcnphiyosakgb.supabase.co';
const SUPABASE_KEY = 'sb_publishable_Ov14SZJ4k0-4UeqQNEQ6CQ_N4da5ABY';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const WAZE_SVG = (
  <svg viewBox="0 0 512 512" width="16" height="16" xmlns="http://www.w3.org/2000/svg">
    <rect width="512" height="512" rx="110" fill="#71717a"/>
    <path d="M375.4 233.5c-3.7-31.8-29.3-56.7-61.6-59.5-35.3-3.1-66.5 19.3-73.8 53.6-1.5 7-1.4 14.3.4 21.2-22.1 4.7-38.6 24.1-38.6 47.3 0 17.5 9.7 32.7 24.1 40.5l-10.7 33.3c-2.4 7.4 2.8 15 10.6 15 3.3 0 6.4-1.4 8.6-3.8l21.9-23.7c13.7 4.9 28.7 7.5 44.1 7.5 70.7 0 128-50.5 128-112.7 0-11.8-1.8-23.3-5.2-34.4zm-146 5.3c0-11 9-20 20-20s20 9 20 20-9 20-20 20-20-9-20-20zm112 40c-11 0-20-9-20-20s9-20 20-20 20 9 20 20-9 20-20 20zm-56 22c-29.8 0-54-15.6-54-35 0-3.3 2.7-6 6-6h96c3.3 0 6 2.7 6 6 0 19.4-24.2 35-54 35z" fill="#fff"/>
    <path d="M220.5 240c-1.2 5.5-6.2 9.5-12 9.5s-10.8-4-12-9.5-2.8-12.7-14.2-22-27.5-22-15.5 0-28 12.5-28 28s12.5 28 28 28c4.4 0 8 3.6 8 8s-3.6 8-8 8c-24.3 0-44-19.7-44-44s19.7-44 44-44c21.2 0 39.1 14.7 43.5 34.5z" fill="#18181b"/>
    <circle cx="178" cy="246" r="10" fill="#18181b"/>
    <circle cx="282" cy="216" r="10" fill="#18181b"/>
    <circle cx="338" cy="216" r="10" fill="#18181b"/>
  </svg>
);

const MAPS_SVG = (
  <svg viewBox="0 0 512 512" width="18" height="18" xmlns="http://www.w3.org/2000/svg">
    <rect width="512" height="512" rx="110" fill="#71717a"/>
    <path d="M120 392l80-160 160-80-80 160z" fill="#10b981"/>
    <path d="M200 232l152-72-72 152-80-80z" fill="#3b82f6"/>
    <circle cx="260" cy="260" r="50" fill="#fff"/>
    <polygon points="260,225 240,290 260,275 280,290" fill="#2563eb"/>
  </svg>
);

const TIMER_SVG = (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="13" r="9"/>
    <polyline points="12 9 12 13 15 16"/>
    <path d="M12 2v2"/>
    <path d="M5 5l1.5 1.5"/>
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
    title: "סובב אגם Garda + ראפטינג",
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

const TICKET_DEFAULT_FOLDERS = ['✈️ טיסות ורכב', '🏡 מלון', '🎢 Gardaland', '🎬 Movieland', '🛡️ ביטוח ואישורים'];

const DEFAULT_DOCUMENTS = [
  { id: 'israir-flight', folder: '✈️ טיסות ורכב', title: 'הזמנת ישראייר (4623652)', name: 'Israir Flight Booking', type: 'text/flight-info', size: 15400, created: 1000, isFlightInfo: true },
  { id: 'aig-insurance', folder: '🛡️ ביטוח ואישורים', title: 'ביטוח נסיעות AIG (170270213826)', name: 'AIG Insurance Policy', type: 'text/insurance-info', size: 12000, created: 900, isInsuranceInfo: true },
  { id: 'ecovia-car', folder: '✈️ טיסות ורכב', title: 'שובר השכרת רכב (724715780)', name: 'Car Rental Voucher', type: 'text/car-voucher', size: 14000, created: 800, isCarVoucher: true },
  { id: 'vojon-hotel', folder: '🏡 מלון', title: 'הזמנת Bio Agriturismo Vojon', name: 'Hotel Booking Confirmation', type: 'text/hotel-info', size: 13000, created: 700, isHotelInfo: true },

  // 🎢 5 כרטיסי Gardaland הרשמיים[cite: 1, 2, 3, 4, 5]:
  { id: 'gardaland-1', folder: '🎢 Gardaland', title: 'כרטיס Gardaland #1 (Serial 600)', name: 'Gardaland Ticket 600', type: 'text/gardaland-ticket', size: 11000, created: 650, isGardalandTicket: true, serial: '600', code: 'BKN1P01Y901MART', ticketId: '33385742', sigillo: '542965AEE291FEA3' },
  { id: 'gardaland-2', folder: '🎢 Gardaland', title: 'כרטיס Gardaland #2 (Serial 601)', name: 'Gardaland Ticket 601', type: 'text/gardaland-ticket', size: 11000, created: 640, isGardalandTicket: true, serial: '601', code: 'VKN1P01Y901ME4T', ticketId: '33385743', sigillo: '8762764E1A637781' },
  { id: 'gardaland-3', folder: '🎢 Gardaland', title: 'כרטיס Gardaland #3 (Serial 606)', name: 'Gardaland Ticket 606', type: 'text/gardaland-ticket', size: 11000, created: 630, isGardalandTicket: true, serial: '606', code: 'TKN1P01Y901MUTT', ticketId: '33385748', sigillo: 'DD1F221668493023' },
  { id: 'gardaland-4', folder: '🎢 Gardaland', title: 'כרטיס Gardaland #4 (Serial 608)', name: 'Gardaland Ticket 608', type: 'text/gardaland-ticket', size: 11000, created: 620, isGardalandTicket: true, serial: '608', code: 'CKN1P01Y901N2IT', ticketId: '33385750', sigillo: '7379E49AA9784605' },
  { id: 'gardaland-5', folder: '🎢 Gardaland', title: 'כרטיס Gardaland #5 (Serial 601 נוסף)', name: 'Gardaland Ticket Harel', type: 'text/gardaland-ticket', size: 11000, created: 610, isGardalandTicket: true, serial: '601', code: 'VKN1P01Y901ME4T', ticketId: '33385743', sigillo: '8762764E1A637781' },

  // 🎬 5 כרטיסי Movieland הרשמיים[cite: 6, 7, 8, 9, 10]:
  { id: 'movieland-1', folder: '🎬 Movieland', title: 'כרטיס Movieland #1 (069)', name: 'Movieland Ticket 069', type: 'text/movieland-ticket', size: 11000, created: 550, isMovielandTicket: true, codeNum: '017JUNAR0069', barcode: '256612CCD43B8E08' },
  { id: 'movieland-2', folder: '🎬 Movieland', title: 'כרטיס Movieland #2 (070)', name: 'Movieland Ticket 070', type: 'text/movieland-ticket', size: 11000, created: 540, isMovielandTicket: true, codeNum: '017JUNAR0070', barcode: 'EA35DB7A2EA540D5' },
  { id: 'movieland-3', folder: '🎬 Movieland', title: 'כרטיס Movieland #3 (071)', name: 'Movieland Ticket 071', type: 'text/movieland-ticket', size: 11000, created: 530, isMovielandTicket: true, codeNum: '017JUNAR0071', barcode: '934FEA2F66750267' },
  { id: 'movieland-4', folder: '🎬 Movieland', title: 'כרטיס Movieland #4 (072)', name: 'Movieland Ticket 072', type: 'text/movieland-ticket', size: 11000, created: 520, isMovielandTicket: true, codeNum: '017JUNAR0072', barcode: '52CACC0D5CAE334B' },
  { id: 'movieland-5', folder: '🎬 Movieland', title: 'כרטיס Movieland #5 (073)', name: 'Movieland Ticket 073', type: 'text/movieland-ticket', size: 11000, created: 510, isMovielandTicket: true, codeNum: '017JUNAR0073', barcode: '32D6C578DF258ACF' }
];

const QUICK_PHRASES = [
  { cat: '🍕 מסעדות וקפה', he: 'חשבון בבקשה', it: 'Il conto, per favore', pro: 'אִיל קוֹנְטוֹ, פֶּר פָבוֹרֶה' },
  { cat: '🍕 מסעדות וקפה', he: 'שולחן ל-5 אנשים בבקשה', it: 'Un tavolo per cinque persone, per favore', pro: 'אוּן טָאבוֹלוֹ פֶּר צִ׳ינְקְוֶוה פֶּרְסוֹנֶה' },
  { cat: '🍕 מסעדות וקפה', he: 'בקבוק מים רגילים / מוגזים', it: 'Acqua naturale / gassata per favore', pro: 'אָקְוָוה נָטוּרָלֶה / גָאסָאטָה' },
  { cat: '🍕 מסעדות וקפה', he: 'איפה השירותים?', it: "Dov'è il bagno?", pro: 'דוֹבֶה אִיל בָּאנְיוֹ?' },
  { cat: '🍕 מסעדות וקפה', he: 'טעים מאוד!', it: 'Molto buono!', pro: 'מוֹלְטוֹ בּוּאוֹנוֹ!' },
  { cat: '🍕 מסעדות וקפה', he: 'קפה אספרסו בבקשה', it: 'Un caffè espresso, per favore', pro: 'אוּן קָאפֶה אֶסְפְּרֶסוֹ' }
];

const RAW_BASE_QUESTIONS = [
  { q: "כמה רגליים יש לעכביש?", options: ["6", "8", "10", "12"], correct: 1 },
  { q: "איזה בעל חיים נחשב למהיר ביותר בעולם ביבשה?", options: ["אריה", "ברדלס (צ'יטה)", "סוס מירוץ", "זברה"], correct: 1 },
  { q: "כמה פלנטות יש במערכת השמש שלנו?", options: ["7", "8", "9", "10"], correct: 1 },
  { q: "איזה גז אנחנו בני האדם שואפים בעיקר כדי לחיות?", options: ["פחמן דו-חמצני", "חמצן", "מימן", "חנקן"], correct: 1 }
];

const BINGO_ITEMS_POOL = [
  "🚗 פיאט 500 אדומה", "🛵 וספה / קטנוע", "🍇 כרם ענבים", "⛰️ מנהרה ארוכה", 
  "🚓 ניידת משטרה", "⛵ סירת מפרש", "🍦 שלט גלידריה", "🚜 טרקטור בכביש"
];

const generateMapHTML = (familyLocs, myLoc, sosState, isDark) => {
  const locsArray = Object.values(familyLocs || {});
  let centerLat = 45.4384;
  let centerLng = 10.6816;
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
      <style>body, html { margin: 0; padding: 0; width: 100%; height: 100%; background: #0f172a; } #map { width: 100%; height: 100%; }</style>
    </head>
    <body>
      <div id="map"></div>
      <script>
        const map = L.map('map').setView([${centerLat}, ${centerLng}], 15);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(map);
      </script>
    </body>
    </html>
  `;
};

const generateMassiveTrivia = () => {
  const generated = [];
  for (let i = 0; i < 20; i++) {
    const template = RAW_BASE_QUESTIONS[i % RAW_BASE_QUESTIONS.length];
    generated.push({ q: `(שאלה #${i + 1}) ${template.q}`, options: template.options, correct: template.correct });
  }
  return generated;
};

function DocumentViewer({ item, isDark, cardShadow }) {
  const [blobUrl, setBlobUrl] = useState(null);

  useEffect(() => {
    if (item?.blob) {
      const url = URL.createObjectURL(item.blob);
      setBlobUrl(url);
      return () => { URL.revokeObjectURL(url); };
    } else { setBlobUrl(null); }
  }, [item?.blob]);

  return (
    <div style={{ lineHeight: '1.8', fontSize: '14px', fontWeight: '600' }}>
      {item.isHotelInfo && <p><b>מלון:</b> Bio Agriturismo Vojon, Ponti sul Mincio</p>}
      {item.isFlightInfo && <p><b>ישראייר:</b> הזמנה 4623652</p>}
      {item.isInsuranceInfo && <p><b>AIG פוליסה:</b> 170270213826</p>}
      {item.isCarVoucher && <p><b>השכרת רכב Ecovia:</b> 724715780</p>}

      {item.isGardalandTicket && (
        <>
          <div style={{ background: '#e0f2fe', padding: '12px', borderRadius: '12px', color: '#0369a1', marginBottom: '12px', textAlign: 'center' }}>
            🎢 <b>Gardaland Park Official Ticket</b>
          </div>
          <p><b>קוד כרטיס (Code):</b> <span dir="ltr" style={{ fontWeight: '900', fontSize: '15px' }}>{item.code}</span></p>
          <p><b>מספר כרטיס (Ticket ID):</b> {item.ticketId}</p>
          <p><b>סיריאלי/סדרה:</b> {item.serial}</p>
          <p><b>סיגיל (Sigillo):</b> <span dir="ltr">{item.sigillo}</span></p>
          <p><b>תוקף:</b> עד 01.11.2026</p>
        </>
      )}

      {item.isMovielandTicket && (
        <>
          <div style={{ background: '#fae8ff', padding: '12px', borderRadius: '12px', color: '#86198f', marginBottom: '12px', textAlign: 'center' }}>
            🎬 <b>Movieland The Hollywood Park Ticket</b>
          </div>
          <p><b>מספר כרטיס:</b> <span style={{ fontWeight: '900', fontSize: '15px' }}>{item.codeNum}</span></p>
          <p><b>ברקוד דיגיטלי:</b> <span dir="ltr" style={{ fontWeight: '900' }}>{item.barcode}</span></p>
          <p><b>תוקף:</b> עד 29.11.2026 (כרטיס פתוח לעונת 2026)</p>
        </>
      )}

      {blobUrl && (
        <div style={{ marginTop: '16px', textAlign: 'center' }}>
          <a href={blobUrl} download={item.name} style={{ display: 'inline-block', padding: '12px 20px', background: '#334155', color: '#fff', borderRadius: '10px', textDecoration: 'none', fontWeight: '800' }}>
            📥 פתח / הורד קובץ ({item.name})
          </a>
        </div>
      )}
    </div>
  );
}

export default function App() {
  const [tripDays] = useState(INITIAL_TRIP_DAYS);
  const [activeDay, setActiveDay] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [viewerItem, setViewerItem] = useState(null);
  const [isOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);
  
  const [themeMode, setThemeMode] = useState('light');
  const [folders] = useState(TICKET_DEFAULT_FOLDERS);
  const [activeFolder, setActiveFolder] = useState('✈️ טיסות ורכב');
  
  const [ticketFiles, setTicketFiles] = useState([]);

  const [hebrewInput, setHebrewInput] = useState('');
  const [italianOutput, setItalianOutput] = useState('');
  const [isTranslating] = useState(false);

  const [bingoPlayer, setBingoPlayer] = useState('');
  const [bingoCard, setBingoCard] = useState([]);
  const [bingoChecked, setBingoChecked] = useState({});
  const [hasBingoWin, setHasBingoWin] = useState(false);

  const [familyLocations] = useState({});
  const [activeSosAlert] = useState(null);
  const [myLocation] = useState(null);

  const [savedParking, setSavedParking] = useState(() => {
    try { return JSON.parse(localStorage.getItem('garda-saved-parking')) || null; } catch (e) { return null; }
  });
  const [parkingNote, setParkingNote] = useState('');

  const [triviaQuestions] = useState(() => generateMassiveTrivia());
  const [triviaIndex] = useState(0);
  const travelers = ['אריק', 'עמית', 'יולי', 'ליאן', 'הראל'];
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [, setIsAnswerCorrect] = useState(null);

  const dbInstanceRef = useRef(null);

  const openDb = () => {
    if (dbInstanceRef.current) return Promise.resolve(dbInstanceRef.current);
    return new Promise((resolve, reject) => {
      const req = indexedDB.open('gardaTripMasterDB', 4);
      req.onupgradeneeded = () => {
        const db = req.result;
        if (!db.objectStoreNames.contains('files')) {
          db.createObjectStore('files', { keyPath: 'id', autoIncrement: true });
        }
      };
      req.onsuccess = () => { dbInstanceRef.current = req.result; resolve(req.result); };
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
          if (!all.some(f => f.title === doc.title)) { store.add(doc); }
        });
        writeTx.oncomplete = () => loadFiles(activeFolder);
      };
    } catch (e) {}
  };

  const loadFiles = async (folder) => {
    try {
      const db = await openDb();
      const tx = db.transaction('files', 'readonly');
      const req = tx.objectStore('files').getAll();
      req.onsuccess = () => {
        const dbFiles = req.result || [];
        const allMerged = [...dbFiles];
        DEFAULT_DOCUMENTS.forEach(def => {
          if (!allMerged.some(m => m.title === def.title)) { allMerged.push(def); }
        });
        const filtered = allMerged.filter(d => d.folder === folder);
        setTicketFiles(filtered);
      };
      req.onerror = () => { setTicketFiles(DEFAULT_DOCUMENTS.filter(d => d.folder === folder)); };
    } catch (e) { setTicketFiles(DEFAULT_DOCUMENTS.filter(d => d.folder === folder)); }
  };

  useEffect(() => { initTickets(); }, []);
  useEffect(() => { loadFiles(activeFolder); }, [activeFolder]);

  const saveSmartParkingLocation = () => {
    if (!navigator.geolocation) { alert('שירותי מיקום אינם נתמכים'); return; }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const parkObj = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          note: parkingNote || 'רכב חונה',
          time: new Date().toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' }),
          date: new Date().toLocaleDateString('he-IL')
        };
        setSavedParking(parkObj);
        localStorage.setItem('garda-saved-parking', JSON.stringify(parkObj));
        alert('🚗 מיקום הרכב נשמר בהצלחה!');
      },
      () => alert('שגיאה בדגימת מיקום GPS'),
      { enableHighAccuracy: true }
    );
  };

  const clearSavedParking = () => {
    if (!window.confirm('למחוק חניה שמורה?')) return;
    setSavedParking(null);
    setParkingNote('');
    localStorage.removeItem('garda-saved-parking');
  };

  const initBingoGame = (playerName) => {
    setBingoPlayer(playerName);
    const shuffled = [...BINGO_ITEMS_POOL].sort(() => 0.5 - Math.random()).slice(0, 9);
    setBingoCard(shuffled);
    setBingoChecked({});
    setHasBingoWin(false);
  };

  const toggleBingoItem = (idx) => {
    if (hasBingoWin) return;
    setBingoChecked(prev => {
      const updated = { ...prev, [idx]: !prev[idx] };
      const lines = [[0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [2,4,6]];
      if (lines.some(line => line.every(pos => updated[pos]))) { setHasBingoWin(true); }
      return updated;
    });
  };

  const handleTriviaAnswer = (optionIdx) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(optionIdx);
    const currentQ = triviaQuestions[triviaIndex];
    if (optionIdx === currentQ.correct) { setIsAnswerCorrect(true); } 
    else { setIsAnswerCorrect(false); }
    setTimeout(() => { setSelectedAnswer(null); setIsAnswerCorrect(null); }, 1500);
  };

  const day = tripDays[activeDay] || tripDays[0];
  const isDark = themeMode === 'dark';
  const bgMain = isDark ? '#000000' : '#ffffff';
  const cardBg = isDark ? '#1c1c1e' : '#ffffff';
  const textColor = isDark ? '#f5f5f7' : '#1d1d1f';
  const borderColor = isDark ? '#38383a' : '#cbd5e1';
  const textSub = isDark ? '#98989d' : '#6b7280';
  const cardShadow = isDark ? '0 6px 20px rgba(0, 0, 0, 0.6)' : '0 6px 20px rgba(0,0,0,0.1)';

  return (
    <div style={{ background: bgMain, minHeight: '100vh', width: '100%', maxWidth: '100vw', color: textColor, direction: 'rtl', paddingBottom: '40px', boxSizing: 'border-box' }}>
      
      {/* פאנל עליון ומעוצב */}
      <div style={{ background: cardBg, padding: '14px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1.5px solid ${borderColor}`, position: 'sticky', top: 0, zIndex: 1100, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
        <button onClick={() => setSidebarOpen(true)} style={{ background: cardBg, border: `2px solid ${borderColor}`, width: '42px', height: '42px', borderRadius: '12px', fontSize: '20px', fontWeight: '900', cursor: 'pointer', color: textColor, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: cardShadow }}>☰</button>
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ margin: 0, fontSize: '15px', fontWeight: 'bold' }}>אגם Garda וונציה</h1>
          <span style={{ fontSize: '11px', color: textSub }}>טיול בת מצווה · ספטמבר-אוקטובר 2026</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: isOnline ? '#22c55e' : '#f59e0b' }}></span>
          <span style={{ fontSize: '12px', fontWeight: 'bold' }}>{isOnline ? 'מקוון' : 'לא מקוון'}</span>
        </div>
      </div>

      {/* תפריט צד מעוצב ומקורי */}
      {sidebarOpen && (
        <div onClick={() => setSidebarOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 2500, backdropFilter: 'blur(4px)' }} />
      )}
      <aside style={{
        position: 'fixed', top: 0, bottom: 0, right: 0, width: '320px', maxWidth: '85vw',
        background: cardBg, zIndex: 2600, transform: sidebarOpen ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.3s cubic-bezier(0.32, 0.72, 0, 1)', padding: '24px 18px', display: 'flex', flexDirection: 'column', gap: '12px', borderLeft: `1.5px solid ${borderColor}`, overflowY: 'auto', boxSizing: 'border-box', boxShadow: '-10px 0 30px rgba(0,0,0,0.2)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1.5px solid ${borderColor}`, paddingBottom: '14px' }}>
          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}>תפריט מהיר</h3>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={() => setThemeMode(isDark ? 'light' : 'dark')} style={{ background: '#4b5563', color: '#fff', border: 'none', padding: '6px 10px', borderRadius: '8px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer' }}>
              {isDark ? '☀️ בהיר' : '🌙 כהה'}
            </button>
            <button onClick={() => setSidebarOpen(false)} style={{ width: '32px', height: '32px', borderRadius: '50%', background: cardBg, color: textColor, border: `1.5px solid ${borderColor}`, fontWeight: 'bold', fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
          </div>
        </div>

        <button onClick={() => { setSidebarOpen(false); setModalType(null); }} style={sidebarBtnStyle}>📅 מסלול ימי הטיול</button>
        <button onClick={() => { setSidebarOpen(false); setModalType('tickets'); }} style={sidebarBtnStyle}>🎟️ ארנק כרטיסים ומסמכים (Gardaland & Movieland)</button>
        <button onClick={() => { setSidebarOpen(false); setModalType('radar'); }} style={sidebarBtnStyle}>🧭 רדאר משפחתי חי</button>
        <button onClick={() => { setSidebarOpen(false); setModalType('parking'); }} style={sidebarBtnStyle}>🚗 שמירת מיקום רכב חכם</button>
        <button onClick={() => { setSidebarOpen(false); setModalType('phrasebook'); }} style={sidebarBtnStyle}>🇮🇹 שיחון איטלקי + דיבור</button>
        <button onClick={() => { setSidebarOpen(false); setModalType('trivia'); }} style={sidebarBtnStyle}>🧠 טריויה חכמה לדרך</button>
        <button onClick={() => { setSidebarOpen(false); setModalType('bingo'); }} style={sidebarBtnStyle}>🎯 בינגו דרכים לאוטו</button>
        <button onClick={() => { setSidebarOpen(false); setModalType('emergency'); }} style={sidebarBtnStyle}>🆘 מספרי חירום באיטליה</button>
      </aside>

      {/* כפתורי בחירת ימי הטיול */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', padding: '16px 16px 8px 16px', scrollbarWidth: 'none' }}>
        {tripDays.map((d, i) => (
          <button
            key={i}
            onClick={() => setActiveDay(i)}
            style={{
              padding: '10px 16px', borderRadius: '14px', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer', whiteSpace: 'nowrap',
              background: activeDay === i ? '#4b5563' : cardBg,
              color: activeDay === i ? '#ffffff' : textColor,
              border: `1.5px solid ${activeDay === i ? '#4b5563' : borderColor}`,
              boxShadow: cardShadow,
              transition: 'all 0.2s ease'
            }}
          >
            {d.label}
          </button>
        ))}
      </div>

      {/* תוכן המסלול הראשי */}
      <main style={{ padding: '10px 16px', maxWidth: '600px', margin: 'auto', boxSizing: 'border-box' }}>
        <div style={{ marginBottom: '16px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', margin: '0 0 4px' }}>{day.icon} {day.title}</h2>
          <span style={{ fontSize: '12px', color: textSub }}>{day.fullLabel}</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {day.stops.map((stop, idx) => (
            <div key={idx} style={{ background: cardBg, border: `1.5px solid ${borderColor}`, borderRadius: '16px', padding: '16px', boxShadow: cardShadow, boxSizing: 'border-box' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 'bold', margin: 0 }}>{stop.name}</h3>
                <span style={{ fontSize: '12px', fontWeight: 'bold', color: textSub, background: isDark ? '#2c2c2e' : '#f1f5f9', padding: '4px 8px', borderRadius: '8px' }}>{stop.time}</span>
              </div>
              <p style={{ fontSize: '13px', color: textSub, margin: '4px 0 12px', lineHeight: '1.4' }}>{stop.note}</p>
              
              {stop.food && (
                <div style={{ fontSize: '12px', background: isDark ? '#2c2c2e' : '#f8fafc', padding: '10px 12px', borderRadius: '12px', marginBottom: '12px', border: `1px solid ${borderColor}` }}>
                  <b>🍴 המלצה קולינרית:</b> {stop.food.name}
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <a href={`https://maps.apple.com/?q=${encodeURIComponent(stop.dest)}`} target="_blank" rel="noreferrer" style={navBtnStyle}>{MAPS_SVG} Apple Maps</a>
                <a href={`https://www.waze.com/ul?q=${encodeURIComponent(stop.dest)}&navigate=yes`} style={navBtnStyle}>{WAZE_SVG} Waze</a>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* מודל ארנק כרטיסים */}
      {modalType === 'tickets' && (
        <div style={{ ...modalStyle, background: bgMain }}>
          <div style={modalContentStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1.5px solid ${borderColor}`, paddingBottom: '16px', marginBottom: '16px' }}>
              <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}>🎟️ ארנק כרטיסים ומסמכים רשמיים</h2>
              <button onClick={() => setModalType(null)} style={{ background: 'none', border: 'none', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer', color: textColor }}>✕</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))', gap: '6px', marginBottom: '16px' }}>
              {folders.map((f, i) => (
                <button
                  key={i}
                  onClick={() => setActiveFolder(f)}
                  style={{
                    padding: '10px 8px', borderRadius: '10px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer',
                    background: activeFolder === f ? '#4b5563' : cardBg,
                    color: activeFolder === f ? '#ffffff' : textColor,
                    border: `1.5px solid ${borderColor}`
                  }}
                >
                  {f}
                </button>
              ))}
            </div>

            <div style={{ fontWeight: 'bold', fontSize: '13px', marginBottom: '10px' }}>תכולת תיקייה: {activeFolder}</div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {ticketFiles.length === 0 ? (
                <div style={{ textAlign: 'center', color: textSub, padding: '20px' }}>אין כרטיסים בתיקייה זו.</div>
              ) : (
                ticketFiles.map((x, idx) => (
                  <div
                    key={x.id || idx}
                    onClick={() => { setViewerItem(x); setModalType('viewer'); }}
                    style={{
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      padding: '12px', borderRadius: '12px', background: cardBg, border: `1.5px solid ${borderColor}`, cursor: 'pointer', boxShadow: cardShadow
                    }}
                  >
                    <div>
                      <b style={{ fontSize: '13px', display: 'block' }}>{x.title || x.name}</b>
                      <small style={{ color: textSub, fontSize: '11px' }}>
                        {x.isGardalandTicket ? `Gardaland Ticket (ID: ${x.ticketId})` : (x.isMovielandTicket ? `Movieland Ticket (${x.codeNum})` : 'מסמך מאובטח')}
                      </small>
                    </div>
                    <span style={{ fontSize: '12px', fontWeight: 'bold' }}>הצג פרטים 👁️</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* מודל צפייה במסמך בודד */}
      {modalType === 'viewer' && viewerItem && (
        <div style={{ ...modalStyle, background: bgMain }}>
          <div style={modalContentStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1.5px solid ${borderColor}`, paddingBottom: '16px', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, fontSize: '17px', fontWeight: 'bold' }}>{viewerItem.title || viewerItem.name}</h3>
              <button onClick={() => setModalType('tickets')} style={{ background: 'none', border: 'none', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', color: textColor }}>✕ חזרה</button>
            </div>
            <DocumentViewer item={viewerItem} isDark={isDark} cardShadow={cardShadow} />
          </div>
        </div>
      )}

      {/* מודל רדאר */}
      {modalType === 'radar' && (
        <div style={{ ...modalStyle, background: bgMain }}>
          <div style={modalContentStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: `1.5px solid ${borderColor}`, paddingBottom: '14px', marginBottom: '14px' }}>
              <h3 style={{ margin: 0 }}>📡 רדאר משפחתי חי</h3>
              <button onClick={() => setModalType(null)} style={{ background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer', color: textColor }}>✕</button>
            </div>
            <div style={{ height: '300px', background: '#0f172a', borderRadius: '12px', overflow: 'hidden' }}>
              <iframe title="Radar" srcDoc={generateMapHTML(familyLocations, myLocation, activeSosAlert, isDark)} style={{ width: '100%', height: '100%', border: 'none' }} />
            </div>
          </div>
        </div>
      )}

      {/* מודל חניה */}
      {modalType === 'parking' && (
        <div style={{ ...modalStyle, background: bgMain }}>
          <div style={modalContentStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: `1.5px solid ${borderColor}`, paddingBottom: '14px', marginBottom: '14px' }}>
              <h3 style={{ margin: 0 }}>🚗 שמירת מיקום רכב חכם</h3>
              <button onClick={() => setModalType(null)} style={{ background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer', color: textColor }}>✕</button>
            </div>
            {savedParking ? (
              <div>
                <p><b>מיקום חונה:</b> {savedParking.note}</p>
                <button onClick={clearSavedParking} style={{ background: '#dc2626', color: '#fff', padding: '8px', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>מחק חניה</button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <input type="text" placeholder="תיאור מקום חניה..." value={parkingNote} onChange={(e) => setParkingNote(e.target.value)} style={{ padding: '10px', borderRadius: '8px', border: `1.5px solid ${borderColor}`, background: cardBg, color: textColor }} />
                <button onClick={saveSmartParkingLocation} style={{ padding: '12px', borderRadius: '8px', background: '#22c55e', color: '#fff', fontWeight: 'bold', cursor: 'pointer' }}>שמור מיקום GPS</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* מודל שיחון */}
      {modalType === 'phrasebook' && (
        <div style={{ ...modalStyle, background: bgMain }}>
          <div style={modalContentStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: `1.5px solid ${borderColor}`, paddingBottom: '14px', marginBottom: '14px' }}>
              <h3 style={{ margin: 0 }}>🇮🇹 שיחון איטלקי</h3>
              <button onClick={() => setModalType(null)} style={{ background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer', color: textColor }}>✕</button>
            </div>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
              <input type="text" placeholder="הקלד בעברית..." value={hebrewInput} onChange={(e) => setHebrewInput(e.target.value)} style={{ flex: 1, padding: '10px', borderRadius: '8px', border: `1.5px solid ${borderColor}`, background: cardBg, color: textColor }} />
              <button onClick={() => translateText(hebrewInput)} style={{ padding: '0 14px', background: '#2563eb', color: '#fff', borderRadius: '8px', border: 'none', cursor: 'pointer' }}>{isTranslating ? '...' : 'תרגם'}</button>
            </div>
            {italianOutput && <div style={{ background: cardBg, padding: '10px', borderRadius: '8px', border: `1.5px solid ${borderColor}`, direction: 'ltr', fontWeight: 'bold' }}>{italianOutput}</div>}
          </div>
        </div>
      )}

      {/* מודל טריויה */}
      {modalType === 'trivia' && (
        <div style={{ ...modalStyle, background: bgMain }}>
          <div style={modalContentStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: `1.5px solid ${borderColor}`, paddingBottom: '14px', marginBottom: '14px' }}>
              <h3 style={{ margin: 0 }}>🧠 טריויה לדרך</h3>
              <button onClick={() => setModalType(null)} style={{ background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer', color: textColor }}>✕</button>
            </div>
            <p style={{ fontWeight: 'bold' }}>{triviaQuestions[triviaIndex]?.q}</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {triviaQuestions[triviaIndex]?.options.map((opt, optIdx) => (
                <button key={optIdx} onClick={() => handleTriviaAnswer(optIdx)} style={{ padding: '10px', borderRadius: '8px', background: cardBg, color: textColor, border: `1.5px solid ${borderColor}`, fontWeight: 'bold', cursor: 'pointer' }}>{opt}</button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* מודל בינגו */}
      {modalType === 'bingo' && (
        <div style={{ ...modalStyle, background: bgMain }}>
          <div style={modalContentStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: `1.5px solid ${borderColor}`, paddingBottom: '14px', marginBottom: '14px' }}>
              <h3 style={{ margin: 0 }}>🎯 בינגו דרכים</h3>
              <button onClick={() => setModalType(null)} style={{ background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer', color: textColor }}>✕</button>
            </div>
            {!bingoPlayer ? (
              <div>
                <p>בחר שחקן:</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  {travelers.map((name, i) => (
                    <button key={i} onClick={() => initBingoGame(name)} style={{ padding: '12px', background: cardBg, border: `1.5px solid ${borderColor}`, borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', color: textColor }}>{name}</button>
                  ))}
                </div>
              </div>
            ) : (
              <div>
                <p>לוח של: <b>{bingoPlayer}</b></p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
                  {bingoCard.map((item, idx) => (
                    <button key={idx} onClick={() => toggleBingoItem(idx)} style={{ aspectRatio: '1', background: bingoChecked[idx] ? '#22c55e' : cardBg, color: bingoChecked[idx] ? '#fff' : textColor, border: `1.5px solid ${borderColor}`, borderRadius: '8px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer' }}>{item}</button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* מודל חירום */}
      {modalType === 'emergency' && (
        <div style={{ ...modalStyle, background: bgMain }}>
          <div style={modalContentStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: `1.5px solid ${borderColor}`, paddingBottom: '14px', marginBottom: '14px' }}>
              <h3 style={{ margin: 0, color: '#dc2626' }}>🆘 מספרי חירום</h3>
              <button onClick={() => setModalType(null)} style={{ background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer', color: textColor }}>✕</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <a href="tel:112" style={{ padding: '14px', background: '#fee2e2', color: '#dc2626', textAlign: 'center', borderRadius: '10px', textDecoration: 'none', fontWeight: 'bold' }}>חירום: 112</a>
              <a href="tel:118" style={{ padding: '14px', background: '#fee2e2', color: '#dc2626', textAlign: 'center', borderRadius: '10px', textDecoration: 'none', fontWeight: 'bold' }}>אמבולנס: 118</a>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

const sidebarBtnStyle = {
  background: 'none', border: 'none', textAlign: 'right', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', padding: '10px 0', borderBottom: '1px solid rgba(0,0,0,0.05)', color: 'inherit'
};

const navBtnStyle = {
  fontSize: '12px', fontWeight: 'bold', padding: '10px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', background: '#f1f5f9', color: '#1e293b', textDecoration: 'none'
};

const modalStyle = {
  position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, width: '100vw', height: '100vh', zIndex: 3000, overflowY: 'auto', direction: 'rtl', boxSizing: 'border-box'
};

const modalContentStyle = {
  width: '100%', maxWidth: '600px', margin: '0 auto', padding: '20px 16px 60px', boxSizing: 'border-box', minHeight: '100vh'
};
