import React from 'react';
import Image from 'next/image';
import Link from "next/link";

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-md border-b border-white/10">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-center gap-4">
          {/* Leapat Logo */}
          <a
            href="https://leapat.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              src="/leapat-white.png"
              width={120}
              height={30}
              alt="Leapat Logo"
              className="h-8 w-auto"
            />
          </a>

          {/* Separator */}
          <div className="h-8 w-px bg-white/30"></div>

          {/* Shield Icon and Haseen Name */}
          <Link href="/" className="flex items-center gap-3">
            <div className="flex items-center gap-3">
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-white"
              >
                <path
                  d="M12 2L3 7V11C3 16.55 6.84 21.74 12 23C17.16 21.74 21 16.55 21 11V7L12 2Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="currentColor"
                  fillOpacity="0.1"
                />
                <path
                  d="M9 12L11 14L15 10"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <h1 className="text-2xl font-bold text-white">حصين</h1>
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
}
