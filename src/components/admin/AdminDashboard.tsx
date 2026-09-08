import React, { useState } from 'react';
import { CreatorProfile, Campaign, LessonModule, Transaction } from '../../types';
import { AdminUsersTab } from './AdminUsersTab';
import { 
  ShieldCheck, 
  Users, 
  BookOpen, 
  Building2, 
  DollarSign, 
  BarChart3, 
  CheckCircle, 
  XCircle, 
  Edit3, 
  Check, 
  Clock, 
  Send,
  Sparkles,
  Lock,
  Unlock,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface AdminDashboardProps {
  creators: CreatorProfile[];
  campaigns: Campaign[];
  lessons: LessonModule[];
  orders: any[];
  withdrawals: any[];
  onToggleVerifyCreator: (creatorId: string) => void;
  onUpdateCreatorLevel: (creatorId: string, newLevel: number) => void;
  onApproveWithdrawal: (txId: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  creators,
  campaigns,
  lessons,
  orders,
  withdrawals,
  onToggleVerifyCreator,
  onUpdateCreatorLevel,
  onApproveWithdrawal,
}) => {
  const [activeTab, setActiveTab] = useState<'creators' | 'lessons' | 'campaigns' | 'finance' | 'analytics' | 'users'>('creators');

  const handleApprove = (id: string) => {
    onApproveWithdrawal(id);
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
  };

  return (
    <div className="space-y-5 pb-16">
      {/* Admin Top Header */}
      <div className="bg-neutral-900 text-white rounded-3xl p-5 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-neutral-950 flex items-center justify-center font-extrabold text-xl shadow-md">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-extrabold">
                UGC EXPERT • Басқару Панелі
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">
                Super Admin
              </span>
            </div>
            <p className="text-xs text-neutral-400">
              Барлық креаторлар, оқу модульдері, компаниялар және қаржылық ағындар
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-neutral-300">
          <span>Сервер: <strong className="text-emerald-400">Онлайн</strong></span>
          <span>•</span>
          <span>Платформа: <strong className="text-emerald-400">v2.4 Pro</strong></span>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex bg-white rounded-2xl p-1.5 border border-neutral-200 shadow-xs overflow-x-auto no-scrollbar gap-1">
        {[
          { id: 'creators', label: 'Креаторлар', icon: Users, count: creators.length },
          { id: 'lessons', label: 'Сабақтар', icon: BookOpen, count: lessons.length },
          { id: 'campaigns', label: 'Компаниялар', icon: Building2, count: campaigns.length },
          { id: 'finance', label: 'Қаржы & Kaspi', icon: DollarSign, count: withdrawals.filter(w => w.status === 'pending').length },
          { id: 'analytics', label: 'Аналитика', icon: BarChart3 },
          { id: 'users', label: 'Аккаунттар', icon: Users },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-neutral-900 text-white shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-400' : 'text-neutral-500'}`} />
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span className={`px-1.5 py-0.2 rounded-md text-[10px] font-mono ${
                  isActive ? 'bg-neutral-800 text-emerald-400' : 'bg-neutral-200 text-neutral-700'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab 1: Creators Management */}
      {activeTab === 'creators' && (
        <div className="bg-white rounded-3xl p-5 shadow-xs border border-neutral-200/80 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-extrabold text-neutral-900 text-base">
              Креаторлар тізімі және тексеру (Верификация)
            </h2>
            <span className="text-xs text-neutral-400 font-mono">{creators.length} креатор</span>
          </div>

          <div className="divide-y divide-neutral-100">
            {creators.map((c) => (
              <div key={c.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img
                    src={c.avatar}
                    alt={c.name}
                    className="w-12 h-12 rounded-full object-cover border border-neutral-200 shrink-0"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xs sm:text-sm font-bold text-neutral-900">{c.name}</h3>
                      {c.verified && (
                        <span className="px-1.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                          ✓ Тексерілген
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-neutral-500">
                      {c.city} • Сатылым: <strong className="text-neutral-900 font-mono">{c.salesCount}</strong> • Табыс: <strong className="text-emerald-600 font-mono">{c.totalEarnings.toLocaleString('kk-KZ')} ₸</strong>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <div className="flex items-center gap-1 bg-neutral-100 px-2 py-1 rounded-xl">
                    <span className="text-[11px] text-neutral-500 font-mono">LVL</span>
                    <input
                      type="number"
                      value={c.level}
                      onChange={(e) => onUpdateCreatorLevel(c.id, Number(e.target.value))}
                      className="w-14 px-1 py-0.5 bg-white border border-neutral-300 rounded text-xs font-mono font-bold text-center"
                    />
                  </div>

                  <button
                    onClick={() => onToggleVerifyCreator(c.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      c.verified
                        ? 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
                        : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                    }`}
                  >
                    {c.verified ? 'Өшіру' : 'Верификация'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Lessons Editor */}
      {activeTab === 'lessons' && (
        <div className="bg-white rounded-3xl p-5 shadow-xs border border-neutral-200/80 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-extrabold text-neutral-900 text-base">
                7 Негізгі Оқу Модулі
              </h2>
              <p className="text-xs text-neutral-500">
                Креаторларға арналған білім базасы және видео сабақтар
              </p>
            </div>
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
              7/7 Белсенді
            </span>
          </div>

          <div className="space-y-3">
            {lessons.map((lesson) => (
              <div
                key={lesson.id}
                className="p-4 rounded-2xl border border-neutral-200 bg-neutral-50/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shrink-0">
                    {lesson.number}
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-bold text-neutral-900">
                      {lesson.number}. {lesson.title}
                    </h3>
                    <p className="text-xs text-neutral-500">{lesson.subtitle} • {lesson.videoDuration}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => alert(`"${lesson.title}" сабағын өңдеу режимі іске қосылды`)}
                    className="px-3 py-1.5 rounded-xl border border-neutral-300 text-neutral-700 hover:bg-white text-xs font-bold flex items-center gap-1.5"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Өңдеу</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Campaigns Manager */}
      {activeTab === 'campaigns' && (
        <div className="bg-white rounded-3xl p-5 shadow-xs border border-neutral-200/80 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-extrabold text-neutral-900 text-base">
              Компаниялар мен Өнім Брифингтері
            </h2>
            <span className="text-xs text-neutral-400 font-mono">{campaigns.length} кампания</span>
          </div>

          <div className="divide-y divide-neutral-100">
            {campaigns.map((camp) => (
              <div key={camp.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img
                    src={camp.product.photo}
                    alt={camp.product.name}
                    className="w-12 h-12 rounded-xl object-cover border border-neutral-200 shrink-0"
                  />
                  <div>
                    <h3 className="text-xs sm:text-sm font-bold text-neutral-900">{camp.companyName} — {camp.title}</h3>
                    <p className="text-xs text-neutral-500 font-mono">
                      Комиссия: <strong className="text-emerald-600">{camp.commission.toLocaleString('kk-KZ')} ₸</strong> • Санат: {camp.category}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 text-xs font-bold">
                    Белсенді
                  </span>
                  <button
                    onClick={() => alert(`Брифинг тексерілді: ${camp.companyName}`)}
                    className="px-3 py-1.5 rounded-xl border border-neutral-300 text-neutral-700 hover:bg-neutral-100 text-xs font-bold"
                  >
                    Модерация
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Finance & Kaspi Payouts */}
      {activeTab === 'finance' && (
        <div className="bg-white rounded-3xl p-5 shadow-xs border border-neutral-200/80 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-extrabold text-neutral-900 text-base">
                Ақша шығару өтінімдері (Kaspi & Банк)
              </h2>
              <p className="text-xs text-neutral-500">Креаторлардың Kaspi шотына ақша аудару</p>
            </div>
            <div className="px-3 py-1 rounded-xl bg-neutral-900 text-emerald-400 font-mono text-xs font-bold">
              Платформа кірісі: 10% комиссия
            </div>
          </div>

          <div className="space-y-3">
            {withdrawals.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-2xl border border-neutral-200 bg-neutral-50/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs sm:text-sm font-bold text-neutral-900">{item.creatorName}</h3>
                    <span className="text-xs font-extrabold text-emerald-600 font-mono">
                      {item.amount.toLocaleString('kk-KZ')} ₸
                    </span>
                  </div>
                  <p className="text-xs text-neutral-500 font-mono">
                    {item.method} • {item.account} • {item.date}
                  </p>
                </div>

                <div>
                  {item.status === 'completed' ? (
                    <span className="px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-1.5">
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                      Төленді (Аяқталды)
                    </span>
                  ) : (
                    <button
                      onClick={() => handleApprove(item.id)}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-colors flex items-center gap-1.5"
                    >
                      <Send className="w-3.5 h-3.5" />
                      Kaspi-ге аударуды растау
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 5: Analytics */}
      {activeTab === 'analytics' && (() => {
        const totalCreators = creators.length;
        const totalSalesVolume = orders ? orders.reduce((sum, ord) => sum + (ord.salesVolume || 0), 0) : 0;
        const totalSalesCount = orders ? orders.reduce((sum, ord) => sum + (ord.ordersCount || 0), 0) : 0;
        const totalEarnings = orders ? orders.reduce((sum, ord) => sum + (ord.earnings || 0), 0) : 0;
        const platformCommission = totalSalesVolume * 0.1;
        
        const formatMoney = (val) => {
          if (val > 1000000) return (val / 1000000).toFixed(1) + ' млн ₸';
          return val.toLocaleString('kk-KZ') + ' ₸';
        };

        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-white p-4 rounded-3xl border border-neutral-200 shadow-xs">
                <span className="text-[11px] font-semibold text-neutral-500">Жалпы креаторлар</span>
                <strong className="text-xl font-extrabold text-neutral-900 font-mono block mt-1">{totalCreators}</strong>
                <span className="text-[10px] text-emerald-600 font-bold">Осы айда қосылғандар бар</span>
              </div>
              <div className="bg-white p-4 rounded-3xl border border-neutral-200 shadow-xs">
                <span className="text-[11px] font-semibold text-neutral-500">Жалпы сауда (GMV)</span>
                <strong className="text-xl font-extrabold text-neutral-900 font-mono block mt-1 truncate">{formatMoney(totalSalesVolume)}</strong>
                <span className="text-[10px] text-neutral-400 font-mono">{totalSalesCount} сатылым</span>
              </div>
              <div className="bg-white p-4 rounded-3xl border border-neutral-200 shadow-xs">
                <span className="text-[11px] font-semibold text-neutral-500">Креаторлар табысы</span>
                <strong className="text-xl font-extrabold text-emerald-600 font-mono block mt-1 truncate">{formatMoney(totalEarnings)}</strong>
                <span className="text-[10px] text-emerald-700 font-medium">Белсенді кіріс</span>
              </div>
              <div className="bg-white p-4 rounded-3xl border border-neutral-200 shadow-xs">
                <span className="text-[11px] font-semibold text-neutral-500">Платформа комиссиясы</span>
                <strong className="text-xl font-extrabold text-neutral-900 font-mono block mt-1 truncate">{formatMoney(platformCommission)}</strong>
                <span className="text-[10px] text-emerald-600 font-bold">10% таза маржа</span>
              </div>
            </div>
          </div>
        );
      })()}
      {/* Tab 6: Users */}
      {activeTab === 'users' && (
        <AdminUsersTab />
      )}
    </div>
  );
};
