export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: 'buyer' | 'advisor' | 'owner';
  text: string;
  timestamp: string;
  isRead: boolean;
  type?: 'text' | 'offer' | 'visit_request';
  offerDetails?: {
    proposedPrice?: number;
    visitDate?: string;
  };
}

export interface ChatConversation {
  id: string;
  propertyId: string;
  propertyTitle: string;
  propertyPrice: string;
  propertyImage: string;
  advisorId: string;
  advisorName: string;
  advisorAvatar: string;
  advisorAgency: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  messages: ChatMessage[];
}
