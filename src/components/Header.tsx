import React from 'react';
import { ViewRole } from '../types';
import { Sparkles, Bell, Smartphone, Monitor, ShieldCheck, Building2, UserCheck, Database } from 'lucide-react';

interface HeaderProps {
  currentRole: ViewRole;
  onRoleChange: (role: ViewRole) => void;
  isMobileFrame: boolean;
  onToggleMobileFrame: () => void;
  unreadNotificationsCount?: number;
  onOpenNotifications: () => void;
  dbStatus?: { isPostgresConnected: boolean; databaseUrlConfigured: boolean } | null;
}

export const Header: React.FC<HeaderProps> = ({
  currentRole,
  onRoleChange,
  isMobileFrame,
  onToggleMobileFrame,
  unreadNotificationsCount = 2,
  onOpenNotifications,
  dbStatus,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-neutral-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between gap-2">
        {/* Brand Logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-xs">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-base sm:text-lg tracking-tight text-neutral-900 font-sans">
                UGC <span className="text-emerald-600">EXPERT</span>
              </span>
              <span className="hidden xs:inline-block px-1.5 py-0.5 text-[10px] font-bold bg-emerald-100 text-emerald-800 rounded-md">
                KZ
              </span>
              {dbStatus && (
                <div 
                  title={dbStatus.isPostgresConnected ? "PostgreSQL Дерекқоры қосылған" : "Сервер режимде: DATABASE_URL арқылы қосылуға дайын"}
                  className={`hidden sm:flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium border ${
                    dbStatus.isPostgresConnected
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-neutral-50 text-neutral-600 border-neutral-200'
                  }`}
                >
                  <Database className="w-2.5 h-2.5 text-neutral-500" />
                  <span>{dbStatus.isPostgresConnected ? 'PostgreSQL' : 'Full-Stack DB'}</span>
                </div>
              )}
            </div>
            <p className="text-[10px] text-neutral-500 hidden sm:block">Креаторлар мен Компаниялар Экожүйесі</p>
          </div>
        </div>

        {/* Role Switcher Pills */}
        <div className="flex items-center bg-neutral-100 p-1 rounded-xl border border-neutral-200/80">
          <button
            onClick={() => onRoleChange('creator')}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              currentRole === 'creator'
                ? 'bg-white text-emerald-700 shadow-xs'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">UGC</span> Креатор
          </button>
          <button
            onClick={() => onRoleChange('company')}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              currentRole === 'company'
                ? 'bg-white text-emerald-700 shadow-xs'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Компания</span>
          </button>
          <button
            onClick={() => onRoleChange('admin')}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              currentRole === 'admin'
                ? 'bg-neutral-900 text-white shadow-xs'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Админ</span>
          </button>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Frame Toggle */}
          <button
            onClick={onToggleMobileFrame}
            title={isMobileFrame ? 'Толық экранға ауысу' : 'Смартфон форматында көру'}
            className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-neutral-200 text-neutral-600 hover:bg-neutral-50 text-xs font-medium transition-colors"
          >
            {isMobileFrame ? (
              <>
                <Monitor className="w-3.5 h-3.5 text-neutral-500" />
                <span>Десктоп</span>
              </>
            ) : (
              <>
                <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
                <span>Мобильді</span>
              </>
            )}
          </button>

          {/* Notifications Bell */}
          <button
            onClick={onOpenNotifications}
            className="relative p-2 rounded-xl border border-neutral-200 text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 transition-colors"
            aria-label="Хабарландырулар"
          >
            <Bell className="w-4 h-4" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white animate-pulse" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
