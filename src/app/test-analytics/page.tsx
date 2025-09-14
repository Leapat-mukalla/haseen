"use client";

import { useEffect } from "react";
import { trackEvent, trackPageView } from "@/lib/analytics";

export default function TestAnalytics() {
  useEffect(() => {
    // Test page view tracking
    trackPageView("/test-analytics", "Test Analytics Page");

    // Test custom event
    trackEvent("test_event", "test_category", "test_label", 1);
  }, []);

  const handleTestEvent = () => {
    trackEvent("manual_test", "button_click", "test_button_clicked");
    alert("Test event sent! Check your browser console for gtag calls.");
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Google Analytics Test Page</h1>
      <p className="mb-4">
        This page tests Google Analytics integration. Open browser dev tools to
        see gtag calls.
      </p>
      <button
        onClick={handleTestEvent}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Send Test Event
      </button>

      <div className="mt-8 p-4 bg-gray-100 rounded">
        <h2 className="font-bold mb-2">Analytics Features Implemented:</h2>
        <ul className="list-disc list-inside space-y-1">
          <li>✅ Google Analytics basic setup</li>
          <li>✅ Haseen form submit tracking</li>
          <li>✅ Haseen form success/error tracking</li>
          <li>✅ Chat bot interaction tracking</li>
          <li>✅ Blog post view tracking</li>
          <li>✅ Blog reading time tracking</li>
          <li>✅ Custom event parameters for detailed analysis</li>
        </ul>
      </div>
    </div>
  );
}
