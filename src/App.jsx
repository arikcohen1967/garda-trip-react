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
  
  // 🎢 כרטיסי Gardaland (מתוך קובצי ה-PDF הרשמיים)[cite: 1, 2, 3, 4, 5]
  { id: 'gardaland-1', folder: '🎢 Gardaland', title: 'כרטיס Gardaland #1 (אריק / 600)', name: 'Gardaland Ticket 600', type: 'text/gardaland-ticket', size: 11000, created: 650, isGardalandTicket: true, serial: '600', code: 'BKN1P01Y901MART', ticketId: '33385742', sigillo: '542965AEE291FEA3' },
  { id: 'gardaland-2', folder: '🎢 Gardaland', title: 'כרטיס Gardaland #2 (עמית / 601)', name: 'Gardaland Ticket 601', type: 'text/gardaland-ticket', size: 11000, created: 640, isGardalandTicket: true, serial: '601', code: 'VKN1P01Y901ME4T', ticketId: '33385743', sigillo: '8762764E1A637781' },
  { id: 'gardaland-3', folder: '🎢 Gardaland', title: 'כרטיס Gardaland #3 (יולי / 606)', name: 'Gardaland Ticket 606', type: 'text/gardaland-ticket', size: 11000, created: 630, isGardalandTicket: true, serial: '606', code: 'TKN1P01Y901MUTT', ticketId: '33385748', sigillo: 'DD1F221668493023' },
  { id: 'gardaland-4', folder: '🎢 Gardaland', title: 'כרטיס Gardaland #4 (ליאן / 608)', name: 'Gardaland Ticket 608', type: 'text/gardaland-ticket', size: 11000, created: 620, isGardalandTicket: true, serial: '608', code: 'CKN1P01Y901N2IT', ticketId: '33385750', sigillo: '7379E49AA9784605' },
  { id: 'gardaland-5', folder: '🎢 Gardaland', title: 'כרטיס Gardaland #5 (הראל / 601 נוסף)', name: 'Gardaland Ticket Addon', type: 'text/gardaland-ticket', size: 11000, created: 610, isGardalandTicket: true, serial: '601', code: 'VKN1P01Y901ME4T', ticketId: '33385743', sigillo: '8762764E1A637781' },

  // 🎬 כרטיסי Movieland (מתוך קובצי ה-PDF הרשמיים)[cite: 6, 7, 8, 9, 10]
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
  { cat: '🍕 מסעדות וקפה', he: 'קפה אספרסו בבקשה', it: 'Un caffè espresso, per favore', pro: 'אוּן קָאפֶה אֶסְפְּרֶסוֹ' },
  { cat: '🍦 גלידה ומתוקים', he: 'גביע של 2 טעמים', it: 'Un cono da due gusti, per favore', pro: 'אוּן קוֹנוֹ דָה דוּאֶה גוּסְטִי' },
  { cat: '🍦 גלידה ומתוקים', he: 'כוסית של 3 טעמים', it: 'Una coppetta da tre gusti', pro: 'אוּנָה קוֹפֶּטָה דָה טְרֶה גוּסְטִי' },
  { cat: '🍦 גלידה ומתוקים', he: 'אפשר לטעום?', it: 'Posso assaggiare?', pro: 'פּוֹסוֹ אַסַאגָ׳ארֶה?' },
  { cat: '🛒 קניות וחניה', he: 'כמה זה עולה?', it: 'Quanto costa questo?', pro: 'קְוָואנְטוֹ קוֹסְטָה קְוֶוסְטוֹ?' },
  { cat: '🛒 קניות וחניה', he: 'אפשר לשלם באשראי?', it: 'Posso pagare con la carta?', pro: 'פּוֹסוֹ פָּאגָארֶה קוֹן לָה קָארְטָה?' },
  { cat: '👋 בסיסי ונימוס', he: 'שלום / להתראות', it: 'Ciao / Arrivederci', pro: 'צ׳או / אָרִיבֶדֶרְצִ׳י' },
  { cat: '👋 בסיסי ונימוס', he: 'תודה רבה', it: 'Grazie mille!', pro: 'גְרָאצְיֶה מִילֶה' }
];

const RAW_BASE_QUESTIONS = [
  { q: "כמה רגליים יש לעכביש?", options: ["6", "8", "10", "12"], correct: 1 },
  { q: "איזה בעל חיים נחשב למהיר ביותר בעולם ביבשה?", options: ["אריה", "ברדלס (צ'יטה)", "סוס מירוץ", "זברה"], correct: 1 },
  { q: "כמה פלנטות יש במערכת השמש שלנו?", options: ["7", "8", "9", "10"], correct: 1 },
  { q: "איזה גז אנחנו בני האדם שואפים בעיקר כדי לחיות?", options: ["פחמן דו-חמצני", "חמצן", "מימן", "חנקן"], correct: 1 },
  { q: "איזה כוכב לכת ידוע בתור 'הכוכב האדום'?", options: ["נוגה", "מאדים", "צדק", "שבתאי"], correct: 1 },
  { q: "מהו האוקיינוס הגדול ביותר בעולם?", options: ["האוקיינוס האטלנטי", "האוקיינוס ההודי", "האוקיינוס השקט", "אוקיינוס הקרח הצפוני"], correct: 2 },
  { q: "כמה ימים יש בשנה רגילה?", options: ["364", "365", "366", "360"], correct: 1 },
  { q: "באיזו שנה נחת האדם הראשון על הירח?", options: ["1959", "1969", "1979", "1989"], correct: 1 },
  { q: "מהו כוכב הלכת הקרוב ביותר לשמש?", options: ["נוגה", "מרקורי (חמה)", "מאדים", "ארץ"], correct: 1 },
  { q: "איזה בעל חיים הוא הגדול ביותר בעולם כיום?", options: ["פיל אפריקאי", "לווייתן כחול", "תנין הים", "ג'ירפה"], correct: 1 }
];

const BINGO_ITEMS_POOL = [
  "🚗 פיאט 500 אדומה", "🛵 וספה / קטנוע", "🍇 כרם ענבים", "⛰️ מנהרה ארוכה", 
  "🚓 ניידת משטרה", "⛵ סירת מפרש", "🍦 שלט גלידריה", "🚜 טרקטור בכביש", 
  "🐕 כלב מציץ מחלון", "☕ שלט Autogrill", "🚲 רוכב אופניים", 
  "🏰 טירה עתיקה", "🏎️ פרארי / ספורט", "🚚 משאית פירות", 
  "⛽ תחנת דלק ENI", "🌲 עץ ברוש גבוה"
];

const calculateDistanceKm = (lat1, lon1, lat2, lon2) => {
  if (!lat1 || !lon1 || !lon2 || !lat2) return null;
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const d = R * c;
  if (d < 1) return `${Math.round(d * 1000)} מטר`;
  return `${d.toFixed(1)} ק"מ`;
};

const generateMapHTML = (familyLocs, myLoc, sosState, isDark) => {
  const locsArray = Object.values(familyLocs || {});
  let centerLat = 45.4384;
  let centerLng = 10.6816;
  
  if (sosState && sosState.lat) {
    centerLat = sosState.lat;
    centerLng = sosState.lng;
  } else if (myLoc && myLoc.lat) {
    centerLat = myLoc.lat;
    centerLng = myLoc.lng;
  } else if (locsArray.length > 0) {
    centerLat = locsArray[0].lat;
    centerLng = locsArray[0].lng;
  }

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
      <style>
        body, html { margin: 0; padding: 0; width: 100%; height: 100%; background: ${isDark ? '#000000' : '#0f172a'}; }
        #map { width: 100%; height: 100%; }
        .custom-tooltip { background: ${isDark ? '#1c1c1e' : '#1e293b'}; color: ${isDark ? '#f5f5f7' : '#fff'}; border: 1.5px solid #38bdf8; font-weight: 900; font-family: sans-serif; padding: 3px 8px; border-radius: 6px; font-size: 13px; direction: rtl; box-shadow: 0 2px 6px rgba(0,0,0,0.3); }
      </style>
    </head>
    <body>
      <div id="map"></div>
      <script>
        const map = L.map('map', { zoomControl: true }).setView([${centerLat}, ${centerLng}], 15);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
          attribution: '© OpenStreetMap'
        }).addTo(map);

        const locs = ${JSON.stringify(locsArray)};
        const sos = ${JSON.stringify(sosState)};
        const markers = [];

        locs.forEach(loc => {
          const isSos = sos && sos.name === loc.name;
          const marker = L.marker([loc.lat, loc.lng]).addTo(map);
          const firstLetter = loc.name ? loc.name.charAt(0) : '?';
          const labelText = isSos ? '🚨 ' + firstLetter : firstLetter;
          
          marker.bindTooltip(labelText, {permanent: true, direction: 'top', className: 'custom-tooltip'});
          markers.push([loc.lat, loc.lng]);
        });

        if (markers.length > 1) {
          map.fitBounds(markers, { padding: [40, 40], maxZoom: 16 });
        } else if (markers.length === 1) {
          map.setView(markers[0], 16);
        }
      </script>
    </body>
    </html>
  `;
};

const generateMassiveTrivia = () => {
  const shuffledBase = [...RAW_BASE_QUESTIONS];
  for (let i = shuffledBase.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledBase[i], shuffledBase[j]] = [shuffledBase[j], shuffledBase[i]];
  }
  const generated = [];
  for (let i = 0; i < 100; i++) {
    const template = shuffledBase[i % shuffledBase.length];
    generated.push({
      q: `(שאלה #${i + 1}) ${template.q}`,
      options: template.options,
      correct: template.correct
    });
  }
  return generated;
};

const cacheMediaOffline = async (url) => {
  if (!url || typeof window === 'undefined' || !('caches' in window)) return url;
  try {
    const cache = await caches.open('garda-offline-photos-v1');
    const match = await cache.match(url);
    if (!match) {
      const res = await fetch(url, { mode: 'cors' });
      if (res.ok) {
        await cache.put(url, res.clone());
      }
    }
  } catch (e) {}
  return url;
};

function DocumentViewer({ item, isDark, blockText, cardShadow }) {
  const [blobUrl, setBlobUrl] = useState(null);

  useEffect(() => {
    if (item?.blob) {
      const url = URL.createObjectURL(item.blob);
      setBlobUrl(url);
      return () => { URL.revokeObjectURL(url); };
    } else {
      setBlobUrl(null);
    }
  }, [item?.blob]);

  return (
    <div style={{ lineHeight: '1.8', fontSize: '14px', color: blockText, fontWeight: '600' }}>
      {item.isHotelInfo && (
        <>
          <p><b>סטטוס הזמנה:</b> <span style={{ color: '#059669', fontWeight: '900' }}>Confirmed (מאושר)</span></p>
          <p><b>כתובת המלון:</b><br/><span dir="ltr">Via Del Forte 6, 46040 Ponti Sul Mincio, Italy</span></p>
          <p><b>תאריכי שהות:</b> 30.09.2026 – 06.10.2026 (6 לילות)</p>
          <p><b>טלפון ליצירת קשר:</b> <a href="tel:+393792027060" style={{ color: isDark ? '#60a5fa' : '#1d4ed8', fontWeight: '800' }} dir="ltr">+39 379 202 7060</a></p>
          <a 
            href={`https://www.waze.com/ul?q=${encodeURIComponent('Bio Agriturismo Vojon, Ponti sul Mincio, Italy')}&navigate=yes`} 
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '14px', background: '#33ccff', color: '#000000', borderRadius: '14px', textDecoration: 'none', fontWeight: '900', marginTop: '20px', boxShadow: cardShadow }}
          >
            {WAZE_SVG} נווט למלון ב-Waze לפי הכתובת
          </a>
        </>
      )}

      {item.isFlightInfo && (
        <>
          <p><b>חברת תעופה:</b> ישראייר (Israir Airlines)</p>
          <p><b>מספר הזמנה:</b> 4623652</p>
          <p><b>טיסות:</b> תל אביב (נתב"ג) ⇄ ורונה (VRN)</p>
          <p><b>סטטוס:</b> כרטיסים מאושרים ומשוריינים לכל המשפחה.</p>
        </>
      )}

      {item.isInsuranceInfo && (
        <>
          <p><b>מבטח:</b> AIG ישראל</p>
          <p><b>מספר פוליסה:</b> 170270213826</p>
          <p><b>כיסוי:</b> ביטוח נסיעות ורפואי מלא לחו"ל כולל הרחבות וספורט ימי (ראפטינג).</p>
        </>
      )}

      {item.isCarVoucher && (
        <>
          <p><b>חברת השכרה:</b> Ecovia Car Rental</p>
          <p><b>מספר שובר:</b> 724715780</p>
          <p><b>איסוף והחזרה:</b> נמל התעופה ורונה (VRN)</p>
        </>
      )}

      {item.isGardalandTicket && (
        <>
          <p><b>פארק שעשועים:</b> Gardaland Park</p>
          <p><b>קוד כרטיס (Code):</b> <span dir="ltr">{item.code}</span></p>
          <p><b>מספר כרטיס (Ticket ID):</b> {item.ticketId}</p>
          <p><b>סיריאלי/סדרה:</b> {item.serial}</p>
          <p><b>סיגיל (Sigillo):</b> <span dir="ltr">{item.sigillo}</span></p>
          <p><b>תוקף:</b> עד 01.11.2026</p>
          <div style={{ background: '#e0f2fe', padding: '10px', borderRadius: '8px', color: '#0369a1', marginTop: '10px', fontSize: '13px' }}>
            🎟️ יש להציג כרטיס זה או לסרוק את הברקוד הישירות בכניסה לפארק ללא צורך בעמידה בתורים בקופות.
          </div>
        </>
      )}

      {item.isMovielandTicket && (
        <>
          <p><b>פארק קולנוע:</b> Movieland The Hollywood Park</p>
          <p><b>מספר כרטיס:</b> {item.codeNum}</p>
          <p><b>ברקוד דיגיטלי:</b> <span dir="ltr">{item.barcode}</span></p>
          <p><b>תוקף:</b> עד 29.11.2026 (כרטיס פתוח לעונת 2026)</p>
          <div style={{ background: '#fae8ff', padding: '10px', borderRadius: '8px', color: '#86198f', marginTop: '10px', fontSize: '13px' }}>
            🎬 כרטיس דיגיטלי תקף לעונת 2026. ניתן להציג ישירות מהנייד בכניסה למתחם Canevaworld.
          </div>
        </>
      )}

      {blobUrl && (
        <div style={{ marginTop: '16px', textAlign: 'center' }}>
          {item.type?.startsWith('image/') ? (
            <img src={blobUrl} alt={item.title || item.name} style={{ maxWidth: '100%', borderRadius: '12px', boxShadow: cardShadow }} />
          ) : (
            <a href={blobUrl} download={item.name} style={{ display: 'inline-block', padding: '12px 20px', background: isDark ? '#1c1c1e' : 'linear-gradient(180deg, #334155 0%, #1e293b 100%)', color: isDark ? '#f5f5f7' : '#fff', borderRadius: '10px', textDecoration: 'none', fontWeight: '800', border: isDark ? '1px solid #38383a' : 'none', boxShadow: cardShadow }}>
              📥 פתח / הורד קובץ ({item.name})
            </a>
          )}
        </div>
      )}
    </div>
  );
}

export default function App() {
  const [tripDays, setTripDays] = useState(INITIAL_TRIP_DAYS);
  const [activeDay, setActiveDay] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [viewerItem, setViewerItem] = useState(null);
  const [isOnline, setIsOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);
  
  const [themeMode, setThemeMode] = useState('light');
  const [weatherData, setWeatherData] = useState({ temp: '25°C - 24°C', condition: '☀️ שמש נעימה באגם (ספטמבר-אוקטובר)', location: 'אגם Garda' });

  const [customTheme, setCustomTheme] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('garda-custom-theme')) || null;
    } catch (e) { return null; }
  });
  const [showThemeBuilder, setShowThemeBuilder] = useState(false);
  const [tempBgMain, setTempBgMain] = useState('#ffffff');
  const [tempCardBg, setTempCardBg] = useState('#ffffff');
  const [tempTextColor, setTempTextColor] = useState('#1d1d1f');
  const [tempBorderColor, setTempBorderColor] = useState('#cbd5e1');

  const [folders, setFolders] = useState(TICKET_DEFAULT_FOLDERS);
  const [activeFolder, setActiveFolder] = useState('✈️ טיסות ורכב');
  const [ticketFiles, setTicketFiles] = useState(DEFAULT_DOCUMENTS.filter(d => d.folder === '✈️ טיסות ורכב'));
  const [showUploadBox, setShowUploadBox] = useState(false);
  const [newTicketTitle, setNewTicketTitle] = useState('');
  const [selectedUploadFolder, setSelectedUploadFolder] = useState('✈️ טיסות ורכב');

  const [galleryItems, setGalleryItems] = useState([]);
  const [showGalleryUpload, setShowGalleryUpload] = useState(false);
  const [galleryCaption, setGalleryCaption] = useState('');

  const [completedChallenges, setCompletedChallenges] = useState({});
  const [challengeNote, setChallengeNote] = useState('');
  const [challengeAuthor, setChallengeAuthor] = useState('אריק');
  const [isAdminUnlocked, setIsAdminUnlocked] = useState(false);

  const [hebrewInput, setHebrewInput] = useState('');
  const [italianOutput, setItalianOutput] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  const [isListeningVoice, setIsListeningVoice] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('הכל');
  const [phraseSearch, setPhraseSearch] = useState('');
  const [translationHistory, setTranslationHistory] = useState([]);

  const [aroundSearchQuery, setAroundSearchQuery] = useState('');
  const [isAroundListening, setIsAroundListening] = useState(false);

  const [incomingSoundAlert, setIncomingSoundAlert] = useState(null);
  const [listeningStream, setListeningStream] = useState(null);
  
  const audioCtxRef = useRef(null);
  const oscillatorRef = useRef(null);
  const alarmGainRef = useRef(null);

  const travelers = ['אריק', 'עמית', 'יולי', 'ליאן', 'הראל'];
  
  const [travelerIndex, setTravelerIndex] = useState(() => {
    try {
      const saved = localStorage.getItem('garda-trivia-traveler-idx');
      return saved !== null ? Number(saved) : 0;
    } catch (e) { return 0; }
  });

  const [triviaIndex, setTriviaIndex] = useState(() => {
    try {
      const saved = localStorage.getItem('garda-trivia-index');
      return saved !== null ? Number(saved) : 0;
    } catch (e) { return 0; }
  });

  const [travelerScores, setTravelerScores] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('garda-trivia-scores'));
      if (saved && typeof saved === 'object') return saved;
    } catch (e) {}
    return { 'אריק': 0, 'עמית': 0, 'יולי': 0, 'ליאן': 0, 'הראל': 0 };
  });

  const [triviaQuestions, setTriviaQuestions] = useState(() => generateMassiveTrivia());
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState(null);
  const [isTriviaPaused, setIsTriviaPaused] = useState(false);
  const triviaTimerRef = useRef(null);

  const [bingoPlayer, setBingoPlayer] = useState('');
  const [bingoCard, setBingoCard] = useState([]);
  const [bingoChecked, setBingoChecked] = useState({});
  const [hasBingoWin, setHasBingoWin] = useState(false);

  const [myLocation, setMyLocation] = useState(null);
  const [radarTrackingMode, setRadarTrackingMode] = useState('manual');
  const [familyLocations, setFamilyLocations] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('garda-family-radar-cache')) || {};
    } catch (e) { return {}; }
  });
  const [activeSosAlert, setActiveSosAlert] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('garda-active-sos')) || null;
    } catch (e) { return null; }
  });
  const watchPositionIdRef = useRef(null);

  const [savedParking, setSavedParking] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('garda-saved-parking')) || null;
    } catch (e) { return null; }
  });
  const [parkingNote, setParkingNote] = useState('');
  const [parkingPhotoUrl, setParkingPhotoUrl] = useState('');

  const [activeTimer, setActiveTimer] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('garda-active-timer')) || null;
    } catch (e) { return null; }
  });
  const [timerRemainingSec, setTimerRemainingSec] = useState(0);
  const [customTimerMinutes, setCustomTimerMinutes] = useState('15');
  const [customTimerTitle, setCustomTimerTitle] = useState('זמן חופשי ומפגש');

  const [menuOrder, setMenuOrder] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('garda-menu-order'));
      if (Array.isArray(saved) && saved.length === 12) return saved;
    } catch (e) {}
    return ['schedule', 'radar', 'timer', 'parking', 'challenges', 'bingo', 'trivia', 'phrasebook', 'gallery', 'around', 'tickets', 'emergency'];
  });

  const [isEditingMenu, setIsEditingMenu] = useState(false);
  const currentUtteranceRef = useRef(null);
  const translationAbortRef = useRef(null);
  const dbInstanceRef = useRef(null);
  const recognitionRef = useRef(null);

  const handleAroundCustomSearch = (e) => {
    e.preventDefault();
    if (!aroundSearchQuery.trim()) return;
    window.location.href = `https://maps.apple.com/?q=${encodeURIComponent(aroundSearchQuery)}`;
  };

  const startAroundVoiceSearch = () => {
    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRec) {
      alert('זיהוי קולי אינו נתמך בדפדפן זה.');
      return;
    }
    try {
      const recognition = new SpeechRec();
      recognition.lang = 'he-IL';
      recognition.interimResults = false;
      recognition.onstart = () => setIsAroundListening(true);
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setAroundSearchQuery(transcript);
          window.location.href = `https://maps.apple.com/?q=${encodeURIComponent(transcript)}`;
        }
      };
      recognition.onerror = () => setIsAroundListening(false);
      recognition.onend = () => setIsAroundListening(false);
      recognition.start();
    } catch (e) {
      setIsAroundListening(false);
    }
  };

  const sendSoundAlertToMember = async (memberName) => {
    const msg = window.prompt(`הזן הודעה דחופה ל-${memberName}:`, 'צור קשר מיד!');
    if (!msg) return;

    try {
      await supabase.channel('realtime-radar').send({
        type: 'broadcast',
        event: 'sound_alert_with_msg',
        payload: {
          senderName: challengeAuthor || 'אריק',
          targetName: memberName,
          message: msg,
          time: new Date().toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' })
        }
      });
      alert(`🔔 נשלחה התראה קולית מתחזקת והודעה דחופה אל ${memberName}!`);
    } catch (e) {
      alert('שגיאה בשליחת ההתראה');
    }
  };

  const requestRemoteListening = async (memberName) => {
    if (!window.confirm(`האם לבקש להאזין למיקרופון של ${memberName}?`)) return;
    try {
      await supabase.channel('realtime-radar').send({
        type: 'broadcast',
        event: 'mic_listen_request',
        payload: {
          requester: challengeAuthor || 'אריק',
          targetName: memberName
        }
      });
      alert(`📡 נשלחה בקשת האזנה למיקרופון אל ${memberName}. אם המכשיר יאשר, תוכל להקשיב.`);
    } catch (e) {
      alert('שגיאה בשליחת בקשת ההאזנה');
    }
  };

  const playClickSound = () => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } catch (e) {}
  };

  const broadcastMyLocation = async (coords) => {
    const currentName = challengeAuthor || 'אריק';
    const locObj = {
      name: currentName,
      lat: coords.latitude,
      lng: coords.longitude,
      updated_at: new Date().toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' })
    };
    setMyLocation({ lat: coords.latitude, lng: coords.longitude });

    setFamilyLocations(prev => {
      const updated = { ...prev, [currentName]: locObj };
      localStorage.setItem('garda-family-radar-cache', JSON.stringify(updated));
      return updated;
    });

    try {
      await supabase.from('family_radar').upsert([locObj], { onConflict: 'name' });
    } catch (e) {}
    return locObj;
  };

  const triggerSosLostAlert = () => {
    const currentName = challengeAuthor || 'אריק';
    if (!navigator.geolocation) {
      alert('שירותי מיקום אינם נתמכים');
      return;
    }

    if (!window.confirm(`להפעיל התראת מצוקה עבור ${currentName}? כל הטלפונים של המשפחה יקבלו התראה ומיקומך יופיע במפה.`)) {
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        await broadcastMyLocation(pos.coords);
        const sosData = {
          name: currentName,
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          time: new Date().toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' })
        };
        setActiveSosAlert(sosData);
        localStorage.setItem('garda-active-sos', JSON.stringify(sosData));
        startEscalatingAlarm();

        try {
          await supabase.channel('realtime-radar').send({
            type: 'broadcast',
            event: 'sos_alert',
            payload: sosData
          });
        } catch (e) {}

        setModalType('radar');
      },
      () => alert('שגיאה בדגימת מיקום ה-GPS. בדוק שה-GPS מופעל בהגדרות הטלפון.'),
      { enableHighAccuracy: true }
    );
  };

  const clearSosAlert = async () => {
    setActiveSosAlert(null);
    stopEscalatingAlarm();
    localStorage.removeItem('garda-active-sos');
    try {
      await supabase.channel('realtime-radar').send({
        type: 'broadcast',
        event: 'sos_clear',
        payload: {}
      });
    } catch (e) {}
  };

  const startAutoTracking = () => {
    if (!navigator.geolocation) {
      alert('שירותי מיקום אינם נתמכים');
      return;
    }
    setRadarTrackingMode('auto');
    if (watchPositionIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchPositionIdRef.current);
    }
    watchPositionIdRef.current = navigator.geolocation.watchPosition(
      (pos) => broadcastMyLocation(pos.coords),
      (err) => console.warn('GPS Watch error', err),
      { enableHighAccuracy: true, maximumAge: 10000, timeout: 15000 }
    );
  };

  const stopAutoTracking = () => {
    setRadarTrackingMode('manual');
    if (watchPositionIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchPositionIdRef.current);
      watchPositionIdRef.current = null;
    }
  };

  const handleManualLocationUpdate = () => {
    if (!navigator.geolocation) {
      alert('שירותי מיקום אינם נתמכים');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        broadcastMyLocation(pos.coords);
        alert('📍 מיקומך עודכן ונשמר במפה לכל המשפחה!');
      },
      () => alert('שגיאה בקבלת מיקום GPS.'),
      { enableHighAccuracy: true }
    );
  };

  const adminForceRefreshAllLocations = async () => {
    if (challengeAuthor !== 'אריק' && !isAdminUnlocked) {
      const pass = window.prompt('הזן קוד מנהל לפעולה זו:');
      if (pass !== '1967') {
        alert('קוד שגוי!');
        return;
      }
      setIsAdminUnlocked(true);
    }

    try {
      await supabase.channel('realtime-radar').send({
        type: 'broadcast',
        event: 'admin_request_location',
        payload: { requestedBy: 'אריק' }
      });
      alert('📡 נשלחה בקשת רענון מיקום מרחוק לכל בני המשפחה!');
    } catch (e) {
      alert('שגיאה בשליחת הפקודה');
    }
  };

  useEffect(() => {
    return () => {
      if (watchPositionIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchPositionIdRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!activeTimer || !activeTimer.endTime) {
      setTimerRemainingSec(0);
      return;
    }

    const updateTimer = () => {
      const now = Date.now();
      const diff = Math.max(0, Math.floor((activeTimer.endTime - now) / 1000));
      setTimerRemainingSec(diff);

      if (diff === 0 && !activeTimer.notified) {
        startEscalatingAlarm();
        speakItalian('Attenzione! Il tempo è scaduto!');
        setActiveTimer(prev => ({ ...prev, notified: true }));
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [activeTimer]);

  const startEscalatingAlarm = () => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(400, ctx.currentTime);

      gain.gain.setValueAtTime(0.02, ctx.currentTime);
      
      let currentVol = 0.02;
      const rampInterval = setInterval(() => {
        if (!audioCtxRef.current) {
          clearInterval(rampInterval);
          return;
        }
        currentVol = Math.min(1.0, currentVol + 0.08);
        try {
          gain.gain.setValueAtTime(currentVol, ctx.currentTime);
        } catch (e) {}
      }, 800);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();

      oscillatorRef.current = osc;
      alarmGainRef.current = gain;
    } catch (e) {}
  };

  const stopEscalatingAlarm = () => {
    try {
      if (oscillatorRef.current) {
        oscillatorRef.current.stop();
        oscillatorRef.current.disconnect();
        oscillatorRef.current = null;
      }
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
        audioCtxRef.current = null;
      }
    } catch (e) {}
  };

  const verifyAdminAccess = () => {
    if (isAdminUnlocked || challengeAuthor === 'אריק') return true;
    const pass = window.prompt('הזן קוד מנהל לשליטה בטיימר המשפחתי:');
    if (pass === '1967') {
      setIsAdminUnlocked(true);
      return true;
    }
    alert('גישה חסומה! רק אריק רשאי להגדיר או לבטל את הטיימר.');
    return false;
  };

  const startGlobalTimer = async (minutes, title) => {
    if (!verifyAdminAccess()) return;

    const mins = Number(minutes) || 15;
    if (mins <= 0) {
      alert('יש להזין מספר דקות תקין.');
      return;
    }

    const timerTitle = title || 'פעילות משפחתית';
    const endTime = Date.now() + mins * 60 * 1000;

    const timerData = {
      title: timerTitle,
      durationMinutes: mins,
      endTime,
      startedBy: 'אריק',
      startedAt: Date.now(),
      notified: false
    };

    setActiveTimer(timerData);
    localStorage.setItem('garda-active-timer', JSON.stringify(timerData));

    try {
      await supabase.channel('realtime-radar').send({
        type: 'broadcast',
        event: 'family_timer_start',
        payload: timerData
      });
    } catch (e) {}

    alert(`⏱️ טיימר ל-${mins} דקות ("${timerTitle}") הופעל בהצלחה וסונכרן לכל המשפחה!`);
    setModalType(null);
  };

  const cancelGlobalTimer = async () => {
    if (!verifyAdminAccess()) return;

    stopEscalatingAlarm();
    setActiveTimer(null);
    setTimerRemainingSec(0);
    localStorage.removeItem('garda-active-timer');

    try {
      await supabase.channel('realtime-radar').send({
        type: 'broadcast',
        event: 'family_timer_cancel',
        payload: {}
      });
    } catch (e) {}
  };

  useEffect(() => {
    const radarChannel = supabase
      .channel('realtime-radar')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'family_radar' }, payload => {
        if (payload.new && payload.new.name) {
          setFamilyLocations(prev => {
            const updated = { ...prev, [payload.new.name]: payload.new };
            localStorage.setItem('garda-family-radar-cache', JSON.stringify(updated));
            return updated;
          });
        }
      })
      .on('broadcast', { event: 'sos_alert' }, ({ payload }) => {
        if (payload) {
          setActiveSosAlert(payload);
          localStorage.setItem('garda-active-sos', JSON.stringify(payload));
          startEscalatingAlarm();
        }
      })
      .on('broadcast', { event: 'sos_clear' }, () => {
        setActiveSosAlert(null);
        stopEscalatingAlarm();
        localStorage.removeItem('garda-active-sos');
      })
      .on('broadcast', { event: 'sound_alert_with_msg' }, ({ payload }) => {
        if (payload && payload.targetName === (challengeAuthor || 'אריק')) {
          setIncomingSoundAlert(payload);
          startEscalatingAlarm();
        }
      })
      .on('broadcast', { event: 'mic_listen_request' }, async ({ payload }) => {
        if (payload && payload.targetName === (challengeAuthor || 'אריק')) {
          try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            setListeningStream(stream);
            alert(`🎙️ ${payload.requester} מתחבר כעת להאזנה למיקרופון שלך.`);
          } catch (err) {
            alert('הגישה למיקרופון נדחתה בהגדרות הדפדפן.');
          }
        }
      })
      .on('broadcast', { event: 'admin_request_location' }, () => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (pos) => broadcastMyLocation(pos.coords),
            () => {},
            { enableHighAccuracy: true }
          );
        }
      })
      .on('broadcast', { event: 'bingo_winner' }, ({ payload }) => {
        alert(`🎉 בינגו! ${payload.winner} השלים/ה שורה ראשון/ה! 🏆`);
      })
      .on('broadcast', { event: 'family_timer_start' }, ({ payload }) => {
        if (payload && payload.endTime) {
          setActiveTimer(payload);
          localStorage.setItem('garda-active-timer', JSON.stringify(payload));
          playClickSound();
        }
      })
      .on('broadcast', { event: 'family_timer_cancel' }, () => {
        stopEscalatingAlarm();
        setActiveTimer(null);
        setTimerRemainingSec(0);
        localStorage.removeItem('garda-active-timer');
      })
      .subscribe();

    return () => {
      supabase.removeChannel(radarChannel);
    };
  }, [challengeAuthor]);

  const saveSmartParkingLocation = () => {
    if (!navigator.geolocation) {
      alert('שירותי מיקום אינם נתמכים');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const parkObj = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          note: parkingNote || 'רכב חונה',
          photo: parkingPhotoUrl || null,
          time: new Date().toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' }),
          date: new Date().toLocaleDateString('he-IL')
        };
        setSavedParking(parkObj);
        localStorage.setItem('garda-saved-parking', JSON.stringify(parkObj));
        alert('🚗 מיקום הרכב נשמר בהצלחה (עובד גם Offline)!');
      },
      () => alert('שגיאה בדגימת מיקום ה-GPS של הרכב'),
      { enableHighAccuracy: true }
    );
  };

  const handleParkingPhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const reader = new FileReader();
      reader.onload = (event) => {
        setParkingPhotoUrl(event.target.result);
      };
      reader.readAsDataURL(file);
    } catch (err) {}
  };

  const clearSavedParking = () => {
    if (!window.confirm('האם למחוק את מיקום החניה השמור?')) return;
    setSavedParking(null);
    setParkingPhotoUrl('');
    setParkingNote('');
    localStorage.removeItem('garda-saved-parking');
  };

  const startVoiceInput = () => {
    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRec) {
      alert('זיהוי קולי אינו נתמך בדפדפן זה. השתמש בהקלדה.');
      return;
    }
    try {
      if (recognitionRef.current) recognitionRef.current.stop();
      const recognition = new SpeechRec();
      recognitionRef.current = recognition;
      recognition.lang = 'he-IL';
      recognition.interimResults = false;

      recognition.onstart = () => setIsListeningVoice(true);
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setHebrewInput(transcript);
          translateText(transcript);
        }
      };
      recognition.onerror = () => setIsListeningVoice(false);
      recognition.onend = () => setIsListeningVoice(false);
      recognition.start();
    } catch (e) {
      setIsListeningVoice(false);
    }
  };

  const initBingoGame = (playerName) => {
    setBingoPlayer(playerName);
    const shuffled = [...BINGO_ITEMS_POOL].sort(() => 0.5 - Math.random()).slice(0, 9);
    setBingoCard(shuffled);
    setBingoChecked({});
    setHasBingoWin(false);
  };

  const toggleBingoItem = (idx) => {
    playClickSound();
    if (hasBingoWin) return;
    
    setBingoChecked(prev => {
      const updated = { ...prev, [idx]: !prev[idx] };
      const lines = [
        [0,1,2], [3,4,5], [6,7,8],
        [0,3,6], [1,4,7], [2,5,8],
        [0,4,8], [2,4,6]
      ];
      const isWin = lines.some(line => line.every(pos => updated[pos]));
      if (isWin) {
        setHasBingoWin(true);
        supabase.channel('realtime-radar').send({
          type: 'broadcast',
          event: 'bingo_winner',
          payload: { winner: bingoPlayer }
        }).catch(() => {});
      }
      return updated;
    });
  };

  useEffect(() => {
    if (modalType || sidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [modalType, sidebarOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (sidebarOpen) setSidebarOpen(false);
        if (modalType) setModalType(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [sidebarOpen, modalType]);

  const handleGlobalClick = (callback) => {
    try { playClickSound(); } catch (e) {}
    if (typeof callback === 'function') {
      try { callback(); } catch (err) {}
    }
  };

  const moveMenuItem = (index, direction) => {
    const newOrder = [...menuOrder];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newOrder.length) return;
    const temp = newOrder[index];
    newOrder[index] = newOrder[targetIndex];
    newOrder[targetIndex] = temp;
    setMenuOrder(newOrder);
    localStorage.setItem('garda-menu-order', JSON.stringify(newOrder));
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
    if (diff > 120) { onCloseCallback(); }
  };

  useEffect(() => {
    if ('speechSynthesis' in window) {
      const loadVoices = () => { window.speechSynthesis.getVoices(); };
      loadVoices();
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  useEffect(() => {
    const checkSupabaseConnection = async () => {
      if (!navigator.onLine) {
        setIsOnline(false);
        return;
      }
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3500);
        const { error } = await supabase.from('trip_data').select('id').limit(1).abortSignal(controller.signal);
        clearTimeout(timeoutId);
        setIsOnline(!error);
      } catch (err) {
        setIsOnline(false);
      }
    };

    const handleOnline = () => { setIsOnline(true); checkSupabaseConnection(); };
    const handleOffline = () => { setIsOnline(false); };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    checkSupabaseConnection();
    const networkInterval = setInterval(checkSupabaseConnection, 30000);

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
        if (Array.isArray(cached) && cached.length) { setTripDays(cached); }
      } catch (e) {}
    };

    fetchTripDataFromCloud();
    fetchChallengesFromCloud();

    const galleryChannel = supabase
      .channel('realtime-gallery')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'gallery' }, payload => {
        setGalleryItems(prev => {
          if (prev.some(item => item.id === payload.new.id)) return prev;
          if (payload.new.media_url) cacheMediaOffline(payload.new.media_url);
          return [payload.new, ...prev];
        });
      })
      .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'gallery' }, payload => {
        setGalleryItems(prev => prev.filter(item => item.id !== payload.old.id));
      })
      .subscribe();

    const challengesChannel = supabase
      .channel('realtime-challenges')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'challenges_log' }, () => {
        fetchChallengesFromCloud();
      })
      .subscribe();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(networkInterval);
      supabase.removeChannel(galleryChannel);
      supabase.removeChannel(challengesChannel);
      if (triviaTimerRef.current) clearTimeout(triviaTimerRef.current);
      if (translationAbortRef.current) translationAbortRef.current.abort();
    };
  }, []);

  const fetchChallengesFromCloud = async () => {
    try {
      const { data, error } = await supabase.from('challenges_log').select('*');
      if (!error && data) {
        const mapped = {};
        data.forEach(item => {
          mapped[item.date_key] = {
            completed: item.completed,
            text: item.text,
            author: item.author,
            time: item.time,
            date: item.date_key
          };
        });
        setCompletedChallenges(mapped);
        localStorage.setItem('garda-challenges-log', JSON.stringify(mapped));
      } else {
        loadChallengesFromLocal();
      }
    } catch (e) {
      loadChallengesFromLocal();
    }
  };

  const loadChallengesFromLocal = () => {
    try {
      const savedQuests = JSON.parse(localStorage.getItem('garda-challenges-log')) || {};
      setCompletedChallenges(savedQuests);
    } catch (e) {}
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
    if (dbInstanceRef.current) return Promise.resolve(dbInstanceRef.current);
    return new Promise((resolve, reject) => {
      const req = indexedDB.open('gardaTripMasterDB', 2);
      req.onupgradeneeded = () => {
        const db = req.result;
        if (!db.objectStoreNames.contains('files')) {
          const st = db.createObjectStore('files', { keyPath: 'id', autoIncrement: true });
          st.createIndex('folder', 'folder', { unique: false });
        }
      };
      req.onsuccess = () => {
        dbInstanceRef.current = req.result;
        resolve(req.result);
      };
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
          if (!all.some(f => f.title === doc.title || (doc.isFlightInfo && f.isFlightInfo) || (doc.isInsuranceInfo && f.isInsuranceInfo) || (doc.isCarVoucher && f.isCarVoucher) || (doc.isHotelInfo && f.isHotelInfo) || (doc.isGardalandTicket && f.title === doc.title) || (doc.isMovielandTicket && f.title === doc.title))) {
            store.add(doc);
          }
        });
        writeTx.oncomplete = () => loadFiles(activeFolder);
      };
    } catch (e) {}
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
        localStorage.setItem('garda-gallery-cache', JSON.stringify(data));
        data.forEach(item => {
          if (item.media_url) cacheMediaOffline(item.media_url);
        });
      } else {
        const local = JSON.parse(localStorage.getItem('garda-gallery-cache')) || [];
        setGalleryItems(local);
      }
    } catch (e) {
      const local = JSON.parse(localStorage.getItem('garda-gallery-cache')) || [];
      setGalleryItems(local);
    }
  };

  const handleFileUpload = async (e) => {
    const files = [...e.target.files];
    if (!files.length) return;
    try {
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
    } catch (err) {}
  };

  const handleDirectGalleryUpload = async (photoFile) => {
    if (!photoFile) return;
    try {
      const filePath = `gallery_${Date.now()}_${photoFile.name}`;
      await supabase.storage.from('trip-photos').upload(filePath, photoFile);
      const { data: publicUrlData } = supabase.storage.from('trip-photos').getPublicUrl(filePath);

      if (publicUrlData?.publicUrl) {
        await cacheMediaOffline(publicUrlData.publicUrl);
        await supabase.from('gallery').insert([{
          name: photoFile.name,
          type: photoFile.type,
          size: photoFile.size,
          day_index: activeDay,
          caption: galleryCaption || `רגע משפחתי יום ${activeDay + 1}`,
          author: challengeAuthor || 'משפחה',
          created: Date.now(),
          media_url: publicUrlData.publicUrl
        }]);
      }
      setGalleryCaption('');
      setShowGalleryUpload(false);
      loadGalleryFromCloud();
    } catch (e) {
      alert('העלאה נכשלה - זמין במצב מקוון');
    }
  };

  const deleteGalleryItem = async (id, e) => {
    e.stopPropagation();
    const pass = window.prompt('הזן קוד מנהל למחיקת התמונה מהאלבום:');
    if (pass !== '1967') {
      alert('קוד שגוי!');
      return;
    }
    const updated = galleryItems.filter(item => item.id !== id);
    setGalleryItems(updated);
    localStorage.setItem('garda-gallery-cache', JSON.stringify(updated));

    try {
      await supabase.from('gallery').delete().eq('id', id);
    } catch (err) {}
  };

  const saveDailyChallenge = async (photoFile = null) => {
    const currentDayObj = tripDays[activeDay] || tripDays[0];
    const dayKey = currentDayObj?.date || String(activeDay);
    const timeNow = new Date().toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' });
    const textNote = challengeNote || 'אתגר הושלם בהצלחה! 🎉';
    const authorName = challengeAuthor || 'משפחה';

    const updated = {
      ...completedChallenges,
      [dayKey]: {
        completed: true,
        text: textNote,
        author: authorName,
        time: timeNow,
        date: currentDayObj?.date
      }
    };
    setCompletedChallenges(updated);
    localStorage.setItem('garda-challenges-log', JSON.stringify(updated));

    try {
      await supabase.from('challenges_log').upsert([{
        date_key: dayKey,
        completed: true,
        text: textNote,
        author: authorName,
        time: timeNow
      }], { onConflict: 'date_key' });
    } catch (e) {}

    if (photoFile) {
      try {
        const filePath = `challenge_${Date.now()}_${photoFile.name}`;
        await supabase.storage.from('trip-photos').upload(filePath, photoFile);
        const { data: publicUrlData } = supabase.storage.from('trip-photos').getPublicUrl(filePath);

        if (publicUrlData?.publicUrl) {
          await cacheMediaOffline(publicUrlData.publicUrl);
          await supabase.from('gallery').insert([{
            name: `אתגר: ${currentDayObj?.title}`,
            type: photoFile.type,
            size: photoFile.size,
            day_index: activeDay,
            caption: `🎯 אתגר היום: ${textNote}`,
            author: authorName,
            created: Date.now(),
            media_url: publicUrlData.publicUrl
          }]);
        }
        loadGalleryFromCloud();
      } catch (e) {}
    }

    setChallengeNote('');
    alert('🏆 כל הכבוד! האתגר בוצע ונשמר ביומן האתגרים המשפחתי!');
    setModalType(null);
  };

  const resetSingleChallenge = async (dayIdx) => {
    const pass = window.prompt('הזן קוד מנהל לאיפוס המשימה:');
    if (pass !== '1967') {
      alert('קוד שגוי!');
      return;
    }
    const targetDay = tripDays[dayIdx] || tripDays[0];
    const dayKey = targetDay?.date || String(dayIdx);

    const updated = { ...completedChallenges };
    delete updated[dayKey];
    delete updated[String(dayIdx)];
    setCompletedChallenges(updated);
    localStorage.setItem('garda-challenges-log', JSON.stringify(updated));

    try {
      await supabase.from('challenges_log').delete().eq('date_key', dayKey);
    } catch (e) {}

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
        currentUtteranceRef.current = utterance; 
        utterance.lang = 'it-IT';
        utterance.rate = 0.85;

        const voices = window.speechSynthesis.getVoices();
        const itVoice = voices.find(v => v.lang && (v.lang.includes('it') || v.lang.includes('IT')));
        if (itVoice) utterance.voice = itVoice;

        utterance.onend = () => {
          setIsPlayingAudio(false);
          currentUtteranceRef.current = null;
        };
        utterance.onerror = () => {
          setIsPlayingAudio(false);
          currentUtteranceRef.current = null;
        };

        window.speechSynthesis.speak(utterance);
      } else {
        setIsPlayingAudio(false);
      }
    } catch (e) {
      setIsPlayingAudio(false);
    }
  };

  const clearPhrasebook = () => {
    setHebrewInput('');
    setItalianOutput('');
  };

  const translateText = async (textToTranslate) => {
    const query = (textToTranslate || hebrewInput || '').trim();
    if (!query) return;

    if (translationAbortRef.current) {
      translationAbortRef.current.abort();
    }
    const abortController = new AbortController();
    translationAbortRef.current = abortController;

    setIsTranslating(true);
    setItalianOutput('');

    const finishTranslation = (italianText) => {
      setItalianOutput(italianText);
      setTranslationHistory(prev => [{ he: query, it: italianText, id: Date.now() }, ...prev.slice(0, 5)]);
      setIsTranslating(false);
      speakItalian(italianText);
    };

    const matched = QUICK_PHRASES.find(p => query.includes(p.he) || p.he.includes(query));
    if (matched) {
      finishTranslation(matched.it);
      return;
    }

    try {
      const res = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=iw&tl=it&dt=t&q=${encodeURIComponent(query)}`, {
        signal: abortController.signal
      });
      const data = await res.json();
      if (data && data[0] && data[0][0] && data[0][0][0]) {
        finishTranslation(data[0][0][0]);
      } else {
        fallbackTranslate(query, finishTranslation, abortController.signal);
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        fallbackTranslate(query, finishTranslation, abortController.signal);
      }
    }
  };

  const fallbackTranslate = async (query, callback, signal) => {
    try {
      const res2 = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(query)}&langpair=he|it`, { signal });
      const data2 = await res2.json();
      if (data2 && data2.responseData && data2.responseData.translatedText) {
        callback(data2.responseData.translatedText);
      } else {
        callback('שגיאה בתרגום');
      }
    } catch (e) {
      if (e.name !== 'AbortError') {
        callback(isOnline ? 'שגיאה בתרגום' : 'זמין במצב מקוון');
      }
    }
  };

  const nextTriviaQuestion = () => {
    if (triviaTimerRef.current) clearTimeout(triviaTimerRef.current);
    setSelectedAnswer(null);
    setIsAnswerCorrect(null);
    setTriviaIndex(prev => {
      const nextIdx = (prev + 1) % triviaQuestions.length;
      return nextIdx;
    });
    setTravelerIndex(prev => (prev + 1) % travelers.length);
  };

  const handleTriviaAnswer = (optionIdx) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(optionIdx);
    const currentQ = triviaQuestions[triviaIndex];
    const currentTraveler = travelers[travelerIndex];

    if (optionIdx === currentQ.correct) {
      setIsAnswerCorrect(true);
      setTravelerScores(prev => {
        const updated = {
          ...prev,
          [currentTraveler]: (prev[currentTraveler] || 0) + 10
        };
        return updated;
      });
    } else {
      setIsAnswerCorrect(false);
    }

    if (triviaTimerRef.current) clearTimeout(triviaTimerRef.current);
    triviaTimerRef.current = setTimeout(() => {
      nextTriviaQuestion();
    }, 1500);
  };

  const resetTriviaGame = () => {
    const pass = window.prompt('הזן קוד מנהל לאפוס משחק הטריוויה:');
    if (pass !== '1967') {
      alert('קוד שגוי! לא ניתן לאפס את המשחק.');
      return;
    }
    if (triviaTimerRef.current) clearTimeout(triviaTimerRef.current);
    const newQuestions = generateMassiveTrivia();
    setTriviaQuestions(newQuestions);
    setTriviaIndex(0);
    setTravelerIndex(0);
    setSelectedAnswer(null);
    setIsAnswerCorrect(null);
    const initialScores = { 'אריק': 0, 'עמית': 0, 'יולי': 0, 'ליאן': 0, 'הראל': 0 };
    setTravelerScores(initialScores);
    localStorage.setItem('garda-trivia-scores', JSON.stringify(initialScores));
    localStorage.setItem('garda-trivia-index', '0');
    localStorage.setItem('garda-trivia-traveler-idx', '0');
    alert('המשחק והניקוד אופסו בהצלחה!');
  };

  const handleToggleAdminQuests = () => {
    if (isAdminUnlocked) {
      setIsAdminUnlocked(false);
      return;
    }
    const pass = window.prompt('הזן קוד מנהל לחשיפת כל המשימות:');
    if (pass === '1967') {
      setIsAdminUnlocked(true);
      alert('הרשאת מנהל הופעלה! כל המשימות פתוחות לצפייה.');
    } else {
      alert('קוד שגוי!');
    }
  };

  const formatTimerClock = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const day = tripDays[activeDay] || tripDays[0];
  const isCurrentDayCompleted = completedChallenges[day?.date]?.completed || completedChallenges[String(activeDay)]?.completed;

  const filteredPhrases = QUICK_PHRASES.filter(p => {
    const matchesCategory = selectedCategory === 'הכל' || p.cat === selectedCategory;
    const cleanSearch = phraseSearch.trim().toLowerCase();
    if (!cleanSearch) return matchesCategory;
    
    const matchesText = p.he.toLowerCase().includes(cleanSearch) || 
                        p.it.toLowerCase().includes(cleanSearch) || 
                        p.pro.toLowerCase().includes(cleanSearch);
    return matchesCategory && matchesText;
  });

  const isDark = themeMode === 'dark';
  const lightCardBorder = '#cbd5e1'; 
  const lightCardShadow = '0 6px 20px rgba(0, 0, 0, 0.12), 0 2px 4px rgba(0, 0, 0, 0.04)'; 

  const currentBgMain = isDark ? '#000000' : '#ffffff';
  const currentCardBg = isDark ? '#1c1c1e' : '#ffffff';
  const currentTextColor = isDark ? '#f5f5f7' : '#1d1d1f';
  const currentBorderColor = isDark ? '#38383a' : lightCardBorder;
  const currentShadow = isDark ? '0 6px 20px rgba(0, 0, 0, 0.6)' : lightCardShadow;

  const bgMain = customTheme ? customTheme.bgMain : currentBgMain;
  const cardBg = customTheme ? customTheme.cardBg : currentCardBg;
  const textColor = customTheme ? customTheme.textColor : currentTextColor;
  const borderColor = customTheme ? customTheme.borderColor : currentBorderColor;

  const textSub = isDark ? '#98989d' : '#6b7280';
  const blockText = textColor; 
  const cardShadow = customTheme ? '0 6px 20px rgba(0,0,0,0.3)' : currentShadow;

  const metallicGreyBg = '#4b5563';
  const metallicGreyText = '#ffffff';

  const saveCustomTheme = () => {
    const newTheme = {
      bgMain: tempBgMain,
      cardBg: tempCardBg,
      textColor: tempTextColor,
      borderColor: tempBorderColor
    };
    setCustomTheme(newTheme);
    localStorage.setItem('garda-custom-theme', JSON.stringify(newTheme));
    setShowThemeBuilder(false);
    alert('🎨 הגרסה המותאמת אישית נוצרה ונשמרה בהצלחה!');
  };

  const resetCustomTheme = () => {
    setCustomTheme(null);
    localStorage.removeItem('garda-custom-theme');
    setShowThemeBuilder(false);
    alert('איפוס בוצע בהצלחה.');
  };

  const renderMenuItem = (id, index) => {
    const menuConfigs = {
      schedule: { label: 'מסלול ימי הטיול', icon: '📅', action: () => { setSidebarOpen(false); setModalType(null); } },
      timer: { label: `טיימר משפחתי ${activeTimer ? `(${formatTimerClock(timerRemainingSec)})` : ''}`, icon: TIMER_SVG, action: () => { setSidebarOpen(false); setModalType('timer'); } },
      radar: { label: 'רדאר משפחתי חי', icon: '🧭', action: () => { setSidebarOpen(false); setModalType('radar'); } },
      parking: { label: 'שמירת מיקום רכב חכם', icon: '🚗', action: () => { setSidebarOpen(false); setModalType('parking'); } },
      challenges: { label: 'יומן אתגרים ובדיחות', icon: '🏆', action: () => { setSidebarOpen(false); setModalType('challengesLog'); } },
      bingo: { label: 'בינגו דרכים לאוטו', icon: '🎯', action: () => { setSidebarOpen(false); setModalType('bingo'); } },
      trivia: { label: 'טריויה חכמה לדרך', icon: '🧠', action: () => { setSidebarOpen(false); setModalType('trivia'); } },
      phrasebook: { label: 'שיחון איטלקי + דיבור קולי', icon: '🇮🇹', action: () => { setSidebarOpen(false); setModalType('phrasebook'); } },
      gallery: { label: 'יומן ואלבום תמונות משפחתי', icon: '📸', action: () => { setSidebarOpen(false); setModalType('gallery'); } },
      around: { label: 'סביבי (Around Me)', icon: '📍', action: () => { setSidebarOpen(false); setModalType('around'); } },
      tickets: { label: 'ארנק כרטיסים ומסמכים', icon: '🎟️', action: () => { setSidebarOpen(false); setModalType('tickets'); } },
      emergency: { label: 'מספרי חירום', icon: '🆘', action: () => { setSidebarOpen(false); setModalType('emergency'); } },
      appleMusic: { label: 'פלייליסט נסיעה (Apple Music)', icon: '🎵', action: () => { setSidebarOpen(false); setModalType('appleMusicModal'); } }
    };

    const cfg = menuConfigs[id];
    if (!cfg) return null;

    return (
      <div key={id} style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%' }}>
        <button 
          onClick={() => handleGlobalClick(cfg.action)} 
          style={{ 
            background: cardBg,
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: `1.5px solid ${borderColor}`,
            color: textColor,
            borderRadius: '16px',
            padding: '14px 18px',
            fontWeight: '600',
            fontSize: '15px',
            textAlign: 'right',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            boxSizing: 'border-box',
            width: '100%',
            boxShadow: cardShadow,
            transition: 'transform 0.15s ease, background 0.15s ease'
          }}
        >
          <span style={{ fontSize: '18px', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: isDark ? '#2c2c2e' : '#f8fafc', borderRadius: '8px', border: `1px solid ${borderColor}` }}>
            {cfg.icon}
          </span>
          <span style={{ flex: 1, letterSpacing: '-0.01em' }}>{cfg.label}</span>
          <span style={{ color: textSub, fontSize: '12px' }}>‹</span>
        </button>

        {isEditingMenu && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <button onClick={() => moveMenuItem(index, 'up')} style={arrowBtnStyle}>▲</button>
            <button onClick={() => moveMenuItem(index, 'down')} style={arrowBtnStyle}>▼</button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div style={{ 
      background: bgMain, 
      minHeight: '100vh', 
      width: '100%', 
      maxWidth: '100vw', 
      overflowX: 'hidden', 
      fontFamily: 'system-ui, -apple-system, sans-serif', 
      color: textColor, 
      direction: 'rtl', 
      paddingBottom: '40px', 
      boxSizing: 'border-box', 
      position: 'relative' 
    }}>
      
      {incomingSoundAlert && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 4000, background: 'rgba(0,0,0,0.85)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', direction: 'rtl'
        }}>
          <div style={{
            background: cardBg, color: textColor, padding: '24px', borderRadius: '20px',
            width: '100%', maxWidth: '400px', border: '3px solid #dc2626', textAlign: 'center',
            boxShadow: '0 25px 50px rgba(220,38,38,0.5)'
          }}>
            <span style={{ fontSize: '48px', display: 'block', marginBottom: '10px' }}>🚨</span>
            <h2 style={{ color: '#dc2626', margin: '0 0 8px', fontSize: '22px' }}>התראה דחופה!</h2>
            <p style={{ fontSize: '16px', fontWeight: 'bold', margin: '0 0 6px' }}>
              {incomingSoundAlert.senderName} דורש/ת תשומת לב מיידית:
            </p>
            <div style={{ background: isDark ? '#3f1515' : '#fee2e2', color: '#dc2626', padding: '12px', borderRadius: '12px', fontSize: '15px', fontWeight: 'bold', marginBottom: '20px', border: '1px solid #fecaca' }}>
              "{incomingSoundAlert.message}"
            </div>
            <button
              onClick={() => {
                stopEscalatingAlarm();
                setIncomingSoundAlert(null);
              }}
              style={{
                width: '100%', padding: '14px', background: '#22c55e', color: '#fff',
                border: 'none', borderRadius: '12px', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(34,197,94,0.3)'
              }}
            >
              הפסק צפצוף וצור קשר ✓
            </button>
          </div>
        </div>
      )}

      {listeningStream && (
        <div style={{
          position: 'fixed', bottom: '20px', left: '20px', right: '20px', zIndex: 3500,
          background: '#dc2626', color: '#fff', padding: '12px 16px', borderRadius: '12px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 10px 25px rgba(220,38,38,0.4)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '20px' }}>🎙️</span>
            <span style={{ fontSize: '13px', fontWeight: 'bold' }}>מישהו מאזין כעת למיקרופון שלך (שידור חי)</span>
          </div>
          <button
            onClick={() => {
              listeningStream.getTracks().forEach(track => track.stop());
              setListeningStream(null);
            }}
            style={{ background: '#fff', color: '#dc2626', border: 'none', padding: '6px 12px', borderRadius: '8px', fontWeight: 'bold', fontSize: '12px', cursor: 'pointer' }}
          >
            נתק מיקרופון ✕
          </button>
        </div>
      )}

      <div style={{
        background: cardBg,
        color: textColor,
        textAlign: 'center',
        padding: '10px 16px',
        fontSize: '13px',
        fontWeight: 'bold',
        position: 'sticky',
        top: 0,
        zIndex: 1100,
        width: '100%',
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: `1.5px solid ${borderColor}`,
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
      }}>
        <button 
          onClick={() => handleGlobalClick(() => setSidebarOpen(true))}
          style={{
            background: cardBg, 
            border: `2px solid ${borderColor}`, 
            width: '40px', 
            height: '40px',
            borderRadius: '10px', 
            fontSize: '22px', 
            fontWeight: '900', 
            cursor: 'pointer',
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            color: textColor,
            boxShadow: cardShadow
          }}
          title="תפריט מהיר"
        >
          ☰
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%', background: isOnline ? '#22c55e' : '#f59e0b' }}></span>
          <span style={{ color: textColor, fontWeight: 'bold' }}>{isOnline ? 'מקוון' : 'לא מקוון'}</span>
        </div>
      </div>

      {activeSosAlert && (
        <div
          onClick={() => handleGlobalClick(() => setModalType('radar'))}
          style={{
            background: '#dc2626',
            color: '#ffffff',
            padding: '12px 18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '14px',
            boxShadow: '0 6px 12px rgba(220,38,38,0.3)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '18px' }}>🚨</span>
            <span><b>{activeSosAlert.name} הלך/ה לאיבוד!</b> לחץ כאן לפתיחת מפת החירום</span>
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); clearSosAlert(); }}
            style={{ background: 'rgba(0,0,0,0.2)', color: '#fff', border: 'none', padding: '4px 8px', borderRadius: '8px', fontSize: '11px', cursor: 'pointer' }}
          >
            אישור ✓
          </button>
        </div>
      )}

      {activeTimer && (
        <div
          onClick={() => handleGlobalClick(() => setModalType('timer'))}
          style={{
            background: timerRemainingSec > 0 ? '#f59e0b' : '#dc2626',
            color: '#ffffff',
            padding: '10px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '13px',
            boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>⏱️</span>
            <span>{activeTimer.title}:</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '15px', letterSpacing: '1px', background: 'rgba(0,0,0,0.2)', padding: '2px 8px', borderRadius: '6px' }}>
              {formatTimerClock(timerRemainingSec)}
            </span>
            <span style={{ fontSize: '11px' }}>פתח ⚙️</span>
          </div>
        </div>
      )}

      <div 
        onClick={() => handleGlobalClick(() => setModalType('weatherModal'))}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '10px',
          background: cardBg,
          border: `1.5px solid ${borderColor}`,
          borderRadius: '16px',
          padding: '10px 14px',
          margin: '12px 16px 4px 16px',
          boxShadow: cardShadow,
          boxSizing: 'border-box',
          width: 'calc(100% - 32px)',
          position: 'sticky',
          top: '63px',
          zIndex: 890,
          cursor: 'pointer'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0, flex: 1 }}>
          <span style={{ fontSize: '24px', flexShrink: 0 }}>☀️</span>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: '13px', fontWeight: 'bold', color: textColor, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {weatherData.location} · {weatherData.temp}
            </div>
            <div style={{ fontSize: '11px', color: textSub, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {weatherData.condition}
            </div>
          </div>
        </div>

        <a
          href="https://www.waze.com/ul?q=Bio%20Agriturismo%20Vojon,%20Ponti%20sul%20Mincio,%20Italy&navigate=yes"
          onClick={(e) => { e.stopPropagation(); playClickSound(); }}
          style={{
            background: cardBg,
            color: textColor,
            border: `1.5px solid ${borderColor}`,
            padding: '6px 10px',
            borderRadius: '10px',
            fontSize: '11px',
            fontWeight: 'bold',
            cursor: 'pointer',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            flexShrink: 0,
            boxShadow: cardShadow
          }}
          title="נווט למלון Bio Vojon ב-Waze"
        >
          {WAZE_SVG} למלון Vojon
        </a>
      </div>

      <header style={{
        padding: '10px 20px',
        background: bgMain,
        borderBottom: `1.5px solid ${borderColor}`,
        textAlign: 'center',
        position: 'sticky',
        top: '125px',
        zIndex: 880,
        width: '100%',
        boxSizing: 'border-box'
      }}>
        <h1 style={{ fontSize: '15px', fontWeight: 'bold', margin: '0 0 2px', color: textColor }}>אגם Garda וונציה</h1>
        <p style={{ fontSize: '10px', color: textSub, margin: 0 }}>טיול בת מצווה · 30.09 - 06.10.2026</p>
      </header>

      {sidebarOpen && (
        <div 
          onClick={() => setSidebarOpen(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0, 0, 0, 0.4)', zIndex: 2500, width: '100vw', height: '100vh', backdropFilter: 'blur(5px)', WebkitBackdropFilter: 'blur(5px)' }}
        />
      )}
      
      <aside 
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={() => handleTouchEnd(() => setSidebarOpen(false))}
        style={{
          position: 'fixed', top: 0, bottom: 0, right: 0, width: '320px', maxWidth: '85vw',
          background: cardBg, zIndex: 2600, boxShadow: '-20px 0 50px rgba(0,0,0,0.25)',
          transform: sidebarOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.3s cubic-bezier(0.32, 0.72, 0, 1)', padding: '24px 16px',
          display: 'flex', flexDirection: 'column', gap: '10px', borderLeft: `1.5px solid ${borderColor}`, boxSizing: 'border-box', overflowY: 'auto'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1.5px solid ${borderColor}`, paddingBottom: '16px', marginBottom: '10px' }}>
          <h3 style={{ fontSize: '20px', fontWeight: '600', margin: 0, color: textColor, letterSpacing: '-0.02em' }}>תפריט מהיר</h3>
          <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
            <button 
              onClick={() => handleGlobalClick(() => setThemeMode(isDark ? 'light' : 'dark'))}
              style={{ background: '#4b5563', color: '#fff', border: 'none', padding: '6px 10px', borderRadius: '10px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer', boxShadow: cardShadow }}
            >
              {isDark ? '☀️ בהיר' : '🌙 כהה'}
            </button>
            <button 
              onClick={() => handleGlobalClick(() => setShowThemeBuilder(true))}
              style={{ background: '#2563eb', color: '#fff', border: 'none', padding: '6px 10px', borderRadius: '10px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer', boxShadow: cardShadow }}
            >
              🎨 עיצוב
            </button>
            <button onClick={() => handleGlobalClick(() => setSidebarOpen(false))} style={{ width: '36px', height: '36px', borderRadius: '50%', background: cardBg, color: textColor, border: `1.5px solid ${borderColor}`, fontWeight: '900', fontSize: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: cardShadow }}>✕</button>
          </div>
        </div>

        {menuOrder.map((id, index) => renderMenuItem(id, index))}
      </aside>

      {modalType === 'appleMusicModal' && (
        <div onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={() => handleTouchEnd(() => setModalType(null))} style={{ ...modalStyle, background: bgMain }}>
          <div style={modalContentStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1.5px solid ${borderColor}`, paddingBottom: '16px', marginBottom: '18px' }}>
              <div>
                <small style={{ color: textSub, fontWeight: 'bold', fontSize: '11px' }}>APPLE MUSIC INTEGRATION</small>
                <h2 style={{ margin: '2px 0 0', fontSize: '18px', fontWeight: 'bold', color: textColor }}>🎵 פלייליסט נסיעה (Apple Music)</h2>
              </div>
              <button onClick={() => handleGlobalClick(() => setModalType(null))} style={{ width: '36px', height: '36px', borderRadius: '50%', background: cardBg, color: textColor, border: `1.5px solid ${borderColor}`, fontWeight: '900', fontSize: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: cardShadow }}>✕</button>
            </div>

            <div style={{ background: cardBg, borderRadius: '16px', padding: '16px', marginBottom: '16px', border: `1.5px solid ${borderColor}`, boxShadow: cardShadow, lineHeight: '1.6', textAlign: 'center' }}>
              <span style={{ fontSize: '42px', display: 'block', marginBottom: '10px' }}>🎧</span>
              <p style={{ margin: '0 0 12px', fontSize: '14px', color: textColor }}>
                <b>חיבור לחשבון Apple Music ליצירת פלייליסט משפחתי לדרך:</b>
              </p>
              <a
                href="https://music.apple.com"
                target="_blank"
                rel="noreferrer"
                style={{
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  padding: '12px 24px', background: '#fa233b', color: '#ffffff', borderRadius: '12px',
                  textDecoration: 'none', fontWeight: 'bold', fontSize: '14px', boxShadow: '0 4px 12px rgba(250,35,59,0.3)'
                }}
              >
                פתח את Apple Music והתחבר 🎵
              </a>
            </div>

            <button
              onClick={() => handleGlobalClick(() => setModalType(null))}
              style={{ width: '100%', padding: '12px', borderRadius: '12px', background: cardBg, color: textColor, border: `1.5px solid ${borderColor}`, fontWeight: 'bold', fontSize: '13px', cursor: 'pointer', boxShadow: cardShadow }}
            >
              סגור וחזור למסלול
            </button>
          </div>
        </div>
      )}

      {modalType === 'weatherModal' && (
        <div onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={() => handleTouchEnd(() => setModalType(null))} style={{ ...modalStyle, background: bgMain }}>
          <div style={modalContentStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1.5px solid ${borderColor}`, paddingBottom: '16px', marginBottom: '18px' }}>
              <div>
                <small style={{ color: textSub, fontWeight: 'bold', fontSize: '11px' }}>METEO LIVE & LOCATION</small>
                <h2 style={{ margin: '2px 0 0', fontSize: '18px', fontWeight: 'bold', color: textColor }}>☀️ תחזית ומזג אוויר עדכני</h2>
              </div>
              <button onClick={() => handleGlobalClick(() => setModalType(null))} style={{ width: '36px', height: '36px', borderRadius: '50%', background: cardBg, color: textColor, border: `1.5px solid ${borderColor}`, fontWeight: '900', fontSize: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: cardShadow }}>✕</button>
            </div>

            <div style={{ background: cardBg, borderRadius: '16px', padding: '16px', marginBottom: '16px', border: `1.5px solid ${borderColor}`, boxShadow: cardShadow, lineHeight: '1.6' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '14px' }}>
                <div style={{ background: isDark ? '#2c2c2e' : '#f8fafc', padding: '10px', borderRadius: '10px', border: `1px solid ${borderColor}` }}>
                  <small style={{ color: textSub, display: 'block' }}>טמפרטורה</small>
                  <strong style={{ fontSize: '16px', color: textColor }}>{weatherData.temp}</strong>
                </div>
                <div style={{ background: isDark ? '#2c2c2e' : '#f8fafc', padding: '10px', borderRadius: '10px', border: `1px solid ${borderColor}` }}>
                  <small style={{ color: textSub, display: 'block' }}>מצב</small>
                  <strong style={{ fontSize: '14px', color: textColor }}>שמש נעימה</strong>
                </div>
              </div>
            </div>

            <button
              onClick={() => handleGlobalClick(() => setModalType(null))}
              style={{ width: '100%', padding: '12px', borderRadius: '12px', background: cardBg, color: textColor, border: `1.5px solid ${borderColor}`, fontWeight: 'bold', fontSize: '13px', cursor: 'pointer', boxShadow: cardShadow }}
            >
              הבנתי, חזור למסלול
            </button>
          </div>
        </div>
      )}

      {modalType === 'around' && (
        <div onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={() => handleTouchEnd(() => setModalType(null))} style={{ ...modalStyle, background: bgMain }}>
          <div style={modalContentStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: `1.5px solid ${borderColor}`, paddingBottom: '14px' }}>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold', color: textColor }}>📍 סביבי (Around Me)</h3>
              <button onClick={() => handleGlobalClick(() => setModalType(null))} style={{ width: '36px', height: '36px', borderRadius: '50%', background: cardBg, color: textColor, border: `1.5px solid ${borderColor}`, fontWeight: '900', fontSize: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: cardShadow }}>✕</button>
            </div>

            <form onSubmit={handleAroundCustomSearch} style={{ position: 'relative', display: 'flex', gap: '8px', marginBottom: '16px', width: '100%', boxSizing: 'border-box' }}>
              <div style={{ position: 'relative', flex: 1, display: 'flex', alignItems: 'center', minWidth: 0 }}>
                <input
                  type="text"
                  dir="rtl"
                  autoComplete="off"
                  name="around_custom_search_input_safe_v8"
                  placeholder="הקלד או חפש כל דבר (לדוגמה: פארק)..."
                  value={aroundSearchQuery}
                  onChange={(e) => setAroundSearchQuery(e.target.value)}
                  style={{
                    width: '100%', padding: '12px 42px 12px 12px', borderRadius: '12px',
                    border: `1.5px solid ${borderColor}`, background: cardBg, color: textColor,
                    outline: 'none', fontSize: '16px', boxSizing: 'border-box', textAlign: 'right'
                  }}
                />
                <button
                  type="button"
                  onClick={startAroundVoiceSearch}
                  style={{ position: 'absolute', right: '10px', background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer' }}
                >
                  {isAroundListening ? '🔴' : '🎙️'}
                </button>
              </div>
              <button
                type="submit"
                style={{ padding: '0 16px', background: cardBg, color: textColor, border: `1.5px solid ${borderColor}`, borderRadius: '12px', fontWeight: 'bold', fontSize: '13px', cursor: 'pointer', boxShadow: cardShadow }}
              >
                חפש
              </button>
            </form>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', width: '100%', boxSizing: 'border-box' }}>
              <button onClick={() => window.location.href = 'https://maps.apple.com/?q=Autogrill'} style={{ ...gridModalBtn, background: cardBg, color: '#f59e0b', gridColumn: 'span 2', border: `1.5px solid ${borderColor}`, boxShadow: cardShadow }}>
                ☕ <span>עצירת דרך / Autogrill & שירותים</span>
              </button>
              <button onClick={() => window.location.href = 'https://maps.apple.com/?q=gas station'} style={{ ...gridModalBtn, background: cardBg, color: textColor, border: `1.5px solid ${borderColor}`, boxShadow: cardShadow }}>⛽ <span>תחנת דלק</span></button>
              <button onClick={() => window.location.href = 'https://maps.apple.com/?q=pharmacy'} style={{ ...gridModalBtn, background: cardBg, color: textColor, border: `1.5px solid ${borderColor}`, boxShadow: cardShadow }}>💊 <span>פארם</span></button>
            </div>
          </div>
        </div>
      )}

      {showThemeBuilder && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 3000, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', direction: 'rtl' }}>
          <div style={{ background: cardBg, color: textColor, padding: '24px', borderRadius: '20px', width: '100%', maxWidth: '400px', border: `1.5px solid ${borderColor}`, boxShadow: '0 20px 40px rgba(0,0,0,0.4)' }}>
            <h3 style={{ margin: '0 0 12px', fontSize: '18px', fontWeight: 'bold' }}>🛠️ יצירת גרסת עיצוב אישית</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
              <div>
                <label style={{ fontSize: '11px', fontWeight: 'bold', display: 'block', marginBottom: '4px' }}>צבע רקע כללי:</label>
                <input type="color" value={tempBgMain} onChange={(e) => setTempBgMain(e.target.value)} style={{ width: '100%', height: '36px', border: 'none', borderRadius: '8px', cursor: 'pointer' }} />
              </div>
              <div>
                <label style={{ fontSize: '11px', fontWeight: 'bold', display: 'block', marginBottom: '4px' }}>צבע רקע כרטיסים:</label>
                <input type="color" value={tempCardBg} onChange={(e) => setTempCardBg(e.target.value)} style={{ width: '100%', height: '36px', border: 'none', borderRadius: '8px', cursor: 'pointer' }} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={saveCustomTheme} style={{ flex: 1, padding: '12px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}>שמור גרסה</button>
              {customTheme && (<button onClick={resetCustomTheme} style={{ padding: '12px 16px', background: '#dc2626', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}>איפוס</button>)}
              <button onClick={() => setShowThemeBuilder(false)} style={{ padding: '12px 16px', background: cardBg, color: textColor, border: `1.5px solid ${borderColor}`, borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}>ביטול</button>
            </div>
          </div>
        </div>
      )}

      <main style={{ padding: '20px 16px', maxWidth: '600px', width: '100%', margin: 'auto', boxSizing: 'border-box' }}>
        
        <div style={{ 
          display: 'flex', 
          gap: '8px', 
          overflowX: 'auto', 
          paddingBottom: '8px', 
          marginBottom: '20px', 
          scrollbarWidth: 'none', 
          width: '100%', 
          boxSizing: 'border-box' 
        }}>
          {tripDays.map((d, i) => (
            <button
              key={i}
              onClick={() => handleGlobalClick(() => setActiveDay(i))}
              style={{
                flex: '1 0 auto',
                padding: '10px 14px',
                borderRadius: '14px',
                background: activeDay === i ? metallicGreyBg : cardBg,
                color: activeDay === i ? metallicGreyText : textColor,
                border: `1.5px solid ${activeDay === i ? metallicGreyBg : borderColor}`,
                fontSize: '13px',
                fontWeight: 'bold',
                cursor: 'pointer',
                boxShadow: cardShadow,
                transition: 'all 0.2s ease',
                textAlign: 'center'
              }}
            >
              {d.label}
            </button>
          ))}
        </div>

        <section style={{ width: '100%', boxSizing: 'border-box' }}>
          <div style={{ marginBottom: '16px' }}>
            <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 'bold', color: textColor }}>{day.icon} {day.title}</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '16px' }}>
            <button
              onClick={triggerSosLostAlert}
              style={{
                padding: '12px', borderRadius: '14px', background: isDark ? '#3f1515' : '#fee2e2', color: '#dc2626',
                border: '1px solid #fecaca', fontWeight: 'bold', fontSize: '13px', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: cardShadow
              }}
            >
              🚨 הלכתי לאיבוד! (SOS)
            </button>
            <button
              onClick={() => handleGlobalClick(() => setModalType('radar'))}
              style={{
                padding: '12px', borderRadius: '14px', background: cardBg, color: textColor,
                border: `1.5px solid ${borderColor}`, fontWeight: 'bold', fontSize: '13px', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: cardShadow
              }}
            >
              🧭 מפת המשפחה
            </button>
          </div>

          <div 
            onClick={() => handleGlobalClick(() => setModalType('questModal'))}
            style={{
              background: cardBg,
              border: `1.5px solid ${borderColor}`,
              borderRadius: '16px',
              padding: '16px',
              marginBottom: '20px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
              boxSizing: 'border-box',
              width: '100%',
              boxShadow: cardShadow
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: 0 }}>
              <div style={{ minWidth: 0, flex: 1 }}>
                <span style={{ display: 'block', fontSize: '11px', fontWeight: 'bold', color: '#16a34a', marginBottom: '2px' }}>
                  {isCurrentDayCompleted ? 'אתגר היום הושלם בהצלחה! 🎉' : 'אתגר היום:'}
                </span>
                <strong style={{ display: 'block', fontSize: '14px', color: textColor, fontWeight: 'bold' }}>
                  {day.challenge}
                </strong>
              </div>
            </div>
            <span style={{
              background: cardBg, color: textColor, padding: '8px 14px', borderRadius: '10px',
              fontSize: '12px', fontWeight: 'bold', flexShrink: 0, border: `1.5px solid ${borderColor}`, boxShadow: cardShadow
            }}>
              {isCurrentDayCompleted ? 'צפה ✏️' : 'פתח 🚀'}
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {day.stops && day.stops.map((stop, idx) => (
              <div key={idx} style={{ background: cardBg, border: `1.5px solid ${borderColor}`, borderRadius: '16px', padding: '16px', boxSizing: 'border-box', width: '100%', boxShadow: cardShadow }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 'bold', margin: 0, color: textColor }}>{stop.name}</h3>
                  <span style={{ fontSize: '12px', fontWeight: 'bold', color: textSub, background: cardBg, border: `1.5px solid ${borderColor}`, padding: '4px 8px', borderRadius: '8px', boxShadow: cardShadow }}>{stop.time}</span>
                </div>
                <p style={{ fontSize: '13px', color: textSub, margin: '4px 0 12px', lineHeight: '1.4' }}>{stop.note}</p>

                {stop.food && (
                  <div style={{ fontSize: '13px', background: cardBg, color: blockText, padding: '10px 12px', borderRadius: '12px', marginBottom: '12px', display: 'flex', flexDirection: 'column', gap: '8px', border: `1.5px solid ${borderColor}`, boxShadow: cardShadow }}>
                    <span><b>🍴 המלצה קולינרית:</b> {stop.food.name}</span>
                    <a 
                      href={`https://www.waze.com/ul?q=${encodeURIComponent(stop.food.dest)}&navigate=yes`}
                      onClick={() => playClickSound()}
                      style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px', background: cardBg, color: textColor, fontWeight: 'bold', fontSize: '12px', padding: '8px 12px', borderRadius: '10px', textDecoration: 'none', border: `1.5px solid ${borderColor}`, alignSelf: 'flex-start', boxShadow: cardShadow }}
                    >
                      {WAZE_SVG} נווט למסעדה ב-Waze
                    </a>
                  </div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', paddingTop: '12px', borderTop: `1.5px solid ${borderColor}` }}>
                  <a href={`https://maps.apple.com/?q=${encodeURIComponent(stop.dest)}`} target="_blank" rel="noreferrer" onClick={() => playClickSound()} style={{ ...navBtnStyle, background: cardBg, color: textColor, border: `1.5px solid ${borderColor}`, boxShadow: cardShadow }}>
                    {MAPS_SVG} Apple Maps
                  </a>
                  <a href={`https://www.waze.com/ul?q=${encodeURIComponent(stop.dest)}&navigate=yes`} onClick={() => playClickSound()} style={{ ...navBtnStyle, background: cardBg, color: textColor, border: `1.5px solid ${borderColor}`, boxShadow: cardShadow }}>
                    {WAZE_SVG} Waze
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {modalType === 'timer' && (
        <div onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={() => handleTouchEnd(() => setModalType(null))} style={{ ...modalStyle, background: bgMain }}>
          <div style={modalContentStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1.5px solid ${borderColor}`, paddingBottom: '16px', marginBottom: '18px' }}>
              <div>
                <small style={{ color: '#d97706', fontWeight: 'bold', fontSize: '11px' }}>FAMILY SYNC TIMER</small>
                <h2 style={{ margin: '2px 0 0', fontSize: '18px', fontWeight: 'bold', color: textColor }}>⏱️ טיימר משפחתי</h2>
              </div>
              <button onClick={() => handleGlobalClick(() => setModalType(null))} style={{ width: '36px', height: '36px', borderRadius: '50%', background: cardBg, color: textColor, border: `1.5px solid ${borderColor}`, fontWeight: '900', fontSize: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: cardShadow }}>✕</button>
            </div>

            {activeTimer ? (
              <div style={{ background: cardBg, borderRadius: '16px', padding: '20px', textAlign: 'center', marginBottom: '16px', border: `1.5px solid ${borderColor}`, boxShadow: cardShadow }}>
                <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#d97706', display: 'block', marginBottom: '6px' }}>
                  🎯 פעילות: {activeTimer.title}
                </span>
                <div style={{ fontSize: '42px', fontWeight: 'bold', color: timerRemainingSec > 0 ? textColor : '#dc2626', letterSpacing: '2px', margin: '10px 0' }}>
                  {formatTimerClock(timerRemainingSec)}
                </div>
                <button onClick={cancelGlobalTimer} style={{ padding: '8px 14px', borderRadius: '10px', background: '#dc2626', color: '#fff', border: 'none', fontWeight: 'bold', fontSize: '12px', cursor: 'pointer' }}>
                  ⏹️ בטל טיימר
                </button>
              </div>
            ) : (
              <div style={{ background: cardBg, borderRadius: '16px', padding: '16px', marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '12px', border: `1.5px solid ${borderColor}`, boxShadow: cardShadow }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 'bold', color: textSub, display: 'block', marginBottom: '4px' }}>שם הפעילות:</label>
                  <input
                    type="text"
                    placeholder="לדוגמה: זמן חופשי בפארק..."
                    value={customTimerTitle}
                    onChange={(e) => setCustomTimerTitle(e.target.value)}
                    style={{ width: '100%', padding: '10px', borderRadius: '10px', border: `1.5px solid ${borderColor}`, background: cardBg, color: textColor, boxSizing: 'border-box', outline: 'none' }}
                  />
                </div>
                <button
                  onClick={() => startGlobalTimer(customTimerMinutes, customTimerTitle)}
                  style={{ padding: '12px', borderRadius: '12px', background: cardBg, color: textColor, border: `1.5px solid ${borderColor}`, fontWeight: 'bold', fontSize: '14px', cursor: 'pointer', marginTop: '4px', boxShadow: cardShadow }}
                >
                  🚀 הפעל טיימר משפחתי
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {modalType === 'radar' && (
        <div onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={() => handleTouchEnd(() => setModalType(null))} style={{ ...modalStyle, background: bgMain, overflowY: 'auto' }}>
          <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '100%', boxSizing: 'border-box' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1.5px solid ${borderColor}`, padding: '16px', background: cardBg, position: 'sticky', top: 0, zIndex: 100, boxShadow: cardShadow }}>
              <div>
                <small style={{ color: textSub, fontWeight: 'bold', fontSize: '11px', textTransform: 'uppercase' }}>GPS LIVE RADAR</small>
                <h2 style={{ margin: '2px 0 0', fontSize: '18px', fontWeight: 'bold', color: textColor }}>📡 רדאר משפחתי חי</h2>
              </div>
              <button onClick={() => handleGlobalClick(() => setModalType(null))} style={{ width: '36px', height: '36px', borderRadius: '50%', background: cardBg, color: textColor, border: `1.5px solid ${borderColor}`, fontWeight: '900', fontSize: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: cardShadow }}>✕</button>
            </div>

            <div style={{ width: '100%', height: '300px', position: 'relative', background: '#0f172a', flexShrink: 0 }}>
              <iframe
                title="Family Radar Map"
                srcDoc={generateMapHTML(familyLocations, myLocation, activeSosAlert, isDark)}
                style={{ width: '100%', height: '100%', border: 'none' }}
              />
            </div>
          </div>
        </div>
      )}

      {modalType === 'parking' && (
        <div onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={() => handleTouchEnd(() => setModalType(null))} style={{ ...modalStyle, background: bgMain }}>
          <div style={modalContentStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: `1.5px solid ${borderColor}`, paddingBottom: '14px' }}>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold', color: textColor }}>🚗 שמירת מיקום רכב חכם</h3>
              <button onClick={() => handleGlobalClick(() => setModalType(null))} style={{ width: '36px', height: '36px', borderRadius: '50%', background: cardBg, color: textColor, border: `1.5px solid ${borderColor}`, fontWeight: '900', fontSize: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: cardShadow }}>✕</button>
            </div>
            {savedParking ? (
              <div style={{ background: cardBg, borderRadius: '16px', padding: '16px', marginBottom: '16px', border: `1.5px solid ${borderColor}`, boxShadow: cardShadow }}>
                <p style={{ margin: '0 0 6px', fontSize: '14px', fontWeight: 'bold', color: textColor }}>📌 {savedParking.note}</p>
                <button onClick={clearSavedParking} style={{ width: '100%', padding: '8px', background: 'none', border: 'none', color: '#dc2626', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}>🗑️ מחק חניה זו</button>
              </div>
            ) : (
              <div style={{ background: cardBg, borderRadius: '16px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px', border: `1.5px solid ${borderColor}`, boxShadow: cardShadow }}>
                <input type="text" placeholder="תיאור מקום חניה..." value={parkingNote} onChange={(e) => setParkingNote(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '10px', border: `1.5px solid ${borderColor}`, background: cardBg, color: textColor }} />
                <button onClick={saveSmartParkingLocation} style={{ padding: '12px', borderRadius: '12px', background: '#22c55e', color: '#ffffff', fontWeight: 'bold' }}>📍 שמור מיקום GPS</button>
              </div>
            )}
          </div>
        </div>
      )}

      {modalType === 'bingo' && (
        <div onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={() => handleTouchEnd(() => setModalType(null))} style={{ ...modalStyle, background: bgMain }}>
          <div style={modalContentStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1.5px solid ${borderColor}`, paddingBottom: '16px', marginBottom: '18px' }}>
              <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold', color: textColor }}>🎯 בינגו דרכים לאוטו</h2>
              <button onClick={() => handleGlobalClick(() => setModalType(null))} style={{ width: '36px', height: '36px', borderRadius: '50%', background: cardBg, color: textColor, border: `1.5px solid ${borderColor}`, fontWeight: '900', fontSize: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: cardShadow }}>✕</button>
            </div>
            {!bingoPlayer ? (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <p style={{ fontSize: '14px', fontWeight: 'bold', color: textColor, marginBottom: '14px' }}>בחר שחקן לבינגו:</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  {travelers.map((name, i) => (
                    <button key={i} onClick={() => handleGlobalClick(() => initBingoGame(name))} style={{ padding: '14px', borderRadius: '14px', background: cardBg, color: textColor, border: `1.5px solid ${borderColor}`, fontWeight: 'bold', cursor: 'pointer' }}>{name}</button>
                  ))}
                </div>
              </div>
            ) : (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span>שחקן: {bingoPlayer}</span>
                  <button onClick={() => setBingoPlayer('')}>החלף</button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                  {bingoCard.map((item, idx) => (
                    <button key={idx} onClick={() => toggleBingoItem(idx)} style={{ aspectRatio: '1', background: bingoChecked[idx] ? '#22c55e' : cardBg, color: bingoChecked[idx] ? '#fff' : textColor, border: `1.5px solid ${borderColor}`, borderRadius: '12px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}>{item}</button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {modalType === 'phrasebook' && (
        <div onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={() => handleTouchEnd(() => setModalType(null))} style={{ ...modalStyle, background: bgMain }}>
          <div style={modalContentStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1.5px solid ${borderColor}`, paddingBottom: '16px', marginBottom: '16px' }}>
              <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold', color: textColor }}>שיחון איטלקי חכם</h2>
              <button onClick={() => handleGlobalClick(() => setModalType(null))} style={{ width: '36px', height: '36px', borderRadius: '50%', background: cardBg, color: textColor, border: `1.5px solid ${borderColor}`, fontWeight: '900', fontSize: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: cardShadow }}>✕</button>
            </div>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
              <input type="text" placeholder="הקלד בעברית..." value={hebrewInput} onChange={(e) => setHebrewInput(e.target.value)} style={{ flex: 1, padding: '12px', borderRadius: '12px', border: `1.5px solid ${borderColor}`, background: cardBg, color: textColor }} />
              <button onClick={() => translateText(hebrewInput)} style={{ padding: '0 16px', background: cardBg, color: textColor, border: `1.5px solid ${borderColor}`, borderRadius: '12px', fontWeight: 'bold' }}>תרגם</button>
            </div>
            {italianOutput && (
              <div style={{ background: cardBg, padding: '12px', borderRadius: '12px', marginBottom: '16px', display: 'flex', justifyContent: 'space-between', border: `1.5px solid ${borderColor}` }}>
                <button onClick={() => speakItalian(italianOutput)}>🔊</button>
                <strong style={{ direction: 'ltr' }}>{italianOutput}</strong>
              </div>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {QUICK_PHRASES.map((p, idx) => (
                <div key={idx} onClick={() => speakItalian(p.it)} style={{ background: cardBg, borderRadius: '12px', padding: '10px', display: 'flex', justifyContent: 'space-between', cursor: 'pointer', border: `1.5px solid ${borderColor}` }}>
                  <span>🔊</span>
                  <div style={{ textAlign: 'right' }}>
                    <b>{p.he}</b><br/><small>{p.it}</small>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {modalType === 'trivia' && (
        <div onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={() => handleTouchEnd(() => setModalType(null))} style={{ ...modalStyle, background: bgMain }}>
          <div style={modalContentStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1.5px solid ${borderColor}`, paddingBottom: '16px', marginBottom: '18px' }}>
              <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold', color: textColor }}>🚗 טריויה חכמה לדרך</h2>
              <button onClick={() => handleGlobalClick(() => setModalType(null))} style={{ width: '36px', height: '36px', borderRadius: '50%', background: cardBg, color: textColor, border: `1.5px solid ${borderColor}`, fontWeight: '900', fontSize: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: cardShadow }}>✕</button>
            </div>
            <div style={{ background: cardBg, borderRadius: '16px', padding: '16px', marginBottom: '16px', border: `1.5px solid ${borderColor}` }}>
              <p style={{ fontWeight: 'bold', marginBottom: '12px' }}>{triviaQuestions[triviaIndex]?.q}</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {triviaQuestions[triviaIndex]?.options.map((opt, optIdx) => (
                  <button key={optIdx} onClick={() => handleTriviaAnswer(optIdx)} style={{ padding: '10px', borderRadius: '10px', background: cardBg, color: textColor, border: `1.5px solid ${borderColor}`, fontWeight: 'bold', cursor: 'pointer' }}>{opt}</button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {modalType === 'questModal' && (
        <div onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={() => handleTouchEnd(() => setModalType(null))} style={{ ...modalStyle, background: bgMain }}>
          <div style={modalContentStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1.5px solid ${borderColor}`, paddingBottom: '16px', marginBottom: '18px' }}>
              <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold', color: textColor }}>אתגר יומי</h2>
              <button onClick={() => handleGlobalClick(() => setModalType(null))} style={{ width: '36px', height: '36px', borderRadius: '50%', background: cardBg, color: textColor, border: `1.5px solid ${borderColor}`, fontWeight: '900', fontSize: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: cardShadow }}>✕</button>
            </div>
            <p style={{ fontWeight: 'bold', marginBottom: '12px' }}>{day.challenge}</p>
            <textarea rows="3" placeholder="כתוב הערה..." value={challengeNote} onChange={(e) => setChallengeNote(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '10px', marginBottom: '12px', background: cardBg, color: textColor, border: `1.5px solid ${borderColor}` }} />
            <button onClick={() => saveDailyChallenge(null)} style={{ width: '100%', padding: '12px', borderRadius: '12px', background: '#22c55e', color: '#fff', fontWeight: 'bold' }}>סמן כהושלם ✓</button>
          </div>
        </div>
      )}

      {modalType === 'challengesLog' && (
        <div onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={() => handleTouchEnd(() => setModalType(null))} style={{ ...modalStyle, background: bgMain }}>
          <div style={modalContentStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1.5px solid ${borderColor}`, paddingBottom: '16px', marginBottom: '16px' }}>
              <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold', color: textColor }}>יומן האתגרים והבדיחות</h2>
              <button onClick={() => handleGlobalClick(() => setModalType(null))} style={{ width: '36px', height: '36px', borderRadius: '50%', background: cardBg, color: textColor, border: `1.5px solid ${borderColor}`, fontWeight: '900', fontSize: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: cardShadow }}>✕</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {tripDays.map((d, idx) => (
                <div key={idx} style={{ background: cardBg, borderRadius: '14px', padding: '14px', border: `1.5px solid ${borderColor}` }}>
                  <b>{d.label}</b>: {d.challenge}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {modalType === 'gallery' && (
        <div onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={() => handleTouchEnd(() => setModalType(null))} style={{ ...modalStyle, background: bgMain }}>
          <div style={modalContentStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1.5px solid ${borderColor}`, paddingBottom: '16px', marginBottom: '16px' }}>
              <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold', color: textColor }}>📸 אלבום המסע המשפחתי</h2>
              <button onClick={() => handleGlobalClick(() => setModalType(null))} style={{ width: '36px', height: '36px', borderRadius: '50%', background: cardBg, color: textColor, border: `1.5px solid ${borderColor}`, fontWeight: '900', fontSize: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: cardShadow }}>✕</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '8px' }}>
              {galleryItems.map((item, i) => (
                <div key={item.id || i} style={{ background: cardBg, borderRadius: '12px', padding: '6px', border: `1.5px solid ${borderColor}` }}>
                  {item.media_url && <img src={item.media_url} alt={item.caption} style={{ width: '100%', height: '100px', objectFit: 'cover', borderRadius: '8px' }} />}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {modalType === 'viewer' && viewerItem && (
        <div onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={() => handleTouchEnd(() => setModalType(null))} style={{ ...modalStyle, background: bgMain }}>
          <div style={modalContentStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1.5px solid ${borderColor}`, paddingBottom: '16px', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, fontSize: '17px', fontWeight: 'bold', color: textColor }}>{viewerItem.title || viewerItem.name}</h3>
              <button onClick={() => handleGlobalClick(() => setModalType(null))} style={{ width: '36px', height: '36px', borderRadius: '50%', background: cardBg, color: textColor, border: `1.5px solid ${borderColor}`, fontWeight: '900', fontSize: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: cardShadow }}>✕</button>
            </div>
            <DocumentViewer item={viewerItem} isDark={isDark} blockText={blockText} cardShadow={cardShadow} />
          </div>
        </div>
      )}

      {modalType === 'emergency' && (
        <div onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={() => handleTouchEnd(() => setModalType(null))} style={{ ...modalStyle, background: bgMain }}>
          <div style={modalContentStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: `1.5px solid ${borderColor}`, paddingBottom: '14px' }}>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold', color: '#dc2626' }}>🆘 מספרי חירום באיטליה</h3>
              <button onClick={() => handleGlobalClick(() => setModalType(null))} style={{ width: '36px', height: '36px', borderRadius: '50%', background: cardBg, color: textColor, border: `1.5px solid ${borderColor}`, fontWeight: '900', fontSize: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: cardShadow }}>✕</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <a href="tel:112" style={{ ...gridModalBtn, background: isDark ? '#3f1515' : '#fee2e2', color: '#dc2626', textDecoration: 'none', border: `1.5px solid ${borderColor}` }}>🚨 חירום כללי: 112</a>
              <a href="tel:118" style={{ ...gridModalBtn, background: isDark ? '#3f1515' : '#fee2e2', color: '#dc2626', textDecoration: 'none', border: `1.5px solid ${borderColor}` }}>🚑 אמבולנס: 118</a>
            </div>
          </div>
        </div>
      )}

      {modalType === 'tickets' && (
        <div onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={() => handleTouchEnd(() => setModalType(null))} style={{ ...modalStyle, background: bgMain }}>
          <div style={modalContentStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1.5px solid ${borderColor}`, paddingBottom: '16px', marginBottom: '16px' }}>
              <div>
                <small style={{ color: textSub, fontWeight: 'bold', textTransform: 'uppercase', display: 'block', fontSize: '10px' }}>ארנק דיגיטלי</small>
                <h2 style={{ margin: '2px 0 0', fontSize: '18px', fontWeight: 'bold', color: textColor }}>🎟️ כרטיסים ומסמכים</h2>
              </div>
              <button onClick={() => handleGlobalClick(() => setModalType(null))} style={{ width: '36px', height: '36px', borderRadius: '50%', background: cardBg, color: textColor, border: `1.5px solid ${borderColor}`, fontWeight: '900', fontSize: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: cardShadow }}>✕</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '14px' }}>
              <button onClick={() => handleGlobalClick(() => setShowUploadBox(!showUploadBox))} style={{ padding: '10px', borderRadius: '12px', fontWeight: 'bold', fontSize: '12px', cursor: 'pointer', border: 'none', background: metallicGreyBg, color: metallicGreyText, boxShadow: cardShadow }}>
                ➕ הוסף כרטיס
              </button>
              <button onClick={() => handleGlobalClick(addNewFolder)} style={{ padding: '10px', borderRadius: '12px', fontWeight: 'bold', fontSize: '12px', cursor: 'pointer', border: `1.5px solid ${borderColor}`, background: cardBg, color: textColor, boxShadow: cardShadow }}>
                📁 תקייה חדשה
              </button>
            </div>

            <h3 style={{ fontSize: '13px', margin: '6px 0 8px', fontWeight: 'bold', color: textColor }}>תקיות הטיול</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '6px', marginBottom: '16px', width: '100%', boxSizing: 'border-box' }}>
              {folders.map((f, i) => (
                <div 
                  key={i} 
                  onClick={() => handleGlobalClick(() => setActiveFolder(f))}
                  style={{
                    padding: '10px', borderRadius: '12px',
                    background: activeFolder === f ? metallicGreyBg : cardBg,
                    color: activeFolder === f ? metallicGreyText : textColor,
                    border: `1.5px solid ${activeFolder === f ? metallicGreyBg : borderColor}`,
                    cursor: 'pointer', display: 'flex', flexDirection: 'column', justifyContent: 'center', boxSizing: 'border-box',
                    boxShadow: cardShadow
                  }}
                >
                  <strong style={{ display: 'block', fontSize: '12px', marginBottom: '2px' }}>{f}</strong>
                  <small style={{ color: activeFolder === f ? 'rgba(255,255,255,0.8)' : textSub, fontSize: '10px' }}>הצג קבצים</small>
                </div>
              ))}
            </div>

            <div style={{ borderBottom: `1.5px solid ${borderColor}`, paddingBottom: '6px', marginBottom: '10px', fontWeight: 'bold', fontSize: '12px', color: textColor }}>
              תכולת תיקייה: {activeFolder}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%', boxSizing: 'border-box' }}>
              {ticketFiles.length === 0 ? (
                <div style={{ textAlign: 'center', color: textSub, padding: '20px', fontSize: '12px' }}>אין עדיין כרטיסים בתקייה זו.</div>
              ) : (
                ticketFiles.map((x, idx) => (
                  <div 
                    key={x.id || idx} 
                    onClick={() => handleGlobalClick(() => { setViewerItem(x); setModalType('viewer'); })}
                    style={{ 
                      display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', 
                      gap: '10px', padding: '12px', borderRadius: '14px', background: cardBg, 
                      border: `1.5px solid ${borderColor}`, cursor: 'pointer', boxSizing: 'border-box', width: '100%',
                      boxShadow: cardShadow
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0, flex: 1 }}>
                      <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: isDark ? '#2c2c2e' : '#f8fafc', border: `1.5px solid ${borderColor}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', flexShrink: 0 }}>
                        {x.isFlightInfo ? '✈️' : (x.isInsuranceInfo ? '🛡️' : (x.isCarVoucher ? '🚗' : (x.isHotelInfo ? '🏡' : (x.isGardalandTicket ? '🎢' : (x.isMovielandTicket ? '🎬' : '📄'))))}
                      </div>
                      <div style={{ minWidth: 0, textAlign: 'right', flex: 1 }}>
                        <b style={{ display: 'block', fontSize: '13px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: textColor }}>{x.title || x.name}</b>
                        <small style={{ color: textSub, fontSize: '10px', display: 'block' }}>
                          {x.isGardalandTicket ? `כרטיס מעודכן (ID: ${x.ticketId})` : (x.isMovielandTicket ? `כרטיס קולנוע (${x.codeNum})` : 'מסמך מאובטח')}
                        </small>
                      </div>
                    </div>
                    <span style={{ fontSize: '11px', color: textColor, fontWeight: 'bold' }}>צפה 👁️</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

const arrowBtnStyle = {
  background: '#57585a', color: '#ffffff', border: 'none', borderRadius: '6px',
  width: '24px', height: '22px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer',
  display: 'flex', alignItems: 'center', justifyContent: 'center'
};

const navBtnStyle = {
  fontSize: '12px', fontWeight: 'bold',
  padding: '10px', borderRadius: '12px', display: 'flex', alignItems: 'center',
  justifyContent: 'center', gap: '6px', cursor: 'pointer', textDecoration: 'none', boxSizing: 'border-box'
};

const modalStyle = {
  position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
  width: '100vw', maxWidth: '100vw', height: '100vh',
  zIndex: 2000, overflowY: 'auto', overflowX: 'hidden',
  WebkitOverflowScrolling: 'touch', direction: 'rtl', boxSizing: 'border-box'
};

const modalContentStyle = {
  width: '100%', maxWidth: '600px', margin: '0 auto',
  padding: '16px 16px 40px', boxSizing: 'border-box',
  minHeight: '100vh', overflowX: 'hidden'
};

const gridModalBtn = {
  padding: '14px', borderRadius: '14px',
  fontWeight: 'bold', fontSize: '12px', textAlign: 'center', cursor: 'pointer',
  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', boxSizing: 'border-box', width: '100%', border: 'none'
};
