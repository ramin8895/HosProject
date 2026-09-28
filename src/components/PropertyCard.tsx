import React from 'react';
import { Property } from '../types/property';
import { formatPricePersian, formatNumberPersian, toPersianDigits } from '../utils/formatters';
import { Heart, Compass, Star, Eye, Layers } from 'lucide-react';

interface PropertyCardProps {
  property: Property;
  isFavorite: boolean;
  onToggleFavorite: (propertyId: string) => void;
  onSelect: (property: Property) => void;
  onOpenVirtualTour: (property: Property) => void;
  isCompared?: boolean;
  onToggleCompare?: (property: Property) => void;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  isFavorite,
  onToggleFavorite,
  onSelect,
  onOpenVirtualTour,
  isCompared,
  onToggleCompare,
}) => {
  const primaryImage = property.images[0] || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80';

  return (
    <div
      onClick={() => onSelect(property)}
      className="group bg-white rounded-xl border border-neutral-200 hover:border-neutral-400/80 transition-all duration-200 overflow-hidden cursor-pointer flex flex-col justify-between"
    >
      {/* Visual Asset Container */}
      <div className="relative aspect-[16/10] w-full bg-neutral-100 overflow-hidden">
        <img
          src={primaryImage}
          alt={property.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
          loading="lazy"
        />

        {/* Gradient scrim for contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

        {/* Top Badges / Overlays */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
          {/* Virtual Tour Quick Launch Button */}
          {property.hasVirtualTour ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onOpenVirtualTour(property);
              }}
              className="px-2.5 py-1 rounded bg-black/60 hover:bg-amber-500 hover:text-neutral-950 text-white backdrop-blur-xs text-[11px] font-medium transition-colors flex items-center gap-1.5 shadow-sm"
              title="مشاهده تور مجازی ۳۶۰ درجه"
            >
              <Compass className="w-3.5 h-3.5 text-amber-400 group-hover:text-neutral-950" />
              <span>تور ۳۶۰°</span>
            </button>
          ) : (
            <div />
          )}

          {/* Favorite Heart Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(property.id);
            }}
            className={`p-2 rounded-full backdrop-blur-xs transition-transform active:scale-90 ${
              isFavorite
                ? 'bg-rose-500 text-white shadow-md'
                : 'bg-black/40 hover:bg-black/60 text-white'
            }`}
            title={isFavorite ? 'حذف از نشان‌شده‌ها' : 'افزودن به علاقه‌مندی‌ها'}
          >
            <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Bottom image overlay metadata */}
        <div className="absolute bottom-3 right-3 left-3 flex items-center justify-between text-white text-xs z-10 pointer-events-none">
          <span className="font-semibold drop-shadow-sm">
            {property.neighborhood}
          </span>
          {property.ratings.length > 0 && (
            <div className="flex items-center gap-1 text-[11px] text-amber-300 drop-shadow-sm font-medium">
              <Star className="w-3 h-3 fill-current" />
              <span className="tabular-nums">
                {toPersianDigits(
                  (
                    property.ratings.reduce((acc, cur) => acc + cur.rating, 0) /
                    property.ratings.length
                  ).toFixed(1)
                )}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Card Content & Metadata */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Clean Unboxed Metadata */}
          <div className="flex items-center gap-1.5 text-xs text-neutral-500 font-medium">
            <span>{toPersianDigits(property.meterage)} متر</span>
            <span aria-hidden="true">·</span>
            <span>{toPersianDigits(property.rooms)} خواب</span>
            <span aria-hidden="true">·</span>
            <span>طبقه {toPersianDigits(property.floor)}</span>
            <span aria-hidden="true">·</span>
            <span>ساخت {toPersianDigits(property.yearBuilt)}</span>
          </div>

          {/* Title */}
          <h3 className="mt-2 text-sm font-bold text-neutral-900 group-hover:text-amber-700 transition-colors line-clamp-1">
            {property.title}
          </h3>

          {/* Quiet Address / Sub-kicker */}
          <p className="mt-1 text-xs text-neutral-500 line-clamp-1">
            {property.address}
          </p>
        </div>

        {/* Price & Action Row */}
        <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between">
          <div>
            {property.dealType === 'buy' ? (
              <div>
                <span className="text-[11px] text-neutral-400 block">قیمت کل</span>
                <span className="text-sm font-bold text-neutral-900 tabular-nums">
                  {formatPricePersian(property.price)}
                </span>
              </div>
            ) : (
              <div>
                <span className="text-[11px] text-neutral-400 block">ودیعه و اجاره</span>
                <span className="text-xs font-bold text-neutral-900 tabular-nums">
                  {formatPricePersian(property.deposit)}
                </span>
                {property.monthlyRent ? (
                  <span className="text-[11px] text-neutral-600 block tabular-nums">
                    + ماهانه {formatNumberPersian(property.monthlyRent)} تومان
                  </span>
                ) : (
                  <span className="text-[11px] text-emerald-600 block font-medium">
                    رهن کامل
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Compare or Quick Action */}
          {onToggleCompare && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleCompare(property);
              }}
              className={`p-1.5 rounded-lg border text-xs transition-colors flex items-center gap-1 ${
                isCompared
                  ? 'bg-neutral-900 text-white border-neutral-900'
                  : 'bg-neutral-50 text-neutral-600 border-neutral-200 hover:bg-neutral-100'
              }`}
              title="افزودن به مقایسه ملک‌ها"
            >
              <Layers className="w-3.5 h-3.5" />
              <span className="hidden sm:inline text-[11px]">
                {isCompared ? 'در مقایسه' : 'مقایسه'}
              </span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
