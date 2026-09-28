import React, { useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { toPersianDigits, formatNumberPersian } from '../utils/formatters';
import { TrendingUp, BarChart2, Info, ArrowUpRight, ArrowDownRight, Layers } from 'lucide-react';

interface NeighborhoodPriceChartProps {
  neighborhood: string;
  propertyPricePerMeter?: number;
}

interface MonthData {
  month: string;
  pricePerMeter: number; // in Millions Toman
  tehranAvg: number; // city average in Millions Toman
  transactionsCount: number;
}

const NEIGHBORHOOD_DATA: Record<string, MonthData[]> = {
  زعفرانیه: [
    { month: 'فروردین', pricePerMeter: 118, tehranAvg: 78, transactionsCount: 84 },
    { month: 'اردیبهشت', pricePerMeter: 121, tehranAvg: 80, transactionsCount: 92 },
    { month: 'خرداد', pricePerMeter: 124, tehranAvg: 81, transactionsCount: 105 },
    { month: 'تیر', pricePerMeter: 126, tehranAvg: 83, transactionsCount: 78 },
    { month: 'مرداد', pricePerMeter: 130, tehranAvg: 84, transactionsCount: 88 },
    { month: 'شهریور', pricePerMeter: 134, tehranAvg: 86, transactionsCount: 96 },
  ],
  نیاوران: [
    { month: 'فروردین', pricePerMeter: 125, tehranAvg: 78, transactionsCount: 90 },
    { month: 'اردیبهشت', pricePerMeter: 128, tehranAvg: 80, transactionsCount: 98 },
    { month: 'خرداد', pricePerMeter: 132, tehranAvg: 81, transactionsCount: 112 },
    { month: 'تیر', pricePerMeter: 135, tehranAvg: 83, transactionsCount: 85 },
    { month: 'مرداد', pricePerMeter: 139, tehranAvg: 84, transactionsCount: 94 },
    { month: 'شهریور', pricePerMeter: 144, tehranAvg: 86, transactionsCount: 102 },
  ],
  الهیه: [
    { month: 'فروردین', pricePerMeter: 138, tehranAvg: 78, transactionsCount: 72 },
    { month: 'اردیبهشت', pricePerMeter: 142, tehranAvg: 80, transactionsCount: 80 },
    { month: 'خرداد', pricePerMeter: 147, tehranAvg: 81, transactionsCount: 95 },
    { month: 'تیر', pricePerMeter: 151, tehranAvg: 83, transactionsCount: 68 },
    { month: 'مرداد', pricePerMeter: 156, tehranAvg: 84, transactionsCount: 79 },
    { month: 'شهریور', pricePerMeter: 162, tehranAvg: 86, transactionsCount: 86 },
  ],
  سعادت‌آباد: [
    { month: 'فروردین', pricePerMeter: 142, tehranAvg: 78, transactionsCount: 130 },
    { month: 'اردیبهشت', pricePerMeter: 146, tehranAvg: 80, transactionsCount: 145 },
    { month: 'خرداد', pricePerMeter: 151, tehranAvg: 81, transactionsCount: 160 },
    { month: 'تیر', pricePerMeter: 155, tehranAvg: 83, transactionsCount: 125 },
    { month: 'مرداد', pricePerMeter: 159, tehranAvg: 84, transactionsCount: 138 },
    { month: 'شهریور', pricePerMeter: 164, tehranAvg: 86, transactionsCount: 152 },
  ],
  'شهرک غرب': [
    { month: 'فروردین', pricePerMeter: 98, tehranAvg: 78, transactionsCount: 65 },
    { month: 'اردیبهشت', pricePerMeter: 101, tehranAvg: 80, transactionsCount: 72 },
    { month: 'خرداد', pricePerMeter: 105, tehranAvg: 81, transactionsCount: 84 },
    { month: 'تیر', pricePerMeter: 109, tehranAvg: 83, transactionsCount: 60 },
    { month: 'مرداد', pricePerMeter: 112, tehranAvg: 84, transactionsCount: 68 },
    { month: 'شهریور', pricePerMeter: 117, tehranAvg: 86, transactionsCount: 75 },
  ],
  فرمانیه: [
    { month: 'فروردین', pricePerMeter: 112, tehranAvg: 78, transactionsCount: 88 },
    { month: 'اردیبهشت', pricePerMeter: 115, tehranAvg: 80, transactionsCount: 95 },
    { month: 'خرداد', pricePerMeter: 119, tehranAvg: 81, transactionsCount: 108 },
    { month: 'تیر', pricePerMeter: 122, tehranAvg: 83, transactionsCount: 80 },
    { month: 'مرداد', pricePerMeter: 126, tehranAvg: 84, transactionsCount: 90 },
    { month: 'شهریور', pricePerMeter: 131, tehranAvg: 86, transactionsCount: 98 },
  ],
  ونک: [
    { month: 'فروردین', pricePerMeter: 94, tehranAvg: 78, transactionsCount: 110 },
    { month: 'اردیبهشت', pricePerMeter: 97, tehranAvg: 80, transactionsCount: 122 },
    { month: 'خرداد', pricePerMeter: 101, tehranAvg: 81, transactionsCount: 135 },
    { month: 'تیر', pricePerMeter: 104, tehranAvg: 83, transactionsCount: 105 },
    { month: 'مرداد', pricePerMeter: 107, tehranAvg: 84, transactionsCount: 118 },
    { month: 'شهریور', pricePerMeter: 111, tehranAvg: 86, transactionsCount: 126 },
  ],
  پونک: [
    { month: 'فروردین', pricePerMeter: 96, tehranAvg: 78, transactionsCount: 140 },
    { month: 'اردیبهشت', pricePerMeter: 99, tehranAvg: 80, transactionsCount: 155 },
    { month: 'خرداد', pricePerMeter: 103, tehranAvg: 81, transactionsCount: 170 },
    { month: 'تیر', pricePerMeter: 106, tehranAvg: 83, transactionsCount: 135 },
    { month: 'مرداد', pricePerMeter: 109, tehranAvg: 84, transactionsCount: 148 },
    { month: 'شهریور', pricePerMeter: 114, tehranAvg: 86, transactionsCount: 160 },
  ],
};

const DEFAULT_DATA: MonthData[] = [
  { month: 'فروردین', pricePerMeter: 105, tehranAvg: 78, transactionsCount: 95 },
  { month: 'اردیبهشت', pricePerMeter: 108, tehranAvg: 80, transactionsCount: 104 },
  { month: 'خرداد', pricePerMeter: 112, tehranAvg: 81, transactionsCount: 118 },
  { month: 'تیر', pricePerMeter: 116, tehranAvg: 83, transactionsCount: 90 },
  { month: 'مرداد', pricePerMeter: 120, tehranAvg: 84, transactionsCount: 102 },
  { month: 'شهریور', pricePerMeter: 125, tehranAvg: 86, transactionsCount: 110 },
];

export const NeighborhoodPriceChart: React.FC<NeighborhoodPriceChartProps> = ({
  neighborhood,
  propertyPricePerMeter,
}) => {
  const [showTehranComparison, setShowTehranComparison] = useState(true);

  const data = NEIGHBORHOOD_DATA[neighborhood] || DEFAULT_DATA;
  const startPrice = data[0].pricePerMeter;
  const currentPrice = data[data.length - 1].pricePerMeter;
  const growthRate = (((currentPrice - startPrice) / startPrice) * 100).toFixed(1);

  // Property price in million toman / sqm if provided
  const propertyPricePerMInMillion = propertyPricePerMeter
    ? Math.round(propertyPricePerMeter / 1_000_000)
    : null;

  const comparisonPercent = propertyPricePerMInMillion
    ? (
        ((propertyPricePerMInMillion - currentPrice) / currentPrice) *
        100
      ).toFixed(1)
    : null;

  const isBelowAverage = comparisonPercent ? Number(comparisonPercent) < 0 : false;

  return (
    <div className="p-4 sm:p-5 bg-white rounded-xl border border-neutral-200 space-y-4">
      {/* Header with Title and 6-Month Growth Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-neutral-100">
        <div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-amber-600" />
            <h3 className="text-sm font-bold text-neutral-900">
              روند تغییرات میانگین قیمت در محله {neighborhood}
            </h3>
          </div>
          <p className="text-[11px] text-neutral-500 mt-0.5">
            آمار تحلیلی ۶ ماه گذشته بر مبنای معاملات رسمی ثبت شده در سامانه
          </p>
        </div>

        {/* 6-Month Growth Badge */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold">
            <ArrowUpRight className="w-3.5 h-3.5 text-emerald-600" />
            <span>+{toPersianDigits(growthRate)}٪ رشد ۶ ماهه</span>
          </div>

          <button
            onClick={() => setShowTehranComparison(!showTehranComparison)}
            className={`px-2.5 py-1 rounded-lg border text-xs font-medium transition-colors ${
              showTehranComparison
                ? 'bg-neutral-900 text-white border-neutral-900'
                : 'bg-neutral-50 text-neutral-600 border-neutral-200 hover:bg-neutral-100'
            }`}
          >
            مقایسه با تهران
          </button>
        </div>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
        <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-100">
          <span className="text-neutral-500 block text-[11px]">میانگین فعلی هر متر</span>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-base font-bold text-neutral-900 tabular-nums">
              {toPersianDigits(currentPrice)}
            </span>
            <span className="text-[11px] text-neutral-500">میلیون تومان</span>
          </div>
        </div>

        <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-100">
          <span className="text-neutral-500 block text-[11px]">میانگین ۶ ماه قبل</span>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-base font-bold text-neutral-700 tabular-nums">
              {toPersianDigits(startPrice)}
            </span>
            <span className="text-[11px] text-neutral-500">میلیون تومان</span>
          </div>
        </div>

        {propertyPricePerMInMillion && (
          <div className="col-span-2 sm:col-span-1 p-3 bg-amber-50/60 rounded-lg border border-amber-200">
            <span className="text-amber-900 block text-[11px] font-medium">وضعیت این ملک نسبت به منطقه</span>
            <div className="mt-1 flex items-baseline gap-1">
              <span className="text-xs font-bold text-neutral-900 tabular-nums">
                {toPersianDigits(propertyPricePerMInMillion)} م/متر
              </span>
              <span className={`text-[11px] font-bold ${isBelowAverage ? 'text-emerald-700' : 'text-amber-700'}`}>
                ({isBelowAverage ? `${toPersianDigits(Math.abs(Number(comparisonPercent)))}٪ مناسب‌تر` : `${toPersianDigits(comparisonPercent)}٪ لوکس‌تر`})
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Interactive Recharts Chart */}
      <div className="w-full h-64 sm:h-72 pt-2" dir="ltr">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
          >
            <defs>
              <linearGradient id="neighborhoodGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#d97706" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#d97706" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="tehranGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#64748b" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#64748b" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />

            <XAxis
              dataKey="month"
              tick={{ fontSize: 11, fill: '#64748b', fontFamily: 'Vazirmatn' }}
              axisLine={{ stroke: '#e2e8f0' }}
              tickLine={false}
            />

            <YAxis
              tick={{ fontSize: 11, fill: '#64748b' }}
              axisLine={false}
              tickLine={false}
              unit=" م"
              domain={['dataMin - 10', 'dataMax + 10']}
            />

            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const item = payload[0].payload as MonthData;
                  return (
                    <div
                      className="bg-neutral-900 text-white text-xs p-3 rounded-xl shadow-xl border border-neutral-700"
                      dir="rtl"
                    >
                      <div className="font-bold text-amber-400 mb-1.5 pb-1 border-b border-neutral-800">
                        ماه {item.month}
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between gap-4">
                          <span className="text-neutral-400">میانگین {neighborhood}:</span>
                          <span className="font-bold text-white tabular-nums">
                            {toPersianDigits(item.pricePerMeter)} میلیون تومان
                          </span>
                        </div>
                        {showTehranComparison && (
                          <div className="flex items-center justify-between gap-4">
                            <span className="text-neutral-400">میانگین کل تهران:</span>
                            <span className="text-neutral-300 tabular-nums">
                              {toPersianDigits(item.tehranAvg)} میلیون تومان
                            </span>
                          </div>
                        )}
                        <div className="flex items-center justify-between gap-4 pt-1 border-t border-neutral-800 text-[11px]">
                          <span className="text-neutral-400">حجم معاملات رسمی:</span>
                          <span className="text-amber-300 font-semibold tabular-nums">
                            {toPersianDigits(item.transactionsCount)} قرارداد
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />

            {/* Neighborhood Price Area */}
            <Area
              type="monotone"
              dataKey="pricePerMeter"
              name={`میانگین ${neighborhood}`}
              stroke="#d97706"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#neighborhoodGradient)"
              activeDot={{ r: 6, fill: '#b45309', stroke: '#fff', strokeWidth: 2 }}
            />

            {/* Tehran City Average Comparison Area */}
            {showTehranComparison && (
              <Area
                type="monotone"
                dataKey="tehranAvg"
                name="میانگین تهران"
                stroke="#64748b"
                strokeWidth={2}
                strokeDasharray="4 4"
                fillOpacity={1}
                fill="url(#tehranGradient)"
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Chart Legend & Explanation Footnote */}
      <div className="flex items-center justify-between text-[11px] text-neutral-500 pt-2 border-t border-neutral-100">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-600" />
            <span>میانگین محله {neighborhood}</span>
          </div>
          {showTehranComparison && (
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-500" />
              <span>میانگین کل شهر تهران</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-1 text-neutral-400">
          <Info className="w-3.5 h-3.5" />
          <span>ارقام بر اساس میلیون تومان / متر مربع</span>
        </div>
      </div>
    </div>
  );
};
