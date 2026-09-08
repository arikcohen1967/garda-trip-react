import React, { useState } from 'react';

export default function App() {
  const [activeTab, setActiveTab] = useState('itinerary');

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
            🎫 כרטיסים ומסמכים
          </button>
        </div>
      </nav>

      {/* תוכן האפליקציה */}
      <main className="max-w-6xl mx-auto p-4">
        {activeTab === 'itinerary' && (
          <div className="bg-white rounded-xl shadow-md p-6 space-y-4">
            <h2 className="text-xl font-bold text-blue-700 mb-4">לוח זמנים ופעילויות עיקריות</h2>
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
        )}

        {activeTab === 'tickets' && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">🎫 כרטיסי טיסה ומסמכים רשמיים</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                <h3 className="font-semibold text-lg text-blue-700">טיסות ישראייר (הזמנה 4623652)[cite: 4]</h3>
                <p className="text-sm text-gray-600 mt-2"><strong>נוסעים:</strong> אריק, עמית, יולי, ליאן, הראל[cite: 1, 2, 3, 4, 5].</p>
                <p className="text-sm text-gray-600"><strong>הלוך:</strong> 30.09.2026 | טיסה 6H:357 | 13:15 מ-TLV ל-VRN[cite: 4].</p>
                <p className="text-sm text-gray-600"><strong>חזור:</strong> 06.10.2026 | טיסה 6H:352 | 21:35 מ-VRN ל-TLV[cite: 4].</p>
              </div>

              <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                <h3 className="font-semibold text-lg text-blue-700">פארקים ואטרקציות</h3>
                <p className="text-sm text-gray-600 mt-2"><strong>גארדהלנד (01.10.2026):</strong> קוד רכישה fbKioJJ1W2[cite: 1].</p>
                <p className="text-sm text-gray-600"><strong>מוביללנד (02.10.2026):</strong> קוד רכישה JGbyc0xROT[cite: 1].</p>
              </div>

              <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 md:col-span-2">
                <h3 className="font-semibold text-lg text-blue-700">חשבונית ותשלום</h3>
                <p className="text-sm text-gray-600 mt-2">חשבונית ישראייר מספר 1-10183907 | סך הכל: 7,063.92 ₪[cite: 6].</p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
