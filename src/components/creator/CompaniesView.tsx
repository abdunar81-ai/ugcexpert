import React from 'react';
import { Campaign } from '../../types';
import { ArrowRight, Tag, Building2, Lock, Unlock, Zap, Sparkles, ShieldAlert, TrendingUp, ShoppingBag } from 'lucide-react';

interface CompaniesViewProps {
  campaigns: Campaign[];
  creatorPoints?: number;
  onSelectCampaign: (campaign: Campaign) => void;
}

export const CompaniesView: React.FC<CompaniesViewProps> = ({
  campaigns,
  creatorPoints = 100,
  onSelectCampaign,
}) => {
  const POINTS_REQUIRED = 200;
  const isUnlockedAll = creatorPoints >= POINTS_REQUIRED;
  const pointsProgress = Math.min(100, Math.round((creatorPoints / POINTS_REQUIRED) * 100));
  const pointsNeeded = Math.max(0, POINTS_REQUIRED - creatorPoints);

  // Identify UGC Expert campaign (always unlocked)
  const ugcExpertCamp = campaigns.find(
    (c) => c.id === 'camp-ugc-expert' || c.companyName === 'UGC EXPERT'
  ) || campaigns[0];

  return (
    <div className="space-y-4 pb-16 w-full max-w-full">
      {/* Companies Header */}
      <div className="bg-white rounded-3xl p-5 shadow-xs border border-neutral-200/80 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-extrabold text-neutral-900 tracking-tight">
              Компаниялар & Жобалар
            </h1>
            <p className="text-xs text-neutral-500">Қолжетімді UGC тапсырыстар мен кампаниялар</p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200/80 font-mono flex items-center gap-1">
            <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            {creatorPoints} ұпай
          </span>
          <span className="hidden sm:inline-block px-3 py-1 rounded-full text-xs font-bold bg-neutral-100 text-neutral-700 font-mono">
            {campaigns.length} жоба
          </span>
        </div>
      </div>

      {/* Gamified Points & Unlock Banner (Focused strictly on Sales) */}
      {!isUnlockedAll ? (
        <div className="bg-linear-to-br from-neutral-900 via-neutral-900 to-amber-950 text-white rounded-3xl p-5 shadow-lg border border-amber-500/20 space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center shrink-0">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-extrabold text-sm sm:text-base text-white flex items-center gap-1.5">
                  <span>Компанияларды ашу жүйесі</span>
                  <span className="text-[11px] font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-md border border-amber-400/20">
                    200 ұпай қажет
                  </span>
                </h2>
                <p className="text-xs text-neutral-300 mt-0.5">
                  Қазір сізге <strong className="text-emerald-400 font-semibold">UGC Эксперт</strong> жобасы ашық (4 000 ₸ комиссия). Басқа компаниялар сатылым жасап, 200 ұпай жинағанда ашылады.
                </p>
              </div>
            </div>
            <span className="font-mono text-sm font-bold text-amber-400 shrink-0">
              {creatorPoints} / {POINTS_REQUIRED} ұпай
            </span>
          </div>

          {/* Progress bar */}
          <div className="space-y-1.5">
            <div className="w-full h-2.5 bg-neutral-800 rounded-full overflow-hidden p-0.5 border border-neutral-700">
              <div
                className="h-full bg-linear-to-r from-amber-500 via-emerald-400 to-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${pointsProgress}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[11px] text-neutral-400">
              <span>{pointsProgress}% орындалды</span>
              <span className="text-amber-300 font-semibold">Тағы {pointsNeeded} ұпай сатылым қажет</span>
            </div>
          </div>

          {/* How to earn points info & action (Purely Sales) */}
          <div className="pt-2.5 border-t border-neutral-800/80 flex flex-wrap items-center justify-between gap-2.5">
            <p className="text-xs text-neutral-300 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-amber-400 shrink-0" />
              <span>200 ұпай тек <strong>сатылым жасау арқылы</strong> жиналады. UGC Эксперт-ті сатып, ұпай жинаңыз!</span>
            </p>
            {ugcExpertCamp && (
              <button
                onClick={() => onSelectCampaign(ugcExpertCamp)}
                className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>UGC Эксперт-ті сату</span>
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-emerald-500 text-white rounded-3xl p-4 shadow-sm border border-emerald-400 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
              <Unlock className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="font-extrabold text-sm sm:text-base">Құттықтаймыз! Барлық компаниялар ашық</h2>
              <p className="text-xs text-emerald-100">Сіз сатылым жасап {creatorPoints} ұпай жинадыңыз. Барлық жобалардан тапсырыс ала аласыз.</p>
            </div>
          </div>
          <span className="px-3 py-1 rounded-xl bg-white/20 text-white font-mono text-xs font-bold">
            200+ Ұпай
          </span>
        </div>
      )}

      {/* Campaigns List */}
      <div className="space-y-3.5 w-full">
        {campaigns.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 text-center border border-neutral-200 space-y-2">
            <p className="text-sm font-bold text-neutral-700">Ешқандай компания табылмады</p>
          </div>
        ) : (
          campaigns.map((camp) => {
            // UGC Expert is always unlocked; other campaigns require 200 points from sales
            const isUgcExpert = camp.id === 'camp-ugc-expert' || camp.companyName === 'UGC EXPERT';
            const isLocked = !isUgcExpert && !isUnlockedAll;

            return (
              <div
                key={camp.id}
                className={`bg-white rounded-3xl p-4 sm:p-5 shadow-xs border transition-all flex flex-col sm:flex-row gap-4 relative overflow-hidden group w-full ${
                  isUgcExpert
                    ? 'border-emerald-300 ring-2 ring-emerald-500/20 bg-linear-to-r from-emerald-50/30 via-white to-white'
                    : isLocked
                    ? 'border-neutral-200/80 opacity-90'
                    : 'border-neutral-200/80 hover:border-emerald-500/50'
                }`}
              >
                {/* Product / Company Image */}
                <div className="w-full sm:w-28 h-36 sm:h-28 rounded-2xl bg-neutral-100 overflow-hidden shrink-0 border border-neutral-100 relative">
                  <img
                    src={camp.product.photo}
                    alt={camp.product.name}
                    className={`w-full h-full object-cover transition-transform duration-300 ${
                      isLocked ? 'filter grayscale-30 group-hover:scale-100' : 'group-hover:scale-105'
                    }`}
                  />
                  <div className="absolute top-2 left-2 px-2.5 py-0.5 rounded-lg bg-white/95 backdrop-blur-xs text-[10px] font-bold text-neutral-800 flex items-center gap-1 shadow-xs">
                    <Tag className="w-3 h-3 text-emerald-600" />
                    {camp.category}
                  </div>

                  {/* Lock Watermark Badge on image if locked */}
                  {isLocked && (
                    <div className="absolute inset-0 bg-neutral-900/40 backdrop-blur-[1px] flex items-center justify-center">
                      <div className="w-9 h-9 rounded-full bg-neutral-900/90 text-amber-400 flex items-center justify-center shadow-lg border border-amber-400/40">
                        <Lock className="w-4 h-4" />
                      </div>
                    </div>
                  )}
                </div>

                {/* Card Details */}
                <div className="flex-1 min-w-0 flex flex-col justify-between space-y-3 w-full">
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <h3 className="font-extrabold text-neutral-900 text-base group-hover:text-emerald-700 transition-colors truncate">
                          {camp.companyName}
                        </h3>
                        {isUgcExpert && (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-600 text-white shrink-0 shadow-xs flex items-center gap-1">
                            <Sparkles className="w-3 h-3" />
                            Басты жоба
                          </span>
                        )}
                        {isLocked && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200 shrink-0 flex items-center gap-1">
                            <Lock className="w-3 h-3 text-amber-600" />
                            200 ұпай
                          </span>
                        )}
                      </div>

                      {camp.isNew && !isUgcExpert && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 shrink-0">
                          Жаңа
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-neutral-500 mt-0.5 line-clamp-1">
                      {camp.title} • {camp.product.name}
                    </p>

                    {isUgcExpert && (
                      <p className="text-xs text-emerald-800 bg-emerald-50/80 p-2 rounded-xl mt-2 border border-emerald-200/60 leading-relaxed font-medium">
                        ✨ <strong>Барлық қатысушыларға ашық!</strong> Осы ресми UGC Expert бағдарламасын жарнамалап, әрбір сатылымнан кепілді 4 000 ₸ табыс және ұпай табыңыз.
                      </p>
                    )}

                    {isLocked && (
                      <p className="text-xs text-neutral-500 mt-1.5 flex items-center gap-1 font-medium">
                        <ShieldAlert className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        <span>Құлыпталған: Ашу үшін сатылым жасап, тағы <strong className="text-neutral-800 font-bold">{pointsNeeded} ұпай</strong> жинаңыз</span>
                      </p>
                    )}
                  </div>

                  {/* Commission & Action Row */}
                  <div className="pt-2.5 flex flex-wrap sm:flex-nowrap items-center justify-between gap-2.5 border-t border-neutral-100 w-full">
                    <div className="flex items-baseline gap-1.5 min-w-0">
                      <span className="text-xs text-neutral-400 font-medium shrink-0">Комиссия:</span>
                      <span className="text-base font-black text-emerald-600 font-mono whitespace-nowrap">
                        {camp.commission.toLocaleString('kk-KZ')} ₸
                      </span>
                      <span className="text-[10px] text-neutral-400 shrink-0">/ сатылым</span>
                    </div>

                    {isLocked ? (
                      <button
                        onClick={() => {
                          if (ugcExpertCamp) {
                            onSelectCampaign(ugcExpertCamp);
                          }
                        }}
                        className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-neutral-100 hover:bg-amber-50 hover:border-amber-300 text-neutral-700 font-bold text-xs border border-neutral-300 transition-all flex items-center justify-center gap-1.5 shrink-0 whitespace-nowrap cursor-pointer"
                        title="200 ұпай жинау үшін UGC Expert жобасын сатыңыз"
                      >
                        <Lock className="w-3.5 h-3.5 text-amber-600" />
                        <span>Құлыптаулы (Сатылым жасап ашыңыз)</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => onSelectCampaign(camp)}
                        className={`w-full sm:w-auto px-4 py-2.5 rounded-xl active:scale-95 text-white font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-1.5 shrink-0 whitespace-nowrap ${
                          isUgcExpert
                            ? 'bg-emerald-600 hover:bg-emerald-700 ring-2 ring-emerald-500/30'
                            : 'bg-emerald-600 hover:bg-emerald-700'
                        }`}
                      >
                        <span>Тапсырыс алу</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
