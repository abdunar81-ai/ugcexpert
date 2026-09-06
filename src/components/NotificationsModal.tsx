import React from 'react';
import { X, Bell, Sparkles, CheckCircle2, ShoppingBag, ArrowUpRight } from 'lucide-react';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const notifications = [
    {
      id: 'n-1',
      title: 'Жаңа сатылым расталды!',
      description: 'GlowSkin Табиғи бет күтімі бойынша рефералдық сілтемеңізден тапсырыс түсті. +15 000 ₸ әмияныңызға есептелді.',
      time: '15 минут бұрын',
      type: 'sale',
      unread: true,
    },
    {
      id: 'n-2',
      title: 'Жаңа UGC Кампания: PowerFuel Pro',
      description: 'Спорттық тағам санатында жаңа жоба іске қосылды. Әр сатылымға 20 000 ₸ комиссия ұсынылады.',
      time: '2 сағат бұрын',
      type: 'campaign',
      unread: true,
    },
    {
      id: 'n-3',
      title: 'Деңгей көтерілді! 🎉',
      description: 'Сабақтарды сәтті тапсырғаныңыз үшін сізге +10 Level қосылды (Қазіргі деңгей: LVL 287).',
      time: 'Кеше',
      type: 'level',
      unread: false,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/65 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl border border-neutral-200">
        <div className="px-5 py-4 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/70">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-bold text-neutral-900 text-base">Хабарландырулар</h2>
              <p className="text-xs text-neutral-500">Жүйелік жаңалықтар мен түсімдер</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-neutral-400 hover:text-neutral-700 hover:bg-neutral-200/60"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-2.5 max-h-[70vh] overflow-y-auto">
          {notifications.map((n) => (
            <div
              key={n.id}
              className={`p-3.5 rounded-2xl border transition-all ${
                n.unread
                  ? 'bg-emerald-50/40 border-emerald-200/80 shadow-xs'
                  : 'bg-white border-neutral-200/70'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-xs font-extrabold text-neutral-900 flex items-center gap-1.5">
                  {n.unread && <span className="w-2 h-2 rounded-full bg-emerald-500" />}
                  {n.title}
                </h3>
                <span className="text-[10px] text-neutral-400 font-mono shrink-0">{n.time}</span>
              </div>
              <p className="text-xs text-neutral-600 mt-1 leading-relaxed">{n.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
