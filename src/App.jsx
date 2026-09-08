import React, { useState, useEffect } from 'react';

export default function App() {
  const [activeTab, setActiveTab] = useState('itinerary');

  // רשימת המסמכים וכרטיסי הטיסה שהועלו
  const documents = [
    {
      id: 'flight-arik',
      title: 'כרטיס טיסה - אריק כהן (MR)',
      type: 'PDF',
      details: 'הזמנה 4623652 | תל אביב (TLV) ⟷ ורונה (VRN)',
      fileKey: '4623652-COHEN ARIK MR.pdf'
    },
    {
      id: 'flight-amit',
      title: 'כרטיס טיסה - עמית כהן (MS)',
      type: 'PDF',
      details: 'הזמנה 4623652 | 30.09.2026 - 06.10.2026',
      fileKey: '4623652-COHEN AMIT MS.pdf'
    },
    {
      id: 'flight-yuly',
      title: 'כרטיס טיסה - יולי כהן (MS)',
      type: 'PDF',
      details: 'הזמנה 4623652 | 5 נוסעים, מטען כלול',
      fileKey: '4623652-COHEN YULY MS.pdf'
    },
    {
      id: 'flight-lian',
      title: 'כרטיס טיסה - ליאן כהן (CHD)',
      type: 'PDF',
      details: 'הזמנה 4623652 | טיסות ישראייר 6H:357 / 6H:352',
      fileKey: '4623652-COHEN LIAN CHD.pdf'
    },
    {
      id: 'flight-harel',
      title: 'כרטיס טיסה - הראל וילנאי כהן (MR)',
      type: 'PDF',
      details: 'הזמנה 4623652 | אישור רשמי',
      fileKey: '4623652-VILNAI COHEN HAREL MR.pdf'
    },
    {
      id: 'invoice-israir',
      title: 'חשבונית וקבלה - ישראייר',
      type: 'PDF',
      details: 'חשבונית מספר 1-10183907 | סך הכל: 7,063.92 ₪',
      fileKey: 'Invoice10470598.pdf'
    }
  ];

  const handleOpenPDF = (doc) => {
    alert(`פותח את קובץ ה-PDF: ${doc.title}`);
  };

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
                <p className="text-sm text-gray-600">יום של כיף והתרגשות בפארק השעשועים Gardaland.</p>
              </div>
              <div className="border-r-4 border-purple-500 pr-4">
                <h3 className="font-bold">02.10.2026 - מוביללנד</h3>
                <p className="text-sm text-gray-600">בילוי בפארק הסרטים Movieland Studios.</p>
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
                  
                  <button
                    onClick={() => handleOpenPDF(doc)}
                    className="mt-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded transition-colors flex items-center justify-center gap-2"
                  >
                    <span>📄 הצג/הורד PDF</span>
                  </button>
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
