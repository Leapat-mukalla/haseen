'use client';

interface ErrorMessageProps {
  message: string;
  onRetry: () => void;
}

export function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  return (
    <div className="flex items-center justify-center p-4 bg-red-50 dark:bg-red-900/10 rounded-lg">
      <div className="flex flex-col items-center gap-2">
        <p className="text-red-600 dark:text-red-400 text-sm">{message}</p>
        <button
          onClick={onRetry}
          className="px-3 py-1 text-xs bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-full hover:bg-red-200 dark:hover:bg-red-900/30 transition-colors"
        >
          إعادة المحاولة
        </button>
      </div>
    </div>
  );
}
