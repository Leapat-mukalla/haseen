// Google Analytics event tracking utility

declare global {
  interface Window {
    gtag: (
      command: "config" | "event",
      targetId: string,
      config?: Record<string, string | number | boolean>
    ) => void;
  }
}

// Event categories for Haseen
export const GA_EVENTS = {
  // Form submission events
  HASEEN_FORM_SUBMIT: "haseen_form_submit",
  HASEEN_FORM_SUCCESS: "haseen_form_success",
  HASEEN_FORM_ERROR: "haseen_form_error",

  // Chat events
  CHAT_OPEN: "chat_open",
  CHAT_MESSAGE_SEND: "chat_message_send",
  CHAT_QUESTION_SELECT: "chat_question_select",

  // Blog events
  BLOG_VIEW: "blog_view",
  BLOG_READ_TIME: "blog_read_time",

  // User engagement
  PAGE_VIEW: "page_view",
  USER_ENGAGEMENT: "user_engagement",
} as const;

// Track a custom event
export const trackEvent = (
  action: string,
  category: string,
  label?: string,
  value?: number,
  customParameters?: Record<string, string | number | boolean>
): void => {
  if (typeof window !== "undefined" && window.gtag) {
    const eventParams: Record<string, string | number | boolean> = {
      event_category: category,
      ...(label && { event_label: label }),
      ...(value !== undefined && { value }),
      ...customParameters,
    };
    window.gtag("event", action, eventParams);
  }
};

// Specific tracking functions for Haseen

export const trackHaseenFormSubmit = (email: string): void => {
  trackEvent(
    GA_EVENTS.HASEEN_FORM_SUBMIT,
    "form",
    "haseen_breach_check",
    undefined,
    {
      email_domain: email.split("@")[1] || "unknown",
      custom_event_type: "security_check",
    }
  );
};

export const trackHaseenFormSuccess = (
  breachCount: number,
  email: string
): void => {
  trackEvent(
    GA_EVENTS.HASEEN_FORM_SUCCESS,
    "form",
    "haseen_result_success",
    breachCount,
    {
      email_domain: email.split("@")[1] || "unknown",
      breach_count: breachCount,
      result_type: breachCount > 0 ? "breaches_found" : "clean",
    }
  );
};

export const trackHaseenFormError = (error: string, email: string): void => {
  trackEvent(
    GA_EVENTS.HASEEN_FORM_ERROR,
    "form",
    "haseen_result_error",
    undefined,
    {
      email_domain: email.split("@")[1] || "unknown",
      error_type: error.includes("شبكة") ? "network_error" : "validation_error",
      error_message: error.substring(0, 100), // Limit error message length
    }
  );
};

export const trackChatOpen = (): void => {
  trackEvent(GA_EVENTS.CHAT_OPEN, "engagement", "chat_opened");
};

export const trackChatMessage = (
  messageLength: number,
  isPrefilledQuestion: boolean
): void => {
  trackEvent(
    GA_EVENTS.CHAT_MESSAGE_SEND,
    "engagement",
    "chat_message",
    messageLength,
    {
      message_type: isPrefilledQuestion ? "prefilled" : "custom",
      message_length: messageLength,
    }
  );
};

export const trackChatQuestionSelect = (question: string): void => {
  trackEvent(
    GA_EVENTS.CHAT_QUESTION_SELECT,
    "engagement",
    "prefilled_question",
    undefined,
    {
      question_category: question.includes("حماية")
        ? "protection"
        : question.includes("تصيد")
        ? "phishing"
        : question.includes("اختراق")
        ? "breach"
        : question.includes("بيانات")
        ? "data_protection"
        : "other",
      question_text: question.substring(0, 50), // First 50 chars for analysis
    }
  );
};

export const trackBlogView = (
  blogTitle: string,
  category: string,
  readingTime?: number
): void => {
  trackEvent(GA_EVENTS.BLOG_VIEW, "content", "blog_post", undefined, {
    blog_title: blogTitle.substring(0, 100),
    blog_category: category,
    ...(readingTime && { estimated_reading_time: readingTime }),
    content_type: "blog_post",
  });
};

export const trackBlogReadTime = (
  blogTitle: string,
  timeSpent: number
): void => {
  trackEvent(
    GA_EVENTS.BLOG_READ_TIME,
    "engagement",
    "blog_reading",
    timeSpent,
    {
      blog_title: blogTitle.substring(0, 100),
      time_spent_seconds: timeSpent,
      engagement_level:
        timeSpent < 30 ? "low" : timeSpent < 120 ? "medium" : "high",
    }
  );
};

// Page view tracking
export const trackPageView = (pagePath: string, pageTitle: string): void => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("config", process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID!, {
      page_path: pagePath,
      page_title: pageTitle,
    });
  }
};
