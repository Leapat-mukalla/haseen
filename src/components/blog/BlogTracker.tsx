"use client";

import { useEffect } from "react";
import { trackBlogView, trackBlogReadTime } from "@/lib/analytics";

interface BlogTrackerProps {
  blogTitle: string;
  category?: string;
  readingTime?: number;
}

export function BlogTracker({
  blogTitle,
  category = "security",
  readingTime,
}: BlogTrackerProps) {
  useEffect(() => {
    // Track blog view on component mount
    trackBlogView(blogTitle, category, readingTime);

    // Track reading time
    const startTime = Date.now();

    const handleBeforeUnload = () => {
      const timeSpent = Math.floor((Date.now() - startTime) / 1000);
      if (timeSpent > 5) {
        // Only track if user spent more than 5 seconds
        trackBlogReadTime(blogTitle, timeSpent);
      }
    };

    // Track reading time when user leaves the page
    window.addEventListener("beforeunload", handleBeforeUnload);

    // Track reading time on visibility change (when user switches tabs)
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        const timeSpent = Math.floor((Date.now() - startTime) / 1000);
        if (timeSpent > 5) {
          trackBlogReadTime(blogTitle, timeSpent);
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      document.removeEventListener("visibilitychange", handleVisibilityChange);

      // Final tracking on component unmount
      const timeSpent = Math.floor((Date.now() - startTime) / 1000);
      if (timeSpent > 5) {
        trackBlogReadTime(blogTitle, timeSpent);
      }
    };
  }, [blogTitle, category, readingTime]);

  return null; // This component doesn't render anything
}
