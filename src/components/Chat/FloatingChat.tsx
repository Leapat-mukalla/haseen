'use client';

import { Bot, MessageCircle } from "lucide-react";
import { useEffect, useRef, useState } from 'react';

import { ChatContainer } from "@/components/Chat/ChatContainer";
import { RippleIcon } from "@/components/RippleIcon";
import { trackChatOpen, trackChatQuestionSelect } from "@/lib/analytics";

const prefilledQuestions = [
  "ما هي أفضل الطرق لحماية حساباتي على الإنترنت؟",
  "كيف أتعامل مع رسالة بريد إلكتروني مشبوهة؟",
  "ما معنى التصيد الإلكتروني؟",
  "ماذا أفعل إذا تم اختراق حسابي؟",
  "كيف أحمي بياناتي الشخصية على الهاتف؟",
];

export function FloatingChat() {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [prefill, setPrefill] = useState<string | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [showTooltip, setShowTooltip] = useState(false);
  const chatPanelRef = useRef<HTMLDivElement>(null);

  // Handle mounting and tooltip effect
  useEffect(() => {
    setMounted(true);

    if (typeof window !== "undefined") {
      // Handle tooltip timing
      const showTimer = setTimeout(() => {
        setShowTooltip(true);
      }, 3000);

      const hideTimer = setTimeout(() => {
        setShowTooltip(false);
      }, 8000); // 3s delay + 5s display = 8s total

      return () => {
        clearTimeout(showTimer);
        clearTimeout(hideTimer);
      };
    }
  }, []);

  const handlePrefill = (question: string) => {
    setOpen(true);
    setPrefill(question);
    setShowSuggestions(false);

    // Track prefilled question selection
    trackChatQuestionSelect(question);

    setTimeout(() => {
      const textarea = chatPanelRef.current?.querySelector(
        "textarea"
      ) as HTMLTextAreaElement | null;
      if (textarea) {
        textarea.value = question;
        textarea.focus();
        textarea.dispatchEvent(new Event("input", { bubbles: true }));
      }
    }, 100);
  };

  if (!mounted) return null;

  return (
    <>
      {/* Floating Button */}
      <div className="fixed bottom-6 right-6 z-50 flex  items-center gap-3">
        <button
          className="hover:bg-custom-gradient cursor-pointer  text-white rounded-full p-2 shadow-lg transition-colors relative z-20 group"
          onClick={() => {
            const newOpenState = !open;
            setOpen(newOpenState);
            // Track chat opening
            if (newOpenState) {
              trackChatOpen();
            }
          }}
          aria-label="Open chat"
        >
          <RippleIcon
            icon={Bot}
            hoverIcon={MessageCircle}
            size={28}
            tooltip="تحدث مع خبير الأمن السيبراني"
            tooltipPosition="left"
          />
        </button>
        {showTooltip && (
          <div className="max-w-[75vw] sm:max-w-xs md:max-w-sm whitespace-normal break-words px-4 py-2 rounded-3xl rounded-tr-none rounded-br-none shadow-lg animate-fade-in bg-blue-50 text-primary mr-[-30px] relative z-10">
            <div className="pr-4 text-sm sm:text-base leading-snug">
              مرحباً 👋🏻 أنا هنا لمساعدتك، تفضل بطرح سؤالك
            </div>
          </div>
        )}
      </div>

      {/* Chat Panel */}
      {open && (
        <div
          ref={chatPanelRef}
          className="floating-chat fixed bottom-24 right-6 z-50 w-80 max-w-full bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 flex flex-col animate-fade-in overflow-hidden"
          style={{ height: "min(520px, 80vh)" }}
        >
          <div className="flex items-center justify-between p-3 border-b dark:border-gray-800">
            <span className="font-semibold text-base">
              خبير الأمن السيبراني
            </span>
            <button
              onClick={() => setOpen(false)}
              className="text-gray-400 hover:text-gray-700 dark:hover:text-white text-xl"
            >
              ×
            </button>
          </div>
          {/* Suggestions overlay */}
          {showSuggestions && (
            <div className="absolute inset-0 bg-white dark:bg-gray-900 flex flex-col justify-center items-center z-30 p-4">
              <div className="w-full flex flex-col gap-4 justify-center h-full">
                <div>
                  <div className="text-xs text-gray-500 mb-2 text-right">
                    أسئلة مقترحة:
                  </div>
                  <div className="flex flex-col gap-2 w-full">
                    {prefilledQuestions.map((q) => (
                      <button
                        key={q}
                        type="button"
                        className="text-right bg-gray-100 dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-blue-900 rounded px-3 py-3 text-base transition-colors w-full border border-gray-200 dark:border-gray-700"
                        onClick={() => handlePrefill(q)}
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
                <form
                  className="mt-6 flex gap-2"
                  onSubmit={(e) => {
                    e.preventDefault();
                    const input = e.currentTarget.elements.namedItem(
                      "customInput"
                    ) as HTMLInputElement;
                    const value = input.value.trim();
                    if (value) {
                      handlePrefill(value);
                      setShowSuggestions(false);
                    }
                  }}
                >
                  <input
                    name="customInput"
                    type="text"
                    className="flex-1 rounded-lg border p-2 dark:bg-gray-800 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-right pr-4"
                    placeholder="أو اكتب سؤالك هنا..."
                    dir="rtl"
                    onFocus={() => setShowSuggestions(false)}
                  />
                  <button
                    type="submit"
                    className="p-2 bg-blue-600 text-white h-12 w-12 rounded-lg flex justify-center items-center hover:bg-blue-700 transition-colors"
                  >
                    <span className="sr-only">إرسال</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5 rotate-180"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75"
                      />
                    </svg>
                  </button>
                </form>
              </div>
            </div>
          )}
          {/* Chat area with input always visible at the bottom */}
          <div className="flex flex-col flex-1 min-h-0">
            <div className="flex-1 min-h-0 overflow-y-auto">
              <ChatContainer key={prefill || "default"} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
