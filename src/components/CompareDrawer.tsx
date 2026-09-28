import React from 'react';
import { Property } from '../types/property';
import { formatPricePersian, formatNumberPersian, toPersianDigits } from '../utils/formatters';
import { X, Check, Minus, Layers, ExternalLink } from 'lucide-react';

interface CompareDrawerProps {
  comparedProperties: Property[];
  onRemoveFromCompare: (propertyId: string) => void;
  onClearCompare: () => void;
  onSelectProperty: (property: Property) => void;
  onClose: () => void;
}

const COMPARISON_AMENITIES = [
  'پارکینگ اختصاصی سندی',
  'آسانسور',
  'انباری',
  'بالکن / تراس',
  'استخر و سونا',
  'سیستم هوشمند BMS',
  'لابی‌من ۲۴ ساعته',
];

export const CompareDrawer: React.FC<CompareDrawerProps> = ({
  comparedProperties,
  onRemoveFromCompare,
  onClearCompare,
  onSelectProperty,
  onClose,
}) => {
  if (comparedProperties.length === 0) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 bg-white border-t border-neutral-300 shadow-2xl animate-in slide-in-from-bottom duration-300 max-h-[85vh] overflow-y-auto">
      <div className="max-w-7xl mx-auto px-4 py-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-200 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-amber-600" />
            <h3 className="text-sm font-bold text-neutral-900">
              مقایسه هوشمند املاک منتخب ({toPersianDigits(comparedProperties.length)} از ۳)
            </h3>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onClearCompare}
              className="text-xs text-neutral-500 hover:text-rose-600 transition-colors"
            >
              پاک‌کردن مقایسه
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-neutral-100 text-neutral-500 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Comparison Grid */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-right border-collapse">
            <thead>
              <tr className="border-b border-neutral-200">
                <th className="p-3 w-40 text-neutral-400 font-normal">مشخصات کلیدی</th>
                {comparedProperties.map((p) => (
                  <th key={p.id} className="p-3 min-w-[220px] max-w-[280px]">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <img
                          src={p.images[0]}
                          alt=""
                          className="w-12 h-10 rounded-lg object-cover"
                        />
                        <div className="min-w-0">
                          <h4 className="font-bold text-neutral-900 line-clamp-1">{p.title}</h4>
                          <span className="text-[10px] text-neutral-500">{p.neighborhood}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => onRemoveFromCompare(p.id)}
                        className="text-neutral-400 hover:text-rose-600 p-1"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {/* Price */}
              <tr>
                <td className="p-3 font-semibold text-neutral-700 bg-neutral-50/50">قیمت</td>
                {comparedProperties.map((p) => (
                  <td key={p.id} className="p-3 font-bold text-neutral-900 tabular-nums">
                    {formatPricePersian(p.price || p.deposit)}
                  </td>
                ))}
              </tr>

              {/* Price Per Meter */}
              <tr>
                <td className="p-3 font-semibold text-neutral-700 bg-neutral-50/50">قیمت هر متر</td>
                {comparedProperties.map((p) => (
                  <td key={p.id} className="p-3 text-neutral-600 tabular-nums">
                    {p.pricePerMeter ? `${formatNumberPersian(p.pricePerMeter)} تومان` : '—'}
                  </td>
                ))}
              </tr>

              {/* Meterage */}
              <tr>
                <td className="p-3 font-semibold text-neutral-700 bg-neutral-50/50">متراژ</td>
                {comparedProperties.map((p) => (
                  <td key={p.id} className="p-3 text-neutral-800 tabular-nums">
                    {toPersianDigits(p.meterage)} متر مربع
                  </td>
                ))}
              </tr>

              {/* Bedrooms */}
              <tr>
                <td className="p-3 font-semibold text-neutral-700 bg-neutral-50/50">اتاق خواب</td>
                {comparedProperties.map((p) => (
                  <td key={p.id} className="p-3 text-neutral-800 tabular-nums">
                    {toPersianDigits(p.rooms)} خواب
                  </td>
                ))}
              </tr>

              {/* Floor */}
              <tr>
                <td className="p-3 font-semibold text-neutral-700 bg-neutral-50/50">طبقه</td>
                {comparedProperties.map((p) => (
                  <td key={p.id} className="p-3 text-neutral-800 tabular-nums">
                    طبقه {toPersianDigits(p.floor)} از {toPersianDigits(p.totalFloors)}
                  </td>
                ))}
              </tr>

              {/* Year Built */}
              <tr>
                <td className="p-3 font-semibold text-neutral-700 bg-neutral-50/50">سال ساخت</td>
                {comparedProperties.map((p) => (
                  <td key={p.id} className="p-3 text-neutral-800 tabular-nums">
                    سال {toPersianDigits(p.yearBuilt)}
                  </td>
                ))}
              </tr>

              {/* Virtual Tour */}
              <tr>
                <td className="p-3 font-semibold text-neutral-700 bg-neutral-50/50">تور مجازی ۳۶۰°</td>
                {comparedProperties.map((p) => (
                  <td key={p.id} className="p-3">
                    {p.hasVirtualTour ? (
                      <span className="text-emerald-600 font-bold flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" /> دارد
                      </span>
                    ) : (
                      <span className="text-neutral-400 flex items-center gap-1">
                        <Minus className="w-3.5 h-3.5" /> ندارد
                      </span>
                    )}
                  </td>
                ))}
              </tr>

              {/* Document Type */}
              <tr>
                <td className="p-3 font-semibold text-neutral-700 bg-neutral-50/50">نوع سند</td>
                {comparedProperties.map((p) => (
                  <td key={p.id} className="p-3 text-neutral-800">
                    {p.documentType}
                  </td>
                ))}
              </tr>

              {/* Action row */}
              <tr>
                <td className="p-3 bg-neutral-50/50" />
                {comparedProperties.map((p) => (
                  <td key={p.id} className="p-3">
                    <button
                      onClick={() => {
                        onSelectProperty(p);
                        onClose();
                      }}
                      className="w-full py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
                    >
                      <span>مشاهده کامل</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
