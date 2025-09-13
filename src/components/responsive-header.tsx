"use client";

import { HeaderDesktop } from "./header-desktop";
import { HeaderMobile } from "./header-mobile";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import useScroll from "@/hooks/use-scroll";
import useWidth from "@/hooks/use-width";

export function ResponsiveHeader() {
  const width = useWidth();
  const { y } = useScroll();

  const isDesktop = width >= 768;
  const scrolled = y > 80;

  return (
    <div
      className={cn("fixed top-24 z-20 w-full", {
        "top-0 bg-white/60 py-4 backdrop-blur-[15px]": scrolled,
      })}
    >
      <div className="container mx-auto px-4">
        {isDesktop ? (
          <div className="flex items-center justify-center w-full">
            <HeaderDesktop />
          </div>
        ) : (
          <HeaderMobile />
        )}
      </div>
    </div>
  );
}
