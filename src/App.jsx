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

const HOTEL_COORDINATES = { lat: 45.4057, lng: 10.7022, name: "Bio Agriturismo Vojon" };
const HOTEL_ADDRESS = "Via Del Forte 6, 46040 Ponti Sul Mincio, Italy";

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
    title: "מונטה באלדו (רכבל) + סירמיונה",
    icon: "🚠",
    challenge: "לצלם תמונת פנורמה משפחתית מפסגת הרכבל ותמונה רומנטית/משפחתית בסירמיונה!",
    challengeDesc: "תצפית מרהיבה מגובה של כמעט 1,800 מטר באלדו, ולאחר מכן שיטוט בסמטאות הקסומות של סירמיונה.",
    stops: [
      { time: "08:30", name: "עלייה לרכבל מונטה באלדו (מלצ׳סינה)", dest: "Funivia Malcesine-Monte Baldo", note: "רכבל מסתובב עוצר נשק אל פסגת הר האלדו. מומלץ להזמין מקום מראש!" },
      { time: "11:00", name: "תצפית מפסגת מונטה באלדו", dest: "Monte Baldo Summit, Italy", note: "הליכה קצרה, תצפיות פנורמיות על כל אגם גארדה, ואולי פגישה עם פרות הרריות." },
      { time: "13:00", name: "נסיעה וירידה דרומה לסירמיונה", dest: "Sirmione, Italy", note: "עיירת הימי ביניים הקסומה הבנויה על לשון יבשה בתוך האגם.", food: { name: "🍦 גלידה מפורסמת בסירמיונה + פיצה איטלקית", dest: "Sirmione, Italy" } },
      { time: "15:00", name: "טירת סקאליג'ר ומצודת סירמיונה", dest: "Scaliger Castle in Sirmione", note: "סיור סביב הטירת מים העתיקה והמרהיבה ושיטוט בסמטאות הצרות." }
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
    title: "ונציה – יום סיור קסום בעיר המים",
    icon: "🛶",
    challenge: "למצוא גשר קטן ויפה מחוץ למסלול הראשי ולספור 3 גונדולות!",
    challengeDesc: "צלמו את הגשר הכי מיוחד שמצאתם בסמטאות ונציה, וכתבו את הדבר הכי מוזר או יפה שראיתם בעיר המים.",
    stops: [
      { time: "07:30", name: "יציאה מוקדמת מהמלון לוונציה", dest: "Venezia Tronchetto Parking, Isola Nova del Tronchetto, Venezia", note: "חניית טרונקטו ומעבר בסירה/רכבת קלה למרכז." },
      { time: "09:30", name: "כיכר סן מרקו והבזיליקה", dest: "St. Mark's Square, Venice, Italy", note: "הלב הפועם של ונציה, כיכר מרהיבה, יונים וארמון הדוג'ה." },
      { time: "11:00", name: "גשר ריאלטו והשוק המפורסם", dest: "Rialto Bridge, Venice, Italy", note: "תצפית עוצרת נשק על התעלה הגדולה ושיטוט בשוק הססגוני." },
      { time: "13:00", name: "ארוחת צהריים בוונציה", dest: "Pizzeria L'Anfora, Venezia", note: "פיצרייה שכונתית מעולה הרחק מההמונים סביב סן מרקו.", food: { name: "🍕 Pizzeria L'Anfora + גלידת Suso המפורסמת", dest: "Calle Larga dei Bari, 1223, Venezia" } },
      { time: "15:00", name: "רובע דורסודור וגשר האקדמיה", dest: "Accademia Bridge, Venice, Italy", note: "אווירה אותנטית ושקטה יותר, גלריות אָמָּנוּת ונופים מדהימים של התעלה." }
    ]
  },
  {
    date: "2026-10-05",
    label: "שני · 05/10",
    fullLabel: "יום שני · 05 באוקטובר 2026",
    title: "X Rafting בבוקר + Borghetto בצהריים",
    icon: "🚣",
    challenge: "לצלם תמונה משפחתית מטורפת מהראפטינג ותמונה חגיגית בבורגטו!",
    challengeDesc: "מתחילים את הבוקר באקשן מים מסעיר ב-X Rafting, וממשיכים לצהריים רומנטיים בכפר הטחנות בורגטו.",
    stops: [
      { time: "09:00", name: "X Rafting – חוויית אקסטרים במים", dest: "X Rafting, Centri Rafting, Italy", note: "שיט ראפטינג משפחתי ומרגש בנהר עם צוות מדריכים מקצועי." },
      { time: "12:30", name: "Borghetto sul Mincio – הכפר והטחנות", dest: "Borghetto sul Mincio, Italy", note: "טיול רגלי ציורי בין הנהר, הגשרים והטחנות העתיקות.", food: { name: "🍝 Ristorante Alla Borsa (טורטליני מקורי 'קשר האהבה')", dest: "Ristorante Alla Borsa, Valeggio sul Mincio, Italy" } }
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

const TICKET_DEFAULT_FOLDERS = ['✈️ טיסות ורכב', '🏡 מלון', '🎢 Gardaland', '🚣 X Rafting ומונטה באלדו', '🎬 Movieland', '🏰 Medieval Times', '🚤 ונציה'];

const DEFAULT_DOCUMENTS = [
  { id: 'flight-arik', folder: '✈️ טיסות ורכב', title: 'כרטיס טיסה - אריק כהן (8180011314102)', name: 'Israir_Arik_Cohen.pdf', type: 'text/flight-info', size: 15400, created: 1005, isFlightInfo: true, passenger: 'COHEN/ARIK MR', ticketNo: '8180011314102' },
  { id: 'flight-amit', folder: '✈️ טיסות ורכב', title: 'כרטיס טיסה - עמית כהן (8180011314103)', name: 'Israir_Amit_Cohen.pdf', type: 'text/flight-info', size: 15400, created: 1004, isFlightInfo: true, passenger: 'COHEN/AMIT MS', ticketNo: '8180011314103' },
  { id: 'flight-yuly', folder: '✈️ טיסות ורכב', title: 'כרטיס טיסה - יולי כהן (8180011314104)', name: 'Israir_Yuly_Cohen.pdf', type: 'text/flight-info', size: 15400, created: 1003, isFlightInfo: true, passenger: 'COHEN/YULY MS', ticketNo: '8180011314104' },
  { id: 'flight-lian', folder: '✈️ טיסות ורכב', title: 'כרטיס טיסה - ליאן כהן (8180011314105)', name: 'Israir_Lian_Cohen.pdf', type: 'text/flight-info', size: 15400, created: 1002, isFlightInfo: true, passenger: 'COHEN/LIAN CHD', ticketNo: '8180011314105' },
  { id: 'flight-harel', folder: '✈️ טיסות ורכב', title: 'כרטיס טיסה - הראל וילנאי כהן (8180011314106)', name: 'Israir_Harel_Vilnai.pdf', type: 'text/flight-info', size: 15400, created: 1001, isFlightInfo: true, passenger: 'VILNAI COHEN/HAREL MR', ticketNo: '8180011314106' },
  { id: 'israir-general', folder: '✈️ טיסות ורכב', title: 'הזמנת ישראייר ראשית (4623652)', name: 'Israir Booking General', type: 'text/flight-info', size: 15400, created: 1000, isFlightInfo: true },
  { id: 'aig-insurance', folder: '✈️ טיסות ורכב', title: 'ביטוח נסיעות AIG (170270213826)', name: 'AIG Insurance Policy', type: 'text/insurance-info', size: 12000, created: 900, isInsuranceInfo: true },
  { id: 'ecovia-car', folder: '✈️ טיסות ורכב', title: 'שובר השכרת רכב (724715780)', name: 'Car Rental Voucher', type: 'text/car-voucher', size: 14000, created: 800, isCarVoucher: true },
  { id: 'vojon-hotel', folder: '🏡 מלון', title: 'הזמנת Bio Agriturismo Vojon', name: 'Hotel Booking Confirmation', type: 'text/hotel-info', size: 13000, created: 700, isHotelInfo: true },
  { id: 'gardaland-1', folder: '🎢 Gardaland', title: 'כרטיס Gardaland #1 (Serial 600)', name: 'Gardaland Ticket 600', type: 'text/gardaland-ticket', size: 11000, created: 650, isGardalandTicket: true, serial: '600', code: 'BKN1P01Y901MART', ticketId: '33385742', sigillo: '542965AEE291FEA3' },
  { id: 'gardaland-2', folder: '🎢 Gardaland', title: 'כרטיס Gardaland #2 (Serial 601)', name: 'Gardaland Ticket 601', type: 'text/gardaland-ticket', size: 11000, created: 640, isGardalandTicket: true, serial: '601', code: 'VKN1P01Y901ME4T', ticketId: '33385743', sigillo: '8762764E1A637781' },
  { id: 'gardaland-3', folder: '🎢 Gardaland', title: 'כרטיס Gardaland #3 (Serial 606)', name: 'Gardaland Ticket 606', type: 'text/gardaland-ticket', size: 11000, created: 630, isGardalandTicket: true, serial: '606', code: 'TKN1P01Y901MUTT', ticketId: '33385748', sigillo: 'DD1F221668493023' },
  { id: 'gardaland-4', folder: '🎢 Gardaland', title: 'כרטיס Gardaland #4 (Serial 608)', name: 'Gardaland Ticket 608', type: 'text/gardaland-ticket', size: 11000, created: 620, isGardalandTicket: true, serial: '608', code: 'CKN1P01Y901N2IT', ticketId: '33385750', sigillo: '7379E49AA9784605' },
  { id: 'gardaland-5', folder: '🎢 Gardaland', title: 'כרטיס Gardaland #5 (Serial 601 נוסף)', name: 'Gardaland Ticket Harel', type: 'text/gardaland-ticket', size: 11000, created: 610, isGardalandTicket: true, serial: '601', code: 'VKN1P01Y901ME4T', ticketId: '33385743', sigillo: '8762764E1A637781' },
  { id: 'movieland-1', folder: '🎬 Movieland', title: 'כרטיס Movieland #1 (069)', name: 'Movieland Ticket 069', type: 'text/movieland-ticket', size: 11000, created: 550, isMovielandTicket: true, codeNum: '017JUNAR0069', barcode: '256612CCD43B8E08' },
  { id: 'movieland-2', folder: '🎬 Movieland', title: 'כרטיס Movieland #2 (070)', name: 'Movieland Ticket 070', type: 'text/movieland-ticket', size: 11000, created: 540, isMovielandTicket: true, codeNum: '017JUNAR0070', barcode: 'EA35DB7A2EA540D5' },
  { id: 'movieland-3', folder: '🎬 Movieland', title: 'כרטיס Movieland #3 (071)', name: 'Movieland Ticket 071', type: 'text/movieland-ticket', size: 11000, created: 530, isMovielandTicket: true, codeNum: '017JUNAR0071', barcode: '934FEA2F66750267' },
  { id: 'movieland-4', folder: '🎬 Movieland', title: 'כרטיס Movieland #4 (072)', name: 'Movieland Ticket 072', type: 'text/movieland-ticket', size: 11000, created: 520, isMovielandTicket: true, codeNum: '017JUNAR0072', barcode: '52CACC0D5CAE334B' },
  { id: 'movieland-5', folder: '🎬 Movieland', title: 'כרטיס Movieland #5 (073)', name: 'Movieland Ticket 073', type: 'text/movieland-ticket', size: 11000, created: 510, isMovielandTicket: true, codeNum: '017JUNAR0073', barcode: '32D6C578DF258ACF' }
];

const RAW_BASE_QUESTIONS = [
  { q: "כמה רגליים יש לעכביש?", options: ["6", "8", "10", "12"], correct: 1 },
  { q: "איזה בעל חיים נחשב למהיר ביותר בעולם ביבשה?", options: ["אריה", "ברדלס (צ'יטה)", "סוס מירוץ", "זברה"], correct: 1 },
  { q: "כמה פלנטות יש במערכת השמש שלנו?", options: ["7", "8", "9", "10"], correct: 1 },
  { q: "איזה גז אנחנו בני האדם שואפים בעיקר כדי לחיות?", options: ["פחמן דו-חמצני", "חמצן", "מימן", "חנקן"], correct: 1 },
  { q: "איזה כוכב לכת ידוע בתור 'הכוכב האדום'?", options: ["נוגה", "מאדים", "צדק", "שבתאי"], correct: 1 },
  { q: "מהו האוקיינוס הגדול ביותר בעולם?", options: ["האוקיינוס האטלנטי", "האוקיינוס ההודי", "האוקיינוס השקט", "אוקיינוס הקרח הצפוני"], correct: 2 },
  { q: "כמה ימים יש בשנה רגילה?", options: ["364", "365", "366", "360"], correct: 1 },
  { q: "איזה יצור קדום חי בעבר על כדור הארץ ונכחד לפני מיליוני שנים?", options: ["כריש לבן", "דינוזאור", "תנין", "צב ים"], correct: 1 },
  { q: "מהי היבשה הקטנה ביותר בעולם?", options: ["אפריקה", "אוסטרליה", "אירופה", "אמריקה"], correct: 1 },
  { q: "באיזו מדינה נמצאים המפלים הגבוהים בעולם (מפלי אנג'ל)?", options: ["ונצואלה", "ברזיל", "ארצות הברית", "קנדה"], correct: 0 },
  { q: "כמה שיניים יש לבן אדם מבוגר בדרך כלל (כולל שיני בינה)?", options: ["28", "32", "36", "24"], correct: 1 },
  { q: "איזה חומר נחשב לקשה ביותר בטבע?", options: ["ברזל", "זהב", "יהלום", "טיטניום"], correct: 2 }
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

const calculateBearing = (lat1, lon1, lat2, lon2) => {
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δλ = (lon2 - lon1) * Math.PI / 180;
  const y = Math.sin(Δλ) * Math.cos(φ2);
  const x = Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);
  const θ = Math.atan2(y, x);
  return (θ * 180 / Math.PI + 360) % 360;
};

const LEAFLET_IFRAME_SRC = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <style>
    body, html { margin: 0; padding: 0; width: 100%; height: 100%; background: #0f172a; }
    #map { width: 100%; height: 100%; }
    .custom-tooltip { background: #1e293b; color: #fff; border: 1.5px solid #38bdf8; font-weight: 900; font-family: sans-serif; padding: 3px 8px; border-radius: 6px; font-size: 13px; direction: rtl; box-shadow: 0 2px 6px rgba(0,0,0,0.3); }
  </style>
</head>
<body>
  <div id="map"></div>
  <script>
    const map = L.map('map', { zoomControl: true }).setView([45.4384, 10.6816], 11);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap'
    }).addTo(map);

    let myMarker = null;
    let memberMarkers = {};

    window.addEventListener('message', (event) => {
      const { myLoc, familyLocs, sosState } = event.data || {};
      const allBounds = [];

      if (myLoc && myLoc.lat && myLoc.lng) {
        const redIcon = L.divIcon({
          className: 'custom-red-pin',
          html: '<div style="background-color:#dc2626; width:20px; height:20px; border-radius:50%; border:3px solid #ffffff; box-shadow:0 0 12px rgba(220,38,38,0.8);"></div>',
          iconSize: [20, 20],
          iconAnchor: [10, 10]
        });
        if (!myMarker) {
          myMarker = L.marker([myLoc.lat, myLoc.lng], { icon: redIcon }).addTo(map).bindPopup('📍 המיקום שלי באגם');
        } else {
          myMarker.setLatLng([myLoc.lat, myLoc.lng]);
        }
        allBounds.push([myLoc.lat, myLoc.lng]);
      }

      if (familyLocs) {
        const currentNames = Object.keys(familyLocs);
        Object.keys(memberMarkers).forEach(name => {
          if (!familyLocs[name]) {
            map.removeLayer(memberMarkers[name]);
            delete memberMarkers[name];
          }
        });

        currentNames.forEach(name => {
          const loc = familyLocs[name];
          const isSos = sosState && sosState.name === loc.name;
          const firstLetter = loc.name ? loc.name.charAt(0) : '?';
          const labelText = isSos ? '🚨 ' + firstLetter : firstLetter;

          if (memberMarkers[name]) {
            memberMarkers[name].setLatLng([loc.lat, loc.lng]);
            memberMarkers[name].setTooltipContent(labelText);
          } else {
            const marker = L.marker([loc.lat, loc.lng]).addTo(map);
            marker.bindTooltip(labelText, { permanent: true, direction: 'top', className: 'custom-tooltip' });
            memberMarkers[name] = marker;
          }
          allBounds.push([loc.lat, loc.lng]);
        });
      }

      if (allBounds.length > 1) {
        map.fitBounds(allBounds, { padding: [40, 40], maxZoom: 14 });
      } else if (allBounds.length === 1) {
        map.setView(allBounds[0], 12);
      }
    });
  </script>
</body>
</html>
`;

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
      return () => URL.revokeObjectURL(url);
    } else {
      setBlobUrl(null);
    }
  }, [item?.blob]);

  return (
    <div style={{ lineHeight: '1.8', fontSize: '14px', color: blockText, fontWeight: '600', boxSizing: 'border-box' }}>
      {item.isHotelInfo && (
        <>
          <p><b>סטטוס הזמנה:</b> <span style={{ color: '#059669', fontWeight: '900' }}>Confirmed (מאושר)</span></p>
          <p><b>כתובת המלון:</b><br/><span dir="ltr">Via Del Forte 6, 46040 Ponti Sul Mincio, Italy</span></p>
          <p><b>תאריכי שהות:</b> 30.09.2026 – 06.10.2026 (6 לילות)</p>
          <p><b>טלפון ליצירת קשר:</b> <a href="tel:+393792027060" style={{ color: isDark ? '#60a5fa' : '#1e3a8a', fontWeight: '800' }} dir="ltr">+39 379 202 7060</a></p>
          <a 
            href={`https://www.waze.com/ul?q=${encodeURIComponent(HOTEL_ADDRESS)}&navigate=yes`} 
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '14px', background: '#33ccff', color: '#000000', borderRadius: '14px', textDecoration: 'none', fontWeight: '900', marginTop: '20px', boxShadow: cardShadow }}
          >
            {WAZE_SVG} נווט למלון ב-Waze לפי הכתובת
          </a>
        </>
      )}

      {item.isFlightInfo && (
        <>
          <div style={{ background: '#e0f2fe', padding: '12px', borderRadius: '12px', color: '#0369a1', marginBottom: '12px', textAlign: 'center' }}>
            ✈️ <b>Israir E-Ticket Flight</b>
          </div>
          {item.passenger && <p><b>נוסע/ת:</b> <span style={{ fontWeight: '900', fontSize: '15px' }}>{item.passenger}</span></p>}
          {item.ticketNo && <p><b>מספר כרטיס טיסה:</b> <span dir="ltr">{item.ticketNo}</span></p>}
          <p><b>חברת תעופה:</b> ישראייר (Israir Airlines)</p>
          <p><b>מספר הזמנה (PNR):</b> <span style={{ fontWeight: '900' }}>4623652</span></p>
          <div style={{ background: isDark ? '#2c2c2e' : '#f1f5f9', padding: '10px', borderRadius: '10px', marginTop: '10px' }}>
            <p style={{ margin: '0 0 6px' }}>🛫 <b>הלוך (30-Sep-2026):</b> TLV ➔ VRN | טיסה 6H:357 | 13:15 - 16:05</p>
            <p style={{ margin: 0 }}>🛬 <b>חזור (06-Oct-2026):</b> VRN ➔ TLV | טיסה 6H:352 | 21:35 - 02:05</p>
          </div>
        </>
      )}

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

      {blobUrl && (
        <div style={{ marginTop: '16px', textAlign: 'center' }}>
          {item.type?.startsWith('image/') ? (
            <img src={blobUrl} alt={item.title || item.name} style={{ maxWidth: '100%', borderRadius: '12px', boxShadow: cardShadow }} />
          ) : (
            <a href={blobUrl} download={item.name} style={{ display: 'inline-block', padding: '12px 20px', background: isDark ? '#1c1c1e' : '#334155', color: '#fff', borderRadius: '10px', textDecoration: 'none', fontWeight: '800', boxShadow: cardShadow }}>
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
  const [folders, setFolders] = useState(TICKET_DEFAULT_FOLDERS);
  const [activeFolder, setActiveFolder] = useState('✈️ טיסות ורכב');
  const [ticketFiles, setTicketFiles] = useState(DEFAULT_DOCUMENTS.filter(d => d.folder === '✈️ טיסות ורכב'));
  const [showUploadBox, setShowUploadBox] = useState(false);
  const [newTicketTitle, setNewTicketTitle] = useState('');
  const [selectedUploadFolder, setSelectedUploadFolder] = useState('✈️ טיסות ורכב');

  const [galleryItems, setGalleryItems] = useState([]);
  const [showGalleryUpload, setShowGalleryUpload] = useState(false);
  const [galleryCaption, setGalleryCaption] = useState('');
  const [galleryUploaderName, setGalleryUploaderName] = useState('אריק');
  const [selectedGalleryPhoto, setSelectedGalleryPhoto] = useState(null);

  const [completedChallenges, setCompletedChallenges] = useState({});
  const [challengeNote, setChallengeNote] = useState('');
  const [challengeAuthor, setChallengeAuthor] = useState('אריק');
  const challengeAuthorRef = useRef(challengeAuthor);
  useEffect(() => { challengeAuthorRef.current = challengeAuthor; }, [challengeAuthor]);

  const [isAdminUnlocked, setIsAdminUnlocked] = useState(false);
  const [aroundSearchQuery, setAroundSearchQuery] = useState('');

  const [myLocation, setMyLocation] = useState(null);
  const [familyLocations, setFamilyLocations] = useState({});
  const [activeSosAlert, setActiveSosAlert] = useState(null);
  const mapIframeRef = useRef(null);

  // מצפן חי
  const [savedParking, setSavedParking] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('garda-saved-parking')) || null;
    } catch (e) { return null; }
  });
  const [parkingNote, setParkingNote] = useState('');
  const [compassTarget, setCompassTarget] = useState('parking');
  const [deviceHeading, setDeviceHeading] = useState(0);

  // טריוויה
  const travelers = ['אריק', 'עמית', 'יולי', 'ליאן', 'הראל'];
  const [travelerIndex, setTravelerIndex] = useState(0);
  const [triviaIndex, setTriviaIndex] = useState(0);
  const [travelerScores, setTravelerScores] = useState({ 'אריק': 0, 'עמית': 0, 'יולי': 0, 'ליאן': 0, 'הראל': 0 });
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState(null);

  // טיימר
  const [activeTimer, setActiveTimer] = useState(null);
  const [timerRemainingSec, setTimerRemainingSec] = useState(0);
  const [customTimerMinutes, setCustomTimerMinutes] = useState('15');
  const [customTimerTitle, setCustomTimerTitle] = useState('זמן חופשי ומפגש');

  const audioCtxRef = useRef(null);
  const dbInstanceRef = useRef(null);

  // סנכרון נתוני מפת iframe ללא רינדור מחדש
  useEffect(() => {
    if (mapIframeRef.current && mapIframeRef.current.contentWindow) {
      mapIframeRef.current.contentWindow.postMessage({
        myLoc: myLocation,
        familyLocs: familyLocations,
        sosState: activeSosAlert
      }, '*');
    }
  }, [myLocation, familyLocations, activeSosAlert]);

  // חיישן מצפן מגנטי
  useEffect(() => {
    const handleOrientation = (e) => {
      let heading = e.alpha;
      if (e.webkitCompassHeading) heading = e.webkitCompassHeading;
      if (heading !== null && heading !== undefined) setDeviceHeading(heading);
    };
    if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', handleOrientation, true);
    }
    return () => {
      if (window.DeviceOrientationEvent) {
        window.removeEventListener('deviceorientation', handleOrientation, true);
      }
    };
  }, []);

  // סנכרון Supabase Realtime יציב
  useEffect(() => {
    const channel = supabase
      .channel('realtime-radar')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'family_radar' }, payload => {
        if (payload.new && payload.new.name) {
          setFamilyLocations(prev => ({ ...prev, [payload.new.name]: payload.new }));
        }
      })
      .on('broadcast', { event: 'sos_alert' }, ({ payload }) => {
        if (payload) {
          setActiveSosAlert(payload);
          playClickSound();
        }
      })
      .on('broadcast', { event: 'sos_clear' }, () => setActiveSosAlert(null))
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // ניהול IndexedDB מקומי
  const openDb = () => {
    if (dbInstanceRef.current) return Promise.resolve(dbInstanceRef.current);
    return new Promise((resolve, reject) => {
      const req = indexedDB.open('gardaTripMasterDB_v5', 1);
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
          if (!merged.some(m => m.title === def.title)) merged.push(def);
        });
        setTicketFiles(merged.sort((a, b) => (b.created || 0) - (a.created || 0)));
      };
    } catch (e) {
      setTicketFiles(DEFAULT_DOCUMENTS.filter(d => d.folder === folder));
    }
  };

  useEffect(() => { loadFiles(activeFolder); }, [activeFolder]);

  const broadcastMyLocation = async (coords) => {
    const currentName = challengeAuthorRef.current || 'אריק';
    const locObj = {
      name: currentName,
      lat: coords.latitude,
      lng: coords.longitude,
      updated_at: new Date().toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' })
    };
    setMyLocation({ lat: coords.latitude, lng: coords.longitude });
    setFamilyLocations(prev => ({ ...prev, [currentName]: locObj }));

    try {
      await supabase.from('family_radar').upsert([locObj], { onConflict: 'name' });
    } catch (e) {}
    return locObj;
  };

  const saveSmartParkingLocation = () => {
    if (!navigator.geolocation) {
      alert('שירותי מיקום אינם נתמכים במכשיר');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const parkObj = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          note: parkingNote || 'רכב חונה',
          date: new Date().toLocaleDateString('he-IL'),
          time: new Date().toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' })
        };
        setSavedParking(parkObj);
        localStorage.setItem('garda-saved-parking', JSON.stringify(parkObj));
        alert('🚗 מיקום הרכב נשמר בהצלחה וזמין גם ללא אינטרנט!');
      },
      () => alert('שגיאה בקבלת GPS של הרכב'),
      { enableHighAccuracy: true }
    );
  };

  const playClickSound = () => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      if (!audioCtxRef.current) audioCtxRef.current = new AudioCtx();
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') ctx.resume();

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(580, ctx.currentTime);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } catch (e) {}
  };

  const handleTriviaAnswer = (optionIdx) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(optionIdx);
    const currentQ = RAW_BASE_QUESTIONS[triviaIndex % RAW_BASE_QUESTIONS.length];
    const currentTraveler = travelers[travelerIndex];

    if (optionIdx === currentQ.correct) {
      setIsAnswerCorrect(true);
      setTravelerScores(prev => ({ ...prev, [currentTraveler]: (prev[currentTraveler] || 0) + 10 }));
    } else {
      setIsAnswerCorrect(false);
    }

    setTimeout(() => {
      setSelectedAnswer(null);
      setIsAnswerCorrect(null);
      setTriviaIndex(prev => prev + 1);
      setTravelerIndex(prev => (prev + 1) % travelers.length);
    }, 1500);
  };

  const isDark = themeMode === 'dark';
  const bgMain = isDark ? '#000000' : '#ffffff';
  const cardBg = isDark ? '#1c1c1e' : '#ffffff';
  const textColor = isDark ? '#f5f5f7' : '#1d1d1f';
  const borderColor = isDark ? '#38383a' : '#cbd5e1';
  const textSub = isDark ? '#98989d' : '#6b7280';
  const cardShadow = '0 6px 20px rgba(0, 0, 0, 0.08)';

  const day = tripDays[activeDay] || tripDays[0];

  const targetCoords = compassTarget === 'parking' && savedParking
    ? { lat: savedParking.lat, lng: savedParking.lng, name: savedParking.note }
    : HOTEL_COORDINATES;

  const targetBearing = myLocation && targetCoords
    ? calculateBearing(myLocation.lat, myLocation.lng, targetCoords.lat, targetCoords.lng)
    : 0;
  const targetDistance = myLocation && targetCoords
    ? calculateDistanceKm(myLocation.lat, myLocation.lng, targetCoords.lat, targetCoords.lng)
    : 'דוגם GPS...';

  const compassArrowRotation = (targetBearing - deviceHeading + 360) % 360;

  return (
    <div style={{ background: bgMain, minHeight: '100vh', width: '100%', color: textColor, direction: 'rtl', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      
      {/* סרגל עליון */}
      <div style={{ background: cardBg, padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1.5px solid ${borderColor}`, position: 'sticky', top: 0, zIndex: 100 }}>
        <button onClick={() => setSidebarOpen(true)} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: textColor }}>☰</button>
        <span style={{ fontWeight: '900', fontSize: '15px' }}>🇮🇹 אגם גארדה וצפון איטליה</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: isOnline ? '#22c55e' : '#f59e0b' }}></span>
          <span style={{ fontSize: '11px', fontWeight: 'bold' }}>{isOnline ? 'ענן פעיל' : 'אופליין'}</span>
        </div>
      </div>

      {/* תפריט צדדי שלם */}
      {sidebarOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 2000, background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'flex-end' }}>
          <div style={{ width: '280px', background: cardBg, height: '100%', padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px', borderLeft: `1.5px solid ${borderColor}`, overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1px solid ${borderColor}`, paddingBottom: '10px' }}>
              <b>תפריט מהיר</b>
              <button onClick={() => setSidebarOpen(false)} style={{ background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer', color: textColor }}>✕</button>
            </div>
            <button onClick={() => { setModalType('compass'); setSidebarOpen(false); }} style={menuBtnStyle(borderColor, bgMain, textColor)}>🧭 מצפן חזרה למלון / רכב (חי)</button>
            <button onClick={() => { setModalType('radar'); setSidebarOpen(false); }} style={menuBtnStyle(borderColor, bgMain, textColor)}>📡 מפת רדאר משפחתי</button>
            <button onClick={() => { setModalType('tickets'); setSidebarOpen(false); }} style={menuBtnStyle(borderColor, bgMain, textColor)}>🎟️ ארנק כרטיסים ומסמכים</button>
            <button onClick={() => { setModalType('parking'); setSidebarOpen(false); }} style={menuBtnStyle(borderColor, bgMain, textColor)}>🚗 שמירת מיקום רכב</button>
            <button onClick={() => { setModalType('trivia'); setSidebarOpen(false); }} style={menuBtnStyle(borderColor, bgMain, textColor)}>🧠 טריוויה לדרך</button>
            <button onClick={() => { setModalType('gallery'); setSidebarOpen(false); }} style={menuBtnStyle(borderColor, bgMain, textColor)}>📸 אלבום תמונות משפחתי</button>
            <button onClick={() => { setModalType('around'); setSidebarOpen(false); }} style={menuBtnStyle(borderColor, bgMain, textColor)}>📍 סביבי (Around Me)</button>
            <button onClick={() => { setModalType('emergency'); setSidebarOpen(false); }} style={menuBtnStyle(borderColor, bgMain, textColor)}>🆘 מספרי חירום</button>
          </div>
        </div>
      )}

      {/* אזור ראשי */}
      <main style={{ maxWidth: '600px', margin: '0 auto', padding: '16px' }}>
        
        {/* ווידג'ט מצפן חי מהיר */}
        <div 
          onClick={() => { playClickSound(); setModalType('compass'); }}
          style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)', color: '#fff', borderRadius: '20px', padding: '16px', marginBottom: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 8px 20px rgba(30,58,138,0.3)' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '30px' }}>🧭</span>
            <div>
              <b style={{ fontSize: '15px', display: 'block' }}>מצפן חזרה למלון / רכב</b>
              <small style={{ opacity: 0.9, fontSize: '12px' }}>GPS חי: {targetDistance} אל {targetCoords.name}</small>
            </div>
          </div>
          <span style={{ background: 'rgba(255,255,255,0.2)', padding: '6px 12px', borderRadius: '10px', fontSize: '12px', fontWeight: 'bold' }}>פתח 🎯</span>
        </div>

        {/* בחירת יום במסלול */}
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '10px', marginBottom: '16px' }}>
          {tripDays.map((d, i) => (
            <button
              key={i}
              onClick={() => { playClickSound(); setActiveDay(i); }}
              style={{
                flex: '1 0 auto', padding: '10px 14px', borderRadius: '14px',
                background: activeDay === i ? '#1e3a8a' : cardBg, color: activeDay === i ? '#fff' : textColor,
                border: `1.5px solid ${borderColor}`, fontWeight: 'bold', fontSize: '12px', cursor: 'pointer'
              }}
            >
              {d.label}
            </button>
          ))}
        </div>

        {/* תחנות המסלול היומי */}
        <div style={{ background: cardBg, borderRadius: '20px', padding: '16px', border: `1.5px solid ${borderColor}`, marginBottom: '16px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '900', margin: '0 0 12px' }}>{day.icon} {day.title}</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {day.stops.map((stop, idx) => (
              <div key={idx} style={{ padding: '12px', borderRadius: '14px', background: bgMain, border: `1px solid ${borderColor}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <b>{stop.name}</b>
                  <span style={{ fontSize: '11px', color: textSub, fontWeight: 'bold' }}>{stop.time}</span>
                </div>
                <p style={{ fontSize: '12px', color: textSub, margin: '0 0 10px' }}>{stop.note}</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <a href={`https://maps.apple.com/?q=${encodeURIComponent(stop.dest)}`} target="_blank" rel="noreferrer" style={{ padding: '8px', borderRadius: '10px', background: cardBg, color: textColor, border: `1px solid ${borderColor}`, textDecoration: 'none', textAlign: 'center', fontSize: '12px', fontWeight: 'bold' }}>{MAPS_SVG} Apple Maps</a>
                  <a href={`https://www.waze.com/ul?q=${encodeURIComponent(stop.dest)}&navigate=yes`} style={{ padding: '8px', borderRadius: '10px', background: cardBg, color: textColor, border: `1px solid ${borderColor}`, textDecoration: 'none', textAlign: 'center', fontSize: '12px', fontWeight: 'bold' }}>{WAZE_SVG} Waze</a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* כפתור חזרה למלון */}
        <a 
          href={`https://www.waze.com/ul?q=${encodeURIComponent(HOTEL_ADDRESS)}&navigate=yes`}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '14px', background: '#10b981', color: '#fff', borderRadius: '16px', textDecoration: 'none', fontWeight: 'bold', fontSize: '14px' }}
        >
          {WAZE_SVG} ניווט ישיר למלון ב-Waze (Ponti sul Mincio)
        </a>
      </main>

      {/* מודאל 1: מצפן חזרה חי לשטח */}
      {modalType === 'compass' && (
        <div style={fullModalStyle(bgMain)}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1px solid ${borderColor}`, paddingBottom: '14px' }}>
            <div>
              <small style={{ color: '#3b82f6', fontWeight: 'bold', fontSize: '11px' }}>GPS COMPASS & BEARING</small>
              <h3 style={{ margin: 0, fontSize: '18px' }}>🧭 מצפן חזרה חי לשטח</h3>
            </div>
            <button onClick={() => setModalType(null)} style={closeCircleBtnStyle(cardBg, textColor, borderColor)}>✕</button>
          </div>

          <div style={{ display: 'flex', gap: '8px', margin: '16px 0' }}>
            <button 
              onClick={() => setCompassTarget('parking')} 
              style={{ flex: 1, padding: '10px', borderRadius: '12px', background: compassTarget === 'parking' ? '#1e3a8a' : cardBg, color: compassTarget === 'parking' ? '#fff' : textColor, border: `1px solid ${borderColor}`, fontWeight: 'bold', cursor: 'pointer' }}
            >
              🚗 כוון לרכב
            </button>
            <button 
              onClick={() => setCompassTarget('hotel')} 
              style={{ flex: 1, padding: '10px', borderRadius: '12px', background: compassTarget === 'hotel' ? '#1e3a8a' : cardBg, color: compassTarget === 'hotel' ? '#fff' : textColor, border: `1px solid ${borderColor}`, fontWeight: 'bold', cursor: 'pointer' }}
            >
              🏡 כוון למלון (Vojon)
            </button>
          </div>

          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: '220px', height: '220px', borderRadius: '50%', border: `4px solid ${borderColor}`, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', background: cardBg, boxShadow: cardShadow }}>
              <span style={{ position: 'absolute', top: '8px', fontWeight: '900', color: '#dc2626' }}>N</span>
              <span style={{ position: 'absolute', bottom: '8px', fontWeight: '900', color: textSub }}>S</span>
              <span style={{ position: 'absolute', right: '8px', fontWeight: '900', color: textSub }}>E</span>
              <span style={{ position: 'absolute', left: '8px', fontWeight: '900', color: textSub }}>W</span>

              <div style={{ transform: `rotate(${compassArrowRotation}deg)`, transition: 'transform 0.15s ease-out', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ width: 0, height: 0, borderLeft: '16px solid transparent', borderRight: '16px solid transparent', borderBottom: '55px solid #2563eb' }}></div>
                <div style={{ width: 0, height: 0, borderLeft: '16px solid transparent', borderRight: '16px solid transparent', borderTop: '55px solid #94a3b8' }}></div>
              </div>
            </div>

            <div style={{ textAlign: 'center', marginTop: '24px' }}>
              <h4 style={{ margin: '0 0 4px', fontSize: '18px' }}>יעד: {targetCoords.name}</h4>
              <p style={{ fontSize: '24px', fontWeight: '900', color: '#16a34a', margin: '4px 0' }}>{targetDistance}</p>
              <small style={{ color: textSub }}>כוון את ראש המכשיר לפי כיוון החץ הכחול</small>
            </div>
          </div>
        </div>
      )}

      {/* מודאל 2: מפת רדאר משפחתי */}
      {modalType === 'radar' && (
        <div style={fullModalStyle(bgMain)}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', background: cardBg, borderBottom: `1px solid ${borderColor}` }}>
            <h3 style={{ margin: 0, fontSize: '18px' }}>📡 רדאר משפחתי חי</h3>
            <button onClick={() => setModalType(null)} style={closeCircleBtnStyle(cardBg, textColor, borderColor)}>✕</button>
          </div>
          
          <div style={{ flex: 1, position: 'relative' }}>
            <iframe
              ref={mapIframeRef}
              title="Family Radar"
              srcDoc={LEAFLET_IFRAME_SRC}
              style={{ width: '100%', height: '100%', border: 'none' }}
            />
          </div>

          <div style={{ padding: '16px', background: cardBg, borderTop: `1px solid ${borderColor}` }}>
            <button 
              onClick={() => {
                if (navigator.geolocation) {
                  navigator.geolocation.getCurrentPosition((pos) => {
                    broadcastMyLocation(pos.coords);
                    alert('📍 מיקומך שודר למשפחה בהצלחה!');
                  });
                }
              }}
              style={{ width: '100%', padding: '12px', borderRadius: '12px', background: '#1e3a8a', color: '#fff', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}
            >
              📍 עדכן את המיקום שלי במפה עכשיו
            </button>
          </div>
        </div>
      )}

      {/* מודאל 3: ארנק כרטיסים ומסמכים */}
      {modalType === 'tickets' && (
        <div style={fullModalStyle(bgMain)}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1px solid ${borderColor}`, paddingBottom: '12px', marginBottom: '16px' }}>
            <h3 style={{ margin: 0, fontSize: '18px' }}>🎟️ ארנק כרטיסים (Offline Cache)</h3>
            <button onClick={() => setModalType(null)} style={closeCircleBtnStyle(cardBg, textColor, borderColor)}>✕</button>
          </div>

          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', marginBottom: '16px', paddingBottom: '6px' }}>
            {folders.map((f, i) => (
              <button 
                key={i} 
                onClick={() => setActiveFolder(f)}
                style={{ flex: '1 0 auto', padding: '8px 12px', borderRadius: '10px', background: activeFolder === f ? '#1e3a8a' : cardBg, color: activeFolder === f ? '#fff' : textColor, border: `1px solid ${borderColor}`, fontWeight: 'bold', fontSize: '11px', cursor: 'pointer' }}
              >
                {f}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {ticketFiles.map((x, idx) => (
              <div 
                key={x.id || idx}
                onClick={() => { setViewerItem(x); setModalType('viewer'); }}
                style={{ padding: '12px', borderRadius: '12px', background: cardBg, border: `1px solid ${borderColor}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
              >
                <b>{x.title || x.name}</b>
                <span style={{ fontSize: '12px', color: '#2563eb', fontWeight: 'bold' }}>פתח 👁️</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* מציג מסמכים */}
      {modalType === 'viewer' && viewerItem && (
        <div style={fullModalStyle(bgMain)}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1px solid ${borderColor}`, paddingBottom: '12px', marginBottom: '16px' }}>
            <h3 style={{ margin: 0, fontSize: '16px' }}>{viewerItem.title || viewerItem.name}</h3>
            <button onClick={() => setModalType('tickets')} style={closeCircleBtnStyle(cardBg, textColor, borderColor)}>✕</button>
          </div>
          <DocumentViewer item={viewerItem} isDark={isDark} blockText={textColor} cardShadow={cardShadow} />
        </div>
      )}

      {/* מודאל 4: שמירת רכב */}
      {modalType === 'parking' && (
        <div style={fullModalStyle(bgMain)}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1px solid ${borderColor}`, paddingBottom: '12px', marginBottom: '16px' }}>
            <h3 style={{ margin: 0, fontSize: '18px' }}>🚗 שמירת מיקום רכב חכם</h3>
            <button onClick={() => setModalType(null)} style={closeCircleBtnStyle(cardBg, textColor, borderColor)}>✕</button>
          </div>
          <input 
            type="text" 
            placeholder="הזן תיאור חניה (עמוד/קומה)..." 
            value={parkingNote} 
            onChange={(e) => setParkingNote(e.target.value)} 
            style={{ width: '100%', padding: '12px', borderRadius: '12px', border: `1px solid ${borderColor}`, background: cardBg, color: textColor, marginBottom: '14px', boxSizing: 'border-box' }} 
          />
          <button 
            onClick={saveSmartParkingLocation} 
            style={{ width: '100%', padding: '14px', borderRadius: '14px', background: '#22c55e', color: '#fff', border: 'none', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer' }}
          >
            📍 שמור מיקום GPS מדויק עכשיו
          </button>
        </div>
      )}

      {/* מודאל 5: טריוויה לדרך */}
      {modalType === 'trivia' && (
        <div style={fullModalStyle(bgMain)}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1px solid ${borderColor}`, paddingBottom: '12px', marginBottom: '16px' }}>
            <h3 style={{ margin: 0, fontSize: '18px' }}>🧠 טריוויה חכמה לדרך</h3>
            <button onClick={() => setModalType(null)} style={closeCircleBtnStyle(cardBg, textColor, borderColor)}>✕</button>
          </div>
          <div style={{ background: cardBg, padding: '10px', borderRadius: '12px', textAlign: 'center', marginBottom: '14px', border: `1px solid ${borderColor}` }}>
            <b>תורו/ה של: {travelers[travelerIndex]}!</b>
          </div>
          <div style={{ background: cardBg, padding: '16px', borderRadius: '14px', border: `1px solid ${borderColor}`, marginBottom: '14px' }}>
            <p style={{ margin: 0, fontWeight: 'bold' }}>{RAW_BASE_QUESTIONS[triviaIndex % RAW_BASE_QUESTIONS.length].q}</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {RAW_BASE_QUESTIONS[triviaIndex % RAW_BASE_QUESTIONS.length].options.map((opt, oIdx) => (
              <button
                key={oIdx}
                disabled={selectedAnswer !== null}
                onClick={() => handleTriviaAnswer(oIdx)}
                style={{ padding: '12px', borderRadius: '12px', border: `1px solid ${borderColor}`, background: selectedAnswer === oIdx ? (isAnswerCorrect ? '#22c55e' : '#dc2626') : cardBg, color: selectedAnswer === oIdx ? '#fff' : textColor, fontWeight: 'bold', textAlign: 'right', cursor: 'pointer' }}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* מודאל 6: סביבי (Around Me) */}
      {modalType === 'around' && (
        <div style={fullModalStyle(bgMain)}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1px solid ${borderColor}`, paddingBottom: '12px', marginBottom: '16px' }}>
            <h3 style={{ margin: 0, fontSize: '18px' }}>📍 סביבי (Around Me)</h3>
            <button onClick={() => setModalType(null)} style={closeCircleBtnStyle(cardBg, textColor, borderColor)}>✕</button>
          </div>
          <form onSubmit={(e) => { e.preventDefault(); if (aroundSearchQuery) window.location.href = `https://maps.apple.com/?q=${encodeURIComponent(aroundSearchQuery)}`; }} style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
            <input 
              type="text" 
              placeholder="חפש כל דבר סביבך..." 
              value={aroundSearchQuery} 
              onChange={(e) => setAroundSearchQuery(e.target.value)} 
              style={{ flex: 1, padding: '12px', borderRadius: '12px', border: `1px solid ${borderColor}`, background: cardBg, color: textColor }} 
            />
            <button type="submit" style={{ padding: '0 16px', borderRadius: '12px', background: '#1e3a8a', color: '#fff', border: 'none', fontWeight: 'bold' }}>חפש</button>
          </form>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <button onClick={() => window.location.href = 'https://maps.apple.com/?q=supermarket'} style={gridModalBtn(cardBg, textColor, borderColor)}>🛒 סופרמרקט</button>
            <button onClick={() => window.location.href = 'https://maps.apple.com/?q=pharmacy'} style={gridModalBtn(cardBg, textColor, borderColor)}>💊 בית מרקחת</button>
            <button onClick={() => window.location.href = 'https://maps.apple.com/?q=gas+station'} style={gridModalBtn(cardBg, textColor, borderColor)}>⛽ תחנת דלק</button>
            <button onClick={() => window.location.href = 'https://maps.apple.com/?q=restaurants'} style={gridModalBtn(cardBg, textColor, borderColor)}>🍝 מסעדות</button>
          </div>
        </div>
      )}

      {/* מודאל 7: מספרי חירום */}
      {modalType === 'emergency' && (
        <div style={fullModalStyle(bgMain)}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1px solid ${borderColor}`, paddingBottom: '12px', marginBottom: '16px' }}>
            <h3 style={{ margin: 0, fontSize: '18px', color: '#dc2626' }}>🆘 מספרי חירום באיטליה</h3>
            <button onClick={() => setModalType(null)} style={closeCircleBtnStyle(cardBg, textColor, borderColor)}>✕</button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <a href="tel:112" style={emergencyBtnStyle}>🚨 חירום כללי: 112</a>
            <a href="tel:118" style={emergencyBtnStyle}>🚑 אמבולנס: 118</a>
            <a href="tel:113" style={emergencyBtnStyle}>👮 משטרה: 113</a>
            <a href="tel:+390636911" style={emergencyBtnStyle}>🇮🇱 שגרירות ישראל</a>
          </div>
        </div>
      )}

    </div>
  );
}

const fullModalStyle = (bg) => ({
  position: 'fixed', inset: 0, zIndex: 3000, background: bg, overflowY: 'auto', padding: '16px', boxSizing: 'border-box'
});

const closeCircleBtnStyle = (bg, color, border) => ({
  width: '36px', height: '36px', borderRadius: '50%', background: bg, color: color, border: `1px solid ${border}`, fontWeight: 'bold', cursor: 'pointer'
});

const menuBtnStyle = (border, bg, color) => ({
  padding: '12px', borderRadius: '12px', border: `1px solid ${border}`, background: bg, color: color, fontWeight: 'bold', textAlign: 'right', cursor: 'pointer'
});

const gridModalBtn = (bg, color, border) => ({
  padding: '14px', borderRadius: '14px', fontWeight: 'bold', fontSize: '13px', background: bg, color: color, border: `1px solid ${border}`, cursor: 'pointer'
});

const emergencyBtnStyle = {
  padding: '16px', borderRadius: '14px', background: '#fee2e2', color: '#dc2626', textDecoration: 'none', fontWeight: 'bold', textAlign: 'center'
};
