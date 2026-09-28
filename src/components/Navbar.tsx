import React, { useState } from 'react';
import { AppNotification } from '../types/notification';
import { toPersianDigits } from '../utils/formatters';
import { Bell, Plus, User, Heart, Compass, MapPin, Check, Layers } from 'lucide-react';

interface NavbarProps {
  currentView: 'map_list' | 'list_only' | 'favorites';
  onViewChange: (view: 'map_list' | 'list_only' | 'favorites') => void;
  favoritesCount: number;
  notifications: AppNotification[];
  onOpenDashboard: (tab?: 'my_listings' | 'favorites' | 'messages' | 'notifications' | 'profile') => void;
  onOpenSubmitModal: () => void;
  comparedCount: number;
  onOpenCompare: () => void;
  onMarkNotificationAsRead: (id: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onViewChange,
  favoritesCount,
  notifications,
  onOpenDashboard,
  onOpenSubmitModal,
  comparedCount,
  onOpenCompare,
  onMarkNotificationAsRead,
}) => {
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const unreadNotifs = notifications.filter((n) => !n.isRead);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Brand Wordmark (Single text element) */}
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            onViewChange('map_list');
          }}
          className="text-xl font-black tracking-tight text-neutral-900 flex items-center gap-2 select-none"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500 ring-4 ring-amber-500/20" />
          <span>ملک‌یاب</span>
        </a>

        {/* Zone 2: Clean Text Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-neutral-600">
          <button
            onClick={() => onViewChange('map_list')}
            className={`transition-colors hover:text-neutral-900 ${
              currentView === 'map_list' ? 'text-neutral-900 font-bold' : ''
            }`}
          >
            نقشه و کاوش املاک
          </button>

          <button
            onClick={() => onViewChange('list_only')}
            className={`transition-colors hover:text-neutral-900 ${
              currentView === 'list_only' ? 'text-neutral-900 font-bold' : ''
            }`}
          >
            فهرست کامل آگهی‌ها
          </button>

          <button
            onClick={() => onViewChange('favorites')}
            className={`transition-colors hover:text-neutral-900 flex items-center gap-1 ${
              currentView === 'favorites' ? 'text-neutral-900 font-bold' : ''
            }`}
          >
            <span>نشان‌شده‌ها</span>
            {favoritesCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center tabular-nums">
                {toPersianDigits(favoritesCount)}
              </span>
            )}
          </button>

          <button
            onClick={() => onOpenDashboard('my_listings')}
            className="transition-colors hover:text-neutral-900"
          >
            مدیریت آگهی‌های من
          </button>

          {comparedCount > 0 && (
            <button
              onClick={onOpenCompare}
              className="text-amber-800 font-bold flex items-center gap-1 hover:text-amber-900 transition-colors"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>مقایسه ({toPersianDigits(comparedCount)})</span>
            </button>
          )}
        </nav>

        {/* Zone 3: 1-2 Primary Actions & Controls */}
        <div className="flex items-center gap-2.5">
          {/* Notification Button & Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              className="p-2 text-neutral-600 hover:text-neutral-900 rounded-lg hover:bg-neutral-100 transition-colors relative"
              title="اعلان‌ها و تغییرات قیمت"
            >
              <Bell className="w-4 h-4" />
              {unreadNotifs.length > 0 && (
                <span className="w-2 h-2 rounded-full bg-rose-500 absolute top-2 right-2 ring-2 ring-white" />
              )}
            </button>

            {/* Notification Dropdown */}
            {isNotifOpen && (
              <div className="absolute left-0 sm:right-auto sm:left-0 top-full mt-2 w-80 bg-white rounded-xl shadow-xl border border-neutral-200 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="p-3 bg-neutral-900 text-white flex items-center justify-between text-xs">
                  <span className="font-bold">اعلان‌های قیمت و آگهی‌ها</span>
                  <button
                    onClick={() => {
                      onOpenDashboard('notifications');
                      setIsNotifOpen(false);
                    }}
                    className="text-[11px] text-amber-400 hover:underline"
                  >
                    مشاهده همه
                  </button>
                </div>

                <div className="max-h-72 overflow-y-auto divide-y divide-neutral-100 text-xs">
                  {notifications.slice(0, 4).map((n) => (
                    <div
                      key={n.id}
                      onClick={() => {
                        onMarkNotificationAsRead(n.id);
                        onOpenDashboard('notifications');
                        setIsNotifOpen(false);
                      }}
                      className={`p-3 transition-colors cursor-pointer hover:bg-neutral-50 ${
                        !n.isRead ? 'bg-amber-50/50' : ''
                      }`}
                    >
                      <h5 className="font-bold text-neutral-900 text-xs">{n.title}</h5>
                      <p className="text-[11px] text-neutral-600 line-clamp-2 mt-0.5">
                        {n.message}
                      </p>
                      <span className="text-[10px] text-neutral-400 mt-1 block">
                        {n.timestamp}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User Profile Button */}
          <button
            onClick={() => onOpenDashboard('profile')}
            className="p-2 text-neutral-700 hover:text-neutral-900 rounded-lg hover:bg-neutral-100 transition-colors flex items-center gap-1 text-xs font-semibold"
            title="پنل و پروفایل کاربر"
          >
            <User className="w-4 h-4" />
            <span className="hidden sm:inline">پنل کاربری</span>
          </button>

          {/* Submit Listing CTA Button */}
          <button
            onClick={onOpenSubmitModal}
            className="px-3.5 py-2 text-xs font-bold text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 shadow-xs"
          >
            <Plus className="w-3.5 h-3.5 text-amber-400" />
            <span>ثبت آگهی</span>
          </button>
        </div>
      </div>
    </header>
  );
};
