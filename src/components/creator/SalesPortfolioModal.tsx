import React, { useState } from 'react';
import { CreatorProfile, PortfolioItem } from '../../types';
import { 
  X, 
  ShoppingBag, 
  Sparkles, 
  CheckCircle2, 
  Star, 
  TrendingUp, 
  MessageSquare,
  Building2,
  Calendar,
  Layers
} from 'lucide-react';

interface SalesPortfolioModalProps {
  isOpen: boolean;
  onClose: () => void;
  creator: CreatorProfile;
}

export const SalesPortfolioModal: React.FC<SalesPortfolioModalProps> = ({
  isOpen,
  onClose,
  creator,
}) => {
  const [activeFilter, setActiveFilter] = useState<string>('all');

  if (!isOpen) return null;

  const filteredPortfolio = activeFilter === 'all'
    ? creator.portfolio
    : creator.portfolio.filter((item) => item.companyName.toLowerCase().includes(activeFilter.toLowerCase()));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/65 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl border border-neutral-200 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-bold text-neutral-900 text-base">Сатылымдар және Портфолио</h2>
              <p className="text-xs text-neutral-500">Аяқталған UGC жобалары мен нақты нәтижелер</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-neutral-400 hover:text-neutral-700 hover:bg-neutral-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Top Summary Metric Cards */}
        <div className="p-5 border-b border-neutral-100 bg-neutral-50/40">
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            <div className="p-3 rounded-2xl bg-white border border-neutral-200/80 shadow-xs text-center">
              <span className="text-[11px] text-neutral-500 block font-medium">Жалпы сатылым</span>
              <span className="text-base sm:text-lg font-black text-emerald-700 font-mono mt-0.5 block">
                {creator.salesCount} дана
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-white border border-neutral-200/80 shadow-xs text-center">
              <span className="text-[11px] text-neutral-500 block font-medium">Аяқталған кейс</span>
              <span className="text-base sm:text-lg font-black text-neutral-900 font-mono mt-0.5 block">
                {creator.completedOrdersCount} жоба
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-white border border-neutral-200/80 shadow-xs text-center">
              <span className="text-[11px] text-neutral-500 block font-medium">Жалпы түсім</span>
              <span className="text-base sm:text-lg font-black text-neutral-900 font-mono mt-0.5 block">
                {creator.totalEarnings.toLocaleString('kk-KZ')} ₸
              </span>
            </div>
          </div>
        </div>

        {/* Portfolio List Content */}
        <div className="p-5 overflow-y-auto space-y-3.5 flex-1">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5" />
              Барлық UGC кейстер ({creator.portfolio.length})
            </h3>
            <span className="text-[11px] text-neutral-400 font-mono">
              ★ {creator.rating} рейтинг
            </span>
          </div>

          <div className="space-y-3">
            {filteredPortfolio.map((item) => (
              <div
                key={item.id}
                className="p-3.5 sm:p-4 rounded-2xl border border-neutral-200 bg-white hover:border-emerald-300 hover:shadow-xs transition-all flex flex-col sm:flex-row gap-3.5"
              >
                <img
                  src={item.productImage}
                  alt={item.productName}
                  className="w-full sm:w-28 h-28 rounded-xl object-cover shrink-0 border border-neutral-200"
                />

                <div className="flex-1 min-w-0 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-extrabold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-lg border border-emerald-200/60">
                      {item.companyName}
                    </span>
                    <span className="text-[11px] text-neutral-400 font-mono flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-neutral-300" />
                      {item.date}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-neutral-900 leading-snug">
                    {item.productName}
                  </h4>

                  {/* Results Banner */}
                  <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                    <div className="p-2 rounded-xl bg-neutral-50 border border-neutral-200/70">
                      <span className="text-[10px] text-neutral-400 block font-sans">Жасалған сатылым:</span>
                      <strong className="text-neutral-900 font-bold">{item.salesCount} дана</strong>
                    </div>
                    <div className="p-2 rounded-xl bg-emerald-50/50 border border-emerald-100">
                      <span className="text-[10px] text-emerald-600 block font-sans">Табыс көлемі:</span>
                      <strong className="text-emerald-700 font-bold">+{item.commissionEarned.toLocaleString('kk-KZ')} ₸</strong>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
