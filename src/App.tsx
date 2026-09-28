import React, { useState, useMemo, useEffect } from 'react';
import { Property, PropertyFilterState, PropertyReview } from './types/property';
import { AppNotification, UserProfile } from './types/notification';
import { ChatConversation } from './types/chat';

import { INITIAL_PROPERTIES } from './data/initialProperties';
import { INITIAL_USER, INITIAL_NOTIFICATIONS, INITIAL_CONVERSATIONS } from './data/initialData';

import { Navbar } from './components/Navbar';
import { FilterBar } from './components/FilterBar';
import { InteractiveMap } from './components/InteractiveMap';
import { PropertyCard } from './components/PropertyCard';
import { PropertyDetailModal } from './components/PropertyDetailModal';
import { VirtualTourViewer } from './components/VirtualTourViewer';
import { InternalChatModal } from './components/InternalChatModal';
import { PropertySubmitModal } from './components/PropertySubmitModal';
import { UserDashboardModal } from './components/UserDashboardModal';
import { CompareDrawer } from './components/CompareDrawer';

import { toPersianDigits, formatPricePersian } from './utils/formatters';
import { MapPin, Sparkles, Building, SlidersHorizontal, CheckCircle2, AlertCircle } from 'lucide-react';

export default function App() {
  // Global State with LocalStorage Persistence fallback
  const [properties, setProperties] = useState<Property[]>(() => {
    const saved = localStorage.getItem('melkyab_properties');
    return saved ? JSON.parse(saved) : INITIAL_PROPERTIES;
  });

  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('melkyab_favorites');
    return saved ? JSON.parse(saved) : INITIAL_USER.favoritePropertyIds;
  });

  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem('melkyab_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [conversations, setConversations] = useState<ChatConversation[]>(() => {
    const saved = localStorage.getItem('melkyab_conversations');
    return saved ? JSON.parse(saved) : INITIAL_CONVERSATIONS;
  });

  const [userProfile, setUserProfile] = useState<UserProfile>(INITIAL_USER);

  // Sync state to LocalStorage
  useEffect(() => {
    localStorage.setItem('melkyab_properties', JSON.stringify(properties));
  }, [properties]);

  useEffect(() => {
    localStorage.setItem('melkyab_favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('melkyab_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('melkyab_conversations', JSON.stringify(conversations));
  }, [conversations]);

  // View & UI Navigation
  const [currentView, setCurrentView] = useState<'map_list' | 'list_only' | 'favorites'>('map_list');
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [detailModalProperty, setDetailModalProperty] = useState<Property | null>(null);
  const [virtualTourProperty, setVirtualTourProperty] = useState<Property | null>(null);

  // Modals
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);
  const [dashboardInitialTab, setDashboardInitialTab] = useState<'my_listings' | 'favorites' | 'messages' | 'notifications' | 'profile'>('my_listings');
  const [activeChatConversationId, setActiveChatConversationId] = useState<string | null>(null);
  const [chatProperty, setChatProperty] = useState<Property | null>(null);

  // Compare List
  const [comparedProperties, setComparedProperties] = useState<Property[]>([]);
  const [isCompareDrawerOpen, setIsCompareDrawerOpen] = useState(false);

  // Active Toast Notification Banner
  const [activeToast, setActiveToast] = useState<{ title: string; message: string } | null>(null);

  // Filter State
  const [filters, setFilters] = useState<PropertyFilterState>({
    searchQuery: '',
    dealType: 'all',
    propertyType: 'all',
    minPrice: 0,
    maxPrice: 100000000000,
    minMeterage: 0,
    maxMeterage: 1000,
    rooms: 'all',
    hasVirtualTour: false,
    amenities: [],
    neighborhood: 'همه محله‌ها',
    sortBy: 'newest',
  });

  // Filter & Search Logic
  const filteredProperties = useMemo(() => {
    return properties.filter((prop) => {
      // Search query in title, address, description, advisor
      if (filters.searchQuery.trim()) {
        const query = filters.searchQuery.toLowerCase();
        const matchesTitle = prop.title.toLowerCase().includes(query);
        const matchesAddress = prop.address.toLowerCase().includes(query);
        const matchesNeighborhood = prop.neighborhood.toLowerCase().includes(query);
        const matchesDesc = prop.description.toLowerCase().includes(query);
        if (!matchesTitle && !matchesAddress && !matchesNeighborhood && !matchesDesc) {
          return false;
        }
      }

      // Deal type
      if (filters.dealType !== 'all' && prop.dealType !== filters.dealType) {
        return false;
      }

      // Property type
      if (filters.propertyType !== 'all' && prop.type !== filters.propertyType) {
        return false;
      }

      // Price
      const checkPrice = prop.dealType === 'buy' ? prop.price : (prop.deposit || 0);
      if (checkPrice < filters.minPrice || checkPrice > filters.maxPrice) {
        return false;
      }

      // Meterage
      if (prop.meterage < filters.minMeterage || prop.meterage > filters.maxMeterage) {
        return false;
      }

      // Rooms
      if (filters.rooms !== 'all' && prop.rooms !== filters.rooms) {
        return false;
      }

      // Virtual Tour
      if (filters.hasVirtualTour && !prop.hasVirtualTour) {
        return false;
      }

      // Neighborhood
      if (filters.neighborhood !== 'همه محله‌ها' && prop.neighborhood !== filters.neighborhood) {
        return false;
      }

      // Amenities
      if (filters.amenities.length > 0) {
        const hasAllAmenities = filters.amenities.every((a) =>
          prop.amenities.some((pAmenity) => pAmenity.includes(a))
        );
        if (!hasAllAmenities) return false;
      }

      // Favorites view filter
      if (currentView === 'favorites' && !favorites.includes(prop.id)) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (filters.sortBy === 'priceAsc') {
        const priceA = a.price || a.deposit || 0;
        const priceB = b.price || b.deposit || 0;
        return priceA - priceB;
      }
      if (filters.sortBy === 'priceDesc') {
        const priceA = a.price || a.deposit || 0;
        const priceB = b.price || b.deposit || 0;
        return priceB - priceA;
      }
      if (filters.sortBy === 'meterageDesc') {
        return b.meterage - a.meterage;
      }
      if (filters.sortBy === 'popular') {
        return b.viewsCount - a.viewsCount;
      }
      return 0; // default newest
    });
  }, [properties, filters, currentView, favorites]);

  // Show Toast Helper
  const showToast = (title: string, message: string) => {
    setActiveToast({ title, message });
    setTimeout(() => setActiveToast(null), 4500);
  };

  // Toggle Favorite
  const handleToggleFavorite = (propertyId: string) => {
    const isFav = favorites.includes(propertyId);
    const updated = isFav
      ? favorites.filter((id) => id !== propertyId)
      : [...favorites, propertyId];
    setFavorites(updated);

    showToast(
      isFav ? 'حذف از نشان‌شده‌ها' : 'ذخیره در علاقه‌مندی‌ها',
      isFav ? 'ملک از لیست ذخیره‌شده‌ها حذف شد.' : 'هرگونه تغییر قیمت این ملک از طریق اعلان به اطلاع شما خواهد رسید.'
    );
  };

  // Toggle Compare
  const handleToggleCompare = (property: Property) => {
    const exists = comparedProperties.some((p) => p.id === property.id);
    if (exists) {
      setComparedProperties(comparedProperties.filter((p) => p.id !== property.id));
    } else {
      if (comparedProperties.length >= 3) {
        showToast('حداکثر ظرفیت مقایسه', 'امکان مقایسه همزمان حداکثر ۳ ملک وجود دارد.');
        return;
      }
      setComparedProperties([...comparedProperties, property]);
      setIsCompareDrawerOpen(true);
    }
  };

  // Open Chat with Advisor / Owner
  const handleOpenChat = (property: Property) => {
    setChatProperty(property);
    // Find or create conversation
    let conv = conversations.find((c) => c.propertyId === property.id);
    if (!conv) {
      conv = {
        id: `conv-${Date.now()}`,
        propertyId: property.id,
        propertyTitle: property.title,
        propertyPrice: property.dealType === 'buy' ? formatPricePersian(property.price) : `ودیعه: ${formatPricePersian(property.deposit)}`,
        propertyImage: property.images[0],
        advisorId: property.advisor.id,
        advisorName: property.advisor.name,
        advisorAvatar: property.advisor.avatar,
        advisorAgency: property.advisor.agency,
        lastMessage: 'گفتگو آغاز شد.',
        lastMessageTime: 'هم‌اکنون',
        unreadCount: 0,
        messages: [],
      };
      setConversations([conv, ...conversations]);
    }
    setActiveChatConversationId(conv.id);
  };

  // Send Message in In-App Chat
  const handleSendMessage = (
    conversationId: string,
    text: string,
    type: 'text' | 'offer' | 'visit_request' = 'text',
    meta?: any
  ) => {
    const newMsg = {
      id: `msg-${Date.now()}`,
      senderId: 'user-me',
      senderName: userProfile.name,
      senderRole: 'buyer' as const,
      text,
      timestamp: 'هم‌اکنون',
      isRead: true,
      type,
      offerDetails: meta,
    };

    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === conversationId) {
          return {
            ...c,
            lastMessage: text,
            lastMessageTime: 'هم‌اکنون',
            messages: [...c.messages, newMsg],
          };
        }
        return c;
      })
    );

    // Realistic Simulated Agent Response after 1.6s
    setTimeout(() => {
      let replyText = 'سلام و احترام، پیام شما دریافت شد. در اسرع وقت جهت ارائه توضیحات تکمیلی و هماهنگی با شما تماس خواهم گرفت.';
      if (type === 'visit_request') {
        replyText = `درخواست بازدید شما برای «${meta?.visitDate || 'روز آینده'}» دریافت شد. زمان بازدید با مالک تایید گردید. آدرس دقیق برای شما ارسال خواهد شد.`;
      } else if (type === 'offer') {
        replyText = `پیشنهاد قیمت به مبلغ «${formatPricePersian(meta?.proposedPrice)}» به استحضار مالک محترم رسید. پس از جلسه با ایشان پاسخ نهایی خدمتتان اعلام می‌گردد.`;
      }

      const agentMsg = {
        id: `msg-rep-${Date.now()}`,
        senderId: 'advisor',
        senderName: chatProperty?.advisor.name || 'مشاور ملک',
        senderRole: 'advisor' as const,
        text: replyText,
        timestamp: 'هم‌اکنون',
        isRead: true,
        type: 'text' as const,
      };

      setConversations((prev) =>
        prev.map((c) => {
          if (c.id === conversationId) {
            return {
              ...c,
              lastMessage: replyText,
              lastMessageTime: 'هم‌اکنون',
              messages: [...c.messages, agentMsg],
            };
          }
          return c;
        })
      );

      showToast('پیام جدید در چت', `${chatProperty?.advisor.name || 'مشاور ملک'}: ${replyText}`);
    }, 1600);
  };

  // Add Review & Star Rating to Property
  const handleAddReview = (propertyId: string, reviewData: Omit<PropertyReview, 'id' | 'date'>) => {
    const newReview: PropertyReview = {
      id: `rev-${Date.now()}`,
      date: 'هم‌اکنون',
      ...reviewData,
    };

    setProperties((prev) =>
      prev.map((p) => {
        if (p.id === propertyId) {
          return {
            ...p,
            ratings: [newReview, ...p.ratings],
          };
        }
        return p;
      })
    );

    // Update detailModalProperty if currently opened
    if (detailModalProperty && detailModalProperty.id === propertyId) {
      setDetailModalProperty((prev) =>
        prev ? { ...prev, ratings: [newReview, ...prev.ratings] } : null
      );
    }

    showToast('ثبت موفق نظر', 'نظر و امتیاز شما با موفقیت برای این ملک ثبت گردید.');
  };

  // Report Violation
  const handleReportProperty = (propertyId: string, reason: string, description: string) => {
    showToast('گزارش تخلف ثبت شد', `گزارش شما با علت «${reason}» به مرکز بازرسی و امنیت ارسال شد.`);
  };

  // Submit New Property by Owner
  const handleSubmitNewProperty = (newProperty: Property) => {
    setProperties([newProperty, ...properties]);
    setIsSubmitModalOpen(false);

    // Dispatch Notification
    const newNotif: AppNotification = {
      id: `notif-${Date.now()}`,
      title: 'آگهی جدید با تور مجازی ۳۶۰°',
      message: `آگهی جدید «${newProperty.title}» در محدوده ${newProperty.neighborhood} با موفقیت منتشر شد.`,
      type: 'new_listing',
      propertyId: newProperty.id,
      timestamp: 'هم‌اکنون',
      isRead: false,
    };
    setNotifications([newNotif, ...notifications]);

    showToast('انتشار آگهی با موفقیت انجام شد', 'آگهی شما هم‌اکنون روی نقشه و در فهرست املاک قابل مشاهده است.');
    setSelectedProperty(newProperty);
  };

  // Update Property Price (from owner dashboard) -> triggers price drop alert!
  const handleUpdatePropertyPrice = (propertyId: string, newPrice: number) => {
    let oldPrice = 0;
    let title = '';

    setProperties((prev) =>
      prev.map((p) => {
        if (p.id === propertyId) {
          oldPrice = p.price;
          title = p.title;
          const drop = oldPrice > newPrice;
          const newHistory = [
            {
              date: 'هم‌اکنون',
              price: newPrice,
              note: drop ? 'کاهش قیمت جدید توسط مالک' : 'تغییر قیمت',
            },
            ...(p.priceHistory || []),
          ];
          return {
            ...p,
            price: newPrice,
            priceHistory: newHistory,
          };
        }
        return p;
      })
    );

    // If price decreased, dispatch instant notification
    if (newPrice < oldPrice) {
      const dropNotif: AppNotification = {
        id: `notif-drop-${Date.now()}`,
        title: 'کاهش قیمت فوری در آگهی!',
        message: `قیمت «${title}» از ${formatPricePersian(oldPrice)} به ${formatPricePersian(newPrice)} کاهش یافت.`,
        type: 'price_drop',
        propertyId,
        timestamp: 'هم‌اکنون',
        isRead: false,
        meta: {
          oldPrice,
          newPrice,
          dropPercent: Math.round(((oldPrice - newPrice) / oldPrice) * 100),
        },
      };
      setNotifications((prev) => [dropNotif, ...prev]);
      showToast('اعلان کاهش قیمت ثبت شد', `قیمت ملک با موفقیت بروزرسانی شد و به نشان‌دهندگان اعلام گردید.`);
    } else {
      showToast('قیمت بروزرسانی شد', `قیمت جدید به مبلغ ${formatPricePersian(newPrice)} ثبت گردید.`);
    }
  };

  // Delete Property
  const handleDeleteProperty = (propertyId: string) => {
    setProperties((prev) => prev.filter((p) => p.id !== propertyId));
    showToast('آگهی حذف شد', 'ملک مورد نظر با موفقیت از سیستم حذف گردید.');
  };

  // Mark notification read
  const handleMarkNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  // Active Chat Conversation
  const activeConversation = conversations.find(
    (c) => c.id === activeChatConversationId
  ) || null;

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 flex flex-col">
      {/* Top Navbar */}
      <Navbar
        currentView={currentView}
        onViewChange={(v) => setCurrentView(v)}
        favoritesCount={favorites.length}
        notifications={notifications}
        onOpenDashboard={(tab) => {
          if (tab) setDashboardInitialTab(tab);
          setIsDashboardOpen(true);
        }}
        onOpenSubmitModal={() => setIsSubmitModalOpen(true)}
        comparedCount={comparedProperties.length}
        onOpenCompare={() => setIsCompareDrawerOpen(true)}
        onMarkNotificationAsRead={handleMarkNotificationAsRead}
      />

      {/* Filter & Search Bar */}
      <FilterBar
        filters={filters}
        onFilterChange={setFilters}
        totalResultsCount={filteredProperties.length}
      />

      {/* Main View Area */}
      <main className="flex-1 flex flex-col">
        {currentView === 'map_list' ? (
          /* Split Layout: Interactive Map on Left / Listing Cards on Right */
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 min-h-[calc(100vh-140px)]">
            {/* Listing Cards Column (7 cols on desktop) */}
            <div className="lg:col-span-7 xl:col-span-7 p-4 sm:p-6 overflow-y-auto max-h-[calc(100vh-140px)] order-2 lg:order-1">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-bold text-neutral-900">
                    املاک موجود در محدوده نقشه
                  </h2>
                  <p className="text-xs text-neutral-500">
                    برای بررسی موقعیت، روی پین‌های نقشه یا کارت‌های ملک کلیک کنید.
                  </p>
                </div>
                <span className="text-xs font-semibold text-neutral-600 tabular-nums">
                  {toPersianDigits(filteredProperties.length)} ملک یافت شد
                </span>
              </div>

              {filteredProperties.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-neutral-300 p-6">
                  <Building className="w-10 h-10 text-neutral-400 mx-auto mb-2" />
                  <h3 className="text-sm font-bold text-neutral-800">هیچ ملکی با این فیلترها یافت نشد</h3>
                  <p className="text-xs text-neutral-500 mt-1 max-w-sm mx-auto">
                    می‌توانید فیلترهای قیمت، متراژ یا محدوده محله را تغییر داده یا مجدداً تنظیم نمایید.
                  </p>
                  <button
                    onClick={() =>
                      setFilters({
                        searchQuery: '',
                        dealType: 'all',
                        propertyType: 'all',
                        minPrice: 0,
                        maxPrice: 100000000000,
                        minMeterage: 0,
                        maxMeterage: 1000,
                        rooms: 'all',
                        hasVirtualTour: false,
                        amenities: [],
                        neighborhood: 'همه محله‌ها',
                        sortBy: 'newest',
                      })
                    }
                    className="mt-4 px-4 py-2 bg-neutral-900 text-white rounded-lg text-xs font-semibold"
                  >
                    نمایش همه املاک
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {filteredProperties.map((prop) => (
                    <PropertyCard
                      key={prop.id}
                      property={prop}
                      isFavorite={favorites.includes(prop.id)}
                      onToggleFavorite={handleToggleFavorite}
                      onSelect={(p) => {
                        setSelectedProperty(p);
                        setDetailModalProperty(p);
                      }}
                      onOpenVirtualTour={(p) => setVirtualTourProperty(p)}
                      isCompared={comparedProperties.some((cp) => cp.id === prop.id)}
                      onToggleCompare={handleToggleCompare}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Interactive Leaflet Map Column (5 cols on desktop) */}
            <div className="lg:col-span-5 xl:col-span-5 sticky top-0 h-[420px] lg:h-[calc(100vh-140px)] border-b lg:border-b-0 lg:border-r border-neutral-200 order-1 lg:order-2">
              <InteractiveMap
                properties={filteredProperties}
                selectedProperty={selectedProperty}
                onSelectProperty={(p) => setSelectedProperty(p)}
                onOpenQuickDetail={(p) => setDetailModalProperty(p)}
              />
            </div>
          </div>
        ) : (
          /* Full Grid Listing View (or Favorites) */
          <div className="max-w-7xl mx-auto px-4 py-6 w-full flex-1">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-neutral-900">
                  {currentView === 'favorites' ? 'املاک نشان‌شده و علاقه‌مندی‌های شما' : 'فهرست کامل املاک و مستغلات'}
                </h2>
                <p className="text-xs text-neutral-500 mt-0.5">
                  نمایش {toPersianDigits(filteredProperties.length)} مورد بر اساس فیلترهای انتخابی
                </p>
              </div>

              {currentView === 'favorites' && (
                <button
                  onClick={() => setCurrentView('map_list')}
                  className="text-xs text-amber-700 font-bold hover:underline"
                >
                  بازگشت به نقشه ←
                </button>
              )}
            </div>

            {filteredProperties.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-neutral-300 p-8">
                <Building className="w-12 h-12 text-neutral-400 mx-auto mb-3" />
                <h3 className="text-base font-bold text-neutral-800">
                  {currentView === 'favorites' ? 'هنوز هیچ آگهی نشان نکرده‌اید' : 'ملکی با این مشخصات یافت نشد'}
                </h3>
                <p className="text-xs text-neutral-500 mt-1 max-w-sm mx-auto">
                  {currentView === 'favorites'
                    ? 'برای ذخیره املاک، روی آیکون قلب در هر کارت کلیک کنید تا تغییرات قیمت آن را پیگیری کنید.'
                    : 'فیلترهای اعمال شده را تغییر دهید تا املاک بیشتری نمایش داده شوند.'}
                </p>
                <button
                  onClick={() => setCurrentView('map_list')}
                  className="mt-4 px-5 py-2.5 bg-neutral-900 text-white rounded-xl text-xs font-bold"
                >
                  مشاهده همه املاک روی نقشه
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {filteredProperties.map((prop) => (
                  <PropertyCard
                    key={prop.id}
                    property={prop}
                    isFavorite={favorites.includes(prop.id)}
                    onToggleFavorite={handleToggleFavorite}
                    onSelect={(p) => {
                      setSelectedProperty(p);
                      setDetailModalProperty(p);
                    }}
                    onOpenVirtualTour={(p) => setVirtualTourProperty(p)}
                    isCompared={comparedProperties.some((cp) => cp.id === prop.id)}
                    onToggleCompare={handleToggleCompare}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Standalone Fullscreen 360 Virtual Tour Modal */}
      {virtualTourProperty && virtualTourProperty.virtualTourRooms && (
        <div className="fixed inset-0 z-70 bg-neutral-950 flex flex-col">
          <VirtualTourViewer
            rooms={virtualTourProperty.virtualTourRooms}
            propertyTitle={virtualTourProperty.title}
            onClose={() => setVirtualTourProperty(null)}
          />
        </div>
      )}

      {/* Property Details Modal */}
      {detailModalProperty && (
        <PropertyDetailModal
          property={detailModalProperty}
          onClose={() => setDetailModalProperty(null)}
          isFavorite={favorites.includes(detailModalProperty.id)}
          onToggleFavorite={handleToggleFavorite}
          onOpenChat={handleOpenChat}
          onAddReview={handleAddReview}
          onReportProperty={handleReportProperty}
          isCompared={comparedProperties.some((cp) => cp.id === detailModalProperty.id)}
          onToggleCompare={handleToggleCompare}
        />
      )}

      {/* Internal Real-Time Chat Modal */}
      {activeChatConversationId && activeConversation && (
        <InternalChatModal
          property={chatProperty}
          conversation={activeConversation}
          onClose={() => setActiveChatConversationId(null)}
          onSendMessage={handleSendMessage}
          onViewProperty={(propId) => {
            const prop = properties.find((p) => p.id === propId);
            if (prop) {
              setDetailModalProperty(prop);
            }
          }}
        />
      )}

      {/* Property Submit Wizard (Owner Panel) */}
      {isSubmitModalOpen && (
        <PropertySubmitModal
          onClose={() => setIsSubmitModalOpen(false)}
          onSubmit={handleSubmitNewProperty}
          currentUserName={userProfile.name}
        />
      )}

      {/* User Dashboard & Profile Modal */}
      {isDashboardOpen && (
        <UserDashboardModal
          user={userProfile}
          properties={properties}
          favorites={favorites}
          notifications={notifications}
          conversations={conversations}
          activeTab={dashboardInitialTab}
          onClose={() => setIsDashboardOpen(false)}
          onOpenSubmitModal={() => {
            setIsDashboardOpen(false);
            setIsSubmitModalOpen(true);
          }}
          onSelectProperty={(p) => {
            setIsDashboardOpen(false);
            setDetailModalProperty(p);
          }}
          onRemoveFavorite={handleToggleFavorite}
          onOpenConversation={(convId) => {
            setIsDashboardOpen(false);
            setActiveChatConversationId(convId);
          }}
          onUpdatePropertyPrice={handleUpdatePropertyPrice}
          onDeleteProperty={handleDeleteProperty}
          onMarkNotificationAsRead={handleMarkNotificationAsRead}
        />
      )}

      {/* Comparison Drawer */}
      {isCompareDrawerOpen && (
        <CompareDrawer
          comparedProperties={comparedProperties}
          onRemoveFromCompare={(id) =>
            setComparedProperties(comparedProperties.filter((p) => p.id !== id))
          }
          onClearCompare={() => setComparedProperties([])}
          onSelectProperty={(p) => setDetailModalProperty(p)}
          onClose={() => setIsCompareDrawerOpen(false)}
        />
      )}

      {/* Instant Notification / Alert Toast */}
      {activeToast && (
        <div className="fixed bottom-6 left-6 z-80 bg-neutral-900 text-white rounded-xl shadow-2xl border border-neutral-700 p-4 max-w-sm animate-in slide-in-from-bottom duration-200">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <h5 className="text-xs font-bold text-white">{activeToast.title}</h5>
              <p className="text-[11px] text-neutral-300 mt-0.5 leading-relaxed">
                {activeToast.message}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
