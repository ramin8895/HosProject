import React, { useState } from 'react';
import { Property } from '../types/property';
import { UserProfile, AppNotification } from '../types/notification';
import { ChatConversation } from '../types/chat';
import { formatPricePersian, toPersianDigits, formatNumberPersian } from '../utils/formatters';
import {
  X,
  Building,
  Heart,
  MessageSquare,
  Bell,
  User,
  ShieldCheck,
  TrendingDown,
  Plus,
  Trash2,
  Edit3,
  ExternalLink,
  CheckCircle,
  Eye,
  Award,
} from 'lucide-react';

interface UserDashboardModalProps {
  user: UserProfile;
  properties: Property[];
  favorites: string[];
  notifications: AppNotification[];
  conversations: ChatConversation[];
  activeTab?: 'my_listings' | 'favorites' | 'messages' | 'notifications' | 'profile';
  onClose: () => void;
  onOpenSubmitModal: () => void;
  onSelectProperty: (property: Property) => void;
  onRemoveFavorite: (id: string) => void;
  onOpenConversation: (conversationId: string) => void;
  onUpdatePropertyPrice: (propertyId: string, newPrice: number) => void;
  onDeleteProperty: (propertyId: string) => void;
  onMarkNotificationAsRead: (id: string) => void;
}

export const UserDashboardModal: React.FC<UserDashboardModalProps> = ({
  user,
  properties,
  favorites,
  notifications,
  conversations,
  activeTab: initialTab = 'my_listings',
  onClose,
  onOpenSubmitModal,
  onSelectProperty,
  onRemoveFavorite,
  onOpenConversation,
  onUpdatePropertyPrice,
  onDeleteProperty,
  onMarkNotificationAsRead,
}) => {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [editingPricePropertyId, setEditingPricePropertyId] = useState<string | null>(null);
  const [newPriceInput, setNewPriceInput] = useState<string>('');

  // Filter listings owned by this user
  const myListings = properties.filter((p) => p.ownerId === 'user-me' || p.ownerName === user.name);
  const favoriteProperties = properties.filter((p) => favorites.includes(p.id));

  const handleStartEditPrice = (prop: Property) => {
    setEditingPricePropertyId(prop.id);
    setNewPriceInput(String(prop.price));
  };

  const handleSavePrice = (propertyId: string) => {
    const num = Number(newPriceInput);
    if (num > 0) {
      onUpdatePropertyPrice(propertyId, num);
      setEditingPricePropertyId(null);
    }
  };

  return (
    <div className="fixed inset-0 z-60 bg-neutral-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      <div
        className="w-full max-w-4xl h-[680px] max-h-[92vh] bg-white rounded-2xl shadow-2xl border border-neutral-200 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="px-6 py-4 bg-neutral-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-10 h-10 rounded-full object-cover border border-neutral-700"
            />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white">{user.name}</h3>
                <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-amber-400" />
                  امتیاز اعتماد: {toPersianDigits(user.trustScore)}٪
                </span>
              </div>
              <span className="text-[11px] text-neutral-400">
                عضویت از {user.memberSince} · {toPersianDigits(user.phone)}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenSubmitModal}
              className="px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-neutral-950 text-xs font-bold transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>ثبت آگهی رایگان</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-neutral-400 hover:text-white rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 bg-neutral-50 border-b border-neutral-200 flex items-center gap-6 text-xs font-medium text-neutral-600 overflow-x-auto shrink-0">
          <button
            onClick={() => setActiveTab('my_listings')}
            className={`py-3 border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'my_listings'
                ? 'border-neutral-900 text-neutral-900 font-bold'
                : 'border-transparent hover:text-neutral-900'
            }`}
          >
            <Building className="w-4 h-4" />
            <span>آگهی‌های من ({toPersianDigits(myListings.length)})</span>
          </button>

          <button
            onClick={() => setActiveTab('favorites')}
            className={`py-3 border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'favorites'
                ? 'border-neutral-900 text-neutral-900 font-bold'
                : 'border-transparent hover:text-neutral-900'
            }`}
          >
            <Heart className="w-4 h-4" />
            <span>نشان‌شده‌ها ({toPersianDigits(favorites.length)})</span>
          </button>

          <button
            onClick={() => setActiveTab('messages')}
            className={`py-3 border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'messages'
                ? 'border-neutral-900 text-neutral-900 font-bold'
                : 'border-transparent hover:text-neutral-900'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>پیام‌ها و گفتگوها ({toPersianDigits(conversations.length)})</span>
          </button>

          <button
            onClick={() => setActiveTab('notifications')}
            className={`py-3 border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'notifications'
                ? 'border-neutral-900 text-neutral-900 font-bold'
                : 'border-transparent hover:text-neutral-900'
            }`}
          >
            <Bell className="w-4 h-4" />
            <span>اعلان‌های آنی و تغییر قیمت</span>
            {notifications.filter((n) => !n.isRead).length > 0 && (
              <span className="w-2 h-2 rounded-full bg-rose-500" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`py-3 border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'profile'
                ? 'border-neutral-900 text-neutral-900 font-bold'
                : 'border-transparent hover:text-neutral-900'
            }`}
          >
            <User className="w-4 h-4" />
            <span>پروفایل و رتبه اعتماد</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="flex-1 p-6 overflow-y-auto">
          {/* TAB 1: My Listings */}
          {activeTab === 'my_listings' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-neutral-900">مدیریت املاک ثبت شده</h4>
                  <p className="text-xs text-neutral-500">
                    می‌توانید قیمت‌ها را بروزرسانی کرده یا آگهی‌های واگذار شده را ویرایش کنید.
                  </p>
                </div>
                <button
                  onClick={onOpenSubmitModal}
                  className="px-3 py-1.5 bg-neutral-900 text-white rounded-lg text-xs font-semibold hover:bg-neutral-800 transition-colors flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>ثبت ملک جدید</span>
                </button>
              </div>

              {myListings.length === 0 ? (
                <div className="text-center py-12 bg-neutral-50 rounded-2xl border border-dashed border-neutral-300">
                  <Building className="w-8 h-8 text-neutral-400 mx-auto mb-2" />
                  <p className="text-xs font-medium text-neutral-700">شما هنوز هیچ آگهی ملکی ثبت نکرده‌اید.</p>
                  <p className="text-[11px] text-neutral-500 mt-1">با ثبت آگهی، هزاران متقاضی ملک در تهران از آگهی شما بازدید خواهند کرد.</p>
                  <button
                    onClick={onOpenSubmitModal}
                    className="mt-4 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-neutral-950 rounded-lg text-xs font-bold transition-colors"
                  >
                    همین حالا ثبت آگهی کنید
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {myListings.map((prop) => (
                    <div
                      key={prop.id}
                      className="p-4 bg-white rounded-xl border border-neutral-200 hover:border-neutral-300 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={prop.images[0]}
                          alt={prop.title}
                          className="w-16 h-14 rounded-lg object-cover shrink-0"
                        />
                        <div className="min-w-0">
                          <h5 className="text-xs font-bold text-neutral-900 truncate">
                            {prop.title}
                          </h5>
                          <span className="text-[11px] text-neutral-500 block mt-0.5">
                            {prop.neighborhood} · {toPersianDigits(prop.meterage)} متر · {toPersianDigits(prop.rooms)} خواب
                          </span>
                          <div className="flex items-center gap-3 text-[11px] text-neutral-400 mt-1">
                            <span className="flex items-center gap-1">
                              <Eye className="w-3 h-3" />
                              {toPersianDigits(prop.viewsCount)} بازدید
                            </span>
                            <span className="flex items-center gap-1">
                              <Heart className="w-3 h-3" />
                              {toPersianDigits(prop.likesCount)} نشان شده
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Price & Action */}
                      <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                        {editingPricePropertyId === prop.id ? (
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              value={newPriceInput}
                              onChange={(e) => setNewPriceInput(e.target.value)}
                              className="w-32 px-2 py-1 bg-neutral-50 border border-neutral-300 rounded text-xs"
                            />
                            <button
                              onClick={() => handleSavePrice(prop.id)}
                              className="px-2.5 py-1 bg-emerald-600 text-white text-xs rounded font-medium"
                            >
                              ذخیره
                            </button>
                            <button
                              onClick={() => setEditingPricePropertyId(null)}
                              className="text-neutral-500 text-xs"
                            >
                              لغو
                            </button>
                          </div>
                        ) : (
                          <div className="text-left">
                            <span className="text-xs font-bold text-neutral-900 tabular-nums block">
                              {formatPricePersian(prop.price)}
                            </span>
                            <button
                              onClick={() => handleStartEditPrice(prop)}
                              className="text-[11px] text-amber-600 hover:text-amber-700 flex items-center gap-1 mt-0.5"
                            >
                              <Edit3 className="w-3 h-3" />
                              <span>کاهش / تغییر قیمت</span>
                            </button>
                          </div>
                        )}

                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => onSelectProperty(prop)}
                            className="p-2 rounded-lg bg-neutral-50 hover:bg-neutral-100 text-neutral-700 border border-neutral-200"
                            title="مشاهده آگهی"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onDeleteProperty(prop.id)}
                            className="p-2 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200"
                            title="حذف آگهی"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: Favorites */}
          {activeTab === 'favorites' && (
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-neutral-900">
                املاک نشان‌شده و محبوب شما ({toPersianDigits(favoriteProperties.length)})
              </h4>

              {favoriteProperties.length === 0 ? (
                <div className="text-center py-12 bg-neutral-50 rounded-2xl border border-dashed border-neutral-300">
                  <Heart className="w-8 h-8 text-neutral-400 mx-auto mb-2" />
                  <p className="text-xs font-medium text-neutral-700">شما هنوز ملکی را نشان نکرده‌اید.</p>
                  <p className="text-[11px] text-neutral-500 mt-1">با زدن آیکون قلب روی هر آگهی، آن را در این بخش ذخیره کنید تا از تغییرات قیمت مطلع شوید.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {favoriteProperties.map((prop) => (
                    <div
                      key={prop.id}
                      className="p-3 bg-white rounded-xl border border-neutral-200 flex gap-3 items-center justify-between"
                    >
                      <div
                        onClick={() => onSelectProperty(prop)}
                        className="flex items-center gap-3 cursor-pointer min-w-0 flex-1"
                      >
                        <img
                          src={prop.images[0]}
                          alt=""
                          className="w-16 h-14 rounded-lg object-cover shrink-0"
                        />
                        <div className="min-w-0">
                          <h5 className="text-xs font-bold text-neutral-900 truncate">
                            {prop.title}
                          </h5>
                          <span className="text-[11px] text-neutral-500 block mt-0.5">
                            {prop.neighborhood} · {formatPricePersian(prop.price)}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => onRemoveFavorite(prop.id)}
                        className="p-2 text-neutral-400 hover:text-rose-600 rounded-lg hover:bg-neutral-50 transition-colors"
                        title="حذف از نشان‌شده‌ها"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: Messages & Conversations */}
          {activeTab === 'messages' && (
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-neutral-900">گفتگوها و مشاورین ملک</h4>
              <div className="space-y-2">
                {conversations.map((conv) => (
                  <div
                    key={conv.id}
                    onClick={() => onOpenConversation(conv.id)}
                    className="p-4 bg-white rounded-xl border border-neutral-200 hover:border-neutral-300 transition-colors cursor-pointer flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="relative">
                        <img
                          src={conv.advisorAvatar}
                          alt=""
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        {conv.unreadCount > 0 && (
                          <span className="w-3 h-3 rounded-full bg-amber-500 absolute top-0 left-0 ring-2 ring-white" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h5 className="text-xs font-bold text-neutral-900">
                            {conv.advisorName}
                          </h5>
                          <span className="text-[10px] text-neutral-400">
                            {conv.advisorAgency}
                          </span>
                        </div>
                        <p className="text-xs text-neutral-600 truncate mt-1">
                          {conv.lastMessage}
                        </p>
                      </div>
                    </div>

                    <div className="text-left shrink-0">
                      <span className="text-[11px] text-neutral-400 block tabular-nums">
                        {conv.lastMessageTime}
                      </span>
                      <button className="text-xs text-amber-700 font-semibold mt-1">
                        مشاهده گفتگو ←
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: Notifications & Price Alerts */}
          {activeTab === 'notifications' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-neutral-900">اعلان‌های آنی و تغییرات قیمت</h4>
                  <p className="text-xs text-neutral-500">
                    هنگامی که قیمت ملکی کاهش یابد یا آگهی جدیدی مطابق معیار شما ثبت شود، در این بخش مطلع خواهید شد.
                  </p>
                </div>
              </div>

              <div className="space-y-2.5">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => onMarkNotificationAsRead(n.id)}
                    className={`p-4 rounded-xl border transition-colors cursor-pointer flex items-start gap-3 ${
                      n.isRead
                        ? 'bg-neutral-50/70 border-neutral-200'
                        : 'bg-amber-50/70 border-amber-200 shadow-xs'
                    }`}
                  >
                    <div className="p-2 rounded-lg bg-white border border-neutral-200 shrink-0 text-amber-600">
                      {n.type === 'price_drop' ? (
                        <TrendingDown className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Bell className="w-4 h-4 text-amber-600" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h5 className="text-xs font-bold text-neutral-900">{n.title}</h5>
                        <span className="text-[11px] text-neutral-400">{n.timestamp}</span>
                      </div>
                      <p className="text-xs text-neutral-700 mt-1 leading-relaxed">{n.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: Profile & Trust Score */}
          {activeTab === 'profile' && (
            <div className="space-y-6 max-w-xl mx-auto py-2">
              {/* Trust Score Header */}
              <div className="p-6 bg-gradient-to-br from-neutral-900 to-neutral-800 rounded-2xl text-white text-center space-y-3">
                <div className="w-16 h-16 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-400 flex items-center justify-center mx-auto text-2xl font-black">
                  <Award className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="text-lg font-bold">امتیاز اعتبارسنجی و اعتماد: ۹۸٪</h4>
                  <p className="text-xs text-neutral-300 mt-1">
                    حساب کاربری شما دارای نشان طلایی تایید هویت و اعتبار سنجی املاک است.
                  </p>
                </div>
                <div className="flex items-center justify-center gap-6 pt-3 border-t border-white/10 text-xs">
                  <div>
                    <span className="text-neutral-400 block text-[10px]">احراز هویت</span>
                    <span className="text-emerald-400 font-bold">تایید شده (کد ملی و همراه)</span>
                  </div>
                  <div>
                    <span className="text-neutral-400 block text-[10px]">سابقه فعالیت</span>
                    <span className="text-white font-bold">بیش از ۱ سال</span>
                  </div>
                  <div>
                    <span className="text-neutral-400 block text-[10px]">شکایات ثبت شده</span>
                    <span className="text-emerald-400 font-bold">۰ گزارش تخلف</span>
                  </div>
                </div>
              </div>

              {/* Profile Details Form */}
              <div className="bg-neutral-50 rounded-xl p-5 border border-neutral-200 space-y-4 text-xs">
                <h5 className="font-bold text-neutral-900">مشخصات هویتی و ارتباطی</h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <span className="text-neutral-500 block mb-1">نام و نام خانوادگی</span>
                    <input
                      type="text"
                      disabled
                      value={user.name}
                      className="w-full p-2.5 bg-white border border-neutral-200 rounded-lg text-neutral-800 font-medium"
                    />
                  </div>
                  <div>
                    <span className="text-neutral-500 block mb-1">شماره تلفن همراه</span>
                    <input
                      type="text"
                      disabled
                      value={toPersianDigits(user.phone)}
                      className="w-full p-2.5 bg-white border border-neutral-200 rounded-lg text-neutral-800 font-medium"
                    />
                  </div>
                </div>
                <div>
                  <span className="text-neutral-500 block mb-1">پست الکترونیک</span>
                  <input
                    type="email"
                    disabled
                    value={user.email}
                    className="w-full p-2.5 bg-white border border-neutral-200 rounded-lg text-neutral-800 font-medium"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
