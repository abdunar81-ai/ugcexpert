import React from 'react';
import { CreatorProfile } from '../../types';
import { Star, Crown, Users, ChevronRight } from 'lucide-react';

interface CreatorsViewProps {
  creators: CreatorProfile[];
  onSelectCreator: (creator: CreatorProfile) => void;
}

export const CreatorsView: React.FC<CreatorsViewProps> = ({
  creators,
  onSelectCreator,
}) => {
  // Sort creators by Level
  const sortedCreators = [...creators].sort((a, b) => b.level - a.level);
  // Top 3 creators
  const topThree = sortedCreators.slice(0, 3);

  return (
    <div className="space-y-4 pb-16">
      {/* Header */}
      <div className="bg-white rounded-3xl p-5 shadow-xs border border-neutral-200/80 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-extrabold text-neutral-900 tracking-tight">
              Креаторлар
            </h1>
            <p className="text-xs text-neutral-500">Платформаның барлық UGC мамандары</p>
          </div>
        </div>
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-neutral-100 text-neutral-700 font-mono shrink-0">
          {creators.length} маман
        </span>
      </div>

      {/* TOP Creators Section */}
      <div className="bg-white rounded-3xl p-5 shadow-xs border border-neutral-200/80 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Crown className="w-5 h-5 text-amber-500" />
            <h2 className="font-extrabold text-neutral-900 text-base">
              TOP Креаторлар
            </h2>
          </div>
          <span className="text-xs font-bold text-emerald-600">Үздік рейтинг</span>
        </div>

        {/* Top 3 Podium Cards */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3 text-center">
          {topThree.map((creator, index) => {
            const rankBadges = [
              { bg: 'bg-amber-400 text-amber-950', ring: 'ring-amber-300', label: '1' },
              { bg: 'bg-slate-300 text-slate-800', ring: 'ring-slate-200', label: '2' },
              { bg: 'bg-amber-700 text-amber-100', ring: 'ring-amber-600/30', label: '3' },
            ];
            const badge = rankBadges[index] || rankBadges[0];

            return (
              <button
                key={creator.id}
                onClick={() => onSelectCreator(creator)}
                className="p-3 rounded-2xl border border-neutral-200 hover:border-emerald-400 bg-neutral-50/50 hover:bg-emerald-50/30 flex flex-col items-center justify-between transition-all group relative cursor-pointer"
              >
                {/* Rank Badge */}
                <div className={`absolute top-2 left-2 w-5 h-5 rounded-full ${badge.bg} flex items-center justify-center text-[10px] font-extrabold shadow-xs`}>
                  {badge.label}
                </div>

                {/* Avatar with rank border */}
                <div className="relative my-1">
                  <img
                    src={creator.avatar}
                    alt={creator.name}
                    className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover ring-2 ${badge.ring} shadow-xs group-hover:scale-105 transition-transform`}
                  />
                </div>

                <div className="w-full">
                  <h3 className="text-xs font-extrabold text-neutral-900 truncate">
                    {creator.name.split(' ')[0]}
                  </h3>
                  <div className="flex items-center justify-center gap-1 text-[11px] font-bold text-amber-500 mt-0.5">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <span>{creator.rating}</span>
                  </div>
                  <span className="text-[10px] text-neutral-500 font-mono block mt-0.5">
                    LVL {creator.level}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Барлық Креаторлар List */}
      <div className="bg-white rounded-3xl p-5 shadow-xs border border-neutral-200/80 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-extrabold text-neutral-900 text-base">
            Барлық креаторлар
          </h2>
          <span className="text-xs text-neutral-400 font-mono">
            {sortedCreators.length} маман
          </span>
        </div>

        <div className="divide-y divide-neutral-100">
          {sortedCreators.map((item) => (
            <div
              key={item.id}
              onClick={() => onSelectCreator(item)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && onSelectCreator(item)}
              className="py-3.5 px-3 flex items-center justify-between gap-3 hover:bg-neutral-50 rounded-2xl transition-all cursor-pointer group select-none"
            >
              <div className="flex items-center gap-3 min-w-0">
                <img
                  src={item.avatar}
                  alt={item.name}
                  className="w-12 h-12 rounded-full object-cover shrink-0 border border-neutral-200 group-hover:ring-2 group-hover:ring-emerald-400 transition-all"
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-xs sm:text-sm font-bold text-neutral-900 group-hover:text-emerald-700 transition-colors truncate">
                      {item.name}
                    </h3>
                    {item.verified && (
                      <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[9px] font-bold shrink-0">
                        ✓
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-neutral-500 flex items-center gap-1.5 mt-0.5">
                    <span>{item.city}</span>
                    <span>•</span>
                    <span className="truncate">{item.categories[0] || 'UGC'}</span>
                  </p>
                  <div className="flex items-center gap-2 mt-1 text-[11px]">
                    <span className="flex items-center gap-0.5 font-bold text-amber-500">
                      <Star className="w-3 h-3 fill-amber-400" />
                      {item.rating}
                    </span>
                    <span className="font-mono text-neutral-400 font-semibold">
                      LVL {item.level}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1 text-neutral-400 group-hover:text-emerald-600 transition-colors shrink-0">
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
