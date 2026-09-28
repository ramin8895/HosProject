import React, { useState, useEffect, useRef } from 'react';
import { Property } from '../types/property';
import { ChatConversation, ChatMessage } from '../types/chat';
import { toPersianDigits, formatPricePersian } from '../utils/formatters';
import { X, Send, Phone, Calendar, DollarSign, Check, CheckCheck, ShieldCheck, Home } from 'lucide-react';

interface InternalChatModalProps {
  property: Property | null;
  conversation: ChatConversation | null;
  onClose: () => void;
  onSendMessage: (conversationId: string, text: string, type?: 'text' | 'offer' | 'visit_request', meta?: any) => void;
  onViewProperty?: (propertyId: string) => void;
}

export const InternalChatModal: React.FC<InternalChatModalProps> = ({
  property,
  conversation,
  onClose,
  onSendMessage,
  onViewProperty,
}) => {
  const [inputText, setInputText] = useState('');
  const [isOfferMode, setIsOfferMode] = useState(false);
  const [proposedPrice, setProposedPrice] = useState<string>('');
  const [isVisitMode, setIsVisitMode] = useState(false);
  const [visitDate, setVisitDate] = useState('فردا عصر ساعت ۱۷');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeMessages = conversation?.messages || [];

  // Scroll to bottom on message updates
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeMessages]);

  const handleSendText = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || !conversation) return;

    onSendMessage(conversation.id, inputText.trim(), 'text');
    setInputText('');
  };

  const handleQuickQuestion = (question: string) => {
    if (!conversation) return;
    onSendMessage(conversation.id, question, 'text');
  };

  const handleSendOffer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!proposedPrice || !conversation) return;
    const numPrice = Number(proposedPrice.replace(/[^0-9]/g, ''));
    if (!numPrice) return;

    onSendMessage(
      conversation.id,
      `پیشنهاد قیمت جدید: ${formatPricePersian(numPrice)}`,
      'offer',
      { proposedPrice: numPrice }
    );
    setIsOfferMode(false);
    setProposedPrice('');
  };

  const handleSendVisitRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!conversation) return;

    onSendMessage(
      conversation.id,
      `درخواست هماهنگی بازدید حضوری: برای ${visitDate}`,
      'visit_request',
      { visitDate }
    );
    setIsVisitMode(false);
  };

  if (!conversation) return null;

  return (
    <div className="fixed inset-0 z-60 bg-neutral-950/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      <div
        className="w-full max-w-xl h-[620px] max-h-[92vh] bg-white rounded-2xl shadow-2xl border border-neutral-200 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Chat Header */}
        <div className="px-4 py-3 bg-neutral-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={conversation.advisorAvatar}
                alt={conversation.advisorName}
                className="w-10 h-10 rounded-full object-cover border border-neutral-700"
              />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 absolute bottom-0 left-0 ring-2 ring-neutral-900" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-xs font-bold text-white">
                  {conversation.advisorName}
                </h3>
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <span className="text-[11px] text-neutral-400 block">
                {conversation.advisorAgency} · آنلاین
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-1.5 text-neutral-400 hover:text-white rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Pinned Property Banner */}
        <div className="px-4 py-2.5 bg-neutral-50 border-b border-neutral-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <img
              src={conversation.propertyImage}
              alt=""
              className="w-10 h-10 rounded-lg object-cover shrink-0"
            />
            <div className="min-w-0">
              <h4 className="text-xs font-semibold text-neutral-900 truncate">
                {conversation.propertyTitle}
              </h4>
              <span className="text-[11px] font-bold text-amber-800 tabular-nums">
                {conversation.propertyPrice}
              </span>
            </div>
          </div>

          {onViewProperty && (
            <button
              onClick={() => onViewProperty(conversation.propertyId)}
              className="text-xs text-neutral-600 hover:text-neutral-900 underline whitespace-nowrap mr-2"
            >
              مشاهده مشخصات
            </button>
          )}
        </div>

        {/* Quick Context Action Bar */}
        <div className="px-4 py-2 bg-neutral-100/60 border-b border-neutral-200 flex items-center gap-1.5 overflow-x-auto text-[11px] shrink-0">
          <button
            onClick={() => handleQuickQuestion('آیا امکان بازدید حضوری برای فردا عصر وجود دارد؟')}
            className="px-2.5 py-1 rounded bg-white hover:bg-neutral-50 text-neutral-700 border border-neutral-200 whitespace-nowrap transition-colors"
          >
            درخواست زمان بازدید
          </button>
          <button
            onClick={() => handleQuickQuestion('سلام، آیا سند تک‌برگ آماده انتقال قطعی در محضر است؟')}
            className="px-2.5 py-1 rounded bg-white hover:bg-neutral-50 text-neutral-700 border border-neutral-200 whitespace-nowrap transition-colors"
          >
            استعلام وضعیت سند
          </button>
          <button
            onClick={() => setIsOfferMode(!isOfferMode)}
            className="px-2.5 py-1 rounded bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 whitespace-nowrap transition-colors flex items-center gap-1"
          >
            <DollarSign className="w-3 h-3 text-amber-700" />
            <span>ثبت پیشنهاد قیمت</span>
          </button>
        </div>

        {/* Offer Input Box (if active) */}
        {isOfferMode && (
          <form
            onSubmit={handleSendOffer}
            className="p-3 bg-amber-50/80 border-b border-amber-200 flex items-center gap-2 shrink-0 text-xs"
          >
            <span className="text-neutral-700 font-medium whitespace-nowrap">مبلغ پیشنهادی (تومان):</span>
            <input
              type="number"
              value={proposedPrice}
              onChange={(e) => setProposedPrice(e.target.value)}
              placeholder="مثلاً ۲۴۰۰۰۰۰۰۰۰۰"
              className="flex-1 p-2 bg-white border border-amber-300 rounded-lg text-xs outline-none"
              required
            />
            <button
              type="submit"
              className="px-3 py-2 bg-neutral-900 text-white rounded-lg text-xs font-semibold whitespace-nowrap"
            >
              ارسال پیشنهاد
            </button>
            <button
              type="button"
              onClick={() => setIsOfferMode(false)}
              className="p-2 text-neutral-500 hover:text-neutral-800"
            >
              <X className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* Messages Scroll Area */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-neutral-50/40">
          <div className="text-center my-2">
            <span className="text-[10px] text-neutral-400 bg-neutral-100 px-3 py-1 rounded-full">
              گفتگوی امن جهت ارتباط مستقیم با مشاور ملک
            </span>
          </div>

          {activeMessages.map((msg) => {
            const isMe = msg.senderRole === 'buyer';
            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed shadow-xs ${
                    isMe
                      ? 'bg-neutral-900 text-white rounded-bl-xs'
                      : 'bg-white text-neutral-800 border border-neutral-200 rounded-br-xs'
                  }`}
                >
                  {msg.type === 'offer' && (
                    <div className="flex items-center gap-1.5 text-amber-400 font-bold mb-1 pb-1 border-b border-white/20">
                      <DollarSign className="w-3.5 h-3.5" />
                      <span>پیشنهاد رسمی قیمت</span>
                    </div>
                  )}
                  {msg.type === 'visit_request' && (
                    <div className="flex items-center gap-1.5 text-amber-400 font-bold mb-1 pb-1 border-b border-white/20">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>درخواست بازدید حضوری</span>
                    </div>
                  )}
                  <p>{msg.text}</p>
                </div>
                <div className="flex items-center gap-1 text-[10px] text-neutral-400 mt-1 px-1">
                  <span>{msg.timestamp}</span>
                  {isMe && <CheckCheck className="w-3 h-3 text-neutral-400" />}
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <form
          onSubmit={handleSendText}
          className="p-3 bg-white border-t border-neutral-200 flex items-center gap-2 shrink-0"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="پیام خود را برای مشاور بنویسید..."
            className="flex-1 px-4 py-2.5 bg-neutral-50 hover:bg-neutral-100/70 focus:bg-white border border-neutral-200 rounded-xl text-xs outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 transition-all"
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="p-2.5 bg-neutral-900 hover:bg-neutral-800 disabled:opacity-40 text-white rounded-xl transition-colors shadow-sm"
          >
            <Send className="w-4 h-4 rotate-180" />
          </button>
        </form>
      </div>
    </div>
  );
};
