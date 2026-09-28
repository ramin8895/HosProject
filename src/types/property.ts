export type PropertyType = 'apartment' | 'villa' | 'office' | 'penthouse' | 'land';
export type DealType = 'buy' | 'rent';

export interface VirtualHotspot {
  label: string;
  targetRoomId: string;
  pitch: number; // vertical angle -90 to 90
  yaw: number; // horizontal angle 0 to 360
}

export interface VirtualTourRoom {
  id: string;
  name: string;
  image: string;
  description: string;
  hotspots?: VirtualHotspot[];
}

export interface PropertyReview {
  id: string;
  userName: string;
  userAvatar?: string;
  rating: number; // 1 to 5
  comment: string;
  date: string;
  verifiedBuyer?: boolean;
}

export interface AdvisorInfo {
  id: string;
  name: string;
  phone: string;
  agency: string;
  avatar: string;
  rating: number;
  reviewCount: number;
  verified: boolean;
  dealsCount: number;
}

export interface PriceHistoryItem {
  date: string;
  price: number; // In Toman (total price or deposit)
  monthlyRent?: number;
  note?: string;
}

export interface Property {
  id: string;
  title: string;
  description: string;
  type: PropertyType;
  dealType: DealType;
  // Sale
  price: number; // Total price in Toman
  pricePerMeter?: number;
  // Rent
  deposit?: number; // ودیعه / رهن in Toman
  monthlyRent?: number; // اجاره ماهیانه in Toman
  
  meterage: number; // متراژ متر مربع
  rooms: number; // تعداد اتاق خواب
  bathrooms: number;
  floor: number;
  totalFloors: number;
  yearBuilt: number; // e.g. 1402
  
  address: string;
  neighborhood: string;
  city: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  
  images: string[];
  hasVirtualTour: boolean;
  virtualTourRooms?: VirtualTourRoom[];
  
  amenities: string[];
  documentType: 'تک‌برگ ملکی' | 'وکالتی' | 'قولنامه‌ای با کد رهگیری' | 'اوقافی';
  direction: 'شمالی' | 'جنوبی' | 'دوکله' | 'شرقی-غربی';
  
  advisor: AdvisorInfo;
  ownerId: string;
  ownerName: string;
  createdAt: string;
  updatedAt: string;
  viewsCount: number;
  likesCount: number;
  isFeatured?: boolean;
  isVerified?: boolean;
  
  priceHistory: PriceHistoryItem[];
  ratings: PropertyReview[];
  status: 'active' | 'reserved' | 'sold' | 'rented';
  
  nearbyPlaces?: {
    metro?: string;
    shopping?: string;
    park?: string;
    hospital?: string;
  };
}

export interface PropertyFilterState {
  searchQuery: string;
  dealType: 'all' | 'buy' | 'rent';
  propertyType: 'all' | PropertyType;
  minPrice: number;
  maxPrice: number;
  minMeterage: number;
  maxMeterage: number;
  rooms: number | 'all';
  hasVirtualTour: boolean;
  amenities: string[];
  neighborhood: string;
  sortBy: 'newest' | 'priceAsc' | 'priceDesc' | 'meterageDesc' | 'popular';
}
