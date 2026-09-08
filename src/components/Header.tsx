import React from 'react';
import { ViewRole } from '../types';
import { Sparkles, Bell, Smartphone, Monitor, ShieldCheck, Building2, UserCheck, Database, LogOut } from 'lucide-react';

interface HeaderProps {
  currentRole: ViewRole;
  unreadNotificationsCount?: number;
  onOpenNotifications: () => void;
  dbStatus?: { isPostgresConnected: boolean; databaseUrlConfigured: boolean } | null;
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentRole,
  unreadNotificationsCount = 2,
  onOpenNotifications,
  dbStatus,
  onLogout,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-neutral-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between gap-2">
        {/* Brand Logo */}
        <div className="flex items-center gap-2">
          <img src="/logo.svg" alt="UGC EXPERT" className="w-8 h-8 sm:w-9 sm:h-9 drop-shadow-sm" />
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-base sm:text-lg tracking-tight text-neutral-900 font-sans">
                UGC <span className="text-emerald-600">EXPERT</span>
              </span>
              <span className="hidden xs:inline-block px-1.5 py-0.5 text-[10px] font-bold bg-emerald-100 text-emerald-800 rounded-md">
                KZ
              </span>
            </div>
            <p className="text-[10px] text-neutral-500 hidden sm:block">Креаторлар мен Компаниялар Экожүйесі</p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
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

          {/* Logout Button */}
          {onLogout && (
            <button
              onClick={onLogout}
              className="relative p-2 rounded-xl border border-neutral-200 text-neutral-600 hover:bg-rose-50 hover:text-rose-600 transition-colors"
              aria-label="Шығу"
              title="Шығу"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
