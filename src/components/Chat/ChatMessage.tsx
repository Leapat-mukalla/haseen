'use client';

import { Message } from '@/store/chatStore';
import { cn } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';
import type { Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user';

  return (
    <div className={cn(
        "flex w-full gap-2 py-4",
        isUser ? "justify-start" : "justify-end"
      )}>
      <div className="flex flex-col gap-1">
        <div
          className={cn(
            'rounded-lg px-4 py-2 max-w-[80%]',
            isUser ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-800'
          )}
        >
        {isUser ? (
          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
        ) : (
          <div className="markdown-body text-sm">
            {(() => {
              const components: Components = {
                code: ({ className, children, ...props }) => {
                  const match = /language-(\w+)/.exec(className || '');
                  const isBlock = Boolean(match);
                  return isBlock ? (
                    <pre className="bg-gray-900 dark:bg-black rounded-md p-2 my-2 overflow-x-auto">
                      <code
                        className={cn(
                          "text-sm font-mono",
                          match ? `language-${match[1]}` : ''
                        )}
                        {...props}
                      >
                        {children}
                      </code>
                    </pre>
                  ) : (
                    <code className="bg-gray-200 dark:bg-gray-700 rounded px-1 py-0.5 font-mono text-sm" {...props}>
                      {children}
                    </code>
                  );
                },
                a: ({ children, href, ...props }) => (
                  <a
                    href={href}
                    className="text-blue-500 hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                    {...props}
                  >
                    {children}
                  </a>
                ),
                ul: ({ children, ...props }) => (
                  <ul className="list-disc list-inside my-2" {...props}>
                    {children}
                  </ul>
                ),
                ol: ({ children, ...props }) => (
                  <ol className="list-decimal list-inside my-2" {...props}>
                    {children}
                  </ol>
                ),
                h1: ({ children, ...props }) => (
                  <h1 className="text-xl font-bold my-3" {...props}>
                    {children}
                  </h1>
                ),
                h2: ({ children, ...props }) => (
                  <h2 className="text-lg font-bold my-2" {...props}>
                    {children}
                  </h2>
                ),
                h3: ({ children, ...props }) => (
                  <h3 className="text-base font-bold my-2" {...props}>
                    {children}
                  </h3>
                ),
                p: ({ children, ...props }) => (
                  <p className="my-2" {...props}>
                    {children}
                  </p>
                ),
                blockquote: ({ children, ...props }) => (
                  <blockquote
                    className="border-l-4 border-gray-300 dark:border-gray-600 pl-4 my-2 italic"
                    {...props}
                  >
                    {children}
                  </blockquote>
                ),
              };
              return (
                <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
                  {message.content}
                </ReactMarkdown>
              );
            })()}
          </div>
        )}
        </div>
        <span className={cn(
          "text-xs opacity-50 px-2",
          isUser ? "text-left" : "text-right"
        )}>
          {new Date(message.timestamp).toLocaleTimeString('ar-SA', {
            hour: '2-digit',
            minute: '2-digit'
          })}
        </span>
      </div>
    </div>
  );
}
