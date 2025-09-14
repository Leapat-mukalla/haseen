"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { links } from "@/lib/constants";
import useScroll from "@/hooks/use-scroll";

export function HeaderMobile() {
  const { y } = useScroll();
  const scrolled = y > 80;

  return (
    <div className="container flex justify-between gap-4 bg-transparent">
      <Image
        src="/leapat-white.png"
        width={100}
        height={60}
        alt="Leapat Logo"
        className={cn("h-12 w-auto", scrolled && "invert")}
      />
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "rounded-full text-white",
              scrolled && "text-[#171717]"
            )}
          >
            <MenuIcon className="h-6 w-6" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-[300px] sm:w-[400px]">
          <SheetHeader className="border-b pb-4 mb-4">
            <SheetTitle className="text-right">القائمة</SheetTitle>
          </SheetHeader>
          <div className="grid gap-4">
            {links.map((link, index) => {
              return (
                <Link
                  key={index}
                  href={link.url}
                  className="flex items-center gap-3 rounded-md px-3 py-2 text-lg font-medium text-foreground hover:bg-muted/50 text-right"
                  prefetch={false}
                >
                  {link.title}
                </Link>
              );
            })}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

function MenuIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="4" x2="20" y1="12" y2="12" />
      <line x1="4" x2="20" y1="6" y2="6" />
      <line x1="4" x2="20" y1="18" y2="18" />
    </svg>
  );
}
