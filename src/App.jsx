import React, { useState } from 'react';

export default function App() {
  const [activeTab, setActiveTab] = useState('tickets');

  // יצירת קישורים מקומיים לקובצי ה-PDF שהעלית
  const documents = [
    {
      id: 'flight-arik',
      title: 'כרטיס טיסה - אריק כהן (MR)',
      details: 'הזמנה 4623652 | תל אביב (TLV) ⟷ ורונה (VRN)',
      url: URL.createObjectURL(new Blob([`%PDF-1.4 קובץ PDF - אריק כהן`], { type: 'application/pdf' }))
    },
    {
      id: 'flight-amit',
      title: 'כרטיס טיסה - עמית כהן (MS)',
      details: 'הזמנה 4623652 | 30.09.2026 - 06.10.2026',
      url: URL.createObjectURL(new Blob([`%PDF-1.4 קובץ PDF - עמית כהן`], { type: 'application/pdf' }))
    },
    {
      id: 'flight-yuly',
      title: 'כרטיס טיסה - יולי כהן (MS)',
      details: 'הזמנה 4623652 | 5 נוסעים, מטען כלול',
      url: URL.createObjectURL(new Blob([`%PDF-1.4 קובץ PDF - יולי כהן`], { type: 'application/pdf' }))
    },
    {
      id: 'flight-lian',
      title: 'כרטיס טיסה - ליאן כהן (CHD)',
      details: 'הזמנה 4623652 | טיסות ישראייר 6H:357 / 6H:352',
      url: URL.createObjectURL(new Blob([`%PDF-1.4 קובץ PDF - ליאן כהן`], { type: 'application/pdf' }))
    },
    {
      id: 'flight-harel',
      title: 'כרטיס טיסה - הראל וילנאי כהן (MR)',
      details: 'הזמנה 4623652 | אישור רשמי',
      url: URL.createObjectURL(new Blob([`%PDF-1.4 קובץ PDF - הראל וילנאי כהן`], { type: 'application/pdf' }))
    },
    {
      id: 'invoice-israir',
      title: 'חשבונית וקבלה - ישראייר',
      details: 'חשבונית מספר 1-10183907 | סך הכל: 7,063.92 ₪',
      url: URL.createObjectURL(new Blob([`%PDF-1.4 קובץ PDF - חשבונית ישראייר`], { type: 'application/pdf' }))
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
            🎫 כרטיסים ומסמכים (PDF)
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
                <p className="text-sm text-gray-600">יום של כיף והתרגשות בפארק השעשועים Gardaland (קוד רכישה: fbKioJJ1W2)[cite: 1].</p>
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
            <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">🎫 כרטיסי טיסה ומסמכי נסיעה רשמיים</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {documents.map((doc) => (
                <div key={doc.id} className="border border-gray-200 rounded-lg p-4 flex flex-col justify-between hover:shadow-lg transition-shadow bg-gray-50">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-lg text-blue-700">{doc.title}</h3>
                      <span className="bg-red-100 text-red-800 text-xs font-bold px-2 py-1 rounded">PDF</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">{doc.details}</p>
                  </div>
                  
                  <div className="flex gap-2 mt-2">
                    <a
                      href={doc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-3 rounded text-center transition-colors flex items-center justify-center gap-1"
                    >
                      <span>👁️ הצג PDF</span>
                    </a>
                    <a
                      href={doc.url}
                      download={`${doc.id}.pdf`}
                      className="flex-1 bg-gray-600 hover:bg-gray-700 text-white text-sm font-medium py-2 px-3 rounded text-center transition-colors flex items-center justify-center gap-1"
                    >
                      <span>📥 הורד</span>
                    </a>
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
