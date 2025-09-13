'use client';
import { useEffect } from "react";
import { FloatingChat } from "@/components/Chat/FloatingChat";
import { initPostHog } from "@/lib/posthog";

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    initPostHog();
  }, []);

  return (
    <>
      {children}
      <FloatingChat />
    </>
  );
}
