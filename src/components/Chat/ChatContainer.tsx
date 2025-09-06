'use client';

import { useEffect, useRef, useState } from 'react';
const SUGGESTED_QUESTIONS = [
  'ما هي أفضل الطرق لحماية حساباتي على الإنترنت؟',
  'كيف أتعامل مع رسالة بريد إلكتروني مشبوهة؟',
  'ما معنى التصيد الإلكتروني؟',
  'ماذا أفعل إذا تم اختراق حسابي؟',
  'كيف أحمي بياناتي الشخصية على الهاتف؟',
];
import { useChatStore } from '@/store/chatStore';
import { ChatMessage } from './ChatMessage';
import { TypingIndicator } from './TypingIndicator';
import { ErrorMessage } from './ErrorMessage';
import { PaperAirplaneIcon } from '@heroicons/react/24/solid';

export function ChatContainer() {
  const { currentSession, sendMessage, createNewSession, isLoading, error, hydrateFromStorage, hasHydrated } = useChatStore();
  const [lastMessage, setLastMessage] = useState<string>();
  const [inputLength, setInputLength] = useState(0);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  // Hydrate persisted sessions on client after mount
  useEffect(() => {
    hydrateFromStorage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentSession?.messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const inputElement = inputRef.current;
    const content = inputElement?.value.trim();
    if (!content || isLoading) return;

    setLastMessage(content);
    if (inputElement) {
      inputElement.value = '';
    }
    setInputLength(0);
    setShowSuggestions(true);
    await sendMessage(content);
  };

  const handleRetry = async () => {
    if (lastMessage) {
      await sendMessage(lastMessage);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="flex flex-1 flex-col h-full bg-white dark:bg-gray-900 relative">
      {/* Header */}
      <div className="flex justify-between items-center p-4 dark:border-gray-800"></div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4" dir="rtl">
        {(hasHydrated ? currentSession?.messages : [])?.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
        {isLoading && <TypingIndicator />}
        {error && <ErrorMessage message={error} onRetry={handleRetry} />}
        <div ref={chatEndRef} />
      </div>

      {/* Input Form */}
      <form
        onSubmit={handleSubmit}
        className="p-4 border-t dark:border-gray-800 bg-inherit"
      >
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              placeholder="اسأل عن الأمن السيبراني، تسرب البيانات   ..."
              className="w-full resize-none rounded-lg border p-2 dark:bg-gray-800 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-right pr-4"
              rows={1}
              maxLength={1000}
              onKeyDown={handleKeyDown}
              onFocus={() => setShowSuggestions(false)}
              onChange={(e) => {
                const textarea = e.target;
                textarea.style.height = "auto";
                textarea.style.height =
                  Math.min(textarea.scrollHeight, 200) + "px";
                setInputLength(textarea.value.length);
                if (textarea.value.length > 0) setShowSuggestions(false);
              }}
              dir="rtl"
            />
            <span className="absolute bottom-2 left-2 text-xs text-gray-400 dark:text-gray-500">
              {inputLength}/1000
            </span>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="p-2 bg-blue-600 text-white rounded-lg size-11 flex justify-center items-center hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            <PaperAirplaneIcon className="w-5 h-5 rotate-180" />
          </button>
        </div>
      </form>
    </div>
  );
}
