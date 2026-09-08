import React, { useState } from 'react';

export default function App() {
  const [activeTab, setActiveTab] = useState('tickets');

  // רשימת המסמכים וכרטיסי הטיסה עם כל הפרטים המלאים מתוך הקבצים
  const documents = [
    {
      id: 'flight-arik',
      title: 'כרטיס טיסה - אריק כהן (MR)',
      details: 'הזמנה 4623652 | כרטיס: 8180011314102',
      flightInfo: 'TLV ⟷ VRN | 30.09.2026 - 06.10.2026',
      baggage: '1 כבודה (30 ק"ג)'
    },
    {
      id: 'flight-amit',
      title: 'כרטיס טיסה - עמית כהן (MS)',
      details: 'הזמנה 4623652 | כרטיס: 8180011314103',
      flightInfo: 'TLV ⟷ VRN | 30.09.2026 - 06.10.2026',
      baggage: 'כלול במסגרת ההזמנה המשפחתית'
    },
    {
      id: 'flight-yuly',
      title: 'כרטיס טיסה - יולי כהן (MS)',
      details: 'הזמנה 4623652 | כרטיס: 8180011314104',
      flightInfo: 'TLV ⟷ VRN | 30.09.2026 - 06.10.2026',
      baggage: 'כלול במסגרת ההזמנה המשפחתית'
    },
    {
      id: 'flight-lian',
      title: 'כרטיס טיסה - ליאן כהן (CHD)',
      details: 'הזמנה 4623652 | כרטיס: 8180011314105',
      flightInfo: 'TLV ⟷ VRN | 30.09.2026 - 06.10.2026',
      baggage: 'נוסע צעיר (CHD)'
    },
    {
      id: 'flight-harel',
      title: 'כרטיס טיסה - הראל וילנאי כהן (MR)',
      details: 'הזמנה 4623652 | כרטיס: 8180011314106',
      flightInfo: 'TLV ⟷ VRN | 30.09.2026 - 06.10.2026',
      baggage: '1 כבודה (23 ק"ג)'
    },
    {
      id: 'parks-gardaland',
      title: 'כרטיסי פארק - גארדהלנד (Gardaland)',
      details: 'קוד רכישה: fbKioJJ1W2 | 5 כרטיסי מבוגר',
      flightInfo: 'תאריך מתוכנן: 01.10.2026',
      baggage: 'Super Promo Open Ticket (199.50 €)'
    },
    {
      id: 'parks-movieland',
      title: 'כרטיסי פארק - מוביללנד (Movieland)',
      details: 'קוד רכישה: JGbyc0xROT | 5 כרטיסי מבוגר',
      flightInfo: 'תאריך מתוכנן: 02.10.2026',
      baggage: 'Adult Open Ticket (180.00 €)'
    },
    {
      id: 'invoice-israir',
      title: 'חשבונית וקבלה רשמית - ישראייר',
      details: 'חשבונית מספר 1-10183907 | סך הכל: 7,063.92 ₪',
      flightInfo: 'תשלום בכרטיס אשראי סופי (מסוף 10)',
      baggage: 'כולל תוספות כבודה והושבה'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900" dir="rtl">
      {/* כותרת עליונה */}
      <header className="bg-blue-600 text-white shadow-md p-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">🇮🇹 טיול משפחתי לאיטליה (אגם גארדה 2026)</h1>
          <span className="bg-blue-700 text-xs px-3 py-1 rounded-full">30.09.2026 - 06.10.2026</span>
        </div>
      </header>

      {/* תפריט ניווט ראשי */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto flex gap-4 p-3">
          <button
            onClick={() => setActiveTab('itinerary')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'itinerary' ? 'bg-blue-600 text-white' : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            📅 מסלול הטיול
          </button>
          <button
            onClick={() => setActiveTab('tickets')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'tickets' ? 'bg-blue-600 text-white' : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            🎫 כרטיסים ומסמכים רשמיים
          </button>
        </div>
      </nav>

      {/* תוכן האפליקציה */}
      <main className="max-w-6xl mx-auto p-4">
        {activeTab === 'itinerary' && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold mb-4 text-blue-700">לוח זמנים ופעילויות עיקריות</h2>
            <div className="space-y-4">
              <div className="border-r-4 border-blue-500 pr-4">
                <h3 className="font-bold">30.09.2026 - הגעה לאיטליה</h3>
                <p className="text-sm text-gray-600">טיסת ישראייר 6H:357 מתל אביב (13:15) לורונה (16:05)[cite: 4]. איסוף רכב ונסיעה למקום הלינה.</p>
              </div>
              <div className="border-r-4 border-green-500 pr-4">
                <h3 className="font-bold">01.10.2026 - גארדהלנד</h3>
                <p className="text-sm text-gray-600">יום כיף בפארק השעשועים Gardaland (קוד רכישה: fbKioJJ1W2)[cite: 1].</p>
              </div>
              <div className="border-r-4 border-purple-500 pr-4">
                <h3 className="font-bold">02.10.2026 - מוביללנד</h3>
                <p className="text-sm text-gray-600">בילוי בפארק הסרטים Movieland Studios (קוד רכישה: JGbyc0xROT)[cite: 1].</p>
              </div>
              <div className="border-r-4 border-red-500 pr-4">
                <h3 className="font-bold">06.10.2026 - טיסת חזרה</h3>
                <p className="text-sm text-gray-600">טיסת ישראייר 6H:352 מורונה (21:35) בחזרה לתל אביב (02:05)[cite: 4].</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'tickets' && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">🎫 כרטיסי טיסה, פארקים ומסמכים רשמיים</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {documents.map((doc) => (
                <div key={doc.id} className="border border-gray-200 rounded-lg p-4 flex flex-col justify-between shadow-sm bg-gray-50">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-lg text-blue-700">{doc.title}</h3>
                      <span className="bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded">מאושר</span>
                    </div>
                    <p className="text-sm font-medium text-gray-700 mb-1">{doc.details}</p>
                    <p className="text-sm text-gray-600 mb-1">{doc.flightInfo}</p>
                    <p className="text-xs text-gray-500 mb-4">{doc.baggage}</p>
                  </div>
                  
                  <div className="bg-blue-50 border border-blue-100 text-blue-800 text-xs p-2 rounded text-center font-medium">
                    ✔ כל הפרטים זמינים ומוכנים לנסיעה
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200 text-sm text-blue-800">
              📌 <strong>פרטי טיסות עיקריים (הזמנה 4623652):</strong>[cite: 4]
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li><strong>הלוך (30/09/2026):</strong> טיסה 6H:357 מתל אביב (TLV) לורונה (VRN), ממריאה ב-13:15[cite: 4].</li>
                <li><strong>חזור (06/10/2026):</strong> טיסה 6H:352 מורונה (VRN) לתל אביב (TLV), ממריאה ב-21:35[cite: 4].</li>
              </ul>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
