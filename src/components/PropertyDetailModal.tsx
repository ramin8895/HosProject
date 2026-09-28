import React, { useState } from 'react';
import { Property, PropertyReview } from '../types/property';
import { formatPricePersian, formatNumberPersian, toPersianDigits } from '../utils/formatters';
import { VirtualTourViewer } from './VirtualTourViewer';
import { NeighborhoodPriceChart } from './NeighborhoodPriceChart';
import {
  X,
  Heart,
  Share2,
  Phone,
  MessageSquare,
  Compass,
  CheckCircle2,
  ShieldCheck,
  Star,
  Clock,
  TrendingDown,
  Building,
  Flag,
  MapPin,
  Calendar,
  AlertTriangle,
  Send,
  Layers,
} from 'lucide-react';

interface PropertyDetailModalProps {
  property: Property;
  onClose: () => void;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onOpenChat: (property: Property) => void;
  onAddReview: (propertyId: string, review: Omit<PropertyReview, 'id' | 'date'>) => void;
  onReportProperty: (propertyId: string, reason: string, description: string) => void;
  isCompared?: boolean;
  onToggleCompare?: (property: Property) => void;
}

export const PropertyDetailModal: React.FC<PropertyDetailModalProps> = ({
  property,
  onClose,
  isFavorite,
  onToggleFavorite,
  onOpenChat,
  onAddReview,
  onReportProperty,
  isCompared,
  onToggleCompare,
}) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isVirtualTourActive, setIsVirtualTourActive] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportReason, setReportReason] = useState('قیمت غیرواقعی');
  const [reportDescription, setReportDescription] = useState('');
  const [reportSubmitted, setReportSubmitted] = useState(false);

  // New review form
  const [userRating, setUserRating] = useState(5);
  const [userComment, setUserComment] = useState('');
  const [userName, setUserName] = useState('رامین حامه‌پور');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  // Copy link feedback
  const [copiedLink, setCopiedLink] = useState(false);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userComment.trim()) return;

    onAddReview(property.id, {
      userName,
      rating: userRating,
      comment: userComment,
      verifiedBuyer: true,
    });
    setUserComment('');
    setReviewSubmitted(true);
    setTimeout(() => setReviewSubmitted(false), 3000);
  };

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onReportProperty(property.id, reportReason, reportDescription);
    setReportSubmitted(true);
    setTimeout(() => {
      setReportSubmitted(false);
      setIsReportModalOpen(false);
      setReportDescription('');
    }, 2000);
  };

  const averageRating =
    property.ratings.length > 0
      ? (
          property.ratings.reduce((acc, cur) => acc + cur.rating, 0) /
          property.ratings.length
        ).toFixed(1)
      : '۵.۰';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-neutral-950/70 backdrop-blur-xs flex items-start justify-center p-2 sm:p-4 md:p-6">
      <div
        className="w-full max-w-5xl bg-white rounded-2xl shadow-2xl border border-neutral-200 overflow-hidden my-4 relative animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sticky Action Bar */}
        <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-neutral-200 px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-neutral-500 hidden sm:inline">
              کد آگهی: {toPersianDigits(property.id.replace('prop-', 'ML-'))}
            </span>
            <div className="flex items-center gap-1.5 text-xs text-neutral-500">
              <Clock className="w-3.5 h-3.5" />
              <span>ثبت شده در {property.createdAt}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Compare */}
            {onToggleCompare && (
              <button
                onClick={() => onToggleCompare(property)}
                className={`p-2 rounded-lg border text-xs transition-colors flex items-center gap-1 ${
                  isCompared
                    ? 'bg-neutral-900 text-white border-neutral-900'
                    : 'bg-neutral-50 text-neutral-700 border-neutral-200 hover:bg-neutral-100'
                }`}
                title="مقایسه با سایر املاک"
              >
                <Layers className="w-4 h-4" />
                <span className="hidden sm:inline">{isCompared ? 'در لیست مقایسه' : 'مقایسه'}</span>
              </button>
            )}

            {/* Share */}
            <button
              onClick={handleShare}
              className="p-2 rounded-lg bg-neutral-50 hover:bg-neutral-100 text-neutral-700 border border-neutral-200 transition-colors"
              title="اشتراک‌گذاری آگهی"
            >
              <Share2 className="w-4 h-4" />
            </button>
            {copiedLink && (
              <span className="text-[11px] text-emerald-600 font-medium">لینک کپی شد</span>
            )}

            {/* Favorite */}
            <button
              onClick={() => onToggleFavorite(property.id)}
              className={`p-2 rounded-lg border transition-colors ${
                isFavorite
                  ? 'bg-rose-50 text-rose-600 border-rose-200'
                  : 'bg-neutral-50 hover:bg-neutral-100 text-neutral-700 border-neutral-200'
              }`}
              title={isFavorite ? 'نشان‌شده' : 'افزودن به علاقه‌مندی'}
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
            </button>

            {/* Report */}
            <button
              onClick={() => setIsReportModalOpen(true)}
              className="p-2 rounded-lg bg-neutral-50 hover:bg-neutral-100 text-neutral-500 hover:text-rose-600 border border-neutral-200 transition-colors"
              title="گزارش تخلف آگهی"
            >
              <Flag className="w-4 h-4" />
            </button>

            {/* Close */}
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-800 transition-colors mr-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Media Section: Photos or Virtual Tour */}
        <div className="p-4 sm:p-6 bg-neutral-900">
          {isVirtualTourActive && property.virtualTourRooms && property.virtualTourRooms.length > 0 ? (
            <div>
              <VirtualTourViewer
                rooms={property.virtualTourRooms}
                propertyTitle={property.title}
                onClose={() => setIsVirtualTourActive(false)}
              />
            </div>
          ) : (
            <div>
              {/* Main Image Showcase */}
              <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden bg-neutral-950 flex items-center justify-center">
                <img
                  src={property.images[selectedImageIndex] || property.images[0]}
                  alt={property.title}
                  className="w-full h-full object-cover"
                />

                {/* Switch to 360 Tour Button if available */}
                {property.hasVirtualTour && (
                  <button
                    onClick={() => setIsVirtualTourActive(true)}
                    className="absolute bottom-4 left-4 z-10 px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs shadow-lg transition-transform active:scale-95 flex items-center gap-2"
                  >
                    <Compass className="w-4 h-4" />
                    <span>ورود به تور مجازی ۳۶۰ درجه</span>
                  </button>
                )}

                {/* Image counter */}
                <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-xs text-white text-xs px-2.5 py-1 rounded-md tabular-nums">
                  {toPersianDigits(selectedImageIndex + 1)} / {toPersianDigits(property.images.length)}
                </div>
              </div>

              {/* Thumbnails row */}
              <div className="flex items-center gap-2 mt-3 overflow-x-auto pb-1">
                {property.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`relative w-20 h-14 rounded-lg overflow-hidden shrink-0 border-2 transition-all ${
                      idx === selectedImageIndex
                        ? 'border-amber-400 opacity-100'
                        : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}

                {property.hasVirtualTour && (
                  <button
                    onClick={() => setIsVirtualTourActive(true)}
                    className="w-20 h-14 rounded-lg bg-neutral-800 border border-amber-500/40 text-amber-400 flex flex-col items-center justify-center gap-1 shrink-0 text-[10px] font-bold hover:bg-neutral-700"
                  >
                    <Compass className="w-4 h-4" />
                    <span>تور ۳۶۰°</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Info (2 Columns) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title & Location Header */}
            <div>
              <div className="flex items-center gap-2 text-xs text-neutral-500 mb-2">
                <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                <span>{property.city}</span>
                <span aria-hidden="true">·</span>
                <span className="font-semibold text-neutral-700">{property.neighborhood}</span>
                <span aria-hidden="true">·</span>
                <span>{property.dealType === 'buy' ? 'فروش' : 'رهن و اجاره'}</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-neutral-900 leading-snug">
                {property.title}
              </h1>
              <p className="text-xs text-neutral-500 mt-1">
                {property.address}
              </p>
            </div>

            {/* Quick Specs Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-neutral-50 rounded-xl border border-neutral-200">
              <div className="text-center p-2">
                <span className="text-[11px] text-neutral-500 block">متراژ</span>
                <span className="text-base font-bold text-neutral-900 tabular-nums">
                  {toPersianDigits(property.meterage)}
                </span>
                <span className="text-[11px] text-neutral-500 mr-1">متر</span>
              </div>
              <div className="text-center p-2 border-r border-neutral-200">
                <span className="text-[11px] text-neutral-500 block">اتاق خواب</span>
                <span className="text-base font-bold text-neutral-900 tabular-nums">
                  {toPersianDigits(property.rooms)}
                </span>
                <span className="text-[11px] text-neutral-500 mr-1">خواب</span>
              </div>
              <div className="text-center p-2 border-r border-neutral-200">
                <span className="text-[11px] text-neutral-500 block">طبقه</span>
                <span className="text-base font-bold text-neutral-900 tabular-nums">
                  {toPersianDigits(property.floor)}
                </span>
                <span className="text-[11px] text-neutral-500 mr-1">از {toPersianDigits(property.totalFloors)}</span>
              </div>
              <div className="text-center p-2 border-r border-neutral-200">
                <span className="text-[11px] text-neutral-500 block">سال ساخت</span>
                <span className="text-base font-bold text-neutral-900 tabular-nums">
                  {toPersianDigits(property.yearBuilt)}
                </span>
              </div>
            </div>

            {/* Detailed Description */}
            <div>
              <h3 className="text-sm font-bold text-neutral-900 mb-2">توضیحات ملک</h3>
              <p className="text-xs leading-relaxed text-neutral-700 whitespace-pre-line text-justify">
                {property.description}
              </p>
            </div>

            {/* Technical Specifications */}
            <div>
              <h3 className="text-sm font-bold text-neutral-900 mb-3">مشخصات تکمیلی</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-100">
                  <span className="text-neutral-500 block text-[11px]">نوع سند</span>
                  <span className="font-semibold text-neutral-900 mt-0.5 block">{property.documentType}</span>
                </div>
                <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-100">
                  <span className="text-neutral-500 block text-[11px]">موقعیت جغرافیایی</span>
                  <span className="font-semibold text-neutral-900 mt-0.5 block">{property.direction}</span>
                </div>
                <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-100">
                  <span className="text-neutral-500 block text-[11px]">سرویس‌های بهداشتی</span>
                  <span className="font-semibold text-neutral-900 mt-0.5 block">{toPersianDigits(property.bathrooms)} حمام و سرویس</span>
                </div>
              </div>
            </div>

            {/* Amenities Grid */}
            <div>
              <h3 className="text-sm font-bold text-neutral-900 mb-3">امکانات و تجهیزات رفاهی</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {property.amenities.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 p-2.5 bg-neutral-50 rounded-lg border border-neutral-100 text-xs text-neutral-800"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Price History & Price Drop Transparency */}
            {property.priceHistory && property.priceHistory.length > 0 && (
              <div className="p-4 bg-amber-50/60 rounded-xl border border-amber-200">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-900 mb-2">
                  <TrendingDown className="w-4 h-4 text-amber-700" />
                  <span>تاریخچه تغییرات قیمت و تخفیف‌ها</span>
                </div>
                <div className="space-y-2 mt-2">
                  {property.priceHistory.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between text-xs py-1 border-b border-amber-100 last:border-0"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-neutral-500 tabular-nums">{item.date}</span>
                        {item.note && <span className="text-neutral-700">({item.note})</span>}
                      </div>
                      <span className="font-bold text-neutral-900 tabular-nums">
                        {formatPricePersian(item.price)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Interactive 6-Month Neighborhood Price Trend Chart */}
            <NeighborhoodPriceChart
              neighborhood={property.neighborhood}
              propertyPricePerMeter={property.pricePerMeter}
            />

            {/* Nearby facilities */}
            {property.nearbyPlaces && (
              <div>
                <h3 className="text-sm font-bold text-neutral-900 mb-3">دسترسی‌ها و اماکن اطراف</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {property.nearbyPlaces.metro && (
                    <div className="p-2.5 bg-neutral-50 rounded-lg text-neutral-700">
                      <span className="font-semibold text-neutral-900">مترو / حمل‌ونقل: </span>
                      {property.nearbyPlaces.metro}
                    </div>
                  )}
                  {property.nearbyPlaces.shopping && (
                    <div className="p-2.5 bg-neutral-50 rounded-lg text-neutral-700">
                      <span className="font-semibold text-neutral-900">مراکز خرید: </span>
                      {property.nearbyPlaces.shopping}
                    </div>
                  )}
                  {property.nearbyPlaces.park && (
                    <div className="p-2.5 bg-neutral-50 rounded-lg text-neutral-700">
                      <span className="font-semibold text-neutral-900">بوستان و تفریح: </span>
                      {property.nearbyPlaces.park}
                    </div>
                  )}
                  {property.nearbyPlaces.hospital && (
                    <div className="p-2.5 bg-neutral-50 rounded-lg text-neutral-700">
                      <span className="font-semibold text-neutral-900">مراکز درمانی: </span>
                      {property.nearbyPlaces.hospital}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Ratings and Reviews Section */}
            <div className="pt-6 border-t border-neutral-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-amber-500 fill-current" />
                  <h3 className="text-sm font-bold text-neutral-900">
                    نظرات و ارزیابی کاربران ({toPersianDigits(property.ratings.length)})
                  </h3>
                  <span className="text-xs font-semibold text-neutral-600 bg-neutral-100 px-2 py-0.5 rounded tabular-nums">
                    میانگین امتیاز: {toPersianDigits(averageRating)} از ۵
                  </span>
                </div>
              </div>

              {/* List of user reviews */}
              <div className="space-y-3 mb-6">
                {property.ratings.map((rev) => (
                  <div key={rev.id} className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-100">
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-neutral-900">{rev.userName}</span>
                        {rev.verifiedBuyer && (
                          <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded font-medium">
                            بازدیدکننده تاییدشده
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-amber-500">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 ${i < rev.rating ? 'fill-current' : 'text-neutral-300'}`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-neutral-700 leading-relaxed">{rev.comment}</p>
                    <span className="text-[10px] text-neutral-400 mt-2 block">{rev.date}</span>
                  </div>
                ))}
              </div>

              {/* Add Review Form */}
              <form onSubmit={handleReviewSubmit} className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 space-y-3">
                <h4 className="text-xs font-bold text-neutral-900">ثبت نظر و امتیاز برای این آگهی</h4>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-neutral-600">امتیاز شما:</span>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setUserRating(star)}
                        className="p-1 text-amber-500 hover:scale-110 transition-transform"
                      >
                        <Star
                          className={`w-4 h-4 ${star <= userRating ? 'fill-current' : 'text-neutral-300'}`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <textarea
                  rows={2}
                  value={userComment}
                  onChange={(e) => setUserComment(e.target.value)}
                  placeholder="تجربه یا ارزیابی خود از بازدید، صداقت عکس‌ها یا موقعیت مکانی ملک را بنویسید..."
                  className="w-full p-2.5 bg-white border border-neutral-200 rounded-lg text-xs outline-none focus:border-neutral-900"
                  required
                />

                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-neutral-400">
                    ارسال به عنوان: <strong className="text-neutral-700">{userName}</strong>
                  </span>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>ثبت نظر</span>
                  </button>
                </div>

                {reviewSubmitted && (
                  <p className="text-xs text-emerald-600 font-medium">
                    نظر شما با موفقیت ثبت شد و در آگهی نمایش داده شد.
                  </p>
                )}
              </form>
            </div>
          </div>

          {/* Sidebar Purchase & Advisor Module (Sticky on Desktop) */}
          <div className="space-y-4">
            {/* Price Box */}
            <div className="p-5 bg-white rounded-2xl border border-neutral-200 shadow-sm space-y-4">
              <div>
                <span className="text-xs text-neutral-500 block mb-1">
                  {property.dealType === 'buy' ? 'قیمت کل معامله' : 'شرایط رهن و اجاره'}
                </span>
                <div className="text-lg font-extrabold text-neutral-900 tabular-nums">
                  {property.dealType === 'buy'
                    ? formatPricePersian(property.price)
                    : `ودیعه: ${formatPricePersian(property.deposit)}`}
                </div>

                {property.dealType === 'buy' && property.pricePerMeter && (
                  <span className="text-xs text-neutral-500 mt-1 block tabular-nums">
                    هر متر مربع: {formatNumberPersian(property.pricePerMeter)} تومان
                  </span>
                )}

                {property.dealType === 'rent' && property.monthlyRent !== undefined && (
                  <div className="mt-1 text-xs text-neutral-700 font-semibold tabular-nums">
                    اجاره ماهانه: {formatPricePersian(property.monthlyRent)}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2 border-t border-neutral-100">
                <button
                  onClick={() => onOpenChat(property)}
                  className="w-full py-3 bg-neutral-900 hover:bg-neutral-800 text-white font-semibold text-xs rounded-xl transition-all shadow-sm flex items-center justify-center gap-2"
                >
                  <MessageSquare className="w-4 h-4 text-amber-400" />
                  <span>چت مستقیم آنلاین با مشاور</span>
                </button>

                <a
                  href={`tel:${property.advisor.phone}`}
                  className="w-full py-3 bg-neutral-100 hover:bg-neutral-200 text-neutral-900 font-semibold text-xs rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  <Phone className="w-4 h-4 text-emerald-600" />
                  <span>تماس تلفنی ({toPersianDigits(property.advisor.phone)})</span>
                </a>
              </div>
            </div>

            {/* Advisor & Agency Card */}
            <div className="p-5 bg-neutral-50 rounded-2xl border border-neutral-200 space-y-4">
              <div className="flex items-center gap-3">
                <img
                  src={property.advisor.avatar}
                  alt={property.advisor.name}
                  className="w-12 h-12 rounded-full object-cover border border-neutral-200 shrink-0"
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-xs font-bold text-neutral-900 truncate">
                      {property.advisor.name}
                    </h4>
                    {property.advisor.verified && (
                      <span title="مشاور تایید هویت شده">
                        <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-neutral-500 truncate mt-0.5">
                    {property.advisor.agency}
                  </p>
                </div>
              </div>

              {/* Advisor stats */}
              <div className="grid grid-cols-2 gap-2 text-center text-xs pt-2 border-t border-neutral-200">
                <div className="p-2 bg-white rounded-lg border border-neutral-100">
                  <span className="text-[11px] text-neutral-400 block">امتیاز مشاور</span>
                  <div className="flex items-center justify-center gap-1 font-bold text-neutral-900 mt-0.5">
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-current" />
                    <span className="tabular-nums">{toPersianDigits(property.advisor.rating)}</span>
                  </div>
                </div>
                <div className="p-2 bg-white rounded-lg border border-neutral-100">
                  <span className="text-[11px] text-neutral-400 block">معاملات موفق</span>
                  <span className="font-bold text-neutral-900 mt-0.5 block tabular-nums">
                    {toPersianDigits(property.advisor.dealsCount)} قرارداد
                  </span>
                </div>
              </div>

              <p className="text-[11px] text-neutral-500 leading-relaxed text-justify">
                مشاور رسمی و ارزیاب املاک منطقه با بیش از ۷ سال سابقه کارشناسی حقوقی اسناد و قراردادها.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Report Listing Modal */}
      {isReportModalOpen && (
        <div className="fixed inset-0 z-60 bg-neutral-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div
            className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 border border-neutral-200 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-rose-600 font-bold text-sm">
                <AlertTriangle className="w-4 h-4" />
                <span>ثبت گزارش تخلف آگهی</span>
              </div>
              <button
                onClick={() => setIsReportModalOpen(false)}
                className="text-neutral-400 hover:text-neutral-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-neutral-600">
              گزارش شما بلافاصله توسط تیم نظارت و امنیت پلتفرم بررسی شده و در صورت لزوم آگهی مسدود خواهد شد.
            </p>

            <form onSubmit={handleReportSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-neutral-800 mb-1">
                  علت گزارش:
                </label>
                <select
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  className="w-full p-2 bg-neutral-50 border border-neutral-200 rounded-lg text-xs"
                >
                  <option value="قیمت غیرواقعی">قیمت غیرواقعی یا غیرمتعارف</option>
                  <option value="ملک واگذار شده">ملک فروخته یا اجاره داده شده است</option>
                  <option value="عکس نامربوط">عکس‌ها نامربوط یا ساختگی هستند</option>
                  <option value="اطلاعات متناقض">متراژ یا موقعیت مکانی نادرست است</option>
                  <option value="کلاهبرداری یا بیعانه مشکوک">درخواست بیعانه مشکوک یا کلاهبرداری</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-800 mb-1">
                  توضیحات تکمیلی (اختیاری):
                </label>
                <textarea
                  rows={3}
                  value={reportDescription}
                  onChange={(e) => setReportDescription(e.target.value)}
                  placeholder="توضیح دهید چه موردی خلاف واقع بوده است..."
                  className="w-full p-2 bg-neutral-50 border border-neutral-200 rounded-lg text-xs outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsReportModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-xs text-neutral-600 hover:bg-neutral-100"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-semibold transition-colors"
                >
                  ارسال گزارش تخلف
                </button>
              </div>

              {reportSubmitted && (
                <p className="text-xs text-emerald-600 font-medium text-center">
                  گزارش شما با موفقیت به واحد حقوقی ارسال شد. سپاس از همکاری شما.
                </p>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
