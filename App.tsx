
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, Wallet, ShoppingBag, 
  Plus, Navigation, 
  Trash2, CheckCircle2, 
  Clock, MapPin
} from 'lucide-react';
import { Tab, Region, Spot, Expense, ShoppingItem } from './types';

// --- 子組件：頂部標題（已移除右上角圖標） ---

const Header: React.FC<{ activeTab: Tab }> = ({ activeTab }) => (
  <header className="px-5 pt-10 pb-4 bg-[#F8F9FA] z-30 shrink-0 border-b border-gray-100/50">
    <div className="flex flex-col">
      <h1 className="text-2xl font-black text-[#4464AD]">
        {activeTab === Tab.ITINERARY ? '曼谷行程 🇹🇭' : activeTab === Tab.FINANCE ? '旅遊記帳 ฿' : '備忘清單'}
      </h1>
      <p className="text-[10px] font-bold text-[#466995] tracking-widest uppercase opacity-60 mt-0.5">Feb 25 - Mar 05</p>
    </div>
  </header>
);

const NavItem: React.FC<{ 
  tab: Tab; 
  active: boolean; 
  icon: React.ReactNode; 
  label: string; 
  onClick: (t: Tab) => void 
}> = ({ tab, active, icon, label, onClick }) => (
  <button 
    onClick={() => onClick(tab)}
    className={`flex flex-col items-center justify-center space-y-1 transition-all duration-300 ${active ? 'text-[#4464AD]' : 'text-[#A4B0F5]/50'}`}
  >
    <div className={`p-1.5 rounded-xl transition-all duration-300 ${active ? 'bg-[#4464AD]/10 scale-110' : ''}`}>
      {React.cloneElement(icon as React.ReactElement, { size: 20 })}
    </div>
    <span className="text-[9px] font-black uppercase tracking-tighter">{label}</span>
  </button>
);

const BottomNav: React.FC<{ activeTab: Tab; setActiveTab: (t: Tab) => void }> = ({ activeTab, setActiveTab }) => (
  <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-gray-100 px-8 py-3 flex justify-between items-center z-50 pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.03)]">
    <NavItem tab={Tab.ITINERARY} active={activeTab === Tab.ITINERARY} icon={<Calendar />} label="行程" onClick={setActiveTab} />
    <NavItem tab={Tab.FINANCE} active={activeTab === Tab.FINANCE} icon={<Wallet />} label="記帳" onClick={setActiveTab} />
    <NavItem tab={Tab.SHOPPING} active={activeTab === Tab.SHOPPING} icon={<ShoppingBag />} label="清單" onClick={setActiveTab} />
  </nav>
);

// --- 行程視圖：已植入 9 天數據 ---

const ItineraryView: React.FC = () => {
  const [currentDayIndex, setCurrentDayIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newSpotName, setNewSpotName] = useState('');
  const [newSpotDesc, setNewSpotDesc] = useState('');
  const [newSpotTime, setNewSpotTime] = useState('12:00');

  const [regions, setRegions] = useState<Region[]>([
    { id: 'd1', name: 'Day 1: 入境曼谷與高級饗宴', isOpen: true, spots: [
        { id: 's1-1', name: '素萬那普機場 (BKK)', description: '16:45 抵達，辦理入境', time: '16:45' },
        { id: 's1-2', name: 'Shama Sukhumvit Bangkok', description: '飯店 Check-in 報到', time: '18:30' },
        { id: 's1-3', name: 'Wisdom International Buffet', description: 'Siam Paragon 精緻吃到飽', time: '19:30' },
        { id: 's1-4', name: 'After You Dessert Cafe', description: 'Siam Paragon 必吃泰奶刨冰', time: '21:00' }
      ]
    },
    { id: 'd2', name: 'Day 2: 南龍市場與老城美食', isOpen: false, spots: [
        { id: 's2-1', name: '南龍市場 (Nang Loeng)', description: '40年牛肉麵、老爺爺咖啡、傳統甜點', time: '10:00' },
        { id: 's2-2', name: 'Boonlert 蛋麵', description: '琥珀雲吞麵', time: '13:00' },
        { id: 's2-3', name: 'K. Panich Sticky Rice', description: '米其林必比登推薦芒果糯米飯', time: '15:00' },
        { id: 's2-4', name: 'Krua Apsorn @Dinso', description: '米其林必比登推薦泰菜', time: '18:30' }
      ]
    },
    { id: 'd3', name: 'Day 3: Taling Pling 與藝術街', isOpen: false, spots: [
        { id: 's3-1', name: 'Taling Pling (Siam Paragon)', description: '享用經典泰菜午餐', time: '12:00' },
        { id: 's3-2', name: 'Ong Ang Canal (藝術街)', description: '散步拍壁畫', time: '15:00' },
        { id: 's3-3', name: 'Saranrom-Uncle Tai Coffee', description: '下午茶休息', time: '17:00' },
        { id: 's3-4', name: 'Central World', description: '尋找 Uno！咖啡', time: '19:00' }
      ]
    },
    { id: 'd4', name: 'Day 4: 恰圖恰週末市集', isOpen: false, spots: [
        { id: 's4-1', name: '恰圖恰週末市集 (Chatuchak)', description: '全曼谷最大市集挖寶', time: '10:00' },
        { id: 's4-2', name: 'DRINK COFFEE', description: '逛累了去喝冠軍咖啡', time: '15:00' },
        { id: 's4-3', name: '城堡夜市', description: '體驗在地道地夜市', time: '19:00' }
      ]
    },
    { id: 'd5', name: 'Day 5: 唐人街與二手機玩具', isOpen: false, spots: [
        { id: 's5-1', name: '三聘批發市場', description: '早上挖寶文具雜貨', time: '10:00' },
        { id: 's5-2', name: '二手玩具街', description: '懷舊玩具巡禮', time: '13:00' },
        { id: 's5-3', name: '松瓦路 Pista&', description: '開心果奶甜點', time: '15:30' },
        { id: 's5-4', name: 'Tawanchai Fresh Milk', description: '唐人街晚餐後喝鮮奶', time: '19:00' }
      ]
    },
    { id: 'd6', name: 'Day 6: 復古老城散策', isOpen: false, spots: [
        { id: 's6-1', name: 'Talat Noi 區探索', description: '香港老宅咖啡、夏日咖啡糖絲咖啡', time: '14:00' },
        { id: 's6-2', name: '木炭烤土司 / 日本麵包', description: '復古點心時間', time: '16:00' },
        { id: 's6-3', name: 'Sam Lor', description: '舒芙蕾歐姆蛋飯晚餐', time: '19:00' }
      ]
    },
    { id: 'd7', name: 'Day 7: 席隆米其林一條街', isOpen: false, spots: [
        { id: 's7-1', name: 'Central Park Bangkok', description: '米其林一條街探索', time: '12:00' },
        { id: 's7-2', name: 'MBK Center', description: '逛街吹冷氣行程', time: '15:00' },
        { id: 's7-3', name: 'La Taverna del Salbanèl', description: '矮人餐廳義大利料理', time: '19:00' }
      ]
    },
    { id: 'd8', name: 'Day 8: 火車夜市探索', isOpen: false, spots: [
        { id: 's8-1', name: 'Pad Thai Fai Ta Lu', description: '炭火炒河粉午餐', time: '12:00' },
        { id: 's8-2', name: '965bkk 展場', description: '文創空間走走', time: '15:00' },
        { id: 's8-3', name: '希娜克琳火車夜市', description: '超廣大復古市集', time: '19:00' }
      ]
    },
    { id: 'd9', name: 'Day 9: 最後採買與回程', isOpen: false, spots: [
        { id: 's9-1', name: 'Siam 周邊最後補貨', description: 'Big C 伴手禮時間', time: '10:00' },
        { id: 's9-2', name: '出發前往機場', description: '14:30 抵達 BKK', time: '14:30' },
        { id: 's9-3', name: '搭機回桃園', description: '17:50 班機起飛', time: '17:50' }
      ]
    }
  ]);

  const dates = ["2/25 (三)", "2/26 (四)", "2/27 (五)", "2/28 (六)", "3/01 (日)", "3/02 (一)", "3/03 (二)", "3/04 (三)", "3/05 (四)"];

  const handleAddSpot = () => {
    if (!newSpotName) return;
    const newSpot: Spot = { id: Date.now().toString(), name: newSpotName, description: newSpotDesc, time: newSpotTime };
    const updatedRegions = [...regions];
    updatedRegions[currentDayIndex].spots.push(newSpot);
    updatedRegions[currentDayIndex].spots.sort((a, b) => (a.time || '').localeCompare(b.time || ''));
    setRegions(updatedRegions);
    setNewSpotName(''); setNewSpotDesc(''); setIsModalOpen(false);
  };

  const removeSpot = (spotId: string) => {
    const updatedRegions = [...regions];
    updatedRegions[currentDayIndex].spots = updatedRegions[currentDayIndex].spots.filter(s => s.id !== spotId);
    setRegions(updatedRegions);
  };

  const currentRegion = regions[currentDayIndex];

  return (
    <div className="flex flex-col h-full bg-[#F8F9FA]">
      <div className="sticky top-0 z-40 bg-[#F8F9FA]/90 backdrop-blur-md border-b border-gray-100 shrink-0">
        <div className="flex overflow-x-auto whitespace-nowrap px-4 py-4 no-scrollbar scroll-smooth">
          <div className="flex space-x-2.5 px-1">
            {dates.map((date, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentDayIndex(idx)}
                className={`px-4 py-2 rounded-xl text-[10px] font-black transition-all duration-300 ${
                  currentDayIndex === idx 
                  ? 'bg-[#4464AD] text-white shadow-lg shadow-[#4464AD]/25 scale-105 z-10' 
                  : 'bg-white text-[#A4B0F5] border border-[#A4B0F5]/20'
                }`}
              >
                {date}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="px-5 pt-5 pb-32">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentDayIndex}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <div className="flex justify-between items-end mb-3 px-1">
                <div>
                  <h2 className="text-lg font-black text-[#4464AD] leading-tight">{currentRegion?.name}</h2>
                  <span className="text-[9px] font-black text-[#466995] uppercase tracking-widest bg-[#4464AD]/5 px-2 py-0.5 rounded-full mt-1 inline-block">
                    {currentRegion?.spots.length} 個景點
                  </span>
                </div>
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="w-10 h-10 rounded-xl bg-[#F58F29] text-white flex items-center justify-center shadow-lg shadow-[#F58F29]/20 active:scale-90 transition-transform"
                >
                  <Plus size={24} />
                </button>
              </div>

              {currentRegion?.spots.map((spot, index) => (
                <motion.div 
                  layout key={spot.id} initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.04 }}
                  className="bg-white p-4 rounded-[28px] border border-gray-100 shadow-sm flex items-start group relative overflow-hidden"
                >
                  <div className="w-12 h-12 rounded-[18px] bg-[#A4B0F5]/10 flex flex-col items-center justify-center shrink-0 mr-3.5 border border-[#A4B0F5]/20">
                    <span className="text-[11px] font-black text-[#4464AD] leading-none">{spot.time}</span>
                    <span className="text-[7px] font-bold text-[#466995] mt-0.5 uppercase">PLAN</span>
                  </div>
                  <div className="flex-1 min-w-0 pr-5">
                    <h4 className="font-bold text-[#4464AD] text-sm mb-0.5 truncate">{spot.name}</h4>
                    <p className="text-[11px] text-gray-500 font-medium leading-relaxed line-clamp-2">{spot.description}</p>
                    <div className="flex items-center mt-3 space-x-3">
                      <button className="flex items-center text-[9px] font-black text-[#4464AD] bg-[#4464AD]/5 px-2 py-1 rounded-lg">
                        <MapPin size={10} className="mr-1" /> 地圖
                      </button>
                      <button onClick={() => removeSpot(spot.id)} className="flex items-center text-[9px] font-black text-red-400">
                        <Trash2 size={10} className="mr-1" /> 移除
                      </button>
                    </div>
                  </div>
                  <div className="absolute -right-4 -bottom-4 text-[#4464AD]/5 -rotate-12 pointer-events-none">
                    <Navigation size={70} />
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[60] flex items-end justify-center px-4 pb-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-[#4464AD]/20 backdrop-blur-sm" />
            <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ type: 'spring', damping: 30 }} className="relative w-full max-w-sm bg-white rounded-[32px] shadow-2xl p-6 overflow-hidden">
              <div className="w-10 h-1 bg-gray-100 rounded-full mx-auto mb-6" />
              <h3 className="text-xl font-black text-[#4464AD] mb-6">新增景點</h3>
              <div className="space-y-4">
                <input type="text" value={newSpotName} onChange={(e) => setNewSpotName(e.target.value)} placeholder="地點名稱..." className="w-full bg-gray-50 border-none rounded-[18px] px-5 py-3.5 text-xs font-bold focus:ring-2 focus:ring-[#A4B0F5]" />
                <input type="time" value={newSpotTime} onChange={(e) => setNewSpotTime(e.target.value)} className="w-full bg-gray-50 border-none rounded-[18px] px-5 py-3.5 text-xs font-bold focus:ring-2 focus:ring-[#A4B0F5]" />
                <textarea value={newSpotDesc} onChange={(e) => setNewSpotDesc(e.target.value)} placeholder="備註..." rows={2} className="w-full bg-gray-50 border-none rounded-[18px] px-5 py-3.5 text-xs font-bold focus:ring-2 focus:ring-[#A4B0F5] resize-none" />
                <button onClick={handleAddSpot} disabled={!newSpotName} className="w-full py-4 bg-[#F58F29] text-white rounded-[20px] font-black shadow-xl shadow-[#F58F29]/20 uppercase tracking-widest text-[10px]">儲存行程</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- 記帳視圖 ---

const FinanceView: React.FC = () => {
  const [expenses] = useState<Expense[]>([
    { id: '1', category: '餐飲', amount: 1250, note: 'Wisdom Buffet', date: '2025-02-25' },
    { id: '2', category: '交通', amount: 350, note: '機場計程車', date: '2025-02-25' }
  ]);
  const total = expenses.reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="h-full overflow-y-auto custom-scrollbar px-5 pt-3 pb-32">
      <div className="bg-gradient-to-br from-[#4464AD] to-[#466995] p-7 rounded-[32px] shadow-2xl text-white relative overflow-hidden mb-6">
        <div className="relative z-10">
          <p className="text-[9px] opacity-70 mb-1 font-bold tracking-widest uppercase">CURRENT EXPENSES</p>
          <h2 className="text-4xl font-black tracking-tighter">฿ {total.toLocaleString()}</h2>
          <div className="mt-6 flex justify-between items-center text-[9px] bg-white/10 backdrop-blur-xl rounded-xl p-3 border border-white/10 font-bold">
            <span className="text-[#A4B0F5]">預算剩餘: 78%</span>
            <span className="bg-[#F58F29] px-2 py-0.5 rounded-full text-white">NORMAL</span>
          </div>
        </div>
        <div className="absolute -right-16 -bottom-16 w-48 h-48 bg-[#A4B0F5]/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      <div className="space-y-4">
        <h3 className="font-black text-[#4464AD] text-sm px-1 uppercase tracking-widest">消費清單</h3>
        <div className="space-y-2.5">
          {expenses.map((exp, i) => (
            <motion.div layout key={exp.id} className="bg-white p-4 rounded-[24px] border border-gray-100 flex items-center justify-between shadow-sm">
              <div className="flex items-center space-x-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#A4B0F5]/10 flex items-center justify-center text-[#4464AD] font-black text-base">{exp.category[0]}</div>
                <div>
                  <h4 className="font-bold text-gray-700 text-xs">{exp.note}</h4>
                  <p className="text-[9px] text-gray-400 font-bold uppercase tracking-tighter mt-0.5">{exp.category} · {exp.date}</p>
                </div>
              </div>
              <div className="font-black text-[#7D4600] text-sm">-฿{exp.amount}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

// --- 清單視圖 ---

const ShoppingView: React.FC = () => {
  const [items, setItems] = useState<ShoppingItem[]>([
    { id: '1', text: '護照 & 簽證', completed: true },
    { id: '2', text: '泰銖現金', completed: true },
    { id: '3', text: '泰國 SIM 卡', completed: false }
  ]);
  const [inputValue, setInputValue] = useState('');
  const addItem = () => { if (!inputValue.trim()) return; setItems([...items, { id: Date.now().toString(), text: inputValue, completed: false }]); setInputValue(''); };
  const toggleItem = (id: string) => setItems(items.map(item => item.id === id ? { ...item, completed: !item.completed } : item));

  return (
    <div className="h-full overflow-y-auto custom-scrollbar px-5 pt-3 pb-32">
      <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm relative overflow-hidden mb-6">
        <h3 className="font-black text-[#4464AD] text-sm mb-6 flex items-center uppercase tracking-widest">
          <ShoppingBag size={20} className="mr-2.5 text-[#F58F29]" /> 購物與備忘
        </h3>
        <div className="space-y-1">
          {items.map((item) => (
            <motion.div layout key={item.id} onClick={() => toggleItem(item.id)} className="flex items-center justify-between py-3 px-2 rounded-xl hover:bg-gray-50 cursor-pointer group">
              <div className="flex items-center space-x-3.5">
                {item.completed ? <div className="w-6 h-6 rounded-full bg-[#A4B0F5] flex items-center justify-center"><CheckCircle2 size={14} className="text-white" /></div> : <div className="w-6 h-6 rounded-full border-2 border-[#A4B0F5]/40" />}
                <span className={`text-xs font-bold ${item.completed ? 'text-gray-300 line-through' : 'text-gray-600'}`}>{item.text}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      <div className="flex space-x-2.5">
        <input type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addItem()} placeholder="新增項目..." className="flex-1 px-6 py-4 bg-white rounded-[24px] border-none shadow-lg text-xs font-bold focus:ring-2 focus:ring-[#A4B0F5]" />
        <button onClick={addItem} className="w-14 h-14 bg-[#4464AD] text-white rounded-[20px] shadow-xl flex items-center justify-center shrink-0"><Plus size={28} /></button>
      </div>
    </div>
  );
};

// --- 主組件 ---

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.ITINERARY);

  return (
    <div className="max-w-md mx-auto h-screen relative morandi-bg overflow-hidden flex flex-col">
      <Header activeTab={activeTab} />
      
      <main className="flex-1 overflow-hidden relative">
        <AnimatePresence mode="wait">
          <motion.div 
            key={activeTab} 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="h-full w-full"
          >
            {activeTab === Tab.ITINERARY && <ItineraryView />}
            {activeTab === Tab.FINANCE && <FinanceView />}
            {activeTab === Tab.SHOPPING && <ShoppingView />}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* 已移除所有角落的固定圖標/按鈕 */}

      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
      
      {/* 裝飾性背景光暈 */}
      <div className="fixed -top-32 -left-32 w-80 h-80 bg-[#4464AD]/5 rounded-full blur-[80px] pointer-events-none -z-10" />
      <div className="fixed bottom-24 -right-32 w-80 h-80 bg-[#A4B0F5]/5 rounded-full blur-[80px] pointer-events-none -z-10" />
    </div>
  );
}
