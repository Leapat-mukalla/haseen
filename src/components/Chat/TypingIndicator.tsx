'use client';

export function TypingIndicator() {
  return (
    <div className="flex w-full gap-2 py-4 justify-end">
      <div className="flex flex-col gap-1">
        <div className="rounded-lg px-4 py-3 bg-gray-100 dark:bg-gray-800">
          <div className="flex gap-1 items-center">
            <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        </div>
        <span className="text-xs opacity-50 px-2 text-left">
          {new Date().toLocaleTimeString('ar-SA', {
            hour: '2-digit',
            minute: '2-digit'
          })}
        </span>
      </div>
    </div>
  );
}
