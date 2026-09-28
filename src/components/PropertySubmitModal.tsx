import React, { useState } from 'react';
import { Property, PropertyType, DealType } from '../types/property';
import { formatPricePersian, toPersianDigits } from '../utils/formatters';
import { X, Check, Upload, MapPin, Building, Sparkles, AlertCircle } from 'lucide-react';

// Preset sample photos for the submitter to pick from or input URL
import luxuryPenthouseLiving from '../assets/images/luxury_penthouse_living_1790579856900.jpg';
import modernVillaExterior from '../assets/images/modern_villa_exterior_1790579874701.jpg';
import modernKitchenInterior from '../assets/images/modern_kitchen_interior_1790579887219.jpg';
import masterBedroomSuite from '../assets/images/master_bedroom_suite_1790579902047.jpg';

interface PropertySubmitModalProps {
  onClose: () => void;
  onSubmit: (newProperty: Property) => void;
  currentUserName: string;
}

const NEIGHBORHOOD_COORDS: Record<string, { lat: number; lng: number }> = {
  زعفرانیه: { lat: 35.8142, lng: 51.4172 },
  نیاوران: { lat: 35.8198, lng: 51.4682 },
  الهیه: { lat: 35.7954, lng: 51.4258 },
  سعادت‌آباد: { lat: 35.7821, lng: 51.3789 },
  'شهرک غرب': { lat: 35.7538, lng: 51.3712 },
  فرمانیه: { lat: 35.8052, lng: 51.4812 },
  ونک: { lat: 35.7582, lng: 51.4089 },
  پونک: { lat: 35.7612, lng: 51.3398 },
  ولنجک: { lat: 35.8115, lng: 51.4021 },
};

const ALL_AMENITIES = [
  'پارکینگ اختصاصی سندی',
  'آسانسور',
  'انباری',
  'بالکن / تراس',
  'استخر و سونا',
  'روف‌گاردن',
  'لابی‌من ۲۴ ساعته',
  'سیستم هوشمند BMS',
  'سرویس مستر',
  'برق اضطراری',
];

export const PropertySubmitModal: React.FC<PropertySubmitModalProps> = ({
  onClose,
  onSubmit,
  currentUserName,
}) => {
  const [dealType, setDealType] = useState<DealType>('buy');
  const [propertyType, setPropertyType] = useState<PropertyType>('apartment');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [neighborhood, setNeighborhood] = useState('سعادت‌آباد');
  const [address, setAddress] = useState('');

  // Pricing
  const [price, setPrice] = useState<string>('15000000000');
  const [deposit, setDeposit] = useState<string>('2000000000');
  const [monthlyRent, setMonthlyRent] = useState<string>('40000000');

  // Specs
  const [meterage, setMeterage] = useState<string>('140');
  const [rooms, setRooms] = useState<string>('2');
  const [floor, setFloor] = useState<string>('3');
  const [totalFloors, setTotalFloors] = useState<string>('6');
  const [yearBuilt, setYearBuilt] = useState<string>('1402');

  // Features
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([
    'پارکینگ اختصاصی سندی',
    'آسانسور',
    'انباری',
    'بالکن / تراس',
  ]);
  const [hasVirtualTour, setHasVirtualTour] = useState(true);
  const [selectedPhotos, setSelectedPhotos] = useState<string[]>([
    luxuryPenthouseLiving,
    modernKitchenInterior,
    masterBedroomSuite,
  ]);

  const toggleAmenity = (item: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(item) ? prev.filter((x) => x !== item) : [...prev, item]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const coords = NEIGHBORHOOD_COORDS[neighborhood] || { lat: 35.77, lng: 51.41 };
    const numPrice = Number(price) || 0;
    const numDeposit = Number(deposit) || 0;
    const numRent = Number(monthlyRent) || 0;
    const numMeterage = Number(meterage) || 100;

    const newProperty: Property = {
      id: `prop-${Date.now()}`,
      title,
      description:
        description ||
        `ملک ارزنده و شخصی‌ساز در محدوده ${neighborhood}. نقشه بدون پرتی و نورگیر عالی با دسترسی به معابر اصلی.`,
      type: propertyType,
      dealType,
      price: dealType === 'buy' ? numPrice : numDeposit,
      pricePerMeter: dealType === 'buy' ? Math.round(numPrice / numMeterage) : undefined,
      deposit: dealType === 'rent' ? numDeposit : undefined,
      monthlyRent: dealType === 'rent' ? numRent : undefined,
      meterage: numMeterage,
      rooms: Number(rooms) || 2,
      bathrooms: 2,
      floor: Number(floor) || 1,
      totalFloors: Number(totalFloors) || 5,
      yearBuilt: Number(yearBuilt) || 1402,
      address: address || `${neighborhood}، خیابان فرعی مشجر`,
      neighborhood,
      city: 'تهران',
      coordinates: {
        lat: coords.lat + (Math.random() - 0.5) * 0.005,
        lng: coords.lng + (Math.random() - 0.5) * 0.005,
      },
      images: selectedPhotos.length > 0 ? selectedPhotos : [luxuryPenthouseLiving],
      hasVirtualTour,
      virtualTourRooms: hasVirtualTour
        ? [
            {
              id: 'tour-1',
              name: 'سالن پذیرایی و نشیمن',
              image: selectedPhotos[0] || luxuryPenthouseLiving,
              description: 'دید پانوراما و سالن پرنور با متریال عالی',
              hotspots: [
                {
                  label: 'آشپزخانه و خواب‌ها',
                  targetRoomId: 'tour-2',
                  pitch: 0,
                  yaw: 140,
                },
              ],
            },
            {
              id: 'tour-2',
              name: 'آشپزخانه و اتاق خواب',
              image: selectedPhotos[1] || modernKitchenInterior,
              description: 'فضای استاندارد با تجهیزات کامل',
              hotspots: [
                {
                  label: 'بازگشت به سالن',
                  targetRoomId: 'tour-1',
                  pitch: 0,
                  yaw: 220,
                },
              ],
            },
          ]
        : undefined,
      amenities: selectedAmenities,
      documentType: 'تک‌برگ ملکی',
      direction: 'جنوبی',
      advisor: {
        id: 'adv-me',
        name: currentUserName,
        phone: '09129876543',
        agency: 'مالک حقیقی (بدون واسطه)',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
        rating: 5.0,
        reviewCount: 4,
        verified: true,
        dealsCount: 2,
      },
      ownerId: 'user-me',
      ownerName: currentUserName,
      createdAt: 'هم‌اکنون',
      updatedAt: 'هم‌اکنون',
      viewsCount: 1,
      likesCount: 0,
      isFeatured: false,
      isVerified: true,
      priceHistory: [
        {
          date: 'امروز',
          price: dealType === 'buy' ? numPrice : numDeposit,
          monthlyRent: dealType === 'rent' ? numRent : undefined,
          note: 'انتشار اولیه آگهی',
        },
      ],
      ratings: [],
      status: 'active',
      nearbyPlaces: {
        metro: 'دسترسی سریع به خطوط مترو و BRT',
        shopping: 'نزدیک به مراکز خرید اصلی محله',
      },
    };

    onSubmit(newProperty);
  };

  return (
    <div className="fixed inset-0 z-60 bg-neutral-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div
        className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-neutral-200 overflow-hidden my-4 relative animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 bg-neutral-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-bold">ثبت رایگان آگهی ملک جدید</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-neutral-400 hover:text-white rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[82vh] overflow-y-auto text-xs">
          {/* Deal & Property Type */}
          <div className="space-y-3">
            <label className="block text-xs font-bold text-neutral-900">
              نوع معامله و کاربری ملک
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center p-1 bg-neutral-100 rounded-lg">
                <button
                  type="button"
                  onClick={() => setDealType('buy')}
                  className={`flex-1 py-2 text-center rounded-md font-semibold transition-colors ${
                    dealType === 'buy'
                      ? 'bg-white text-neutral-900 shadow-xs'
                      : 'text-neutral-600'
                  }`}
                >
                  فروش ملک
                </button>
                <button
                  type="button"
                  onClick={() => setDealType('rent')}
                  className={`flex-1 py-2 text-center rounded-md font-semibold transition-colors ${
                    dealType === 'rent'
                      ? 'bg-white text-neutral-900 shadow-xs'
                      : 'text-neutral-600'
                  }`}
                >
                  رهن و اجاره
                </button>
              </div>

              <select
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value as PropertyType)}
                className="p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg text-neutral-800 font-medium outline-none"
              >
                <option value="apartment">آپارتمان مسکونی</option>
                <option value="villa">ویلایی و باغ</option>
                <option value="penthouse">پنت‌هاوس مجلل</option>
                <option value="office">اداری / تجاری</option>
              </select>
            </div>
          </div>

          {/* Title & Neighborhood */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block font-bold text-neutral-900 mb-1">عنوان آگهی</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="مثلاً: آپارتمان ۱۶۰ متری تک‌واحدی با ویوی عالی در سعادت‌آباد"
                className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg outline-none focus:border-neutral-900"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-neutral-900 mb-1">انتخاب محله (تهران)</label>
              <select
                value={neighborhood}
                onChange={(e) => setNeighborhood(e.target.value)}
                className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg outline-none"
              >
                {Object.keys(NEIGHBORHOOD_COORDS).map((nh) => (
                  <option key={nh} value={nh}>
                    {nh}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Pricing */}
          <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 space-y-3">
            <label className="block font-bold text-neutral-900">
              قیمت‌گذاری و شرایط پرداخت
            </label>
            {dealType === 'buy' ? (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-neutral-600">قیمت کل معامله (تومان)</span>
                  <span className="font-bold text-neutral-900 tabular-nums">
                    {formatPricePersian(Number(price) || 0)}
                  </span>
                </div>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="مثلاً: ۱۵۰۰۰۰۰۰۰۰۰"
                  className="w-full p-2.5 bg-white border border-neutral-200 rounded-lg outline-none"
                  required
                />
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-neutral-600">ودیعه / رهن (تومان)</span>
                    <span className="font-bold text-neutral-900 tabular-nums">
                      {formatPricePersian(Number(deposit) || 0)}
                    </span>
                  </div>
                  <input
                    type="number"
                    value={deposit}
                    onChange={(e) => setDeposit(e.target.value)}
                    className="w-full p-2.5 bg-white border border-neutral-200 rounded-lg outline-none"
                    required
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-neutral-600">اجاره ماهانه (تومان)</span>
                    <span className="font-bold text-neutral-900 tabular-nums">
                      {formatPricePersian(Number(monthlyRent) || 0)}
                    </span>
                  </div>
                  <input
                    type="number"
                    value={monthlyRent}
                    onChange={(e) => setMonthlyRent(e.target.value)}
                    className="w-full p-2.5 bg-white border border-neutral-200 rounded-lg outline-none"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Specifications Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
            <div>
              <span className="block text-neutral-600 mb-1">متراژ (متر)</span>
              <input
                type="number"
                value={meterage}
                onChange={(e) => setMeterage(e.target.value)}
                className="w-full p-2 bg-neutral-50 border border-neutral-200 rounded-lg"
                required
              />
            </div>
            <div>
              <span className="block text-neutral-600 mb-1">تعداد اتاق</span>
              <input
                type="number"
                value={rooms}
                onChange={(e) => setRooms(e.target.value)}
                className="w-full p-2 bg-neutral-50 border border-neutral-200 rounded-lg"
                required
              />
            </div>
            <div>
              <span className="block text-neutral-600 mb-1">طبقه</span>
              <input
                type="number"
                value={floor}
                onChange={(e) => setFloor(e.target.value)}
                className="w-full p-2 bg-neutral-50 border border-neutral-200 rounded-lg"
                required
              />
            </div>
            <div>
              <span className="block text-neutral-600 mb-1">کل طبقات</span>
              <input
                type="number"
                value={totalFloors}
                onChange={(e) => setTotalFloors(e.target.value)}
                className="w-full p-2 bg-neutral-50 border border-neutral-200 rounded-lg"
                required
              />
            </div>
            <div>
              <span className="block text-neutral-600 mb-1">سال ساخت</span>
              <input
                type="number"
                value={yearBuilt}
                onChange={(e) => setYearBuilt(e.target.value)}
                className="w-full p-2 bg-neutral-50 border border-neutral-200 rounded-lg"
                required
              />
            </div>
          </div>

          {/* Amenities */}
          <div>
            <label className="block font-bold text-neutral-900 mb-2">
              امکانات موجود در ملک
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {ALL_AMENITIES.map((am) => {
                const isSelected = selectedAmenities.includes(am);
                return (
                  <button
                    type="button"
                    key={am}
                    onClick={() => toggleAmenity(am)}
                    className={`p-2 rounded-lg border text-right transition-colors flex items-center justify-between ${
                      isSelected
                        ? 'bg-amber-50 text-amber-950 border-amber-300 font-semibold'
                        : 'bg-neutral-50 text-neutral-600 border-neutral-200'
                    }`}
                  >
                    <span>{am}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-amber-600" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Virtual Tour & Photos */}
          <div className="p-4 bg-amber-50/50 rounded-xl border border-amber-200 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-amber-950">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>فعال‌سازی تور مجازی ۳۶۰ درجه هوشمند</span>
              </div>
              <input
                type="checkbox"
                checked={hasVirtualTour}
                onChange={(e) => setHasVirtualTour(e.target.checked)}
                className="w-4 h-4 accent-amber-600 cursor-pointer"
              />
            </div>
            <p className="text-[11px] text-neutral-600">
              با فعال‌سازی تور مجازی، متقاضیان می‌توانند در هر ساعت از شبانه‌روز در اتاق‌ها و سالن ملک شما قدم بزنند.
            </p>
          </div>

          {/* Description */}
          <div>
            <label className="block font-bold text-neutral-900 mb-1">
              توضیحات تکمیلی آگهی
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="نکات مهم، وضعیت سند، نورگیری، همسایگان، تخفیف و ساعت تماس..."
              className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg outline-none focus:border-neutral-900"
            />
          </div>

          {/* Submit Action */}
          <div className="flex items-center justify-between pt-3 border-t border-neutral-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-neutral-600 hover:text-neutral-900"
            >
              انصراف
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl font-bold transition-colors shadow-sm flex items-center gap-2"
            >
              <Check className="w-4 h-4 text-amber-400" />
              <span>انتشار و نمایش در نقشه املاک</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
