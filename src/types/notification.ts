export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'price_drop' | 'new_listing' | 'chat_message' | 'listing_status' | 'system';
  propertyId?: string;
  timestamp: string;
  isRead: boolean;
  actionUrl?: string;
  meta?: {
    oldPrice?: number;
    newPrice?: number;
    dropPercent?: number;
  };
}

export interface UserProfile {
  id: string;
  name: string;
  phone: string;
  email: string;
  avatar: string;
  role: 'user' | 'owner' | 'advisor';
  trustScore: number; // e.g. 96%
  verifiedIdentity: boolean;
  memberSince: string;
  savedSearches: Array<{
    id: string;
    title: string;
    filters: Record<string, unknown>;
    createdAt: string;
  }>;
  favoritePropertyIds: string[];
}
