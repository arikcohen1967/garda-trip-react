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
  { q: "איזה חומר נחשב לקשה ביותר בטבע?", options: ["ברזל", "זהב", "יהלום", "טיטניום"], correct: 2 },
  { q: "איזו חיה מפורסמת ידועה כישנה כמעט כל היום (כ-20 שעות ביממה)?", options: ["קואלה", "אריה", "פנדה", "דוב קוטב"], correct: 0 },
  { q: "באיזו שנה נחת האדם הראשון על הירח?", options: ["1959", "1969", "1979", "1989"], correct: 1 },
  { q: "מי היה האדם הראשון שהלך על הירח?", options: ["באז אולדרין", "ניל ארמסטרונג", "יוורי גגארין", "ג'ון גלן"], correct: 1 },
  { q: "מהו כוכב הלכת הקרוב ביותר לשמש?", options: ["נוגה", "מרקורי (חמה)", "מאדים", "ארץ"], correct: 1 },
  { q: "איזה בעל חיים הוא הגדול ביותר בעולם כיום?", options: ["פיל אפריקאי", "לווייתן כחול", "תנין הים", "ג'ירפה"], correct: 1 },
  { q: "מהי השפה המדוברת ביותר בעולם מבחינת מספר דוברים ילידים?", options: ["אנגלית", "ספרדית", "מנדרינית (סינית)", "הינדי"], correct: 2 },
  { q: "איזה יסוד כימי מסומן באותיות H?", options: ["הליום", "מימן (Hydrogen)", "חמצן", "זהב"], correct: 1 },
  { q: "מהו כיוון הזריחה של השמש?", options: ["מערב", "מזרח", "צפון", "דרום"], correct: 1 },
  { q: "מי כתב את ספרי 'הארי פוטר'?", options: ["ג'י. קיי. רולינג", "סטיבן קינג", "ג'. ר. ר. טולקין", "דן בראון"], correct: 0 },
  { q: "איזה מהמשחקים הבאים אינו משחק וידאו?", options: ["Minecraft", "Fortnite", "Monopoly", "Roblox"], correct: 2 },
  { q: "מה שמה של בובת הספוג הצהובה שגר באננס מתחת לים?", options: ["פטריק", "ספוגובב קבוע", "ספוגבוב מכנסמרובע", "סקווידוויד"], correct: 2 },
  { q: "מה שמו של גיבור העל שנושך על ידי עכביש רדיואקטיבי?", options: ["באטמן", "ספיידרמן", "סופרמן", "איירון מן"], correct: 1 },
  { q: "מהי בירת צרפת?", options: ["לונדון", "פריז", "ברלין", "רומא"], correct: 1 },
  { q: "מהי בירת אנגליה (בריטניה)?", options: ["פריז", "לונדון", "דבלין", "אדינבורו"], correct: 1 },
  { q: "באיזו מדינה נמצאת העיר ברצלונה?", options: ["פורטוגל", "איטליה", "ספרד", "צרפת"], correct: 2 },
  { q: "מהי בירת ספרד?", options: ["ברצלונה", "מדריד", "סביליה", "ולנסיה"], correct: 1 },
  { q: "באיזו מדינה נמצאת העיר טוקיו?", options: ["סין", "יפן", "קוריאה", "ויאטנם"], correct: 1 },
  { q: "מהי בירת גרמניה?", options: ["מינכן", "פרנקפורט", "ברלין", "המבורג"], correct: 2 }
];

const BINGO_ITEMS_POOL = [
  "🚗 פיאט 500 אדומה", "🛵 וספה / קטנוע", "🍇 כרם ענבים", "⛰️ מנהרה ארוכה", 
  "🚓 ניידת משטרה", "⛵ סירת מפרש", "🍦 שלט גלידריה", "🚜 טרקטור בכביש", 
  "🐕 כלב מציץ מחלון", "☕ שלט Autogrill", "🚲 רוכב אופניים", 
  "🏰 טירה עתיקה", "🏎️ פרארי / רכב ספורט", "🚚 משאית פירות", 
  "⛽ תחנת דלק ENI", "🌲 עץ ברוש גבוה"
];

const generateMassiveTrivia = () => {
  const shuffledBase = [...RAW_BASE_QUESTIONS];
  for (let i = shuffledBase.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledBase[i], shuffledBase[j]] = [shuffledBase[j], shuffledBase[i]];
  }

  const generated = [];
  for (let i = 0; i < 1000; i++) {
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
      return () => {
        URL.revokeObjectURL(url);
      };
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
          <p><b>טלפון ליצירת קשר:</b> <a href="tel:+393792027060" style={{ color: isDark ? '#93c5fd' : '#1d4ed8', fontWeight: '800' }} dir="ltr">+39 379 202 7060</a></p>
          
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

      {blobUrl && (
        <div style={{ marginTop: '16px', textAlign: 'center' }}>
          {item.type?.startsWith('image/') ? (
            <img 
              src={blobUrl} 
              alt={item.title || item.name} 
              style={{ maxWidth: '100%', borderRadius: '12px', boxShadow: cardShadow }} 
            />
          ) : (
            <a 
              href={blobUrl} 
              download={item.name} 
              style={{ display: 'inline-block', padding: '12px 20px', background: 'linear-gradient(180deg, #334155 0%, #1e293b 100%)', color: '#fff', borderRadius: '10px', textDecoration: 'none', fontWeight: '800', boxShadow: cardShadow }}
            >
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

  const travelers = ['אריק', 'עמית', 'יולי', 'ליאן', 'הראל'];
  
  // טריוויה: שחזור הניקוד וההתקדמות מ-localStorage
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

  // בינגו דרכים דינמי
  const [bingoPlayer, setBingoPlayer] = useState('');
  const [bingoCard, setBingoCard] = useState([]);
  const [bingoChecked, setBingoChecked] = useState({});
  const [hasBingoWin, setHasBingoWin] = useState(false);

  const [menuOrder, setMenuOrder] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('garda-menu-order'));
      if (Array.isArray(saved) && saved.length === 10) return saved;
    } catch (e) {}
    return ['schedule', 'challenges', 'bingo', 'trivia', 'phrasebook', 'gallery', 'around', 'parking', 'tickets', 'emergency'];
  });

  const [isEditingMenu, setIsEditingMenu] = useState(false);
  
  const audioContextRef = useRef(false);
  const currentUtteranceRef = useRef(null);
  const translationAbortRef = useRef(null);
  const dbInstanceRef = useRef(null);

  // שמירת ניקוד הטריוויה לזיכרון המכשיר
  useEffect(() => {
    localStorage.setItem('garda-trivia-scores', JSON.stringify(travelerScores));
    localStorage.setItem('garda-trivia-index', String(triviaIndex));
    localStorage.setItem('garda-trivia-traveler-idx', String(travelerIndex));
  }, [travelerScores, triviaIndex, travelerIndex]);

  // לוגיקת בינגו: יצירת לוח מותאם אישית
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
      
      // בדיקת נצחון בלוח 3x3 (שורות, עמודות, אלכסונים)
      const lines = [
        [0,1,2], [3,4,5], [6,7,8], // שורות
        [0,3,6], [1,4,7], [2,5,8], // טורים
        [0,4,8], [2,4,6]           // אלכסונים
      ];

      const isWin = lines.some(line => line.every(pos => updated[pos]));
      if (isWin) {
        setHasBingoWin(true);
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
        if (modalType) closeModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [sidebarOpen, modalType]);

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
    if (typeof callback === 'function') {
      callback();
    }
  };

  const closeModal = () => {
    setViewerItem(null);
    setModalType(null);
    setShowGalleryUpload(false);
    setGalleryCaption('');
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
    if (diff > 120) {
      onCloseCallback();
    }
  };

  useEffect(() => {
    if ('speechSynthesis' in window) {
      const loadVoices = () => {
        window.speechSynthesis.getVoices();
      };
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

    const handleOnline = () => {
      setIsOnline(true);
      checkSupabaseConnection();
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

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
        if (Array.isArray(cached) && cached.length) {
          setTripDays(cached);
        }
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
          if (!all.some(f => f.title === doc.title || (doc.isFlightInfo && f.isFlightInfo) || (doc.isInsuranceInfo && f.isInsuranceInfo) || (doc.isCarVoucher && f.isCarVoucher) || (doc.isHotelInfo && f.isHotelInfo))) {
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
      tx.onerror = (err) => console.error('IndexedDB upload error:', err);
    } catch (err) {
      console.error(err);
    }
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
    } catch (err) {
      console.error(err);
    }
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
    closeModal();
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

    if (modalType === 'questModal') closeModal();
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
      setHebrewInput('');
      setTranslationHistory(prev => [{ he: query, it: italianText, id: Date.now() }, ...prev.slice(0, 5)]);
      setIsTranslating(false);
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
    setTriviaIndex(prev => (prev + 1) % triviaQuestions.length);
    setTravelerIndex(prev => (prev + 1) % travelers.length);
  };

  const handleTriviaAnswer = (optionIdx) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(optionIdx);
    const currentQ = triviaQuestions[triviaIndex];
    const currentTraveler = travelers[travelerIndex];

    if (optionIdx === currentQ.correct) {
      setIsAnswerCorrect(true);
      setTravelerScores(prev => ({
        ...prev,
        [currentTraveler]: (prev[currentTraveler] || 0) + 10
      }));
    } else {
      setIsAnswerCorrect(false);
    }

    if (triviaTimerRef.current) clearTimeout(triviaTimerRef.current);
    triviaTimerRef.current = setTimeout(() => {
      nextTriviaQuestion();
    }, 1500);
  };

  const resetTriviaGame = () => {
    const pass = window.prompt('הזן קוד מנהל לאיפוס משחק הטריוויה:');
    if (pass !== '1967') {
      alert('קוד שגוי! לא ניתן לאפס את המשחק.');
      return;
    }
    if (triviaTimerRef.current) clearTimeout(triviaTimerRef.current);
    setTriviaQuestions(generateMassiveTrivia());
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

  const isDark = themeMode === 'darkSilver';

  const bgMain = isDark ? '#18181b' : '#f1f5f9';
  const cardBg = isDark ? '#27272a' : '#ffffff';
  const textColor = isDark ? '#ffffff' : '#0f172a';
  const textSub = isDark ? '#d4d4d8' : '#475569';
  const borderColor = isDark ? '#3f3f46' : '#cbd5e1';

  const cardShadow = isDark 
    ? '0 10px 25px -5px rgba(0, 0, 0, 0.2), 0 8px 10px -6px rgba(0, 0, 0, 0.2)'
    : 'inset 0 1px 0 rgba(255, 255, 255, 0.95), inset 0 -2px 0 rgba(0, 0, 0, 0.08), 0 4px 8px -2px rgba(0, 0, 0, 0.08), 0 2px 4px rgba(0, 0, 0, 0.05)';

  const blockBg = isDark 
    ? 'linear-gradient(135deg, #3f3f46 0%, #27272a 50%, #18181b 100%)' 
    : 'linear-gradient(180deg, #ffffff 0%, #f1f5f9 100%)';
  const blockText = isDark ? '#ffffff' : '#1e293b'; 
  const blockBorder = isDark ? '#52525b' : '#94a3b8';

  const renderMenuItem = (id, index) => {
    switch(id) {
      case 'schedule':
        return (
          <div key={id} style={{ display: 'flex', alignItems: 'center', gap: '6px', width: '100%' }}>
            <button onClick={() => handleGlobalClick(() => { setSidebarOpen(false); closeModal(); })} style={{ ...sidebarBtnStyle, background: blockBg, color: blockText, borderColor: blockBorder, boxShadow: cardShadow, flex: 1 }}><span>📅</span> מסלול ימי הטיול</button>
            {isEditingMenu && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <button onClick={() => moveMenuItem(index, 'up')} style={arrowBtnStyle}>▲</button>
                <button onClick={() => moveMenuItem(index, 'down')} style={arrowBtnStyle}>▼</button>
              </div>
            )}
          </div>
        );
      case 'challenges':
        return (
          <div key={id} style={{ display: 'flex', alignItems: 'center', gap: '6px', width: '100%' }}>
            <button onClick={() => handleGlobalClick(() => { setSidebarOpen(false); setModalType('challengesLog'); })} style={{ ...sidebarBtnStyle, background: blockBg, color: blockText, borderColor: blockBorder, boxShadow: cardShadow, flex: 1 }}><span>🏆</span> יומן אתגרים ובדיחות</button>
            {isEditingMenu && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <button onClick={() => moveMenuItem(index, 'up')} style={arrowBtnStyle}>▲</button>
                <button onClick={() => moveMenuItem(index, 'down')} style={arrowBtnStyle}>▼</button>
              </div>
            )}
          </div>
        );
      case 'bingo':
        return (
          <div key={id} style={{ display: 'flex', alignItems: 'center', gap: '6px', width: '100%' }}>
            <button onClick={() => handleGlobalClick(() => { setSidebarOpen(false); setModalType('bingo'); })} style={{ ...sidebarBtnStyle, background: blockBg, color: blockText, borderColor: blockBorder, boxShadow: cardShadow, flex: 1 }}><span>🎯</span> בינגו דרכים לאוטו 🚗</button>
            {isEditingMenu && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <button onClick={() => moveMenuItem(index, 'up')} style={arrowBtnStyle}>▲</button>
                <button onClick={() => moveMenuItem(index, 'down')} style={arrowBtnStyle}>▼</button>
              </div>
            )}
          </div>
        );
      case 'trivia':
        return (
          <div key={id} style={{ display: 'flex', alignItems: 'center', gap: '6px', width: '100%' }}>
            <button onClick={() => handleGlobalClick(() => { setSidebarOpen(false); setModalType('trivia'); })} style={{ ...sidebarBtnStyle, background: blockBg, color: blockText, borderColor: blockBorder, boxShadow: cardShadow, flex: 1 }}><span>🧠</span> טריויה חכמה לדרך 🚗</button>
            {isEditingMenu && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <button onClick={() => moveMenuItem(index, 'up')} style={arrowBtnStyle}>▲</button>
                <button onClick={() => moveMenuItem(index, 'down')} style={arrowBtnStyle}>▼</button>
              </div>
            )}
          </div>
        );
      case 'phrasebook':
        return (
          <div key={id} style={{ display: 'flex', alignItems: 'center', gap: '6px', width: '100%' }}>
            <button onClick={() => handleGlobalClick(() => { setSidebarOpen(false); setModalType('phrasebook'); })} style={{ ...sidebarBtnStyle, background: blockBg, color: blockText, borderColor: blockBorder, boxShadow: cardShadow, flex: 1 }}><span>🇮🇹</span> שיחון איטלקי חכם</button>
            {isEditingMenu && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <button onClick={() => moveMenuItem(index, 'up')} style={arrowBtnStyle}>▲</button>
                <button onClick={() => moveMenuItem(index, 'down')} style={arrowBtnStyle}>▼</button>
              </div>
            )}
          </div>
        );
      case 'gallery':
        return (
          <div key={id} style={{ display: 'flex', alignItems: 'center', gap: '6px', width: '100%' }}>
            <button onClick={() => handleGlobalClick(() => { setSidebarOpen(false); setModalType('gallery'); })} style={{ ...sidebarBtnStyle, background: blockBg, color: blockText, borderColor: blockBorder, boxShadow: cardShadow, flex: 1 }}><span>📸</span> יומן ואלבום תמונות משפחתי</button>
            {isEditingMenu && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <button onClick={() => moveMenuItem(index, 'up')} style={arrowBtnStyle}>▲</button>
                <button onClick={() => moveMenuItem(index, 'down')} style={arrowBtnStyle}>▼</button>
              </div>
            )}
          </div>
        );
      case 'around':
        return (
          <div key={id} style={{ display: 'flex', alignItems: 'center', gap: '6px', width: '100%' }}>
            <button onClick={() => handleGlobalClick(() => { setSidebarOpen(false); setModalType('around'); })} style={{ ...sidebarBtnStyle, background: blockBg, color: blockText, borderColor: blockBorder, boxShadow: cardShadow, flex: 1 }}><span>📍</span> סביבי (Around Me)</button>
            {isEditingMenu && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <button onClick={() => moveMenuItem(index, 'up')} style={arrowBtnStyle}>▲</button>
                <button onClick={() => moveMenuItem(index, 'down')} style={arrowBtnStyle}>▼</button>
              </div>
            )}
          </div>
        );
      case 'parking':
        return (
          <div key={id} style={{ display: 'flex', alignItems: 'center', gap: '6px', width: '100%' }}>
            <button onClick={() => handleGlobalClick(() => { setSidebarOpen(false); setModalType('parking'); })} style={{ ...sidebarBtnStyle, background: blockBg, color: blockText, borderColor: blockBorder, boxShadow: cardShadow, flex: 1 }}><span>🚗</span> שמירת מיקום חניה</button>
            {isEditingMenu && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <button onClick={() => moveMenuItem(index, 'up')} style={arrowBtnStyle}>▲</button>
                <button onClick={() => moveMenuItem(index, 'down')} style={arrowBtnStyle}>▼</button>
              </div>
            )}
          </div>
        );
      case 'tickets':
        return (
          <div key={id} style={{ display: 'flex', alignItems: 'center', gap: '6px', width: '100%' }}>
            <button onClick={() => handleGlobalClick(() => { setSidebarOpen(false); setModalType('tickets'); })} style={{ ...sidebarBtnStyle, background: blockBg, color: blockText, borderColor: blockBorder, boxShadow: cardShadow, flex: 1 }}><span>🎟️</span> ארנק כרטיסים ומסמכים</button>
            {isEditingMenu && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <button onClick={() => moveMenuItem(index, 'up')} style={arrowBtnStyle}>▲</button>
                <button onClick={() => moveMenuItem(index, 'down')} style={arrowBtnStyle}>▼</button>
              </div>
            )}
          </div>
        );
      case 'emergency':
        return (
          <div key={id} style={{ display: 'flex', alignItems: 'center', gap: '6px', width: '100%' }}>
            <button onClick={() => handleGlobalClick(() => { setSidebarOpen(false); setModalType('emergency'); })} style={{ ...sidebarBtnStyle, background: blockBg, color: blockText, borderColor: blockBorder, boxShadow: cardShadow, flex: 1 }}><span>🆘</span> מספרי חירום</button>
            {isEditingMenu && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <button onClick={() => moveMenuItem(index, 'up')} style={arrowBtnStyle}>▲</button>
                <button onClick={() => moveMenuItem(index, 'down')} style={arrowBtnStyle}>▼</button>
              </div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div style={{ 
      background: bgMain, 
      minHeight: '100vh', 
      width: '100%', 
      maxWidth: '100vw', 
      overflowX: 'clip', 
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, sans-serif', 
      color: textColor, 
      direction: 'rtl', 
      paddingBottom: '40px', 
      boxSizing: 'border-box', 
      position: 'relative' 
    }}>
      
      {/* פס עליון מטאלי */}
      <div style={{
        background: 'linear-gradient(135deg, #71717a 0%, #3f3f46 25%, #27272a 50%, #3f3f46 75%, #71717a 100%)',
        color: '#ffffff',
        textAlign: 'center',
        padding: '12px 16px',
        fontSize: '13px',
        fontWeight: '900',
        position: 'sticky',
        top: 0,
        zIndex: 1100,
        width: '100%',
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '2px solid #18181b',
        boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
        letterSpacing: '0.02em',
        textShadow: '0 1px 2px rgba(0,0,0,0.5)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%', background: isOnline ? '#34d399' : '#f59e0b', boxShadow: '0 0 10px rgba(255,255,255,0.9)' }}></span>
          <span>{isOnline ? 'on-line' : 'off-line'}</span>
        </div>

        <button
          onClick={() => handleGlobalClick(() => setThemeMode(isDark ? 'light' : 'darkSilver'))}
          style={{
            background: 'rgba(255, 255, 255, 0.15)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            color: '#ffffff',
            padding: '6px 12px',
            borderRadius: '10px',
            fontSize: '11px',
            fontWeight: '900',
            cursor: 'pointer',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.4), 0 2px 5px rgba(0,0,0,0.2)',
            transition: 'all 0.2s ease'
          }}
        >
          {isDark ? '✨ גרסה כהה (פעיל)' : '🎨 עבור לגרסה כהה'}
        </button>
      </div>

      <header style={{
        padding: '16px 20px',
        background: isDark ? '#27272a' : '#ffffff',
        borderBottom: `1px solid ${borderColor}`,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'sticky',
        top: '47px',
        zIndex: 900,
        width: '100%',
        boxSizing: 'border-box',
        boxShadow: isDark ? 'none' : '0 2px 8px rgba(0,0,0,0.04)'
      }}>
        <button 
          onClick={() => handleGlobalClick(() => setSidebarOpen(true))}
          style={{
            background: isDark ? 'linear-gradient(135deg, #71717a 0%, #3f3f46 50%, #27272a 100%)' : 'linear-gradient(180deg, #ffffff 0%, #f1f5f9 100%)', 
            border: `1px solid ${isDark ? '#52525b' : '#94a3b8'}`, 
            width: '48px', 
            height: '48px',
            borderRadius: '14px', 
            fontSize: '24px', 
            fontWeight: '900', 
            cursor: 'pointer',
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            color: isDark ? '#ffffff' : '#1e293b',
            boxShadow: cardShadow,
            textShadow: isDark ? '0 1px 1px rgba(0,0,0,0.3)' : 'none'
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
            background: isDark ? 'linear-gradient(135deg, #52525b 0%, #3f3f46 100%)' : 'linear-gradient(180deg, #ffffff 0%, #f1f5f9 100%)', 
            border: `1px solid ${isDark ? '#52525b' : '#94a3b8'}`, 
            padding: '10px 14px',
            borderRadius: '12px', fontSize: '13px', fontWeight: '900', 
            color: isDark ? '#ffffff' : '#1e293b', cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: '6px', boxShadow: cardShadow
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
      
      {/* תפריט צדדי מקובע */}
      <aside 
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={() => handleTouchEnd(() => setSidebarOpen(false))}
        style={{
          position: 'fixed', top: 0, bottom: 0, right: 0, width: '300px', maxWidth: '85vw',
          background: isDark ? '#1f1f23' : '#ffffff', zIndex: 2600, boxShadow: '-10px 0 30px rgba(0,0,0,0.3)',
          transform: sidebarOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)', padding: '28px 20px',
          display: 'flex', flexDirection: 'column', gap: '10px', borderLeft: `1px solid ${borderColor}`, boxSizing: 'border-box', overflowY: 'auto'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1px solid ${borderColor}`, paddingBottom: '14px', marginBottom: '6px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '900', margin: 0, color: textColor }}>תפריט מהיר</h3>
          <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
            <button 
              onClick={() => handleGlobalClick(() => setIsEditingMenu(!isEditingMenu))}
              style={{ background: isEditingMenu ? '#059669' : (isDark ? '#3f3f46' : '#f1f5f9'), color: isEditingMenu ? '#fff' : textColor, border: '1px solid #cbd5e1', padding: '4px 8px', borderRadius: '8px', fontSize: '11px', fontWeight: '800', cursor: 'pointer', boxShadow: isDark ? 'none' : 'inset 0 1px 0 #fff' }}
            >
              {isEditingMenu ? '✓ סיום עריכה' : '⚙️ ערוך תפריט'}
            </button>
            <button onClick={() => handleGlobalClick(() => setSidebarOpen(false))} style={{ ...modalCloseBtn, background: isDark ? '#3f3f46' : '#f1f5f9', color: textColor, border: '2px solid #94a3b8' }}>✕</button>
          </div>
        </div>

        {menuOrder.map((id, index) => renderMenuItem(id, index))}
      </aside>

      <main style={{ padding: '20px 16px', maxWidth: '600px', width: '100%', margin: 'auto', boxSizing: 'border-box' }}>
        
        {/* כפתורי ימי הטיול */}
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '12px', marginBottom: '18px', scrollbarWidth: 'none', width: '100%', boxSizing: 'border-box' }}>
          {tripDays.map((d, i) => (
            <button
              key={i}
              onClick={() => handleGlobalClick(() => setActiveDay(i))}
              style={{
                flex: '0 0 auto',
                padding: '10px 16px',
                borderRadius: '12px',
                background: activeDay === i 
                  ? (isDark ? 'linear-gradient(135deg, #a1a1aa 0%, #71717a 50%, #52525b 100%)' : 'linear-gradient(180deg, #334155 0%, #1e293b 100%)')
                  : (isDark ? 'linear-gradient(135deg, #52525b 0%, #3f3f46 50%, #27272a 100%)' : 'linear-gradient(180deg, #ffffff 0%, #f1f5f9 100%)'),
                color: activeDay === i ? '#ffffff' : (isDark ? '#ffffff' : '#1e293b'),
                border: `1px solid ${activeDay === i ? (isDark ? '#d4d4d8' : '#0f172a') : blockBorder}`,
                fontSize: '12px',
                fontWeight: '900',
                cursor: 'pointer',
                boxShadow: activeDay === i 
                  ? (isDark ? '0 4px 10px rgba(0,0,0,0.4)' : 'inset 0 2px 4px rgba(0,0,0,0.2), 0 2px 4px rgba(0,0,0,0.1)')
                  : cardShadow,
                transition: 'all 0.15s ease',
                textShadow: activeDay === i ? '0 1px 2px rgba(0,0,0,0.4)' : 'none'
              }}
            >
              {d.label}
            </button>
          ))}
        </div>

        <section style={{ width: '100%', boxSizing: 'border-box' }}>
          <div style={{ paddingBottom: '12px', marginBottom: '16px' }}>
            <h2 style={{ margin: 0, fontSize: '22px', fontWeight: '900', color: textColor }}>{day.icon} {day.title}</h2>
          </div>

          <div 
            onClick={() => handleGlobalClick(() => setModalType('questModal'))}
            style={{
              background: blockBg,
              border: `1px solid ${blockBorder}`,
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
              boxShadow: cardShadow
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: 0 }}>
              <div style={{ minWidth: 0, flex: 1 }}>
                <span style={{ display: 'block', fontSize: '12px', fontWeight: '900', color: isDark ? '#86efac' : '#166534', marginBottom: '2px' }}>
                  {isCurrentDayCompleted ? 'אתגר היום הושלם בהצלחה! 🎉' : 'אתגר היום:'}
                </span>
                <strong style={{ display: 'block', fontSize: '14px', color: blockText, fontWeight: '800', lineHeight: '1.4' }}>
                  {day.challenge}
                </strong>
              </div>
            </div>

            <span style={{
              background: isDark ? '#3f3f46' : 'linear-gradient(180deg, #334155 0%, #1e293b 100%)',
              color: '#ffffff',
              padding: '8px 14px', borderRadius: '10px',
              fontSize: '12px', fontWeight: '800', flexShrink: 0, border: '1px solid #94a3b8',
              boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
            }}>
              {isCurrentDayCompleted ? 'צפה ✏️' : 'פתח משימה 🚀'}
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {day.stops && day.stops.map((stop, idx) => (
              <div key={idx} style={{ background: cardBg, border: `1px solid ${borderColor}`, borderRadius: '20px', padding: '20px', boxSizing: 'border-box', width: '100%', boxShadow: cardShadow }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: '900', margin: 0, color: textColor }}>{stop.name}</h3>
                  <span style={{ fontSize: '12px', fontWeight: '800', color: blockText, background: blockBg, padding: '4px 10px', borderRadius: '10px', border: `1px solid ${blockBorder}`, boxShadow: cardShadow }}>{stop.time}</span>
                </div>
                <p style={{ fontSize: '13px', color: textSub, margin: '4px 0 16px', lineHeight: '1.5', fontWeight: '600' }}>{stop.note}</p>

                {stop.food && (
                  <div style={{ fontSize: '12px', background: isDark ? '#27272a' : 'linear-gradient(180deg, #ffffff 0%, #fefce8 100%)', color: isDark ? '#fde047' : '#1e293b', padding: '14px', borderRadius: '14px', marginBottom: '16px', border: `1px solid ${isDark ? '#52525b' : '#fef08a'}`, display: 'flex', flexDirection: 'column', gap: '10px', fontWeight: '700', boxSizing: 'border-box', boxShadow: cardShadow }}>
                    <span><b>🍴 המלצה קולינרית:</b> {stop.food.name}</span>
                    <a 
                      href={`https://www.waze.com/ul?q=${encodeURIComponent(stop.food.dest)}&navigate=yes`}
                      onClick={() => playClickSound()}
                      style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px', background: blockBg, color: isDark ? '#ffffff' : '#0284c7', fontWeight: '900', fontSize: '12px', padding: '9px 14px', borderRadius: '12px', textDecoration: 'none', border: `1px solid ${blockBorder}`, alignSelf: 'flex-start', boxShadow: cardShadow }}
                    >
                      {WAZE_SVG} נווט למסעדה ב-Waze
                    </a>
                  </div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', paddingTop: '14px', borderTop: `1px solid ${borderColor}` }}>
                  <a href={`https://maps.apple.com/?q=${encodeURIComponent(stop.dest)}`} target="_blank" rel="noreferrer" onClick={() => playClickSound()} style={{ ...navBtnStyle, background: blockBg, color: blockText, borderColor: blockBorder, boxShadow: cardShadow }}>
                    {MAPS_SVG} Maps
                  </a>
                  <a href={`https://www.waze.com/ul?q=${encodeURIComponent(stop.dest)}&navigate=yes`} onClick={() => playClickSound()} style={{ ...navBtnStyle, background: blockBg, color: isDark ? '#ffffff' : '#0284c7', borderColor: blockBorder, boxShadow: cardShadow }}>
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
                      padding: '10px 14px', borderRadius: '12px', background: blockBg, color: blockText,
                      border: `1px solid ${blockBorder}`, fontSize: '12px', fontWeight: '800', textDecoration: 'none', boxSizing: 'border-box',
                      boxShadow: cardShadow
                    }}
                  >
                    🚗 שמור/מצא רכב חונה
                  </a>
                  <button 
                    onClick={() => handleGlobalClick(() => setModalType('parking'))}
                    style={{ border: `1px solid ${blockBorder}`, background: blockBg, color: blockText, borderRadius: '12px', padding: '0 14px', fontSize: '14px', fontWeight: '800', cursor: 'pointer', boxShadow: cardShadow }}
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

      {/* מודל בינגו דרכים אינטראקטיבי */}
      {modalType === 'bingo' && (
        <div onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={() => handleTouchEnd(closeModal)} style={{ ...modalStyle, background: cardBg }}>
          <div style={modalContentStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1px solid ${borderColor}`, paddingBottom: '16px', marginBottom: '18px' }}>
              <h2 style={{ margin: 0, fontSize: '19px', fontWeight: '900', color: textColor }}>🎯 בינגו דרכים לאוטו</h2>
              <button onClick={() => handleGlobalClick(closeModal)} style={{ ...modalCloseBtn, background: isDark ? '#3f3f46' : '#f1f5f9', color: textColor, border: '2px solid #94a3b8' }}>✕</button>
            </div>

            {!bingoPlayer ? (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <p style={{ fontSize: '15px', fontWeight: '800', color: blockText, marginBottom: '16px' }}>מי משחק עכשיו? (בחר שם להפקת לוח אישי):</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  {travelers.map((name, i) => (
                    <button
                      key={i}
                      onClick={() => handleGlobalClick(() => initBingoGame(name))}
                      style={{ padding: '14px', borderRadius: '12px', background: blockBg, color: blockText, border: `1px solid ${blockBorder}`, fontSize: '15px', fontWeight: '900', cursor: 'pointer', boxShadow: cardShadow }}
                    >
                      👤 {name}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', background: isDark ? '#27272a' : '#f8fafc', padding: '10px 14px', borderRadius: '12px', border: `1px solid ${blockBorder}` }}>
                  <span style={{ fontSize: '14px', fontWeight: '900', color: '#0284c7' }}>לוח של: {bingoPlayer} 🎲</span>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button onClick={() => initBingoGame(bingoPlayer)} style={{ background: '#3b82f6', color: '#fff', border: 'none', padding: '6px 10px', borderRadius: '8px', fontSize: '11px', fontWeight: '800', cursor: 'pointer' }}>🔀 ערבב מחדש</button>
                    <button onClick={() => setBingoPlayer('')} style={{ background: isDark ? '#3f3f46' : '#e2e8f0', color: blockText, border: 'none', padding: '6px 10px', borderRadius: '8px', fontSize: '11px', fontWeight: '800', cursor: 'pointer' }}>החלף שחקן</button>
                  </div>
                </div>

                {hasBingoWin && (
                  <div style={{ background: '#dcfce7', border: '2px solid #22c55e', color: '#15803d', padding: '14px', borderRadius: '14px', textAlign: 'center', marginBottom: '14px', boxShadow: cardShadow }}>
                    <h3 style={{ margin: '0 0 4px', fontSize: '18px', fontWeight: '900' }}>🏆 בינגו! כל הכבוד {bingoPlayer}! 🎉</h3>
                    <p style={{ margin: 0, fontSize: '12px', fontWeight: '700' }}>השלמת רצף מנצח! מגיע לך כדור גלידה בוונציה / גארדה 🍦</p>
                  </div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                  {bingoCard.map((item, idx) => {
                    const isChecked = !!bingoChecked[idx];
                    return (
                      <button
                        key={idx}
                        onClick={() => toggleBingoItem(idx)}
                        style={{
                          aspectRatio: '1',
                          padding: '10px 6px',
                          borderRadius: '14px',
                          border: isChecked ? '2px solid #16a34a' : `1px solid ${blockBorder}`,
                          background: isChecked ? (isDark ? '#14532d' : '#86efac') : blockBg,
                          color: isChecked ? (isDark ? '#f0fdf4' : '#064e3b') : blockText,
                          fontSize: '12px',
                          fontWeight: '900',
                          cursor: 'pointer',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          textAlign: 'center',
                          boxShadow: isChecked ? '0 0 10px rgba(34, 197, 94, 0.4)' : cardShadow,
                          transform: isChecked ? 'scale(0.98)' : 'none',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        <span style={{ fontSize: '13px', lineHeight: '1.3' }}>{item}</span>
                        {isChecked && (
                          <span style={{ marginTop: '4px', fontSize: '11px', fontWeight: '900', background: '#16a34a', color: '#fff', padding: '1px 6px', borderRadius: '6px' }}>
                            ✓ נתפס!
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* מודל טריוויה */}
      {modalType === 'trivia' && (
        <div onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={() => handleTouchEnd(closeModal)} style={{ ...modalStyle, background: cardBg }}>
          <div style={modalContentStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1px solid ${borderColor}`, paddingBottom: '16px', marginBottom: '18px' }}>
              <h2 style={{ margin: 0, fontSize: '19px', fontWeight: '900', color: textColor }}>🚗 טריויה חכמה לזמן הנהיגה</h2>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <button 
                  onClick={() => handleGlobalClick(() => setIsTriviaPaused(!isTriviaPaused))}
                  style={{ background: isTriviaPaused ? '#f59e0b' : (isDark ? '#3f3f46' : '#f1f5f9'), color: isTriviaPaused ? '#fff' : textColor, border: '1px solid #cbd5e1', padding: '6px 10px', borderRadius: '8px', fontSize: '12px', fontWeight: '800', cursor: 'pointer', boxShadow: cardShadow }}
                >
                  {isTriviaPaused ? '▶️ המשך' : '⏸️ השהה'}
                </button>
                <button 
                  onClick={() => handleGlobalClick(resetTriviaGame)}
                  style={{ background: '#fef2f2', color: '#dc2626', border: '1px solid #fca5a5', padding: '6px 10px', borderRadius: '8px', fontSize: '12px', fontWeight: '800', cursor: 'pointer', boxShadow: cardShadow }}
                  title="איפוס וערבוב מחדש (דורש קוד מנהל)"
                >
                  🔒 איפוס
                </button>
                <button onClick={() => handleGlobalClick(closeModal)} style={{ ...modalCloseBtn, background: isDark ? '#3f3f46' : '#f1f5f9', color: textColor, border: '2px solid #94a3b8' }}>✕</button>
              </div>
            </div>

            {isTriviaPaused ? (
              <div style={{ textAlign: 'center', padding: '40px 20px', background: blockBg, borderRadius: '16px', border: `1px solid ${blockBorder}`, boxShadow: cardShadow }}>
                <span style={{ fontSize: '40px', display: 'block', marginBottom: '10px' }}>⏸️</span>
                <h3 style={{ fontSize: '18px', fontWeight: '900', color: blockText, margin: '0 0 8px' }}>המשחק מושהה</h3>
                <p style={{ fontSize: '13px', color: textSub, margin: 0 }}>הניקוד והשאלה שמורים בבטחה. לחצו על "המשך" כדי לחזור לשחק!</p>
              </div>
            ) : (
              <>
                <div style={{ background: isDark ? '#312e81' : '#eff6ff', border: '1px solid #3b82f6', borderRadius: '14px', padding: '12px 16px', marginBottom: '14px', textAlign: 'center', boxShadow: cardShadow }}>
                  <span style={{ fontSize: '15px', fontWeight: '900', color: isDark ? '#93c5fd' : '#1d4ed8' }}>
                    🎯 תורו של/ה של: <u style={{ fontSize: '17px' }}>{travelers[travelerIndex]}</u>!
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '6px', marginBottom: '16px' }}>
                  {travelers.map((name, idx) => (
                    <div key={idx} style={{ background: travelerIndex === idx ? (isDark ? '#3f3f46' : 'linear-gradient(180deg, #334155 0%, #1e293b 100%)') : blockBg, color: travelerIndex === idx ? '#fff' : blockText, border: `1px solid ${blockBorder}`, borderRadius: '10px', padding: '8px 4px', textAlign: 'center', fontSize: '11px', fontWeight: '800', boxShadow: cardShadow }}>
                      <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{name}</div>
                      <div style={{ fontSize: '13px', fontWeight: '900', color: travelerIndex === idx ? '#86efac' : '#166534' }}>{travelerScores[name] || 0} נק'</div>
                    </div>
                  ))}
                </div>

                {selectedAnswer !== null && (
                  <div style={{ textAlign: 'center', marginBottom: '16px', background: isDark ? '#27272a' : '#f8fafc', padding: '12px', borderRadius: '14px', border: `1px solid ${blockBorder}`, boxShadow: cardShadow }}>
                    <p style={{ fontSize: '15px', fontWeight: '900', color: isAnswerCorrect ? '#166534' : '#dc2626', margin: 0 }}>
                      {isAnswerCorrect ? `🎉 כל הכבוד ${travelers[travelerIndex]}! (+10 נק')` : `❌ לא מדויק ${travelers[travelerIndex]}! עוברים הלאה...`}
                    </p>
                  </div>
                )}

                <div style={{ background: blockBg, border: `1px solid ${blockBorder}`, borderRadius: '16px', padding: '18px', marginBottom: '18px', boxSizing: 'border-box', boxShadow: cardShadow }}>
                  <p style={{ margin: 0, fontSize: '16px', fontWeight: '900', color: blockText, lineHeight: '1.5' }}>
                    {triviaQuestions[triviaIndex]?.q}
                  </p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '18px' }}>
                  {triviaQuestions[triviaIndex]?.options.map((option, optIdx) => {
                    let btnBg = blockBg;
                    let btnColor = blockText;
                    let btnBorder = blockBorder;

                    if (selectedAnswer !== null) {
                      if (optIdx === triviaQuestions[triviaIndex].correct) {
                        btnBg = '#d1fae5';
                        btnColor = '#065f46';
                        btnBorder = '#34d399';
                      } else if (optIdx === selectedAnswer) {
                        btnBg = '#fee2e2';
                        btnColor = '#991b1b';
                        btnBorder = '#f87171';
                      }
                    }

                    return (
                      <button
                        key={optIdx}
                        disabled={selectedAnswer !== null}
                        onClick={() => handleGlobalClick(() => handleTriviaAnswer(optIdx))}
                        style={{
                          padding: '14px 16px', borderRadius: '12px', textAlign: 'right', fontSize: '14px', fontWeight: '800',
                          background: btnBg, color: btnColor, border: `1px solid ${btnBorder}`, cursor: selectedAnswer === null ? 'pointer' : 'default',
                          boxShadow: cardShadow, transition: 'all 0.15s ease'
                        }}
                      >
                        {option}
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* מודל אתגר יומי */}
      {modalType === 'questModal' && (
        <div onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={() => handleTouchEnd(closeModal)} style={{ ...modalStyle, background: cardBg }}>
          <div style={modalContentStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1px solid ${borderColor}`, paddingBottom: '16px', marginBottom: '18px' }}>
              <h2 style={{ margin: 0, fontSize: '19px', fontWeight: '900', color: textColor }}>הפתעת הבוקר והאתגר!</h2>
              <button onClick={() => handleGlobalClick(closeModal)} style={{ ...modalCloseBtn, background: isDark ? '#3f3f46' : '#f1f5f9', color: textColor, border: '2px solid #94a3b8' }}>✕</button>
            </div>

            <div style={{ background: blockBg, border: `1px solid ${blockBorder}`, borderRadius: '16px', padding: '18px', marginBottom: '20px', textAlign: 'center', boxSizing: 'border-box', boxShadow: cardShadow }}>
              <span style={{ fontSize: '32px', display: 'block', marginBottom: '4px' }}>🎯</span>
              <h3 style={{ margin: '0 0 6px', fontSize: '17px', fontWeight: '900', color: blockText }}>{day.challenge}</h3>
              <p style={{ margin: 0, fontSize: '13px', color: blockText, lineHeight: '1.4', fontWeight: '700' }}>{day.challengeDesc}</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '16px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: '800', color: textSub, display: 'block', marginBottom: '6px' }}>מי ביצע / מתעד?</label>
                <select value={challengeAuthor} onChange={(e) => setChallengeAuthor(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '12px', border: `1px solid ${blockBorder}`, background: blockBg, color: blockText, fontWeight: '800', boxSizing: 'border-box', boxShadow: cardShadow }}>
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
                <textarea rows="3" placeholder="לדוגמה: עמית צעקה הכי חזק ברכבת הרים..." value={challengeNote} onChange={(e) => setChallengeNote(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '12px', border: `1px solid ${blockBorder}`, background: isDark ? '#18181b' : '#ffffff', color: blockText, fontSize: '13px', boxSizing: 'border-box', outline: 'none', fontWeight: '600', boxShadow: cardShadow }} />
              </div>

              <input type="file" id="questPhotoInput" accept="image/*" capture="environment" style={{ display: 'none' }} onChange={(e) => { if (e.target.files && e.target.files[0]) saveDailyChallenge(e.target.files[0]); }} />

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <button onClick={() => handleGlobalClick(() => document.getElementById('questPhotoInput').click())} style={{ padding: '14px', borderRadius: '12px', background: blockBg, color: blockText, border: `1px solid ${blockBorder}`, fontWeight: '900', fontSize: '13px', cursor: 'pointer', boxShadow: cardShadow }}>📸 צלם לאלבום</button>
                <button onClick={() => handleGlobalClick(() => saveDailyChallenge(null))} style={{ padding: '14px', borderRadius: '12px', background: isDark ? '#3f3f46' : 'linear-gradient(180deg, #334155 0%, #1e293b 100%)', color: '#fff', border: '1px solid #0f172a', fontWeight: '900', fontSize: '13px', cursor: 'pointer', boxShadow: '0 2px 6px rgba(0,0,0,0.15)' }}>✅ סמן כהושלם</button>
              </div>

              {isCurrentDayCompleted && (
                <button onClick={() => handleGlobalClick(() => resetSingleChallenge(activeDay))} style={{ background: '#fef2f2', color: '#dc2626', border: '1px solid #fca5a5', padding: '12px', borderRadius: '12px', fontWeight: '900', fontSize: '13px', cursor: 'pointer', width: '100%', boxSizing: 'border-box', boxShadow: cardShadow }}>🔒 אפס משימה זו (מנהל)</button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* מודל יומן אתגרים */}
      {modalType === 'challengesLog' && (
        <div onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={() => handleTouchEnd(closeModal)} style={{ ...modalStyle, background: cardBg }}>
          <div style={modalContentStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1px solid ${borderColor}`, paddingBottom: '16px', marginBottom: '16px' }}>
              <div>
                <h2 style={{ margin: 0, fontSize: '19px', fontWeight: '900', color: textColor }}>יומן האתגרים והבדיחות</h2>
                <button 
                  onClick={handleToggleAdminQuests}
                  style={{ background: 'none', border: 'none', color: isAdminUnlocked ? '#059669' : textSub, fontSize: '11px', fontWeight: '800', cursor: 'pointer', padding: '4px 0 0 0', textDecoration: 'underline' }}
                >
                  {isAdminUnlocked ? '🔓 מחובר כמנהל (כל המשימות פתוחות)' : '🔒 פתח נעילת מנהל (1967)'}
                </button>
              </div>
              <button onClick={() => handleGlobalClick(closeModal)} style={{ ...modalCloseBtn, background: isDark ? '#3f3f46' : '#f1f5f9', color: textColor, border: '2px solid #94a3b8' }}>✕</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {tripDays.map((d, idx) => {
                const log = completedChallenges[d.date] || completedChallenges[String(idx)];
                const isUnlocked = isAdminUnlocked || log?.completed;
                return (
                  <div key={idx} style={{ background: log?.completed ? (isDark ? '#27272a' : '#f0fdf4') : blockBg, border: `1px solid ${log?.completed ? '#71717a' : blockBorder}`, borderRadius: '16px', padding: '16px', boxSizing: 'border-box', width: '100%', boxShadow: cardShadow }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <span style={{ fontSize: '11px', fontWeight: '800', padding: '3px 8px', borderRadius: '8px', background: log?.completed ? '#3f3f46' : '#94a3b8', color: '#fff' }}>
                        {log?.completed ? 'בוצע! 🎉' : 'טרם בוצע'}
                      </span>
                      <span style={{ fontSize: '12px', fontWeight: '800', color: textSub }}>{d.label} · {d.title}</span>
                    </div>
                    {isUnlocked ? (
                      <div>
                        <b style={{ fontSize: '14px', color: blockText, display: 'block', marginBottom: '4px' }}>🎯 {d.challenge}</b>
                        {log?.text && (
                          <div style={{ fontSize: '12px', color: isDark ? '#86efac' : '#166534', marginTop: '6px', background: isDark ? '#18181b' : '#dcfce7', padding: '8px', borderRadius: '8px', fontWeight: '700' }}>
                            💬 <b>{log.author || 'משפחה'}:</b> "{log.text}"
                          </div>
                        )}
                      </div>
                    ) : (
                      <div style={{ fontSize: '13px', color: textSub, fontWeight: '700' }}>🔒 אתגר סודי (ייחשף ביום המשימה)</div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* מודל שיחון */}
      {modalType === 'phrasebook' && (
        <div onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={() => handleTouchEnd(closeModal)} style={{ ...modalStyle, background: cardBg }}>
          <div style={modalContentStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1px solid ${borderColor}`, paddingBottom: '14px', marginBottom: '16px' }}>
              <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '900', color: textColor }}>שיחון איטלקי חכם</h2>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                {(hebrewInput || italianOutput) && (
                  <button 
                    onClick={() => handleGlobalClick(clearPhrasebook)} 
                    style={{ background: isDark ? '#3f3f46' : '#f1f5f9', color: textSub, border: '1px solid #cbd5e1', padding: '6px 10px', borderRadius: '8px', fontSize: '11px', fontWeight: '800', cursor: 'pointer', boxShadow: cardShadow }}
                  >
                    🧹 נקה הכל
                  </button>
                )}
                <button onClick={() => handleGlobalClick(closeModal)} style={{ ...modalCloseBtn, background: isDark ? '#3f3f46' : '#f1f5f9', color: textColor, border: '2px solid #94a3b8' }}>✕</button>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '14px', position: 'relative' }}>
              <input 
                type="text" 
                lang="he" 
                dir="rtl" 
                placeholder="הקלד בעברית לתרגום..." 
                value={hebrewInput} 
                onChange={(e) => {
                  setHebrewInput(e.target.value);
                  if (italianOutput) setItalianOutput('');
                }} 
                style={{ flex: 1, padding: '12px', borderRadius: '12px', border: `1px solid ${blockBorder}`, background: blockBg, color: blockText, fontWeight: '700', outline: 'none', fontSize: '16px', boxShadow: cardShadow }} 
              />
              <button onClick={() => handleGlobalClick(() => translateText(hebrewInput))} style={{ padding: '0 16px', background: isDark ? '#3f3f46' : 'linear-gradient(180deg, #334155 0%, #1e293b 100%)', color: '#fff', border: '1px solid #94a3b8', borderRadius: '12px', fontWeight: '900', cursor: 'pointer', fontSize: '14px', boxShadow: cardShadow }}>
                {isTranslating ? '...' : 'תרגם'}
              </button>
            </div>

            {italianOutput && (
              <div style={{ background: isDark ? '#27272a' : '#f0fdf4', padding: '12px 14px', borderRadius: '12px', border: '1px solid #52525b', marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: cardShadow }}>
                <button onClick={() => speakItalian(italianOutput)} style={{ background: '#3f3f46', color: '#fff', border: '1px solid #71717a', borderRadius: '8px', padding: '6px 12px', fontWeight: '800', cursor: 'pointer', boxShadow: cardShadow }}>🔊 השמע</button>
                <strong style={{ fontSize: '15px', color: isDark ? '#ffffff' : '#166534', direction: 'ltr' }}>{italianOutput}</strong>
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {filteredPhrases.slice(0, 10).map((phrase, idx) => (
                <div key={idx} onClick={() => speakItalian(phrase.it)} style={{ background: blockBg, border: `1px solid ${blockBorder}`, borderRadius: '12px', padding: '10px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', boxShadow: cardShadow }}>
                  <button onClick={(e) => { e.stopPropagation(); speakItalian(phrase.it); }} style={{ background: isDark ? '#3f3f46' : '#f1f5f9', border: '1px solid #94a3b8', borderRadius: '8px', width: '36px', height: '36px', fontSize: '15px', cursor: 'pointer', color: isDark ? '#ffffff' : '#1e293b', boxShadow: cardShadow }}>🔊</button>
                  <div style={{ flex: 1, textAlign: 'right', marginRight: '10px' }}>
                    <span style={{ fontSize: '13px', fontWeight: '800', color: blockText, display: 'block' }}>{phrase.he}</span>
                    <strong style={{ fontSize: '13px', color: isDark ? '#93c5fd' : '#1d4ed8', display: 'block' }}>{phrase.it}</strong>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* מודל גלריה */}
      {modalType === 'gallery' && (
        <div onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={() => handleTouchEnd(closeModal)} style={{ ...modalStyle, background: cardBg }}>
          <div style={modalContentStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1px solid ${borderColor}`, paddingBottom: '16px', marginBottom: '16px' }}>
              <h2 style={{ margin: 0, fontSize: '19px', fontWeight: '900', color: textColor }}>📸 אלבום המסע המשפחתי</h2>
              <button onClick={() => handleGlobalClick(closeModal)} style={{ ...modalCloseBtn, background: isDark ? '#3f3f46' : '#f1f5f9', color: textColor, border: '2px solid #94a3b8' }}>✕</button>
            </div>

            <button onClick={() => handleGlobalClick(() => setShowGalleryUpload(!showGalleryUpload))} style={{ width: '100%', padding: '12px', borderRadius: '12px', fontWeight: '900', fontSize: '13px', cursor: 'pointer', background: isDark ? '#3f3f46' : 'linear-gradient(180deg, #334155 0%, #1e293b 100%)', color: '#fff', border: '1px solid #94a3b8', marginBottom: '16px', boxShadow: cardShadow }}>📷 הוסף תמונה / סרטון</button>
            
            {showGalleryUpload && (
              <div style={{ background: isDark ? '#18181b' : '#f8fafc', padding: '14px', borderRadius: '12px', border: `1px solid ${blockBorder}`, marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <input 
                  type="text" 
                  placeholder="תיאור התמונה (לדוגמה: ארוחת צהריים בלימונה)..." 
                  value={galleryCaption} 
                  onChange={(e) => setGalleryCaption(e.target.value)} 
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: `1px solid ${blockBorder}`, background: blockBg, color: blockText, boxSizing: 'border-box', fontWeight: '700' }} 
                />
                <input type="file" id="directGalleryCamera" accept="image/*" capture="environment" style={{ display: 'none' }} onChange={(e) => { if (e.target.files && e.target.files[0]) handleDirectGalleryUpload(e.target.files[0]); }} />
                <input type="file" id="directGalleryFile" accept="image/*" style={{ display: 'none' }} onChange={(e) => { if (e.target.files && e.target.files[0]) handleDirectGalleryUpload(e.target.files[0]); }} />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <button onClick={() => handleGlobalClick(() => document.getElementById('directGalleryCamera').click())} style={{ padding: '10px', borderRadius: '8px', background: blockBg, color: blockText, border: `1px solid ${blockBorder}`, fontWeight: '800', fontSize: '12px', cursor: 'pointer' }}>📸 צלם עכשיו</button>
                  <button onClick={() => handleGlobalClick(() => document.getElementById('directGalleryFile').click())} style={{ padding: '10px', borderRadius: '8px', background: blockBg, color: blockText, border: `1px solid ${blockBorder}`, fontWeight: '800', fontSize: '12px', cursor: 'pointer' }}>📁 בחר מהמכשיר</button>
                </div>
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '10px' }}>
              {galleryItems.map((item, i) => (
                <div key={item.id || i} style={{ background: blockBg, border: `1px solid ${blockBorder}`, borderRadius: '12px', padding: '6px', boxSizing: 'border-box', boxShadow: cardShadow, position: 'relative' }}>
                  {item.media_url && (
                    <img 
                      src={item.media_url} 
                      alt={item.caption || item.name} 
                      style={{ width: '100%', height: '100px', objectFit: 'cover', borderRadius: '8px', display: 'block' }} 
                      onError={(e) => {
                        if ('caches' in window) {
                          caches.open('garda-offline-photos-v1').then(cache => {
                            cache.match(item.media_url).then(res => {
                              if (res) res.blob().then(blob => { e.target.src = URL.createObjectURL(blob); });
                            });
                          });
                        }
                      }}
                    />
                  )}
                  <small style={{ fontSize: '11px', fontWeight: '800', color: blockText, display: 'block', marginTop: '4px', textAlign: 'center', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {item.author || 'משפחה'}: {item.caption || item.name}
                  </small>
                  {item.id && (
                    <button 
                      onClick={(e) => deleteGalleryItem(item.id, e)} 
                      style={{ position: 'absolute', top: '8px', left: '8px', background: 'rgba(220, 38, 38, 0.85)', color: '#fff', border: 'none', borderRadius: '50%', width: '22px', height: '22px', fontSize: '11px', fontWeight: '900', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      title="מחק תמונה (דורש קוד מנהל)"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* מודל צפייה במסמכים */}
      {modalType === 'viewer' && viewerItem && (
        <div onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={() => handleTouchEnd(closeModal)} style={{ ...modalStyle, background: cardBg }}>
          <div style={modalContentStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1px solid ${borderColor}`, paddingBottom: '16px', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '900', color: isDark ? '#ffffff' : '#166534' }}>{viewerItem.title || viewerItem.name}</h3>
              <button onClick={() => handleGlobalClick(closeModal)} style={{ ...modalCloseBtn, background: isDark ? '#3f3f46' : '#f1f5f9', color: textColor, border: '2px solid #94a3b8' }}>✕</button>
            </div>
            
            <DocumentViewer 
              item={viewerItem} 
              isDark={isDark} 
              blockText={blockText} 
              cardShadow={cardShadow} 
            />
          </div>
        </div>
      )}

      {/* מודל חניה */}
      {modalType === 'parking' && (
        <div onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={() => handleTouchEnd(closeModal)} style={{ ...modalStyle, background: cardBg }}>
          <div style={modalContentStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: `1px solid ${borderColor}`, paddingBottom: '14px' }}>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '900', color: textColor }}>🚗 איך שומרים את הרכב ב-Apple Maps</h3>
              <button onClick={() => handleGlobalClick(closeModal)} style={{ ...modalCloseBtn, background: isDark ? '#3f3f46' : '#f1f5f9', color: textColor, border: '2px solid #94a3b8' }}>✕</button>
            </div>
            <p style={{ fontSize: '14px', lineHeight: '1.7', color: blockText, fontWeight: '600' }}>
              אם האייפון מחובר ל-Bluetooth או ל-CarPlay ברכב השכור, ברגע שמכבים מנוע ומתנתקים – האייפון שומר <b>אוטומטית</b> את מיקום החניה.
            </p>
          </div>
        </div>
      )}

      {/* מודל סביבי */}
      {modalType === 'around' && (
        <div onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={() => handleTouchEnd(closeModal)} style={{ ...modalStyle, background: cardBg }}>
          <div style={modalContentStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: `1px solid ${borderColor}`, paddingBottom: '14px' }}>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '900', color: textColor }}>📍 סביבי (Around Me)</h3>
              <button onClick={() => handleGlobalClick(closeModal)} style={{ ...modalCloseBtn, background: isDark ? '#3f3f46' : '#f1f5f9', color: textColor, border: '2px solid #94a3b8' }}>✕</button>
            </div>
            <p style={{ fontSize: '13px', color: textSub, marginBottom: '16px', fontWeight: '700' }}>בחר קטגוריה לחיפוש מהיר במפה סביבך ובדרכים:</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <button onClick={() => window.location.href = 'https://maps.apple.com/?q=Autogrill'} style={{ ...gridModalBtn, background: blockBg, color: '#f59e0b', border: `1px solid #f59e0b`, boxShadow: cardShadow, gridColumn: 'span 2' }}>
                ☕ <span>עצירת דרך / Autogrill & שירותים</span>
              </button>
              <button onClick={() => window.location.href = 'https://maps.apple.com/?q=gas station'} style={{ ...gridModalBtn, background: blockBg, color: blockText, border: `1px solid ${blockBorder}`, boxShadow: cardShadow }}>⛽ <span>תחנת דלק</span></button>
              <button onClick={() => window.location.href = 'https://maps.apple.com/?q=pharmacy'} style={{ ...gridModalBtn, background: blockBg, color: blockText, border: `1px solid ${blockBorder}`, boxShadow: cardShadow }}>💊 <span>פארם / בית מרקחת</span></button>
              <button onClick={() => window.location.href = 'https://maps.apple.com/?q=pizza'} style={{ ...gridModalBtn, background: blockBg, color: blockText, border: `1px solid ${blockBorder}`, boxShadow: cardShadow }}>🍕 <span>פיצה</span></button>
              <button onClick={() => window.location.href = 'https://maps.apple.com/?q=gelato'} style={{ ...gridModalBtn, background: blockBg, color: blockText, border: `1px solid ${blockBorder}`, boxShadow: cardShadow }}>🍦 <span>גלידה</span></button>
              <button onClick={() => window.location.href = 'https://maps.apple.com/?q=supermarket'} style={{ ...gridModalBtn, background: blockBg, color: blockText, border: `1px solid ${blockBorder}`, boxShadow: cardShadow }}>🛒 <span>סופרמרקט</span></button>
              <button onClick={() => window.location.href = 'https://maps.apple.com/?q=restaurants'} style={{ ...gridModalBtn, background: blockBg, color: blockText, border: `1px solid ${blockBorder}`, boxShadow: cardShadow }}>🍝 <span>מסעדות</span></button>
            </div>
          </div>
        </div>
      )}

      {/* מודל חירום */}
      {modalType === 'emergency' && (
        <div onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={() => handleTouchEnd(closeModal)} style={{ ...modalStyle, background: cardBg }}>
          <div style={modalContentStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: `1px solid ${borderColor}`, paddingBottom: '14px' }}>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '900', color: '#dc2626' }}>🆘 מספרי חירום באיטליה</h3>
              <button onClick={() => handleGlobalClick(closeModal)} style={{ ...modalCloseBtn, background: isDark ? '#3f3f46' : '#f1f5f9', color: textColor, border: '2px solid #94a3b8' }}>✕</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <a href="tel:112" style={{ ...gridModalBtn, background: isDark ? '#27272a' : '#fef2f2', color: '#dc2626', borderColor: '#fca5a5', textDecoration: 'none', boxShadow: cardShadow }}>🚨 חירום כללי: 112</a>
              <a href="tel:118" style={{ ...gridModalBtn, background: isDark ? '#27272a' : '#fef2f2', color: '#dc2626', borderColor: '#fca5a5', textDecoration: 'none', boxShadow: cardShadow }}>🚑 אמבולנס: 118</a>
            </div>
          </div>
        </div>
      )}

      {/* מודל ארנק כרטיסים ומסמכים */}
      {modalType === 'tickets' && (
        <div onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={() => handleTouchEnd(closeModal)} style={{ ...modalStyle, background: cardBg }}>
          <div style={modalContentStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1px solid ${borderColor}`, paddingBottom: '16px', marginBottom: '16px' }}>
              <div>
                <small style={{ color: '#1d4ed8', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', fontSize: '11px' }}>ארנק דיגיטלי</small>
                <h2 style={{ margin: '2px 0 0', fontSize: '19px', fontWeight: '900', color: textColor }}>🎟️ כרטיסים ומסמכים</h2>
              </div>
              <button onClick={() => handleGlobalClick(closeModal)} style={{ ...modalCloseBtn, background: isDark ? '#3f3f46' : '#f1f5f9', color: textColor, border: '2px solid #94a3b8' }}>✕</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '16px' }}>
              <button onClick={() => handleGlobalClick(() => setShowUploadBox(!showUploadBox))} style={{ padding: '12px', borderRadius: '12px', fontWeight: '900', fontSize: '13px', cursor: 'pointer', border: '1px solid #94a3b8', background: blockBg, color: blockText, boxShadow: cardShadow }}>
                ➕ הוסף כרטיס
              </button>
              <button onClick={() => handleGlobalClick(addNewFolder)} style={{ padding: '12px', borderRadius: '12px', fontWeight: '900', fontSize: '13px', cursor: 'pointer', border: `1px solid ${blockBorder}`, background: blockBg, color: blockText, boxShadow: cardShadow }}>
                📁 תקייה חדשה
              </button>
            </div>

            {showUploadBox && (
              <div style={{ background: isDark ? '#27272a' : '#f8fafc', padding: '16px', borderRadius: '14px', border: `1px solid ${blockBorder}`, marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '12px', boxSizing: 'border-box', width: '100%', boxShadow: cardShadow }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '800', color: textSub, display: 'block', marginBottom: '4px' }}>בחר תקייה לשמירה:</label>
                  <select value={selectedUploadFolder} onChange={(e) => setSelectedUploadFolder(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: `1px solid ${blockBorder}`, background: blockBg, color: blockText, boxSizing: 'border-box', fontWeight: '700' }}>
                    {folders.map((f, i) => <option key={i} value={f}>{f}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '800', color: textSub, display: 'block', marginBottom: '4px' }}>שם הכרטיס / מסמך:</label>
                  <input type="text" placeholder="לדוגמה: כרטיס כניסה לפארק" value={newTicketTitle} onChange={(e) => setNewTicketTitle(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: `1px solid ${blockBorder}`, background: isDark ? '#18181b' : '#ffffff', color: blockText, boxSizing: 'border-box', fontWeight: '600' }} />
                </div>
                <input type="file" id="cameraInput" accept="image/*" capture="environment" style={{ display: 'none' }} onChange={handleFileUpload} />
                <input type="file" id="fileInput" accept="image/*,application/pdf" multiple style={{ display: 'none' }} onChange={handleFileUpload} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <button onClick={() => handleGlobalClick(() => document.getElementById('cameraInput').click())} style={{ ...uploadBtnStyle, background: blockBg, color: blockText, border: `1px solid ${blockBorder}`, boxShadow: cardShadow }}>📷 צלם במצלמה</button>
                  <button onClick={() => handleGlobalClick(() => document.getElementById('fileInput').click())} style={{ ...uploadBtnStyle, background: blockBg, color: blockText, border: `1px solid ${blockBorder}`, boxShadow: cardShadow }}>📁 בחר קובץ מהמכשיר</button>
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
                    background: activeFolder === f ? (isDark ? '#52525b' : 'linear-gradient(180deg, #334155 0%, #1e293b 100%)') : blockBg,
                    color: '#ffffff',
                    border: `1px solid ${activeFolder === f ? (isDark ? '#d4d4d8' : '#1e293b') : blockBorder}`,
                    cursor: 'pointer', display: 'flex', flexDirection: 'column', justifyContent: 'center', boxSizing: 'border-box',
                    boxShadow: cardShadow
                  }}
                >
                  <strong style={{ display: 'block', fontSize: '12px', marginBottom: '2px', fontWeight: '900' }}>{f}</strong>
                  <small style={{ color: activeFolder === f ? '#cbd5e1' : textSub, fontSize: '10px', fontWeight: '800' }}>הצג קבצים</small>
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
                      gap: '12px', padding: '14px', borderRadius: '14px', background: blockBg, 
                      border: `1px solid ${blockBorder}`, cursor: 'pointer', boxSizing: 'border-box', width: '100%',
                      boxShadow: cardShadow 
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0, flex: 1 }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: isDark ? '#18181b' : '#f8fafc', border: `1px solid ${blockBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0 }}>
                        {x.isFlightInfo ? '✈️' : (x.isInsuranceInfo ? '🛡️' : (x.isCarVoucher ? '🚗' : (x.isHotelInfo ? '🏡' : '📄')))}
                      </div>
                      <div style={{ minWidth: 0, textAlign: 'right', flex: 1 }}>
                        <b style={{ display: 'block', fontSize: '13px', fontWeight: '900', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: blockText }}>{x.title || x.name}</b>
                        <small style={{ color: textSub, fontSize: '11px', display: 'block', fontWeight: '700' }}>
                          {x.isFlightInfo ? 'ישראייר 4623652' : (x.isInsuranceInfo ? 'AIG פוליסה' : (x.isCarVoucher ? 'Ecovia השכרה' : (x.isHotelInfo ? 'Booking' : `${Math.round((x.size || 1024) / 1024)} KB`)))}
                        </small>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                      <span style={{ fontSize: '12px', color: isDark ? '#93c5fd' : '#1d4ed8', fontWeight: '800' }}>צפה 👁️</span>
                      {!x.isFlightInfo && !x.isInsuranceInfo && !x.isCarVoucher && !x.isHotelInfo && (
                        <button onClick={(e) => deleteFile(x.id, e)} style={{ background: '#fef2f2', color: '#dc2626', border: '1px solid #fca5a5', padding: '4px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: '900', cursor: 'pointer', boxShadow: cardShadow }}>מחק</button>
                      )}
                    </div>
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

const sidebarBtnStyle = {
  border: '1px solid', padding: '12px 16px',
  borderRadius: '12px', fontWeight: '800', fontSize: '14px', textAlign: 'right',
  cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', boxSizing: 'border-box', width: '100%'
};

const arrowBtnStyle = {
  background: '#334155', color: '#fff', border: 'none', borderRadius: '6px',
  width: '24px', height: '22px', fontSize: '11px', fontWeight: '900', cursor: 'pointer',
  display: 'flex', alignItems: 'center', justifyContent: 'center'
};

const navBtnStyle = {
  fontSize: '13px', fontWeight: '900',
  padding: '10px 14px', borderRadius: '12px', display: 'flex', alignItems: 'center',
  justifyContent: 'center', gap: '6px', cursor: 'pointer', border: '1px solid', textDecoration: 'none', boxSizing: 'border-box'
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

const modalCloseBtn = {
  width: '42px', height: '42px',
  borderRadius: '50%', fontWeight: '900', fontSize: '18px', cursor: 'pointer',
  display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1, flexShrink: 0,
  boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
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
