import React from 'react';
import { CreatorTab } from '../types';
import { User, Building2, Users } from 'lucide-react';

interface BottomNavProps {
  currentTab: CreatorTab;
  onTabChange: (tab: CreatorTab) => void;
  companiesBadge?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  onTabChange,
  companiesBadge = 5,
}) => {
  const tabs = [
    {
      id: 'profile' as CreatorTab,
      label: 'Профиль',
      icon: User,
    },
    {
      id: 'companies' as CreatorTab,
      label: 'Компаниялар',
      icon: Building2,
      badge: companiesBadge,
    },
    {
      id: 'creators' as CreatorTab,
      label: 'Креаторлар',
      icon: Users,
    },
  ];

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-neutral-200/90 shadow-lg px-4 py-2 sm:py-2.5 transition-all"
    >
      <div className="max-w-md mx-auto flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center py-1 px-4 relative transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'text-emerald-700 font-bold scale-105'
                  : 'text-neutral-500 hover:text-neutral-900'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform ${isActive ? 'stroke-[2.5px]' : 'stroke-[1.8px]'}`} />
                {tab.badge && tab.badge > 0 && (
                  <span className="absolute -top-1 -right-2.5 px-1 min-w-4 h-4 bg-emerald-600 text-[10px] font-bold text-white rounded-full flex items-center justify-center shadow-xs">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className="text-[11px] mt-1 tracking-tight">
                {tab.label}
              </span>
              {isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-0.5" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
