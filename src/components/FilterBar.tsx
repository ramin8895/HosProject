import React, { useState } from 'react';
import { PropertyFilterState, PropertyType, DealType } from '../types/property';
import { formatNumberPersian, formatPricePersian, toPersianDigits } from '../utils/formatters';
import { SlidersHorizontal, Search, RotateCcw, X, Check, Building2, Home, Sparkles, Filter } from 'lucide-react';

interface FilterBarProps {
  filters: PropertyFilterState;
  onFilterChange: (filters: PropertyFilterState) => void;
  totalResultsCount: number;
}

const PROPERTY_TYPES: { id: PropertyType; label: string }[] = [
  { id: 'apartment', label: 'آپارتمان' },
  { id: 'villa', label: 'ویلایی' },
  { id: 'penthouse', label: 'پنت‌هاوس' },
  { id: 'office', label: 'اداری و تجاری' },
];

const COMMON_AMENITIES = [
  'پارکینگ',
  'آسانسور',
  'انباری',
  'استخر و سونا',
  'بالکن',
  'لابی‌من ۲۴ ساعته',
  'سیستم هوشمند BMS',
  'روف‌گاردن',
];

const POPULAR_NEIGHBORHOODS = [
  'همه محله‌ها',
  'زعفرانیه',
  'نیاوران',
  'الهیه',
  'سعادت‌آباد',
  'شهرک غرب',
  'فرمانیه',
  'ونک',
  'پونک',
];

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onFilterChange,
  totalResultsCount,
}) => {
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);

  const updateFilter = <K extends keyof PropertyFilterState>(key: K, value: PropertyFilterState[K]) => {
    onFilterChange({
      ...filters,
      [key]: value,
    });
  };

  const handleResetFilters = () => {
    onFilterChange({
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
  };

  const toggleAmenity = (amenity: string) => {
    const next = filters.amenities.includes(amenity)
      ? filters.amenities.filter((a) => a !== amenity)
      : [...filters.amenities, amenity];
    updateFilter('amenities', next);
  };

  const activeFiltersCount =
    (filters.dealType !== 'all' ? 1 : 0) +
    (filters.propertyType !== 'all' ? 1 : 0) +
    (filters.minPrice > 0 || filters.maxPrice < 100000000000 ? 1 : 0) +
    (filters.minMeterage > 0 || filters.maxMeterage < 1000 ? 1 : 0) +
    (filters.rooms !== 'all' ? 1 : 0) +
    (filters.hasVirtualTour ? 1 : 0) +
    (filters.neighborhood !== 'همه محله‌ها' ? 1 : 0) +
    filters.amenities.length;

  return (
    <div className="w-full bg-white border-b border-neutral-200">
      {/* Primary Quick Controls */}
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-neutral-400 absolute right-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={filters.searchQuery}
              onChange={(e) => updateFilter('searchQuery', e.target.value)}
              placeholder="جستجوی محله، خیابان، کلیدواژه، آرشیتکت..."
              className="w-full pr-9 pl-4 py-2 bg-neutral-50 hover:bg-neutral-100/70 focus:bg-white rounded-lg border border-neutral-200 focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 text-xs text-neutral-900 transition-all outline-none"
            />
            {filters.searchQuery && (
              <button
                onClick={() => updateFilter('searchQuery', '')}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Quick Segmented Controls */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Deal Type Switcher */}
            <div className="flex items-center p-1 bg-neutral-100 rounded-lg">
              <button
                onClick={() => updateFilter('dealType', 'all')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  filters.dealType === 'all'
                    ? 'bg-white text-neutral-900 shadow-xs'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                همه معاملات
              </button>
              <button
                onClick={() => updateFilter('dealType', 'buy')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  filters.dealType === 'buy'
                    ? 'bg-white text-neutral-900 shadow-xs'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                خرید و فروش
              </button>
              <button
                onClick={() => updateFilter('dealType', 'rent')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  filters.dealType === 'rent'
                    ? 'bg-white text-neutral-900 shadow-xs'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                رهن و اجاره
              </button>
            </div>

            {/* Neighborhood selector */}
            <select
              value={filters.neighborhood}
              onChange={(e) => updateFilter('neighborhood', e.target.value)}
              className="px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-xs font-medium text-neutral-800 outline-none hover:bg-neutral-100/70 transition-colors"
            >
              {POPULAR_NEIGHBORHOODS.map((nh) => (
                <option key={nh} value={nh}>
                  {nh}
                </option>
              ))}
            </select>

            {/* Virtual Tour Toggle */}
            <button
              onClick={() => updateFilter('hasVirtualTour', !filters.hasVirtualTour)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border text-xs font-medium transition-colors ${
                filters.hasVirtualTour
                  ? 'bg-amber-50 text-amber-900 border-amber-300'
                  : 'bg-neutral-50 text-neutral-700 border-neutral-200 hover:bg-neutral-100'
              }`}
            >
              <Sparkles className={`w-3.5 h-3.5 ${filters.hasVirtualTour ? 'text-amber-600' : 'text-neutral-400'}`} />
              <span>تور مجازی ۳۶۰°</span>
            </button>

            {/* Advanced Filters Button */}
            <button
              onClick={() => setIsAdvancedOpen(true)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg border text-xs font-medium transition-all ${
                activeFiltersCount > 0
                  ? 'bg-neutral-900 text-white border-neutral-900'
                  : 'bg-white text-neutral-800 border-neutral-300 hover:border-neutral-400'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>فیلترهای پیشرفته</span>
              {activeFiltersCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-amber-500 text-neutral-950 font-bold text-[10px] flex items-center justify-center tabular-nums">
                  {toPersianDigits(activeFiltersCount)}
                </span>
              )}
            </button>

            {/* Reset Filter Button if any active */}
            {activeFiltersCount > 0 && (
              <button
                onClick={handleResetFilters}
                className="p-2 text-neutral-500 hover:text-neutral-800 hover:bg-neutral-100 rounded-lg transition-colors"
                title="پاک‌کردن فیلترها"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Secondary Sub-Bar: Sort & Result Count */}
        <div className="flex items-center justify-between mt-2 pt-2 border-t border-neutral-100 text-xs text-neutral-500">
          <div>
            <span>نتایج یافت شده: </span>
            <span className="font-semibold text-neutral-800 tabular-nums">
              {toPersianDigits(totalResultsCount)} ملک
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span>مرتب‌سازی:</span>
            <select
              value={filters.sortBy}
              onChange={(e) =>
                updateFilter('sortBy', e.target.value as PropertyFilterState['sortBy'])
              }
              className="bg-transparent font-medium text-neutral-800 outline-none cursor-pointer hover:text-neutral-950"
            >
              <option value="newest">جدیدترین آگهی‌ها</option>
              <option value="priceAsc">ارزان‌ترین قیمت</option>
              <option value="priceDesc">گران‌ترین قیمت</option>
              <option value="meterageDesc">بزرگترین متراژ</option>
              <option value="popular">محبوب‌ترین و پربازدیدترین</option>
            </select>
          </div>
        </div>
      </div>

      {/* Advanced Filters Modal / Drawer */}
      {isAdvancedOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/60 backdrop-blur-xs">
          <div
            className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-neutral-200 overflow-hidden flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-amber-600" />
                <h3 className="text-sm font-bold text-neutral-900">
                  فیلترهای پیشرفته جستجوی ملک
                </h3>
              </div>
              <button
                onClick={() => setIsAdvancedOpen(false)}
                className="p-1 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="p-6 overflow-y-auto space-y-6 text-xs text-neutral-700">
              {/* Property Type */}
              <div>
                <label className="block text-xs font-semibold text-neutral-900 mb-2">
                  نوع کاربری ملک
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    onClick={() => updateFilter('propertyType', 'all')}
                    className={`py-2 px-3 rounded-lg border text-center font-medium transition-all ${
                      filters.propertyType === 'all'
                        ? 'bg-neutral-900 text-white border-neutral-900'
                        : 'bg-neutral-50 text-neutral-700 border-neutral-200 hover:bg-neutral-100'
                    }`}
                  >
                    همه انواع
                  </button>
                  {PROPERTY_TYPES.map((pt) => (
                    <button
                      key={pt.id}
                      onClick={() => updateFilter('propertyType', pt.id)}
                      className={`py-2 px-3 rounded-lg border text-center font-medium transition-all ${
                        filters.propertyType === pt.id
                          ? 'bg-neutral-900 text-white border-neutral-900'
                          : 'bg-neutral-50 text-neutral-700 border-neutral-200 hover:bg-neutral-100'
                      }`}
                    >
                      {pt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold text-neutral-900">
                    محدوده قیمت (تومان)
                  </label>
                  <span className="text-neutral-500 font-medium tabular-nums">
                    تا {formatPricePersian(filters.maxPrice)}
                  </span>
                </div>
                <input
                  type="range"
                  min="1000000000"
                  max="100000000000"
                  step="500000000"
                  value={filters.maxPrice}
                  onChange={(e) => updateFilter('maxPrice', Number(e.target.value))}
                  className="w-full accent-neutral-900 cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-neutral-400 mt-1 tabular-nums">
                  <span>۱ میلیارد تومان</span>
                  <span>۵۰ میلیارد تومان</span>
                  <span>۱۰۰ میلیارد تومان+</span>
                </div>
              </div>

              {/* Meterage Range */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold text-neutral-900">
                    متراژ (متر مربع)
                  </label>
                  <span className="text-neutral-500 font-medium tabular-nums">
                    حداقل {toPersianDigits(filters.minMeterage)} تا {toPersianDigits(filters.maxMeterage)} متر
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-[11px] text-neutral-500 mb-1 block">از (متر)</span>
                    <input
                      type="number"
                      value={filters.minMeterage || ''}
                      onChange={(e) => updateFilter('minMeterage', Number(e.target.value) || 0)}
                      placeholder="۰"
                      className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <span className="text-[11px] text-neutral-500 mb-1 block">تا (متر)</span>
                    <input
                      type="number"
                      value={filters.maxMeterage === 1000 ? '' : filters.maxMeterage}
                      onChange={(e) => updateFilter('maxMeterage', Number(e.target.value) || 1000)}
                      placeholder="۱۰۰۰"
                      className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Bedrooms */}
              <div>
                <label className="block text-xs font-semibold text-neutral-900 mb-2">
                  تعداد اتاق خواب
                </label>
                <div className="flex items-center gap-2">
                  {(['all', 1, 2, 3, 4, 5] as const).map((r) => {
                    const isSelected = filters.rooms === r;
                    return (
                      <button
                        key={String(r)}
                        onClick={() => updateFilter('rooms', r)}
                        className={`flex-1 py-2 rounded-lg border text-center font-medium transition-all ${
                          isSelected
                            ? 'bg-neutral-900 text-white border-neutral-900'
                            : 'bg-neutral-50 text-neutral-700 border-neutral-200 hover:bg-neutral-100'
                        }`}
                      >
                        {r === 'all' ? 'همه' : `${toPersianDigits(r)} خوابه`}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Amenities Checklist */}
              <div>
                <label className="block text-xs font-semibold text-neutral-900 mb-2">
                  امکانات و ویژگی‌های خاص
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {COMMON_AMENITIES.map((amenity) => {
                    const isChecked = filters.amenities.includes(amenity);
                    return (
                      <button
                        key={amenity}
                        onClick={() => toggleAmenity(amenity)}
                        className={`p-2.5 rounded-lg border text-right font-medium flex items-center justify-between transition-all ${
                          isChecked
                            ? 'bg-amber-50 text-amber-950 border-amber-300'
                            : 'bg-neutral-50 text-neutral-700 border-neutral-200 hover:bg-neutral-100'
                        }`}
                      >
                        <span className="truncate">{amenity}</span>
                        {isChecked && <Check className="w-3.5 h-3.5 text-amber-600 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="p-4 bg-neutral-50 border-t border-neutral-200 flex items-center justify-between">
              <button
                onClick={handleResetFilters}
                className="text-xs text-neutral-500 hover:text-neutral-800 transition-colors flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>تنظیم مجدد همه فیلترها</span>
              </button>

              <button
                onClick={() => setIsAdvancedOpen(false)}
                className="px-6 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg text-xs font-semibold transition-colors"
              >
                اعمال فیلترها ({toPersianDigits(totalResultsCount)} ملک)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
