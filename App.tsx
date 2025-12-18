import React, { useState, useEffect, useRef } from 'react';
import { Download, Upload, Trash2, Edit3, Save, X, Phone, User, PartyPopper } from 'lucide-react';
import { EventData, DayData, Winner } from './types';
import { parseExcelFile } from './utils/excelParser';
import Lantern from './components/Lantern';

// Initial Dummy Data
const INITIAL_DATA: EventData = [
  { dayId: 1, label: '第一日', dateStr: '初一 (Feb 10)', winners: [] },
  { dayId: 2, label: '第二日', dateStr: '初二 (Feb 11)', winners: [] },
  { dayId: 3, label: '第三日', dateStr: '初三 (Feb 12)', winners: [] },
  { dayId: 4, label: '第四日', dateStr: '初四 (Feb 13)', winners: [] },
  { dayId: 5, label: '第五日', dateStr: '初五 (Feb 14)', winners: [] },
];

const STORAGE_KEY = 'cny_event_data_v1';

export default function App() {
  const [data, setData] = useState<EventData>(INITIAL_DATA);
  const [activeDayId, setActiveDayId] = useState<number>(1);
  const [isAdminMode, setIsAdminMode] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load from LocalStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setData(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load data", e);
      }
    }
  }, []);

  // Save to LocalStorage whenever data changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  const activeDay = data.find(d => d.dayId === activeDayId) || data[0];

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const newWinners = await parseExcelFile(file);
      const updatedData = data.map(day => {
        if (day.dayId === activeDayId) {
          return { ...day, winners: newWinners };
        }
        return day;
      });
      setData(updatedData);
      alert(`成功導入 ${newWinners.length} 位得獎者至 ${activeDay.label}！`);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (error) {
      console.error(error);
      alert("讀取 Excel 失敗，請確保格式正確 (第一欄: 名稱, 第二欄: 電話)");
    }
  };

  const clearCurrentDay = () => {
    if (!confirm(`確定要清空 ${activeDay.label} 的名單嗎？`)) return;
    const updatedData = data.map(day => {
      if (day.dayId === activeDayId) {
        return { ...day, winners: [] };
      }
      return day;
    });
    setData(updatedData);
  };

  const maskPhone = (phone: string) => {
    if (phone.length < 8) return phone;
    // Keep first 4, mask rest (or custom logic)
    return phone.substring(0, 4) + "****";
  };

  return (
    <div className="min-h-screen font-sans bg-cny-bg bg-pattern-scales pb-20 overflow-x-hidden">
      
      {/* Header Section */}
      <header className="relative pt-12 pb-20 px-4 text-center overflow-hidden">
        {/* Decorations */}
        <div className="absolute top-0 left-10 animate-bounce delay-100 duration-3000">
           <Lantern className="scale-125" />
        </div>
        <div className="absolute top-4 right-10 animate-bounce duration-3000">
           <Lantern className="scale-110" />
        </div>
        
        <div className="relative z-10">
            <div className="inline-block border-2 border-cny-gold/30 rounded-full px-6 py-1 bg-black/20 backdrop-blur-sm mb-4">
                <span className="text-cny-gold tracking-widest text-sm font-bold">金龍獻瑞 • 迎春接福</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-serif font-black text-transparent bg-clip-text bg-gradient-to-b from-yellow-300 to-yellow-600 drop-shadow-sm mb-2">
              新春大抽獎
            </h1>
            <p className="text-red-200 text-lg md:text-xl font-light tracking-wider">
              每日得獎名單公佈
            </p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 relative z-10 -mt-10">
        
        {/* Navigation Tabs */}
        <div className="flex flex-wrap justify-center gap-2 md:gap-4 mb-8">
          {data.map((day) => {
            const isActive = day.dayId === activeDayId;
            return (
              <button
                key={day.dayId}
                onClick={() => setActiveDayId(day.dayId)}
                className={`
                  relative px-6 py-3 rounded-t-xl font-serif text-lg font-bold transition-all duration-300
                  ${isActive 
                    ? 'bg-cny-red text-yellow-100 shadow-[0_-4px_20px_rgba(255,215,0,0.3)] translate-y-1 z-20 border-t-2 border-x-2 border-yellow-500' 
                    : 'bg-red-900/80 text-red-300 hover:bg-red-800 hover:text-red-100 z-10 mt-2 border border-red-900'}
                `}
              >
                {day.label}
                {isActive && (
                    <div className="absolute -top-3 -right-3">
                         <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center text-red-800 text-xs shadow-md animate-pulse">福</div>
                    </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Content Card */}
        <div className="bg-stone-50 rounded-3xl shadow-2xl overflow-hidden border-4 border-yellow-600 relative min-h-[500px]">
          {/* Inner decorative border */}
          <div className="absolute inset-2 border border-red-200 rounded-[20px] pointer-events-none z-0"></div>
          <div className="absolute top-0 left-0 w-20 h-20 border-t-4 border-l-4 border-yellow-600 rounded-tl-3xl z-10"></div>
          <div className="absolute top-0 right-0 w-20 h-20 border-t-4 border-r-4 border-yellow-600 rounded-tr-3xl z-10"></div>
          <div className="absolute bottom-0 left-0 w-20 h-20 border-b-4 border-l-4 border-yellow-600 rounded-bl-3xl z-10"></div>
          <div className="absolute bottom-0 right-0 w-20 h-20 border-b-4 border-r-4 border-yellow-600 rounded-br-3xl z-10"></div>

          {/* Header of the Card */}
          <div className="bg-red-50 p-6 text-center border-b border-red-100 relative z-10">
            <h2 className="text-3xl font-serif font-bold text-red-800 mb-1">{activeDay.label} 得獎名單</h2>
            {activeDay.dateStr && <p className="text-red-500 font-medium">{activeDay.dateStr}</p>}
          </div>

          {/* Winners List */}
          <div className="p-6 md:p-10 relative z-10">
            {activeDay.winners.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-red-300">
                <PartyPopper size={64} className="mb-4 opacity-50" />
                <p className="text-xl font-serif">名單即將公佈，敬請期待！</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeDay.winners.map((winner, idx) => (
                  <div 
                    key={winner.id}
                    className="flex items-center justify-between bg-white border border-red-100 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow hover:border-red-300 group"
                  >
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-red-50 text-red-600 flex items-center justify-center font-serif font-bold border border-red-100">
                            {idx + 1}
                        </div>
                        <div className="flex flex-col">
                             <div className="flex items-center gap-2 text-gray-800 font-bold text-lg">
                                <User size={16} className="text-red-400" />
                                {winner.name}
                             </div>
                             <div className="flex items-center gap-2 text-gray-500 text-sm">
                                <Phone size={14} />
                                <span className="tracking-wider">{maskPhone(winner.phone)}</span>
                             </div>
                        </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Admin Section (Toggleable) */}
        {isAdminMode && (
          <div className="mt-8 bg-black/80 backdrop-blur-md rounded-xl p-6 border border-gray-700 text-white animate-in fade-in slide-in-from-bottom-4">
             <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold flex items-center gap-2">
                    <Edit3 size={20} className="text-yellow-400"/>
                    後台管理: {activeDay.label}
                </h3>
                <button onClick={() => setIsAdminMode(false)} className="text-gray-400 hover:text-white"><X size={20}/></button>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <p className="text-sm text-gray-400 mb-2">批次上傳名單 (Excel .xlsx)</p>
                    <p className="text-xs text-gray-500 mb-2">格式: 第一欄為名字, 第二欄為電話</p>
                    <div className="flex items-center gap-2">
                        <input 
                            type="file" 
                            accept=".xlsx, .xls"
                            ref={fileInputRef}
                            onChange={handleFileUpload}
                            className="hidden"
                            id="file-upload"
                        />
                        <label 
                            htmlFor="file-upload" 
                            className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm transition-colors"
                        >
                            <Upload size={16} /> 選擇檔案
                        </label>
                        {activeDay.winners.length > 0 && (
                             <button 
                                onClick={clearCurrentDay}
                                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm transition-colors"
                             >
                                <Trash2 size={16} /> 清空本日
                             </button>
                        )}
                    </div>
                </div>

                <div className="space-y-2 border-l border-gray-700 pl-6">
                    <p className="text-sm text-gray-400 mb-2">手動保存/備份數據</p>
                    <p className="text-xs text-gray-500">因為沒有連接數據庫，請下載 JSON 備份以防資料遺失。</p>
                    <button 
                         onClick={() => {
                             const blob = new Blob([JSON.stringify(data, null, 2)], {type : 'application/json'});
                             const url = URL.createObjectURL(blob);
                             const a = document.createElement('a');
                             a.href = url;
                             a.download = `cny_event_backup_${new Date().toISOString().split('T')[0]}.json`;
                             a.click();
                         }}
                         className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm w-full justify-center"
                    >
                        <Save size={16} /> 下載備份 JSON
                    </button>
                </div>
             </div>
          </div>
        )}

      </main>

      {/* Footer / Secret Admin Trigger */}
      <footer className="mt-20 text-center pb-8 relative z-10">
         <div className="w-full h-px bg-gradient-to-r from-transparent via-red-900 to-transparent mb-6"></div>
         <p className="text-red-900/40 text-sm">© 2024 Chinese New Year Event. All rights reserved.</p>
         <button 
            onClick={() => setIsAdminMode(!isAdminMode)} 
            className="mt-4 text-xs text-red-900/20 hover:text-red-900/60 transition-colors"
         >
            {isAdminMode ? '關閉管理模式' : '管理員登入'}
         </button>
      </footer>
    </div>
  );
}